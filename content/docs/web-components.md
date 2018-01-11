---
id: web-components
title: 웹 컴포넌트
permalink: docs/web-components.html
redirect_from: "docs/webcomponents.html"
---

React와 [웹 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/Web_Components)는 다른 문제를 해결하기 위해 만들어졌습니다. React가 데이터를 DOM과 동기화하는 선언형 라이브러리를 제공할 때 웹 컴포넌트는 재사용가능한 컴포넌트를 위한 강력한 캡슐화를 제공합니다. 두 목표는 상호보완적입니다. 개발자는 웹 컴포넌트에서 React를 사용하거나, React에서 웹 컴포넌트를 사용하거나, 둘 다 자유롭게 사용할 수 있습니다.

React를 사용하는 대부분의 사람은 웹 컴포넌트를 사용하지 않지만 만약 원한다면 웹 컴포넌트를 사용해 작성한 타사 UI 컴포넌트를 사용하고싶을 수 있습니다.

## React에서 웹 컴포넌트 사용하기

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Note:
>
> 웹 컴포넌트는 종종 명령형 API를 노출합니다. 예를 들어, `video` 웹 컴포넌트는 `play()` 나 `pause()` 함수를 노출할 수 있습니다. 웹 컴포넌트의 명령형 API에 접근하기 위해서, ref를 사용하여 DOM 노드와 직접 상호작용해야할 것입니다. 타사 웹 컴포넌트를 사용할 때 최고의 방법은 웹 컴포넌트를 감싸는 React 컴포넌트를 작성하는 것입니다.
>
> 웹 컴포넌트가 내보낸 이벤트가 React 렌더 트리를 통해 제대로 전파되지 않을 수 있습니다..
> React 컴포넌트에서 이러한 이벤트를 제어하기위한 이벤트 핸들러를 수동으로 넣어야할 필요가 있습니다.

한가지 공통적인 혼란은 웹 컴포넌트가 "className" 대신 "class"를 사용한다는 점입니다.

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 웹 컴포넌트에서 React 사용하기

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>Note:
>
>이 코드는 Babel로 클래스를 변형하면 동작하지 **않습니다** 토론에 대해서는 [이 이슈](https://github.com/w3c/webcomponents/issues/587)를 살펴보세요.
> 이 이슈를 해결하려면 웹 컴포넌트 로딩 전에 [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs)를 포함해야합니다.
