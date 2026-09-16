export function readingTimeMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
export function readingTimeLabel(html: string) {
  return `${readingTimeMinutes(html)} min read`;
}
