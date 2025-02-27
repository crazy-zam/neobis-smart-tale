import { observer } from 'mobx-react-lite';
import { useLocation } from 'react-router-dom';

import { Card as ICard, PurchaseSummary } from '../../api/data-contracts';
import { defaultImage, defaultPhoto } from '../../assets';
import { modalStore, navbarStore } from '../../store';
import { PathEnum } from '../../store/modalStore';
import Button from '../../UI/Button/Button';
import { addImageSize, cutText } from '../../utils/helpers';
import styles from './card.module.scss';
interface IProps {
  card: PurchaseSummary | ICard;
}
const Card = observer(({ card }: IProps) => {
  const id = 'purchaseId' in card ? card.purchaseId : card.advertisementId;
  const location = useLocation();
  const path = location.pathname as keyof typeof PathEnum;
  const buttonHandler = () => {
    modalStore.openDescription(id, PathEnum[path]);
  };
  return (
    <div className={styles.cardWrapper}>
      <img
        className={styles.cardImage}
        src={card.imageUrl ? addImageSize(card.imageUrl, 269, 182) : defaultImage}
        alt=''
      />
      <div className={styles.descriptionWrapper}>
        <div className={styles.headBlock}>
          <span>{cutText(card.title, 15)}</span>
          <span className={styles.price}>
            {'price' in card ? `${card.price} сом` : 'Договорная'}
          </span>
        </div>
        <div className={styles.authorBlock}>
          <img
            className={styles.authorImage}
            src={card.publisherAvatarUrl ? card.publisherAvatarUrl : defaultPhoto}
            alt=''
          />
          <div>
            <div className={styles.author}>{card.publisherName}</div>
            <div className={styles.authorLabel}>{'Автор объявления'}</div>
          </div>
        </div>
        <div className={styles.description}>{cutText(card.description, 80)}</div>
        <Button color='white' type='button' width='100%' handler={buttonHandler}>
          Подробнее
        </Button>
      </div>
    </div>
  );
});

export default Card;
