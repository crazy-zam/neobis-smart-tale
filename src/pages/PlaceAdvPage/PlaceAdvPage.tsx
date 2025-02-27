import { observer } from 'mobx-react-lite';

import Header from '../../components/Header/Header';
import PlaceAdvDummy from '../../components/PlaceAdvDummy/PlaceAdvDummy';
import PlaceAdvForm from '../../components/PlaceAdvForm/PlaceAdvForm';
import { createPlaceAdvStore } from '../../store';
import ScrollableWrapper from '../../UI/ScrollableWrapper/ScrollableWrapper';
import styles from './placeAdvPage.module.scss';

const PlaceAdvPage = observer(() => {
  return (
    <div className={styles.page}>
      <Header path='Маркетплейс/Разместить заказ' title='Разместить заказ' />
      <ScrollableWrapper>
        <PlaceAdvForm />
      </ScrollableWrapper>
    </div>
  );
});

export default PlaceAdvPage;
