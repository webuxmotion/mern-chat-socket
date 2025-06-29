import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client";
import { create } from "zustand"

interface AuthUser {
    _id: string
    name: string
    profilePic?: string
    fullName: string
    createdAt: string
    email: string
}

interface AuthStore {
    authUser: AuthUser | null

    isSigningUp: boolean
    isLoggingIn: boolean
    isUpdatingProfile: boolean
    isCheckingAuth: boolean

    socket: Socket | null
    onlineUsers: string[]

    signup: (data: any) => Promise<void>
    login: (data: any) => Promise<void>
    logout: () => Promise<void>
    updateProfile: (data: any) => Promise<void>

    checkAuth: () => Promise<void>
    connectSocket: () => void
    disconnectSocket: () => void
}

import { axiosInstance } from "../lib/axios"
import { handleApiError } from "../lib/handleApiError";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully");
        } catch (error) {
            handleApiError(error)
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged in successfully")

        } catch (error) {
            handleApiError(error)
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            get().disconnectSocket()
            toast.success("Logged out successfully");
        } catch (error) {
            handleApiError(error)
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            handleApiError(error)
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
        }
    }
}))