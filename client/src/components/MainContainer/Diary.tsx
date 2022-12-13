import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { visitState, menuState, dateState } from '../common/atoms';
import { Friend } from 'GlobalType';
import Canvas from './Canvas';
import * as S from './Diary.style';

interface AuthorListProps {
  idx: number;
  profileImg: string;
}

const Diary = () => {
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);
  const currentDate = useRecoilValue(dateState);
  const currentVisit = useRecoilValue(visitState);
  const [authorList, setAuthorList] = useState<Friend[]>([]);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  useEffect(() => {
    setCurrentMenu('DIARY');
  }, []);
  useEffect(() => {
    return () => {
      setAuthorList([]);
      setOnlineList([]);
    };
  }, [currentVisit, currentDate]);

  const AuthorList = ({ idx, profileImg }: AuthorListProps) => {
    return (
      <S.AuthorBox>
        <S.ProfileBox key={idx} imgURL={profileImg} />
        <S.OnlineMarker isOnline={onlineList.includes(idx)}>
          <span>ON</span>
        </S.OnlineMarker>
      </S.AuthorBox>
    );
  };

  return (
    <S.DiaryContainer>
      <S.DiaryAuthorList>
        <S.AuthorBox>
          <S.AuthorHeaderIcon src="/author.svg" alt="" />
          <S.AuthorHeaderSpan>참여자</S.AuthorHeaderSpan>
        </S.AuthorBox>
        {authorList.map(({ idx, profileImg }) => {
          return <AuthorList idx={idx} profileImg={profileImg} />;
        })}
      </S.DiaryAuthorList>
      <Canvas setAuthorList={setAuthorList} setOnlineList={setOnlineList} />
    </S.DiaryContainer>
  );
};

export default Diary;
