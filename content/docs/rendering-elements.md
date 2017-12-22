---
id: rendering-elements
title: 요소 렌더링
permalink: docs/rendering-elements.html
redirect_from: "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

요소는 React 앱의 가장 작은 구성 블록입니다.

요소는 화면에 표시할 내용을 설명합니다.

```js
const element = <h1>Hello, world</h1>;
```

브라우저 DOM 요소와 달리 React 요소는 순수한 객체이며 생성 비용이 저렴합니다.
React DOM은 React 요소와 일치하도록 DOM을 업데이트합니다.

>**Note:**
>
> 요소를 "컴포넌트"라는 더 널리 알려진 개념과 혼동할 수 있습니다. [다음 섹션](/docs/components-and-props.html)에서 컴포넌트에 대해 소개합니다. 요소는 구성요소가 "무엇으로" 이루어졌는 지, 그리고 다음으로 넘어가기 전에 이 섹션을 읽는 게 좋습니다.

## DOM에서 요소 렌더링하기

HTML 파일 어딘가에 `<div>` 가 있다고 가정해봅시다.

```html
<div id="root"></div>
```

React DOM에 의해 관리되는 모든 것이 이 요소 안에 들어가므로 이걸 "루트" DOM 노드라고 부릅니다.

React로 구축한 어플리케이션은 보톤 단일 루트 DOM 노드를 가집니다. React를 기존 앱에 통합하는 경우 원하는 만큼 많은 분리된 루트 DOM 노드가 있을 수도 있습니다.

React 요소를 루트 DOM 노드에 렌더링하고 싶다면, `ReactDOM.render()` 에 둘 다 전달하면 됩니다.

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

React 요소는 [변경 불가능](https://en.wikipedia.org/wiki/Immutable_object) 합니다. 한번 요소를 만들었다면, 그 자식이나 속성을 변경할 수 없습니다. 요소는 영화의 단일 프레임과 같습니다. 특정한 시간대의 UI를 보여줄 뿐입니다.

이 지식을 바탕으로 하면, UI를 업데이트할 수 있는 유일한 방법은 새로운 요소를 만드는 것이며, 이 요소를 `ReactDOM.render()` 로 전달하는 것입니다.

시간이 깜빡이는 예제를 살펴봅시다.

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
> 실제로 대부분의 React 어플리케이션은 `ReactDOM.render()` 를 한번만 호출합니다. 다음 섹션에서는 이러한 코드가 어떻게 [상태 기반 컴포넌트](/docs/state-and-lifecycle.html) 로 캡슐화 되는 지 배울 것입니다.
>
> 서로가 서로에게 연관성이 있기 때문에 이 주제를 건너뛰지 않는 걸 권장합니다.

## React는 필요한 것만 업데이트한다.

React DOM은 요소와 그 자식을 이전 요소와 비교하고, DOM을 원하는 상태로 만드는 데 필요한 DOM 업데이트만 적용합니다.

[마지막 예제](http://codepen.io/gaearon/pen/gwoJZk?editors=0010) 를 개발자 도구로 확인해보면 관측할 수 있습니다.

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

매 틱마다 전체 UI 트리를 설명하는 요소를 만들었지만, 내용이 변경된 텍스트 노드만 React DOM에 의해서 업데이트 됩니다.

이 경험으로 견주어 보았을 때, 시간이 지남에 따라 UI를 변경하는 것이 아니라 주어진 순간을 UI가 어떻게 보여줘야하는 지에 대해 생각하면 버그 전체가 사라집니다.
