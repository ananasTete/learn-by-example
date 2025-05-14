import React, { useContext } from 'react';
import { createGlobalStyle } from 'styled-components';
import { ThemeContext } from '../contexts/ThemeContext';

const GlobalStyle = createGlobalStyle<{ theme: any }>`
  body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const GlobalStyles: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  return <GlobalStyle theme={theme} />;
};

export default GlobalStyles;