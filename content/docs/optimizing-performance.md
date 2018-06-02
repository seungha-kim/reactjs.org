---
id: optimizing-performance
title: 성능 최적화
permalink: docs/optimizing-performance.html
redirect_from: "docs/advanced-performance.html"
---

React는 내부적으로 UI 업데이트를 위해 필요한 값 비싼 DOM 연산 개수를 최소화하기 위해 몇가지 영리한 기술을 사용합니다. 많은 어플리케이션에서 React를 사용하면 성능 최적화를 위해 많은 작업을 하지 않더라도 빠른 유저 인터페이스로 이어질 것입니다. 그럼에도 불구하고 React 어플리케이션의 속도를 높이는 몇가지 방법이 있습니다.

## 프로덕션 빌드 사용하기

React 앱에서 벤치마킹 하였거나 성능상의 문제가 발생하는 경우 압축된 프로덕션 빌드에서 테스트하고 있는 지 살펴보십시오.

React는 기본적으로 많은 도움이되는 경고를 포함합니다. 이러한 경고는 개발할 때 매우 유용합니다. 하지만 경고들은 React를 크고 느리게 만드므로 앱을 배포할 때는 프로덕션 버전을 사용해야함을 명심해야합니다.

빌드 프로세스가 제대로 설정되었는 지 확신이 서지 않는다면 [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)을 설치해 확인해볼 수 있습니다. 프로덕션 모드인 React 사이트를 방문하면 아이콘이 검은색 배경으로 보입니다.

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools on a website with production version of React">

만약 개발 중인 React 사이트를 방문하면 아이콘이 붉은색 배경으로 보입니다.

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools on a website with development version of React">

앱을 개발할 때는 개발 모드를 사용하고 사용자에게 배포할 때는 프로덕션 모드를 사용해야합니다.

아래에서 프로덕션을 위한 앱을 만드는 방법을 찾을 수 있습니다.

### Create React App

