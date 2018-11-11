---
id: tutorial
title: "Tutorial: Intro To React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

## 시작하기 전에

### 우리가 만들 것

여기서는 동작하는 틱택토 게임을 만들어 볼 것입니다.

최종 결과를 바로 확인하고 싶다면, [이 페이지](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)를 방문하세요. 지금은 이 코드가 이해되지도 않고 문법도 익숙치 않으실 겁니다. 이 튜토리얼을 통해 이러한 게임을 어떻게 만들 수 있는지 차근차근 배워볼 것입니다.

게임을 플레이 해보세요. 버튼을 클릭해서 이전 턴으로 돌아갈 수도 있으니 확인해주세요.

어느 정도 게임을 플레이했다면 탭을 닫으시고, 단순한 템플릿부터 시작해봅시다.

### 필요한 지식

이 문서는 여러분이 HTML과 JavaScript에 익숙하다는 가정 하에 쓰여졌습니다.

### 튜토리얼을 따라오는 방법

이 튜토리얼을 완성하는 데 두 가지 방법이 있습니다. 브라우저에서 코드를 작성할 수도 있고, 컴퓨터에 개발 환경을 설치할 수도 있습니다. 편하신 쪽을 선택하세요.

#### 브라우저에서 코드를 작성하고 싶다면

이 방법이 가장 빠른 방법입니다!

먼저, 이 [시작 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)를 새 탭에서 열어주세요. 텅 빈 틱틱토 게임판이 나타날 것입니다. 튜토리얼을 따라 해당 게임판의 코드를 작성해주세요.

다음 섹션은 건너뛰고 개요를 바로 읽어보세요.

#### 사용중인 에디터에서 코드를 작성하고 싶다면

~생략~

## 개요

### React가 무엇인가요?

React는 선언적이고, 효율적이며, 유연한 JavaScript 라이브러리입니다. React는 UI를 제작할 때 사용하기 위해 만들어졌습니다. React를 사용하면, "컴포넌트"라 불리는 여러 격리된 코드 조각을 조합해서, 복잡한 UI를 쉽게 만들 수 있습니다.

