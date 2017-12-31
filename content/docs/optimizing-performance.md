---
id: optimizing-performance
title: 성능 최적화
permalink: docs/optimizing-performance.html
redirect_from: "docs/advanced-performance.html"
---

React는 내부적으로 UI 업데이트를 위해 필요한 값 비싼 DOM 연산 갯수를 최소화하기 위해 몇가지 영리한 기술을 사용합니다. 많은 어플리케이션에서 React를 사용하면 성능 최적화를 위해 많은 작업을 하지 않더라도 빠른 유저 인터페이스로 이어질 것입니다. 그럼에도 불구하고 React 어플리케이션의 속도를 높이는 몇가지 방법이 있습니다.

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
 
## 재조정 (Reconciliation) 피하기

React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components. This representation lets React avoid creating DOM nodes and accessing existing ones beyond necessity, as that can be slower than operations on JavaScript objects. Sometimes it is referred to as a "virtual DOM", but it works the same way on React Native.

When a component's props or state change, React decides whether an actual DOM update is necessary by comparing the newly returned element with the previously rendered one. When they are not equal, React will update the DOM.

In some cases, your component can speed all of this up by overriding the lifecycle function `shouldComponentUpdate`, which is triggered before the re-rendering process starts. The default implementation of this function returns `true`, leaving React to perform the update:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

If you know that in some situations your component doesn't need to update, you can return `false` from `shouldComponentUpdate` instead, to skip the whole rendering process, including calling `render()` on this component and below.

## shouldComponentUpdate In Action

Here's a subtree of components. For each one, `SCU` indicates what `shouldComponentUpdate` returned, and `vDOMEq` indicates whether the rendered React elements were equivalent. Finally, the circle's color indicates whether the component had to be reconciled or not.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Since `shouldComponentUpdate` returned `false` for the subtree rooted at C2, React did not attempt to render C2, and thus didn't even have to invoke `shouldComponentUpdate` on C4 and C5.

For C1 and C3, `shouldComponentUpdate` returned `true`, so React had to go down to the leaves and check them. For C6 `shouldComponentUpdate` returned `true`, and since the rendered elements weren't equivalent React had to update the DOM.

The last interesting case is C8. React had to render this component, but since the React elements it returned were equal to the previously rendered ones, it didn't have to update the DOM.

Note that React only had to do DOM mutations for C6, which was inevitable. For C8, it bailed out by comparing the rendered React elements, and for C2's subtree and C7, it didn't even have to compare the elements as we bailed out on `shouldComponentUpdate`, and `render` was not called.

## Examples

If the only way your component ever changes is when the `props.color` or the `state.count` variable changes, you could have `shouldComponentUpdate` check that:

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

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color` or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

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

Most of the time, you can use `React.PureComponent` instead of writing your own `shouldComponentUpdate`. It only does a shallow comparison, so you can't use it if the props or state may have been mutated in a way that a shallow comparison would miss.

This can be a problem with more complex data structures. For example, let's say you want a `ListOfWords` component to render a comma-separated list of words, with a parent `WordAdder` component that lets you click a button to add a word to the list. This code does *not* work correctly:

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

The problem is that `PureComponent` will do a simple comparison between the old and new values of `this.props.words`. Since this code mutates the `words` array in the `handleClick` method of `WordAdder`, the old and new values of `this.props.words` will compare as equal, even though the actual words in the array have changed. The `ListOfWords` will thus not update even though it has new words that should be rendered.

## The Power Of Not Mutating Data

The simplest way to avoid this problem is to avoid mutating values that you are using as props or state. For example, the `handleClick` method above could be rewritten using `concat` as:

```javascript
handleClick() {
  this.setState(prevState => ({
    words: prevState.words.concat(['marklar'])
  }));
}
```

ES6 supports a [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays which can make this easier. If you're using Create React App, this syntax is available by default.

```js
handleClick() {
  this.setState(prevState => ({
    words: [...prevState.words, 'marklar'],
  }));
};
```

You can also rewrite code that mutates objects to avoid mutation, in a similar way. For example, let's say we have an object named `colormap` and we want to write a function that changes `colormap.right` to be `'blue'`. We could write:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

To write this without mutating the original object, we can use [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` now returns a new object, rather than mutating the old one. `Object.assign` is in ES6 and requires a polyfill.

There is a JavaScript proposal to add [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) to make it easier to update objects without mutation as well:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

If you're using Create React App, both `Object.assign` and the object spread syntax are available by default.

## Using Immutable Data Structures

[Immutable.js](https://github.com/facebook/immutable-js) is another way to solve this problem. It provides immutable, persistent collections that work via structural sharing:

* *Immutable*: once created, a collection cannot be altered at another point in time.
* *Persistent*: new collections can be created from a previous collection and a mutation such as set. The original collection is still valid after the new collection is created.
* *Structural Sharing*: new collections are created using as much of the same structure as the original collection as possible, reducing copying to a minimum to improve performance.

Immutability makes tracking changes cheap. A change will always result in a new object so we only need to check if the reference to the object has changed. For example, in this regular JavaScript code:

```javascript
const x = { foo: 'bar' };
const y = x;
y.foo = 'baz';
x === y; // true
```

Although `y` was edited, since it's a reference to the same object as `x`, this comparison returns `true`. You can write similar code with immutable.js:

```javascript
const SomeRecord = Immutable.Record({ foo: null });
const x = new SomeRecord({ foo: 'bar' });
const y = x.set('foo', 'baz');
const z = x.set('foo', 'bar');
x === y; // false
x === z; // true
```

In this case, since a new reference is returned when mutating `x`, we can use a reference equality check `(x === y)` to verify that the new value stored in `y` is different than the original value stored in `x`.

Two other libraries that can help use immutable data are [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) and [immutability-helper](https://github.com/kolodny/immutability-helper).

Immutable data structures provide you with a cheap way to track changes on objects, which is all we need to implement `shouldComponentUpdate`. This can often provide you with a nice performance boost.
