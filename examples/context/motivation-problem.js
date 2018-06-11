class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // highlight-range{1-4,7}
  // Toolbar 컴포넌트는 반드시 별도의 "theme" prop을 받아서
  // ThemedButton 컴포넌트에 이를 넘겨주어야 합니다.
  // 만약 앱에서 사용되는 모든 버튼에 theme prop을 넘겨주어야 한다면
  // 이는 굉장히 힘든 작업이 될 것입니다.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

function ThemedButton(props) {
  return <Button theme={props.theme} />;
}
