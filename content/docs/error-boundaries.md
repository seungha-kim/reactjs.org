---
id: error-boundaries
title: 에러 경계 (Error Boundaries)
permalink: docs/error-boundaries.html
---

과거에는 컴포넌트 내부의 자바스크립트 에러로 인해 React의 내부 state가 손상되어 다음 렌더링에서 [발광하는](https://github.com/facebook/react/issues/4026) [숨겨진](https://github.com/facebook/react/issues/6895) [에러](https://github.com/facebook/react/issues/8579)가 발생하였습니다. 이러한 에러는 항상 어플리케이션 코드의 이전 코드에서 발생하였지만 React가 컴포넌트에서 정상적으로 처리할 수 있는 방법을 제공하지않았기 때문에 이를 복구할 수 없었습니다.


## 에러 경계를 소개합니다

UI의 일부분에 있는 자바스크립트 에러는 전체 앱을 망가뜨리지않습니다. React 유저가 이런 문제를 해결하기 위해 React 16부터 새로운 컨셉인 "에러 경계 (error boundary)"를 소개합니다.

에러 경계는 컴포넌트 트리가 깨지는 대신 **자식 컴포넌트 트리에서 에러를 잡아내고, 이러한 에러의 로그를 남기고, 폴백 UI를 보여주는** React 컴포넌트입니다. 에러 경계는 렌더링, 라이프사이클 메서드 및 그 아래 전체 트리 생성자에서 에러를 잡아냅니다.

> Note
> 
> 에러 경계가 잡지 **않는** 에러는 다음과 같습니다.
>
> * 이벤트 핸들러 ([learn more](#how-about-event-handlers))
> * 비동기 코드 (예를 들면 `setTimeout` 이나 `requestAnimationFrame` 콜백같은 것들)
> * 서버 사이드 렌더링
> * 에러 경계 자체가 내뱉는 에러 (자식보다는)

클래스 컴포넌트에서 `componentDidCatch(error, info)`라는 새로운 라이프사이클 메서드를 정의하여 에러 경계가 됩니다.

```js{7-12,15-18}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

그런 다음 일반 컴포넌트로 사용할 수 있습니다.

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

`componentDidCatch()` 메서드는 자바스크립트 `catch {}` 블록처럼 동작하지만 컴포넌트 전용입니다. 클래스 컴포넌트에서만 에러 경계를 만들 수 있습니다. 실제로 대부분의 경우 에러 경계 컴포넌트를 한번만 선언하고 어플리케이션 전체에서 사용하려고합니다.

**에러 경계는 트리 아래에 에러가 있는 컴포넌트에서만 에러를 잡는다는 점** 을 명심하시길 바랍니다. 에러 경계는 자기 자신을 포함하는 에러는 잡지 못합니다. 에러 경계가 에러 메시지를 렌더링하는 데 실패하면 그 에러는 그 위의 가장 가까운 에러 경계로 전파됩니다. 이 또한 자바스크립트 catch {} 블록을 캐치하는 법과 유사합니다.

### componentDidCatch 파라미터

`error` 는 던져진 에러입니다.

`info` 는 `componentStack` 키를 가진 객체입니다. 속성에는 오류가 발생하는동안의 컴포넌트 스택에 대한 정보가 있습니다.

```js
//...
componentDidCatch(error, info) {
  
  /* Example stack information:
     in ComponentThatThrows (created by App)
     in ErrorBoundary (created by App)
     in div (created by App)
     in App
  */
  logComponentStackToMyService(info.componentStack);
}

//...
```

## 라이브 데모

[React 16 beta](https://github.com/facebook/react/issues/10294) 로 구현한 [에러 경계를 사용하고 선언한 예제](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)를 참고하세요.

## 에러 경계를 어디에 두어야하는가

에러 경계의 세분성은 개발자에게 달려있습니다. 서버사이드 프레임워크가 종종 충돌을 처리하는 것처럼 "무언가 잘못되었다는" 메시지를 유저에게 보여주려면 최상위 라우트 컴포넌트를 감싸면됩니다. 또한 개별 위젯을 에러 경계로 감싸서 어플리케이션의 나머지 부분이 충돌나지않도록 할 수 있습니다.

## 잡히지않은 에러에 대한 새로운 동작

이 변경사항은 중요한 의미를 가집니다. **React 16부터는 에러 경계에 잡히지 않은 오류로 인해 전체 React 컴포넌트 트리가 마운트 해제됩니다.**

우리는 이 결정에 대해 논의를 하였지만, 우리의 경험에 따르면 UI를 완전히 제거하는 것보다 손상된 UI를 그대로 두는 것이 더 나쁩니다. 예를 들어 메신저같은 제품에서 손상된 UI를 남겨두면 누군가가 잘못된 사람에게 메시지를 전달하도록 이끌 가능성이 있습니다. 비슷하게 결제 앱에서 잘못된 금액을 표시하는 것이 표시하지 않는 것보다 나쁩니다.

이 변경사항은 React 16으로 마이그레이션할 때 어플리케이션에 존재하지만 이전에 알려지지않은 충돌을 발견할 수 있음을 의미합니다. 에러 경계를 추가하면 문제가 발생할 때 더 나은 사용자 환경을 제공할 수 있습니다.

예를 들어 페이스북 메신저는 사이드바의 콘텐츠, 정보 패널, 대화 기록, 그리고 메시지 입력을 구분된 에러 경계로 감싸두었습니다. 만약 이러한 UI 영역 중 하나라도 충돌하는 경우 나머지는 대화형으로 유지됩니다.

또한 프로덕션 환경에서 처리되지 않은 예외에 대해 알아볼 수 있도록 JS 에러 리포팅 시스템을 사용하거나 직접 빌드하고, 고치는 것이 좋습니다.

## 컴포넌트 스택 추적

React 16은 개발 모드에서 렌더링 중에 발생한 모든 에러를, 어플리케이션이 실수로 삼킨 경우에라도 콘솔에 출력합니다. 에러 메시지와 자바스크립트 스택에 더불어, 컴포넌트 스택 추적을 제공합니다. 이제 컴포넌트 트리의 정확히 어디에서 에러가 발생했는 지 확인할 수 있습니다.

<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Error caught by Error Boundary component">

또한 컴포넌트 스택 추적 내에서 파일명과 몇번 라인인 지 확인할 수 있습니다. 이는 [Create React App](https://github.com/facebookincubator/create-react-app) 프로젝트에서 기본적으로 동작합니다.

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Error caught by Error Boundary component with line numbers">

만약 Create React App을 사용하지 않는다면 Babel 설정에 수동으로 [이 플러그인](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source)을 추가할 수 있습니다. 이 기능은 개발 모드를 위해 구현하였으며 **프로덕션 모드에서는 반드시 비활성화 하여야** 합니다.

> Note
> 
> Component names displayed in the stack traces depend on the [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) property. If you support older browsers and devices which may not yet provide this natively (e.g. IE 11), consider including a `Function.name` polyfill in your bundled application, such as [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternatively, you may explicitly set the [`displayName`](/docs/react-component.html#displayname) property on all your components.


## try/catch는 어떤가요?

`try` / `catch` 는 훌륭하지만 명령형 코드에서만 동작합니다.

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

하지만 React 컴포넌트는 선언형이며 *어떤 것을* 렌더링해야한다고 정의합니다.

```js
<Button />
```

에러 경계는 React의 선언적 특성을 보존하고 예상대로 동작합니다. 예를 들어 `componentDidUpdate` 훅 내의 오류가 어딘가 깊은 트리 내의 `setState` 로 인해 발생하더라도 가장 가까운 에러 경계로 올바르게 전달됩니다.

## 이벤트 핸들러는 어떤가요?

에러 경계는 이벤트 핸들러 내의 오류를 잡지 **않습니다.**

React는 에러 핸들러 내의 에러를 해결하기 위해 에러 경계를 필요로하지 않습니다. 렌더 메서드나 라이프사이클 훅과 달리 이벤트 핸들러는 렌더링 시 발생하지 않습니다. 만약 이벤트 핸들러에서 에러를 던지더라도 React는 스크린에 어떤 걸 표시해야할 지 알고있습니다.

만약 이벤트 핸들러 내의 오류를 잡아야한다면 일반 자바스크립트 `try` / `catch` 문을 사용하세요.

```js{8-12,16-19}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  
  handleClick = () => {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

위 예제는 일반적인 자바스크립트 동작을 보여주며 에러 경계를 사용하지 않습니다.

## React 15에서 이름 변경

React 15에서는 다른 이름인 `unstable_handleError` 메서드를 통해 제한적으로 에러 경계 지원을 했습니다. 이 메서드는 더 이상 동작하지않으며 첫번째 16 베타 릴리즈부터 코드에서 `componentDidCatch` 로 변경해야합니다.

이 변경은 [codemod](https://github.com/reactjs/react-codemod#error-boundaries) 를 사용하여 자동으로 코드를 마이그레이션할 수 있습니다.