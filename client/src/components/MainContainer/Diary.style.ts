import styled from 'styled-components';
import { HOST } from '../../constants';
import { RiMarkPenFill } from 'react-icons/ri';

export const DiaryContainer = styled.div`
  position: relative;
  user-select: none;
  width: 100%;
  height: 100%;
  padding: 0rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

export const DiaryNavBarSection = styled.div`
  width: 100%;
  height: 3rem;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  grid-area: nav;
  box-sizing: border-box;
  cursor: default;
`;

export const DateController = styled.span`
  color: #99b1db;
  font-size: 1.5rem;
  font-family: 'Press Start 2P', cursive;
  cursor: default;
`;

export const AuthorHeaderIcon = styled.img`
  width: 1.7rem;
  margin: 0.5rem 0.5rem 0 1.3rem;
`;
export const AuthorHeaderSpan = styled.span`
  color: var(--color-gray5);
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-family: 'Noto Sans KR', serif;
`;

export const DiaryAuthorList = styled.div`
  width: 42rem;
  height: 3.6rem;
  background: white;
  border-radius: 0.8rem;
  margin: 0rem 0rem 0.4rem 0rem;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

export const AuthorBox = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  margin: 0 0.35rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

export const ProfileBox = styled.div<{
  imgURL: string;
}>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 3.4rem;
  border: 1px solid #d4d4d4;
  margin: 0 0.4rem;
  box-sizing: border-box;
  background: url(${(props) => (props.imgURL === '/plus.svg' ? props.imgURL : HOST + '/' + props.imgURL)}) no-repeat center center / ${(props) => (props.imgURL === '/plus.svg' ? '1.25rem 2.8rem' : '3.5rem 3.5rem')};
`;

export const OnlineMarker = styled.div<{
  isOnline: boolean;
}>`
  width: 2.8rem;
  height: 2.8rem;
  line-height: 2.05rem;
  text-align: center;
  border: 0.3rem solid #9391ff;
  border-radius: 3.4rem;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 0.5rem;
  font-family: 'Press Start 2P', cursive;
  display: ${(props) => (props.isOnline ? 'block' : 'none')};
  box-sizing: border-box;
`;
