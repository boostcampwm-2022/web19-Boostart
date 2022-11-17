import React, { useState } from 'react';
import * as S from './style';

const ImportanceInput = () => {
  const [importance, setImportance] = useState(0);

  const handleStarClick = (e: React.MouseEvent, index: Number) => {
    e.preventDefault();
    setImportance(0);
    for (let i = 0; i < 5; i++) {
      if (i <= index) {
        setImportance((prevCount) => prevCount + 1);
      }
    }
  };

  return (
    <S.Rating>
      <div>
        <S.Star isClicked={importance >= 1} onClick={(e) => handleStarClick(e, 0)} />
        <S.Star isClicked={importance >= 2} onClick={(e) => handleStarClick(e, 1)} />
        <S.Star isClicked={importance >= 3} onClick={(e) => handleStarClick(e, 2)} />
        <S.Star isClicked={importance >= 4} onClick={(e) => handleStarClick(e, 3)} />
        <S.Star isClicked={importance >= 5} onClick={(e) => handleStarClick(e, 4)} />
      </div>
    </S.Rating>
  );
};

export default ImportanceInput;
