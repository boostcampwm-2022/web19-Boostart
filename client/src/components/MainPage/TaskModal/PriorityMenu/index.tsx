import React, { useState } from 'react';
import * as S from './style';

const PriorityMenu = () => {
  const [clicked, setClicked] = useState([false, false, false, false, false]); //clicked 배열로 별 관리
  const [priority, setPriority] = useState(0);

  const handleStarClick = (e: React.MouseEvent, index: Number) => {
    e.preventDefault();
    let clickStates = [...clicked];
    setPriority(0);
    for (let i = 0; i < 5; i++) {
      if (i <= index) {
        clickStates[i] = true;
        setPriority((prevCount) => prevCount + 1);
      } else clickStates[i] = false;
    }
    setClicked(clickStates);
  };

  return (
    <S.Rating>
      <div>
        <S.Star isClicked={clicked[0]} onClick={(e) => handleStarClick(e, 0)} />
        <S.Star isClicked={clicked[1]} onClick={(e) => handleStarClick(e, 1)} />
        <S.Star isClicked={clicked[2]} onClick={(e) => handleStarClick(e, 2)} />
        <S.Star isClicked={clicked[3]} onClick={(e) => handleStarClick(e, 3)} />
        <S.Star isClicked={clicked[4]} onClick={(e) => handleStarClick(e, 4)} />
      </div>
    </S.Rating>
  );
};

export default PriorityMenu;
