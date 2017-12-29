---
id: lifting-state-up
title: State 끌어올리기
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

가끔 일부 컴포넌트가 동일한 변경 데이터를 보여줘야할 필요가 있습니다. 이럴 때 공통 조상에 state를 끌어올리는 걸 권장합니다. 어떻게 하는 지 살펴봅시다.

이 섹션에서는 주어진 온도에서 물의 끓음 여부를 확인하는 온도 계산기를 작성합니다.

먼저 `BoilingVerdict` 컴포넌트로 시작합니다. 이 컴포넌트는 prop으로 `celsius` 온도를 받고, 물이 충분히 끓었는 지 표시합니다.

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

그리고 나서, `Calculator` 컴포넌트를 만듭니다. 이 컴포넌트는 온도를 입력받을 `<input>` 을 렌더링하고, 그 값을 `this.state.temperature` 로 넣습니다.

추가로, 현재 입력 값으로 `BoilingVerdict` 를 렌더링합니다.

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## 두번째 Input 추가하기

요구사항을 추가하여 섭씨 입력과 함께 화씨 입력을 제공하고 동기화 상태를 유지하려고 합니다.

먼저 `Calculator` 에서 `TemperatureInput` 컴포넌트를 추출하는 것부터 시작해봅시다. `"c"` 나 `"f"` 값을 넣을 수 있는 `scale` prop을 추가합니다.

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

이제 `Calculator` 를 바꾸어 온도 input을 두개로 나눠서 렌더링할 수 있습니다.

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

이제 두 개의 input을 가지고 있지만 그중 하나에만 온도를 넣어 입력하면 다른 input은 업데이트되지 않습니다. 이는 최초 요구사항이었던 '동기화 상태를 유지한다' 에 어긋납니다.

또한 `Calculator` 에서 `BoilingVerdict` 도 표시할 수 없습니다. `Calculator` 는 현재 온도가 `TemperatureInput` 안에 숨어있기 때문에 현재 온도를 알 수 없습니다.

## 변환 함수 작성하기

먼저 섭씨와 화씨를 서로 변환해주는 두 개의 함수를 만듭니다.

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

이 두개의 함수는 숫자를 변환합니다. 추후에 문자열 `temperature` 과 변환 함수를 인수로 받아서 문자열을 반환하는 다른 함수를 만들 것입니다. 다른 input을 기반으로 한 input의 값을 계산할 때 사용합니다.

그 함수는 유효하지 않은 `temperature` 에 빈 문자열을 반환하고, 출력을 세번째 소수점 이하부터 반올림합니다.

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

예를 들어, `tryConvert('abc', toCelsius)` 는 빈 문자열을 반환하고, `tryConvert('10.22', toFahrenheit)` 는 `'50.396'` 을 반환합니다.

## State 끌어올리기

현재, 두 개의 `TemperatureInput` 컴포넌트는 로컬 state 값을 독립적으로 가지고 있습니다.

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

그러나, 두 input이 서로 동기화하기를 원합니다. 섭씨 input을 업데이트 하면 온도를 변환한 값이 화씨 input에 비추어야 하며 반대여도 마찬가지로 동작해야합니다.

React에서는 공유하는 state가 필요하다면 컴포넌트의 가까운 공통 조상에 state를 옮겨서 수행해야합니다. 이를 "state 끌어올리기"라고 부릅니다. `TemperatureInput` 컴포넌트에서 로컬 state를 삭제하고 대신 `Calculator` 로 옮깁니다.

만약 `Calculator` 가 공유되는 state를 가지면, 이는 두 개의 input에서 사용할 수 있는 현재 온도에 대한 "신뢰 가능한 소스"가 됩니다. 이를 통해 서로에게 일관된 값을 가질 수 있도록 지시할 수 있습니다. 양쪽 `TemperatureInput` 컴포넌트의 props가 같은 부모 `Calculator` 컴포넌트에서 오므로, 두 input은 항상 동기화 상태입니다.

이제 단계별로 어떻게 동작하는 지 살펴봅시다.

먼저 `TemperatureInput` 컴포넌트의 `this.state.temperature` 를 `this.props.temperature` 로 변경합니다. 추후에 `Calculator` 에서 전달해야할 필요가 있지만 지금은 `this.props.temperature` 값이 존재한다고 가정해봅시다.

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

