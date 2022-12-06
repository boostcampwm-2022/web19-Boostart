import styled from 'styled-components';

const Modal = ({ component, zIndex, top, bottom, left, right, transform, handleDimmedClick, dimmedBorderRadius }: ModalProps) => {
  return (
    <>
      <ModalContent zIndex={zIndex} top={top} bottom={bottom} left={left} right={right} transform={transform}>
        {component}
      </ModalContent>
      <Dimmed zIndex={zIndex - 1} onClick={handleDimmedClick} borderRadius={dimmedBorderRadius} />
    </>
  );
};

const ModalContent = styled.div<{ zIndex: number; top?: string; bottom?: string; left?: string; right?: string; transform?: string }>`
  position: fixed;
  z-index: ${(props) => props.zIndex};
  ${(props) => props.top && `top: ${props.top};`}
  ${(props) => props.bottom && `bottom: ${props.bottom};`}
  ${(props) => props.left && `left: ${props.left};`}
  ${(props) => props.right && `right: ${props.right};`}
  ${(props) => props.transform && `transform: ${props.transform};`}
`;

export const Dimmed = styled.div<{ zIndex: number; borderRadius?: string }>`
  position: fixed;
  z-index: ${(props) => props.zIndex};
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  background-color: black;
  ${(props) => (props.borderRadius ? `border-radius:${props.borderRadius}` : '')}
`;

export default Modal;
