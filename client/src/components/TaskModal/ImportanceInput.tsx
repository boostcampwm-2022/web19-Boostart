import React, { useState } from 'react';
import * as S from './ImportanceInput.style';

const ImportanceInput = ({ importance, handleStarClick }: any) => {
  return (
    <S.Rating>
      <div>
        <S.Star $isclicked={importance >= 1} onClick={() => handleStarClick(1)} />
        <S.Star $isclicked={importance >= 2} onClick={() => handleStarClick(2)} />
        <S.Star $isclicked={importance >= 3} onClick={() => handleStarClick(3)} />
        <S.Star $isclicked={importance >= 4} onClick={() => handleStarClick(4)} />
        <S.Star $isclicked={importance >= 5} onClick={() => handleStarClick(5)} />
      </div>
    </S.Rating>
  );
};

export default ImportanceInput;
