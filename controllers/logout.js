import baseUrl from '../config.js';

const SERVER = baseUrl;

export default function LogOut() {
  // eslint-disable-next-line no-plusplus

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionStorage.removeItem(key);
  }
  const url = `${SERVER}/includes/molecules/logout.php`;
  window.location.href = url;
}
