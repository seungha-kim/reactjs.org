---
id: jsx-in-depth
title: JSX 톺아보기
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

근본적으로 JSX는 `React.createElement(component, props, ...children)` 함수에 대한 문법 설탕 (syntactic sugar)을 제공할 뿐입니다. JSX 코드는

```js
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

이렇게 컴파일됩니다.

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

만약 자식이 없다면 스스로 닫는 형태의 태그를 사용할 수도 있습니다. 이 코드는

```js
<div className="sidebar" />
```

이렇게 컴파일됩니다.

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```

특정 JSX가 자바스크립트로 어떻게 컴파일되는 지 테스트해보고싶다면, [온라인 Babel 컴파일러](babel://jsx-simple-example) 를 사용해보세요.

## React 요소 타입 정의하기

JSX 태그의 첫 부분은 React 요소의 타입을 정의합니다.

대문자로 시작하는 JSX 태그는 React 컴포넌트를 가리킵니다. 이 태그들은 같은 이름을 가진 변수를 참고하도록 컴파일되며, JSX `<Foo />` 표현을 사용하려면, 반드시 `Foo` 가 스코프 안에 있어야합니다.

### React가 스코프 안에 있어야합니다

JSX는 `React.createElement` 를 호출하도록 컴파일되기 때문에, `React` 라이브러리가 JSX 코드의 스코프 내에 존재해야합니다.

예를 들어 아래 코드에서 `React` 와 `CustomButton` 을 자바스크립트에서 직접적으로 참조하지 않더라도 위쪽의 두 import를 꼭 작성해주어야합니다.

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

만약 자바스크립트 번들러를 사용하지 않고 `<script>` 태그를 이용해 React를 불러왔다면 `React` 는 이미 전역 스코프에 있습니다.

### JSX 타입을 위한 점 표기법 사용하기

JSX에서 React 컴포넌트를 참조하기 위해 점 표기법을 사용할 수 있습니다. 이 방법은 하나의 모듈에서 많은 React 컴포넌트를 export 할 때 유용합니다. 예를 들어, `MyComponents.DatePicker` 가 컴포넌트라면 JSX에서 직접 참조할 수 있습니다.

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 사용자 정의 컴포넌트는 대문자로 시작해야합니다

엘리먼트 타입이 소문자로 시작한다는 건 `<div>` 나 `<span>` 같은 빌트인 컴포넌트라는 것을 뜻하며 결과적으로는 `React.createElement` 에 `'div'` 나 `'span'` 같은 문자열로 전달됩니다. `<Foo />` 같이 대문자로 시작하는 타입은 `React.createElement(Foo)` 로 컴파일되고 자바스크립트 파일 내에서 정의되었거나 import해온 컴포넌트여야합니다.

컴포넌트 이름을 지을 때는 대문자로 시작하는 게 좋습니다. 만약 컴포넌트의 이름이 소문자로 시작한다면, 대문자로 시작하는 변수에 할당한 뒤 JSX에서 사용하세요.

예를 들어, 아래 코드는 원하는 대로 동작하지 않습니다.

```js{3,4,10,11}
import React from 'react';

// Wrong! This is a component and should have been capitalized:
function hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Wrong! React thinks <hello /> is an HTML tag because it's not capitalized:
  return <hello toWhat="World" />;
}
```

이 코드를 고쳐보면, `hello` 를 `Hello` 로 바꾼 후 참조할 때도 `<Hello />` 를 사용합니다.

```js{3,4,10,11}
import React from 'react';

// Correct! This is a component and should be capitalized:
function Hello(props) {
  // Correct! This use of <div> is legitimate because div is a valid HTML tag:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Correct! React knows <Hello /> is a component because it's capitalized.
  return <Hello toWhat="World" />;
}
```

### 실행 중에 타입 선택하기

React 요소 타입에 일반적인 표현식을 사용할 수 없습니다. 엘리먼트 타입을 지정하기 위해 일반적인 표현식을 사용하고 싶다면 대문자로 시작하는 변수에 할당하세요. 예를 들어 prop을 기준으로 다른 컴포넌트를 렌더링해야할 때가 있습니다.

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}
```

위 코드를 고쳐보면, 먼저 대문자로 시작하는 변수에 타입을 할당합니다.

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Correct! JSX type can be a capitalized variable.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 안애서 prop 사용하기

JSX에서 props를 정의하는 몇가지 다른 방법이 있습니다.

### 자바스크립트 표현식을 Props로 사용하기

어떤 자바스크립트 표현식이던 prop으로 전달 가능하며, 이 때 `{}` 로 감싸줘야합니다. 예를 들어, JSX에서 이를 보면

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

`MyComponent` 에서 `props.foo` 의 값은 표현식 `1 + 2 + 3 + 4` 를 계산한 값인 `10` 입니다.

`if` 문과 `for` 반복은 자바스크립트 표현식이 아니기 때문에, JSX에서 바로 사용할 수 없습니다. 대신 JSX 바깥에서는 사용할 수 있습니다. 예를 들면,

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

더 자세한 사항은 [조건부 렌더링](/docs/conditional-rendering.html) 과 [반복](/docs/lists-and-keys.html) 을 살펴보세요

### 문자열 리터럴

문자열 리터럴은 그대로 prop으로 넘겨줄 수 있습니다. 아래 두 JSX 표현은 동일합니다.

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

문자열 리터럴을 전달할 때, 이 값들은 HTML 이스케이핑되지 않습니다. 아래 두 JSX 표현은 동일합니다.

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

보통 이런 동작은 신경쓰지 않아도 되지만, 문서의 완결성을 위해 언급해둡니다.

### Props의 기본값은 "True"

prop에 아무 값도 전달하지 않으면, 기본값은 `true` 입니다. 아래 두 JSX 표현은 동일합니다.

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

일반적으로 이 방식을 사용하지 않는 것을 권장하는 데 [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) 와 헷갈릴 수 있기 때문입니다. `{foo}` 는 `{foo: true}` 가 아닌 `{foo: foo}` 와 동일합니다. HTML 동작방식과 일치시키기 위해 남겨두었습니다.

### 속성 펼치기

`props` 객체를 이미 가지고 있다면, 전체를 그대로 JSX에 전달해주기 위해 `...` "펼치기" 연산자를 사용할 수 있습니다. 아래 두 컴포넌트는 동일합니다.

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

펼치기 연산자를 사용하면서 다른 모든 props를 통과하면서 컴포넌트가 소비할 특정 props를 고를 수 있습니다.

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

위 예제에서는 `kind` prop이 안전하게 소모되었고 DOM의 `<button>` 요소로 전달되지 않았습니다.
다른 props 들은 이 컴포넌트를 실제로 유연하게 만드는 `...other` 객체를 통해 전달됩니다. 전달된 값들을 `onClick` 과 `children` props에서 볼 수 있습니다.

속성 펼치기 기법은 유효하지 않은 props를 컴포넌트로 쉽게 전달할 수 있게 만들어서 유용하지만, 그 부분에 그렇게 신경쓰지 않게 만들거나 DOM에서 유효하지 않은 HTML 속성을 전달하게 만들기도 합니다. 꼭 필요할 때만 사용하는 걸 권장합니다.

## JSX에서 자식다루기

여는 태그와 닫는 태그가 있는 JSX 표현식에서 이 콘텐츠 사이의 내용은 `props.children` 이라는 특별한 prop으로 전달됩니다. 자식을 전달하는 몇 가지 방법이 있습니다.

### 문자열 리터럴

여는 태그와 닫는 태그 사이에 문자열을 넣고 `props.children` 을 문자열로 둘 수 있습니다. 이는 빌트인 HTML 요소에서 유용합니다. 예를 들어,

```js
<MyComponent>Hello world!</MyComponent>
```

이는 유효한 JSX이며 `MyComponent` 의 `props.children` 은 문자열 `"Hello world!"` 가 됩니다. HTML은 이스케이핑되지 않기 때문에 HTML을 작성하듯이 JSX를 작성할 수 있습니다.

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX는 각 줄의 처음과 끝에 있는 공백문자를 제거합니다. 또한 빈 줄도 제거합니다. 태그에 붙어있는 개행 문자 또한 삭제됩니다. 문자열 리터럴 중간중간에 나타나는 여러 개행 하나의 공백으로 줄어듭니다. 아래는 모두 동일하게 렌더링됩니다.

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### JSX 자식

JSX 요소를 자식으로 제공할 수 있습니다. 중첩된 컴포넌트를 보여줄 때 유용합니다.

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

다른 타입의 자식을 섞어서 사용할 수 있습니다. 따라서 JSX 자식과 함께 문자열 리터럴을 사용할 수 있습니다. 이는 JSX를 HTML처럼 사용하는 다른 방법이고, 아래 코드는 JSX와 HTML에서 유효합니다.

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

React 컴포넌트는 요소의 배열을 반환할 수 있습니다.

```js
render() {
  // No need to wrap list items in an extra element!
  return [
    // Don't forget the keys :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### 자바스크립트 표현식을 자식으로 사용하기

`{}` 로 감싸서 자바스크립트 표현식을 자식으로 전달할 수 있습니다. 예를 들어, 아래 표현은 동일합니다.

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

알 수 없는 길이의 JSX 표현식 목록을 렌더링할 때 유용합니다. 예를 들어 아래와 같이 HTML 목록을 렌더링합니다.

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

자바스크립트 표현식은 다른 타입의 자식과 섞어서 사용할 수 있습니다. 때로 문자열 템플릿 대신 사용하기도 합니다.

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 함수를 자식으로 사용하기

보통 JSX에 포함된 자바스크립트 표현식은 문자열, React 요소, 이러한 것들의 목록으로 취급됩니다. 하지만 `props.children` 는 React가 렌더링하는 방법을 아는 것 뿐만 아니라 다른 prop처럼 동작하기 때문에 모든 종류의 데이터를 전달할 수 있습니다. 예를 들어 커스텀 컴포넌트가 있다면 `props.children` 으로 콜백을 전달할 수 있습니다.

```js{4,13}
// Calls the children callback numTimes to produce a repeated component
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

커스텀 엘리먼트에 전달되는 자식은 해당 컴포넌트가 렌더링 되기 전에 React가 이해할 수 있는 것으로 변환되는 한 아무것이나 될 수 있습니다. 이 사용법은 일반적이지 않지만 JSX가 수행할 수 있는 작업을 확장하고자 할 때 유용합니다.

### 불리언, Null, Undefined는 무시된다
`false`, `null`, `undefined`, `true` 는 유효한 자식입니다. 단순히 렌더링되지 않습니다. 아래 JSX 표현식은 동일하게 렌더링됩니다.

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

조건부로 React 요소를 렌더링할 때 유용하게 쓰입니다. 아래 JSX는 `showHeader` 가 `true` 일 때만 `<Header />` 를 렌더링합니다.

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

한가지 주의해야할 점은 `0` 숫자 같은 ["falsy" 값](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) 은 여전히 리액트에서 렌더링된다는 점입니다. 예를 들어 아래 코드는 예상대로 동작하지 않는데 왜냐하면 `props.message` 가 빈 배열일 때 `0` 이 나타나기 때문입니다.

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

이를 고치기 위해, `&&` 앞의 표현식이 항상 불리언이게 만듭시다.

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

반대로, `false`, `true`, `null`, `undefined` 를 출력시키고 싶다면, 먼저 [문자열로 변환](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) 해야합니다.

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
