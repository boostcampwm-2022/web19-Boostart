import React, { useState } from 'react';
import styled from 'styled-components';
import { RiCloseLine } from 'react-icons/ri';
import { Location } from 'GlobalType';

interface LocationSearchInputProps {
  locationObject: Location | null;
  setLocationObject: React.Dispatch<React.SetStateAction<Location | null>>;
}

interface SearchedResult {
  id: number;
  x: number;
  y: number;
  place_name: string;
}
const LocationSearchInput = ({ locationObject, setLocationObject }: LocationSearchInputProps) => {
  const [resultList, setResultList] = useState<SearchedResult[]>([]);
  const [isLocationInputFocused, setIsLocationInputFocused] = useState(false);

  const KAKAO_LOCATION_SEARCH = `https://dapi.kakao.com/v2/local/search/keyword.json?query`;

  const getSearchedList = (query: string) => {
    try {
      const headers = new Headers({ Authorization: `KakaoAK ${process.env.REACT_APP_REST_API_KEY}` });
      fetch(`${KAKAO_LOCATION_SEARCH}=${query}`, {
        headers,
      })
        .then((res) => res.json())
        .then((data) => {
          setResultList(data!.documents);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const OnChangeLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value == '' ? setResultList([]) : getSearchedList(e.target.value);
  };

  //하나의 위치 선택
  const setLocationItem = (e: React.MouseEvent<HTMLDivElement>) => {
    const locationTarget = e.currentTarget!;
    setLocationObject({ location: locationTarget.textContent!, lat: Number(locationTarget.dataset.lat), lng: Number(locationTarget.dataset.lng) });
  };

  //위치 선택 해제
  const unSetLocationItem = () => {
    setLocationObject(null);
    setResultList([]);
  };

  const SearchedLocationList = () => {
    return (
      <LocationList>
        {resultList &&
          resultList.map(({ id, x, y, place_name }) => {
            return (
              <LocationListItem key={id} data-lng={x} data-lat={y} onMouseDown={setLocationItem}>
                <LocationTitle>
                  <span>{place_name}</span>
                </LocationTitle>
              </LocationListItem>
            );
          })}
      </LocationList>
    );
  };
  return locationObject === null ? (
    <LocationContainer>
      <InputBar onChange={OnChangeLocationInput} onFocus={(e) => setIsLocationInputFocused(true)} onBlur={(e) => setIsLocationInputFocused(false)} />
      {isLocationInputFocused && <SearchedLocationList />}
    </LocationContainer>
  ) : (
    <LocationContainer>
      <Bar>
        <SelectedLocation>
          {locationObject!.location} <CloseButton onClick={unSetLocationItem} />
        </SelectedLocation>
      </Bar>
    </LocationContainer>
  );
};

export default LocationSearchInput;

const LocationContainer = styled.div`
  margin: auto;
  z-index: 1;
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
  span {
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
