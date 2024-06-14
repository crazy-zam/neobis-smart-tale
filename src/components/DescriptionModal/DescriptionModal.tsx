import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { defaultImage, defaultPhoto } from '../../assets';
import { modalStore } from '../../store';
import { Modals } from '../../store/modalStore';
import Button from '../../UI/Button/Button';
import { formatDate } from '../../utils/helpers';
import styles from './descriptionModal.module.scss';

const DescriptionModal = observer(() => {
  const card = modalStore.detailed[0];
  const isJob = 'jobId' in card;
  const avatar = isJob ? card.organizationLogoUrl : card.publisherAvatarUrl;
  const tabs: {
    tab: 'description' | 'contacts' | 'size';
    text: 'Описание' | 'Контакты' | 'Размеры';
  }[] = [
    { tab: 'description', text: 'Описание' },
    { tab: 'contacts', text: 'Контакты' },
  ];
  if ('size' in card && !!card.size) tabs.push({ tab: 'size', text: 'Размеры' });
  const [quantity, setQuantity] = useState(1);
  return (
    <div className={styles.wrapper}>
      <div className={styles.images}>
        <img
          className={styles.bigImage}
          src={
            'imageUrl' in card
              ? card.imageUrl
              : card.imageUrls[modalStore.detailedExt.activeImg]
                ? card.imageUrls[modalStore.detailedExt.activeImg]
                : defaultImage
          }
          alt=''
        />
        {'imageUrl' in card ? (
          <img src={card.imageUrl} alt='' className={styles.smallImage} />
        ) : (
          card.imageUrls.map((img, ind) => {
            return (
              <button key={ind} onClick={modalStore.setImage(ind)}>
                <img
                  className={
                    ind === modalStore.detailedExt.activeImg
                      ? styles.smallImageActive
                      : styles.smallImage
                  }
                  src={img}
                  alt=''
                />
              </button>
            );
          })
        )}
      </div>
      <div className={styles.descriptionPart}>
        <div>
          <div className={styles.path}>{modalStore.detailedExt.path}</div>
          <div className={styles.adTitle}>
            {card.title}
            {'deadlineAt' in card && (
              <div className={styles.orderStatus}>До {formatDate(card.deadlineAt)}</div>
            )}
          </div>
          <div className={styles.price}>
            {'price' in card && card.price ? `${card.price} сом` : 'Договорная'}
          </div>
          <div className={styles.horizontalLine}></div>
          <div className={styles.authorBlock}>
            <img
              className={styles.authorImg}
              src={avatar ? avatar : defaultPhoto}
              alt=''
            />
            <div>
              <div className={styles.authorName}>
                {isJob ? card.organizationName : card.publisherName}
              </div>
              <div className={styles.authorLabel}>
                {isJob ? 'Организация' : 'Автор объявления'}
              </div>
            </div>
          </div>
          <div className={styles.tabsContainer}>
            {tabs.map((tab, ind) => {
              return (
                <button
                  key={ind}
                  className={
                    modalStore.detailedExt.activeTab === tab.tab
                      ? styles.tabActive
                      : styles.tab
                  }
                  onClick={modalStore.setActiveTab(tab.tab)}
                >
                  {tab.text}
                </button>
              );
            })}
          </div>
          <div className={styles.tabDescription}>
            {modalStore.detailedExt.activeTab === 'contacts' && (
              <>
                <p>
                  {'publisherPhoneNumber' in card
                    ? card.publisherPhoneNumber
                    : card.phoneNumber}
                </p>
                <p>{'publisherEmail' in card ? card.publisherEmail : card.email}</p>
              </>
            )}
            {modalStore.detailedExt.activeTab === 'description' && (
              <p>{card.description}</p>
            )}
            {modalStore.detailedExt.activeTab === 'size' && (
              <p>{'size' in card && card.size}</p>
            )}
          </div>
        </div>
        <div className={styles.footer}>
          {'canHandle' in card &&
            card.canHandle &&
            // 'canPurchase' in card &&
            // card.canPurchase &&
            'quantity' in card &&
            card.quantity > 0 && (
              <div className={styles.quantityGroup}>
                <div>{`Доступно: ${card.quantity}`}</div>
                <div>
                  Выбрать количество
                  <div className={styles.quantitySelector}>
                    <button
                      onClick={() => {
                        if (quantity <= 1) return;
                        setQuantity((prev) => prev - 1);
                      }}
                      className={styles.quantityBtn}
                    >
                      -
                    </button>
                    <div>{quantity}</div>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => {
                        if (quantity >= card.quantity) return;
                        setQuantity((prev) => prev + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          <div className={styles.button}>
            {/* || ('canApply' in card && card.canApply) || ('canAccept' in card &&
            card.canAccept) || ('canPurchase' in card && card.canPurchase) */}
            {'canHandle' in card && card.canHandle && (
              <Button
                color='blue'
                type='button'
                width='100%'
                margin='auto auto 0px 0px'
                handler={() => {
                  const queryQuantity = 'productId' in card ? quantity : undefined;
                  modalStore.handleAdvertisement(queryQuantity);
                }}
              >
                {'canHandle' in card && 'Подтвердить'}
                {'canApply' in card && 'Подать заявку'}
                {'canAccept' in card && 'Принять заказ'}
                {'canPurchase' in card && 'Купить'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default DescriptionModal;
