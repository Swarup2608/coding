export function createSlug(
  text: string
): string {
    // Convert the text to lowercase, trim whitespace, replace non-alphanumeric characters with hyphens, and remove consecutive hyphens
    return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}