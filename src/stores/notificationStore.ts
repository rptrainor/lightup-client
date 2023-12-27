import { createSignal } from 'solid-js';

export type NotificationType = 'success' | 'error';

export type Notification = {
  id: number;
  type: NotificationType;
  header: string;
  subHeader: string;
};

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export const addNotification = (notification: Omit<Notification, 'id'>) => {
  setNotifications((prev) => [
    ...prev,
    { ...notification, id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1 }
  ]);
};

export const removeNotification = (id: number) => {
  setNotifications((prev) => prev.filter(n => n.id !== id));
};

export const useNotifications = () => notifications;
