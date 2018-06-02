---
id: refs-and-the-dom
title: Refs와 DOM
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
permalink: docs/refs-and-the-dom.html
---

React의 전형적인 데이터 흐름 상에서는, [props](/docs/components-and-props.html)만이 자식 컴포넌트와 부모 컴포넌트 간에 상호작용을 할 수 있는 유일한 방법입니다. 자식의 내용을 변경하기 위해서, 새 prop을 가지고 다시 렌더링을 합니다. 하지만 가끔은 전형적인 데이터 흐름 밖에서 자식을 명령형으로 변경해야 할 필요가 있습니다. 여기서 변경될 자식이란 React 컴포넌트의 인스턴스일 수도 있고, DOM 엘리먼트일 수도 있습니다. React는 양쪽 경우 모두를 위한 비상구를 제공합니다.

### 언제 ref를 사용해야 합니까?

Ref의 바람직한 사용 사례로 다음과 같은 것을 들 수 있습니다.

* 포커스, 텍스트 선택영역, 혹은 미디어의 재생을 관리할 때
* 명령형 애니메이션을 발동시킬 때
* 서드파티 DOM 라이브러리를 통합할 때

선언적으로 할 수 있는 작업에 대해서는 ref의 사용을 피하세요.

예를 들어, `Dialog` 컴포넌트에 `open()`과 `close()`라는 메소드를 두는 대신 `isOpen`이라는 prop을 넘겨주세요.

### Ref의 남용은 금물입니다

여러분의 앱에 "어떤 일이 일어나게"하기 위해 ref를 사용하는 쪽으로 마음이 기울 수 있습니다. 이 때에는, 잠시 작업을 멈추고 앱의 상태를 컴포넌트 계층의 어떤 부분에서 소유해야 하는지를 다시 한 번 생각해보세요. 많은 경우, 상태를 "소유"해야 할 적절한 장소는 계층의 상위에 있는 컴포넌트라는 결론이 날 것입니다. 이에 대한 예제를 [State 끌어올리기](/docs/lifting-state-up.html) 가이드에서 확인하세요.

### DOM 엘리먼트에 ref 추가하기

React는 어떤 컴포넌트에든 사용할 수 있는 특별한 속성을 지원합니다. `ref` 속성은 콜백 함수를 받으며, 그 콜백 함수는 컴포넌트가 마운트 혹은 언마운트 되자마자 실행될 것입니다.

`ref` 속성이 HTML 엘리먼트에 사용되면, `ref` 콜백은 하부의 DOM 엘리먼트를 인자로 받습니다. 예를 들어, 아래의 코드는 `ref` 콜백을 사용해 DOM 노드에 대한 참조를 저장하고 있습니다:

```javascript{8,9,19}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    this.textInput.focus();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />
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

React는 컴포넌트가 마운트될 때는 DOM 엘리먼트를 가지고 `ref` 콜백을 호출하고, 언마운트될 때는 `null`을 가지고 호출할 것입니다. `ref` 콜백은 `componentDidMount` 나 `componentDidUpdate` 라이프사이클 훅 전에 호출됩니다.

단순히 클래스의 속성을 지정하는 `ref` 콜백을 사용하는 것은 DOM 엘리먼트에 접근하기 위해 흔히 사용되는 패턴입니다. 위 예제처럼 `ref` 콜백에서 속성을 지정하는 것이 React에서 선호되는 방식입니다. 심지어 이것을 더 짧게 쓸 수 있습니다: `ref={input => this.textInput = input}`.

### 클래스 컴포넌트에 ref 추가하기

클래스의 형태로 선언된 자체 제작 컴포넌트에 `ref`가 사용됐을 때는, 마운트된 컴포넌트 인스턴스가 `ref` 콜백의 인수로 넘겨집니다. 예를 들어, 위에서 봤던 `CustomTextInput`를 감싸서 마운트된 직후에 마치 클릭이 된 것처럼 동작시키려면 다음과 같이 하면 됩니다:

```javascript{3,9}
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    this.textInput.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

`CustomTextInput`가 클래스의 형태로 선언되었을 때에만 이와 같이 동작한다는 사실을 기억하세요:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

### 함수형 컴포넌트와 ref

**함수형 컴포넌트에 대해서는 `ref` 속성을 사용할 수가 없는데** 이는 함수형 컴포넌트가 인스턴스를 갖지 않기 때문입니다.

```javascript{1,7}
function MyFunctionalComponent() {
  return <input />;
}

class Parent extends React.Component {
  render() {
    // This will *not* work!
    return (
      <MyFunctionalComponent
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```

만약 ref를 사용하실 원한다면 컴포넌트를 클래스로 바꾸어주어야 합니다. 라이프사이클 메소드나 state를 사용하려고 할 때처럼 말이죠.

