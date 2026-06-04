import { NextRequest, NextResponse } from "next/server";
import { getMallName } from "@/lib/deals";

type ProductPreview = {
  inputUrl: string;
  finalUrl: string;
  productId: string | null;
  mall: string;
  title: string | null;
  imageUrl: string | null;
  originalPrice: number | null;
  currentPrice: number | null;
  discountAmount: number | null;
  discountRate: number | null;
};

type PriceInfo = Pick<ProductPreview, "originalPrice" | "currentPrice" | "discountAmount" | "discountRate">;

type PriceCandidate = {
  key: string;
  value: number;
};

const priceKeys = [
  "price",
  "normalPrice",
  "salePrice",
  "originalPrice",
  "discountPrice",
  "couponPrice",
  "goodsPrice",
  "finalPrice",
  "discountedPrice"
];

const originalPriceKeys = ["normalPrice", "originalPrice"];
const currentPriceKeys = [
  "salePrice",
  "discountPrice",
  "couponPrice",
  "goodsPrice",
  "finalPrice",
  "discountedPrice",
  "price"
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: "unsupported protocol" }, { status: 400 });
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      redirect: "follow",
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36"
      }
    });

    const finalUrl = response.url || parsedUrl.toString();
    const html = await response.text();
    const finalUrlInfo = new URL(finalUrl);
    const productId = getMusinsaProductId(finalUrlInfo);

    return NextResponse.json({
      inputUrl: parsedUrl.toString(),
      finalUrl,
      productId,
      mall: productId ? "MUSINSA" : getMallName(finalUrl),
      title: cleanTitle(extractMeta(html, "og:title") ?? extractTitle(html)),
      imageUrl: resolveUrl(extractMeta(html, "og:image"), finalUrl),
      ...extractPriceInfo(html)
    } satisfies ProductPreview);
  } catch {
    return NextResponse.json({
      inputUrl: parsedUrl.toString(),
      finalUrl: parsedUrl.toString(),
      productId: null,
      mall: getMallName(parsedUrl.toString()),
      title: null,
      imageUrl: null,
      originalPrice: null,
      currentPrice: null,
      discountAmount: null,
      discountRate: null
    } satisfies ProductPreview);
  }
}

function getMusinsaProductId(url: URL) {
  const hostname = url.hostname.replace(/^www\./, "");

  if (hostname !== "musinsa.com" && !hostname.endsWith(".musinsa.com")) {
    return null;
  }

  const match = url.pathname.match(/^\/products\/([^/?#]+)/);
  return match?.[1] ?? null;
}

function extractPriceInfo(html: string): PriceInfo {
  const candidates: PriceCandidate[] = [];

  collectMetaPriceCandidates(html, candidates);
  collectJsonScriptPriceCandidates(html, candidates);
  collectTextPriceCandidates(html, candidates);

  return resolvePriceCandidates(candidates);
}

function collectMetaPriceCandidates(html: string, candidates: PriceCandidate[]) {
  const metaValues = [
    ["price", extractMeta(html, "product:price:amount")],
    ["price", extractMeta(html, "og:price:amount")],
    ["price", extractMeta(html, "twitter:data1")],
    ["normalPrice", extractMeta(html, "product:price:normal_price")]
  ] as const;

  metaValues.forEach(([key, value]) => {
    const price = parsePrice(value);
    if (price) {
      candidates.push({ key, value: price });
    }
  });
}

function collectJsonScriptPriceCandidates(html: string, candidates: PriceCandidate[]) {
  extractScripts(html).forEach((script) => {
    getJsonTexts(script).forEach((jsonText) => {
      try {
        collectPriceCandidatesFromValue(JSON.parse(jsonText), candidates);
      } catch {
        // Ignore script JSON parse failures.
      }
    });
  });
}

function collectTextPriceCandidates(html: string, candidates: PriceCandidate[]) {
  priceKeys.forEach((key) => {
    const pattern = new RegExp(
      `["']?${escapeRegExp(key)}["']?\\s*[:=]\\s*["']?([0-9][0-9,\\s원.]*)["']?`,
      "gi"
    );
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(html)) !== null) {
      const price = parsePrice(match[1]);
      if (price) {
        candidates.push({ key, value: price });
      }
    }
  });
}

function extractScripts(html: string) {
  return Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))
    .map((match) => decodeHtml(match[1].trim()))
    .filter(Boolean);
}

