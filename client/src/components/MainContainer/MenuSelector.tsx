import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menus, RoutePath } from '../../constants';
import { menuState } from '../common/atoms';
import { useRecoilState } from 'recoil';
import * as S from './Calendar.style';

const MenuSelector = () => {
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);

  const navigate = useNavigate();
  const handleMenuClick = (e: React.MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLDivElement)) return;
    const selectedMenu = target.dataset.menu;
    if (selectedMenu) {
      navigate(RoutePath[selectedMenu]);
    }
  };

  return (
    <S.MenuSelector>
      {Menus.map((menu) => {
        return (
          <S.MenuButton data-menu={menu} onClick={handleMenuClick} isActivatedMenu={menu === currentMenu}>
            {menu}
          </S.MenuButton>
        );
      })}
    </S.MenuSelector>
  );
};

export default MenuSelector;
