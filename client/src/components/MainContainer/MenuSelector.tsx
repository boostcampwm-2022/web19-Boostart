import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menus, RoutePath } from '../../constants';
import * as S from './Calendar.style';

const MenuSelector = () => {
  const [selectedMenu, setSelectedMenu] = useState('LOG');
  const navigate = useNavigate();
  const handleMenuClick = (e: React.MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLDivElement)) return;
    const selectedMenu = target.dataset.menu;
    if (selectedMenu) {
      setSelectedMenu(selectedMenu);
      navigate(RoutePath[selectedMenu]);
    }
  };

  return (
    <S.MenuSelector>
      {Menus.map((menu) => {
        return (
          <S.MenuButton data-menu={menu} onClick={handleMenuClick} isActivatedMenu={menu === selectedMenu}>
            {menu}
          </S.MenuButton>
        );
      })}
    </S.MenuSelector>
  );
};

export default MenuSelector;
