import { Client } from '@stomp/stompjs';

import { notifyStore, userStore } from '../store';
import { decodeJWT, isTokenExpired } from '../utils/helpers';
import { IHistoryOrg, IHistoryUser, IMessageOrg, IMessageUser } from './interfaces-ws';

export const createClient = (token: string) => {
  const decodedToken = decodeJWT(token);
  const userId = decodedToken.userId;
  const orgId = decodedToken.orgId;
  const client = new Client({
    brokerURL: 'https://smart-tale-production.up.railway.app/ws',
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: function (str) {
      // console.log(str);
    },
    reconnectDelay: 20000,

    onConnect: (frame) => {
      console.log('connected');
      client.subscribe(`/user/${userId}/push`, (message) => {
        const notification: IMessageUser | IHistoryUser = JSON.parse(message.body);
        if ('unreadCount' in notification)
          notifyStore.unreadedCount = Number(notification.unreadCount);
        if ('hasNext' in notification) {
          notification.content.forEach((notify) => {
            notifyStore.addNotify(notify);
          });
          notifyStore.hasNext = notification.hasNext;
          notifyStore.page += 1;
        } else {
          notifyStore.addNotify(notification);
        }
        if (notifyStore.isLoading) notifyStore.stopLoading();
      });
      if (orgId !== 0) {
        client.subscribe(`/org/${orgId}/push`, (message) => {
          const notification: IMessageOrg | IHistoryOrg = JSON.parse(message.body);
          if ('hasNext' in notification) {
            notification.content.forEach((notify) => {
              notifyStore.addNotify(notify);
            });
            notifyStore.hasNext = notification.hasNext;
            notifyStore.page += 1;
          } else {
            notifyStore.addNotify(notification);
          }
        });
      }
      client.publish({
        destination: `/app/notifications/history`,
        body: JSON.stringify({
          userId: userStore.userId,
          organizationId: userStore.orgId ? userStore.orgId : 0,
          page: 0,
          size: 8,
        }),
      });
    },
    onDisconnect: async (frame) => {
      if (isTokenExpired(userStore.getToken)) {
        console.log('oldToken', userStore.getToken);
        await userStore.refreshTokens();
        console.log('newToken', userStore.getToken);
      }
      client.connectHeaders = { Authorization: `Bearer ${userStore.getToken}` };
    },
  });

  return client;
};

export const sendMessage = (client: Client, message: any, destination: string) => {
  client.publish({
    destination,
    body: JSON.stringify(message),
  });
};
