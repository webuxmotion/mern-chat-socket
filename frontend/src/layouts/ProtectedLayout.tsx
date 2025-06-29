import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

const ProtectedLayout = () => {
  const { authUser } = useAuthStore()

  if (!authUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedLayout