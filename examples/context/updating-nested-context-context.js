// createContext에 넘겨주는 기본값의 모양이
// 실제 consumer에서 사용되는 값과 일치하도록 신경써주세요!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
