import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import GlobalStyles from './styles/GlobalStyles';
import ThemeSwitcher from './components/ThemeSwitcher';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <ThemeSwitcher />
    </ThemeProvider>
  );
};

export default App;