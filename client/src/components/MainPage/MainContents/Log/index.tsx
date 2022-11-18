import React, { useState, useEffect, useRef } from 'react';
import { Task } from 'GlobalType';
import * as S from './style';
const dummy: Task[] = [
  {
    idx: 0,
    title: '데일리어쩌구',
    importance: 1,
    startedAt: '10:00',
    endedAt: '11:30',
    lat: 123,
    lng: 123,
    location: '압구정역',
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
    location: '집',
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
    location: '줌',
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
    location: '집',
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
    location: '집',
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
  {
    idx: 5,
    title: '다섯번째',
    importance: 2,
    startedAt: '20:00',
    endedAt: '21:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 3,
    tag_name: '생존',
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
  {
    idx: 6,
    title: '여섯번째',
    importance: 2,
    startedAt: '20:00',
    endedAt: '21:30',
    lat: 123,
    lng: 123,
    location: '집',
    public: true,
    tag_idx: 0,
    tag_name: '부스트캠프',
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

const Log = () => {
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<number[]>([0, 0]);
  const [dummyData, setDummyData] = useState<Task[]>(dummy);
  const [activeTag, setActiveTag] = useState<number | null>(null);
  const [timeMarkerData, setTimeMarkerData] = useState<number[]>([0, 0]);
  const selectedRef = useRef<HTMLDivElement | null>(null);
  const mouseOffsetRef = useRef<number[]>([0, 0]);
  const taskContainerRef = useRef<HTMLDivElement | null>(null);

  const dummyMap = new Map();
  const tagList = ['부스트캠프', '육아', '일상', '생존', '테스트'];
  dummy.forEach((data) => {
    dummyMap.set(data.idx, data);
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    if (!target.dataset.idx) return;
    mouseOffsetRef.current = [e.nativeEvent.offsetX, e.nativeEvent.offsetY];
    setMousePos([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
    const timeout = setTimeout(() => {
      if (target.dataset.idx) {
        setSelectedElement(parseInt(target.dataset.idx));
        selectedRef.current = target;
        selectedRef.current.style.visibility = 'hidden';
      }
    }, 700);
    e.target.addEventListener('mouseup', () => {
      clearTimeout(timeout);
    });
    e.target.addEventListener('mouseleave', () => {
      clearTimeout(timeout);
    });
  };

  const calculateTime = (startedAt: string, endedAt: string) => {
    const [startHour, startMin] = startedAt.split(':').map(parseInt);
    const [endHour, endMin] = endedAt.split(':').map(parseInt);
    const startedTime = startHour + startMin / 60;
    const duration = endHour + endMin / 60 - startedTime;
    setTimeMarkerData([startedTime, duration]);
  };

  const handleTagWrapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target instanceof HTMLDivElement)) return;
    const target = e.target;
    const activeTaskIdx = target.dataset.idx;
    if (activeTaskIdx === undefined || parseInt(activeTaskIdx) === activeTag) {
      setActiveTag(null);
      setTimeMarkerData([0, 0]);
    } else {
      const activeIdx = parseInt(activeTaskIdx);
      setActiveTag(activeIdx);
      calculateTime(dummyMap.get(activeIdx).startedAt, dummyMap.get(activeIdx).endedAt);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedElement === null) return;

      if (!(e.target instanceof HTMLDivElement)) return;
      const target = e.target;
      setMousePos([e.pageX - mouseOffsetRef.current[0], e.pageY - mouseOffsetRef.current[1]]);
      if (target.dataset.direction && taskContainerRef.current) {
        if (target.dataset.direction === 'left') {
          taskContainerRef.current.scrollBy(-10, 0);
        } else {
          taskContainerRef.current.scrollBy(10, 0);
        }
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (selectedElement === null || !selectedRef.current) return;
      let target = e.target as HTMLDivElement;
      if (target.dataset.tag) dummyMap.get(selectedElement).tag_name = target.dataset.tag;
      setDummyData([...dummy]);
      selectedRef.current.style.visibility = 'visible';

      selectedRef.current = null;
      setSelectedElement(null);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectedElement]);

  return (
    <>
      {selectedElement !== null && (
        <S.SelectedItem x={mousePos[0]} y={mousePos[1]}>
          <span>{dummyMap.get(selectedElement).startedAt}</span> {dummyMap.get(selectedElement).title}
        </S.SelectedItem>
      )}
      <S.LogTitle>LOG</S.LogTitle>
      <S.LogContainer>
        <S.slideObserver data-direction="left" direction="left"></S.slideObserver>
        <S.TimeBarSection>
          <img src="./timebar-clock.svg" />
          <S.TimeBar>
            <S.TimeMarker startedAt={timeMarkerData[0]} duration={timeMarkerData[1]}></S.TimeMarker>
          </S.TimeBar>
        </S.TimeBarSection>
        <S.LogNavBarSection>
          <S.SortOptionSelect>
            <option value="tag">태그순</option>
            <option value="time">시간순</option>
            <option value="importance">중요도순</option>
          </S.SortOptionSelect>
          <S.DateController>{'< 11.12 >'}</S.DateController>
          <div></div>
        </S.LogNavBarSection>
        <S.LogMainSection ref={taskContainerRef}>
          {tagList.map((tag) => {
            return (
              <S.TagWrap key={tag} data-tag={tag} onClick={handleTagWrapClick}>
                <S.TagTitle data-tag={tag}>#{tag}</S.TagTitle>
                {dummyData
                  .filter(({ tag_name }) => tag_name === tag)
                  .map(({ tag_name, idx, title, startedAt, endedAt, importance, location, content }) => {
                    return (
                      <S.TagItems onMouseDown={handleMouseDown} data-idx={idx} data-tag={tag_name} data-active={idx === activeTag}>
                        <div>
                          <S.TagTime>{startedAt}</S.TagTime> {title}
                        </div>
                        {idx === activeTag && (
                          <>
                            <hr />
                            <div>
                              {startedAt}-{endedAt}
                            </div>
                            <div>{location}</div>
                            <div>{importance}</div>
                            <hr />
                            <div>{content}</div>
                          </>
                        )}
                      </S.TagItems>
                    );
                  })}
              </S.TagWrap>
            );
          })}
        </S.LogMainSection>
        <S.slideObserver data-direction="right" direction="right"></S.slideObserver>
      </S.LogContainer>
    </>
  );
};

export default Log;
