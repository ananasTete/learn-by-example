import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  const { currentTheme } = useContext(ThemeContext);
  const styles = currentTheme.button;

  return (
    <button style={styles} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;