React의 컴포넌트에는 두 가지 종류가 있습니다. 일단은 `React.Component`의 서브클래스부터 봅시다:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// 사용 예제: <ShoppingList name="Mark" />
```

XML과 비슷하게 생긴 위 태그의 사용법을 곧 살펴볼 것입니다. 우리는 화면을 어떻게 그릴지를 React에게 알려주기 위해 컴포넌트를 사용합니다. 데이터가 변경되면, React는 컴포넌트를 효율적으로 갱신합니다. (즉, 다시 그립니다.)

위에서 본 ShoppingList는 **React 컴포넌트 클래스**입니다. 컴포넌트는 props ("properties"의 줄임말)이라 불리는 매개변수를 받아서, `render` 메소드에서 뷰의 계층 구조를 반환합니다.

`render` 메소드는 무엇을 그릴지에 대한 *설명*을 반환합니다. 그러면 React는 그것을 받아 화면에 그려줍니다. 여기서 `render`가 반환하는 것은 **React 엘리먼트**로, '무엇을 그릴지'에 대한 정보를 담고있는 객체입니다. 대부분의 React 개발자들은 이러한 구조를 쉽게 표현할 수 있는 JSX라는 특별한 문법을 사용합니다. `<div />`라는 JSX 코드는, 빌드 과정에서 `React.createElement('div')`로 변환됩니다. 위 예제는 사실 아래 코드와 같습니다:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[전체 예제를 여기서 확인하세요.](babel://tutorial-expanded-version)

좀 더 알고싶으시다면, [API reference](/docs/react-api.html#createelement)에서 `createElement()`에 대한 자세한 설명을 읽어보세요. 하지만 이 튜토리얼에서는 이 함수를 직접 사용하지 않을 것입니다. 대신, 우리는 JSX를 계속 사용합시다.

JSX 안에서는 JavaScript를 자유롭게 활용할 수 있습니다. JSX 중괄호 안에는 어떤 JavaScript 표현식도 넣을 수 있습니다. 그리고 React 엘리먼트는 JavaScript 객체로, 변수에 담거나 프로그램의 다른 부분으로 넘기는 것이 가능합니다.

위 예제의 ShoppingList 컴포넌트는 브라우저에 내장된 DOM 컴포넌트(`<div />`, `<li />`)만 그려주고 있습니다. 하지만 React 컴포넌트를 조합해서 그리는 것도 가능합니다. 예를 들어, 우리는 전체 쇼핑 목록을 그리기 위해 `<ShoppingList />`와 같이 쓸 수 있습니다. 각각의 React 컴포넌트는 독립적이며 캡슐화되어 있습니다. 이 성질은 우리가 단순한 컴포넌트로부터 복잡한 UI를 만드는 일을 가능하게 해 줍니다.

### 시작 코드 살펴보기

[시작 코드](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)를 열어서 시작해봅시다.

우리는 이 시작 코드 위에서 작업을 할 것입니다. CSS 코드를 미리 작성해두었으니 React를 배우는 데에만 집중하세요.

코드를 살펴보면, 세 개의 React 컴포넌트가 있습니다.

* Square
* Board
* Game

Square 컴포넌트는 하나의 `<button>`을 그리고, Board 컴포넌트는 9개의 Square을 그리며, Game 컴포넌트는 Board를 그리고 있고 조금 뒤에 우리가 빈 부분을 채워넣을 것입니다. 아직은 사용자와 상호작용을 할 수 있는 컴포넌트가 없습니다.

### Passing Data Through Props

이제 직접 코드를 작성해 볼 차례입니다. Board 컴포넌트에서 Square 컴포넌트로 데이터를 넘겨줘봅시다.

In Board's `renderSquare` method, change the code to pass a `value` prop to the Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Square 컴포넌트의 `render` 메소드를 고쳐서, 위에서 받은 값을 표시하도록 만들어보세요.

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

코드를 수정하기 전에는:

![React Devtools](../images/tutorial/tictac-empty.png)

코드를 수정하고 난 뒤: 사각형 안에 숫자가 표시되어야 합니다.

![React Devtools](../images/tutorial/tictac-numbers.png)

[현재 단계의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)

축하합니다! 여러분은 방금 부모인 Board 컴포넌트로부터 자식인 Square 컴포넌트에게 "prop을 넘겼습니다". React 앱에서는, 이렇게 정보가 부모로부터 자식에게 흐릅니다. "Prop을 넘김으로써" 말이죠.

### 상호작용을 하는 컴포넌트 만들기

이제, Square 컴포넌트를 클릭했을 때 "X" 표시가 되도록 만들어봅시다. 먼저, Square 컴포넌트의 `render()` 메소드에서 반환하고 있는 button 태그를 아래와 같이 고쳐봅시다.

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

이제 사각형을 클릭하면, 브라우저 경고창이 뜰 것입니다.

이 코드는 [화살표 함수](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 문법을 사용하고 있습니다. 우리가 `onClick` prop에 **함수**를 넘겼다는 사실에 주목하세요. 코드를 `onClick={alert('click')}` 이렇게 작성하면, 클릭했을 때 경고창이 뜨는 게 아니라 바로 뜨게 될 것입니다. 이는 초보자들이 자주 하는 실수입니다.

다음으로, 스스로가 클릭되었다는 사실을 Square 컴포넌트가 "기억"하게 만들어 봅시다. 무언가를 "기억"하기 위해, 컴포넌트는 **state**를 사용합니다.

React 컴포넌트의 생성자에서 `this.state` 속성을 넣어주면, 이 컴포넌트는 **상태를 갖게 됩니다.** 이 상태를 갖고 있는 컴포넌트만이 상태를 변경할 수 있습니다. 이제 사각형에 표시될 값을 state에 저장하고, 클릭되었을 때 그 값이 변경되게 만들어봅시다.

먼저, state를 초기화하기 위해 생성자를 추가합시다.

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

[JavaScript 클래스](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)를 사용할 때, 서브클래스의 생성자를 정의할 때는 반드시 `super`를 호출해주어야 합니다. 생성자를 갖는 모든 React 컴포넌트 클래스는 그 생성자가 반드시 `super(props)`로 시작해야 합니다.

이제 사각형을 클릭하면 현재 값을 표시하도록 `render` 메소드를 바꾸어 봅시다.

* Replace `this.props.value` with `this.state.value` inside the `<button>` tag.
* Replace the `() => alert()` event handler with `() => this.setState({value: 'X'})`.

* `<button>` 태그 안에 있는 `this.props.value`를 `this.state.value`로 바꾸세요.
* `() => alert()` 이벤트 핸들러를 `() => this.setState({value: 'X'})`로 바꾸세요.
* `className`과 `onClick` prop을 서로 다른 줄에 배치해 읽기 좋게 만듭시다.

이제 `<button>`는 다음과 같은 모습이 되었습니다.

```javascript{10-12}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => this.setState({value: 'X'})}>
        {this.state.value}
      </button>
    );
  }
}
```

Square의 `render` 메소드 안에 있는 `onClick` 핸들러 안에서 `this.setState`를 호출하면, 
**`<button>`이 클릭될 때마다 화면을 다시 그려야 한다**는 사실을 React에게 알려줄 수 있습니다.
그 뒤, `this.state.value`는 `'X'`가 될 것이고, 이로 인해 게임판에 X가 표시됩니다. 이제 사각형을 클릭해서, X가 표시되는지 확인해보세요.

컴포넌트 안에서 `setState`를 호출하면, React는 해당 컴포넌트가 품고 있는 자식 컴포넌트까 모두 새로 그려줍니다.

[현재 단계의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)

### 개발자 도구

[Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)과 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)의 React Devtools 확장 프로그램을 사용하면, 브라우저 개발자 도구 안에서 React 컴포넌트 트리를 관찰해볼 수 있습니다.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">


React DevTools를 사용해서 React 컴포넌트의 prop과 state를 관찰할 수 있습니다.

브라우저에서 오른쪽 클릭을 한 뒤 요소검사를 하면, 개발자 도구가 열리고 맨 오른쪽에 React 탭이 있을 것입니다.

**다만, CodePen에서 개발자 도구를 사용하려면 몇 가지 단계가 추가로 필요합니다.**

1. 로그인하세요.
2. "Fork" 버튼을 클릭하세요.
3. "Change View"를 클릭한 다음 "Debug mode"를 선택하세요.
4. 새 탭이 열리면, 거기서 개발자 도구를 연 다음 React 탭을 확인하세요.

## 게임 완성하기

이제 우리는 틱택토 게임을 만들기 위한 준비를 마쳤습니다. 게임을 완성하려면, "X"와 "O" 표시가 번갈아가며 게임판에 나타나야 하고, 또 승자를 결정할 수 있어야 합니다.

### 상태 끌어올리기

현재, 각각의 Square 컴포넌트가 게임 상태를 저장하고 있습니다. 승자를 결정할 수 있으려면, 9개의 Square 컴포넌트에 저장되어 있는 값을 한 곳으로 모을 방법이 필요합니다.

Board 컴포넌트에서 Square 컴포넌트의 상태를 가져오는 방법도 생각해 볼 수 있습니다만, 이런 접근방식은 권장되지 않습니다. 이 방식으로 코드를 작성했을 때 이해하기 어렵고, 버그가 발생하기 쉽고, 또 수정하기 어려운 코드가 되기 쉽기 때문입니다. 대신, 권장되는 방식은 게임의 상태를 Square 대신에 부모인 Board 컴포넌트에 저장하는 것입니다. Board 컴포넌트는 (위에서 숫자를 넘겼던 것처럼) Square 컴포넌트에게 prop을 넘겨줌으로써 무엇을 표시해야하는지를 알려줄 수 있습니다.

**여러 자식 컴포넌트에 저장되어 있는 데이터를 읽어와야 할 때, 혹은 자식 컴포넌트끼리 통신을 해야 할 필요가 있을 때는, 부모 컴포넌트에서 상태를 공유하세요. 부모 컴포넌트에서는 prop을 통해 자식 컴포넌트에게 상태를 내려줄 수 있습니다. 이 방법을 통해 부모 컴포넌트와 자식 컴포넌트가 따로 놀지 않게 만들 수 있습니다.**

상태를 부모 컴포넌트로 끌어올리는 작업은 React 컴포넌트를 개선할 때 많이들 하는 작업입니다. 이제 직접 작업을 해봅시다. Board 컴포넌트에 생성자를 추가하고, 아홉 개의 null이 들어있는 배열을 초기 상태에 집어넣읍시다.

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: new Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

나중에 우리가 상태를 채워넣게 되면, 게임판은 아래와 같은 모양이 될 것입니다:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

다시 `renderSquare` 메소드를 보면, 지금은 아래와 같은 상태입니다:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

아까 전에, 우리는 사각형에 숫자를 표시하기 위해 prop을 내려보냈습니다. 그 이후, 숫자를 "X" 표시로 바꾸어 주었고 이는 Square 컴포넌트의 상태에 저장되고 있습니다. 이 때문에 방금 우리가 내려준 `value` prop이 Square 컴포넌트에서 무시되고 있습니다.

이제 다시 prop 내려주기 메커니즘을 적용해봅시다. Board 컴포넌트를 수정해서, 각각의 Square 컴포넌트에게 자신의 현재 값((`'X'`, `'O'`, 혹은 `null`)을 알려주도록 만들어줍시다. 우리는 이미 Board 컴포넌트의 생성자에 `squares` 배열을 가지고 있고, `renderSquare` 메소드에서 이를 읽어오도록 만들어 줍시다.

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

[현재 단계의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)

이제 사각형을 클릭했을 때의 처리를 해주어야 합니다. Board 컴포넌트가 게임 상태를 저장하고 있으므로, **Square 컴포넌트에서 Board 컴포넌트의 상태를 변경할 방법**이 필요합니다. 컴포넌트의 상태에는 자기 자신만 접근할 수 있으므로, Square 컴포넌트에서 Board 컴포넌트의 상태를 **직접 변경**할 수 있는 방법은 없습니다.

이런 경우, 부모 컴포넌트인 Board에서 **상태를 바꾸는 함수**를 만들어 Square에 내려줌으로써 문제를 해결할 수 있습니다. 이 함수를 Square가 클릭되는 순간 호출해줍시다. 일단 Board 컴포넌트의 `renderSquare` 메소드를 고쳐봅시다. (참고: 아래 코드는 아직 동작하지 않습니다.)

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

코드를 읽기 쉽게 엘리먼트를 여러 줄로 나누고, 또 괄호를 둘러주었습니다.

이제 Board에서는 `value`와 `onClick`이라는 두 개의 prop을 Square로 내려보내주고 있습니다. 후자는 Square 컴포넌트에서 호출할 수 있는 함수입니다. 이제 Square 컴포넌트를 수정해봅시다.

* `render` 메소드 내부의 `this.state.value`를 `this.props.value`로 바꾸세요.
* `render` 메소드 내부의 `this.setState()`를 `this.props.onClick()`로 바꾸세요.
* `constructor`를 지우세요. 상태를 가질 필요가 없기 때문에 생성자도 지워줍시다.

코드를 수정하면 아래와 같이 됩니다.

```javascript{1,2,4,5}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
```

이제 Square를 클릭하면, Board가 넘겨준 onClick 함수가 호출됩니다. 이 때 일어나는 일을 정리해봅시다:

1. React에 내장된 DOM 컴포넌트인 `<button>` 컴포넌트의 `onClick` prop에 함수를 넘겨주면, React는 클릭 이벤트 리스너를 등록합니다.
2. 버튼을 클릭하면, React는 `onClick`에 넘겨준 이벤트 핸들러 함수를 호출합니다.
3. 이 이벤트 핸들러는 `this.props.onClick()`를 호출합니다. 이 `onClick` prop은 Board 컴포넌트에서 넘겨준 것입니다.
4. Board 컴포넌트는 Square에게 `onClick={() => this.handleClick(i)}`를 넘겨주었으므로, 이 함수가 호출되면 Board에서 `this.handleClick(i)`가 호출됩니다.
5. 아직 `handleClick()`를 Board에 정의해주지 않았으므로, 에러가 발생합니다.

DOM `<button>` 엘리먼트의 `onClick` prop은 React가 특별하게 취급합니다. (즉, 이벤트 리스너로 등록됩니다.) Square의 `onClick`이나 Board의 `handleClick`은 특별하게 취급되는 것이 아니므로, 다른 이름을 사용할 수는 있습니다. 하지만, React 앱에서 (이벤트 리스너로 사용할) prop의 이름을 `on*`과 같이 짓고, 거기에 넘겨줄 핸들러 메소드의 이름을 `handle*`과 같이 짓는 것은 널리 사용되는 관례입니다.

사각형을 클릭하면 에러가 나는데, 우리가 아직 `handleClick` 메소드를 만들지 않았기 때문입니다. 이를 Board 클래스에 만들어줍시다.

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

[현재 상태의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)

이제, 우리는 다시 사각형을 클릭해 표시를 할 수 있게 되었습니다. 하지만, 이제 게임 상태는 Board 컴포넌트에 저장되고 있습니다. Board의 상태가 바뀌면, Square 컴포넌트는 자동으로 다시 그려집니다. 사각형에 대한 모든 상태를 Board 컴포넌트에 둠으로써, 이제 승자를 결정할 수도 있게 되었습니다.

Square 컴포넌트가 상태를 갖지 않게 됨으로써, Square 컴포넌트는 Board 컴포넌트로부터 정보를 받고, 클릭되었을 때 그 사실을 Board 컴포넌트에게 알려줍니다. React 용어로 설명하면, Square 컴포넌트는 이제 **제어되는 컴포넌트**가 되었습니다. Board 컴포넌트가 이들을 완전히 제어하고 있습니다.

`handleClick` 내부에서 `.slice()` 메소드를 사용해서 배열을 통째로 복사한 부분에 주목하세요. 왜 이렇게 했는지 다음 섹션에서 설명하겠습니다.

### Why Immutability Is Important

In the previous code example, we suggest using the `.slice()` operator to copy the `squares` array prior to making changes and to prevent mutating the existing array. Let's talk about what this means and why it is an important concept to learn.

There are generally two ways for changing data. The first method is to *mutate* the data by directly changing the values of a variable. The second method is to replace the data with a new copy of the object that also includes desired changes.

#### Data change with mutation
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data change without mutation
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly we now have an added benefit that can help us increase component and overall application performance.

#### Easier Undo/Redo and Time Travel

Immutability also makes some complex features much easier to implement. For example, further in this tutorial we will implement time travel between different stages of the game. Avoiding data mutations lets us keep a reference to older versions of the data, and switch between them if we need to.

#### Tracking Changes

Determining if a mutated object has changed is complex because changes are made directly to the object. This then requires comparing the current object to a previous copy, traversing the entire object tree, and comparing each variable and value. This process can become increasingly complex.

Determining how an immutable object has changed is considerably easier. If the object being referenced is different from before, then the object has changed. That's it.

#### Determining When to Re-render in React

The biggest benefit of immutability in React comes when you build simple _pure components_. Since immutable data can more easily determine if changes have been made, it also helps to determine when a component requires being re-rendered.

To learn more about `shouldComponentUpdate()` and how you can build *pure components* take a look at [Optimizing Performance](/docs/optimizing-performance.html#examples).

### 함수형 컴포넌트

이제 Square를 **함수형 컴포넌트**로 만들어보겠습니다.

**함수형 컴포넌트**는, 상태를 갖지 않고, `render` 메소드만 있는 컴포넌트를 좀 더 편하게 작성할 수 있는 방법입니다. `React.Component`를 상속받는 클래스를 만드는 대신, `props`를 입력받아서 무엇을 그려야 할지를 반환하는 함수를 만드세요. 함수형 컴포넌트는 클래스에 비해 빨리 작성할 수 있으며, 많은 컴포넌트들이 함수형 컴포넌트로 작성될 수 있습니다.

Square 클래스를 통째로 아래 코드로 바꾸세요.

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

두 군데에 `this.props`라고 되어 있는 부분을 `props`로 바꾸어 주었습니다.

[현재 상태의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)


`onClick={() => this.props.onClick()}`을 `onClick={props.onClick}`과 같이 작성한 부분에 주목하세요. `<button>` 내장 컴포넌트의 `onClick` prop에는 이렇게 함수를 직접 넘겨줄 수도 있습니다. 부모 컴포넌트로부터 받은 함수를 넘겨줄 때는 이렇게 해도 문제가 없어서 이런 코드가 많이 사용됩니다. 하지만, (특히 클래스 컴포넌트에서) `this` 때문에 문제가 생길 수도 있으니 주의해주세요!

### 턴 넘기기

우리 게임의 큰 문제점은 오직 X만 플레이할 수 있다는 것입니다. 현재 "O"가 게임판에 표시되지 않고 있습니다. 이를 고쳐봅시다.

처음에는 X의 차례로 시작하는 것으로 합시다. 이 규칙을 반영해서, 이제 Board 컴포넌트의 초기 상태를 아래와 같이 고쳐봅시다.

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time we move we shall toggle `xIsNext` by flipping the boolean value and saving the state. Now update Board's `handleClick` function to flip the value of `xIsNext`:

플레이어가 한 수 둘 때마다, `xIsNext`의 값이 뒤집혀서 다음 플레이어가 누군지 가리키게 만들어 봅시다. `xIsNext`를 뒤집기 위해 Board의 `handleClick` 메소드를 수정해봅시다.

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

이제 "X"와 "O"가 교대로 바뀝니다. 이제 "status" 텍스트를 바꾸어 현재 플레이어가 누군지 표시해줍시다.

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After these changes you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

[현재 상태의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)

### Declaring a Winner

이제 승자를 결정하는 것만 남았습니다. 미리 작성된 아래 함수를 코드의 최하단에 추가해주세요.

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

You can call it in Board's `render` function to check if anyone has won the game and make the status text show "Winner: [X/O]" when someone wins.

Replace the `status` declaration in Board's `render` with this code:

이제 Board의 `render` 함수에서 `calculateWinner(squares)`를 호출해서, 누군가가 승리했는지를 확인합시다. 만약 둘 중 한명이 이겼다면, 누가 이겼는지를 표시해줄 수 있습니다. 이를 위해 Board의 `render` 메소드에서 status를 수정해봅시다.

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

이제 Board의 `handleClick`을 수정해서, 만약 승자가 결정되었거나 사각형이 이미 채워져있는 상태라면 함수를 바로 종료하게 만들어봅시다.

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

축하합니다! 이제 제대로 동작하는 틱택토 게임이 되었습니다. 그리고 여러분은 React의 기초적인 내용에 대해 알게 되었습니다. 여기에서의 **진정한 승자는 여러분인 것 같네요!**

[현재 상태의 코드를 확인해보세요.](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)

## Storing a History

Let's make it possible to revisit old states of the board so we can see what it looked like after any of the previous moves. We're already creating a new `squares` array each time a move is made, which means we can easily store the past board states simultaneously.

Let's plan to store an object like this in state:

```javascript
history = [
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // ...
]
```

We'll want the top-level Game component to be responsible for displaying the list of moves. So just as we pulled the state up before from Square into Board, let's now pull it up again from Board into Game – so that we have all the information we need at the top level.

First, set up the initial state for Game by adding a constructor to it:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Then change Board so that it takes `squares` via props and has its own `onClick` prop specified by Game, like the transformation we made for Square earlier. You can pass the location of each square into the click handler so that we still know which square was clicked. Here is a list of steps you need to do:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

Now the whole Board component looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Game's `render` should look at the most recent history entry and can take over calculating the game status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since Game is now rendering the status, we can delete `<div className="status">{status}</div>` and the code calculating the status from the Board's `render` function:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Next, we need to move the `handleClick` method implementation from Board to Game. You can cut it from the Board class, and paste it into the Game class.

We also need to change it a little, since Game state is structured differently. Game's `handleClick` can push a new entry onto the stack by concatenating the new history entry to make a new history array.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

At this point, Board only needs `renderSquare` and `render`; the state initialization and click handler should both live in Game.

[View the current code.](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)

### Showing the Moves

Let's show the previous moves made in the game so far. We learned earlier that React elements are first-class JS objects and we can store them or pass them around. To render multiple items in React, we pass an array of React elements. The most common way to build that array is to map over your array of data. Let's do that in the `render` method of Game:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

[View the current code.](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)

For each step in the history, we create a list item `<li>` with a button `<button>` inside it that has a click handler which we'll implement shortly. With this code, you should see a list of the moves that have been made in the game, along with a warning that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's talk about what that warning means.

### Keys

When you render a list of items, React always stores some info about each item in the list. If you render a component that has state, that state needs to be stored – and regardless of how you implement your components, React stores a reference to the backing native views.

When you update that list, React needs to determine what has changed. You could've added, removed, rearranged, or updated items in the list.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

To a human eye, it looks likely that Alexa and Ben swapped places and Claudia was added – but React is just a computer program and doesn't know what you intended it to do. As a result, React asks you to specify a *key* property on each element in a list, a string to differentiate each component from its siblings. In this case, `alexa`, `ben`, `claudia` might be sensible keys; if the items correspond to objects in a database, the database ID is usually a good choice:

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

`key` is a special property that's reserved by React (along with `ref`, a more advanced feature). When an element is created, React pulls off the `key` property and stores the key directly on the returned element. Even though it may look like it is part of props, it cannot be referenced with `this.props.key`. React uses the key automatically while deciding which children to update; there is no way for a component to inquire about its own key.

When a list is rerendered, React takes each element in the new version and looks for one with a matching key in the previous list. When a key is added to the set, a component is created; when a key is removed, a component is destroyed. Keys tell React about the identity of each component, so that it can maintain the state across rerenders. If you change the key of a component, it will be completely destroyed and recreated with a new state.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key handy, you may want to consider restructuring your data so that you do.

If you don't specify any key, React will warn you and fall back to using the array index as a key – which is not the correct choice if you ever reorder elements in the list or add/remove items anywhere but the bottom of the list. Explicitly passing `key={i}` silences the warning but has the same problem so isn't recommended in most cases.

Component keys don't need to be globally unique, only unique relative to the immediate siblings.


### Implementing Time Travel

For our move list, we already have a unique ID for each step: the number of the move when it happened. In the Game's `render` method, add the key as `<li key={move}>` and the key warning should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

[View the current code.](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)

Clicking any of the move buttons throws an error because `jumpTo` is undefined. Let's add a new key to Game's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that state. We also want to update `xIsNext`. We set `xIsNext` to true if the index of the move number is an even number.

Add a method called `jumpTo` to the Game class:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

Then update `stepNumber` when a new move is made by adding `stepNumber: history.length` to the state update in Game's `handleClick`. We'll also update `handleClick` to be aware of `stepNumber` when reading the current board state so that you can go back in time then click in the board to create a new entry.:

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Now you can modify Game's `render` to read from that step in the history:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

[View the current code.](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)

If you click any move button now, the board should immediately update to show what the game looked like at that time.

### Wrapping Up

Now, you've made a tic-tac-toe game that:

* lets you play tic-tac-toe,
* indicates when one player has won the game,
* stores the history of moves during the game,
* allows players to jump back in time to see older versions of the game board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: [Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010).

If you have extra time or want to practice your new skills, here are some ideas for improvements you could make, listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.

Throughout this tutorial, we have touched on a number of React concepts including elements, components, props, and state. For a more in-depth explanation for each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
