import { Loader } from "lucide-react"
import { useEffect } from "react"
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import ProtectedLayout from "./layouts/ProtectedLayout"
import PublicOnlyLayout from "./layouts/PublicOnlyLayout"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import SignUpPage from "./pages/SignUpPage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore";



const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        {/* Public-only for guests */}

        <Route element={<PublicOnlyLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected for logged-in users */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Public for all */}
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App