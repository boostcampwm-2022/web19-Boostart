import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HOST } from '../../constants';
import styled from 'styled-components';
import useInput from '../../hooks/useInput';
import { RiCloseLine } from 'react-icons/ri';
import { FiPlus } from 'react-icons/fi';
import { Label } from 'GlobalType';
import Modal from '../common/Modal';

axios.defaults.withCredentials = true; // withCredentials 전역 설정

interface LabelInputProps {
  labelArray: Label[];
  setLabelArray: React.Dispatch<React.SetStateAction<Label[]>>;
}

const LabelInput = ({ labelArray, setLabelArray }: LabelInputProps) => {
  const [labelList, setLabelList] = useState<Label[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const [reload, setReload] = useState(0);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);

  useEffect(() => {
    console.log(labelList);
    console.log(labelArray);
  }, [labelList, labelArray]);

  //LABEL GET
  useEffect(() => {
    const getLabelList = async () => {
      try {
        const result = await axios.get(`${HOST}/api/v1/label`);
        console.log(result.data);
        const list = result.data.sort((a: Label, b: Label) => b.count! - a.count!);
        setLabelList(list);
      } catch (error) {
        console.log(error);
      }
    };
    getLabelList();
  }, [reload]);

  const NewLabelModal = () => {
    const [newLabel, setNewLabel] = useState({ title: '', color: '', unit: '' });
    const [amount, onChangeAmount, setAmount] = useInput('');

    useEffect(() => {
      let color_r = Math.floor(Math.random() * 127 + 128).toString(16);
      let color_g = Math.floor(Math.random() * 127 + 128).toString(16);
      let color_b = Math.floor(Math.random() * 127 + 128).toString(16);
      setNewLabel((prev) => ({ ...prev, color: `#${color_r + color_g + color_b}` }));
    }, []);

    const onChangeNewLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewLabel((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const pushLabel = () => {
      if (0 === Number(amount!)) {
        alert('올바른 값을 입력하세요');
        return;
      }
      let found = labelArray.find((label) => label.title === selectedLabel!.title);
      if (found) found.amount! = Number(found.amount!) + Number(amount!);
      else setLabelArray((prev) => [...prev, { ...selectedLabel, amount: Number(amount) } as Label]);
      setSelectedLabel(null);
      setIsLabelModalOpen(false);
    };

    const postLabel = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (0 === Number(amount!)) {
        alert('올바른 값을 입력하세요');
        return;
      }
      e.preventDefault();
      try {
        await axios.post(`${HOST}/api/v1/label`, newLabel).then((res) => {
          if (res.status === 201) {
            setLabelArray((prev) => [...prev, { ...newLabel, amount: Number(amount), idx: res.data.idx } as Label]);
            setIsLabelModalOpen(false);
            setReload(reload + 1);
          }
        });
      } catch (error) {
        alert('이미 존재하는 라벨입니다.');
      }
    };

    //추가 modal
    return (
      <LabelModal>
        <LabelModalTable>
          <tbody>
            <tr>
              <th>
                {selectedLabel ? (
                  <ModalInputTitle>
                    <LabelListItem delete={false} color={selectedLabel.color}>
                      {selectedLabel?.title}
                    </LabelListItem>
                  </ModalInputTitle>
                ) : (
                  <ModalInputTitle>
                    <InputBar width="4.6rem" align="left" placeholder="라벨 이름" name="title" value={newLabel.title} onChange={onChangeNewLabel} />
                    <ColorPicker type="color" name="color" value={newLabel.color} onChange={onChangeNewLabel} />
                  </ModalInputTitle>
                )}
              </th>
              <th>{selectedLabel ? <h4> {selectedLabel?.unit}</h4> : <InputBar placeholder="단위" align="right" width="2rem" name="unit" value={newLabel.unit} onChange={onChangeNewLabel} />}</th>
            </tr>
            <tr>
              <td colSpan={2}>
                <InputBar align="right" type="number" min="1" onChange={onChangeAmount} value={amount} placeholder="숫자를 입력하세요" />
              </td>
            </tr>
          </tbody>
        </LabelModalTable>
        <SubmitButton onClick={selectedLabel ? pushLabel : postLabel}>ADD LABEL!</SubmitButton>
      </LabelModal>
    );
  };

  const openNewLabelModal = () => {
    setIsLabelModalOpen(true);
    setSelectedLabel(null);
  };

  const openAddLabelModal = (item: Label) => {
    setIsLabelModalOpen(true);
    setSelectedLabel(item);
  };

  //DELETE LABEL
  const deleteLabel = async (e: React.MouseEvent<SVGElement>) => {
    const LabelIdx = e.currentTarget!.dataset.idx;
    popLabelItem(Number(LabelIdx));
    e.stopPropagation();
    try {
      await axios.delete(`${HOST}/api/v1/label/${LabelIdx}`).then((res) => {
        if (res.status == 200) setReload(reload + 1);
      });
    } catch (error) {
      alert('태그 삭제에 실패했습니다.');
    }
  };

  // 전체 라벨
  const LabelList = () => {
    return (
      <LabelListContainer>
        <PlusButton onClick={openNewLabelModal} />
        {labelList &&
          labelList.map((item: Label) => {
            return (
              <LabelListItem delete={item.count === 0} key={item.idx} color={item.color} onClick={(e) => openAddLabelModal(item)}>
                <span>{item.title}</span>
                {item.count === 0 && <DeleteButton data-idx={item.idx} type="button" onClick={deleteLabel} />}
              </LabelListItem>
            );
          })}
      </LabelListContainer>
    );
  };

  //라벨 선택 해제
  const popLabelItem = (idx: number) => {
    setLabelArray((prev) => prev.filter((item) => item.idx !== idx));
  };

  // 선택한 라벨
  const SelectedLabelList = () => {
    return (
      <SelectedLabelListContainer>
        {labelArray.length === 0 ? (
          <LabelListItem delete={false}>라벨을 추가하세요</LabelListItem>
        ) : (
          labelArray.map(({ idx, color, title, unit, amount }: Label) => {
            return (
              <LabelListItem delete={true} key={idx} color={color}>
                <span>
                  {title} {amount} {unit}
                </span>
                <DeleteButton onClick={(e) => popLabelItem(idx)} />
              </LabelListItem>
            );
          })
        )}
      </SelectedLabelListContainer>
    );
  };

  return (
    <LabelInputContainer>
      {isLabelModalOpen && <Modal component={<NewLabelModal />} zIndex={1001} top={'50%'} left={'50%'} transform={'translate(-50%, -50%)'} handleDimmedClick={(e) => setIsLabelModalOpen(false)} />}
      <SelectedLabelList />
      <LabelList />
    </LabelInputContainer>
  );
};

export default LabelInput;

const LabelInputContainer = styled.div`
  margin: auto;
`;

export const LabelModalTable = styled.table`
  background-color: var(--color-gray0);
  width: 13rem;
  border-collapse: collapse;
  border-radius: 10px;
  table-layout: fixed;
  box-shadow: 0 0 0 1px var(--color-gray3);
  font-size: 0.8rem;
  margin: 0.5rem;
  tr,
  th,
  td {
    padding: 0rem;
    height: 2.3rem;
    text-align: right;
    align-items: center;
    justify-content: end;
    font-weight: normal;
  }
  th: nth-child(1) {
    width: 9rem;
    text-align: left;
    justify-content: space-between;

    border-right: 1px solid var(--color-gray3);
  }
  tr: nth-child(1) {
    border-bottom: 1px solid var(--color-gray3);
  }

  h4 {
    font-weight: normal;
    display: inline;
    margin: 0px;
    padding: 0rem 1rem 0rem 1rem;
  }
`;

const ModalInputTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputBar = styled.input<{ align: string }>`
  background: none;
  border: 0px;
  width: ${(props) => props.width || '11rem'};
  text-align: ${(props) => props.align || 'right'};
  height: 2.3rem;
  padding: 0rem 1rem 0rem 1rem;
  ::placeholder {
    color: var(--color-gray5);
  }
`;

const LabelListContainer = styled.div`
  border: 1px solid var(--color-gray3);
  background-color: var(--color-gray0);
  border-radius: 20px;
  height: 2.2rem;
  width: 23.6rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  overflow-x: scroll;
`;

const SelectedLabelListContainer = styled.div`
  height: 2.8rem;
  width: 23.6rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  overflow: scroll;
`;

const LabelListItem = styled.div<{ delete: boolean }>`
  flex: 0 0 auto;
  color: white;
  background-color: ${(props) => props.color || 'var(--color-gray5)'};
  cursor: pointer;
  margin: ${(props) => (props.delete ? '3px' : '0px 0px 0px 10px')};
  padding: ${(props) => (!props.delete ? '2px 15px 2px 19px' : '2px 6px 2px 19px')};
  height: 19px;
  line-height: 19px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;

  span {
    padding-right: 8px;
  }

  :hover {
    filter: contrast(105%);
  }
`;

const LabelModal = styled.div`
  width: 19rem;
  height: 13.5rem;
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: white;
  border-radius: 1.5rem;
`;
const DeleteButton = styled(RiCloseLine)`
  width: 10px;
  height: 10px;
  padding: 3px;
  display: inline-block;
  cursor: pointer;
`;

const PlusButton = styled(FiPlus)`
  min-width: 17px;
  height: 17px;
  display: inline-block;
  padding: 3px;
  color: var(--color-gray6);
  border: 1px solid var(--color-gray4);
  border-radius: 50px;
  cursor: pointer;
  margin: 0px 3px 0px 6px;
`;
const ColorPicker = styled.input`
  cursor: pointer;
  border: 1px solid var(--color-gray3);
  padding: 0px;
  margin: 0.5rem;
  background-color: inherit;
  width: 1.2rem;
  height: 1.2rem;

  ::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  ::-webkit-color-swatch {
    border: none;
  }
`;

export const SubmitButton = styled.button`
  background: var(--color-main);
  font-family: var(--font-title);
  height: 2rem;
  border: 0px;
  border-radius: 5rem;
  color: white;
  width: 13rem;
  margin-top: 0.7rem;
  font-size: 0.7rem;
  cursor: pointer;
`;
