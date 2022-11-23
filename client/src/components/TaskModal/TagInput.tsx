import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HOST } from '../../constants';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';
import { RiCloseLine } from 'react-icons/ri';
import { Tag } from 'GlobalType';

axios.defaults.withCredentials = true; // withCredentials 전역 설정

interface TagInputProps {
  tagObject: Tag | null;
  setTagObject: React.Dispatch<React.SetStateAction<Tag | null>>;
}

const TagInput = ({ tagObject, setTagObject }: TagInputProps) => {
  const [isTagInputFocused, setIsTagInputFocused] = useState(false);
  const [tagInput, onChangeTagInput, setTagInput] = useInput('');
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [searchedTagList, setSearchedTagList] = useState<Tag[]>([]);
  const [newTagColor, setNewTagColor] = useState('');
  const [reload, setReload] = useState(0);

  //태그 선택 해제
  const unSetTagItem = () => {
    setTagObject(null);
    setTagInput('');
  };

  //TAG GET
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${HOST}/api/v1/tag`);
        const list = result.data.sort((a: Tag, b: Tag) => b.count - a.count);
        setTagList(list);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [reload]);

  //검색된 Tag
  useEffect(() => {
    setSearchedTagList(tagList.filter((itemList) => itemList.title.toUpperCase().includes(tagInput.toUpperCase())));
  }, [tagList, tagInput]);

  //하나의 태그 선택
  const setTagItem = (e: React.MouseEvent<HTMLDivElement>) => {
    setTagObject(searchedTagList.find((item) => item.idx.toString() === e.currentTarget!.dataset.idx) || null);
  };

  //POST TAG
  const postNewTag = async () => {
    try {
      const newTagData = {
        title: tagInput,
        color: newTagColor,
      } as Tag;
      await axios.post(`${HOST}/api/v1/tag`, newTagData).then((res) => {
        if (res.status === 200) {
          setTagObject({ ...newTagData, idx: res.data.idx, count: 0 });
          setReload(reload + 1);
        }
      });
    } catch (error) {
      alert('이미 존재하는 태그입니다.');
    }
  };

  //DELET TAG
  const deleteTag = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      await axios.delete(`${HOST}/api/v1/tag/${e.currentTarget!.dataset.idx}`).then((res) => {
        if (res.status == 200) setReload(reload + 1);
      });
    } catch (error) {
      alert('태그 삭제에 실패했습니다.');
    }
    setIsTagInputFocused(true);
  };

  const onChangeTagColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagObject((prev) => {
      return { ...prev, color: e.target.value } as Tag;
    });
  };

  const postColorChange = async (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      const r = await axios.post(`${HOST}/api/v1/tag/color/${tagObject!.idx}`, { color: tagObject!.color }).then((res) => {
        if (res.status == 200) setReload(reload + 1);
      });
    } catch (error) {
      alert('색상 변경에 실패했습니다.');
    }
  };

  useEffect(() => {
    let color_r = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_g = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_b = Math.floor(Math.random() * 127 + 128).toString(16);
    setNewTagColor(`#${color_r + color_g + color_b}`);
  }, [reload]);

  const SearchedTagList = () => {
    return (
      <TagList>
        {searchedTagList.map(({ idx, color, title, count }) => {
          return (
            <TagListItem key={idx} data-idx={idx} onMouseDown={setTagItem}>
              <TagTitle color={color} create={false}>
                <span>{title}</span>
                {count === 0 && (
                  <DelIcon data-idx={idx} onMouseDown={deleteTag}>
                    삭제
                  </DelIcon>
                )}
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

  return tagObject === null ? (
    <TagContainer>
      <InputBar value={tagInput} onChange={onChangeTagInput} onFocus={(e) => setIsTagInputFocused(true)} onBlur={(e) => setIsTagInputFocused(false)} />
      {isTagInputFocused && <SearchedTagList />}
    </TagContainer>
  ) : (
    <TagContainer>
      <Bar>
        <SelectedTag color={tagObject?.color}>
          {tagObject!.title} <CloseButton onClick={unSetTagItem} />
        </SelectedTag>
        <ColorPicker type="color" value={tagObject.color} onChange={onChangeTagColor} onBlur={postColorChange} />
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

const DelIcon = styled.div`
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
