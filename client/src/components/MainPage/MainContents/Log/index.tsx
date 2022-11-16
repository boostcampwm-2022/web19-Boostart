import React, { useState, useEffect } from 'react';
import { Tasks } from 'GlobalType';
import { EngMonth, Days, WEEK_LENGTH, Menus } from '../../../../constants';
import * as S from './style';

const Log = () => {
  const dummy: Tasks[] = [
    {
      idx: 0,
      title: '데일리어쩌구',
      importance: 1,
      startedAt: '10:00',
      endedAt: '11:30',
      lat: 123,
      lng: 123,
      public: true,
      tag_idx: 0,
      tag_name: '부스트캠프',
      content: '아 어렵다',
      done: true,
      labels: [
        {
          idx: 0,
          color: 'red',
          title: '고통',
          amount: 10,
          unit: 'Kg',
        },
      ],
    },
    {
      idx: 1,
      title: '육아',
      importance: 5,
      startedAt: '00:00',
      endedAt: '23:59',
      lat: 123,
      lng: 123,
      public: true,
      tag_idx: 1,
      tag_name: '육아',
      content: '아 힘들다',
      done: false,
      labels: [
        {
          idx: 1,
          color: 'yellow',
          title: '귀여움',
          amount: 20,
          unit: 'Kg',
        },
      ],
    },
    {
      idx: 2,
      title: '페어저쩌구',
      importance: 3,
      startedAt: '13:00',
      endedAt: '16:30',
      lat: 123,
      lng: 123,
      public: true,
      tag_idx: 0,
      tag_name: '부스트캠프',
      content: '아 재미있다',
      done: false,
      labels: [
        {
          idx: 3,
          color: 'blue',
          title: '공부',
          amount: 120,
          unit: '분',
        },
      ],
    },
    {
      idx: 3,
      title: '분유먹이기',
      importance: 4,
      startedAt: '12:00',
      endedAt: '12:30',
      lat: 123,
      lng: 123,
      public: true,
      tag_idx: 1,
      tag_name: '육아',
      content: '맛있을까?',
      done: true,
      labels: [
        {
          idx: 1,
          color: 'yellow',
          title: '귀여움',
          amount: 20,
          unit: 'Kg',
        },
        {
          idx: 2,
          color: 'green',
          title: '분유',
          amount: 200,
          unit: 'ml',
        },
      ],
    },
    {
      idx: 4,
      title: '넷플릭스보기',
      importance: 2,
      startedAt: '20:00',
      endedAt: '21:30',
      lat: 123,
      lng: 123,
      public: true,
      tag_idx: 2,
      tag_name: '일상',
      content: '요즘은 뭐가 재미있지?',
      done: false,
      labels: [
        {
          idx: 4,
          color: 'pink',
          title: '휴식',
          amount: 900,
          unit: '분',
        },
      ],
    },
  ];
  return (
    <>
      <S.LogTitle>LOG</S.LogTitle>
      <S.LogContainer>
        <S.TimeBarSection>
          <img src="./timebar-clock.svg" />
          <S.TimeBar>
            <S.timeMarker></S.timeMarker>
          </S.TimeBar>
        </S.TimeBarSection>
        <S.LogNavBarSection>
          <S.SortOptionSelect>
            <option value="1">태그순</option>
            <option value="2">시간순</option>
            <option value="3">중요도순</option>
          </S.SortOptionSelect>
          <S.DateController>{'< 11.12 >'}</S.DateController>
          <div></div>
        </S.LogNavBarSection>
        <S.LogMainSection></S.LogMainSection>
      </S.LogContainer>
    </>
  );
};

export default Log;
