import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

const PublicOnlyLayout = () => {
  const { authUser } = useAuthStore()

  if (authUser) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicOnlyLayout
