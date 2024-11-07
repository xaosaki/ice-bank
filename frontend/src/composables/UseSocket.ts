import { ref } from 'vue';
import { io, Socket } from 'socket.io-client';
import { useToast } from 'vue-toastification';
import { useInSplitStore } from '@/stores/InSplitStore';
import { useAccountStore } from '@/stores/AccountStore';
import { useOutSplitStore } from '@/stores/OutSplitStore';

let socket: Socket | null = null;

enum NotificationMessageType {
  NEW_INCOMING_SPLIT = 'new_incoming_split',
  OUTGOING_SPLIT_ACCEPT = 'outgoing_split_accept',
  OUTGOING_SPLIT_DECLINE = 'outgoing_split_decline'
}

interface NotificationMessage {
  sender: string;
  message: string;
  messageType: NotificationMessageType;
}

export function useSocket(token: string | null) {
  const toast = useToast();
  const isConnected = ref(false);

  function initializeSocket() {
    if (token && !socket) {
      socket = io((window as any).config.VUE_APP_API_SOCKET_URL, {
        auth: { token }
      });

      socket.on('connect', () => {
        isConnected.value = true;
      });

      socket.on('disconnect', () => {
        isConnected.value = false;
      });

      socket.on('message', async (data: NotificationMessage) => {
        if (
          data.sender === 'system' &&
          data.messageType === NotificationMessageType.NEW_INCOMING_SPLIT
        ) {
          toast.info('New incoming split!');

          const inSplitStore = useInSplitStore();
          await inSplitStore.fetchList();
        } else if (
          (data.sender === 'system' &&
            data.messageType === NotificationMessageType.OUTGOING_SPLIT_ACCEPT) ||
          data.messageType === NotificationMessageType.OUTGOING_SPLIT_DECLINE
        ) {
          if (data.messageType === NotificationMessageType.OUTGOING_SPLIT_ACCEPT) {
            toast.success(data.message);
            const accountStore = useAccountStore();
            await accountStore.fetchAccounts();
          } else {
            toast.error(data.message);
          }
          const outSplitStore = useOutSplitStore();
          await outSplitStore.fetchList();
        }
      });
    }
  }

  function disconnectSocket() {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.value = false;
    }
  }

  return { initializeSocket, disconnectSocket, isConnected };
}
