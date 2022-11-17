import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(var(--color-main) 55%, #ffffff 45%) fixed;
    height: 100vh;
    width: 100vw;
  }
`;
