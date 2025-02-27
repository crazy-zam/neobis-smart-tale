import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SearchItem } from '../../api/data-contracts';
import { Bell } from '../../assets';
import { useDebounce } from '../../hooks/useDebounce';
import { notifyStore, searchStore, userStore } from '../../store';
import SearchInput from '../../UI/SearchInput/SearchInput';
import DropDownSearch from '../DropDownSearch/DropDownSearch';
import Notifications from '../Notifications/Notifications';
import styles from './header.module.scss';
interface IHeader {
  path: string;
  title: string;
}
const contexts: { [key: string]: SearchItem['type'] } = {
  equipment: 'PRODUCT',
  'my-ads': 'MY_ADVERTISEMENT',
  services: 'ORDER',
  history: 'ORG_ORDER',
  company: 'ORGANIZATION',
  profile: 'USER',
  employees: 'EMPLOYEE',
  'my-purchases': 'PURCHASE',
};
const Header = observer(({ path, title }: IHeader) => {
  const debounceSearch = useDebounce((e) => {
    searchStore.fetchSearch(e.target.value, true, 8, context);
  }, 1000);
  const location = useLocation();
  const pathURL = location.pathname.slice(1);
  const context = contexts[pathURL as keyof typeof contexts];
  const [search, setSearch] = useState('');

  const timeout = useRef<NodeJS.Timeout | null>(null);
  const [showNotify, setShowNotify] = useState(false);
  const mouseEnterHandler = () => {
    if (timeout.current) clearTimeout(timeout.current);
    if (showSearchResult) return;
    setShowNotify(true);
  };
  const mouseLeaveHandler = () => {
    timeout.current = setTimeout(() => {
      setShowNotify(false);
    }, 2000);
  };
  const timeoutSearch = useRef<NodeJS.Timeout | null>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const openSearchHandler = () => {
    if (timeoutSearch.current) {
      clearTimeout(timeoutSearch.current);
    }
    setShowSearchResult(true);
  };
  const closeSearchHandler = () => {
    timeoutSearch.current = setTimeout(() => {
      setShowSearchResult(false);
    }, 2000);
  };
  const navigate = useNavigate();
  console.log(userStore.isAuth);
  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.pathGroup}>
          <div className={styles.path}>{path}</div>{' '}
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.searchGroup}>
          {context && userStore.isAuth && (
            <form
              className={styles.search}
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/search?query=${search}&context=${context}`);
              }}
            >
              <SearchInput
                onChange={(e) => {
                  if (showNotify) return;
                  setSearch(e.target.value);
                  debounceSearch(e);
                  if (e.target.value.length > 2) {
                    openSearchHandler();
                  } else {
                    closeSearchHandler();
                  }
                }}
                value={search}
                width='400px'
              />
              {showSearchResult && (
                <DropDownSearch results={searchStore.results.content} />
              )}
            </form>
          )}
          <div className={notifyStore.hasUnreaded ? styles.bellHasUnreaded : styles.bell}>
            <Bell onMouseEnter={mouseEnterHandler} onMouseLeave={mouseLeaveHandler} />
          </div>
          {showNotify && (
            <Notifications
              onMouseEnter={mouseEnterHandler}
              onMouseLeave={mouseLeaveHandler}
            />
          )}
        </div>
      </div>
      <div className={styles.horizontalLine}></div>
    </div>
  );
});

export default Header;
