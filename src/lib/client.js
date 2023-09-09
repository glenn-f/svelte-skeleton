export async function triggerMessage({ result }, toastStore) {
  const message = result.data?.form?.message
  if (result.type == 'success') {
    if (message) {
      toastStore.trigger({
        message,
        timeout: 5000,
        hoverable: true,
        background: 'variant-filled-success'
      })
    }
  } else {
    if (message) {
      toastStore.trigger({
        message,
        timeout: 5000,
        hoverable: true,
        background: 'variant-filled-error'
      })
    }
  }
}

/**
 * Uso no client (browser) => Transformar um buffer em string base 64 em um arquivo de download com mimetype
 * @param {string} stringBase64 Buffer no formato string-base64
 * @param {string} mimeType MIME type para download no browser do client
 */
export function downloadBufferBase64(stringBase64, mimeType) {
  const binaryString = atob(stringBase64)
  const arrayBuffer = new ArrayBuffer(binaryString.length)
  const uint8Array = new Uint8Array(arrayBuffer)
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  const blob = new Blob([arrayBuffer], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.click()
  URL.revokeObjectURL(url)
}