---
id: composition-vs-inheritance
title: 구성 (composition) vs 상속 (inheritance)
permalink: docs/composition-vs-inheritance.html
redirect_from: "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React는 강력한 구성 모델을 가지고 있으며 상속 대신 구성을 사용하여 컴포넌트 사이의 코드를 재활용하는 걸 권장합니다.

이 섹션에서는 React를 새로 접한 개발자들이 상속을 대할 때 겪는 몇가지 문제점에 대한 고려사항과 구성으로 어떻게 해결했는 지 보여줍니다.

## 방지 (Containment)

일부 컴포넌트는 자식을 미리 알 수 없습니다. 이는 일반적으로 "박스"로 나타나는 `Sidebar` 나 `Dialog` 같은 컴포넌트에서 특히 일반적입니다.

이러한 컴포넌트는 특수한 `children` prop을 사용하여 자식 요소를 출력에 직접 전달하는 것이 좋습니다.

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

이렇게 하면 JSX를 중첩하여 다른 컴포넌트가 임의의 자식을 전달할 수 있습니다.

```js{4-9}
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)

`<FancyBorder>` JSX 태그 안에 있는 것들은 `FancyBorder` 컴포넌트의 `children` prop을 통해 전달됩니다. `FancyBrorder` 는 `{props.children}` 를 `<div>` 안에 렌더링하므로 전달된 요소는 최종 출력에 나타납니다.

일반적이지는 않지만 가끔 컴포넌트에 여러 개의 "구멍"이 필요할 수 있습니다. 이런 경우에는 `children` 을 사용하는 대신에 자신만의 컨벤션을 사용할 수도 있습니다.

```js{5,8,18,21}
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

`<Contacts />` 나 `<Chat />` 같은 React 요소는 단순 객체로 어떤 다른 데이터든 props를 통해 전달할 수 있습니다. 이 접근법은 라은 라이브러리의 "슬롯 (slots)"를 생각나게할 수 있지만 React에서 props로 전달할 수 있는 것에는 제한이 없습니다.

## 특수화 (Specialization)

가끔 컴포넌트가 다른 컴포넌트의 "특수한 경우 (special case)"라고 생각합니다. 예를 들어 `WelcomeDialog` 는 `Dialog` 의 특수한 경우라고 말할 수 있습니다.

React에서 이 또한 구성으로 성취할 수 있습니다. 더 "구체적인" 컴포넌트가 "일반적인" 것으로 렌더링하고 props로 구성합니다.

```js{5,8,16-18}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

구성은 클래스로 정의한 컴포넌트에서도 똑같이 적용됩니다.

```js{10,27-31}
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />
        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## 그래서 상속이 무엇인가요?

Facebook에서는 수천개의 컴포넌트에서 React를 사용하고 있지만 컴포넌트 상속 계층구조를 만드는 것이 권장되는 사용 케이스는 찾지 못했습니다.

props와 구성은 명시적이며 안전한 방법으로 컴포넌트의 모양과 동작을 커스터마이징하는 데 필요한 모든 유연성을 제공합니다. 컴포넌트는 기본 값, React 요소 함수를 비롯한 임의의 props를 수용할 수 있습니다.

컴포넌트 간 UI가 아닌 기능을 재사용하려면 별도의 자바스크립트 모듈로 추출하는 것이 좋습니다. 컴포넌트는 이를 가져오거나 함수, 객체 또는 클래스를 확장하지 않고 사용할 수 있습니다.