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

종종, 하나의 데이터에 대한 변경사항을 여러 개의 컴포넌트에 반영해야 할 필요가 있습니다. 이럴 때는 가장 가까운 공통 조상에 state를 끌어올리는 걸 권장합니다. 이런 코드를 어떻게 작성할 수 있는지 살펴봅시다.

이 문서에서는, 주어진 온도에서 물이 끓을지 안 끓을지 계산해주는 계산기를 만들어 볼 것입니다.

BoilingVerdict라는 컴포넌트를 가지고 시작해보도록 하겠습니다. 이 컴포넌트는 celsius(섭씨)라는 prop을 받아서, 이 온도가 물을 끓이기에 충분히 높은지를 출력합니다.


```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

다음으로, `Calculator`라는 컴포넌트를 만들어 보겠습니다. 이 컴포넌트는 `<input>`을 렌더링해서 사용자가 기온을 입력할 수 있게 해 주며, 그 값을 `this.state.temperature`에 저장합니다.

또, 현재 입력 값에 대한 `BoilingVerdict`를 렌더링 합니다.

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

## 두 번째 Input 추가하기

우리의 새 요구사항은, 섭씨 온도 외에도 화씨 온도에 대한 입력 필드를 추가하고 이 둘을 동기화시키는 것입니다.

`Calculator` 컴포넌트에서 `TemperatureInput`을 빼내는 것으로 시작해 보겠습니다. 또한 `"c"` 혹은 `"f"`의 값을 가질 수 있는 `scale`이라는 prop을 추가할 것입니다:

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

이제 두 개의 분리된 기온 입력 필드를 렌더링하도록 `Calculator`를 바꾸어 보겠습니다.

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

이제 우리에겐 두 개의 입력 필드가 있습니다. 하지만 한 쪽에서 기온을 입력하면, 다른 쪽이 갱신되지 않습니다. "동기화가 되어야 한다"는 요구사항을 충족시키지 못하고 있군요.

또한 `Calculator`로부터 `BoilingVerdict`를 출력하지도 못하고 있습니다. `Calculator`는 현재 입력된 기온을 알 수 없는데, 그 값이 `TemperatureInput` 안에 숨겨져 있기 때문입니다.

## 변환 함수 작성하기

먼저, 섭씨를 화씨로 바꿔주는 함수, 또 그 반대의 변환을 해 주는 함수를 작성해보도록 하겠습니다.

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

이 두 함수는 숫자를 변환합니다. 이제 또 다른 함수, 그러니까 `temperature` 문자열과 변환 함수를 인자로 받아서 문자열을 반환하는 함수도 작성해보도록 하겠습니다. 이 함수는 한 입력 필드로부터 받은 입력값을 가지고 다른 필드에 출력할 값을 계산하기 위한 목적으로 사용될 것입니다.

이 함수는 올바르지 않은 `temperature`에 대해서 빈 문자열을 반환하고, 소수점 아래 세 번째 자리로 반올림을 합니다:

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

지금은 두 `TemperatureInput` 컴포넌트가 각각의 입력 필드의 값을 각자의 state에 독립적으로 저장하고 있습니다.

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

하지만, 우리는 이 두 입력 필드가 동기화되기를 원합니다. 그러니까 섭씨 입력 필드를 변경하면, 그에 따라 화씨 입력 필드도 방금 변경된 기온을 반영해야 합니다. 그 반대도 마찬가지입니다.

React에서는, 특정 state를 필요로 하는 컴포넌트들의 가장 가까운 공통 조상으로 해당 state를 옮김으로써 상태의 공유를 이루어냅니다. 이런 기법을 "상태 끌어올리기"라고 부릅니다. 이제 `TemperatureInput`에 있는 지역 상태를 제거하고 그것을 `Calculator`로 옮길 것입니다.

`Calculator`가 공유 상태를 갖게 되면, 이는 두 기온 입력 필드에 대한 "진리의 원천(source of truth)"이 됩니다. 이를 통해 두 입력 필드가 서로에 대한 일관성을 갖게 만들 수 있습니다. 두 `TemperatureInput` 컴포넌트의 props는 같은 부모인 `Calculator`로부터 온 것이기 때문에, 두 입력 필드가 항상 동기화됩니다.

동작 방식을 차근차근 살펴봅시다.

먼저, `TemperatureInput` 컴포넌트의 `this.props.temperature`를 `this.state.temperature`로 바꿀 것입니다. 일단 `this.props.temperature`가 주어져있다고 가정하겠습니다. 이것은 나중에 `Calculator`로부터 건네받을 것입니다.

```js{3}
  render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

