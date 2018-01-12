---
id: higher-order-components
title: 고차 컴포넌트 (Higher-Order Components)
permalink: docs/higher-order-components.html
---

고차 컴포넌트 (HOC, higher-order component)는 컴포넌트 로직을 재사용하기 위한 React의 고급 기술입니다. 고차 컴포넌트는 그 자체로는 React API의 일부분이 아닙니다. 고차 컴포넌트는 React의 컴포넌트적 성격에서 나타나는 패턴입니다.

구체적으로 **고차 컴포넌트는 컴포넌트를 취하여 새로운 컴포넌트를 반환하는 함수입니다.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

컴포넌트가 UI를 props로 변환하는 반면, 고차 컴포넌트는 컴포넌트를 다른 컴포넌트로 변환합니다.

고차 컴포넌트는 Redux의 [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 나 Relay의 [`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method) 같은 타사 React 라이브러리에서 흔히 쓰입니다.

이 문서에서 고차 컴포넌트가 왜 유용한 지 이야기하고 어떻게 작성하는 지 설명합니다.

## 크로스 커팅 문제에 고차 컴포넌트 사용하기

> **Note**
>
> 이전에는 크로스 커팅 문제를 제어하기 위해 mixin 사용을 권장했습니다. 하지만 mixin의 사용으로 얻는 이점보다 더 많은 문제를 일으킨다는 것을 깨달았습니다. 우리가 mixin을 더 이상 권장하지않는 이유와 기존 컴포넌트를 어떻게 변환하는 지에 대해서 [이 글](/blog/2016/07/13/mixins-considered-harmful.html)을 읽어보세요.

컴포넌트는 React에서 코드 재사용의 기본 단위입니다. 그러나 일부 패턴은 기존 컴포넌트에 적합하지않습니다.

예를 들어 외부로부터 데이터를 구독하여 덧글 목록을 렌더링하는 `CommentList` 컴포넌트가 있다고 합시다.

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

나중에 블로그 포스트를 구독하기 위해 비슷한 패턴으로 컴포넌트를 작성합니다.

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` 와 `BlogPost` 는 동일하지 않습니다. 두 컴포넌트는 `DataSource` 에서 서로 다른 메서드를 호출하며 다른 렌더링 결과를 보여줍니다. 하지만 대부분의 구현체는 동일합니다.

- 마운트되면, change 리스너를 `DataSource` 에 추가합니다.
- 리스너 안에서, 데이터 소스가 변경되면 `setState` 를 호출합니다.
- 마운트 해제되면 change 리스너를 제거합니다.

큰 어플리케이션에서 `DataSource` 를 구독하고 `setState` 를 호출하는 동일한 패턴이 반복적으로 발생한다고 상상할 수 있습니다. 이 로직을 한 곳에서 정의하고 많은 컴포넌트에서 로직을 공유할 수 있게하는 추상화가 필요로합니다. 이 때 고차 컴포넌트가 탁월합니다.

`DataSource` 를 구독하는 `CommentList` 나 `BlogPost` 같은 컴포넌트를 생성하는 함수를 작성할 수 있습니다. 데이터를 prop으로 구독하여 전달받는 자식 컴포넌트를 파라미터 중 하나로 받는 함수를 만듭니다. 이 함수를 `withSubscription` 라고 이름지어봅시다.

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

첫번째 파라미터는 래핑된 컴포넌트입니다. 두번째 파라미터는 우리가 관심을 가지는 데이터를 검색합니다. 여기서는 `DataSource` 와 현재 prosp를 줍니다.

`CommentListWithSubscription` 과 `BlogPostWithSubscription` 가 렌더링될 때 `CommentList` 와 `BlogPost` 는 `DataSource` 에서 가장 최근에 검색된 데이터를 `data` prop으로 전달합니다.

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

고차 컴포넌트는 입력 컴포넌트를 수정하지 않으며 상속을 사용하여 동작을 복사하지도 않습니다. 오히려 고차 컴포넌트는 원래 컴포넌트를 컨테이너 컴포넌트에 *래핑하여* *조정합니다*. 고차 컴포넌트는 사이드 이펙트가 없는 순수 함수입니다.

그리고 그게 다입니다. 래핑된 컴포넌트는 출력물을 렌더링하는 데 사용되는 `data`, 새로운 prop을 포함한 컨테이너의 모든 props를 받습니다. 고차 컴포넌트는 데이터가 사용되는 이유 및 방법과 연관이 없으며 래핑된 컴포넌트는 데이터가 어디서부터 왔는지와 연관이 없습니다.

`withSubscription` 는 일반 함수이기때문에 원하는 갯수의 인수를 추가할 수 있습니다. 예를 들어 래핑된 컴포넌트로부터 고차 컴포넌트를 더 격리시키기 위해 `data` prop 이름을 설정 가능하게 만들 수 있습니다. 혹은 `shouldComponentUpdate` 설정을 위한 인수를 받게 하거나 데이터 소스를 설정하는 인수를 받게할 수도 있습니다. 고차 컴포넌트가 컴포넌트 정의 방법을 완전히 제어할 수 있기 때문에 이러한 작업들이 모두 가능합니다.

컴포넌트와 마찬가지로 `withSubscription` 과 래핑된 컴포넌트 간 맺음은 완전히 props 기반입니다. 이렇게하면 래핑된 컴포넌트에 동일한 props를 제공한다면 다른 고차 컴포넌트를 쉽게 교차할 수 있습니다. 예를 들어 데이터를 가져오는 라이브러리를 변경하는 경우 유용하게 사용할 수 있습니다.

## 원본 컴포넌트를 변환하지마세요. 구성을 사용하세요.

고차 컴포넌트 내부에서 컴포넌트의 프로토타입을 수정(또는 변형)하려는 유혹에 저항하세요.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

여기에는 몇가지 문제가 있습니다. 하나는 입력 컴포넌트를 향상된 컴포넌트와 별도로 재사용할 수 없다는 것입니다. 더 중요한 것은 `EnhancedComponent`에 또 다른 고차 컴포넌트를 적용하여 `componentWillReceiveProps` *또한* 변형시키면 첫번째 고차 컴포넌트의 기능이 오버라이드됩니다. 이 고차 컴포넌트는 라이프사이클 메서드가 없는 함수 컴포넌트에서는 동작하지않습니다.

변형 고차 컴포넌트는 새는 추상화입니다. 다른 고차 컴포넌트와 충돌을 피하기 위한 구현방법을 알아야합니다.

고차 컴포넌트에서 변형을 사용하는 대신 입력 컴포넌트를 컨테이너 컴포넌트로 래핑하여 구성을 사용해야합니다.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

이 고차 컴포넌트는 변형된 버전과 동일하게 움직이지만 충돌 가능성은 배제하고있습니다. 클래스 및 함수형 컴포넌트에서 잘 동작합니다. 그리고 순수한 함수이기 때문에 다른 고차 컴포넌트와 같이 구성하거나 심지어 자체적으로 구성할 수 있습니다.

고차 컴포넌트와 **컨테이너 컴포넌트** 라 불리는 패턴이 유사함을 느꼈을 수 있습니다. 컨테이너 컴포넌트는 상위 수준과 하위 수준 관심사를 분리하는 전략의 일부입니다. 컨테이너는 구독 및 state 같은 것을 관리하고 UI 렌더링같은 것을 처리하는 컴포넌트에 props를 전달합니다. 고차 컴포넌트는 컨테이너를 그 구현체 중 일부에 사용하고있습니다. 고차 컴포넌트는 파라미터화된 컨테이너 컴포넌트 정의로 생각할 수 있습니다.

## 컨벤션: 래핑된 컴포넌트를 통해 관련없는 Props 전달하기

고차 컴포넌트는 컴포넌트에 기능을 추가합니다. 고차 컴포넌트는 맺음을 과감하게 변경해서는 안됩니다. 고차 컴포넌트는 반환된 컴포넌트에서는 래핑된 컴포넌트와 비슷한 인터페이스가 있어야합니다.

고차 컴포넌트는 특정 관심사과 관련이 없는 props를 통해야합니다. 대부분의 고차 컴포넌트에는 다음과 같은 렌더링 메서드가 포함되어있습니다.

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

이 컨벤션은 고차 컴포넌트가 최대한 유연하고 재사용 가능한 지 확인하는데 도움이 됩니다.

## 컨벤션: 합성 가능성 최대화하기

모든 고차 컴포넌트가 똑같이 보이지 않습니다. 때때로 단일 인수로 래핑된 컴포넌트만 받을 때도 있습니다.

```js
const NavbarWithRouter = withRouter(Navbar);
```

일반적으로 고차 컴포넌트는 추가 인수를 허용합니다. Relay 예제에서 config 객체는 컴포넌트의 데이터 의존성을 지정하기 위해 사용합니다.

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

고차 컴포넌트에 대한 가장 일반적인 서명은 다음과 같습니다.

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```
*뭐?!* 이걸 분해해보면 무슨 일이 일어나고 있는지 쉽게 알 수 있습니다.

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

다르게 말하면 `connect` 는 고차 컴포넌트를 반환하는 고차 함수입니다.

이 형태는 혼란스럽거나 유효하지않게 보일 수 있지만 매우 유용한 속성입니다. `connect` 함수에 의해 반환된 것과 같은 단일 인수 고차 컴포넌트는 `Component => Component` 서명을 가지고 있습니다. 출력 타입이 입력 타입과 동일한 함수는 정말 쉽게 조합할 수 있습니다.

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(이 속성을 사용하면 `connect` 및 다른 인핸서 스타일 고차 컴포넌트를 데코레이터로 사용할 수 있으나, 이는 실험적 자바스크립트 제안입니다.)

`compose` 유틸리티 함수는 lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), [Ramda](http://ramdajs.com/docs/#compose)를 포함한 많은 타사 라이브러리에서 제공합니다.

## 컨벤션: 쉬운 디버깅을 위한 디스플레이 네임 감싸기

고차 컴포넌트로 만든 컨테이너 컴포넌트는 다른 컴포넌트처럼 [React Developer Tools](https://github.com/facebook/react-devtools)에 보입니다. 디버깅을 쉽게 하려면 고차 컴포넌트의 결과인 것을 나타내는 디스플레이 네임을 선택하세요.

가장 일반적인 기술은 래핑된 컴포넌트의 디스플레이 네임을 감싸는 것입니다. 그래서 만약 고차 컴포넌트의 이름이 `withSubscription` 이고 래핑된 컴포넌트의 디스플레이 네임이 `CommentList` 라면 디스플레이 네임으로 `WithSubscription(CommentList)` 를 사용합니다.

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

## 주의사항

고차원 컴포넌트에는 React를 처음 접하는 사람이라면 즉시 알 수 없는 몇가지 주의사항이 있습니다.

### render 메서드 안에서 고차 컴포넌트를 사용하지마세요.

React의 비교 알고리즘 (조정이라고 부름)은 컴포넌트 ID를 사용하여 기존 서브트리를 업데이트해야하는지 아니면 버리고 새로운 노드를 마운트해야 하는지를 결정합니다. `render` 에서 반환된 컴포넌트가 이전 렌더링의 컴포넌트와 동일하다면 (`===`) React가 새 트리와 비교하여 반복적으로 서브트리를 업데이트합니다. 만약 동일하지 않다면 이전 서브트리는 완전히 마운트 해제됩니다.

보통 이것에 대해 생각할 필요가 없습니다. 그러나 컴포넌트의 렌더링 메서드 안에서 컴포넌트에 고차 컴포넌트를 적용할 수 없기 때문에 고차 컴포넌트에서 중요합니다.

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

여기서 문제는 성능상의 문제만 있는 것이 아닙니다. 컴포넌트를 다시 마운트하면 컴포넌트의 state와 모든 하위 항목이 손실됩니다.

대신 컴포넌트 정의 외부에서 고차 컴포넌트를 적용하여 결과 컴포넌트가 한번만 생성되도록 해야합니다. 그런 다음 ID가 렌더링간에 일관되게 유지됩니다. 이것이 대체로 원하는 것입니다.

드물게 고차 컴포넌트를 동적으로 적용해야하는 경우에도 컴포넌트의 라이프사이클 메서드 또는 생성자 내에서 고차 컴포넌트를 수행할 수도 있습니다.

### 정적 메서드는 복사해야합니다.

React 컴포넌트에서 정적 메서드를 정의하는 것이 유용할 때가 있습니다. 예를 들어, Relay 컴포넌트는 정적 메서드인 `getFragment` 를 GraphQL framents 구성을 용이하게 하기 위해 사용합니다.

고차 컴포넌트를 컴포넌트에 적용할 때 원본 컴포넌트는 컨테이너 컴포넌트에 감싸집니다. 즉 새 컴포넌트에는 원본 컴포넌트의 정적 메서드가 없습니다.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

이 문제를 해결하기 위해 메서드를 반환하기 전에 컨테이너에 메서드를 복사할 수 있습니다.

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

그러나 이렇게하려면 어떤 메서드를 복사해야하는 지 정확히 알아야합니다. 모든 React가 아닌 정적 메서드를 자동으로 복사하기 위해 [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)를 사용할 수 있습니다.

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

다른 긍정적인 해결방법은 정적 메서드를 컴포넌트 자체와 별도로 내보내는 것입니다.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs는 전달할 수 없습니다.

고차 컴포넌트에 대한 컨벤션은 모든 props를 래핑된 컴포넌트로 전달하는 것이지만 refs를 전달하는 것은 불가능합니다. 이 이유는 `ref` 가 prop이 아니기 때문입니다. `key` 처럼 React가 특별히 처리합니다. 컴포넌트가 고차 컴포넌트의 결과인 요소에 대한 ref를 추가하면 ref는 래핑된 컴포넌트가 아닌 가장 바깥쪽 컨테이너 컴포넌트의 인스턴스를 참조합니다.

만약 이런 문제에 직면했을 때 가장 이상적인 해결방법은 `ref` 를 사용을 피하는 방법을 찾는 것입니다. 때때로 React 패러다임에 익숙하지 않은 유저는 prop이 더 잘 작동하는 환경에서도 refs에 의존합니다.

refs가 유효한 탈출구일 때도 있습니다. React는 그들을 다르게 지원하지 않을 것입니다. 입력 필드에 포커스를 맞추는 것을 컴포넌트의 필수 제어가 필요한 경우로 예를 들 수 있습니다. 이 케이스에서 한가지 방법은 ref 콜백을 일반 prop으로써 전달하고, 다른 이름을 부여하는 것입니다.

```js
function Field({ inputRef, ...rest }) {
  return <input ref={inputRef} {...rest} />;
}

// Wrap Field in a higher-order component
const EnhancedField = enhance(Field);

// Inside a class component's render method...
<EnhancedField
  inputRef={(inputEl) => {
    // This callback gets passed through as a regular prop
    this.inputEl = inputEl
  }}
/>

// Now you can call imperative methods
this.inputEl.focus();
```

어떤 방법으로도 완벽한 해결 방법은 아닙니다. ref가 주동으로 처리하도록 요구하기보다는 라이브러리의 관심사로 남아있기를 선호합니다. 이 문제를 해결할 수 있는 방법을 모색 중이므로 고차 컴포넌트 사용은 관찰할 수 없습니다.