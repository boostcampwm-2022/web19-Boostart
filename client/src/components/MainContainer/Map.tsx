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

type TaskTargetType = 'my' | 'friend' | 'both';

export const Map = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<any>(null);
  const [currentMenu, setCurrentMenu] = useRecoilState(menuState);
  const { currentDate, dateToString } = useCurrentDate();
  const [myTaskList, setMyTaskList] = useState<Task[]>([]);
  const [friendTaskList, setFriendTaskList] = useState<Task[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const currentVisit = useRecoilValue(visitState);
  const MyimageSrc = '/mapMarkerPurple.png';
  const FriendImageSrc = '/mapMarkerYellow.png';

  const fetchTaskList = async (target: TaskTargetType) => {
    const date = dateToString();
    const response = target === 'my' ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
    const tasks: Task[] = response.data;
    const validTasks = tasks.filter(({ lat }) => lat);
    if (target === 'my') setMyTaskList(validTasks);
    else if (target === 'friend') setFriendTaskList(validTasks);
  };

  const selectTaskList = (focusType: TaskTargetType) => {
    switch (focusType) {
      case 'both':
        return [...myTaskList, ...friendTaskList];
      case 'friend':
        return friendTaskList;
      case 'my':
        return myTaskList;
    }
  };

  const setMarkerOnMap = (focusType: TaskTargetType) => {
    const markerImageSrc = focusType === 'my' ? MyimageSrc : FriendImageSrc;
    let taskList = selectTaskList(focusType);
    taskList.forEach(({ title, lat, lng }) => {
      const imageSize = new kakao.maps.Size(50, 50);
      const markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize);
      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        map: kakaoMapRef.current,
        position: markerPosition,
        title: title,
        image: markerImage,
      });
      setMarkers((markers) => [...markers, marker]);
    });
  };

  const setMapBoundary = (focusType: TaskTargetType) => {
    let taskList = selectTaskList(focusType);
    const bound = new kakao.maps.LatLngBounds();
    taskList.forEach(({ lat, lng }) => {
      const markerPosition = new kakao.maps.LatLng(lat, lng);
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
    if (markers.length > 0) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
    }
    fetchTaskList('my');
    if (!currentVisit.isMe) {
      fetchTaskList('friend');
    } else {
      setFriendTaskList([]);
    }
  }, [currentVisit, currentDate]);

  useEffect(() => {
    if (!mapRef.current) return;
    setMarkerOnMap('my');
  }, [myTaskList]);
  useEffect(() => {
    if (!mapRef.current) return;
    setMarkerOnMap('friend');
  }, [friendTaskList]);
  useEffect(() => {
    if (!mapRef.current) return;
    if (myTaskList.length > 0 || friendTaskList.length > 0) setMapBoundary('both');
  }, [myTaskList, friendTaskList]);

  const TaskList = ({ isMyList }: { isMyList: boolean }) => {
    const taskList = isMyList ? myTaskList : friendTaskList;
    const focusSelectedTask = (lat: number, lng: number) => {
      const focusPosition = new kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.setCenter(focusPosition);
      kakaoMapRef.current.setLevel(3);
    };
    return (
      <TaskListOnMap isMyList={isMyList}>
        <TaskListTitleOnMap>{isMyList ? '나의 하루' : '친구의 하루'}</TaskListTitleOnMap>
        {taskList &&
          taskList.map(({ idx, title, lat, lng, tagName, startedAt }) => {
            return (
              <TaskItemOnMap key={idx} onClick={() => focusSelectedTask(lat, lng)}>
                <span>{title}</span>
                <span>
                  #{tagName} {startedAt}
                </span>
              </TaskItemOnMap>
            );
          })}
        <TaskItemOnMap onClick={() => setMapBoundary(isMyList ? 'my' : 'friend')}>전체보기</TaskItemOnMap>
      </TaskListOnMap>
    );
  };

  return (
    <>
      <MapTitle>MAP{!currentVisit.isMe && <span> width {currentVisit.userId}</span>}</MapTitle>
      <MapContainer>
        <DateSelector />
        <KakaoContainer>
          <div ref={mapRef} style={{ width: '41rem', height: '31rem' }}></div>
          {myTaskList.length > 0 && <TaskList isMyList={true} />}
          {friendTaskList.length > 0 && <TaskList isMyList={false} />}
          {myTaskList.length === 0 && friendTaskList.length === 0 && <TaskAlertBox>위치정보가 있는 Task를 추가해주세요</TaskAlertBox>}
          {friendTaskList.length > 0 && myTaskList.length > 0 && <BothFocusButton onClick={() => setMapBoundary('both')}>전체보기</BothFocusButton>}
        </KakaoContainer>
      </MapContainer>
    </>
  );
};

export default Map;

const TaskListOnMap = styled.div<{
  isMyList: boolean;
}>`
  width: 9rem;
  max-height: 80%;
  display: flex;
  position: absolute;
  border-radius: 1rem;
  top: 50%;
  ${(props) => (props.isMyList ? 'left: 0;' : 'right:0;')}
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
  font-weight: 700;
`;

const TaskItemOnMap = styled.div`
  width: 100%;
  height: fit-content;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid var(--color-gray5);
  font-family: 'Noto Sans KR';
  font-size: 0.875rem;
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

const BothFocusButton = styled.div`
  width: 7rem;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 600;
  cursor: pointer;
`;
