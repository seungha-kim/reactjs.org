---
id: lists-and-keys
title: 리스트와 키
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

먼저, 자바스크립트에서 목록 형태의 데이터를 어떻게 다뤘었는지 살펴봅시다.

아래 코드에서는, [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 함수를 사용해 `numbers` 배열의 각 항목을 두 배로 만들어 줬습니다. `map()` 함수가 반환한 새 배열을 `doubled` 변수에 대입한 뒤 출력해봅시다.

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

콘솔에는 `[2, 4, 6, 8, 10]` 이라고 찍힐 겁니다.

React에서도 거의 비슷한 과정을 통해, [요소](/docs/rendering-elements.html) 목록을 배열로부터 계산해낼 수 있습니다.

### 컴포넌트 여러 개를 렌더링하기

요소 목록을 만든 뒤에는 중괄호 `{}` 를 사용하여 [JSX에 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 시키는 것이 가능합니다.

아래 예제에서는 자바스크립트의 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 함수를 사용해서 `numbers` 배열을 순회하면서, 각 항목에 대해 `<li>` 요소를 반환합니다. 마지막으로, 결과적으로 얻어낸 요소 배열을 `listItems` 에 대입합니다.

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

전체 `listItems` 배열을 `<ul>` 요소 안에 삽입해서 [DOM에 렌더링](/docs/rendering-elements.html#rendering-an-element-into-the-dom) 해줄 수 있습니다.

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

이 코드는 1부터 5까지의 숫자로 이루어진 목록을 표시합니다.

### 기본적인 목록 컴포넌트

여러분은 대개 [컴포넌트](/docs/components-and-props.html) 안에서 목록을 렌더링하게 됩니다.

이전 예제를 리팩토링해서, `numbers` 배열을 받아 `ul`을 출력하는 컴포넌트를 만들어봅시다.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

이 코드를 실행하면, 목록의 각 항목에 키를 넣어야한다는 경고가 표시됩니다. "키(key)"는 요소 목록를 만들 때 포함해야하는 특수한 문자열 속성입니다. 다음 섹션에서 키의 중요성에 대해 더 살펴봅니다.

`numbers.map()` 안에서 각 항목에 `key` 를 할당하여 키 관련 경고를 해결해봅시다.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## 키

키를 지정해주면 어떤 아이템이 바뀌었는지, 추가되었는지, 삭제되었는 지를 React에게 알려줄 수 있습니다. 배열에 들어있는 요소마다 식별자를 키로 넣어주세요.

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

키로 쓰기에 가장 적절한 값은 각 항목을 고유하게 식별할 수 있는 문자열입니다. 대부분의 경우 데이터의 ID를 키로 사용합니다.

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

만약 그러한 값이 없다면, 최후의 수단으로 배열 인덱스를 키로 사용할 수도 있습니다.

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```

항목 간 순서가 바뀔 수 있는 경우 키에 인덱스를 사용하지 않는 게 좋습니다. 이로 인해 성능이 저하되거나 컴포넌트의 state와 관련된 문제가 생길 수 있습니다. Robin Pokorny가 작성한 아티클인 [in-depth explanation on the negative impacts of using an index as a key](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) 를 참고하시길 바랍니다. 만약 명시적으로 키를 지정하지 않으면 React는 기본적으로 인덱스를 키로 사용합니다.

더 자세히 알고 싶다면 [왜 키가 필요한가에 대한 더 깊은 설명](/docs/reconciliation.html#recursing-on-children) 을 읽어보세요.

### 키로 컴포넌트 추출하기

키는 바로 바깥쪽의 배열에 대해서만 의미를 가집니다.

예를 들어, `ListItem` 컴포넌트를 [추출](/docs/components-and-props.html#extracting-components) 한 경우, `ListItem` 자체의 루트 `<li>` 요소가 아닌 배열의 `<ListItem />` 요소가 키를 가지고 있어야합니다.

**예제: 잘못된 키 사용법**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // 틀렸습니다! 여기서 키를 넣어주는 것은 아무런 효과가 없습니다.
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 틀렸습니다! 바로 여기서 키를 넣어주어야 합니다.
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**예제: 올바른 키 사용법**

```javascript{2,3,9,10}
function ListItem(props) {
  // 맞았습니다! 여기서 키를 넣어주는 것이 아닙니다.
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 맞았습니다! 바로 여기서 키를 넣어주어야 합니다.
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

"`map()` 에서 반환하는 요소에는 키를 넣어준다"고 외워두어도 좋습니다.

### 키는 형제 중에서 고유한 값이어야한다.

배열 내에서 사용되는 키는 형제 간에 고유해야합니다. 그러나 전체 범위에서 고유할 필요는 없습니다. 서로 다른 두 배열을 생성할 때는 동일한 키를 사용할 수 있습니다.

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

키는 React에게 힌트를 제공하지만 컴포넌트로 전달되지는 않습니다. (역주: 컴포넌트 안에서 this.props.key와 같이 가져와서 쓰는 것이 불가능) 만약 컴포넌트에 동일한 값이 필요하다면 명시적으로 다른 이름의 prop으로 전달하세요.

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

위 예제에서 `Post` 컴포넌트는 `props.id` 를 읽을 수 있지만, `props.key` 는 읽을 수 없습니다.

### JSX에서 map() 포함하기

위 예제에서 별도의 `listItems` 변수를 선언하고 이를 JSX에 포함시켰습니다.

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX는 중괄호 안에 [임의의 표현식을 포함](/docs/introducing-jsx.html#embedding-expressions-in-jsx) 할 수 있기 때문에, `map()` 도 인라인으로 포함시킬 수 있습니다.

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

위 스타일을 통해 코드가 더 명확해질 수도 있지만 남용하는 것은 좋지 않습니다. 자바스크립트와 마찬가지로, 가독성을 위해 변수로 추출해야할지 아니면 인라인으로 넣을지는 개발자가 직접 판단해야합니다. `map()` 함수가 너무 중첩되어있다면, [컴포넌트로 추출](/docs/components-and-props.html#extracting-components) 하는 것이 좋습니다.