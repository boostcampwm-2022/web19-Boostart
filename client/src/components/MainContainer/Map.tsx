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
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [isTaskNull, setIsTaskNull] = useState(false);
  const currentVisit = useRecoilValue(visitState);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<any>(null);
  const boundRef = useRef<any>(null);
  const imageSrc = '/mapMarkerPurple.png';

  const fetchTaskList = async () => {
    const date = dateToString();
    const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
    const tasks: Task[] = response.data;
    const validTasks = tasks.filter(({ lat }) => lat);
    setTaskList(validTasks);
  };

  const focusAllTasks = () => {
    taskList.forEach(({ title, lat, lng }) => {
      const imageSize = new kakao.maps.Size(35, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const marker = new kakao.maps.Marker({
        map: kakaoMapRef.current,
        position: markerPosition,
        title: title,
        image: markerImage,
      });
      setMarkers((markers) => [...markers, marker]);
      boundRef.current.extend(markerPosition);
    });
    kakaoMapRef.current.setBounds(boundRef.current);
  };

  useEffect(() => {
    setCurrentMenu('MAP');
    const options = {
      center: new kakao.maps.LatLng(37.566535, 126.97796919),
      level: 5,
    };
    const map = new kakao.maps.Map(mapRef.current, options);
    const bound = new kakao.maps.LatLngBounds();
    kakaoMapRef.current = map;
    boundRef.current = bound;
  }, []);

  useEffect(() => {
    setIsTaskNull(false);
    if (markers.length > 0) {
      markers.forEach((marker) => marker.setMap(null));
      setMarkers([]);
    }
    fetchTaskList();
  }, [currentVisit, currentDate]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (taskList.length === 0) {
      setIsTaskNull(true);
      return;
    }
    setIsTaskNull(false);
    focusAllTasks();
    return () => {
      boundRef.current = new kakao.maps.LatLngBounds();
    };
  }, [taskList]);

  useEffect(() => {
    setCurrentMenu('MAP');
  }, []);

  const ValidTaskList = () => {
    const focusSelectedTask = (lat: number, lng: number) => {
      const focusPosition = new kakao.maps.LatLng(lat, lng);
      kakaoMapRef.current.setCenter(focusPosition);
      kakaoMapRef.current.setLevel(3);
    };
    return (
      <TaskListOnMap>
        <TaskListTitleOnMap>Task 목록</TaskListTitleOnMap>
        {taskList &&
          taskList.map(({ title, lat, lng, tagName }) => {
            return (
              <TaskItemOnMap onClick={() => focusSelectedTask(lat, lng)}>
                <span>{title}</span>
                <span>#{tagName}</span>
              </TaskItemOnMap>
            );
          })}
        <TaskItemOnMap onClick={() => focusAllTasks()}>전체보기</TaskItemOnMap>
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
          {taskList.length > 0 && <ValidTaskList />}
          {isTaskNull && <TaskAlertBox>위치정보가 있는 Task를 추가해주세요</TaskAlertBox>}
        </KakaoContainer>
      </MapContainer>
    </>
  );
};

export default Map;

const TaskListOnMap = styled.div`
  width: 10rem;
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
  font-weight: 700;
`;

const TaskItemOnMap = styled.div`
  width: 100%;
  height: 3.5rem;
  padding: 0 1.5rem;
  border-top: 1px solid var(--color-gray5);
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
