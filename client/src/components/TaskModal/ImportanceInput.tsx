import React, { useState } from 'react';
import * as S from './ImportanceInput.style';

const ImportanceInput = () => {
  const [importance, setImportance] = useState(1);

  return (
    <S.Rating>
      <div>
        <S.Star $isclicked={importance >= 1} onClick={() => setImportance(1)} />
        <S.Star $isclicked={importance >= 2} onClick={() => setImportance(2)} />
        <S.Star $isclicked={importance >= 3} onClick={() => setImportance(3)} />
        <S.Star $isclicked={importance >= 4} onClick={() => setImportance(4)} />
        <S.Star $isclicked={importance >= 5} onClick={() => setImportance(5)} />
      </div>
    </S.Rating>
  );
};

export default ImportanceInput;
