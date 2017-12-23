---
id: components-and-props
title: 컴포넌트와 props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

컴포넌트를 사용하여 UI를 독립적이고 재사용 가능한 부분으로 분리하고 각 부분을 독립적으로 생각할 수 있습니다.

개념상 컴포넌트는 자바스크립트 함수와 비슷합니다. 임의의 입력 ("props"라고 부르는)을 받아들이고 어떤 게 화면에 나타나야 하는 지를 설명하는 React 요소를 반환합니다.

## 함수형 및 클래스 컴포넌트

컴포넌트를 정의하는 가장 간단한 방법은 자바스크립트 함수로 작성하는 것입니다.

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

이 함수는 단일 "props" (속성을 나타냄) 객체 인수를 받고 React 요소를 반환하기 때문에 유효한 React 컴포넌트입니다.
이러한 컴포넌트는 말 그대로 자바스크립트 함수이기 때문에 "함수형"이라고 부릅니다.

컴포넌트를 정의하기 위해 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 를 사용할 수도 있습니다.

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

우 컴포넌트는 React 관점에서 보면 동일합니다.

클래스는 몇가지 기능을 더 가지고 있는데 이는 [다음 섹션](/docs/state-and-lifecycle.html) 에서 다룹니다. 그 때까지 간결함을 유지하기 위해 함수형 컴포넌트를 사용할 것입니다.

## 컴포넌트 렌더링

이전에는 DOM 태그를 나타내는 React 요소만 있었습니다.

```js
const element = <div />;
```

그러나, 요소에 유저가 정의한 컴포넌트를 나타낼 수도 있습니다.

```js
const element = <Welcome name="Sara" />;
```

React가 유저가 정의한 컴포넌트를 나타내는 요소를 볼 때 JSX 속성을 이 컴포넌트에 단일 객체로 전달합니다. 이 객체를 "props" 라고 부릅니다.

예를 들어, 이 코드는 "Hello, Sara"를 페이지에 렌더링합니다.

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component).

이 예제에서 무슨 일이 일어났는 지 다시 살펴봅시다.

1. `<Welcome name="Sara" />` 요소로 `ReactDOM.render()` 를 호출합니다.
2. React가 `{name: 'Sara'}` 를 props로 하여 `Welcome` 컴포넌트를 호출합니다.
3. `Welcome` 컴포넌트가 그 결과로 `<h1>Hello, Sara</h1>` 요소를 반환합니다.
4. React DOM이 `<h1>Hello, Sara</h1>` 과 일치하도록 DOM을 효율적으로 업데이트합니다.

>**Caveat:**
>
> 컴포넌트 이름은 항상 대문자로 시작하길 바랍니다.
>
> 예를 들어 `<div />` 는 DOM 태그를 나타내지만 `<Welcome />` 은 컴포넌트를 나타내며 스코프에 `Welcome` 을 필요로 합니다.

## 컴포넌트 결합

컴포넌트는 출력될 때 다른 컴포넌트를 참조할 수 있습니다. 이를 통해 모든 세부 레벨에서 동일한 컴포넌트 추상화를 사용할 수 있습니다.  React 앱에서 버튼, 폼, 다이얼로그, 스크린 같은 것들은 모두 일반적으로 컴포넌트로 표현됩니다.

예를 들어, `Welcome` 을 여러번 렌더링하는 `App` 컴포넌트를 만들 수 있습니다.

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components).

일반적으로, 새 React 앱은 단일 `App` 컴포넌트를 최상위에 둡니다. 그러나 기존 앱에 React를 도입하는 경우, `Button` 같은 작은 컴포넌트부터 덩치를 키워나가기 시작하여 점차적으로 뷰 계층의 최상단으로 나아갈 수 있습니다.

## 컴포넌트 추출

컴포넌트를 더 작은 컴포넌트로 쪼개는 것을 두려워하지 마십시오.

예를 들어, `Comment` 컴포넌트를 살펴봅시다.

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components).

이 컴포넌트는 `author` (객체), `text` (문자열), `date` (date)를 props로 받고, 소셜 미디어 웹사이트의 덧글을 나타냅니다.

이 컴포넌트는 중첩 때문에 변경하기 까다로울 수 있으며, 각 파트를 다시 사용하기도 어렵습니다. 여기에서 몇가지 컴포넌트를 추출해봅시다.

먼저, `Avatar` 를 추출할 수 있습니다.

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

`Avatar` 는 `Comment` 내에서 렌더링되는 지 알 필요가 없습니다. 따라서 속성을 `author` 대신 `user` 라는 더 일반적인 이름을 사용합니다. 컴포넌트가 사용되는 상황이 아닌 컴포넌트 자체 관점에서 props 이름을 짓는 걸 권장합니다.

이제 `Comment` 를 약간 단순화시킬 수 있습니다.

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

이어서, `Avartar` 다음에 유저의 이름을 렌더링하는 `UserInfo` 컴포넌트를 추출해봅시다.

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

이제 `Comment` 가 더 단순해졌습니다.

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued).

컴포넌트를 추출하는 건 처음에는 쓸데없는 일처럼 보일 수 있지만 재사용 가능한 컴포넌트 팔레트를 사용하면 큰 앱에서 비용을 줄입니다. 좋은 규칙은 UI의 일부가 여러번 사용되거나 (`Button`, `Panel`, `Avatar`), 자체적으로 충분히 복잡하면서 (`App`, `FeedStory`, `Comment`), 재사용 가능한 컴포넌트가 될 후보들 입니다.

## Props는 읽기전용

컴포넌트를 [함수나 클래스](#functional-and-class-components) 중 어떤 걸로 선언했 건, props를 수정할 수 없습니다. `sum` 함수를 살펴봅시다.

```js
function sum(a, b) {
  return a + b;
}
```

일부 함수는 입력을 변경하려 하지 않고 항상 동일한 입력에 대해 동일한 결과를 반환하기 때문에 ["순수"](https://en.wikipedia.org/wiki/Pure_function) 함수라고 부릅니다.

대조적으로, 이 함수는 입력을 변경하기 때문에 순수하지 않습니다.

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React는 매우 유연하지만 한가지 엄격한 규칙이 있습니다.

**모든 React 컴포넌트는 props와 관련한 동작을 할 때 순수 함수처럼 동작해야한다.**

물론 어플리케이션 UI는 동적이며 시간이 지남에 따라 변합니다. [다음 섹션](/docs/state-and-lifecycle.html) 에서는 새로운 컨셉인 "state"를 소개합니다. state는 React 컴포넌트가 이 규칙을 어기지 않고 유저 액션, 네트워크 응답, 기타 등등에 대한 응답으로 시간 경과에 따라 출력을 변경할 수 있게 합니다.