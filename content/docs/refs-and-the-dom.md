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

일반적인 React 데이터플로우에서 [props](/docs/components-and-props.html)는 부모 컴포넌트와 자식이 상호작용할 수 있는 유일한 수단입니다. 자식을 수정하려면 새로운 props와 함께 다시 렌더해야합니다. 그러나 가끔은 전형적인 데이터플로우 밖에서 자식을 부득이하게 수정해야할 필요가 있습니다. 여기서 변경될 자식이란 React 컴포넌트의 인스턴스일 수도 있고, DOM 요소일 수도 있습니다. React는 양쪽 모두를 위한 비상구를 제공합니다.

### 언제 Refs를 사용하는가

refs를 사용하기 좋은 일부 케이스가 있습니다.

* 포커스 제어, 텍스트 선택, 미디어 재생을 관리할 때
* 명령형 애니메이션을 발동시킬 때
* 써드 파티 DOM 라이브러리를 통합할 때

선언적으로 할 수 있는 작업에는 refs 사용을 피하길 바랍니다.

예를 들어, `Dialog` 컴포넌트에서 `open()` 과 `close()` 메서드를 두는 대신  `isOpen` prop을 전달할 수 있습니다.

### Refs를 과하게 쓰지마세요

앱에 "어떤 일이 일어나게" 하기 위해 refs를 사용하고 싶을 수 있습니다. 이 경우 컴포넌트 계층에서 state를 두어야하는 위치에 대해 더 비판적으로 생각하길 바랍니다. 종종 그 state를 "소유"하는 적절한 위치가 계층 구조에서 더 높은 레벨에 있음이 분명해집니다. 이 부분에 대한 예제는 [State 끌어올리기](/docs/lifting-state-up.html) 가이드를 보길 바랍니다.

### DOM 요소에 Ref 추가하기

React는 모든 컴포넌트에 첨부할 수 있는 특별한 속성을 지원합니다. `ref` 속성은 콜백 함수를 받고 컴포넌트가 마운트되거나 언마운트 된 이후에 즉시 실행됩니다.

`ref` 속성을 HTML 요소에서 사용하면, `ref` 콜백은 기본 DOM 요소를 인수로 받습니다. 예를 들어 이 코드에서 사용한 `ref` 콜백은 DOM 노드에 대한 참조를 저장합니다.

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

React는 컴포넌트가 마운트될 때 DOM 요소와 함께 `ref` 콜백을 호출하며 언마운트될 때 `null` 과 함께 호출합니다. `ref` 콜백은 `componentDidMount` 나 `componentDidUpdate` 라이프사이클 훅 전에 호출됩니다.

`ref` 콜백을 클래스에서 속성을 지정하기 위해 사용하는 건 DOM 요소에 접근하기 위한 일반적인 패턴입니다. 위 예제처럼 `ref` 콜백에서 속성을 지정하는 것이 선호되는 방식입니다. 심지어 `ref={input => this.textInput = input}` 처럼 더 짧게 쓸 수도 있습니다. 

### 클래스 컴포넌트에 Ref 추가하기

클래스로 선언된 커스텀 컴포넌트에서 `ref` 속성을 사용할 때 마운트된 컴포넌트의 인스턴스가 `ref` 콜백의 인수로 넘겨집니다. 예를 들어 위의 `CustomTextInput` 를 감싸서 마운트된 직후에 클릭된 것처럼 동작시키려면 다음과 같이 하면됩니다.

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

`CustomTextInput` 이 클래스로 선언된 경우에만 동작한다는 사실을 알아두시길 바랍니다.

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

### Refs와 함수형 컴포넌트

함수형 컴포넌트가 인스턴스를 가지지 않기 때문에 **함수형 컴포넌트에서 `ref` 속성을 사용할 수 없습니다.**

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

라이프사이클 메서드나 state가 필요할 때 했던 것처럼 ref를 사용해야한다면 컴포넌트를 클래스로 변환해야합니다.

그러나 DOM 요소 혹은 클래스 컴포넌트를 참조하는 한 **함수형 컴포넌트 내부에서 `ref` 속성을 사용할 수 있습니다.**

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

### 부모 컴포넌트에 DOM Refs 노출하기

드문 경우지만 부모 컴포넌트에서 자식의 DOM 노드에 접근해야할 때가 있습니다. 캡슐화를 깨는 방식이기 때문에 추천하지 않지만 포커스를 발동시키거나 자식 DOM 노드의 포지션이나 사이즈를 계산할 때 유용하게 쓰이기도 합니다.

