import DateSelector from './DateSelector';
import * as S from './SubContainer.style';

interface SubContainerProps {
  title: string;
  element: JSX.Element;
}

const SubContainer = ({ title, element }: SubContainerProps) => {
  return (
    <>
      <S.Title>{title}</S.Title>
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
