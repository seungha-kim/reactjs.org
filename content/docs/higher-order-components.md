---
id: higher-order-components
title: 고차 컴포넌트 (Higher-Order Components)
permalink: docs/higher-order-components.html
---

고차 컴포넌트(HOC: Higher-Order Component)는 컴포넌트 로직을 재사용하기 위해 사용되는 테크닉을 말합니다. HOC는 React API의 일부가 아닙니다. 조합이 용이한 React의 특성으로부터 생겨난 패턴입니다.

구체적으로 말하자면, **HOC는 컴포넌트를 인자로 받아서 새로운 컴포넌트를 반환하는 함수입니다.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

컴포넌트는 props를 UI로 변환하는 반면, HOC는 컴포넌트를 다른 컴포넌트로 변환합니다.

HOC는 Redux의 [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options), Relay의 [`createContainer`](https://facebook.github.io/relay/docs/api-reference-relay.html#createcontainer-static-method)와 같이, 서드파티 라이브러리에서 흔히 사용되고 있습니다.

이 문서에서는 HOC가 유용한 이유와 HOC의 작성법을 다룹니다.

## 횡단 관심사(Cross-Cutting Concerns)를 위해 HOC 사용하기

> **주의**
>
> 이전에 우리는 믹스인을 사용해 횡단 관심사를 다루는 것을 추천했습니다. 그 이후에 우리는 믹스인의 가치에 비해 그것이 만들어내는 문제가 더 크다는 것을 깨달았습니다. 우리가 믹스인을 왜 버렸는지, 그리고 이미 믹스인을 사용해 만들어진 컴포넌트를 어떻게 변경할 수 있는지 알고 싶다면 [이 글](/blog/2016/07/13/mixins-considered-harmful.html)를 참고하세요.

컴포넌트는 리액트의 코드 재사용을 위한 기본적인 단위입니다. 하지만, 어떤 패턴은 전통적인 컴포넌트 구조에는 딱 맞지 않을 수 있습니다.

예를 들어, `CommentList`라는 컴포넌트가 외부의 데이터를 받아와서 댓글 목록을 렌더링한다고 가정해봅시다:

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

그 이후에, 비슷한 패턴으로 하나의 블로그 포스트를 받아오는 컴포넌트를 작성한다고 해봅시다:

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

`CommentList`와 `BlogPost`의 로직이 완전히 동일하지는 않습니다. 다시 말해, 이 둘은 각각 `DataSource`의 다른 메소드를 호출하고 또 다른 결과물을 렌더링합니다. 하지만 대부분의 구현이 동일합니다:

- 마운트 시에, `DataSource`의 변경에 대한 리스너를 등록합니다.
- 데이터 소스가 변경될 때마다 리스너 내부에서 `setState`를 호출합니다.
- 언마운트 시에 리스너를 제거합니다.

이와 같은 패턴, 즉 `DataSource`를 구독하고 `setState`를 호출하는 작업을 끝없이 반복하는 대규모 앱을 상상해 보십시오. 로직을 한 곳에서 정의하고 여러 컴포넌트에 걸쳐 공유할 수 있는 추상화 수단이 필요합니다. 이 곳이 바로 HOC가 활약하는 지점입니다.

**컴포넌트를 생성하는 함수**를 만들어서 `CommentList` 나 `BlogPost` 같은 컴포넌트들이 `DataSource` 를 구독하게 만들 수 있습니다. 이 함수는 자식 컴포넌트를 인자로 받는데, 이 컴포넌트는 구독한 데이터를 prop으로 받습니다. 이 함수를 `withSubscription`이라 부릅시다:

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

첫 번째 인수는 감싸지는 컴포넌트입니다. 두 번째 인수로 주어진 함수는 `DataSource` 와 props를 이용해 필요한 데이터를 받아옵니다.

`CommentListWithSubscription`와 `BlogPostWithSubscription`가 렌더링될 때, `CommentList`와 `BlogPost`에는 `DataSource`로부터 받은 가장 최신의 데이터가 data prop으로 전달될 것입니다:

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
HOC는 입력받은 컴포넌트를 수정하지도, 상속받지도 않는다는 사실에 주목하십시오. 대신, HOC는 원래의 컴포넌트를 다른 컴포넌트로 *감싸는* 식으로 *합성*합니다. HOC는 부작용을 갖지 않는 순수 함수입니다.

이게 전부입니다! 감싸진 컴포넌트는 바깥쪽 컴포넌트로부터 새로운 prop을 포함한 모든 prop을 건네받으며, 여기에서는 결과를 렌더링하기 위해 `data`라는 prop을 받았습니다. HOC는 데이터가 왜 사용되는지, 어떻게 사용되는지에 대해서는 관심을 두지 않으며, 감싸진 컴포넌트는 데이터가 어디서 왔는지는 신경쓰지 않습니다.

`withSubscription`은 일반적인 함수이기 때문에, 인자의 개수는 원하는 대로 정할 수 있습니다. 예를 들어, HOC와 감싸지는 컴포넌트를 좀 더 분리시키기 위해 data prop의 이름을 설정할 수 있도록 만들 수도 있습니다. 또는 `shouldComponentUpdate`를 설정하는 인자를 받거나, 데이터 소스를 설정하는 인자를 받을 수도 있을 것입니다. HOC가 컴포넌트를 어떻게 정의할 지 완전히 제어할 수 있기 때문에 위와 같은 작업이 모두 가능합니다.

일반적인 컴포넌트와 마찬가지로, `withSubscription`과 감싸진 컴포넌트 사이의 연결은 모두 prop을 통해서 이루어집니다. 이렇게 함으로써 한 HOC를 같은 props를 제공하는 다른 HOC로 쉽게 교체할 수 있습니다. 예를 들어 데이터를 외부로부터 가져오는 라이브러리를 교체할 때 이 특성이 유용할 수 있습니다.

## 원래 컴포넌트를 변경하지 마세요. 합성을 사용하세요.

HOC 안에서 컴포넌트의 프로토타입을 (혹은 무엇이든) 변경하고픈 유혹에 저항하시기 바랍니다.

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

이러한 방식에는 몇 가지 문제가 있습니다. 먼저 입력된 컴포넌트가 `EnhancedComponent`와는 별개로 다른 곳에서 재사용될 수 없다는 문제가 있습니다. 더욱이, `componentWillReceiveProps`를 재차 변경하는 다른 HOC를 `EnhancedComponent`에 적용하면, 처음에 적용한 HOC의 기능이 덮어씌워진다는 문제가 있습니다! 또한 이 HOC는 라이프사이클 메소드가 없는 함수 컴포넌트에는 작동하지 않을 것입니다.

컴포넌트를 변경하는 HOC는 잘못된 추상화입니다 — 다른 HOC들과의 충돌을 피하려면 그들이 어떻게 구현되어있는지를 알아야만 합니다.

컴포넌트를 변경하는 대신, HOC는 합성(입력 컴포넌트를 컨테이너 컴포넌트로 감싸는 방법)을 사용해야 합니다.

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

위 HOC는 컴포넌트를 변경하는 버전과 같은 기능을 하지만 잠재적인 충돌의 위험을 피하고 있습니다. 또한 클래스 컴포넌트든 함수 컴포넌트든 할 것 없이 잘 동작합니다. 그리고 순수 함수이기 때문에, 다른 HOC 혹은 심지어 자기 자신과도 합성을 할 수 있습니다.

아마 여러분들께서는 HOC 패턴과 **컨테이너 컴포넌트**라 불리는 패턴 사이의 유사점을 눈치채셨을 겁니다. 컨테이너 컴포넌트는 고수준 관심사와 저수준 관심사에 대한 책임의 분리를 위한 전략의 일부분입니다. 컨테이너는 구독과 상태 같은 것들을 관리하고, UI를 렌더링하는 컴포넌트에 prop을 전달합니다. HOC는 그 구현 속에 컨테이너를 사용하고 있습니다. HOC는 '컨테이너 컴포넌트의 파라미터화된 정의다'라 생각해도 좋습니다.

## 관례: HOC와 무관한 prop은 감싸진 컴포넌트에 넘기세요.

HOC는 컴포넌트에 기능을 추가합니다. 그러므로 컴포넌트의 사용법을 극단적으로 바꾸어서는 안 됩니다. HOC로부터 반환된 컴포넌트는 감싸진 컴포넌트와 유사한 사용법을 갖도록 하는 것이 일반적입니다.

HOC는 그 자신의 관심사와 관계없는 props를 감싸진 컴포넌트에 그대로 넘겨야 합니다. 대부분의 HOC는 아래와 유사한 render 메소드를 갖습니다:

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

이 관례를 통해 최대한 유연하고 재사용 가능한 HOC를 만들 수 있습니다.

## 관례: 합성을 최대한 활용하세요.

모든 HOC가 똑같이 생긴 것은 아닙니다. 때때로 HOC는 하나의 인자, 즉 감싸지는 컴포넌트만을 인자로 받습니다.

```js
const NavbarWithRouter = withRouter(Navbar);
```

하지만 보통의 경우, HOC는 추가로 인자를 받습니다. 아래의 Relay 예제는, 컴포넌트의 데이터 의존성을 설정하기 위한 설정 객체를 인자로 받습니다.

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

HOC의 가장 일반적인 모양은 이렇게 생겼습니다.

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```
*이게 무슨 뜻일까요?* 나누어서 보면, 어떻게 돌아가고 있는 건지 알아보기 쉽습니다.

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

다시 말해서, `connect`는 HOC를 반환하는 고차 함수입니다!

이 방식은 혼란스럽고 불필요해 보일 수 있지만, 유용한 특징을 가지고 있습니다. `connect`가 반환하는 것과 같은 단일 인자 HOC의 모양은 `Component => Component`와 같습니다. (컴포넌트를 입력받아 컴포넌트를 반환함) 입력 형태와 출력 형태가 같은 함수는 여러 개를 합성하기 굉장히 쉽습니다.

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

(이와 같은 특성은 connect 및 다른 enhancer 스타일의 HOC가 decorator로 사용되어질 수 있도록 합니다. Decorator는 실험적으로 제안된 JavaScript의 기능입니다.)

`compose` 유틸리티 함수는 많은 서드파티 라이브러리에서 제공하고 있습니다. lodash ([`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), 그리고 [Ramda](http://ramdajs.com/docs/#compose)를 살펴보세요.

## 관례: 원활한 디버깅을 위해 displayName도 감싸주세요.

HOC에 의해 만들어진 컨테이너 컴포넌트는 다른 컴포넌트와 마찬가지로 [React Developer Tools](https://github.com/facebook/react-devtools)에서 볼 수 있습니다. 디버깅을 쉽게 하기 위해, HOC에 의해 반환되는 컴포넌트의 displayName을 설정해주는 것이 좋습니다.

널리 사용되는 방법은 감싸지는 안쪽 컴포넌트의 displayName을 HOC의 이름으로 감싸는 것입니다. 예를 들어 HOC의 이름이 `withSubscription`이고 감싸지는 컴포넌트의 displayName이 `CommentList`이면, `WithSubscription(CommentList)`와 같은 displayName을 써주면 됩니다.

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

React를 막 시작한 사람들에게는 명확히 와닿지 않을 주의사항이 몇 가지 있습니다.

### render 메소드 안에서 HOC를 사용하지 마세요.

React의 diffing 알고리즘(reconciliation)은 컴포넌트가 같은 지 판별하고 이를 이용해서 이미 존재하는 서브트리를 갱신할 지, 또는 서브트리를 날려버리고 새로운 것을 마운트할 지를 결정합니다. 만약 `render` 메소드에서 반환된 컴포넌트가 이전에 반환된 컴포넌트와 동일하다면 (`===`) React는 서브트리를 새로운 것과 비교해 재귀적으로 갱신합니다. 만약 두 개가 같지 않다면, 이전의 서브트리는 완전히 언마운트(unmount)됩니다.

일반적으로, 여러분이 이런 문제를 직접 고민할 필요는 없습니다. 하지만 HOC에 대해서는 이 문제가 중요한데, render 메소드 안에서는 HOC를 적용할 수 없다는 것을 뜻하기 때문입니다.

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

이 문제는 비단 성능에 관한 것만은 아닙니다 — 컴포넌트를 다시 마운트하면 해당 컴포넌트와 그 자식 컴포넌트들의 상태(state)를 잃어버리게 됩니다.

위와 같이 하는 대신, HOC를 컴포넌트 정의의 바깥에서 적용해서 반환되는 컴포넌트가 단 한 번만 만들어지도록 하세요. 그러면 여러 번 렌더링을 하더라도 컴포넌트의 동일성(identity)이 유지될 수 있습니다. 대개 이것이 우리가 원하는 결과입니다.

그럴 일은 잘 없겠지만 HOC를 동적으로 적용하고 싶은 경우에도, 다른 라이프사이클 메소드나 생성자에서 HOC를 적용할 수 있습니다.

### 정적 메소드는 반드시 복사되어야 합니다.

React 컴포넌트에 정의한 정적 메소드는 유용하게 쓸 수 있습니다. 예를 들어, Relay 컨테이너는 `getFragment`라는 정적 메소드를 이용해 GraphQL 프래그먼트를 조합하도록 합니다.

그런데 HOC를 컴포넌트에 적용하면, 원래 컴포넌트는 컨테이너 컴포넌트에 의해 감싸지게 됩니다. 즉, 새로운 컴포넌트는 원래 컴포넌트가 가지고 있던 정적 메소드를 하나도 갖고 있지 않게 됩니다.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

이 문제를 해결하기 위해, 컨테이너 컴포넌트를 반환하기 전에 정적 메소드를 직접 복사할 수 있습니다.

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

하지만, 위와 같은 방법을 사용하려면 정확히 어떤 메소드를 복사할 지 미리 알고 있어야 합니다. 대신 [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)를 사용해서 React 내장 정적 메소드가 아닌 모든 정적 메소드를 자동으로 복사하게 만들 수 있습니다.

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

정적 메소드를 직접 export해서 사용하는 방법도 가능합니다.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Ref는 전달되지 않습니다.

모든 prop을 안쪽 컴포넌트에 전달하는 것이 HOC의 관례입니다만, ref를 전달하는 것은 불가능합니다. 이것은 ref가 진짜 prop이 아니고, key와 마찬가지로 React에 의해 특별 취급되기 때문입니다. 만약 여러분이 HOC에서 반환하고자 하는 컴포넌트에 ref를 추가한다면, 그 ref는 안쪽 컴포넌트가 아니라 가장 바깥쪽의 컨테이너 컴포넌트에 대한 인스턴스를 가리키게 될 것입니다.

이 문제를 해결하려면, React 16.3 버전에서 추가된 `React.forwardRef` API를 사용하면 됩니다.
