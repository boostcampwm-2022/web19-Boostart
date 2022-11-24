import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

export const Rating = styled.div`
  & :hover svg {
    color: #d4b400;
  }

  & svg:hover ~ svg {
    color: var(--color-gray4);
  }

  & svg {
    width: 1.45rem;
    height: 1.45rem;
    margin-bottom: -0.3rem;
    padding-right: 0.2rem;
    cursor: pointer;
    transition: 200ms;
    transition-timing-function: ease-in-out;
    -webkit-transition: 200ms;
    -webkit-transition-timing-function: ease-in-out;
  }
`;

export const Star = styled(FaStar)<{ clicked: boolean }>`
  color: var(--color-gray4);
  ${(props) => props.clicked && 'color : #d4a400'};
`;
