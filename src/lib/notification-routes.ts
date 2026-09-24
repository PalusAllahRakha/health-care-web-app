import type { Notification } from "@/types";

const FALLBACK_ROUTES: Record<Notification["type"], string> = {
  appointment: "/appointments",
  result: "/lab-results",
  prescription: "/prescriptions",
  message: "/messages",
};

export function getNotificationHref(notification: Notification): string {
  return notification.href || FALLBACK_ROUTES[notification.type];
}