다만, DOM 엘리먼트나 클래스 컴포넌트를 참조하는 한 **함수형 컴포넌트의 내부에서 `ref`를 사용하는 것은 가능합니다.**

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput must be declared here so the ref callback can refer to it
  let textInput = null;

  function handleClick() {
    textInput.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={(input) => { textInput = input; }} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );  
}
```

### 부모 컴포넌트에 DOM ref 노출하기

드문 경우지만, 부모 컴포넌트에서 자식의 DOM 노드에 접근하고 싶은 경우도 있습니다. 이는 일반적으로 권장되지 않는데, 왜냐하면 이 방식은 컴포넌트 캡슐화를 망치기 때문입니다. 하지만 자식 DOM 노드에 포커스를 옮기거나 크기 혹은 위치를 측정하는 등이 작업을 하는 데 있어서는 위 방식이 유용할 수 있습니다.

[자식 컴포넌트에 ref를 추가](#adding-a-ref-to-a-class-component)할 수도 있지만, DOM 노드 대신에 컴포넌트 인스턴스를 받게 되므로 이상적인 방법은 아닙니다. 또한, 이 방법은 함수형 컴포넌트에 대해서는 동작하지 않을 것입니다.

그 대신 자식에 대해 특별한 prop을 사용하는 것을 권장합니다. 자식은 함수 prop을 받을 수 있고, 그 이름은 어떤 것이든 될 수 있습니다. (예를 들면 `inputRef`) 이 함수를 DOM 노드의 `ref` 속성으로 붙이세요. 이 방식을 통해 부모의 ref 콜백을 중간에 있는 컴포넌트를 거쳐 자식의 DOM node에 넘겨줄 수 있습니다.

이 방법은 클래스 컴포넌트나 함수형 컴포넌트를 가리지 않고 잘 동작합니다.

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

위 예제에서, `Parent`는 ref 콜백을 `inputRef` prop을 통해 `CustomTextInput`에 넘겨주고, `CustomTextInput`는 이 콜백을 `<input>`의 `ref` 속성으로 넘겨주고 있습니다. 결과적으로, `Parent`의 `this.inputElement`에는 `CustomTextInput` 안에 있는 `<input>` 엘리먼트를 가리키는 DOM 노드가 저장되게 됩니다.

위 예제의 `inputRef` prop의 이름은 특별한 의미를 갖지 않으며, 그저 일반적인 컴포넌트 prop에 지나지 않는다는 사실에 주의하세요. 다만, `<input>`에 사용된 `ref`은 중요하며, 이것은 React에게 ref 콜백을 DOM 노드에 붙여야 한다는 사실을 알려주는 역할을 합니다.

이 방법은 `CustomTextInput`가 함수형 컴포넌트인 경우에도 잘 동작합니다. `ref`라는 특별한 속성이 [오로지 DOM 엘리먼트와 클래스 컴포넌트에만 지정될 수 있는 것](#refs-and-functional-components)과는 다르게, `inputRef`와 같은 일반적인 prop에 대해서는 그런 제약이 없습니다.

이 패턴의 또다른 장점은 여러 컴포넌트가 겹쳐져 있을 때도 문제가 없다는 것입니다. 예를 들어, `Parent`라는 컴포넌트는 DOM 노드를 필요로 하지 않지만, `Parent`를 렌더링 한 컴포넌트(이를테면 `Grandparent`)는 그 노드를 필요로 한다고 가정해봅시다. 이 경우 우리는 `Grandparent`에서 `Parent`에 `inputRef` prop을 지정하고, 또 이를 `Parent`에서 `CustomTextInput`로 전달해줄 수 있습니다:

```javascript{4,12,22}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}


class Grandparent extends React.Component {
  render() {
    return (
      <Parent
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

위를 보시면, ref 콜백은 맨 처음에 `Grandparent`에 의해 만들어졌습니다. 그 뒤에 `inputRef`라는 일반적인 prop으로서 `Parent`에 전달되었고, `Parent`는 이것을 다시 `CustomTextInput`에 전달해주었습니다. 마지막으로, `CustomTextInput`는 `inputRef` prop에 들어있는 함수를 읽어와서 `<input>`의 `ref` 속성에 붙여주었습니다. 그 결과로, `Grandparent`의 `this.inputElement`에는 `CustomTextInput` 안에 있는 `<input>`를 가리키는 DOM 노드가 저장되게 되었습니다.

거의 모든 경우에 우리는 DOM 노드를 노출시키지 않는 것을 권장하지만, 이것이 유용한 비상구의 역할을 해 줄 때도 있습니다. 이 방법을 사용하기 위해서는 여러분이 자식 컴포넌트에 코드를 추가해야 합니다. 자식 컴포넌트의 구현체를 전혀 다룰 수 없는 상황에 쓸 수 있는 최후의 수단으로 [`findDOMNode()`](/docs/react-dom.html#finddomnode)이 있긴 하지만, 이는 권장되지 않습니다.

### 구식 API: 문자열 ref

이전에 React를 사용해 본 적이 있다면, 아마 `ref` 속성으로 `"textInput"`와 같은 문자열을 사용하는 예전 API를 본 적이 있으실 겁니다. 이 때에 `this.refs.textInput`를 통해 DOM 노드에 접근할 수 있습니다. 우리는 이 방법을 사용하지 않는 것을 권장하는데 문자열 ref가 [몇 가지 문제점](https://github.com/facebook/react/pull/8333#issuecomment-271648615)을 가지고 있기 때문입니다. 그래서 이 방법은 구식으로 취급되며, **추후 릴리즈되는 버전에서 삭제될 예정입니다.** 현재 ref를 다루기 위해 `this.refs.textInput`와 같은 방법을 사용하고 계시다면, 콜백 패턴을 대신 사용하는 것을 추천드립니다.

### 주의 사항

만약 `ref` 콜백이 인라인 함수의 형태로 정의되었다면, 컴포넌트 갱신 시 이 함수가 두 번 호출되는데, 첫 번째로 `null` 인자로 호출이 되고 그 다음 DOM 엘리먼트 인자로 다시 호출이 될 것입니다. 이는 렌더링이 될 때마다 인라인 함수가 다시 생성되기 때문입니다. 따라서 React로서는 이전 렌더링 시의 ref를 없애고 새 ref를 지정해 주어야 합니다. 이를 피하기 위해서는 클래스에 엮인 메소드를 `ref` 콜백으로 사용하면 됩니다. 하지만 대개의 경우 이것이 큰 문제가 되지는 않습니다.
