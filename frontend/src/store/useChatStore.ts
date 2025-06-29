import toast from "react-hot-toast";
import { create } from "zustand";

import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { handleApiError } from "../lib/handleApiError";


interface User {
    _id: string;
    name: string;
    profilePic?: string;
    fullName: string;
}

interface ChatStore {
    messages: Message[];
    users: User[];
    selectedUser: User | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;

    getUsers: () => Promise<void>;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (messageData: { content: string; image?: string }) => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

// Реалізація
export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get<User[]>("/messages/users");
            set({ users: res.data });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    sendMessage: async (messageData: { content: string; image?: string }) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return;

        try {
            const res = await axiosInstance.post<Message>(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error: any) {
            handleApiError(error)
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get<Message[]>(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error: any) {
            handleApiError(error)
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage: Message) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set((state) => ({
                messages: [...state.messages, newMessage],
            }));
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));