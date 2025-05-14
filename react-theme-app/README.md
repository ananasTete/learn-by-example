# React Theme App

This project is a React application that allows users to toggle between light and dark themes. It utilizes TypeScript for type safety and provides a clean structure for managing themes through context.

## Features

- **Theme Switching**: Users can easily switch between light and dark themes using a simple toggle.
- **Context API**: The application uses React's Context API to manage and provide theme data throughout the component tree.
- **Styled Components**: The button and other components are styled according to the current theme.

## Project Structure

```
react-theme-app
├── src
│   ├── components
│   │   ├── Button.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── contexts
│   │   └── ThemeContext.tsx
│   ├── styles
│   │   ├── themes
│   │   │   ├── dark.ts
│   │   │   └── light.ts
│   │   └── GlobalStyles.tsx
│   ├── types
│   │   └── theme.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── ThemeProvider.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd react-theme-app
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run:
```
npm start
```

This will launch the app in your default web browser.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.