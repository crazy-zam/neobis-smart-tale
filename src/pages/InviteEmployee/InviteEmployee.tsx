import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import * as Yup from 'yup';

import { InviteRequest } from '../../api/data-contracts';
import { ArrowLeft } from '../../assets';
import Header from '../../components/Header/Header';
import { userStore } from '../../store';
import employeeStore from '../../store/employeeStore';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import { createStyles } from '../../utils/selectHelpers';
import { emailSchema, phoneNumberSchema, positionSchema } from '../../utils/yupShemas';
import styles from './inviteEmployee.module.scss';

const InviteEmployee = observer(() => {
  const schema = emailSchema.concat(phoneNumberSchema).concat(positionSchema);
  const initialValues: InviteRequest = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phoneNumber: '',
    positionId: 0,
  };
  useLayoutEffect(() => {
    employeeStore.getDropdownPositions();
  }, []);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values);
      employeeStore.inviteEmployee({
        email: values.email,
        phoneNumber: values.phoneNumber,
        positionId: values.positionId,
      });
      formik.resetForm();
    },
    validationSchema: schema,
  });
  type OptionType = {
    value: string;
    label: string;
  };
  const customStyles = createStyles<OptionType>(!!formik.errors.positionId);
  return (
    <div className={styles.page}>
      <Header
        title='Сотрудники'
        path={userStore.organization?.name ? userStore.organization.name : 'SmartTale'}
      />
      <Link to={'/employees'} className={styles.backLink}>
        <ArrowLeft className={styles.arrow} />
        {'Вернуться к списку сотрудников'}
      </Link>
      <form onSubmit={formik.handleSubmit}>
        <h3 className={styles.title}>Приглашение сотрудника</h3>
        <div className={styles.personalInformation}>
          <Input
            onChange={formik.handleChange}
            value={formik.values.firstName ? formik.values.firstName : ''}
            label='Имя'
            id='firstName'
            isError={
              formik.errors.firstName ? formik.errors.firstName?.length > 0 : false
            }
          />
          <Input
            onChange={formik.handleChange}
            value={formik.values.lastName ? formik.values.lastName : ''}
            label='Фамилия'
            id='lastName'
            isError={formik.errors.lastName ? formik.errors.lastName?.length > 0 : false}
          />
          <div className={styles.fullWidthInput}>
            <Input
              onChange={formik.handleChange}
              value={formik.values.middleName ? formik.values.middleName : ''}
              label='Отчество'
              id='middleName'
              isError={
                formik.errors.middleName ? formik.errors.middleName?.length > 0 : false
              }
            />
          </div>
        </div>
        <h3 className={styles.title}>Контактные данные</h3>
        <div className={styles.contactInformation}>
          <Input
            onChange={formik.handleChange}
            value={formik.values.email}
            label='Почта'
            id='email'
            isError={formik.errors.email ? formik.errors.email?.length > 0 : false}
          />
          <Input
            onChange={formik.handleChange}
            value={formik.values.phoneNumber}
            label='Номер телефона'
            id='phoneNumber'
            isError={
              formik.errors.phoneNumber ? formik.errors.phoneNumber?.length > 0 : false
            }
          />
        </div>
        <h3 className={styles.title}>Должность</h3>
        <Select
          options={employeeStore.posiitons.map((option) => {
            return {
              value: option.positionId,
              label: option.title,
            };
          })}
          onChange={(option: any) => {
            formik.setFieldValue('positionId', option.value);
          }}
          styles={customStyles}
        />

        <div className={styles.footer}>
          <div className={styles.horizontalLine}></div>
          <Button color='blue' type='submit' width='fit-content'>
            Пригласить сотрудника
          </Button>
        </div>
      </form>
    </div>
  );
});

export default InviteEmployee;
