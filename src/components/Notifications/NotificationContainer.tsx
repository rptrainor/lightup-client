import { For } from 'solid-js';
import { useNotifications, removeNotification } from '~/stores/notificationStore';
import ErrorNotification from '~/components/Notifications/ErrorNotification';
import SuccessNotification from '~/components/Notifications/SuccessNotification';

const NotificationContainer = () => {
  const notifications = useNotifications();

  console.log('NotificationContainer', { notifications: notifications() })
  return (
    <div
      aria-live="assertive"
      class="pointer-events-none fixed inset-0 flex px-4 py-6 items-start z-30 sm:p-6"
    >
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <For each={notifications()}>
          {(notification) => (
            <div class={`transition-transform ease-out duration-300 ${notification.type === 'success' ? 'bg-utility_success_tint' : 'bg-utility_danger_tint'}`}>
              {notification.type === 'success' ?
                <SuccessNotification
                  onClose={() => removeNotification(notification.id)}
                  Header={notification.header}
                  SubHeader={notification.subHeader}
                /> :
                <ErrorNotification
                  onClose={() => removeNotification(notification.id)}
                  Header={notification.header}
                  SubHeader={notification.subHeader}
                />
              }
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default NotificationContainer;
