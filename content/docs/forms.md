---
id: forms
title: 폼
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML 폼(form) 요소는 폼 요소 자체가 내부 상태를 가지기 때문에 React에서 다른 DOM 요소가 조금 다르게 동작합니다. 예를 들어, 순수한 HTML에서 이 폼은 이름을 받습니다.

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

이 폼은 유저가 폼을 전송(submit)하면 새로운 페이지로 이동하는 기본 HTML 폼 동작을 수행합니다. 만약 React에서 동일한 동작을 원한다면, 그냥 동작합니다. 그러나 대부분의 경우 form 제출을 처리하고 사용자가 form에 입력한 데이터에 접근할 수 있게하는 자바스크립트 함수를 가지는 게 편합니다. 이 동작을 위한 표준 방식은 "제어되는 컴포넌트 (Controlled Components)" 기법을 사용하는 것입니다.

## 제어되는 컴포넌트 (Controlled Components)

HTML에서 `<input>`, `<textarea>`, `<select>` 같은 form 요소는 자기만의 state를 가지고 유저 입력에 따라 업데이트됩니다. React에서, 변경 가능한 state는 일반적으로 컴포넌트의 state 속성에 존재하며, [`setState()`](/docs/react-component.html#setstate) 로만 업데이트할 수 있습니다.

React state를 "신뢰 가능한 단일 소스 (single source of truth)"로 만들어 두 요소를 결합할 수 있습니다. 그런 다음 렌더링 되는 React 컴포넌트는 이후에 폼에서 발생하는 유저 입력을 제어합니다. 이런 방식으로 React에 의해 제어되는 Input 폼 요소는 "제어되는 컴포넌트" 라고 부릅니다.

예를 들어, 위 예제에서 이름을 입력할 때 이름을 log로 남기고싶다면, 해당 폼을 제어되는 컴포넌트로 작성할 수 있습니다.

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

`value` 속성은 폼 요소에 설정되므로 표시되는 값은 항상 `this.state.value` 가 되고 React state가 신뢰 가능한 소스가 됩니다. React state를 업데이트하기 위해 모든 키스트로크에서 `handleChange` 가 동작하기 때문에 사용자가 입력할 때 표시되는 값이 업데이트됩니다.

제어되는 컴포넌트를 사용하면 모든 state 변경과 연관되는 핸들러 함수가 생깁니다. 이를 통해 사용자 입력을 수정하거나 검증하는 것이 간단해집니다. 예를 들어 모든 유저의 이름을 강제로 대문자로 받고싶다면 `handleChange` 를 다음과 같이 쓸 수 있습니다.

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## textarea 태그

HTML에서, `<textarea>` 요소는 자식으로 텍스트를 정의합니다.

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

React에서 `<textarea>` 는 대신 `value` 속성을 사용합니다. 이렇게 하면 `<textarea>` 를 사용하는 폼은 한 줄 입력을 사용하는 폼과 매우 유사하게 작성할 수 있습니다.

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

`this.state.value` 를 생성자 함수에서 초기화하기 때문에, 일부 텍스트를 가진채로 text area를 시작할 수 있습니다.

## select 태그

HTML에서, `<select>` 는 드롭 다운 목록을 만듭니다. 예를 들어, 이 HTML은 과일 드롭 다운 목록을 만듭니다.

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Coconut 옵션에 `selected` 속성이 있기 때문에 기본적으로 선택되는 걸 주목합시다. React에서는 `selected` 속성을 사용하는 대신 루트 `select` 태그에 `value` 속성을 사용합니다. 한 곳에서 업데이트만 하면 되기 때문에 제어되는 컴포넌트에서 사용하기 더 편합니다. 예를 들어,

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite La Croix flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

전반적으로 이렇게 하면 `<input type="text">`, `<textarea>`, `<select>` 가 비슷하게 동작합니다. 모두 제어되는 컴포넌트를 구현할 때 `value` 속성을 사용할 수 있습니다.

> Note
>
> `select` 태그에서 여러개의 옵션을 사용하고 싶다면, `value` 속성에 배열을 전달할 수도 있습니다.
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## 여러 Input 제어하기

여러개의 `input` 요소를 제어해야할 때 각 요소에 `name` 속성을 추가한 후 `event.target.name` 값을 기반으로 핸들러 함수를 고를 수 있습니다.

예를 들어,

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

주어진 input 이름에 해당하는 state 키를 업데이트하기 위해 ES6 [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) 구문을 사용하고 있습니다.

```js{2}
this.setState({
  [name]: value
});
```

ES5 코드에선 이렇게 작성합니다.

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

또한, `setState()` 가 자동으로 [현재 상태에 일부 상태를 병합](/docs/state-and-lifecycle.html#state-updates-are-merged) 하기 때문에, 바뀐 부분에 대해서만 호출하면 됩니다.

## 제어되는 Input Null 값

[제어되는 컴포넌트](/docs/forms.html#controlled-components) 의 prop 값을 정의하면 개발자가 원하는 경우가 아니라면 사용자가 input을 변경할 수 있습니다. `value` 를 정의했지만 여전히 input이 수정 가능한 경우라면 실수로 `value` 를 `undefined` 나 `null` 로 설정했을 수 있습니다.

다음 코드는 이를 보여줍니다. (처음 보이는 input은 잠겨있지만 약간의 딜레이 후 수정 가능하게 바뀝니다)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## 제외되는 컴포넌트 대안

데이터를 변경하는 모든 방법에 대한 이벤트 핸들러를 작성하고 React 컴포넌트에서 모든 input state를 파이프해야하기 때문에 제어되는 컴포넌트를 사용하는 것이 떄로 지루할 수 있습니다. 기존 코드베이스를 React로 변경하거나 React 어플리케이션을 React가 아닌 라이브러리와 통합할 때 이 작업은 성가신 작업일 수 있습니다. 이런 상황에서는 입력 폼을 구현하기 위한 대체 기술인 [제어되지않는 컴포넌트](/docs/uncontrolled-components.html) 를 확인할 수 있습니다.