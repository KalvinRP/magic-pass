let DOMPurify;
export function sanitizeHTML(html) {
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'b', 'i', 'em', 'strong', 'a', 'p', 'div', 'span', 'img', 'br',
            'ul', 'li', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code'
        ],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'style', 'class', 'id', 'rel', 'target'],
    });
}
