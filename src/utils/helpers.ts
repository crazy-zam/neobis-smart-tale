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
  console.log(dateString);
  const dateParts = dateString.split('/');
  const year = dateParts[2];
  const month = dateParts[0];
  const day = dateParts[1];

  return `${day}.${month}.${year}`;
}

export const isTokenExpired = (token: string) => {
  if (!token) return true;
  if (token === 'undefined') return true;
  console.log(
    'checkToken after if',
    Math.floor(new Date().getTime() / 1000) >= JSON.parse(atob(token.split('.')[1])).exp,
  );
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  return Math.floor(new Date().getTime() / 1000) >= expiry;
};
