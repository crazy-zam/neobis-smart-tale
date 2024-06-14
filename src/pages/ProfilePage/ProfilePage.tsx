import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { defaultPhoto, logo, NavbarProfile } from '../../assets';
import Header from '../../components/Header/Header';
import { modalStore, userStore } from '../../store';
import { Modals } from '../../store/modalStore';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import Subscribe from '../../UI/Subscribe/Subscribe';
import { formatDate } from '../../utils/helpers';
import styles from './profilePage.module.scss';

const ProfilePage = observer(() => {
  const formik = useFormik({
    initialValues: {
      firstName: userStore.firstName,
      middleName: userStore.middleName,
      lastName: userStore.lastName,
      phone: userStore.phone,
      email: userStore.email,
    },
    onSubmit: (values) => {
      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        middleName: values.middleName,
        email: values.email,
        phoneNumber: values.phone,
        valid: true,
      };
      userStore.updateProfile(data);
    },
  });
  useEffect(() => {
    userStore.getUser();
    userStore.getOrganization();
  }, []);

  return (
    <div className={styles.page}>
      <div>
        <Header path='Личный кабинет/Профиль' title='Ваш профиль' />
        {!userStore.orgId && <Subscribe period={userStore.subscribePeriod} />}
        <div className={styles.body}>
          <div className={styles.profile}>
            <div className={styles.profileHeader}>
              {userStore.profilePhoto ? (
                <>
                  <label className={styles.profilePhoto} htmlFor='photo'>
                    <img
                      className={styles.profilePhotoImg}
                      src={userStore.profilePhoto}
                      alt=''
                    />{' '}
                  </label>
                  <button
                    id='photo'
                    className={styles.hiddenInput}
                    type='button'
                    onClick={() => modalStore.openModal(Modals.changePhotoModal)}
                  ></button>
                </>
              ) : (
                <>
                  <label className={styles.profilePhoto} htmlFor='emptyPhoto'>
                    <NavbarProfile className={styles.profilePhotoSVG} />{' '}
                  </label>
                  <button
                    id='emptyPhoto'
                    className={styles.hiddenInput}
                    type='button'
                    onClick={() => modalStore.openModal(Modals.changePhotoModal)}
                  ></button>
                </>
              )}
              <div>
                <p
                  className={styles.name}
                >{`${userStore.lastName} ${userStore.firstName} ${userStore.middleName}`}</p>

                <label htmlFor='photo'>
                  <p className={styles.changePhoto}>Изменить фото профиля</p>
                </label>
              </div>
            </div>{' '}
            <h3 className={styles.title}>Личные данные</h3>
            <div className={styles.personalInformation}>
              <Input
                onChange={formik.handleChange}
                value={formik.values.firstName}
                label='Имя'
                disabled={!userStore.profileEdit}
                id='firstName'
              />
              <Input
                onChange={formik.handleChange}
                value={formik.values.lastName}
                label='Фамилия'
                disabled={!userStore.profileEdit}
                id='lastName'
              />
              <div className={styles.fullWidthInput}>
                <Input
                  onChange={formik.handleChange}
                  value={formik.values.middleName}
                  label='Отчество'
                  disabled={!userStore.profileEdit}
                  id='middleName'
                />
              </div>
            </div>
            <h3 className={styles.title}>Контактные данные</h3>
            <div className={styles.contactInformation}>
              <Input
                onChange={formik.handleChange}
                value={formik.values.email}
                label='Почта'
                disabled={!userStore.profileEdit}
                id='email'
              />
              <Input
                onChange={formik.handleChange}
                value={formik.values.phone}
                label='Номер телефона'
                disabled={!userStore.profileEdit}
                id='phone'
              />
            </div>
          </div>
          <div className={styles.organiztion}>
            {userStore.organization && (
              <>
                <h2 className={styles.orgTitle}>Вы состоите в организации</h2>
                <div className={styles.orgHeader}>
                  <img
                    src={
                      userStore.organization.logoUrl
                        ? userStore.organization.logoUrl
                        : logo
                    }
                    alt=''
                    className={styles.orgLogo}
                  />
                  <div className={styles.orgField}>
                    <h3 className={styles.orgLabel}>Название</h3>
                    <div className={styles.orgText}>{userStore.organization.name}</div>
                  </div>
                </div>
                <div className={styles.orgField}>
                  <h3 className={styles.orgLabel}>Описание</h3>
                  <div className={styles.orgText}>
                    {userStore.organization.description}
                  </div>
                </div>
                <h2 className={styles.orgTitle}>Владелец организации</h2>
                <div className={styles.orgHeader}>
                  <img
                    src={
                      userStore.organization.ownerAvatarUrl
                        ? userStore.organization.ownerAvatarUrl
                        : defaultPhoto
                    }
                    alt=''
                    className={styles.orgLogo}
                  />
                  <div className={styles.orgField}>
                    <h3 className={styles.orgLabel}>ФИО</h3>
                    <div className={styles.orgText}>
                      {userStore.organization.ownerName}
                    </div>
                  </div>
                </div>
                <div className={styles.orgField}>
                  <h3 className={styles.orgLabel}>Дата создания</h3>
                  <div className={styles.orgText}>
                    {formatDate(userStore.organization.registeredAt)}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.horizontalLine}></div>
        {userStore.profileEdit ? (
          <div className={styles.buttonGroup}>
            <Button
              color='white'
              type='button'
              width='fit-content'
              handler={() => {
                formik.resetForm();
                userStore.changeProfileEdit();
              }}
            >
              Отменить изменения
            </Button>
            <Button
              color='orange'
              type='button'
              width='fit-content'
              handler={() => {
                formik.submitForm();
                userStore.changeProfileEdit();
              }}
            >
              Сохранить изменения
            </Button>
          </div>
        ) : (
          <Button
            color='blue'
            type='button'
            width='fit-content'
            handler={userStore.changeProfileEdit}
          >
            Изменить данные
          </Button>
        )}
      </div>
    </div>
  );
});

export default ProfilePage;
