import { observer } from 'mobx-react-lite';

import Grid from '../../components/Grid/Grid';
import Header from '../../components/Header/Header';
import useColumnsGrid from '../../hooks/useColumnsGrid';
import servicesStore from '../../store/servicesStore';
import PageBtnGroup from '../../UI/PageBtnGroup/PageBtnGroup';
import styles from './servicesPage.module.scss';

const ServicesPage = observer(() => {
  const columns = useColumnsGrid(servicesStore.setLimit, 286, 24);
  return (
    <div className={styles.page}>
      <Header path='Маркетплейс/Заказы' title='Заказы' />
      <Grid array={servicesStore.data.content} columns={columns} />
      <PageBtnGroup store={servicesStore} setPage={servicesStore.setPage} />
    </div>
  );
});

export default ServicesPage;
