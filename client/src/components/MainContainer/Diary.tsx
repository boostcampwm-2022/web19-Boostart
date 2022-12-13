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

  const AuthorList = ({ username, profileImg, isOnline }: any) => {
    return (
      <S.AuthorBox>
        <S.ProfileBox imgURL={profileImg} />
        <S.OnlineMarker isOnline={isOnline}>
          <span>{username}</span>
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
        {authorList.map(({ username, profileImg, isOnline }: any) => {
          return <AuthorList username={username} profileImg={profileImg} isOnline={isOnline} />;
        })}
      </S.DiaryAuthorList>
      <Canvas setAuthorList={setAuthorList} />
    </S.DiaryContainer>
  );
};

export default Diary;
