import { toastStore } from "@skeletonlabs/skeleton"

export async function triggerMessage({ result }) {
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