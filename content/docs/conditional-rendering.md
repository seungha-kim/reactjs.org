---
id: conditional-rendering
title: 조건부 렌더링
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from: "tips/false-in-jsx.html"
---

React에서는, 컴포넌트를 만들어서 원하는 동작을 캡슐화할 수 있습니다. 그리고 나서, 어플리케이션의 상태에 따라 컴포넌트의 일부만 렌더링할 수 있습니다.

React의 조건부 렌더링은 자바스크립트의 조건문과 동일한 방식으로 동작합니다. [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 나 [조건 연산자](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 같은 자바스크립트 연산자를 사용하여 현재 상태를 표현하는 요소를 만들고, 요소에 맞게 UI를 갱신하세요.

두 컴포넌트를 살펴봅시다.

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

사용자의 로그인 여부에 따라 다음 컴포넌트 중 하나를 표시하는 `Greeting` 컴포넌트를 만들었습니다.

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // Try changing to isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

이 예제는 `isLoggedIn` prop의 값에 따라 다른 메시지를 노출시킵니다.

### 요소 변수

요소를 담기 위해 변수를 사용할 수 있습니다. 이렇게 하면 다른 부분을 바꾸지 않으면서도 컴포넌트의 일부를 조건부로 렌더링하기가 쉬워집니다.

로그아웃과 로그인 버튼을 나타내는 두 개의 새 컴포넌트를 살펴봅시다.

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

위 예제에서, `LoginControl` 이라는 [stateful 컴포넌트](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) 를 생성했습니다.

이 컴포넌트는 현재 상태에 따라 `<LoginButton />` 혹은 `<LogoutButton />` 중 하나를 렌더링 할 것입니다. 이전 예제에서 만들었던 `<Greeting />` 도 렌더링합니다.

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

변수를 선언하고 `if` 문을 사용하는 것은 조건부로 컴포넌트를 렌더링하는 훌륭한 방법이지만, 원한다면 더 짧은 문법을 사용할 수도 있습니다. JSX에 조건을 인라인으로 넣는 몇가지 방법을 소개합니다.

### && 논리 연산자를 사용해 if를 인라인으로 넣기

중괄호로 감싸면 [JSX에 어떤 표현식이건 넣을 수](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 있습니다. 여기에는 자바스크립트 `&&` 논리 연산자도 포함됩니다. 이를 사용하면 요소를 조건부로 포함시키는 작업을 더 편하게 할 수 있습니다.

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

이 코드는 잘 동작하는데, 자바스크립트에서 `true && expression` 은 항상 `expression` 으로 평가되고, `false && expression` 은 항상 `false` 로 평가되기 때문입니다.

따라서 조건이 `true` 라면 `&&` 다음에 오는 요소가 노출됩니다. 만약 조건이 `false` 라면, React는 이를 무시하고 건너뜁니다.

### 조건부 연산자를 사용해 if-else 인라인으로 넣기

인라인으로 요소를 조건부 렌더링하는 다른 방법은 자바스크립트의 조건부 연산자인 [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 를 사용하는 것입니다.

아래 예제에서, 작은 텍스트 블록을 조건부로 렌더링합니다.

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

좀 지저분하긴 하지만, 어쨌든 큰 표현식에서도 사용할 수는 있습니다.

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn ? (
        <LogoutButton onClick={this.handleLogoutClick} />
      ) : (
        <LoginButton onClick={this.handleLoginClick} />
      )}
    </div>
  );
}
```

자바스크립트에서와 마찬가지로 당신과 당신의 팀이 더 읽기 쉽다고 생각하는 것을 바탕으로 적절한 스타일을 선택하면 됩니다. 또한 조건이 너무 복잡해질 때마다 [컴포넌트를 추출](/docs/components-and-props.html#extracting-components) 하는 것이 좋습니다.

### 컴포넌트가 렌더링 되지 못하도록 방지

흔하지 않지만 어떤 컴포넌트에 의해 렌더링된 컴포넌트를 숨기고 싶은 경우가 있습니다. 이렇게 하려면 요소 대신 `null` 을 반환하면 됩니다.

아래 예제에서, `<WarningBanner />` 는 `warn` prop의 값에 의존해 렌더링됩니다. 만약 prop 값이 `false` 라면, 이 컴포넌트는 렌더링되지 않습니다.

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true}
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(prevState => ({
      showWarning: !prevState.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

컴포넌트의 `render` 메서드에서 `null` 을 반환한다고 해서, 컴포넌트의 라이프사이클 메서드 호출 과정에 영향을 미치지는 않습니다. 예를 들어, `componentWillUpdate` 와 `componentDidUpdate` 가 여전히 호출됩니다.