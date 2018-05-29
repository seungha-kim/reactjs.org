---
id: state-and-lifecycle
title: State와 라이프사이클
permalink: docs/state-and-lifecycle.html
redirect_from: "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

[바로 전 섹션](/docs/rendering-elements.html#updating-the-rendered-element) 에서 보았던 깜빡이는 시계 예제를 살펴봅시다.

지금까지 우리는 UI를 업데이트하는 한가지 방법을 배웠습니다.

`ReactDOM.render()` 을 호출하여 렌더링된 출력을 변경할 수 있습니다.

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

이 섹션에서는 정말로 재사용가능하고 캡슐화된 `Clock` 컴포넌트를 만드는 방법에 대해 배웁니다. 컴포넌트의 자체 타이머를 설정하고 매 초마다 스스로 업데이트하게 만들 것입니다.

시계가 어떻게 보여야 할지 캡슐화하는 것부터 시작합니다.

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/dpdoYR?editors=0010)

그러나 중요한 요구사항이 하나 빠져있습니다. `Clock` 이 타이머를 설정하고 매 초 UI를 업데이트 하는 것은 `Clock` 의 구현 세부사항이어야 합니다.

이상적으로는 위의 세부사항을 한 번만 작성하고, `Clock`이 스스로를 업데이트 하게 만드는 것이 좋습니다.

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

이를 구현하기 위해, `Clock` 컴포넌트에 "state"를 추가할 필요가 있습니다.

State는 props와 비슷하지만 바깥으로 공개되지 않으며, 컴포넌트에 의해 완전히 제어됩니다.