[props는 읽기 전용](/docs/components-and-props.html#props-are-read-only) 입니다. `temperature` 가 로컬 state 일 때는 `this.setState()` 를 호출해 변경하면 되었습니다. 하지만 이제는 `temperature` 가 부모로부터 prop으로 전달받기 때문에, `TemperatureInput` 이 그를 제어할 수 없습니다.

React에서는 이 문제를 해결하기 위해 보통 "제어되는" 컴포넌트를 만듭니다. DOM `<input>` 이 `value` 와 `onChange` prop을 받는 것처럼, 커스텀 `TemperatureInput` 도 부모 `Calculator` 컴포넌트로부터 `temperature` 와 `onTemperatureChange` prop을 받게 만들 수 있습니다.

이제 `TemperatureInput` 가 그 온도를 업데이트하고 싶을 때 `this.props.onTemperatureChange` 를 호출합니다.

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>Note:
>
>커스텀 요소의 prop 이름으로 `temperature` 나 `onTemperatureChange` 라고 지은 데에는 특별한 의미는 없습니다. 이 속성들은 일반적인 컨벤션인 `value` 나 `onChange` 같은 이름으로 바꿔서 부를 수도 있습니다.

`onTemperatureChange` prop은 부모 `Calculator` 컴포넌트에서 `temperature` prop과 함께 제공됩니다. 이 함수는 자체 로컬 state를 수정하여 변경사항을 제어하므로 두 input을 새 값으로 새로 렌더링합니다. 새로운 `Calculator` 구현체는 곧바로 살펴봅시다.

`Calculator` 변경에 빠져들기 전에, `TemperatureInput` 컴포넌트의 변경사항을 다시 살펴봅시다. 로컬 상태를 컴포넌트에서 제거하고 `this.state.temperature` 를 읽어오는 대신 `this.props.temperature` 를 읽어옵니다. 변경사항이 생겼을 때 `this.setState()` 를 호출하는 대신 `Calculator` 에서 제공하는 `this.props.onTemperatureChange()` 를 호출합니다.

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

다시 `Calculator` 컴포넌트로 돌아와봅시다.

현재 input의 `temperature` 와 `scale` 을 로컬 state에 저장합니다. 이 state는 input으로부터 "끌어올려지며", 두개의 값 모두를 "신뢰 가능한 소스"로 제공합니다. 두 input을 렌더링하기 위해 알아야하는 모든 데이터를 최소한으로 표현한 것입니다.

예를 들어, 섭씨 input에 37을 입력하면, `Calculator` 컴포넌트의 상태는 아래와 같습니다.

```js
{
  temperature: '37',
  scale: 'c'
}
```

그리고 화씨 input을 212로 수정하면, `Calculator` 컴포넌트의 상태는 아래와 같습니다.

```js
{
  temperature: '212',
  scale: 'f'
}
```

양쪽 값을 모두 저장할 수도 있지만 이는 불필요한 것으로 판명되었습니다. 가장 최근에 변경된 input 값과 그것이 나타내는 scale을 아는 것으로 충분합니다. 현재의 `temperature` 와 `scale` 만으로도 다른 input 값을 추론할 수 있습니다.

input은 그 값을 같은 state에서 계산해오기 때문에 동기화 상태를 유지합니다.

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

이제 어떤 input을 편집하던 지 `Calculator` 안의 `this.state.temperature` 와 `this.state.scale` 이 업데이트됩니다. input 중 하나가 값을 그대로 가져오므로 모든 사용자 입력이 보존되고 다른 input 값은 그 값을 기반으로 다시 계산합니다.

input을 수정할 때 무슨 일이 일어나는 지 다시 살펴봅시다.

* React는 DOM `<input>` 이 바뀔 때마다 `onChange` 로 정의된 함수를 호출합니다. 이 케이스에서는 `TemperatureInput` 컴포넌트의 `handleChange` 메서드가 이 역할을 수행합니다.
* `TemperatureInput` 컴포넌트 안의 `handleChange` 메서드는 새 이상적인 값으로 `this.props.onTemperatureChange()` 를 호출합니다. `onTemperatureChange` 를 포함한 props는 부모 컴포넌트인 `Calculator` 에서 제공합니다.
* When it previously rendered, the `Calculator` has specified that `onTemperatureChange` of the Celsius `TemperatureInput` is the `Calculator`'s `handleCelsiusChange` method, and `onTemperatureChange` of the Fahrenheit `TemperatureInput` is the `Calculator`'s `handleFahrenheitChange` method. So either of these two `Calculator` methods gets called depending on which input we edited.
* Inside these methods, the `Calculator` component asks React to re-render itself by calling `this.setState()` with the new input value and the current scale of the input we just edited.
* React calls the `Calculator` component's `render` method to learn what the UI should look like. The values of both inputs are recomputed based on the current temperature and the active scale. The temperature conversion is performed here.
* React calls the `render` methods of the individual `TemperatureInput` components with their new props specified by the `Calculator`. It learns what their UI should look like.
* React DOM updates the DOM to match the desired input values. The input we just edited receives its current value, and the other input is updated to the temperature after conversion.

Every update goes through the same steps so the inputs stay in sync.

## Lessons Learned

There should be a single "source of truth" for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](/docs/state-and-lifecycle.html#the-data-flows-down).

Lifting state involves writing more "boilerplate" code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state "lives" in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.

If something can be derived from either props or state, it probably shouldn't be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `temperature` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.

When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

