---
id: introducing-jsx
title: JSX 소개
permalink: docs/introducing-jsx.html
prev: hello-world.html
next: rendering-elements.html
---

아래 변수 선언을 살펴봅시다.

```js
const element = <h1>Hello, world!</h1>;
```

위의 이상한 태그 문법은 문자열도 HTML도 아닙니다.

이 문법은 JSX라고 부르며, 자바스크립트의 확장 문법입니다. JSX를 리액트와 함께 사용하면, UI가 실제로 어떻게 보일지 서술할 수 있습니다. JSX는 템플릿 언어처럼 보일 수 있지만, 오로지 자바스크립트를 기반으로 동작하고 있습니다.

JSX는 React "요소"를 만듭니다. 그 요소가 어떻게 DOM에 렌더링 되는 지는 [다음 섹션](/docs/rendering-elements.html) 에서 설명합니다. 아래에서 JSX를 시작하는 데 필요한 기본 사항을 확인할 수 있습니다.

### 왜 JSX인가?

React는 렌더링 로직이 다른 UI 로직과 본질적으로 결합되어 있다는 사실을 인정합니다. 즉 이벤트의 처리 과정, 시간에 따른 상태 변화, 표시할 데이터가 어디로부터 오는지가 **렌더링 로직**과 결합되어 있다는 것입니다.

React는 별도의 파일에 마크업과 로직을 넣어 *기술* 을 인위적으로 분리하는 대신, 둘 다 포함하는 "컴포넌트"라고 부르는 단위를 이용해 [*관심사*를 분리](https://en.wikipedia.org/wiki/Separation_of_concerns) 합니다. [이후 섹션](/docs/components-and-props.html) 에서 다시 컴포넌트로 돌아오겠지만 JS에 마크업을 넣는게 익숙해지지 않는다면 [이 이야기](https://www.youtube.com/watch?v=x7cQ3mrcKaY) 가 확신을 줄 것입니다.

React를 사용하기 위해 [반드시 JSX를 사용해야 하는 것은 아닙니다만](/docs/react-without-jsx.html), 많은 사람들이 자바스크립트 코드 안에서 UI 작업을 할 때 시각적으로 더 편하다고 느끼고 있습니다. 또한 JSX를 사용하면 React가 유용한 에러 및 경고 메시지를 표시해줄 수 있습니다.

그러면 시작해봅시다!

### JSX에 표현식 포함하기

JSX 안에 [자바스크립트 표현식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#Expressions) 을 중괄호로 묶어서 포함시킬 수 있습니다.

예를 들어, `2 + 2`, `user.firstName`, `formatName(user)` 를 유효한 표현식으로 표현하면 아래와 같이 표현합니다.

```js{12}
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Perez'
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://introducing-jsx).

가독성을 좋게 하기 위해 JSX를 여러줄로 나눴습니다. 필수는 아니지만, 이 작업을 수행할 때는 [자동 세미콜론 삽입](http://stackoverflow.com/q/2846283)의 함정을 피하기 위해 괄호로 묶는 것이 좋습니다.

### JSX 또한 표현식이다

컴파일이 끝나면, JSX 표현식이 일반적인 자바스크립트 함수 호출이 되고, 결과적으로 자바스크립트 객체로 평가됩니다.

이 말은 `if` 문이나 `for` 문 내에서 JSX를 사용할 수 있으며, 변수에 할당하거나 매개변수로 전달하거나 함수에서 반환할 수 있음을 의미합니다.

```js{3,5}
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger.</h1>;
}
```

### JSX 어트리뷰트 정의

어트리뷰트에서 따옴표를 사용해서 문자열 리터럴을 정의할 수 있습니다.

```js
const element = <div tabIndex="0"></div>;
```

어트리뷰트에 중괄호를 사용하면, 자바스크립트 표현식을 포함시킬 수 있습니다.

```js
const element = <img src={user.avatarUrl}></img>;
```

어트리뷰트에 자바스크립트 표현식을 포함시킬 때 중괄호를 따옴표로 묶지 마세요. 따옴표 (문자열 값인 경우) 또는 중괄호 (표현식인 경우) 중 하나를 사용해야 하며, 하나의 어트리뷰트에 둘 다 사용할 수 있는 것이 아닙니다.

>**경고:**
>
>JSX는 HTML보다는 자바스크립트에 가깝기 때문에, React DOM은 HTML 어트리뷰트 이름 대신 `camelCase` 어트리뷰트 이름 컨벤션을 사용합니다.
>
> 예를 들어, JSX에서 `class` 는 [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) 이 되며, `tabindex` 는 [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/tabIndex) 가 됩니다.

### JSX 자식 정의

만약 태그가 비어있다면, XML 처럼 `/>` 를 이용해 닫아주어야 합니다.

```js
const element = <img src={user.avatarUrl} />;
```

JSX 태그는 자식을 가질 수 있습니다.

```js
const element = (
  <div>
    <h1>Hello!</h1>
    <h2>Good to see you here.</h2>
  </div>
);
```

### JSX 인젝션 공격 예방

사용자가 입력한 내용을 JSX 내에 포함시켜도 안전합니다.

```js
const title = response.potentiallyMaliciousInput;
// This is safe:
const element = <h1>{title}</h1>;
```

기본적으로, React DOM은 렌더링 되기 전에 JSX 내에 포함된 모든 값을 [이스케이프](http://stackoverflow.com/questions/7381974/which-characters-need-to-be-escaped-on-html) 합니다. 따라서 어플리케이션에 명시적으로 작성되지 않은 내용은 절대 삽입할 수 없습니다. 모든 것은 렌더링 되기 전에 문자열로 변환됩니다. 이렇게 하면 [XSS (cross-site-scripting)](https://en.wikipedia.org/wiki/Cross-site_scripting) 공격을 막을 수 있습니다.

### JSX 객체 표현

Babel은 JSX를 `React.createElement()` 호출로 컴파일합니다.

아래 두 예제는 동일합니다.

```js
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```js
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

`React.createElement()` 는 버그 없는 코드를 작성하는 데 도움을 주는 몇 가지 체크를 하긴 하지만, 기본적으로는 아래와 같은 객체를 생성합니다.

```js
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```

이 객체를 "React 요소"라고 부릅니다. 화면에서 보고자 하는 내용에 대한 설명 내지 서술로 생각할 수 있습니다. React는 이 객체를 읽어들이고 이를 사용하여 DOM을 만들어낸 뒤 최신 상태로 유지합니다.

다음 섹션에서 React 요소를 DOM에 렌더링 하는 방법을 살펴보겠습니다.

>**팁:**
>
>ES6 및 JSX 코드가 모두 올바르게 표시되도록 선택한 편집기에 ["Babel" 언어 설정](http://babeljs.io/docs/editors) 을 사용하는 것이 좋습니다. 이 웹사이트에서는 호환 가능한 [Oceanic Next](https://labs.voronianski.com/oceanic-next-color-scheme/) 컬러 스킴을 사용합니다.
