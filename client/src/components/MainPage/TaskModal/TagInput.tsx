import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HOST } from '../../../constants';
import styled from 'styled-components';
import useInput from '../../../hooks/useInput';
import { RiCloseLine } from 'react-icons/ri';
import { Tag } from 'GlobalType';

axios.defaults.withCredentials = true; // withCredentials 전역 설정

interface Props {
  setTagIdx: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const TagInput = (props: Props) => {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [tagInput, onTagInputChange, setTagInput] = useInput('');
  const [isTagFocus, setIsTagFocus] = useState<Boolean>(false); // Input창이 Focus될 때만 List 표시
  const [selectedTag, setSelectedTag] = useState<Tag>(); // 선택된 하나의 태그
  const [randomColor, setRandomColor] = useState(''); // 새로운 Tag 추가 시 색깔 랜덤 배정

  //TAG GET
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${HOST}/api/v1/tag`);
        setTagList(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [, () => postNewTag]);

  //검색된 Tag
  const filteredTagList = tagList.filter((itemList) => itemList.title.toUpperCase().includes(tagInput.toUpperCase()));

  //하나의 태그 선택
  const setTagItem = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelectedTag(filteredTagList.find((item) => item.idx.toString() === e.currentTarget!.dataset.idx));
    props.setTagIdx(Number(e.currentTarget.dataset.idx));
  };

  //태그 선택 해제
  const unSetTagItem = () => {
    setSelectedTag(undefined);
    props.setTagIdx(undefined);
    setIsTagFocus(true);
    setTagInput('');
  };

  //POST TAG
  const postNewTag = async () => {
    try {
      const newTagData = {
        title: tagInput,
        color: randomColor,
      } as Tag;
      const result = await axios.post(`${HOST}/api/v1/tag`, newTagData);

      if (result.status === 200) {
        setSelectedTag(newTagData); // 표시되는 데이터 갱신
        props.setTagIdx(result.data.idx); // tagIdx(form에서 사용되는 값)를 추가된 Tag의 idx로 갱신
      }
    } catch (error) {
      alert('Tag 생성에 실패했습니다.');
      // 각 실패 처리에 대한 논의 후 에러 메시지 분기 추가하겠습니다.
      console.log(error);
    }
  };

  useEffect(() => {
    setRandomColor(`${Math.round(Math.random() * 0xffff).toString(16)}`);
  }, []);

  // 하나의 태그가 선택되었을 때
  if (selectedTag !== undefined)
    return (
      <TagContainer>
        <Bar>
          <SelectedTag color={'#' + selectedTag.color}>
            {selectedTag.title} <CloseButton onClick={unSetTagItem} />
          </SelectedTag>
        </Bar>
      </TagContainer>
    );

  // 태그 선택 전
  return (
    <TagContainer>
      <InputBar onChange={onTagInputChange} onFocus={(e) => setIsTagFocus(true)} onBlur={(e) => setIsTagFocus(false)}></InputBar>
      {isTagFocus ? (
        <TagList>
          {filteredTagList.map((item) => {
            return (
              <TagListItem key={item.idx} data-idx={item.idx} onMouseDown={setTagItem}>
                <TagTitle color={'#' + item.color}>
                  <a>{item.title}</a>
                </TagTitle>
              </TagListItem>
            );
          })}
          {tagInput != '' ? (
            <TagListItem onMouseDown={postNewTag}>
              <TagTitle color={'#' + randomColor}>
                생성 : <a>{tagInput}</a>
              </TagTitle>
            </TagListItem>
          ) : null}
        </TagList>
      ) : null}
    </TagContainer>
  );
};

export default TagInput;

const TagContainer = styled.div`
  margin: auto;
  z-index: 500;
`;

const TagList = styled.div`
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

const TagListItem = styled.div`
  :hover {
    background-color: var(--color-gray1);
  }
`;

const TagTitle = styled.div`
  display: table-cell;
  vertical-align: middle;
  padding: 2.5px 3px 2.5px 5px;
  a {
    display: inline-block;
    padding: 2px 6px 2px 6px;
    background-color: ${(props) => props.color || 'black'};
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

const SelectedTag = styled.div`
  padding: 2px 4px 2px 8px;
  display: flex;
  line-height: 19px;
  height: 19px;
  background-color: ${(props) => props.color || 'black'};
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
