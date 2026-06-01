export function formatWon(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