function getJsonTexts(script: string) {
  const trimmed = script.trim();
  const jsonTexts: string[] = [];

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    jsonTexts.push(trimmed);
  }

  Array.from(trimmed.matchAll(/JSON\.parse\((["'])([\s\S]*?)\1\)/g)).forEach((match) => {
    try {
      jsonTexts.push(JSON.parse(`"${match[2]}"`));
    } catch {
      // Ignore invalid escaped JSON strings.
    }
  });

  return jsonTexts;
}

function collectPriceCandidatesFromValue(value: unknown, candidates: PriceCandidate[]) {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectPriceCandidatesFromValue(item, candidates));
    return;
  }

  Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
    if (priceKeys.includes(key)) {
      const price = parsePrice(nestedValue);
      if (price) {
        candidates.push({ key, value: price });
      }
    }

    collectPriceCandidatesFromValue(nestedValue, candidates);
  });
}

function resolvePriceCandidates(candidates: PriceCandidate[]): PriceInfo {
  const originalPrices = candidates
    .filter((candidate) => originalPriceKeys.includes(candidate.key))
    .map((candidate) => candidate.value);
  const currentPrices = candidates
    .filter((candidate) => currentPriceKeys.includes(candidate.key))
    .map((candidate) => candidate.value);
  const allPrices = candidates.map((candidate) => candidate.value);

  let originalPrice = maxPrice(originalPrices);
  let currentPrice = minPrice(currentPrices);

  if (!originalPrice && allPrices.length >= 2) {
    originalPrice = maxPrice(allPrices);
  }

  if (!currentPrice && allPrices.length >= 1) {
    currentPrice = minPrice(allPrices);
  }

  if (originalPrice && currentPrice && originalPrice < currentPrice) {
    [originalPrice, currentPrice] = [currentPrice, originalPrice];
  }

  if (!originalPrice || !currentPrice) {
    return {
      originalPrice: originalPrice ?? null,
      currentPrice: currentPrice ?? null,
      discountAmount: null,
      discountRate: null
    };
  }

  const discountAmount = Math.max(originalPrice - currentPrice, 0);
  const discountRate = originalPrice > 0 ? Math.floor((discountAmount / originalPrice) * 100) : null;

  return {
    originalPrice,
    currentPrice,
    discountAmount,
    discountRate
  };
}

function maxPrice(values: number[]) {
  return values.length > 0 ? Math.max(...values) : null;
}

function minPrice(values: number[]) {
  return values.length > 0 ? Math.min(...values) : null;
}

function extractMeta(html: string, key: string) {
  const metaTag = new RegExp(
    `<meta\\s+[^>]*(?:property|name)=["']${escapeRegExp(key)}["'][^>]*>`,
    "i"
  ).exec(html)?.[0];

  if (!metaTag) {
    return null;
  }

  const content = /content=["']([^"']+)["']/i.exec(metaTag)?.[1];
  return content ? decodeHtml(content.trim()) : null;
}

function extractTitle(html: string) {
  const title = /<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1];
  return title ? decodeHtml(title.trim()) : null;
}

function cleanTitle(title: string | null) {
  if (!title) {
    return null;
  }

  return title
    .replace(/\s*[-|]\s*MUSINSA.*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveUrl(value: string | null, baseUrl: string) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
}

function parsePrice(value: unknown) {
  if (!value) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const numeric = Number(value.replace(/[,\s원]/g, "").replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? Math.floor(numeric) : null;
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
