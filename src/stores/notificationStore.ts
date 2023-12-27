import { createSignal } from 'solid-js';
import { getRandomSuccessNotification } from '~/utilities/getRandomSuccessNotification'; // Adjust the path as needed

export type NotificationType = 'success' | 'error';

export type Notification = {
  id: number;
  type: NotificationType;
  header: string | undefined;
  subHeader: string | undefined;
};

const [notifications, setNotifications] = createSignal<Notification[]>([]);

export const addNotification = (notification: Omit<Notification, 'id'>) => {
  let finalNotification = notification;

  // Check if the notification type is 'success' and if header or subHeader is undefined
  if (notification.type === 'success' && (!notification.header || !notification.subHeader)) {
    const randomSuccessNotification = getRandomSuccessNotification();
    finalNotification = {
      ...notification,
      header: notification.header ?? randomSuccessNotification.header,
      subHeader: notification.subHeader ?? randomSuccessNotification.subHeader,
    };
  }

  setNotifications((prev) => [
    ...prev,
    { ...finalNotification, id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 1 }
  ]);
};

export const removeNotification = (id: number) => {
  setNotifications((prev) => prev.filter(n => n.id !== id));
};

export const useNotifications = () => notifications;
