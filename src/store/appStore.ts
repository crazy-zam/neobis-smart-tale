import { makeAutoObservable, runInAction } from 'mobx';

import { adsRowMock, cardsArray } from '../../mockData';
import { FullOrder, PageCard } from '../api/data-contracts';
import { MyApi } from '../api/V1';
import { fullPromise } from '../utils/helpers';
import { setCookie } from '../utils/helpers';

const api = new MyApi(); //создаем экземпляр нашего api

export interface IType {
  type: 'equipment' | 'services';
}

interface IMyAd {
  group: 'all' | 'service' | 'equipment';
  data: PageCard;
  detailed: FullOrder & IType;
}
interface IMyBuys {
  data: PageCard;
}
class appStore {
  myAds: IMyAd = {
    group: 'all',
    data: {
      totalPages: 0,
      totalElements: 0,
      size: 0,
      content: [],
      number: 0,
      sort: { empty: false, sorted: false, unsorted: false },
      pageable: {
        offset: 0,
        sort: { empty: false, sorted: false, unsorted: false },
        pageNumber: 0,
        pageSize: 0,
        paged: false,
        unpaged: false,
      },
      numberOfElements: 0,
      first: false,
      last: false,
      empty: false,
    },
    detailed: {
      type: 'equipment',
      orderId: 0,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      imageUrls: [
        'https://kartinki.pics/pics/uploads/posts/2022-08/thumbs/1661232571_2-kartinkin-net-p-shveinoe-delo-fon-krasivo-2.jpg',
        'https://kartinki.pics/pics/uploads/posts/2022-08/thumbs/1661232571_2-kartinkin-net-p-shveinoe-delo-fon-krasivo-2.jpg',
        'https://kartinki.pics/pics/uploads/posts/2022-08/thumbs/1661232571_2-kartinkin-net-p-shveinoe-delo-fon-krasivo-2.jpg',
      ],
      deadlineAt: '14 march 2025',
      price: 1000,
      title: 'Нитки',
      isClosed: false,
      isDeleted: false,
      publishedAt: '',
      publishedBy: 0,
      views: 0,
      size: '',
    },
  };
  myBuys: IMyBuys = {
    data: {
      totalPages: 0,
      totalElements: 0,
      size: 0,
      content: [],
      number: 0,
      sort: { empty: false, sorted: false, unsorted: false },
      pageable: {
        offset: 0,
        sort: { empty: false, sorted: false, unsorted: false },
        pageNumber: 0,
        pageSize: 0,
        paged: false,
        unpaged: false,
      },
      numberOfElements: 0,
      first: false,
      last: false,
      empty: false,
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  myAdsSetGroup = (group: 'all' | 'service' | 'equipment') => {
    this.myAds.group = group;
  };
  getMyAds = () => {
    this.myAds.data.content = cardsArray;
  };
  getDetailedAd = (id: number) => {
    this.myAds.detailed.orderId = id;
    // api.getAd1(id).then((response) => {
    //   this.myAds.detailed.orderId = response.data.orderId;
    //   this.myAds.detailed.description = response.data.description;
    //   this.myAds.detailed.title = response.data.title;
    //   if (response.data.price) this.myAds.detailed.price = response.data.price;
    //   if (response.data.imageUrls) {
    //     this.myAds.detailed.imageUrls = response.data.imageUrls;
    //   }
    //   if (response.data.deadlineAt) {
    //     this.myAds.detailed.deadlineAt = response.data.deadlineAt;
    //   }
    // });
  };
  getMyBuys = async () => {
    // const response = await api.getPurchases();
    this.myBuys.data.content = cardsArray;
  };
}

export default new appStore();
