---
id: handling-events
title: 이벤트 제어하기
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

React 요소의 이벤트를 제어하는 건 DOM 요소 이벤트를 제어하는 것과 매우 유사합니다. 몇가지 문법적인 차이가 있습니다.

* React 이벤트는 소문자 대신 camelCase를 사용합니다.
* JSX에 문자열 대신 함수를 전달합니다.

예를 들어 HTML에서 이벤트를 넣을 때는 이렇게 합니다:

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

React에서는 조금 다릅니다:

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

다른 차이점으로는 React에서 기본 동작을 막기 위해 `false` 를 반환할 수 없다는 것입니다. 반드시 명시적으로 `preventDefault` 를 호출해야 합니다. 예를 들어 HTML에서 새로운 페이지를 여는 기본 링크 동작을 막으려면 이렇게 작성할 수 있습니다.

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

React에서는 대신 이렇게 작성합니다.

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

여기서 `e` 는 합성 이벤트입니다. React는 [W3C spec](https://www.w3.org/TR/DOM-Level-3-Events/) 에 따라 이런 합성 이벤트를 정의하므로, 브라우저 간 호환성을 걱정할 필요는 없습니다. 더 자세한 사항은 [`SyntheticEvent`](/docs/events.html) 레퍼런스 가이드를 보시길 바랍니다.

React를 사용할 때, (일반적인 경우) 리스너를 추가하기 위해 DOM 요소가 생성된 후 `addEventListener` 를 호출할 필요가 없습니다. 대신 요소를 처음 렌더링할 때 리스너를 같이 넘겨주세요.

[ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 를 이용해 컴포넌트를 정의할 때, 이벤트 핸들러를 만들기 위해 보통 클래스 메서드를 사용합니다. 예를 들어, 아래 `Toggle` 컴포넌트는 "ON" 과 "OFF" state를 유저가 토글할 수 있게 하는 버튼을 렌더링합니다.

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 콜백에서 `this`가 제대로 동작하게 만들려면 아래 바인딩을 꼭 해주어야 합니다.
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/xEmzGg?editors=0010)

JSX 콜백에서 `this` 의 의미에 대해 주의해야합니다. 자바스크립트에서 클래스 메서드는 기본적으로 [바인딩](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) 되지 않습니다. 만약 `this.handleClick` 바인드를 잊은채로 `onClick` 에 전달하면, `this` 는 함수가 실제로 호출될 때 `undefined` 로 취급됩니다.

이건 React에서만 해당되는 동작이 아닙니다. [자바스크립트의 함수의 동작 방식](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/) 자체가 이렇습니다. 일반적으로 `onClick={this.handleClick}` 처럼 `()` 없이 메서드를 참조하면, 그 메서드를 bind 해야합니다.

만약 `bind` 를 호출하는 게 귀찮은 경우, 이 문제를 해결할 수 있는 두 가지 방법이 있습니다. 만약 실험적 기능인 [퍼블릭 클래스 필드 문법](https://babeljs.io/docs/plugins/transform-class-properties/) 을 사용하고 있다면, 콜백을 올바르게 바인딩하기 위해 클래스 필드를 사용할 수 있습니다.

```js{2-6}
class LoggingButton extends React.Component {
  // 이 문법은 handleClick 안에서 `this`가 제대로 바인딩됨을 보장합니다.
  // 경고: 이는 *실험적인* 문법입니다.
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

[Create React App](https://github.com/facebookincubator/create-react-app)을 사용하고 있다면 이 문법을 바로 사용할 수 있습니다.

만약 클래스 필드 문법을 사용하고 싶지 않다면, 콜백에서 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 을 사용할 수도 있습니다.

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

이 문법의 문제점은 `LogginButton` 을 렌더링할 때마다 서로 다른 콜백이 만들어지는 것입니다. 대부분의 경우에서 크게 문제는 없습니다. 하지만 하위 컴포넌트에 콜백을 prop으로서 전달하는 경우, 이 컴포넌트는 불필요한 렌더링을 더 일으킬 수 있습니다. 이런 종류의 성능 문제를 피하기 위해, 보통 생섬자 함수에서 바인딩하거나 클래스 필드 문법을 사용하는 걸 권장합니다.

## 이벤트 핸들러에 인수 전달하기

반복문 안에서 이벤트 핸들러에 추가 파라미터를 전달하고 싶은 경우가 많습니다. 예를 들어, 만약 `id` 가 행 ID라면, 아래처럼 전달할 수 있습니다.

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

위 두 라인은 동일하며, [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)과 [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) 를 각각 사용하고 있습니다.

두 경우 모두, React 이벤트를 나타내는`e` 인수는 ID 뒤에 두 번째 인수로 전달됩니다. arrow function을 사용하면 ID를 명시적으로 전달해야 하지만, `bind`를 사용하면 추가로 넘겨준 인수가 자동으로 전달됩니다.