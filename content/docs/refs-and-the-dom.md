---
id: refs-and-the-dom
title: Ref와 DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

Ref는 render 메소드에서 생성된 DOM 노드 혹은 React 엘리먼트 객체에 접근할 수 있는 방법을 제공합니다.

전형적인 React 데이터 흐름에서는, 부모 컴포넌트에서 자식 엘리먼트를 조작하기 위해 [props](/docs/components-and-props.html)만을 사용합니다. 즉, 자식 엘리먼트를 수정하기 위해 새 prop을 가지고 다시 렌더링을 해줍니다. 하지만 가끔은 전형적인 데이터 흐름 밖에서 자식을 명령형으로 변경해야 할 필요가 있습니다. 여기서 변경될 자식이란 React 컴포넌트의 인스턴스일 수도 있고, DOM 엘리먼트일 수도 있습니다. React는 양쪽 경우 모두를 위한 비상구를 제공합니다.

### 언제 ref를 사용해야 하나요?

Ref의 바람직한 사용 사례로 다음과 같은 것을 들 수 있습니다:

* 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때
* 명령형 애니메이션을 발동시킬 때
* 서드파티 DOM 라이브러리를 통합할 때

선언적으로 할 수 있는 작업에 대해서는 ref의 사용을 피하세요.

예를 들어, `Dialog` 컴포넌트에 `open()`과 `close()`라는 메소드를 두는 대신 `isOpen`과 같은 prop을 넘겨주세요.

### Ref의 남용은 금물입니다

여러분의 앱에 "어떤 일이 일어나게"하기 위해 ref를 사용하는 쪽으로 마음이 기울 수 있습니다. 이 때에는, 잠시 작업을 멈추고 앱의 상태를 컴포넌트 계층의 어떤 부분에서 소유해야 하는지를 다시 한 번 생각해보세요. 많은 경우, 상태를 "소유"해야 할 적절한 장소는 계층의 상위에 있는 컴포넌트라는 결론이 날 것입니다. 이에 대한 예제를 [상태 끌어올리기](/docs/lifting-state-up.html) 가이드에서 확인하세요.

> 주의
>
> 아래 예제에서는 React 16.3 버전에서 도입된 `React.createRef()`를 사용하고 있습니다. 이전 버전의 React를 사용중이라면, 대신 [callback refs](#callback-refs)를 사용하세요.

### Ref 생성하기

Ref는 `React.createRef()`를 통해 생성한 뒤 React 엘리먼트의 `ref` 어트리뷰트에 붙여줄 수 있습니다. Ref는 대개 컴포넌트의 인스턴스가 만들어질 때 인스턴스의 속성에 저장해주며, 이를 통해 컴포넌트 내부 코드에서 자유롭게 사용될 수 있습니다.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Ref 사용하기

`render` 메소드에서 반환하는 엘리먼트에 ref가 넘겨지면, ref의 `current` 속성을 통해 해당 노드에 접근할 수 있게 됩니다.

```javascript
const node = this.myRef.current;
```

ref의 값은 노드의 유형에 따라 달라집니다:

- HTML 엘리먼트에 `ref` 어트리뷰트가 사용되면, ref의 `current` 속성은 DOM 엘리먼트 객체를 가리킵니다.
- 클래스 컴포넌트에 `ref` 어트리뷰트가 사용되면, ref의 `current` 속성은 해당 컴포넌트로부터 생성된 인스턴스를 가리킵니다.
- **함수형 컴포넌트는 인스턴스를 가질 수 없기 때문에 `ref` 어트리뷰트 역시 사용할 수 없습니다.**

아래 예제를 통해 차이점을 확인해보세요.

#### DOM 엘리먼트에 ref 사용하기

아래 코드에서는 DOM 노드를 참조하기 위해 `ref`를 사용하고 있습니다:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // input DOM 엘리먼트에 접근하기 위해 ref를 만들었습니다.
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // DOM API를 사용해서 명시적으로 input에 포커스를 두는 코드입니다.
    // 주의: "current" 속성을 사용해 DOM 노드에 접근하고 있습니다.
    this.textInput.current.focus();
  }

  render() {
    // <input> ref와 `textInput`이 연결되어 있다는 사실을
    // React한테 알려줍니다.
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

Reaect는 컴포넌트가 마운트되면 `textInput`의 `current` 속성에 DOM 엘리먼트 객체를 할당하며, 언마운트가 되었을 때 다시 `null`로 되돌릴 것입니다. `ref`의 갱신은 `componentDidMount`와 `componentDidUpdate` 라이프사이클 훅 직전에 일어납니다.

#### 클래스 컴포넌트에 ref 사용하기

아래 코드에서는 `CustomTextInput`을 감싼 새 컴포넌트를 만들어서 마운트 되자마자 포커스가 이동하도록 했습니다. 여기서는 `CustomTextInput` 인스턴스에 접근하기 위해 ref를 사용했고 `focusTextInput`을 직접 호출해 주었습니다:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

주의할 점은, `CustomTextInput`가 클래스로 선언되었을 때만 이 코드가 동작한다는 점입니다:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### Ref와 함수형 컴포넌트

**함수형 컴포넌트는 인스턴스를 가질 수 없기 때문에 `ref` 어트리뷰트 역시 사용할 수 없습니다:**

```javascript{1,8,13}
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // 이 코드는 동작하지 않습니다!
    return (
      <MyFunctionalComponent ref={this.textInput} />
    );
  }
}
```

Ref를 사용하기 위해서는 컴포넌트를 클래스로 바꾸어주어야 합니다. 라이프사이클 메소드나 state를 사용해야 할 때처럼 말이죠.

다만, DOM 엘리먼트가 클래스 컴포넌트의 인스턴스에 접근하기 위해 **함수형 컴포넌트 안에서 `ref` 어트리뷰트를 사용하는 것**은 얼마든지 가능합니다:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput은 반드시 여기에서 선언되어야 합니다.
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Exposing DOM Refs to Parent Components

In rare cases, you might want to have access to a child's DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

While you could [add a ref to the child component](#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn't work with functional components.

If you use React 16.3 or higher, we recommend to use [ref forwarding](/docs/forwarding-refs.html) for these cases. **Ref forwarding lets components opt into exposing any child component's ref as their own**. You can find a detailed example of how to expose a child's DOM node to a parent component [in the ref forwarding documentation](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

If you use React 16.2 or lower, or if you need more flexibility than provided by ref forwarding, you can use [this alternative approach](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) and explicitly pass a ref as a differently named prop.

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [`findDOMNode()`](/docs/react-dom.html#finddomnode), but it is discouraged.

### Callback Refs

React also supports another way to set refs called "callback refs", which gives more fine-grain control over when refs are set and unset.

Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere. 

The example below implements a common pattern: using the `ref` callback to store a reference to a DOM node in an instance property.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. `ref` callbacks are invoked before `componentDidMount` or `componentDidUpdate` lifecycle hooks.

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Legacy API: String Refs

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**. 

> Note
>
> If you're currently using `this.refs.textInput` to access refs, we recommend using either the [callback pattern](#callback-refs) or the [`createRef` API](#creating-refs) instead.

### Caveats with callback refs

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn't matter in most cases.