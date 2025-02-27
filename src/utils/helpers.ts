import { InternalAxiosRequestConfig } from 'axios';

import { userStore } from '../store';

export function setCookie(name: string, value: string, hours: number) {
  let expires = '';
  if (hours) {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
export function getCookie(name: string) {
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  } catch (e) {
    return null;
  }
}
export function removeCookie(name: string) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

export function cutText(text: string, limit: number) {
  text = text.trim();
  if (text.length <= limit) return text;
  text = text.slice(0, limit);
  const lastSpace = text.lastIndexOf(' ');
  if (lastSpace > 0) {
    text = text.substring(0, lastSpace);
  }
  return text + '...';
}

export function fullPromise<T>(
  promise: Promise<T>,
  fulfilled: (value: T) => void,
  rejected: (error: T) => void,
): void {
  promise
    .then((value) => {
      fulfilled(value);
    })
    .catch((error) => {
      rejected(error);
    });
}

export function formatDate(dateString: string | undefined) {
  if (!dateString) return '';
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const dateParts = dateString.split('-');
  const year = dateParts[0];
  const monthIndex = parseInt(dateParts[1], 10) - 1;
  const day = parseInt(dateParts[2], 10);

  return `${day} ${months[monthIndex]} ${year}`;
}
export function formatDate2(dateString: string | undefined) {
  if (!dateString) return '';
  const dateParts = dateString.split('/');
  const year = dateParts[2];
  const month = dateParts[0];
  const day = dateParts[1];

  return `${day}.${month}.${year}`;
}

export function toCamelCase(str: string) {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
export const decodeJWT = (token: string) => {
  const obj: {
    authorities: number;
    exp: number;
    hierarchy: number;
    iat: number;
    iss: string;
    orgId: number;
    roles: string;
    sub: string;
    tokenType: string;
    userId: number;
  } = JSON.parse(atob(token.split('.')[1]));

  return obj;
};

export const isTokenExpired = (token: string) => {
  if (!token) return true;
  if (token === 'undefined') return true;
  const expiry = decodeJWT(token).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};

export const redirectToAuth = (config: InternalAxiosRequestConfig<any>) => {
  const abortCtrl = new AbortController();
  abortCtrl.abort();
  config.signal = abortCtrl.signal;
  userStore.logout();
  window.location.assign(`${window.location.origin}/#/authorization`);
};

export const addImageSize = (url: string, width: number, height: number): string => {
  // Проверяем, что URL начинается с базовой части Cloudinary
  if (url.startsWith('https://res.cloudinary.com/')) {
    // Разделяем URL на основную часть и путь к изображению
    const [baseURL, imagePath] = url.split('/v');

    // Формируем новую часть URL с указанием размеров
    const newURL = `${baseURL}/w_${width},h_${height}/v${imagePath}`;
    return newURL;
  } else {
    // Если URL не начинается с ожидаемой базовой части, возвращаем исходный URL
    return url;
  }
};
