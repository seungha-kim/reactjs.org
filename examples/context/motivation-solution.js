// highlight-range{1-4}
// Context를 사용하면 prop을 일일이 엮어주지 않고도
// 컴포넌트 트리의 깊은 곳에 값을 넘겨줄 수 있습니다.
// 테마에 대한 context를 만들어줍시다. ("light"를 기본값으로 합니다.)
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // highlight-range{1-3,5}
    // Provider를 사용해서 현재 테마를 트리 아래쪽으로 넘겨줍시다.
    // 어떤 컴포넌트든 이 값을 읽을 수 있습니다. 아주 깊은 곳에 위치해있더라도 말이죠.
    // 아래에서는, "dark"라는 값을 넘겨주었습니다.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// highlight-range{1,2}
// 이제 더이상 중간 계층에 있는 컴포넌트에서
// theme prop을 넘겨줄 필요가 없습니다.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton(props) {
  // highlight-range{1-3,6}
  // 테마 context를 읽어오려면 Consumer를 사용하세요.
  // React는 가장 가까운 Provider를 찾아서 그 값을 사용할 것입니다.
  // 이 예제에서, theme 값은 "dark"가 됩니다.
  return (
    <ThemeContext.Consumer>
      {theme => <Button {...props} theme={theme} />}
    </ThemeContext.Consumer>
  );
}
