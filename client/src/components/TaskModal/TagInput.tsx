import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HOST } from '../../constants';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';
import { RiCloseLine } from 'react-icons/ri';
import { Tag } from 'GlobalType';

axios.defaults.withCredentials = true; // withCredentials 전역 설정

interface TagInputProps {
  tag?: Tag;
  setTagIdx: React.Dispatch<number | null>;
  tagList: Tag[];
  fetchTagList: () => Promise<void>;
  isTagInputFocused: boolean;
  setIsTagInputFocused: React.Dispatch<boolean>;
}

const TagInput = ({ tag, setTagIdx, tagList, fetchTagList, isTagInputFocused, setIsTagInputFocused }: TagInputProps) => {
  // const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [tagInput, onChangeTagInput, setTagInput] = useInput('');
  const [searchedTagList, setSearchedTagList] = useState<Tag[]>([]);
  const [newTagColor, setNewTagColor] = useState('');

  const { idx: tagIdx, title } = tag ?? {};
  const [color, setColor] = useState<string | undefined>(tag?.color);

  //태그 선택 해제
  const unSetTagItem = () => {
    setTagIdx(null);
    setTagInput('');
  };

  const handleWindowClick = () => {
    setIsTagInputFocused(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  //TAG GET

  //검색된 Tag
  useEffect(() => {
    setSearchedTagList(tagList.filter((itemList) => itemList.title.toUpperCase().includes(tagInput.toUpperCase())));
  }, [tagList, tagInput]);

  //하나의 태그 선택
  const setTagItem = (idx: number) => () => {
    setTagIdx(idx);
  };

  const postNewTag = async () => {
    const newTagData = {
      title: tagInput,
      color: newTagColor,
    };
    try {
      const response = await axios.post(`${HOST}/api/v1/tag`, newTagData);
      setTagIdx(response.data.idx);
      fetchTagList();
    } catch (error) {
      alert('이미 존재하는 태그입니다.');
    }
  };

  const deleteTag = async (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    e.stopPropagation();
    if (window.confirm('태그를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${HOST}/api/v1/tag/${idx}`);
        fetchTagList();
      } catch (error) {
        alert('태그 삭제에 실패했습니다.');
      }
    }
  };

  const onChangeTagColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setColor(color);
  };

  const postColorChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      await axios.post(`${HOST}/api/v1/tag/color/${tagIdx}`, { color });
    } catch (error) {
      alert('색상 변경에 실패했습니다.');
    }
  };

  useEffect(() => {
    let color_r = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_g = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_b = Math.floor(Math.random() * 127 + 128).toString(16);
    setNewTagColor(`#${color_r + color_g + color_b}`);
  }, []);

  const SearchedTagList = () => {
    return (
      <TagList>
        {searchedTagList.map(({ idx, color, title, count }) => {
          return (
            <TagListItem key={idx} onMouseDown={setTagItem(idx)}>
              <TagTitle color={color} create={false}>
                <span>{title}</span>
                {count === 0 && <DeleteIcon onMouseDown={(e) => deleteTag(e, idx)}>삭제</DeleteIcon>}
              </TagTitle>
            </TagListItem>
          );
        })}
        {tagInput !== '' && (
          <TagListItem onMouseDown={postNewTag}>
            <TagTitle color={newTagColor} create={true}>
              {'생성 : '}
              <span>{tagInput}</span>
            </TagTitle>
          </TagListItem>
        )}
      </TagList>
    );
  };

  const handleTagInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTagInputFocused(true);
  };

  return !tagIdx ? (
    <TagContainer>
      <InputBar value={tagInput} onChange={onChangeTagInput} onClick={handleTagInputClick} />
      {isTagInputFocused && <SearchedTagList />}
    </TagContainer>
  ) : (
    <TagContainer>
      <Bar>
        <SelectedTag color={color}>
          {title} <CloseButton onClick={unSetTagItem} />
        </SelectedTag>
        <ColorPicker type="color" value={color} onChange={onChangeTagColor} onBlur={postColorChange} />
      </Bar>
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

const TagTitle = styled.div<{ color: string; create: boolean }>`
  display: flex;
  padding: 2.5px 3px 2.5px 5px;
  align-items: center;
  height: 27px;
  font-size: 0.8rem;
  justify-content: ${(props) => (props.create ? 'baseline' : 'space-between')};

  span {
    cursor: pointer;
    margin: 0px;
    display: inline-block;
    padding: 2px 6px 2px 6px;
    background-color: ${(props) => props.color || 'white'};
    border-radius: 3px;
    height: 19px;
    line-height: 19px;
  }
`;

const DeleteIcon = styled.div`
  text-align: right;
  cursor: pointer;
  color: var(--color-gray6);
  margin: 0px;
  font-size: 10px;
  display: inline-block;
  padding: 2px 6px 2px 6px;
  height: 19px;
  line-height: 19px;
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
  justify-content: space-between;
`;

const SelectedTag = styled.div`
  padding: 2px 4px 2px 8px;
  display: flex;
  line-height: 19px;
  height: 19px;
  background-color: ${(props) => props.color || 'white'};
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

const ColorPicker = styled.input`
  cursor: pointer;
  border: 1px solid var(--color-gray3);
  padding: 0px;
  background-color: inherit;
  width: 1.2rem;
  height: 1.2rem;
  margin: 0.8rem;
  z-index: 999;

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  ::-webkit-color-swatch {
    border: none;
  }
`;