[자식 컴포넌트에 ref를 추가](#adding-a-ref-to-a-class-component)할 수도 있지만 DOM 노드 대신에 컴포넌트 인스턴스를 받으므로 이상적인 솔루션은 아닙니다. 추가로 함수형 컴포넌트에서는 동작하지 않습니다.

대신 자식에 대한 특수한 prop을 사용하는 것을 권장합니다. 자식은 함수 prop을 받을 수 있고 그 이름은 어떤 것(`inputRef` 같은 이름)이든 될 수 있으며 이 함수를 DOM 노드의 `ref` 속성으로 붙이십시오. 이를 통해 부모는 중간에 있는 컴포넌트를 통해 자식의 DOM 노드에 대한 참조 콜백을 전달할 수 있습니다.

이는 클래스 및 함수형 컴포넌트에서 동작합니다.

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

위 예제에서 `Parent` 는 `CustomTextInput` 의 `inputRef` prop으로 콜백 ref를 전달하고, `CustomTextInput` 는 `<input>` 에 특수한 `ref` 속성으로써 같은 함수를 전달합니다. 그 결과로 `Parent` 의 `this.inputElement` 는 `CustomTextInput` 의 `<input>` 요소에 해당하는 DOM 노드로 설정됩니다.

위 예제에서 `inputRef` prop 이름은 일반적인 컴포넌트의 prop이며 특별한 의미가 없습니다. 그러나 `<input>` 의 `ref` 속성을 사용하는 건 그 자체로 중요하며, 이는 React가 DOM 노드에 ref를 추가했음을 의미합니다.

이 방법은 `CustomTextInput` 가 함수형 컴포넌트인 경우에도 잘 동작합니다. `ref` 라는 특별한 속성이 [클래스 컴포넌트와 DOM 요소에만 지정될 수 있다는 것](#refs-and-functional-components) 과는 다르게 `inputRef` 같은 일반적인 컴포넌트 props에는 그런 제약이 없습니다.

이 패턴의 다른 장점은 여러 컴포넌트가 깊게 겹쳐있을 때도 문제가 없다는 점입니다. 예를 들어 `Parent` 에 DOM 노드가 필요없지만 `Parent` 를 렌더링한 컴포넌트 (이를테면 `Grandparent` 같은 것)는 그 노드를 필요로 한다고 가정해봅시다. 이 경우 `Grandparent` 는 `Parent` 를 `inputRef` prop에 지정하고, `Parent` 에서 `CustomTextInput` 로 "전달"해줄 수 있습니다.

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

여기에서 ref 콜백은 `Grandparent` 에 의해 먼저 정의됩니다. `inputRef` 라는 일반적인 prop으로써 `Parent` 에 전달되었고, `Parent` 는 이것을 다시 `CustomTextInput` 에 prop으로 전달해주었습니다. 마지막으로 `CustomTextInput` 는 `inputRef` prop을 읽어들이고 `<input>` 의 `ref` 속성에 전달받은 함수를 붙여주었습니다. 그 결과로 `Grandparent` 의 `this.inputElement` 에는 `CustomTextInput` 안에 있는 `<input>` 요소를 가리키는 DOM 노드가 설정됩니다.

거의 모든 경우에 가능하다면 DOM 노드를 노출시키는 것을 권장하지 않지만 이것이 유용한 비상구 역할을 해줄 때도 있습니다. 이 방법을 사용하기 위해서는 자식 컴포넌트에 코드를 추가해야합니다. 자식 컴포넌트의 구현체를 전혀 다룰 수 없는 상황에 쓸 수 있는 최후의 옵션으로 [`findDOMNode()`](/docs/react-dom.html#finddomnode)가 있지만 권장하지 않습니다.

### 레거시 API : 문자열 Ref

만약 React를 이전에도 사용한 적이 있다면 `"textInput"` 같은 문자열을 `ref` 속성으로 사용하는 예전 API를 본 적이 있을 것입니다. 그리고 이 때 `this.refs.textInput` 을 통해 DOM 노드에 접근할 수 있습니다. 문자열 refs가 [몇가지 이슈](https://github.com/facebook/react/pull/8333#issuecomment-271648615)를 가지고있기 때문에 이 방법을 사용하지 않는 걸 권장하며, 이는 레거시로 고려되고 있고 **추후 릴리즈되는 버전에서는 삭제할 예정입니다**. 현재 refs에 접속하기 위해 `this.refs.textInput` 를 사용하고 있다면 대신 콜백 패턴을 사용하는 걸 권장합니다.

### 주의 사항

`ref` 콜백이 인라인 함수로 정의되면 업데이트 중 두번 호출됩니다. 처음에는 `null` 으로, 그리고 나서 DOM 요소로 다시 호출됩니다. 이는 렌더링이 될 때마다 인라인 함수가 다시 생성되기 때문이며, React로서는 이전 렌더링 시의 ref를 없애고 새 ref를 지정해주어야합니다. 이를 피하기 위해서는 클래스에 엮인 메서드를 `ref` 콜백으로 정의하면 됩니다. 대부분의 경우 이는 문제가 되지 않습니다.
