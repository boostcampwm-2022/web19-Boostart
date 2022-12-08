import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import axios from 'axios';
import DateSelector from './DateSelector';
import { HOST } from '../../constants';
import useCurrentDate from '../../hooks/useCurrentDate';
import { visitState } from '../common/atoms';
import { Task } from 'GlobalType';
const { kakao } = window;

export const Map = () => {
  const { currentDate, dateToString } = useCurrentDate();
  const [taskList, setTaskList] = useState<Task[] | null>(null);
  const currentVisit = useRecoilValue(visitState);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const fetchTaskList = async () => {
    const date = dateToString();
    const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
    const taskList = response.data;
    setTaskList(taskList);
  };
  useEffect(() => {
    fetchTaskList();
  }, [currentVisit, currentDate]);

  useEffect(() => {
    if (!mapRef.current || !taskList) return;
    const validTasks = taskList.filter(({ lat }) => lat);
    const options = {
      center: new kakao.maps.LatLng(validTasks[0].lat, validTasks[0].lng),
      level: 5,
    };
    const map = new kakao.maps.Map(mapRef.current, options);
    if (!validTasks) return;
    const imageSrc = '/mapMarkerPurple.png';
    validTasks.forEach(({ title, lat, lng }) => {
      console.log(title, lat, lng);
      const imageSize = new kakao.maps.Size(35, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(lat, lng),
        title: title,
        image: markerImage,
      });
    });
  }, [taskList]);

  return (
    <>
      <MapTitle>MAP</MapTitle>
      <MapContainer>
        <DateSelector />
        <div>
          <div ref={mapRef} style={{ width: '35rem', height: '31rem' }}></div>
        </div>
      </MapContainer>
    </>
  );
};

export default Map;

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
  background: white;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
  user-select: none;
`;

// import React, { useEffect, useRef, useState } from 'react';
// import { useRecoilValue } from 'recoil';
// import styled from 'styled-components';
// import axios from 'axios';
// import { HOST } from '../../constants';
// import useCurrentDate from '../../hooks/useCurrentDate';
// import { visitState } from '../common/atoms';
// import { Task } from 'GlobalType';
// const { kakao } = window;

// export const Location = () => {
//   const { currentDate, dateToString } = useCurrentDate();
//   const [taskList, setTaskList] = useState<Task[] | null>(null);
//   const currentVisit = useRecoilValue(visitState);
//   const mapRef = useRef<HTMLDivElement | null>(null);

//   const fetchTaskList = async () => {
//     const date = dateToString();
//     const response = currentVisit.isMe ? await axios.get(`${HOST}/api/v1/task?date=${date}`) : await axios.get(`${HOST}/api/v1/task/${currentVisit.userId}?date=${date}`);
//     const taskList = response.data;
//     setTaskList(taskList);
//   };
//   useEffect(() => {
//     fetchTaskList();
//   }, [currentVisit, currentDate]);

//   useEffect(() => {
//     if (!mapRef.current) return;
//     const options = {
//       center: new kakao.maps.LatLng(37.495264512305174, 127.05676860117488),
//       level: 8,
//     };
//     const map = new kakao.maps.Map(mapRef.current, options);
//     if (!taskList) return;
//     const imageSrc = '/github_icon.png';
//     taskList.forEach(({ title, lat, lng }) => {
//       console.log(title, lat, lng);
//       if (lat && lng) {
//         const imageSize = new kakao.maps.Size(24, 35);
//         const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
//         const marker = new kakao.maps.Marker({
//           map: map, // 마커를 표시할 지도
//           position: new kakao.maps.LatLng(lat, lng), // 마커를 표시할 위치
//           title: title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
//           image: markerImage, // 마커 이미지
//         });
//       }
//     });
//   }, [taskList]);

//   return (
//     <>
//       <MapTitle>MAP</MapTitle>
//       <MapContainer>
//         <div>
//           <div ref={mapRef} style={{ width: '500px', height: '400px' }}></div>
//         </div>
//       </MapContainer>
//     </>
//   );
// };

// export default Location;

// const MapTitle = styled.span`
//   display: inline-block;
//   color: white;
//   font-size: 1.7rem;
//   font-family: 'Press Start 2P', cursive;
//   transform: translate(1.75rem, 0.43rem);
//   z-index: 1;
//   span {
//     font-size: 1.2rem;
//   }
// `;
// const MapContainer = styled.div`
//   width: 100%;
//   height: 37rem;
//   background: white;
//   border-radius: 1rem;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   box-shadow: 0px 0px 10px 5px rgba(175, 175, 175, 0.25);
//   user-select: none;
// `;
