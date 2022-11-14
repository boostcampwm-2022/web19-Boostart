import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(var(--color-main) 55%, #ffffff 50%);
    height: 100vh;
    place-items: center;
    display:grid;
  }
`;
