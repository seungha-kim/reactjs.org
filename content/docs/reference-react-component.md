---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

본 문서는 React 컴포넌트 클래스에 대한 API 참조문서입니다. 이 문서를 읽는 여러분이 기초적인 React 개념에 익숙하다고 가정하고 있습니다. [Components and Props](/docs/components-and-props.html) 혹은 [State and Lifecycle](/docs/state-and-lifecycle.html) 같은 것들 말이죠. 감이 오지 않는다면, 앞의 문서들을 먼저 읽으세요.

## 개요

React에서는 컴포넌트를 클래스 혹은 함수로서 정의할 수 있습니다. 클래스 컴포넌트는 이 페이지에서 설명하는 추가적인 기능을 제공합니다. React 컴포넌트 클래스를 정의하려면, `React.Component` 클래스를 상속받으세요:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

`React.Component`의 서브클래스에서는 [`render()`](#render) 메소드를 반드시 정의해야 합니다. 이 페이지에서 설명하는 다른 메소드들은 정의하지 않아도 무방합니다.

**자체적으로 만든 컴포넌트 클래스를 상속받지 마세요.** [대신 합성을 통해 React 컴포넌트 코드를 재사용할 수 있습니다.](/docs/composition-vs-inheritance.html)

>주의:
>
>React를 사용하기 위해 반드시 ES6 클래스 문법을 사용할 필요는 없습니다. 대신 `create-react-class` 모듈이나 그와 비슷한 추상화 방법을 사용할 수 있습니다. [Using React without ES6](/docs/react-without-es6.html) 문서를 참고하세요.

### 컴포넌트 라이프사이클

컴포넌트는 여러 "라이프사이클 메소드"를 가질 수 있고, 이를 통해 특정 시점에 코드를 실행시킬 수 있습니다. **[이 라이프사이클 도표](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)를 활용하세요.** 아래 목록에서는 자주 사용되는 라이프사이클 메소드를 **볼드 처리** 했습니다. 나머지 메소드들은 자주 사용되지는 않습니다.

#### 마운트 관련

아래 메소드들은 컴포넌트 인스턴스가 만들어져서 DOM에 삽입되는 과정에서 순서대로 호출됩니다:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>주의:
>
>아래 메소드는 과거에 사용되었고 새 코드에서 사용되어서는 [안됩니다.](/blog/2018/03/27/update-on-async-rendering.html)
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### 갱신 관련

Props나 state가 변경되면 갱신이 일어납니다. 아래 메소드들은 컴포넌트가 다시 렌더링되는 과정에서 순서대로 호출됩니다:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>주의:
>
>아래 메소드는 과거에 사용되었고 새 코드에서 사용되어서는 [안됩니다.](/blog/2018/03/27/update-on-async-rendering.html)
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### 언마운트 관련

이 메소드는 DOM으로부터 컴포넌트가 제거될 때 호출됩니다:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### 에러 핸들링

이 메소드는 자식 컴포넌트의 렌더링, 라이프사이클 메소드, 생성자에서 에러가 발생했을 때 호출됩니다: 

- [`componentDidCatch()`](#componentdidcatch)

### 그 외

이 외에 몇 가지 API를 제공하고 있습니다:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### 정적 (클래스) 속성

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### 인스턴스 속성

  - [`props`](#props)
  - [`state`](#state)

* * *

## 참조

### 자주 사용되는 라이프사이클 메소드

본 섹션에 나오는 메소드를 사용해서 여러분이 React 컴포넌트를 만들때 부딪히는 대부분의 문제를 해결할 수 있습니다. **[이 라이프사이클 도표](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)도 확인해보세요.**

### `render()`

```javascript
render()
```

`render()` 메소드는 클래스 컴포넌트에서 유일하게 요구되는 메소드입니다.

이 메소드가 호출되면 `this.props`와 `this.state`를 가지고 아래 유형들 중 한 가지에 해당하는 값을 반환해야 합니다:

- **React 엘리먼트.** 대개 [JSX](/docs/introducing-jsx.html)를 통해 생성됩니다. 예를 들어, `<div />`와 `<MyComponent />`는 React 엘리먼트로, 각각 DOM 노드 혹은 사용자 정의 컴포넌트를 렌더링하라는 명령을 React에 내립니다.
- **배열 혹은 fragments.** 한꺼번에 여러 개의 엘리먼트를 반환할 수 있습니다. [fragments](/docs/fragments.html) 문서에서 자세한 내용을 확인하세요.
- **Portals**. 분리된 DOM 서브트리에 렌더링을 할 수 있습니다. [portals](/docs/portals.html) 문서에서 자세한 내용을 확인하세요.
- **String and numbers.** 이 값들은 DOM에 텍스트로서 렌더링됩니다.
- **Booleans or `null`**. 아무것도 렌더링하지 않습니다. (이 기능은 `return test && <Child />` 패턴을 위해 존재합니다.)

`render()` 함수는 순수함수여야 합니다. 즉, 컴포넌트의 상태를 변경하지 말아야 하고, 같은 입력에 대해 같은 결과를 반환해야 하며, 브라우저와 직접 상호작용을 해서는 안됩니다.

만약 브라우저와 상호작용을 할 필요가 있다면, 그 작업을 `componentDidMount()` 혹은 다른 라이프사이클 메소드에서 수행하세요. `render()` 함수를 순수함수로 만들어야 문제가 생기지 않습니다.

> 주의
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) 메소드가 false를 반환한다면 `render()`가 호출되지 않습니다.

* * *

### `constructor()`

```javascript
constructor(props)
```

**만약 state를 초기화하거나 메소드 바인딩 처리를 하지 않는다면, React 컴포넌트에서 생성자를 구현해야할 필요가 없습니다.**

React 컴포넌트의 생성자는 마운트되기 전에 호출됩니다. `React.Component`를 상속받아서 생성자를 구현할 때에는 `super(props)`를 생성자의 첫 부분에서 호출해주세요. 이렇게 해주지 않으면 `this.props`가 undefined가 되어 버그가 생길 수 있습니다.

대개 생성자는 아래 두 가지 용도로만 사용됩니다:

* `this.state`에 객체를 대입함으로써 [지역 상태](/docs/state-and-lifecycle.html)를 초기화한다.
* [이벤트 핸들러](/docs/handling-events.html) 메소드에 대한 바인딩 처리를 한다.

`constructor()` 내부에서 **`setState()`를 호출하지 마세요.** 대신 생성자 안에서 **초기 상태를 `this.state`에 대입**해주세요:

```js
constructor(props) {
  super(props);
  // 여기서 this.setState() 호출을 하지 마세요!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

생성자는 `this.state`에 값을 직접 대입할 수 있는 유일한 장소입니다. 다른 메소드에서는 대신 `this.setState()`를 사용하세요.

생성자에서 어떤 부작용도 일으키지 마세요. 그런 용도로는 대신 `componentDidMount()`를 사용하세요.

>주의
>
>**props를 state에 복사하지 마세요! 이는 흔한 실수입니다:**
>
>```js
>constructor(props) {
>  super(props);
>  // 이렇게 하지 마세요!
>  this.state = { color: props.color };
>}
>```
>
>일단 위 코드는 무의미하고 (대신 직접 `this.props.color`를 사용할 수 있습니다), 버그을 일으킵니다 (`color` prop이 변경되어도 state에 반영되지 않습니다).
>
>**의도적으로 prop 변경사항을 무시하길 원하는 경우에만 이 패턴을 사용하세요.** 이런 경우, prop 이름을 `initialColor` 라던가 `defaultColor` 등으로 바꾸어 의도를 반영해주는 것이 좋습니다. 그런 다음 필요할 때마다 [키를 바꾸어줌으로써](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 강제로 컴포넌트를 초기화시킬 수 있습니다.
>
> props에 따라 변하는 state가 필요하다면, [다른 데이터로부터 유래되는 state](/blog/2018/06/07/you-probably-dont-need-derived-state.html)를 다룬 블로그 글을 읽어보세요.

* * *

### `componentDidMount()`

```javascript
componentDidMount()
```

`componentDidMount()` 라이프사이클 메소드는 컴포넌트가 마운트된 직후에 (즉 트리에 삽입된 직후에) 호출됩니다. DOM 노드를 필요로 하는 초기화 작업을 여기에서 하면 됩니다. 만약 멀리 떨어진 곳에서 데이터를 불러와야 한다면, 이 곳이 바로 그러한 네트워크 요청을 보내기 좋은 장소입니다.

이 메소드에서 데이터 구독에 대한 설정을 하기를 권장합니다. 그 뒤 `componentWillUnmount()`에서 구독 취소를 하는 것을 잊지 마세요.

`componentDidMount()` 안에서 `setState()`를 **즉시 호출**하는 경우에 대해 알아봅시다. 이 작업은 추가적인 렌더링을 일으키지만, 브라우저가 화면을 갱신하기 전에 처리됩니다. 이 성질로 인해 `render()`가 두 번 호출된다고 하더라도, 사용자는 중간 과정을 볼 수 없습니다. 이 패턴을 사용할 때에는 성능 문제가 발생하지 않도록 주의하세요. 대부분의 경우, `constructor()` 내부에서 초기 상태를 지정해주는 것만으로도 문제를 해결할 수 있습니다. 다만 모달이다 툴팁과 같이 렌더링을 하기 전에 DOM 노드의 크기나 위치를 측정해야 하는 경우에는 이 패턴이 필요한 경우가 있습니다.

* * *

### `componentDidUpdate()`

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` 라이프사이클 메소드는 갱신이 일어난 직후에 호출됩니다. 이 메소드는 최소 렌더링 시에는 호출되지 않습니다.

컴포넌트가 갱신되었을 때 DOM을 조작하는 용도로 이 메소드를 사용하세요. 또한 이 메소드를 통해 props의 변경 여부에 따라 필요할 때에만 네트워크 요청을 보내고 싶을 때에도 이 메소드를 활용할 수 있습니다.

```js
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

`componentDidUpdate()` 안에서 `setState()`를 **즉시 호출**하는 경우, 이 호출은 위 예제와 같이 반드시 조건문 안에 들어가야 합니다. 그렇지 않으면 무한 루프에 빠지게 될 것입니다. 또한 사용자가 볼 수는 없지만 추가적인 렌더링을 일으켜서 성능에 영향을 미칠 수 있습니다.

이 메소드를 사용해 위에서 내려준 prop을 그대로 state에 저장하는 것은 좋은 방법이 아닙니다. 대신 prop을 직접 사용하세요. [props를 state에 복사하는 것이 어떻게 버그를 일으키는지](/blog/2018/06/07/you-probably-dont-need-derived-state.html)에 대한 글을 살펴보세요.

그럴 일은 잘 없지만 컴포넌트에 `getSnapshotBeforeUpdate()` 라이프사이클 메소드를 구현하는 경우, 이 메소드가 반환하는 값이 `componentDidUpdate()`의 세 번째 "snapshot" 인수로 넘겨질 것입니다. 반환값이 없으면 undefined가 대신 넘겨집니다.

> 주의
>
> [`shouldComponentUpdate()`](#shouldcomponentupdate) 메소드가 false를 반환하는 경우 `componentDidUpdate()`가 호출되지 않습니다.

* * *

### `componentWillUnmount()`

```javascript
componentWillUnmount()
```

`componentWillUnmount()` 라이프사이클 메소드는 컴포넌트가 언마운트되기 직전에 호출됩니다. 여러 뒷처리 작업(타이머 해제, 네트워크 요청 취소, 데이터 구독 취소 등. 주로 `componentDidMount()`에서 설정됨)을 이 메소드에서 수행하세요.

`componentWillUnmount()` 내부에서 **`setState()`를 호출해서는 안 됩니다.** 컴포넌트에 절대로 다시 렌더링될 수 없기 때문입니다. 컴포넌트 인스턴스가 한 번 언마운트되면, 이 인스턴스는 절대로 다시 마운트될 수 없습니다.

* * *

### 자주 사용되지 않는 라이프사이클 메소드

The methods in this section correspond to uncommon use cases. They're handy once in a while, but most of your components probably don't need any of them. **You can see most of the methods below on [this lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) if you click the "Show less common lifecycles" checkbox at the top of it.**


### `shouldComponentUpdate()`

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` to let React know if a component's output is not affected by the current change in state or props. The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.

`shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when `forceUpdate()` is used.

This method only exists as a **[performance optimization](/docs/optimizing-performance.html).** Do not rely on it to "prevent" a rendering, as this can lead to bugs. **Consider using the built-in [`PureComponent`](/docs/react-api.html#reactpurecomponent)** instead of writing `shouldComponentUpdate()` by hand. `PureComponent` performs a shallow comparison of props and state, and reduces the chance that you'll skip a necessary update.

If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped. Note that returning `false` does not prevent child components from re-rendering when *their* state changes.

We do not recommend doing deep equality checks or using `JSON.stringify()` in `shouldComponentUpdate()`. It is very inefficient and will harm performance.

Currently, if `shouldComponentUpdate()` returns `false`, then [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), and [`componentDidUpdate()`](#componentdidupdate) will not be invoked. In the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning `false` may still result in a re-rendering of the component.

* * *

### `static getDerivedStateFromProps()`

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` is invoked right before calling the render method, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.

This method exists for [rare use cases](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) where the state depends on changes in props over time. For example, it might be handy for implementing a `<Transition>` component that compares its previous and next children to decide which of them to animate in and out.

Deriving state leads to verbose code and makes your components difficult to think about.  
[Make sure you're familiar with simpler alternatives:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.

* If you want to **re-compute some data only when a prop changes**, [use a memoization helper instead](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* If you want to **"reset" some state when a prop changes**, consider either making a component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

This method doesn't have access to the component instance. If you'd like, you can reuse some code between `getDerivedStateFromProps()` and the other class methods by extracting pure functions of the component props and state outside the class definition.

Note that this method is fired on *every* render, regardless of the cause. This is in contrast to `UNSAFE_componentWillReceiveProps`, which only fires when the parent causes a re-render and not as a result of a local `setState`.


### `getSnapshotBeforeUpdate()`

`getSnapshotBeforeUpdate()` is invoked right before the most recently rendered output is committed to e.g. the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle will be passed as a parameter to `componentDidUpdate()`.

This use case is not common, but it may occur in UIs like a chat thread that need to handle scroll position in a special way.

For example:

`embed:react-component-reference/get-snapshot-before-update.js`

In the above examples, it is important to read the `scrollHeight` property in `getSnapshotBeforeUpdate` because there may be delays between "render" phase lifecycles (like `render`) and "commit" phase lifecycles (like `getSnapshotBeforeUpdate` and `componentDidUpdate`).

* * *

### `componentDidCatch()`

```javascript
componentDidCatch(error, info)
```

[Error boundaries](/docs/error-boundaries.html) are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

A class component becomes an error boundary if it defines this lifecycle method. Calling `setState()` in it lets you capture an unhandled JavaScript error in the below tree and display a fallback UI. Only use error boundaries for recovering from unexpected exceptions; don't try to use them for control flow.

For more details, see [*Error Handling in React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Note
> 
> Error boundaries only catch errors in the components **below** them in the tree. An error boundary can’t catch an error within itself.

* * *

### Legacy Lifecycle Methods

The lifecycle methods below are marked as "legacy". They still work, but we don't recommend using them in the new code. You can learn more about migrating away from legacy lifecycle methods in [this blog post](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()`

```javascript
UNSAFE_componentWillMount()
```

`UNSAFE_componentWillMount()` is invoked just before mounting occurs. It is called before `render()`, therefore calling `setState()` synchronously in this method will not trigger an extra rendering. Generally, we recommend using the `constructor()` instead for initializing state.

Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

This is the only lifecycle hook called on server rendering.

> Note
>
> This lifecycle was previously named `componentWillMount`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

* * *

### `UNSAFE_componentWillReceiveProps()`

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note:
>
> Using this lifecycle method often leads to bugs and inconsistencies, and for that reason it is going to be deprecated in the future.
>
> If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.
>
> For other use cases, [follow the recommendations in this blog post about derived state](/blog/2018/06/07/you-probably-dont-need-derived-state.html).
> 
> If you used `componentWillReceiveProps` for **re-computing some data only when a prop changes**, [use a memoization helper instead](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
>
> If you used `componentWillReceiveProps` to **"reset" some state when a prop changes**, consider either making a component [fully controlled](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
>
> In very rare cases, you might want to use the [`getDerivedStateFromProps`](#static-getderivedstatefromprops) lifecycle as a last resort.

`UNSAFE_componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. Make sure to compare the current and next values if you only want to handle changes.

React doesn't call `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState()` generally doesn't trigger `UNSAFE_componentWillReceiveProps()`.

> Note
>
> This lifecycle was previously named `componentWillReceiveProps`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

* * *

### `UNSAFE_componentWillUpdate()`

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

Typically, this method can be replaced by `componentDidUpdate()`. If you were reading from the DOM in this method (e.g. to save a scroll position), you can move that logic to `getSnapshotBeforeUpdate()`.

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## 그 외 API

이제까지 나온 라이프사이클 메소드들은 React에 의해 호출됩니다. 아래에 나오는 메소드들은 여러분이 직접 호출할 수 있습니다.

이러한 메소드에는 딱 두가지 밖에 없습니다: `setState()`와 `forceUpdate()`

### `setState()`

```javascript
setState(updater[, callback])
```
`setState()` 메소드는 컴포넌트 state의 변경사항을 대기열에 밀어넣고, 변경사항으로부터 다시 렌더링이 일어나야한다는 사실을 React에게 통지합니다. 이벤트 핸들러나 서버의 응답에 따라 UI를 갱신하는 작업을 할 때, 바로 이 메소드를 사용하시면 됩니다.

`setState()`를 생각할 때, '즉각 적용되는 명령'이라기 보다는 *요청*의 느낌으로 생각해주세요. 사용자에게 보여지는 성능을 향상시키기 위해, React는 이 메소드의 호출을 연기할 수 있고, 여러 컴포넌트의 갱신을 한 번에 묶어 처리할 수 있습니다. React에서는 state 변경사항이 즉시 적용될거라는 보장이 없습니다.

`setState()`는 컴포넌트를 즉시 갱신하는 것이 아니라, 여러 개를 묶어서 처리하거나 지연시켜 처리합니다. 이런 성질 때문에, `setState()`를 호출한 뒤에 `this.state`를 읽을 때 문제가 생길 수 있습니다. 이런 작업을 해야할 때는 `componentDidUpdate`나 `setState` 콜백(`setState(updater, callback)`)을 사용하세요. 앞의 두 방법은 state 변경사항이 적용된 뒤에 작업이 실행되도록 보장해줍니다. 이전 state로부터 새 state를 저장해주는 경우라면, 아래에 나오는 `updater` 인수에 대한 내용을 읽어보세요.

`shouldComponentUpdate()` 메소드가 `false`를 반환하지 않는다면, `setState()`는 항상 렌더링을 일으킵니다. 만약 mutable 객체가 사용되고 있고 `shouldComponentUpdate()`에서 조건부 렌더링을 구현할 수 있는 상황이 아니라면, 이전 상태와 현재 상태를 비교해서 필요할 때만 `setState()`를 호출해주세요. 이렇게 함으로써 불필요한 렌더링을 방지할 수 있습니다.

첫 번째 인수는 `updater` 함수로 다음과 같은 형태를 갖습니다:

```javascript
// (이전 상태, props) => 다음 상태
(prevState, props) => stateChange
```

`prevState`는 이전 state에 대한 참조로, 직접 변경되어서는 안됩니다. 변경사항은 `prevState`와 `props`로부터 만들어진 새 객체를 통해 표현되어야 합니다. 예를 들어, `props.step` 만큼 state에 있는 값을 증가시켜야 한다고 해봅시다:

```javascript
this.setState((prevState, props) => {
  return {counter: prevState.counter + props.step};
});
```

updater 함수에서 받은 `prevState`와 `props`는 항상 최신의 값입니다. updater 함수로부터 반환된 값은 `prevState`에 얕게 병합됩니다.

`setState()`의 두 번째 인수는 콜백 함수로, 생략할 수 있습니다. 이 콜백은 `setState()`가 완료되어 컴포넌트가 다시 렌더링된 후에 한 번 실행됩니다. 보통 이런 작업을 해야할 때는 `componentDidUpdate()`를 대신 사용하는 것이 좋습니다.

`setState()`의 첫 번째 인수로 함수 대신 객체를 넘겨줄 수도 있습니다:

```javascript
setState(stateChange[, callback])
```

위 호출은 `stateChange`를 새 상태에 얕게 병합합니다. 예를 들어, 장바구니의 항목 수량을 조정하려면 다음과 같이 하면 됩니다:

```javascript
this.setState({quantity: 2})
```

이런 형태의 `setState()` 역시 비동기식으로, 한 번에 여러 호출이 일어나면 묶여서 실행될 수 있습니다. 예를 들어, 한 번에 장바구니 항목 수량을 조정하는 호출을 연이어 하면, 아래와 동일한 방식으로 동작할 것입니다:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

`setState()`의 연이은 호출은 이전 호출의 값을 덮어써버리기 때문에, 한 번만 증가하는 결과를 낳게 됩니다. 따라서, 다음 state가 이전 state로부터 계산되는 경우에는 아래와 같이 updater 함수를 사용하는 것을 권장합니다:

```js
this.setState((prevState) => {
  return {quantity: prevState.quantity + 1};
});
```

자세한 내용을 알아보려면 아래의 글들을 읽어보세요:

* [State and Lifecycle guide](/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()`

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## 클래스 속성

### `defaultProps`

컴포넌트 클래스의 `defaultProps` 속성을 통해 prop의 기본값을 지정해줄 수 있습니다. 이 기본값은 undefined prop을 대신하지만, null prop은 대신하지 않습니다. 예를 들어:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

만약 `props.color`를 넘겨주지 않는다면, 기본값인 `'blue'`가 대신 사용됩니다:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

만약 `props.color`로 null을 넘겨준다면, 그대로 null이 사용됩니다:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName`

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties

### `props`

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state`

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.