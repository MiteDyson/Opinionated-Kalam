/**
 * Server-safe HTML sanitizer for API routes.
 * Strips dangerous tags/attributes without requiring jsdom.
 * 
 * This is used before saving content to DB.
 * DOMPurify is still used on the client-side at render time as a second layer.
 */
export function sanitizeHtml(html: string): string {
  return html
    // Remove <script> tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove <iframe> tags
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    // Remove <object> tags
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    // Remove <embed> tags
    .replace(/<embed\b[^>]*\/?>/gi, "")
    // Remove <form> tags
    .replace(/<form\b[^>]*>[\s\S]*?<\/form>/gi, "")
    // Remove on* event handlers (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Remove javascript: URLs in href/src/action attributes
    .replace(/(href|src|action)\s*=\s*["']?\s*javascript\s*:/gi, "$1=\"\"")
    // Remove data: URLs in src (potential XSS vector)
    .replace(/src\s*=\s*["']?\s*data\s*:\s*text\/html/gi, "src=\"\"");
}