우리는 [props가 읽기 전용](/docs/components-and-props.html#props-are-read-only)이라는 사실을 알고 있습니다. `temperature`가 지역 상태였을 때는, 이를 변경하기 위해 `TemperatureInput`의 `this.setState()`를 호출하는 것으로 충분했습니다. 하지만 지금은 `temperature`가 부모로부터 주어진 prop이기 때문에, `TemperatureInput`로서는 이를 변경할 방법이 없습니다.

React에서는 보통 "통제된" 컴포넌트를 만드는 식으로 이를 해결합니다. `<input>` 요소가 `value`와 `onChange` prop을 받듯이, 우리가 만든 `TemperatureInput`도 부모인 `Calculator`로부터 `temperature`와 `onTemperatureChange` prop들을 받게 할 수 있습니다.

이제, `TemperatureInput`에서 기온을 변경해야 할 필요가 생기면 `this.props.onTemperatureChange`를 호출하면 됩니다:

```js{3}
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>주의:
>
>`temperature` 혹은 `onTemperatureChange`와 같은 prop 이름이 특별한 의미를 갖는 것은 아닙니다. 여러분이 원하는 어떤 이름이든 사용할 수 있습니다. `value`나 `onChange`와 같이 흔히 사용되는 이름도 포함해서요.

부모 컴포넌트인 `Calculator`는 `onTemperatureChange`와 `temperature` prop을 제공할 것입니다. 이를 이용해 그 자신의 지역 상태를 변경하고, 변경된 새 값을 이용해 두 입력 필드를 다시 렌더링하게 될 것입니다. 새 `Calculator`의 구현체는 조금 뒤에 살펴보도록 하겠습니다.

`Calculator`의 변경 사항을 보기 전에, `TemperatureInput` 컴포넌트의 변경 사항을 살펴보겠습니다. 지역 상태가 제거되었고, `this.state.temperature` 대신 `this.props.temperature` 읽어오도록 했습니다. 이제 상태의 변경을 일으키기 위해 `this.setState()`을 호출하는 대신, `Calculator`가 제공한 `this.props.onTemperatureChange()`을 호출합니다:

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

입력 필드의 `temperature`와 `scale`을 이 컴포넌트의 지역 상태에 저장할 것입니다. 이것이 우리가 입력 필드로부터 "끌어 올린" 상태이며, 두 입력 필드의 "진리의 원천" 역할을 하게 될 것입니다. 또한 이것은 두 입력 필드를 렌더링하기 위해 우리가 알아야 할 모든 데이터에 대한 가장 단순한 표현이기도 합니다.

예를 들어, 섭씨 입력 필드에 37을 입력하게 되면 `Calculator` 컴포넌트의 state는 아래와 같이 될 것입니다:

```js
{
  temperature: '37',
  scale: 'c'
}
```

화씨 입력 필드의 값을 212로 고치면, `Calculator`의 상태는 아래와 같이 될 것입니다:

```js
{
  temperature: '212',
  scale: 'f'
}
```

두 입력 필드의 값을 모두 저장할 수도 있겠지만 이는 불필요합니다. 가장 최근에 변경된 입력 필드의 값과 그 단위를 저장하는 것만으로 충분합니다. `temperature`와 `scale`을 가지고 다른 입력 필드의 값을 계산해낼 수 있기 때문입니다.

두 입력 필드는 완벽히 동기화 되는데, 모두 같은 state로부터 계산되기 때문입니다:

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


이제, 여러분이 어떤 입력 필드를 수정하든, `Calculator`의 `this.state.temperature`와 `this.state.scale`는 갱신됩니다. 한 입력 필드는 있는 그대로의 입력값을 받기 때문에 사용자가 입력한 값이 보존될 것이고, 다른 입력 필드의 값은 앞에서 입력받은 값을 토대로 계산될 것입니다.

여러분이 입력 필드를 수정할 때 일어나는 일을 전체적으로 살펴보겠습니다.

* React는 `<input>`에 지정된 `onChange` 함수를 호출합니다. 우리의 경우, `TemperatureInput` 컴포넌트의 `handleChange` 함수에 해당합니다.
* `TemperatureInput` 컴포넌트의 `handleChange` 메소드는 새로 입력된 값을 가지고 `this.props.onTemperatureChange()`를 호출합니다. `onTemperatureChange`을 포함한 prop들은 부모 컴포넌트인 `Calculator`로부터 받은 것입니다.
* `Calculator` 안에서 섭씨 `TemperatureInput`에 지정된 `onTemperatureChange`는 `Calculator`의 `handleCelsiusChange` 메소드이며, 화씨 `TemperatureInput`에 지정된 `onTemperatureChange`는 `Calculator`의 `handleFahrenheitChange` 메소드입니다. 따라서 이 두 `Calculator`의 메소드들 중 어떤 메소드가 호출될 지는 우리가 어떤 입력 필드를 수정하느냐에 따라 결정됩니다.
* 이 두 메소드의 내부에서는 우리가 방금 수정한 입력 필드에 새롭게 입력된 값과 해당 입력 필드의 단위를 가지고 `this.setState()`를 호출함으로써, React로 하여금 `Calculator`를 다시 렌더링하도록 하고 있습니다.
* React는 UI를 어떻게 렌더링할 지를 알아내기 위해 `Calculator` 컴포넌트의 `render` 메소드를 호출합니다. 두 입력 필드의 값이 현재 기온 및 활성화된 단위를 기반으로 다시 계산됩니다. 기온의 단위 변환이 여기서 일어납니다.
* React는 `Calculator`가 준 새로운 props를 가지고 각 `TemperatureInput` 컴포넌트의 `render`를 호출합니다. 그럼으로써 UI가 어떻게 생겼는지를 알아냅니다.
* React DOM은 DOM을 변경합니다. 우리가 수정했던 입력 필드는 값을 잘 받고, 다른 입력 필드는 변환된 기온으로 갱신됩니다.

입력 필드를 수정할 때마다 같은 과정을 거치게 되고, 따라서 두 입력 필드는 동기화 된 상태를 유지합니다.

## 교훈

React 애플리케이션 안에서 수정되는 데이터에 대해서는 반드시 하나의 "진리의 원천"만을 두는 것이 좋습니다. 보통의 경우 state는 그를 필요로 하는 컴포넌트에 처음으로 작성됩니다. 그러고 나서 다른 컴포넌트 역시 그것을 필요로 하게 되면, 가장 가까운 공통 조상에 state를 끌어올리세요. 여러 컴포넌트의 state를 일치시키려고 하지 마시고, 대신 [하향식 데이터 흐름](/docs/state-and-lifecycle.html#the-data-flows-down)을 사용하세요.

state를 끌어올린다는 것은 양방향 바인딩 접근법보다 더 많은 "boilerplate" 코드를 작성하는 것을 의미하지만, 버그를 찾아내거나 격리시키는 작업을 쉽게 만든다는 장점도 있습니다. 어떤 state든 간에 state는 컴포넌트 안에 존재하며 state를 변경할 수 있는 존재는 오로지 자신 뿐이기 때문에, 버그가 존재할 수 있는 범위가 굉장히 좁아지게 됩니다. 또한, 사용자의 입력을 변환하거나 거부하는 자체 로직을 자유롭게 구현할 수도 있습니다.

어떤 값이 prop이나 state로부터 계산될 수 있다면, 그 값은 state에 두지 않는 것이 좋습니다. 예를 들어, `celsiusValue`와 `fahrenheitValue`를 모두 저장하는 대신, 우리는 최근에 수정된 `temperature`와 그 `scale`을 저장했습니다. 다른 입력 필드의 값은 언제나 `render()` 안에서 앞의 두 값을 이용해 계산해 낼 수 있습니다. 이 방식을 통해 사용자 입력의 정밀도를 잃지 않으면서도 다른 필드의 값에 반올림을 적용할 수 있게 됩니다.

만약 UI가 이상하게 보인다면, [React Developer Tools](https://github.com/facebook/react-devtools)를 이용해 props를 검사하고 state의 변경을 담당하는 컴포넌트를 발견할 때까지 따라 올라가보세요. 이렇게 함으로써 버그의 진원지를 찾아낼 수 있습니다.

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

