---
id: rendering-elements
title: 요소 렌더링
permalink: docs/rendering-elements.html
redirect_from: "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

요소는 React 앱에서 가장 작은 단위의 재료입니다.

요소는 화면에 표시하고자 하는 내용을 서술합니다.

```js
const element = <h1>Hello, world</h1>;
```

브라우저 DOM 요소와 달리, React 요소는 순수한 객체이며 생성 비용이 저렴합니다.
React DOM 라이브러리는 DOM 갱신 작업을 관장하며, React 요소와 DOM이 일치하도록 만듭니다.

>**Note:**
>
> 요소를 "컴포넌트"라는 더 널리 알려진 개념과 혼동할 수 있습니다. [다음 섹션](/docs/components-and-props.html)에서 컴포넌트에 대해 소개합니다. 요소는 컴포넌트를 만들어내는 구성 성분이라 할 수 있으므로, 다음으로 넘어가기 전에 이 섹션을 읽는 것을 추천합니다.

## DOM에서 요소 렌더링하기

HTML 파일 어딘가에 `<div>` 가 있다고 가정해봅시다.

```html
<div id="root"></div>
```

React DOM에 의해 관리되는 모든 것이 이 요소 안에 들어가므로, 이걸 "루트" DOM 노드라고 부릅니다.

React로 구축한 어플리케이션은 보통 하나의 루트 DOM 노드를 가집니다. React를 기존 앱에 통합하는 경우, 원하는 만큼의 여러 루트 DOM 노드를 만들 수도 있습니다.

React 요소를 루트 DOM 노드에 렌더링하고 싶다면, `ReactDOM.render()` 에 둘 다 넘겨주면 됩니다.

```js
const element = <h1>Hello, world</h1>;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[Try it on CodePen.](http://codepen.io/gaearon/pen/rrpgNB?editors=1010)

이 코드는 "Hello, World" 를 화면에 보여줄 것입니다.

## 렌더링된 요소 업데이트

React 요소는 [변경 불가능](https://en.wikipedia.org/wiki/Immutable_object) 합니다. 한번 요소를 만들었다면, 그 자식이나 어트리뷰트를 변경할 수 없습니다. 요소는 영화의 단일 프레임에 비유할 수 있습니다. 즉, 요소는 특정 시점의 UI를 표현할 뿐입니다.

이제까지 배운 것만 가지고 UI를 갱신할 수 있는 유일한 방법은 새로운 요소를 만들어서 이 요소를 `ReactDOM.render()` 로 전달하는 것입니다.

깜빡이는 시계를 구현한 예제를 살펴봅시다.

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

이 예제는 [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) 콜백을 이용해 매 초마다 `ReactDOM.render()` 를 호출하고 있습니다.

>**Note:**
>
> 실무에서, 대부분의 React 어플리케이션은 `ReactDOM.render()` 를 한 번만 호출합니다. 다음 섹션에서는 이러한 코드가 어떻게 [상태를 갖는 컴포넌트](/docs/state-and-lifecycle.html) 로 캡슐화 되는 지 배울 것입니다.
>
> 서로가 서로를 기반으로 만들어져 있기 때문에, 이 주제를 건너뛰지 않는 걸 권장합니다.

## React는 꼭 필요한 부분만 갱신합니다

React DOM은 요소 및 그 자식을 이전 버전과 비교하고, DOM을 원하는 상태로 만드는 데 필요한 DOM 업데이트만 적용합니다.

[마지막 예제](http://codepen.io/gaearon/pen/gwoJZk?editors=0010) 를 개발자 도구로 관찰해보면 알 수 있습니다.

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

매 깜빡임마다 전체 UI 트리를 서술하는 요소를 만들었지만, 내용이 변경된 텍스트 노드만이 React DOM에 의해서 업데이트 됩니다.

우리의 경험상, '시간 경과에 따라 UI를 어떻게 변경할지'를 생각하는 것이 아니라 '특정 순간에 UI가 어떻게 보여져야 할지'에 대해 생각하면, 수많은 종류의 버그를 없앨 수 있습니다.
