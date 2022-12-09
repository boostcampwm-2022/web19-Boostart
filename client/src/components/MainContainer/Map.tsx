import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import styled from 'styled-components';
import axios from 'axios';
import DateSelector from './DateSelector';
import { HOST, Menus } from '../../constants';
import useCurrentDate from '../../hooks/useCurrentDate';
import { visitState, menuState } from '../common/atoms';
import { Task } from 'GlobalType';
const { kakao } = window;

export const Map = () => {
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);
  const { currentDate, dateToString } = useCurrentDate();
  const [mytaskList, setMyTaskList] = useState<Task[]>([]);
  const [friendsTaskList, setFriendsTaskList] = useState<Task[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isTaskNull, setIsTaskNull] = useState(false);
  const currentVisit = useRecoilValue(visitState);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<any>(null);
  const myMarkerImage = '/mapMarkerPurple.png';
  const focusTarget = {
    Me: 'me',
    Friend: 'frined',
    Both: 'both',
  };

  const fetchMyTaskList = async () => {
    const date = dateToString();
    const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
    const tasks: Task[] = response.data;
    const validTasks = tasks.filter(({ lat }) => lat);
    setMyTaskList(validTasks);
  };

  const focusAllTasks = (target: 'me' | 'friend' | 'both') => {
    const focusList = target === 'me' ? mytaskList : target === 'friend' ? friendsTaskList : [mytaskList, friendsTaskList];
    const bound = new kakao.maps.LatLngBounds();
    mytaskList.forEach(({ title, lat, lng }) => {
      const imageSize = new kakao.maps.Size(35, 35);
      const markerImage = new kakao.maps.MarkerImage(myMarkerImage, imageSize);
      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        map: kakaoMapRef.current,
        position: markerPosition,
        title: title,
        image: markerImage,
      });
      setMarkers((markers) => [...markers, marker]);
      bound.extend(markerPosition);
    });
    kakaoMapRef.current.setBounds(bound);
  };

  useEffect(() => {
    setCurrentMenu('MAP');
    const options = {
      center: new kakao.maps.LatLng(37.566535, 126.97796919),
      level: 5,
    };
    const map = new kakao.maps.Map(mapRef.current, options);
    kakaoMapRef.current = map;
  }, []);

  useEffect(() => {
    setIsTaskNull(false);
    if (markers.length > 0) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
    }
    fetchMyTaskList();
  }, [currentVisit, currentDate]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mytaskList.length === 0) {
      setIsTaskNull(true);
      return;
    }
    setIsTaskNull(false);
    focusAllTasks('me');
  }, [mytaskList]);

  const ValidTaskList = () => {
    const focusSelectedTask = (lat: number, lng: number) => {
      const focusPosition = new kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.setCenter(focusPosition);
      kakaoMapRef.current.setLevel(3);
    };
    return (
      <TaskListOnMap>
        <TaskListTitleOnMap>나의 Task 목록</TaskListTitleOnMap>
        {mytaskList &&
          mytaskList.map(({ title, lat, lng, tagName }) => {
            return (
              <TaskItemOnMap onClick={() => focusSelectedTask(lat, lng)}>
                <span>{title}</span>
                <span>#{tagName}</span>
              </TaskItemOnMap>
            );
          })}
        <TaskItemOnMap onClick={() => focusAllTasks('me')}>전체보기</TaskItemOnMap>
      </TaskListOnMap>
    );
  };

  return (
    <>
      <MapTitle>MAP</MapTitle>
      <MapContainer>
        <DateSelector />
        <KakaoContainer>
          <div ref={mapRef} style={{ width: '41rem', height: '31rem' }}></div>
          {mytaskList.length > 0 && <ValidTaskList />}
          {isTaskNull && <TaskAlertBox>위치정보가 있는 Task를 추가해주세요</TaskAlertBox>}
          {}
        </KakaoContainer>
      </MapContainer>
    </>
  );
};

export default Map;

const TaskListOnMap = styled.div`
  width: 7rem;
  max-height: 80%;
  display: flex;
  position: absolute;
  border-radius: 1rem;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  gap: 0.25rem;
  overflow: scroll;
  z-index: 600;
  cursor: pointer;
`;

const TaskListTitleOnMap = styled.div`
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

const TaskItemOnMap = styled.div`
  width: 100%;
  height: 3.5rem;
  padding: 0 0.75rem;
  border-top: 1px solid var(--color-gray5);
  font-size: 0.75rem;
  font-family: 'Noto Sans KR';
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
`;

const MapTitle = styled.span`
  display: inline-block;
  color: white;
  font-size: 1.7rem;
  font-family: 'Press Start 2P', cursive;
  transform: translate(1.75rem, 0.43rem);
  z-index: 1;
  span {
    font-size: 1.2rem;
  }
`;
const MapContainer = styled.div`
  width: 100%;
  height: 37rem;
  position: relative;
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  user-select: none;
`;

const KakaoContainer = styled.div`
  position: relative;
`;

const TaskAlertBox = styled.div`
  width: 25rem;
  height: 5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-main);
  font-family: 'Noto Sans KR';
  font-size: 1.25rem;
  font-weight: 700;
  background: white;
  border-radius: 1rem;
  line-height: 5rem;
  text-align: center;
  z-index: 600;
`;
