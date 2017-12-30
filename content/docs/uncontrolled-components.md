---
id: uncontrolled-components
title: 제어되지않는 컴포넌트
permalink: docs/uncontrolled-components.html
---

대부분의 경우 폼을 구성하기 위해 [제어되는 컴포넌트](/docs/forms.html)를 사용하는 걸 권장합니다. 제어되는 컴포넌트에서 폼 데이터는 React 컴포넌트에 의해 처리됩니다. 대안으로 제어되지않는 컴포넌트가 있는데, 폼 데이터는 DOM 자체에서 처리됩니다.

제어되지않는 컴포넌트를 작성하면 각 state 업데이트를 위해 이벤트 핸들러를 작성하는 대신 DOM으로부터 폼의 값을 얻기 위해 [ref를 사용](/docs/refs-and-the-dom.html)할 수 있습니다.

예를 들어 이 코드는 제어되지않는 컴포넌트에서 단일 이름을 받습니다.

```javascript{8,17}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

제어되지않는 컴포넌트가 DOM에 신뢰가능한 소스를 유지하므로 제어되지않는 컴포넌트를 사용할 때 React와 React가 아닌 코드를 통합하는 것이 더 쉬울 수 있습니다. 빠르고 더럽기를 원한다면 코드가 약간 적을 수도 있습니다. 그렇지 않으려면 일반적으로 제어되는 컴포넌트를 사용하는 것이 좋습니다.

특정 상황에서 어떤 타입의 컴포넌트를 사용해야하는 지 아직 명확하지 않은 경우 [제어되지 않는 input vs 제어되는 input](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)이라는 아티클이 도움이 될 것입니다.

### 기본 값

React 렌더링 라이프사이클에서 form 요소의 `value` 속성은 DOM의 값보다 우선시합니다. 제어되지않는 컴포넌트를 사용하는 경우 React가 초기값을 지정하고 후속 업데이트를 제어하지않는 것이 좋습니다. 이런 케이스를 다루기 위해 `value` 대신 `defaultValue` 속성을 지정할 수 있습니다.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

마찬가지로 `<input type="checkbox">` 및 `<input type="radio">` 는 `defaultChecked` 를 지원하며, `<select>` 및 `<textarea>` 도 `defaultValue` 를 지원합니다.