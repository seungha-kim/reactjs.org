---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

React의 일반적인 패턴은 컴포넌트가 여러개의 요소를 반환하는 것입니다. Fragments를 사용하면 DOM에 별도 노드를 추가하지 않고 자식 목록을 그룹화할 수 있습니다.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

이를 선언하기 위해 새 [짧은 구문](#short-syntax)를 사용할 수 있으나, 모든 유명한 도구에서 아직 지원하지 않습니다.

## 동기

일반적인 패턴은 컴포넌트가 자식 목록을 반환하는 것입니다. 짧은 React 예제를 살펴봅시다.

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

렌더링된 HTML이 유효하려면 `<Columns />` 는 여러개의 `<td>` 요소를 반환해야합니다. 만약 `<Columns />` 의 `render()` 내부에 부모 div를 사용하면 렌더링된 HTML은 유효하지 않습니다.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

`<Table />` 의 출력 결과는 다음과 같습니다.

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

자 이제 `Fragment` 를 소개합니다.

## 사용법

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

올바른 `<Table />` 출력 결과는 아래와 같습니다.

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### 짧은 구문
fragment를 선언하기 위해 사용할 수 있는 새로운 짧은 구문이 있습니다. 이는 빈 태그처럼 보입니다.

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

`<></>` 는 key나 속성을 지원하지 않는다는 점을 제외하면 다른 요소와 같은 방식으로 사용할 수 있습니다.

**[많은 도구에서 아직 지원하지 않기](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)** 때문에 도구에서 지원하기 전에는 명시적으로 `<React.Fragment>` 를 작성해주어야함을 명심하세요.

### Key가 있는 Fragment

key가 있다면 명시적으로 `<React.Fragment>` 구문을 사용해 Fragments를 선언합니다. 이 사용 사례로는 콜렉션을 fragments의 배열로 매핑하는 것입니다. 예를 들어, 정의 목록을 만들 수 있습니다.

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
`key` 는 `Fragment` 에 전달 가능한 유일한 속성입니다. 추후에 이벤트 핸들러 같은 더 많은 속성을 추가로 지원할 수 있습니다.

### 라이브 데모

이 [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000)에서 새 fragment 구문을 볼 수 있습니다.