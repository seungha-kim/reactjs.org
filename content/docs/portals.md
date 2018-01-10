---
id: portals
title: Portals
permalink: docs/portals.html
---

Portals는 부모 컴포넌트의 DOM 계층 외부에 존재하는 DOM 노드로 자식에 렌더링하는 일급 방법을 제공합니다.

```js
ReactDOM.createPortal(child, container)
```

첫번째 인수 (`child`)는 요소, 문자열, fragment 같은 [renderable React child](/docs/react-component.html#render)입니다. 두번째 인수 (`container`)는 DOM 요소입니다.

## 사용예시

보통 컴포넌트의 render 메서드에서 요소를 반환할 때, 근처 부모 노드의 자식으로써 DOM이 마운트됩니다.

```js{4,6}
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

그러나 때로 DOM 내의 다른 위치에 자식을 넣는 것이 유용합니다.

```js{6}
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode,
  );
}
```

portals의 일반적인 사용 사례는 부모 컴포넌트가 `overflow: hidden` 이나 `z-index` 스타일을 가지지만, 자식이 컨테이너에서 시각적으로 "이탈해야 하는" 경우입니다. 예를 들어, 다이얼로그나, 호버카드나, 툴팁같은 게 있습니다.

> Note:
>
> portals를 사용할 때 꼭 접근성 가이드라인을 확실히 준수해야합니다.

[Try it on CodePen.](https://codepen.io/gaearon/pen/yzMaBd)

## Portals를 통한 이벤트 버블링

portal은 DOM 트리의 어디에나 존재할 수 있지만, 다른 모든 방법으로 일반 React 자식처럼 동작합니다. context 같은 기능은 *DOM 트리* 의 위치에 상관없이 portal이 여전히 *React 트리* 내에 존재하기때문에 portal 여부에 상관없이 동일하게 동작합니다.

이는 이벤트 버블링을 포함합니다. portal 내부에서 시작된 이벤트는 *DOM 트리* 에서 조상이 아니더라도 *React 트리* 에 있는 조상에 전달됩니다. 다음 HTML 구조를 가정해봅시다.

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`#app-root` 내의 `Parent` 컴포넌트는 잡히지 않은, 형제 노드 `#modal-root` 에서 버블링되는 이벤트를 잡을 수 있습니다.

```js{28-31,42-49,53,61-63,70-71,74}
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(prevState => ({
      clicks: prevState.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jGBWpE)

상위 컴포넌트의 portal에서 이벤트 버블링을 캐치하면 portal에 본질적으로 의존하지않는 보다 유연한 추상화 개발을 할 수 있습니다. 예를 들어 `<Modal />` 컴포넌트를 렌더링하면 상위에서 portals를 사용하여 구현하였는 지 여부에 관계없이 이벤트를 캡쳐할 수 있습니다.