import axios from "axios"
import toast from "react-hot-toast"

export function handleApiError(error: unknown, fallbackMessage = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message || error.message || fallbackMessage
    toast.error(msg)
  } else if (error instanceof Error) {
    toast.error(error.message || fallbackMessage)
  } else {
    toast.error(fallbackMessage)
  }
}