export function truncateText(text, maxLength) {
  if (!text || typeof text !== "string") {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  const truncatedLength = maxLength - 3; // Subtract 3 for the ellipsis
  return text.slice(0, truncatedLength) + "...";
}