프로젝트가 [Create React App](https://github.com/facebookincubator/create-react-app)으로 만들어졌다면,

```
npm run build
```

이 커맨드를 실행하면 프로젝트의 `build/` 폴더에 앱의 프로덕션 빌드를 생성합니다.

프로덕션을 배포하기 전에만 유효하다는 걸 명심하시길 바랍니다. 개발할 때는 `npm start` 를 사용합니다.

### 단일 파일 빌드

React와 React DOM의 프로덕션-레디 버전을 단일 파일로 제공합니다.

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

프로덕션에 적합한 React 파일은 `.production.min.js` 로 끝나는 걸 명심하시길 바랍니다.

### Brunch

가장 효율적인 Brunch 프로덕션 빌드를 위해 [`uglify-js-brunch`](https://github.com/brunch/uglify-js-brunch) 플러그인을 설치하십시오.

```
# If you use npm
npm install --save-dev uglify-js-brunch

# If you use Yarn
yarn add --dev uglify-js-brunch
```

프로덕션 빌드를 만들고 싶다면 `build` 커맨드에 `-p` 플래그를 추가하면 됩니다.

```
brunch build -p
```

프로덕션 빌드 때만 이게 필요하단 걸 명심하길 바랍니다. 유효한 경고를 가리고 빌드를 더 느리게하기 때문에 개발 중일 때에는 `-p` 플래그를 전달하지 않아도 됩니다.

### Browserify

가장 효율적인 Browserify 프로덕션 빌드를 위해 몇가지 플러그인을 설치해야합니다.

```
# If you use npm
npm install --save-dev envify uglify-js uglifyify 

# If you use Yarn
yarn add --dev envify uglify-js uglifyify 
```

프로덕션 빌드를 만들려면 아래 transforms를 추가해야합니다. **(순서대로 해야함)**

* [`envify`](https://github.com/hughsk/envify) transform을 통해 올바른 빌드 환경이 설정됩니다. 글로벌하게 만드세요 (`-g`).
* [`uglifyify`](https://github.com/hughsk/uglifyify) transform은 개발 import를 제거합니다. 글로벌하게 만드세요 (`-g`).
* 마지막으로 결과 번들은 난독화를 위해 [`uglify-js`](https://github.com/mishoo/UglifyJS2) 에 파이프됩니다 ([read why](https://github.com/hughsk/uglifyify#motivationusage)).

예를 들어,

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | uglifyjs --compress --mangle > ./bundle.js
```

>**Note:**
>
>패키지명은 `uglify-js` 지만 바이너리에서는 `uglifyjs` 라고 제공합니다.<br>
>이는 오타가 아닙니다.

프로덕션 빌드 때만 이게 필요하단 걸 명심하길 바랍니다. React에서 유효한 경고를 가리고 빌드를 더 느리게하기 때문에 개발 중에는 이러한 플러그인을 사용하지 않는 걸 권장합니다.

### Rollup

가장 효율적인 Rollup 프로덕션 빌드를 위해 몇가지 플러그인을 설치해야합니다.

```
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-uglify 
```

프로덕션 빌드를 만들려면 아래 플러그인을 추가해야합니다. **(순서대로 해야함)**

* [`replace`](https://github.com/rollup/rollup-plugin-replace) 플러그인은 올바른 빌드 환경을 설정합니다.
* [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) 플러그인은 Rollup에서 CommonJS 지원을 제공합니다.
* [`uglify`](https://github.com/TrySound/rollup-plugin-uglify) 플러그인은 마지막 번들을 압축하고 난독화시킵니다.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-uglify')(),
  // ...
]
```

완전한 세팅 예제를 보려면 [이 gist를 보세요](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0).

프로덕션 빌드 때만 이게 필요하다는 사실을 명심하시길 바랍니다. 개발할 때 `'production'` 값으로 `uglify` 플러그인이나 `replace` 플러그인을 동작시키면 유용한 React 경고가 사라지거나 빌드를 느리게 만듭니다.

### webpack

>**Note:**
>
>만약 Create React App을 사용한다면 [위 설정](#create-react-app)을 따르길 바랍니다.<br>
>이 섹션은 webpack을 직접 설정한 경우에만 해당합니다.

가장 효율적인 webpack 프로덕션 빌드를 위해 프로덕션 설정에 몇가지 플러그인을 포함해야합니다.

```js
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production')
}),
new webpack.optimize.UglifyJsPlugin()
```

더 자세한 사항은 [webpack 문서](https://webpack.js.org/guides/production-build/)에서 볼 수 있습니다.

프로덕션 빌드 때만 이게 필요하다는 사실을 명심하시길 바랍니다. 개발할 때 `'production'` 값으로 `UglifyJsPlugin` 이나 `DefinePlugin` 을 동작시키면 유용한 React 경고가 사라지거나 빌드를 느리게 만듭니다.

## Chrome 퍼포먼스 탭에서 컴포넌트 프로파일링

**개발** 모드에서는 지원되는 브라우저에서 성능 도구를 사용하여 컴포넌트의 마운트, 업데이트, 언마운트를 시각적으로 볼 수 있습니다. 예를 들어,

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="React components in Chrome timeline" /></center>

Chrome에서는

1. 어플리케이션이 개발 모드에서 동작 중인지 확인합니다.

2. Chrome DevTools의 **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** 탭을 열고 **Record** 를 누릅니다.

3. 프로파일링할 작업을 수행하십시오. 20초 이상 기록하지 않으면 Chrome이 중단될 수 있습니다.

4. 기록을 중단하세요.

5. React 이벤트는 **User Timing** 레이블에 그룹되어있을 것입니다.

더 자세한 동작은 [Ben Schwarz의 아티클](https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad)을 참고하세요.

**숫자는 상대적이며 컴포넌트는 프로덕션에서 더 빠르게 렌더링된다**는 걸 기억하세요. 그래도 실수로 무의미한 UI가 얼마나 업데이트 되는 지, UI가 얼마나 자주 업데이트 되는 지 살펴볼 수 있습니다.

현재 이 기능은 Chrome, Edge, IE에서만 지원하지만 표준 [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) 를 이용하기 때문에 더 많은 브라우저에서 이 기능을 지원할 것입니다.

## 긴 리스트 가상화하기

만약 어플리케이션이 긴 목록 데이터 (수백 혹은 수천개 행)를 렌더링해야한다면, "윈도잉 (windowing)" 기술을 사용하는 걸 권장합니다. 이 기술은 주어진 시간 내에 행의 작은 부분만 렌더링하므로 컴포넌트를 다시 렌더링하는 데 걸리는 시간과 생성된 DOM 노드 갯수를 크게 줄일 수 있습니다.

[React Virtualized](https://bvaughn.github.io/react-virtualized/) 는 유명한 윈도잉 라이브러리입니다. 목록, 그리드, 표 데이터를 표현하기 위한 여러가지 재사용가능한 컴포넌트를 제공합니다. 어플리케이션의 특정 케이스에 더 적합한 것을 원한다면 [Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3) 처럼 독자적인 윈도잉 컴포넌트를 만들 수도 있습니다.
 
## 비교조정 (Reconciliation) 피하기

React는 렌더링된 UI의 내부 표현을 만들고 관리합니다. 여기에는 컴포넌트가 반환하는 React 요소도 포함됩니다. 이 표현은 React가 자바스크립트 노드 작업보다 느릴 수 있으므로 필요에 따라 DOM 노드를 만들고 기존 노드에 접근하지 못하게합니다. 때로는 "가상 DOM (virtual DOM)"이라고 하지만 React Native에서도 같은 방식으로 동작합니다.

컴포넌트의 props나 state 변경되면 React는 새로 반환된 요소를 이전에 렌더링된 것과 비교하여 실제 DOM 업데이트가 필요한지 여부를 결정합니다. 둘이 동일하지 않다면 React는 DOM을 업데이트합니다.

일부 케이스에서는 컴포넌트에서 다시 렌더링하는 프로세스가 시작되기 전에 트리거되는 라이프사이클 함수 `shouldComponentUpdate` 를 재정의하여 이러한 모든 것을 가속할 수 있습니다. 이 함수의 기본 구현체는 `true` 를 반환하고 React는 업데이트를 수행합니다.

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

일부 상황에서 컴포넌트를 업데이트할 필요가 없는 경우 `shouldComponentUpdate` 에서 `false` 를 반환하여 이 컴포넌트 및 하위에서 호출하는 `render()` 를 포함한 전체 렌더링 프로세스를 스킵할 수 있습니다.

## shouldComponentUpdate In Action

여기 컴포넌트의 서브트리가 있습니다. 각각에서, `SCU` 는 `shouldComponentUpdate` 가 무엇을 반환하는 지 나타내고, `vDOMEq` 는 렌더링된 React 요소가 동일한 지를 나타냅니다. 마지막으로 원의 색은 컴포넌트를 비교조정해야하는 지 여부를 나타냅니다.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

`shouldComponentUpdate` 는 C2를 루트로하는 서브트리에 대해 `false` 를 반환했으므로 React는 C2 렌더링을 시도하지 않습니다. 따라서 C4 및 C5에서 `shouldComponentUpdate` 를 호출할 필요가 없습니다.

C1과 C2에서는 `shouldComponentUpdate` 에서 `true` 를 반환하므로 React는 하위로 내려가서 체크해야합니다. C6에서 `shouldComponentUpdate` 가 `true` 를 반환하고 렌더링된 요소가 동일하지 않기 때문에 React가 DOM을 업데이트하였습니다.

마지막으로 흥미로운 사례는 C8입니다. React는 이 컴포넌트를 렌더링하였지만 반환된 React 요소가 이전에 렌더링된 것과 동일하기 때문에 DOM을 업데이트할 필요가 없습니다.

React는 C6의 DOM 변화 (DOM mutations)을 수행해야하는 데 이는 불가피한 일임을 명심해야합니다. C8에서는 렌더링된 React 요소를 비교하여 손해를 보았고, C2의 서브트리와 C7의 경우 `shouldComponentUpdate` 를 벗어날 때 요소를 비교할 필요가 없었으므로 `render` 를 호출하지 않습니다.

## 예제

컴포넌트가 변경되는 유일한 방법인 `props.color` 나 `state.count` 변수가 변경될 때 `shouldComponentUpdate` 가 체크하도록 할 수 있습니다.

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

이 코드에서 `shouldComponentUpdate` 는 `props.color` 나 `state.count` 에 어떤 변화가 있는지만 체크합니다. 이 값들이 변하지않으면 컴포넌트는 업데이트되지않습니다. 컴포넌트가 복잡해지면 `props` 와 `state` 의 모든 필드 사이에 "얕은 비교 (shallow comparison)"를 수행하는 비슷한 패턴을 사용하여 컴포넌트를 업데이트해야하는지 결정할 수 있습니다. 이 패턴은 React가 이 로직에서 사용할 수 있는 `React.PureComponent` 에서 상속하는 헬퍼를 제공할만큼 일반적인 패턴입니다. 아래 코드는 같은 일을 수행하는 간단한 방법입니다.

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

대부분의 경우 자신만의 `shouldComponentUpdate` 를 작성하는 대신 `React.PureComponent` 를 사용할 수 있습니다. 얕은 비교만 수행하므로, 얕은 비교가 놓칠 수 있는 방법으로 props나 state가 변경되는 경우 사용할 수 없습니다.

더 복잡한 데이터 구조에서 문제가될 수 있습니다. 예를 들어, 버튼을 클릭해서 목록에 단어를 추가할 수 있는 부모 컴포넌트인 `WordAdder` 와 콤마로 구분된 목록인 단어를 렌더링하는 `ListOfWords` 컴포넌트가 있다고 합시다. 이 코드는 제대로 동작하지 *않습니다*.

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

여기서 문제는 `PureComponent` 컴포넌트가 `this.props.words` 의 이전 값과 신규 값 사이를 단순하게 비교하는 것입니다. 이 코드는 `WordAdder` 의 `handleClick` 메서드 내부의 `words` 배열이 변경을 변경하기 때문에 배열의 실제 단어가 변경되었더라도 `this.props.words` 의 이전 값과 새로운 값은 동일하게 비교됩니다. `ListOfWords` 는 새로운 단어가 렌더링되어야하더라도 업데이트되지 않습니다.

## 변하지않는 데이터의 힘

이 문제를 피하는 가장 간단한 방법은 props 또는 state에서 사용중인 값의 변경을 피하는 것입니다. 예를 들어 위에서 작성한 `handleClick` 메서드는 `concat` 을 사용하여 다시 작성해야합니다.

```javascript
handleClick() {
  this.setState(prevState => ({
    words: prevState.words.concat(['marklar'])
  }));
}
```

ES6에서는 이를 더 단순하게 하는 [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator)를 지원합니다. 만약 Create React App을 사용한다면 이 구문을 기본으로 사용할 수 있습니다.

```js
handleClick() {
  this.setState(prevState => ({
    words: [...prevState.words, 'marklar'],
  }));
};
```

비슷한 방법으로 변경을 피하기 위해 객체를 변경하는 코드를 다시 작성할 수 있습니다. 예를 들어 `colormap` 이라는 객체가 있다고 가정하고 `colormap.right` 를 `'blue'` 로 바꾸는 함수를 작성할 수 있습니다.

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

원본 객체를 변경하지 않고 이를 작성하려면 [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 메서드를 사용할 수 있습니다.

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` 는 이전 객체를 변경하는 대신 새 객체를 반환합니다. `Object.assign` 는 ES6에서 추가되었으므로 폴리필 (polyfill)이 필요합니다.

자바스크립트에 변경 없이 객체를 쉽게 업데이트할 수 있게 하는 [전개 연산자 (object spread properties)](https://github.com/sebmarkbage/ecmascript-rest-spread) 가 제안되어 추가되고 있습니다.

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

만약 Create React App을 사용한다면, `Object.assign` 및 전개 연산 구문을 기본으로 사용할 수 있습니다.

## 불변 데이터 구조 사용하기

[Immutable.js](https://github.com/facebook/immutable-js) 는 이 문제를 해결하는 다른 방법입니다. 이는 구조 공유를 통해 작동하는 불변이고 영구적인 콜렉션을 제공합니다.

* *Immutable*: 한번 생성된 콜렉션은 다른 시점에서 변경할 수 없습니다.
* *Persistent*: 새로운 콜렉션은 이전 콜렉션 그리고 Set과 같은 뮤테이션에서 생성될 수 있습니다. 원본 컬렉션은 새 콜렉션이 생성된 후에도 유효합니다.
* *Structural Sharing*: 가능한 한 원본 콜렉션과 동일한 구조를 사용하여 새 콜렉션이 만들어지므로 복사를 최소화하여 성능을 향상합니다.

불변성 (Immutability) 은 추적 비용을 저렴하게 만듭니다. 변경은 항상 새로운 객체를 만드므로 객체에 대한 참조가 변경되었는지 확인하기만 하면 됩니다. 예를 들어 일반적인 아래 자바스크립트 코드에서

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

`y` 가 변경되었지만 `x` 와 같은 객체에 대한 참조이기 때문에 비교는 `true` 입니다. 비슷한 코드를 immutable.js 와 함께 아래와 같이 작성할수 있습니다. 

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

이 경우 `x` 를 변경할 때 새로운 참조가 반환되기 때문에 `y` 에 저장된 새 값이 `x` 에 저장된 원래의 값과 다른지 확인하기 위해서 `(x === y)` 를 사용할 수 있습니다.

불변 데이터를 사용할 때 도움을 주는 [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) 과 [immutability-helper](https://github.com/kolodny/immutability-helper) 라이브러리가 있습니다.

불변 데이터 구조는 `shouldComponentUpdate` 를 구현하는데 필요한 객체의 변경을 추적하는 저렴한 방법을 제공합니다. 이는 가끔 좋은 성능 향상을 제공합니다.
