import { NextRequest, NextResponse } from "next/server";
import { getMallName } from "@/lib/deals";

type ProductPreview = {
  inputUrl: string;
  finalUrl: string;
  productId: string | null;
  mall: string;
  title: string | null;
  imageUrl: string | null;
  price: number | null;
  originalPrice: number | null;
  salePrice: number | null;
  discountRate: number | null;
};

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
      price: parsePrice(
        extractMeta(html, "product:price:amount") ??
          extractMeta(html, "og:price:amount") ??
          extractMeta(html, "twitter:data1")
      ),
      originalPrice: null,
      salePrice: null,
      discountRate: null
    } satisfies ProductPreview);
  } catch {
    return NextResponse.json({
      inputUrl: parsedUrl.toString(),
      finalUrl: parsedUrl.toString(),
      productId: null,
      mall: getMallName(parsedUrl.toString()),
      title: null,
      imageUrl: null,
      price: null,
      originalPrice: null,
      salePrice: null,
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

function parsePrice(value: string | null) {
  if (!value) {
    return null;
  }

  const numeric = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? Math.floor(numeric) : null;
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