[이전에 언급](/docs/components-and-props.html#functional-and-class-components) 했던 대로, 클래스로 정의한 컴포넌트에는 몇가지 추가 기능이 있습니다. 지역적인 state가 바로 그러한 기능으로, 클래스에서만 사용 가능합니다.

## 함수를 클래스로 변환

`Clock` 같은 함수형 컴포넌트를 클래스로 변환하려면 다섯 단계를 진행합니다.

1. [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)를 같은 이름으로 만들고, `React.Component` 를 상속받습니다.

2. 비어있는 `render()` 메서드를 하나 추가합니다.

3. 함수의 바디를 `render()` 메서드 안으로 옮깁니다.

4. `render()` 바디 내에서 `props` 를 `this.props` 로 바꿉니다.

5. 남아있는 빈 함수 선언을 제거합니다.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` 은 이제 함수 대신 클래스로 정의합니다.

이를 통해 지역적인 state나 라이프사이클 훅 같은 추가 기능을 사용할 수 있습니다.

## Class에 로컬 state 추가하기

`date` 를 props에서 state로 옮기기 위해서 세 단계를 진행합니다.

1) `render()` 메서드 내의 `this.props.date` 를 `this.state.date` 로 바꿉니다.

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) `this.state` 를 초기화 하는 [클래스 생성자](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) 를 추가합니다.

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

`props` 를 상위 생성자에 어떻게 전달하는지 살펴보길 바랍니다.

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

클래스 컴포넌트는 항상 `props`를 가지고 상위 생성자를 호출해야만 합니다.

3) `<Clock />` 요소에서 `date` prop을 삭제합니다.

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

나중에 타이머 코드를 컴포넌트 자체에 다시 추가합니다.

이 결과는 다음과 같은 코드가 됩니다.

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/KgQpJd?editors=0010)

다음으로, `Clock` 에 자체 타이머를 설정하고 매 초마다 스스로를 갱신하도록 만들어봅시다.

## 클래스에 라이프사이클 메서드 추가하기

많은 컴포넌트를 가진 어플리케이션에서, 컴포넌트가 제거될 때 사용중이던 자원을 돌려놓는 작업은 아주 중요한 일입니다.

`Clock` 이 DOM에 최초로 렌더링 될 때 [타이머를 설정](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 하려고 합니다. React에서 이를 "mounting" 이라고 부릅니다.

그리고 DOM에서 `Clock` 이 삭제되었을 때 [타이머를 해제](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) 하려고 합니다. React에서 이를 "unmounting" 이라고 부릅니다.

컴포넌트가 마운트 (mount) 되거나 언마운트 (unmount) 되는 시점에 코드를 실행하기 위해, 컴포넌트 클래스에 특별한 메서드를 선언할 수 있습니다.

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

이런 메서드들을 "라이프사이클 훅" 이라고 부릅니다.

`componentDidMount()` 훅은 컴포넌트 출력이 DOM에 렌더링 된 이후 동작합니다. 이 곳이 타이머를 설정하기 좋은 지점입니다.

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

`this` 에 timer ID를 어떻게 저장하는 지 살펴봅시다.

렌더링과 관련된 데이터 흐름에서, `this.props` 는 React에 의해 설정되고 `this.state` 는 특별한 의미를 갖고 있습니다. 반면 위와 같이 데이터 흐름에 참여하지 않는 무언가를 저장할 때 클래스에 직접 필드를 추가하는 것도 가능합니다.

이제 `componentWillUnmount()` 라이프사이클 훅에서 타이머를 종료할 것입니다.

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

마지막으로 `Clock` 컴포넌트에서 매 초마다 동작하는 `tick()` 이라는 메서드를 구현해봅시다.

`this.setSTate()` 를 사용해서 컴포넌트 로컬 state에 대한 업데이트를 예약합니다.

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/amqdNA?editors=0010)

이제 시계는 매 초 깜빡입니다.

어떤 작업을 했는 지와 메서드가 호출되는 순서를 간단히 요약해봅시다.

1) `<Clock />` 이 `ReactDOM.render()` 에 전달될 때, React는 `Clock` 컴포넌트의 생성자 함수를 호출합니다. `Clock`이 현재 시각을 화면에 보여주어야 하기 때문에, 현재 시각을 포함하는 `this.state` 객체를 초기화합니다. 이 state는 추후 업데이트됩니다.

2) React가 `Clock` 컴포넌트의 `render()` 메서드를 호출합니다. 이를 통해 React는 화면에 무엇을 보여줘야 하는지 알아냅니다. 그다음 React는 DOM을 갱신해서 `Clock` 의 렌더링 출력과 일치시킵니다.

3) `Clock` 출력이 DOM에 주입되었을 때, React는 `componentDidMount()` 라이프 훅을 호출합니다. 그 안에서 `Clock` 컴포넌트는 브라우저에게 컴포넌트의 `tick()` 메서드를 초당 한 번씩 호출하는 타이머를 설정하라고 명령합니다.

4) 브라우저에서 매 초마다 `tick()` 메서드를 호출합니다. 그 안에서 `Clock` 컴포넌트는 현재 시각을 갖고 있는 객체를 가지고 `setState()` 를 호출하여 UI 업데이트를 예약합니다. `setState()` 호출 덕분에, React는 상태가 변경된 걸 알게 됐고, `render()` 메서드를 다시 한 번 호출해 화면에 무엇을 표시해야 할지 알 수 있습니다. 이번에는, `render()` 메서드 내의 `this.state.date` 가 달라지므로 바뀐 시간이 출력에 포함됩니다. React는 그에 따라 DOM을 업데이트합니다.

5) 만약 `Clock` 컴포넌트가 DOM에서 삭제된다면, React는 `componentWillUnmount()` 라이프사이클 훅을 호출하기 때문에 타이머가 멈춥니다.

## State 바르게 사용하기

`setState()` 에 대해 알아야 할 세 가지 것이 있습니다.

### State를 직접 수정하지 마세요

예를 들어, 이 코드는 컴포넌트를 다시 렌더링하지 않습니다.

```js
// Wrong
this.state.comment = 'Hello';
```

대신, `setState()` 를 사용하세요.

```js
// Correct
this.setState({comment: 'Hello'});
```

`this.state` 를 할당할 수 있는 유일한 장소는 생성자 함수 내부입니다.

### State 업데이트는 비동기일 수 있습니다

React는 성능을 위해 여러 `setState()` 호출을 한 번의 작업으로 묶어서 처리하는 경우가 있습니다.

`this.props` 및 `this.state` 가 비동기로 업데이트될 수 있기 때문에, 다음 state를 계산할 때 이 값을 신뢰해서는 안됩니다.

예를 들어, 카운터를 업데이트하는 이 코드는 실패할 수 있습니다.

```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

이 문제를 해결하기 위해 객체가 아닌 함수를 받는 두 번째 형식의 `setState()` 를 사용할 수 있습니다. 이 함수는 이전 state를 첫 번째 인수로 받고, 두 번째 인수로 업데이트가 적용 될 때 props를 받습니다.

```js
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```

위 예제에서는 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 을 사용했지만, 평범한 함수도 동작합니다.

```js
// Correct
this.setState(function(prevState, props) {
  return {
    counter: prevState.counter + props.increment
  };
});
```

### State 업데이트는 병합됩니다

`setState()` 를 호출할 때, React는 넘겨받은 객체를 현재 state에 병합합니다.

예를 들어, state는 여러 독립적인 변수를 가질 수 있습니다.

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

그런 다음 개별 `setState()` 를 호출하여 아이템을 각각 업데이트할 수 있습니다.

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

이 때 얕은 병합을 수행하기 때문에, `this.setState({comments})` 는 `this.state.posts` 는 그대로 두지만, `this.state.comments` 는 완전히 대체합니다.

## 데이터는 아래로 흐릅니다

부모 컴포넌트나 자식 컴포넌트는 특정 컴포넌트의 state 유무를 알 수 없으며, 해당 컴포넌트가 함수나 클래스로 선언되었는 지 알 수 없습니다.

이것이 바로 state가 '지역적이다' 혹은 '캡슐화되었다'고 하는 이유입니다. State를 지정해 준 컴포넌트 외의 다른 컴포넌트에서는 state에 접근할 수 없습니다.

컴포넌트는 자신의 state를 props로서 자식 컴포넌트에 내려줄 수 있습니다.

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

이는 사용자 정의 컴포넌트에서도 마찬가지로 동작합니다.

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` 컴포넌트는 props에서 `date` 를 받지만 이 값이 `Clock` 의 상태인지, `Clock` 의 props인지, 혹은 타이핑된 것인지 알 수 없습니다.

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/zKRqNB?editors=0010)

이런 데이터 흐름을 보통 "하향식(top-down)" 혹은 "단방향(unidirectional)" 데이터 흐름이라고 합니다. 모든 state는 항상 특정 컴포넌트가 가지며, 해당 state에서 파생된 모든 데이터와 UI는 트리의 "아래(below)"에 있는 컴포넌트에만 영향을 미칩니다.

컴포넌트 트리를 props의 폭포라고 상상해보면, 각 컴포넌트의 상태는 임의의 지점에서 추가되는 물과 비슷하고 또한 아래로 흐릅니다.

모든 컴포넌트가 실제로 격리되어있음을 보여주기 위해, 세 개의 `<Clock>` 을 렌더링하는 `App` 컴포넌트를 만들어봅시다.

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/vXdGmd?editors=0010)

각 `Clock` 은 자체적으로 타이머를 생성하고 독립적으로 바뀝니다.

React 앱에서, 컴포넌트가 state를 갖고 있는지(stateful) 또는 갖지 않는지(stateless)는 구현 세부 사항으로 간주되어 시간이 지남에 따라 바뀔 수 있습니다. state를 가진 컴포넌트 내부에서 state가 없는 컴포넌트를 사용할 수 있으며, 그 반대 경우도 마찬가지입니다.
