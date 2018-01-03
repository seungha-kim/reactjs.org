---
id: react-without-jsx
title: JSX를 사용하지않는 React
permalink: docs/react-without-jsx.html
---

JSX는 React를 살 때 필수사항이 아닙니다. JSX 없이 React를 사용하면 빌드 환경에서 컴파일을 세팅하지 않으려 할 때 특히 편합니다.

각 JSX 요소는 `React.createElement(component, props, ...children)` 를 호출하는 문법 설탕입니다. 그래서 JSX에서 할 수 있는 모든 일은 순수 자바스크립트에서도 사용할 수 있습니다.

예를 들어 JSX에서 작성한 다음 코드는

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

아래처럼 JSX를 사용하지 않는 코드로 컴파일할 수 있습니다.

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

만약 JSX가 어떻게 자바스크립트로 변환되는 지 더 많은 예제를 보고싶다면 [온라인 Babel 컴파일러](babel://jsx-simple-example) 를 볼 수 있습니다.

컴포넌트는 문자열로 제공되거나 `React.Component` 의 서브클래스로 제공되거나 state 없는 컴포넌트를 위한 순수 함수로 작성할 수 있습니다.

너무 많이 `React.createElement` 작성하는 데 피곤해졌을 때 일반적인 패턴 중 하나는 짧게 할당하는 것입니다.

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

`React.createElement` 를 위한 짧은 폼을 사용하면 JSX 없이 React를 사용할 때 더 편해집니다.

또는 [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) 나 [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) 같이 더 간결한 구문을 제공하는 커뮤니티 프로젝트를 참조할 수 있습니다.