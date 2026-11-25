const allowedTags = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'H2', 'H3', 'UL', 'OL',
  'LI', 'BLOCKQUOTE', 'A', 'SPAN', 'DIV', 'IMG',
])
const dangerousTags = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'SVG', 'MATH', 'FORM'])
const colorPattern = /^(#[\da-f]{3,8}|[a-z]{3,20}|rgba?\([\d.,%\s]+\))$/i

function isSafeUrl(value: string) {
  const url = value.trim()
  if (url.startsWith('/') && !url.startsWith('//')) return true

  try {
    return ['http:', 'https:', 'mailto:'].includes(new URL(url).protocol)
  } catch {
    return false
  }
}

export function sanitizeNewsHtml(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html')

  const cleanNode = (node: ChildNode) => {
    if (!(node instanceof Element)) {
      if (node.nodeType !== Node.TEXT_NODE) node.remove()
      return
    }

    if (dangerousTags.has(node.tagName)) {
      node.remove()
      return
    }

    Array.from(node.childNodes).forEach(cleanNode)

    if (!allowedTags.has(node.tagName)) {
      node.replaceWith(...Array.from(node.childNodes))
      return
    }

    const style = node.getAttribute('style')
    const safeStyles: string[] = []
    if (style) {
      const color = node instanceof HTMLElement ? node.style.color : ''
      const fontSize = node instanceof HTMLElement ? node.style.fontSize : ''
      const textAlign = node instanceof HTMLElement ? node.style.textAlign : ''
      if (color && colorPattern.test(color)) safeStyles.push(`color: ${color}`)
      if (/^(8|9|1\d|2\d|3\d|4[0-8])px$/.test(fontSize)) safeStyles.push(`font-size: ${fontSize}`)
      if (/^(left|center|right|justify)$/.test(textAlign)) safeStyles.push(`text-align: ${textAlign}`)
    }

    const href = node.getAttribute('href')
    const src = node.getAttribute('src')
    const alt = node.getAttribute('alt')
    Array.from(node.attributes).forEach((attribute) => node.removeAttribute(attribute.name))

    if (node.tagName === 'A' && href && isSafeUrl(href)) node.setAttribute('href', href)
    if (node.tagName === 'IMG' && src && isSafeUrl(src)) node.setAttribute('src', src)
    if (node.tagName === 'IMG' && alt) node.setAttribute('alt', alt.slice(0, 300))
    if (safeStyles.length) node.setAttribute('style', safeStyles.join('; '))
  }

  Array.from(document.body.childNodes).forEach(cleanNode)
  return document.body.innerHTML
}

export function newsHtmlHasText(html: string) {
  return Boolean(new DOMParser().parseFromString(html, 'text/html').body.textContent?.trim())
}
