import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';

// ThemedButton를 사용하는 중간 계층의 컴포넌트입니다.
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };
  }

  render() {
    //highlight-range{1-3}
    // ThemeProvider 내부의 ThemedButton은
    // state에 저장되어 있는 theme을 사용하는 반면, 바깥에서는
    // 기본값으로 설정된 dark 테마가 사용됩니다.
    //highlight-range{3-5,7}
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}

ReactDOM.render(<App />, document.root);
