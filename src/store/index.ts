import { injectStores } from '@mobx-devtools/tools';

import equipmentStore from './equipmentStore';
import navbarStore from './navbarStore';
import PlaceOrderStore from './placeOrderStore';
import servicesStore from './servicesStore';
import userStore from './userStore';

const createPlaceOrderStore = (images: string[]) => {
  const placeOrderStoreInstance = new PlaceOrderStore(images);
  injectStores({
    placeOrderStoreInstance,
  });
  return placeOrderStoreInstance;
};
const emptyPlaceOrderStore = new PlaceOrderStore([]);
export type typePlaceOrderStore = typeof emptyPlaceOrderStore;

injectStores({
  equipmentStore,
  navbarStore,
  servicesStore,
  userStore,
});

export { createPlaceOrderStore, equipmentStore, navbarStore, servicesStore, userStore };
