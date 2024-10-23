// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body, html {
    height: 100%;
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    background-color: #ADD8E6; /* Warna biru muda */
    display: flex;
    justify-content: flex-start; /* Letakkan di kiri */
    align-items: flex-start; /* Letakkan di atas */
    padding: 20px; /* Tambahkan sedikit padding agar tidak terlalu menempel */
  }

  #root {
    width: 100%;
    height: 100%;
  }
`;

export default GlobalStyle;
