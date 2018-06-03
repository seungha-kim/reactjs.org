---
id: composition-vs-inheritance
title: 합성 (composition) vs 상속 (inheritance)
permalink: docs/composition-vs-inheritance.html
redirect_from: "docs/multiple-components.html"
prev: lifting-state-up.html
next: thinking-in-react.html
---

React는 강력한 합성 모델을 가지고 있기 때문에, 컴포넌트 간에 코드를 재사용해야할 때는 상속 대신 합성을 사용하는 것을 권장합니다.

이 섹션에서는 React를 새로 접한 개발자들이 상속으로 풀려고 하는 몇 가지 문제들을 살펴보고, 이를 합성으로 어떻게 풀 수 있는지를 다룹니다.

## 다른 컴포넌트를 담기

종종 컴포넌트에 어떤 자식이 들어올 지 미리 알 수 없는 경우가 있습니다. 이는 범용의 "박스" 역할을 하는 `Sidebar` 나 `Dialog` 같은 컴포넌트에서 많이 나타나는 패턴입니다.

이러한 경우, `children`이라는 특별한 prop을 통해 자식 요소를 출력에 그대로 전달하는 방법을 사용해보세요.

```js{4}
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

이렇게 하면, 다른 컴포넌트에서 JSX를 중첩하여 어떤 자식이든 전달할 수 있습니다.

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

`<FancyBorder>` JSX 태그 안에 있는 것들은 `FancyBorder` 컴포넌트의 `children` prop을 통해 전달됩니다. `FancyBrorder` 는 `{props.children}` 를 `<div>` 안에 렌더링하므로 전달된 요소들이 최종 출력에 나타납니다.

일반적이지는 않지만, 가끔은 컴포넌트에 여러 개의 "구멍"이 필요할 수 있습니다. 이런 경우에는 `children` 대신에 자신만의 관례를 만들어 사용할 수도 있습니다.

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

`<Contacts />` 나 `<Chat />` 같은 React 요소는 단순 객체이기 때문에, 다른 데이터와 마찬가지로 props를 통해 전달할 수 있습니다. 이 접근법은 다른 라이브러리들에서 사용하는 "슬롯 (slots)"과 비슷해보이지만, React에서는 props로 무엇이든 전달할 수 있습니다.

## 특수화 (Specialization)

종종 어떤 컴포넌트의 "특수한 경우 (special case)"인 컴포넌트를 만들어야 하는 경우가 있습니다. 예를 들어 `WelcomeDialog` 는 `Dialog` 의 특수한 경우라고 말할 수 있습니다.

React에서는 이러한 경우 역시 합성을 사용합니다. 더 "구체적인" 컴포넌트가 "일반적인" 것을 렌더링하고 props을 통해 구체적인 내용을 설정합니다.

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

합성은 클래스로 정의한 컴포넌트에서도 똑같이 적용됩니다.

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

Facebook에서는 수천 개의 React 컴포넌트를 사용하고 있지만, 컴포넌트 상속 계층구조를 사용해야할 만한 사례를 발견하지 못했습니다.

props와 합성을 사용하면 컴포넌트의 모양과 동작을 유연하게 커스터마이징할 수 있으며 또한 명시적이고 안전합니다. 컴포넌트는 어떤 props든 받을 수 있다는 사실을 기억하세요. 원시 타입의 값, React 요소, 함수 등을 포함해서 말이죠.

UI가 아닌 기능을 여러 컴포넌트에 걸쳐 재사용하려면, 별도의 자바스크립트 모듈로 추출하는 것이 좋습니다. 함수든, 객체든, 클래스든 컴포넌트에서 이를 가져와서 사용할 수 있습니다. 상속을 할 필요없이 말이죠.