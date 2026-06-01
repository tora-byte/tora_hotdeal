export function calculateDiscount(originalPrice: number, salePrice: number) {
  const discountAmount = Math.max(originalPrice - salePrice, 0);
  const discountRate =
    originalPrice > 0 ? Math.floor((discountAmount / originalPrice) * 100) : 0;

  return {
    discountAmount,
    discountRate,
    isQualified: discountRate >= 50 || discountAmount >= 100000
  };
}

export function getMallName(url: string) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return hostname.split(".")[0] || "기타";
  } catch {
    return "기타";
  }
}
