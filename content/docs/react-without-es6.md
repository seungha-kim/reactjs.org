---
id: react-without-es6
title: ES6를 사용하지않는 React
permalink: docs/react-without-es6.html
---

보통 React 컴포넌트는 순수 자바스크립트 클래스로 정의합니다.

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

아직 ES6를 사용하지않는다면 클래스 대신 `create-react-class` 를 사용할 수 있습니다.


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 클래스 API는 일부 예외를 제외하고 `createReactClass()` 와 비슷합니다.

## 기본 Props 선언하기

ES6 클래스 `defaultProps` 와 함수를 통해 컴포넌트 자체에 속성을 정의할수 있습니다.

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

`createReactClass()` 를 이용할 때는 객체에 함수를 전달하기 위해 `getDefaultProps()` 를 정의할 필요가 있습니다.

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 초기 state 설정하기

ES6 클래스에서 생성자에서 `this.state` 를 할당하여 초기 state를 정의할 수 있습니다.

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

`createReactClass()` 를 이용할 때는 기초 state를 반환하는 개별 `getInitialState` 메서드를 사용합니다.

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## Autobinding

ES6로 선언한 React 컴포넌트에서 메서드는 보통 ES6 클래스와 동일한 의미를 가져갑니다. 이는 인스턴스에서 `this` 가 자동으로 바인딩되지 않음을 의미합니다. 생성자에서 `.bind(this)` 를 사용해야합니다.

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

`createReactClass()` 에서는 모든 메서드를 바인드하기 때문에 유효하지 않습니다.

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

즉 ES6 클래스를 사용하면 이벤트 핸들러에서 더 많은 보일러플레이트 코드를 필요로 하지만 큰 어플리케이션에서는 성능이 약간 향상됩니다.

보일러플레이트 코드가 매력없어보인다면 Babel을 사용하여 **실험 기능인** [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/) 제안 구문을 사용할 수도 있습니다.


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

위 구문은 **실험 기능** 이며 언어에서 명확히 제안되지 않았기 때문에 구문이 변할 수 있다는 점을 명심하시길 바랍니다.

오히려 안전하게 사용하기위한 몇가지 방법이 있습니다.

* 생성자에서 Bind 메서드 사용하기
* arrow 함수 사용하기. 즉 `onClick={(e) => this.handleClick(e)}`.
* 계속 `createReactClass` 사용하기.

## Mixins

>**Note:**
>
> mixin 지원 없이 ES6가 출시되었습니다. 따라서 React ES6 클래스를 사용하면 mixin을 지원하지 않습니다.
>
>**mixin을 사용한 코드베이스에서 수많은 이슈를 발견하였으며 [새 코드에서 이를 사용하지 않는 것을 권장합니다](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>이 섹션은 레퍼런스를 위해 존재합니다.

가끔 아주 다른 컴포넌트끼리 같은 기능을 공유할 수도 있습니다. 이는 가끔 [cross-cutting concerns](https://en.wikipedia.org/wiki/Cross-cutting_concern) 라고 불립니다. [`createReactClass`](/docs/top-level-api.html#react.createclass) 는 이를 위해 레거시 `mixins` 시스템을 사용합니다.

한 일반적인 사용 사례는 시간 interval에 따라 컴포넌트 자체가 업데이트하려는 컴포넌트입니다. `setInterval()` 을 사용하는 건 쉽지만 메모리를 절약하기 위해 더 이상 필요하지 않을 때 interval을 취소시키는 것이 중요합니다. React는 컴포넌트의 생성 및 제거 시점을 알려주는 [라이프사이클 메서드](/docs/working-with-the-browser.html#component-lifecycle) 를 제공합니다. 이 메서드를 사용하여 컴포넌트가 제거될 때 자동으로 정리되는 쉬운 `setInterval()` 함수를 제공하는 간단한 mixin을 만들어봅시다.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Use the mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Call a method on the mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

컴포넌트가 여러개의 mixin을 사용하고 여러 mixin이 동일한 라이프사이클 메서드를 정의하는 경우 (즉 컴포넌트가 제거될 때 여러 mixin이 클린업을 수행하려는 경우) 모든 라이프사이클 메서드가 호출되도록 보장합니다. mixin에 정의된 메서드는 mixin된 순서대로 작동하고 그 후에 컴포넌트에 대한 메소드 호출이 따라옵니다.
