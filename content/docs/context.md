---
id: context
title: Context
permalink: docs/context.html
---

> Note:
>
> React v15.5부터 `React.PropTypes` 는 별도 패키지로 옮겨졌습니다. `contextTypes` 를 정의하기 위해 [`prop-types` 라이브러리](https://www.npmjs.com/package/prop-types)를 대신 사용하시길 바랍니다.
>
>We provide [a codemod script](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) to automate the conversion.

React에서 React 컴포넌트를 통해 데이터의 흐름 추적을 쉽게할 수 있습니다. 컴포넌트를 보면 전달된 props를 볼 수 있어 앱을 쉽게 추론할 수 있습니다.

몇가지 케이스에서 모든 단계에 수동으로 props를 전달하지 않고 컴포넌트 트리 전체에 데이터를 전달하고 싶을 수 있습니다. React에서 강력한 "context" API를 사용하여 직접 수행할 수 있습니다.

## 왜 Context를 사용하지 않나요

대다수의 어플리케이션은 context를 사용할 필요가 없습니다.

만약 어플리케이션이 안정적이기를 원한다면 context를 사용하지마세요. context는 실험적인 API이며 React의 향후 릴리즈에 중단 될 가능성이 있습니다.

만약 [Redux](https://github.com/reactjs/redux) 나 [MobX](https://github.com/mobxjs/mobx) 같은 state 관리 라이브러리에 친근하지 않다면, context를 사용하지마세요. 많은 실제 어플리케이션에서 이러한 라이브러리들과 React 바인딩은 많은 컴포넌트와 관련된 state를 관리하기에 좋은 선택입니다. 문제를 해결하기 위한 올바른 해답이 Redux일 가능성이 context일 가능성보다 높습니다.

숙련된 React 개발자가 아닌 경우 context를 사용하지마세요. 일반적으로 props와 state를 사용하여 기능을 구현하는 것이 더 좋은 방법입니다.

이러한 경고에도 불구하고 context 사용을 주장하는 경우, context 사용을 좁은 영역에 제한하고 context API를 가능한한 직접 사용하지않는 것이 좋습니다. 이렇게하면 API가 변경될 때마다 업그레이드가 쉬워집니다.

## Context 사용법

아래와 같은 구조가 있다고 가정해봅시다.

```javascript
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

이 예제에서 `Button` 과 `Message` 컴포넌트를 적절하게 스타일하기 위해 `color` prop을 수동으로 전달합니다. context를 사용하면 자동으로 트리에 이를 전달할 수 있습니다.

```javascript{6,13-15,21,28-30,40-42}
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```

`MessageList` (context 제공자)에 `childContextTypes` 와 `getChildContext` 를 추가함으로써 React는 자동으로 정보를 하위에 전달하고 서브트리 내 모든 컴포넌트 (이 경우에는 `Button`)가 `contextTypes` 를 정의하여 접근할 수 있습니다.

만약 `contextTypes` 가 정의되지 않았다면, `context` 는 빈 객체가 됩니다.

## Parent-Child 커플링

Context를 사용하면 부모와 자식이 통신하는 API를 만들 수 있습니다. 예를 들어, [React Router V4](https://reacttraining.com/react-router) 라이브러리가 이 방식으로 동작합니다.

```javascript
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

`Router` 컴포넌트에서 하위에 특정 정보를 전달함으로써, 각 `Link` 와 `Route` 는 `Router` 를 포함하는 것으로 다시 통신할 수 있습니다.

이와 유사한 API를 사용하여 컴포넌트를 만들기 전에 더 깔끔한 대안이 있는 지 고려하시길 바랍니다. 예를 들어 원한다면 전체 React 컴포넌트를 props로 전달할 수 있습니다.

## 라이프사이클 메서드에서 Context 참조하기

`contextTypes` 가 컴포넌트에 정의되어있으면 아래 [라이프사이클 메서드](/docs/react-component.html#the-component-lifecycle) 는 추가로 `context` 객체를 파라미터로 받습니다.

- [`constructor(props, context)`](/docs/react-component.html#constructor)
- [`componentWillReceiveProps(nextProps, nextContext)`](/docs/react-component.html#componentwillreceiveprops)
- [`shouldComponentUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#shouldcomponentupdate)
- [`componentWillUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#componentwillupdate)

> Note:
>
> React 16부터 `componentDidUpdate` 는 더이상 `prevContext` 를 받지 않습니다.

## State 없는 함수형 컴포넌트에서 Context 참조하기

State 없는 함수형 컴포넌트는 `contextTypes` 가 함수의 속성으로써 정의되어있는 경우 `context` 를 참조할 수 있습니다. 아래 코드는 `Button` 컴포넌트를 State 없는 함수형 컴포넌트로 작성한 예제입니다.

```javascript
import PropTypes from 'prop-types';

const Button = ({children}, context) =>
  <button style={{background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

## Context 업데이트

하지마세요.

React는 context를 업데이트 하는 API를 가지고있지만 근본적으로 문제가있어 사용하지 말아야합니다.

`getChildContext` 함수는 state나 props가 바뀌면 호출됩니다. context에서 date를 업데이트하려면 `this.setState` 를 사용하여 로컬 state 업데이트를 트리거해야합니다. 이는 새로운 context를 트리거하고 변경사항은 자식들이 받을 것입니다.

```javascript
import PropTypes from 'prop-types';

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```

문제는 컴포넌트가 변경을 통해 제공하는 콘텍스트 값을 중간 상위 부모가 `shouldComponentUpdate` 에서 `false` 를 반환하는 경우 해당 값을 사용하는 하위 항목이 업데이트되지 않는 점에 있습니다. context를 사용하여 컴포넌트를 완전히 제어할 수 없으므로 기본적으로 context를 안정적으로 업데이트할 수 없습니다. [이 블로그 포스트](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)에서 이것이 왜 문제인지, 어떻게 해결할 수 있는지에 대한 좋은 설명이 있습니다.