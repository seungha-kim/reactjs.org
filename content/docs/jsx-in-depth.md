---
id: jsx-in-depth
title: JSX 더 알아보기
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


근본적으로, JSX는 그저 `React.createElement(component, props, ...children)`에 대한 문법 설탕(syntatic sugar)을 제공할 뿐입니다. 다음 JSX 코드는,

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

자식이 없으면 자기 자신을 닫는 형태의 태그를 사용할 수도 있습니다. 즉,

```js
<div className="sidebar" />
```

위의 코드는 이렇게 컴파일됩니다:

```js
React.createElement(
  'div',
  {className: 'sidebar'},
  null
)
```
특정 JSX가 JavaScript로 어떻게 컴파일되는지 시험해보고 싶다면, [온라인 Babel 컴파일러](babel://jsx-simple-example)를 사용해보세요.

## React 엘리먼트의 타입 지정하기

JSX 태그의 첫 부분은 React 엘리먼트의 타입을 결정합니다.

대문자로 시작하는 타입은 해당 JSX 태그가 React 컴포넌트임을 가리킵니다. 이 태그들은 같은 이름을 가진 변수를 직접 참조하도록 컴파일됩니다. 그러니까, `<Foo />`와 같은 JSX 표현을 사용하려면 `Foo`가 반드시 스코프 내에 존재해야 합니다.

### React가 스코프 안에 있어야합니다

JSX는 `React.createElement`를 호출하는 코드로 컴파일되기 때문에, `React` 라이브러리가 JSX 코드의 스코프 안에 항상 존재해야만 합니다.

예를 들어, 아래의 코드에서 `React`와 `CustomButton`이 JavaScript에서 직접 참조되지 않을지라도, 위쪽의 두 import를 꼭 써줘야 합니다.

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

만약 JavaScript 번들러를 사용하지 않고 `<script>` 태그를 통해 React를 불러왔다면, 이미 라이브러리가 `React` 전역 변수로서 스코프에 존재하므로 별도의 처리를 해 줄 필요가 없습니다.

### JSX 타입을 위한 점 표기법 사용하기

JSX 안에서 React 컴포넌트를 참조하기 위해 점 표기법을 사용할 수도 있습니다. 이 방법은 하나의 모듈에서 여러 React 컴포넌트를 export 하는 경우에 편리하게 쓸 수 있습니다. 예를 들어, `MyComponents.DatePicker`가 컴포넌트라면 다음과 같이 JSX 안에서 직접 참조할 수 있습니다:

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

엘리먼트 타입이 소문자로 시작한다는 것은 그것이 `<div>` or `<span>`와 같은 내장 컴포넌트라는 것을 뜻합니다. 이 컴포넌트들은 결과적으로 `'div'`혹은 `'span'`와 같은 문자열의 형태로 `React.createElement`에 전달됩니다. `<Foo />`와 같이 대문자로 시작하는 타입은 `React.createElement(Foo)`와 같이 컴파일되며, 따라서 여러분의 JavaScript 파일에 정의되어있거나 혹은 다른 파일에서 import 된 컴포넌트여야 합니다.

컴포넌트 이름을 지을 때는 대문자로 시작하는 이름을 사용하는 것이 좋습니다. 만약 컴포넌트의 이름이 소문자로 시작한다면, 대문자로 시작하는 변수에 할당한 뒤 JSX에서 이 변수를 사용하세요.

예를 들어, 아래 코드는 우리가 기대한 대로 동작하지 않습니다:

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

이를 고치기 위해, `hello`를 `Hello`로 고치고 참조할 때도 `<Hello />`를 사용할 것입니다:

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

React 엘리먼트의 타입을 지정하기 위해 아무 표현식이나 사용할 수 있는 것은 아닙니다. 엘리먼트 타입을 지정하기 위해 일반적인 JavaScript 표현식을 사용하고 싶다면, 일단 대문자로 시작하는 변수에 대입하세요. 예를 들어, 아래와 같이 prop을 가지고 컴포넌트를 선택해서 렌더링해야 하는 경우가 종종 생깁니다:

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

이를 고치기 위해, 먼저 대문자로 시작하는 변수에 타입을 할당할 것입니다:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 올바른 사용법입니다. 대문자로 시작하는 변수는 JSX 타입이 될 수 있습니다.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## JSX 안애서 prop 사용하기

JSX 안에서 prop을 지정하는 몇 가지 방법이 있습니다.

### JavaScript 표현식을 prop으로 사용하기

어떤 JavaScript 표현식도 prop으로 사용될 수 있습니다. {}으로 둘러싸면 되는데, JSX에서 아래와 같이 사용할 수 있습니다:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

`MyComponent` 에서 `props.foo` 의 값은 표현식 `1 + 2 + 3 + 4` 를 계산한 값인 `10` 입니다.

`if` 구문과 `for` 루프는 JavaScript 표현식이 아니기 때문에, JSX 안에서 그대로 사용될 수는 없습니다. 대신 JSX 밖에서 코드를 작성할 수는 있습니다. 다음의 예를 참고하세요:

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

자세한 사항은 [조건부 렌더링](/docs/conditional-rendering.html)과 [루프](/docs/lists-and-keys.html) 문서의 관련 부분을 참고해주세요.

### 문자열 리터럴

문자열 리터럴은 그대로 prop으로 넘겨줄 수 있습니다. 아래 두 JSX 표현식은 완전히 동일합니다:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

문자열 리터럴을 넘겨줄 때는 HTML 이스케이핑이 풀립니다. 따라서 다음 두 JSX 표현식은 완전히 같습니다:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

보통 이런 동작은 신경쓰지 않아도 되지만, 문서의 완결성을 위해 언급해둡니다.

### Props의 기본값은 "True"

Prop으로 아무 값도 넘겨주지 않으면, 기본값인 `true`가 됩니다. 아래 두 JSX 표현식은 완전히 같습니다:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

일반적으로, 우리는 이 방식을 사용하지 않는 것을 권장하는데 [ES6 객체 약식 표기](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015)와 혼동을 일으킬 수 있기 때문입니다. (`{foo}`는 `{foo: true}` 대신 `{foo: foo}`와 같습니다.) 다만 HTML의 동작 방식과 일치하게끔 이를 남겨두었습니다.

### 속성 펼치기

`props`에 해당하는 객체를 이미 가지고 있다면, 전체를 그대로 JSX에 넘겨주기 위해 `...` "펼치기" 연산자를 사용할 수 있습니다. 아래 두 컴포넌트는 완전히 같습니다:

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

컴포넌트가 사용할 특정 prop을 골라내고 나머지 prop을 다른 컴포넌트에 넘겨줄 때에도 펼치기 연산자를 사용할 수 있습니다.

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

위 예제에서는 `kind` prop이 안전하게 추출되었고 DOM의 `<button>` 요소로는 전달되지 않았습니다. 다른 모든 prop들은 `...other` 객체를 통해 전달되었고, 이 방법을 통해 컴포넌트를 굉장히 유연하게 만들 수 있습니다. `onClick`와 `children` prop가 넘겨진 모습을 확인해보세요.

속성 펼치기 기법은 유용하게 사용될 수 있지만, 불필요한 props 혹은 틀린 어트리뷰트를 컴포넌트에 넘기게 되는 일이 생기기 쉽다는 단점도 있습니다. 이 기법은 꼭 필요할 때만 사용하세요.

## JSX에서 자식 다루기

여는 태그와 닫는 태그가 모두 있는 JSX 표현식에서, 둘 사이에 들어있는 내용은 `props.children`라는 특별한 prop으로서 컴포넌트에 넘겨집니다. 자식을 넘겨주는 방법에는 여러 가지가 있습니다.

### 문자열 리터럴

여는 태그와 닫는 태그 사이에 문자열을 써넣을 수 있고, 이 때 `props.children`는 그냥 문자열이 됩니다. 이런 식으로 많은 내장 HTML 엘리먼트를 사용할 수 있습니다:

```js
<MyComponent>Hello world!</MyComponent>
```

이는 유효한 JSX이며, `MyComponent`의 `props.children`는 간단하게 "Hello world!"가 됩니다. HTML 이스케이핑이 풀리게 되므로, 일반적으로 보통의 HTML을 사용하듯이 JSX를 쓸 수 있습니다:

```html
<div>This is valid HTML &amp; JSX at the same time.</div>
```

JSX는 각 줄의 처음과 끝에 있는 공백을 제거합니다. 또한 빈 줄도 삭제합니다. 태그에 붙어있는 개행 역시 삭제됩니다. 문자열 리터럴 중간에 등장하는 여러 개의 개행은 한 개의 공백으로 줄어듭니다. 따라서 아래의 예제들은 모두 같은 결과를 렌더링합니다:

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

### JSX를 자식으로 사용하기

JSX 엘리먼트를 자식으로 넘겨줄 수도 있습니다. 이는 중첩된 컴포넌트를 보여주고 싶을 때 유용합니다.

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

여러 형태의 자식을 섞어서 쓸 수 있습니다. 따라서 JSX 자식과 함께 문자열 리터럴을 사용할 수 있습니다. 이는 JSX가 HTML과 닮은 부분입니다. 아래 예제는 유효한 JSX이며 또한 유효한 HTML입니다.

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

React 컴포넌트는 엘리먼트로 이루어진 배열 역시 반환할 수 있습니다.

```js
render() {
  // 별도의 엘리먼트로 감싸줄 필요가 없습니다!
  return [
    // 키를 잊지 마세요 :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 표현식을 자식으로 사용하기

`{}`으로 둘러싼 JavaScript 표현식은 모두 자식이 될 수 있습니다. 예를 들어, 다음 표현식들은 완전히 같습니다:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

이 방법은 JSX 표현식을 요소로 갖는 임의 길이의 배열을 렌더링하고 싶을 때 유용하게 사용할 수 있습니다. 예를 들어, 아래의 예제는 HTML 리스트를 렌더링합니다:

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

JavaScript 표현식은 다른 형태의 자식과 어울려 사용될 수 있습니다. 이 기능을 문자열 템플릿 대신 자주 사용합니다:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### 함수를 자식으로 사용하기

보통 JSX 내에 삽입된 JavaScript 표현식은 문자열, React 엘리먼트, 또는 이들로 이루어진 배열입니다. 그러나 `props.children`는 다른 prop들과 같은 방식으로 동작하며 어떤 형태의 데이터도 넘겨질 수 있습니다. React가 렌더링할 수 없는 것들도 포함해서 말이죠. 예를 들어, 여러분이 직접 만든 컴포넌트에서 아래와 같이 콜백을 `props.children`로 넘겨받을 수도 있습니다:

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

직접 만든 컴포넌트에는 어떤 것이든 자식으로 넘겨줄 수 있고, 그것을 React가 이해할 수 있는 형태로 변환한 후 렌더링 해줄 수 있습니다. 이런 사용법이 흔하지는 않지만, JSX의 기능을 확장시키길 원한다면 이 방법을 사용할 수 있습니다.

### 진리값, null, undefined는 무시됩니다.

`false`, `null`, `undefined`, `true` 는 유효한 자식입니다. 그저 렌더링되지 않을 뿐입니다. 아래 JSX 표현식은 모두 같은 결과를 렌더링합니다:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

이 성질은 React 엘리먼트를 조건부 렌더링하고 싶을 때 유용하게 사용할 수 있습니다. 아래 JSX는 `showHeader`가 `true`일 때에만 `<Header />`를 렌더링합니다:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

한 가지 주의해야 할 점은 `0`과 같은 몇몇 ["falsy" 값](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)들이 여전히 React에 의해 렌더링될 수 있다는 것입니다. 예를 들어, 아래 코드는 우리가 기대한 대로 동작하지 않을 것입니다. `props.messages`이 빈 배열인 경우에 `0`이 출력될 것이기 때문입니다:

```js{2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

이를 고치려면, `&&` 앞의 표현식이 언제나 진리값이 되도록 만드세요:

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
