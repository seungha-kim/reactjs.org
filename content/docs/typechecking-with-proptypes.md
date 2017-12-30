---
id: typechecking-with-proptypes
title: Proptypes를 이용한 타입 체크
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Note:
>
> React v15.5부터 `React.PropTypes` 는 별도 패키지로 옮겨졌습니다. 대신 [`prop-types` 라이브러리](https://www.npmjs.com/package/prop-types)를 사용하시길 바랍니다.
>
>We provide [a codemod script](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) to automate the conversion.

앱이 커짐에 따라 타입체킹을 통해 많은 버그를 잡을 수 있습니다. 일부 어플리케이션에서 [Flow](https://flowtype.org/) 나 [TypeScript](https://www.typescriptlang.org/) 같이 어플리케이션 전체에서 타입체크를 할 수 있는 자바스크립트 확장을 사용할 수도 있습니다. 하지만 이런 것들을 사용하지 않는다면 React에서 빌트 인 타입 체킹이 가능합니다. 컴포넌트의 props에서 타입을 체크하고싶다면 특별한 `propTypes` 속성을 할당할 수 있습니다.

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

`PropTypes` 는 받은 데이터가 유효한 지 확인하는 데 사용할 수 있는 유효성 검사기의 범위를 내보냅니다. 이 예제에서는 `PropTypes.string` 을 사용합니다. prop에 유효하지않은 값이 전달되면 자바스크립트 콘솔에 경고가 노출됩니다. 성능상의 이유로 `propTypes` 는 개발 모드에서만 체크합니다.

### PropTypes

다른 유효성 검사리를 제공하는 예제 문서입니다.

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS primitive. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### 단일 자식 요구하기

`PropTypes.element` 를 사용하면 하나의 컴포넌트만 자식으로써 전달되게 할 수 있습니다.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### 기본 Prop 값
`defaultProps` 속성을 사용하면 `props` 의 기본 값을 할당할 수 있습니다.

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

만약 [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) 같은 Babel 변형을 사용한다면, React 컴포넌트 클래스와 함께 `defaultProps` 를 정적 속성으로 선언할 수 있습니다. 이 구문은 아직 완성되지 않았으므로 브라우저 내에서 작업하려면 컴파일이 필요합니다. 더 자세항 정보는 [class fields proposal](https://github.com/tc39/proposal-class-fields) 를 살펴보세요.

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

부모 컴포넌트에 의해 지정되지 않은 경우 `this.props.name` 에 값을 보장하기 위해 `defaultProps` 를 사용합니다. `propTypes` 타입 체크는 `defaultProps` 가 해결된 후 발생하므로 `defaultProps` 에서도 타입 체크가 발생합니다.
