import { FC, useMemo } from 'react';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../services/store';
import {
  selectorOrder,
  selectorOrderStatus,
  selectorOrderModalData,
  orderBurger,
  resetOrder
} from '../../services/constructorSlice';
import { selectorisUserAuthorized } from '../../services/authUserSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isUserLoggedIn = useSelector(selectorisUserAuthorized);
  const constructorItems = useSelector(selectorOrder);
  const orderRequest =
    useSelector(selectorOrderStatus) === RequestStatus.Loading;
  const orderModalData = useSelector(selectorOrderModalData);

  const onOrderClick = () => {
    if (!isUserLoggedIn) {
      return navigate('/login');
    } else if (
      constructorItems.bun?._id &&
      constructorItems.ingredients.length
    ) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        orderBurger([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
