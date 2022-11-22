import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RiCloseLine } from 'react-icons/ri';
import { Location } from 'GlobalType';

interface LocationInputProps {
  locationObject: Location | null;
  setLocationObject: React.Dispatch<React.SetStateAction<Location | null>>;
}

const LocationInput = ({ locationObject, setLocationObject }: LocationInputProps) => {
  const [resultList, setResultList] = useState<any>([]);
  const [locationInput, setLocationInput] = useState('');
  const [isLocationInputFocused, setIsLocationInputFocused] = useState<Boolean>(false);

  const OnChangeLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
    if (e.target.value == '') setResultList([]);
    else {
      try {
        const headers = new Headers({ Authorization: `KakaoAK ${process.env.REACT_APP_REST_API_KEY}` });
        fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${e.target.value}`, {
          headers,
        })
          .then((res) => res.json())
          .then((data) => {
            setResultList(data!.documents);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  //하나의 위치 선택
  const setTagItem = (e: React.MouseEvent<HTMLDivElement>) => {
    setLocationObject({ location: e.currentTarget!.textContent!, lat: Number(e.currentTarget!.dataset.lat), lng: Number(e.currentTarget!.dataset.lng) });
  };

  //위치 선택 해제
  const unSetTagItem = () => {
    setLocationObject(null);
    setLocationInput('');
    setResultList([]);
  };

  if (locationObject === undefined || locationObject === null)
    return (
      <LocationContainer>
        <InputBar onChange={OnChangeLocationInput} onFocus={(e) => setIsLocationInputFocused(true)} onBlur={(e) => setIsLocationInputFocused(false)} />
        {isLocationInputFocused ? (
          <LocationList>
            {resultList &&
              resultList.map((item: any) => {
                return (
                  <LocationListItem key={item.id} data-lng={item.x} data-lat={item.y} onMouseDown={setTagItem}>
                    <LocationTitle>
                      <a>{item.place_name}</a>
                    </LocationTitle>
                  </LocationListItem>
                );
              })}
          </LocationList>
        ) : null}
      </LocationContainer>
    );

  // 하나의 태그가 선택되었을 때
  return (
    <LocationContainer>
      <Bar>
        <SelectedLocation>
          {locationObject!.location} <CloseButton onClick={unSetTagItem} />
        </SelectedLocation>
      </Bar>
    </LocationContainer>
  );
};

export default LocationInput;

const LocationContainer = styled.div`
  margin: auto;
  z-index: 800;
`;

const LocationList = styled.div`
  margin-top: 0rem;
  background: white;
  border: 1px solid var(--color-gray3);
  transform: translateY(3px);
  border-radius: 8px;
  color: black;
  width: 23.6rem;
  height: 8rem;
  overflow: scroll;
  font-size: 0.8rem;
`;

const LocationListItem = styled.div`
  :hover {
    background-color: var(--color-gray1);
  }
`;

const LocationTitle = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: 2.5px 3px 2.5px 5px;
  a {
    display: inline-block;
    padding: 2px 6px 2px 6px;
    border-radius: 3px;
    height: 19px;
    line-height: 19px;
  }
  font-size: 0.8rem;
`;

export const InputBar = styled.input`
  margin: auto;
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  border-radius: 8px;
  color: black;
  width: 22.6rem;
  height: 2.18rem;
  font-size: 0.8rem;
  padding-left: 1rem;
`;

export const Bar = styled.div`
  margin: auto;
  background: var(--color-gray0);
  border: 1px solid var(--color-gray3);
  color: black;
  width: 23rem;
  height: 2.18rem;
  border-radius: 8px;
  padding-left: 0.6rem;
  display: flex;
  align-items: center;
`;

const SelectedLocation = styled.div`
  padding: 2px 4px 2px 8px;
  display: flex;
  line-height: 19px;
  background-color: var(--color-gray3);
  height: 19px;
  border-radius: 3px;
  font-size: 0.8rem;
`;

const CloseButton = styled(RiCloseLine)`
  width: 12px;
  height: 12px;
  margin: auto;
  padding: 3px;
  cursor: pointer;
`;
