---
id: context
title: Context
permalink: docs/context.html
---

Context를 사용하면 일일이 props를 내려보내주지 않아도 데이터를 컴포넌트 트리 아래쪽으로 전달할 수 있습니다.

전형적인 React 어플리케이션에서, 데이터는 props를 통해 위에서 아래로 (부모에서 자식으로) 전달됩니다. 하지만 이런 방식은 몇몇 유형의 props에 대해서는 굉장히 번거로운 방식일 수 있습니다. (예를 들어 언어 설정, UI 테마 등) 어플리케이션의 많은 컴포넌트들에서 이를 필요로 하기 때문입니다. Contetxt를 사용하면 prop을 통해 트리의 모든 부분에 직접 값을 넘겨주지 않고도, 값을 공유할 수 있습니다.

> 역주:
>
> 이 문서에서 소개하는 Context API는 2018년 3월 30일에 배포된 React 16.3 버전에서 추가되었습니다.

- [언제 Context를 사용해야 할까요?](#when-to-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Provider](#provider)
  - [Consumer](#consumer)
- [Examples](#examples)
  - [값이 변하는 Context](#dynamic-context)
  - [중첩된 컴포넌트에서 context 갱신하기](#updating-context-from-a-nested-component)
  - [여러 context에서 값 넘겨받기](#consuming-multiple-contexts)
  - [라이프사이클 메소드에서 context에 접근하기](#accessing-context-in-lifecycle-methods)
  - [Consuming Context with a HOC](#consuming-context-with-a-hoc)
  - [Forwarding Refs to Context Consumers](#forwarding-refs-to-context-consumers)
- [주의사항](#caveats)
- [Legacy API](#legacy-api)


## 언제 Context를 사용해야 할까요?

Context는 React 컴포넌트 트리 전체에 걸쳐 데이터를 공유하기 위해 만들어졌습니다. 그러한 데이터로는 로그인 된 사용자의 정보, 테마, 언어 설정 등이 있을 수 있겠죠. 예를 들어, 아래 코드에서는 Button 컴포넌트의 스타일링을 위해 "theme" prop을 일일이 엮어주고 있습니다:

`embed:context/motivation-problem.js`

Context를 사용하면, 중간 계층에 위치하는 엘리먼트에 props를 넘겨주는 작업을 피할 수 있습니다:

`embed:context/motivation-solution.js`

> 주의
>
> 단지 몇 단계의 prop 전달을 건너뛰기 위해 context를 사용하지는 마세요. 여러 계층의 여러 컴포넌트에서 같은 데이터를 필요로 할 때에만 context를 사용하세요.

## API

### `React.createContext`

```js
const {Provider, Consumer} = React.createContext(defaultValue);
```

`{ Provider, Consumer }` 쌍을 만듭니다. React가 context `Consumer`를 렌더링하면, 같은 context로부터 생성된 가장 가까운 상위 `Provider`에서 현재 context의 값을 읽어옵니다.

`defaultValue` 인수는 **오직** 상위에 같은 context로부터 생성된 Provider가 없을 경우에만 사용됩니다. 이 기능을 통해 Provider 없이도 컴포넌트를 손쉽게 테스트해볼 수 있습니다. 주의: Provider에서 `undefined`를 넘겨줘도 Consumer에서 `defaultValue`를 사용되지는 않습니다.

### `Provider`

```js
<Provider value={/* some value */}>
```

Context의 변화를 Consumer에게 통지하는 React 컴포넌트입니다.

`value` prop을 받아서 이 Provider의 자손인 Consumer에서 그 값을 전달합니다. 하나의 Provider는 여러 Consumer에 연결될 수 있습니다. 그리고 Provider를 중첩해서 트리의 상위에서 제공해준 값을 덮어쓸 수 있습니다.

### `Consumer`

```js
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

Context의 변화를 수신하는 React 컴포넌트입니다.


[function as a child](/docs/render-props.html#using-props-other-than-render) 패턴을 사용합니다. 함수는 현재 context의 값을 받아서 React 노드를 반환해야 합니다. 트리 상위의 가장 가까이 있는 Provider의 `value` prop이 이 함수에 전달됩니다. 만약 트리 상위에 Provider가 없다면, `createContext()`에 넘겨진 `defaultValue` 값이 대신 전달됩니다.

> 주의
> 
> 'function as a child' 패턴에 대한 자세히 알고싶으시면 [render props](/docs/render-props.html) 문서를 참고하세요.

Provider의 자손인 모든 Consumer는 Provider의 `value` prop이 바뀔 때마다 다시 렌더링됩니다. 이는 `shouldComponentUpdate`의 영향을 받지 않으므로, 조상 컴포넌트의 업데이트가 무시된 경우라 할지라도 Consumer는 업데이트될 수 있습니다.

[`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 알고리즘을 통해 이전 값과 새 값을 비교함으로써 `value` prop이 바뀌었는지를 결정합니다.

> 주의
> 
> 위 알고리즘 때문에, `value` prop에 객체를 넘기는 경우에 문제가 생길 수 있습니다: [주의사항](#caveats)을 확인하세요.

## Examples

### 값이 변하는 Context

값이 변하는 theme value를 보여주는 좀 더 복잡한 예제입니다:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### 중첩된 컴포넌트에서 context 갱신하기

컴포넌트 트리의 깊은 곳에 위치한 컴포넌트에서 context의 값을 갱신해야 하는 경우가 종종 있습니다. 이런 경우 함수를 아래로 넘겨주어 consumer가 context의 값을 갱신하게 만들 수 있습니다:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### 여러 context에서 값 넘겨받기

각 consumer를 별도의 노드로 만들어줄 수 있습니다.

`embed:context/multiple-contexts.js`

둘 이상의 context가 자주 함께 사용된다면, 이를 묶은 render prop 컴포넌트를 만드는 것을 고려해볼 수도 있습니다.

### 라이프사이클 메소드에서 context에 접근하기

라이프사이클 메소드에서 context 값을 사용해야 하는 경우가 있습니다. 이 때에는 값을 prop으로 넘겨준 뒤, 일반적인 prop을 다루듯이 다루면 됩니다.

`embed:context/lifecycles.js`

### Consuming Context with a HOC

Some types of contexts are consumed by many components (e.g. theme or localization). It can be tedious to explicitly wrap each dependency with a `<Context.Consumer>` element. A [higher-order component](/docs/higher-order-components.html) can help with this.

For example, a button component might consume a theme context like so:

`embed:context/higher-order-component-before.js`

That's alright for a few components, but what if we wanted to use the theme context in a lot of places?

We could create a higher-order component called `withTheme`:

`embed:context/higher-order-component.js`

Now any component that depends on the theme context can easily subscribe to it using the `withTheme` function we've created:

`embed:context/higher-order-component-usage.js`

### Forwarding Refs to Context Consumers

One issue with the render prop API is that refs don't automatically get passed to wrapped elements. To get around this, use `React.forwardRef`:

**fancy-button.js**
`embed:context/forwarding-refs-fancy-button.js`

**app.js**
`embed:context/forwarding-refs-app.js`

## 주의사항

Context는 consumer를 다시 렌더링해야하는 시점을 결정하기 위해 값의 참조가 동일한지를 비교하기 때문에, provider의 부모가 렌더링될 때 consumer가 불필요하게 다시 렌더링되는 문제가 생길 수 있습니다. 예를 들어, 아래 코드는 Provider가 다시 렌더링될 때 모든 consumer를 다시 렌더링시키는데, 이는 `value`에 매번 새로운 객체가 넘겨지기 때문입니다:

`embed:context/reference-caveats-problem.js`


이 문제를 회피하려면, value로 사용할 객체를 부모의 state에 저장하세요:

`embed:context/reference-caveats-solution.js`

## Legacy API

> Note
> 
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. The legacy API will be removed in a future major React version. Read the [legacy context docs here](/docs/legacy-context.html).
 