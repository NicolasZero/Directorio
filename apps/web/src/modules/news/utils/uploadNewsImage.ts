const maxImageSize = 5 * 1024 * 1024
const supportedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function uploadNewsImage(file: File) {
  if (!supportedImageTypes.has(file.type)) {
    throw new Error('Elige una imagen JPG, PNG, WEBP o GIF.')
  }
  if (file.size > maxImageSize) {
    throw new Error('La imagen debe pesar 5 MB o menos.')
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('No se pudo leer el archivo de imagen.'))
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'))
    reader.readAsDataURL(file)
  })

  const response = await fetch('/api/news/images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl }),
  })
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result?.error || 'No se pudo subir la imagen.')
  }

  return result.url as string
}
