import DateSelector from './DateSelector';
import * as S from './SubContainer.style';
import { useRecoilState } from 'recoil';
import { visitState } from '../common/atoms';

interface SubContainerProps {
  title: string;
  element: JSX.Element;
}

const SubContainer = ({ title, element }: SubContainerProps) => {
  const [currentVisit, setCurrentVisit] = useRecoilState(visitState);

  return (
    <>
      <S.Title>
        {title}
        <span> {currentVisit.isMe || `~${currentVisit.userId}`}</span>
      </S.Title>
      <S.Content>
        <S.NavBarSection>
          <DateSelector />
        </S.NavBarSection>
        {element}
      </S.Content>
    </>
  );
};

export default SubContainer;
