import { create } from "zustand";
import { getUnreadNotificationCount } from "@/lib/mock-data";

interface NotificationState {
  isOpen: boolean;
  unreadCount: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setUnreadCount: (count: number) => void;
  markAllRead: () => void;
  refreshUnreadCount: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  unreadCount: getUnreadNotificationCount(),

  open: () => set({ isOpen: true }),

  close: () => set({ isOpen: false }),

  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  markAllRead: () => set({ unreadCount: 0 }),

  refreshUnreadCount: () => set({ unreadCount: getUnreadNotificationCount() }),
}));
