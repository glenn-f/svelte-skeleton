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