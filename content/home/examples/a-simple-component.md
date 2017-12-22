---
title: 단일 컴포넌트
order: 0
---

React 컴포넌트는 입력 데이터를 받고 화면에 표시할 것을 반환하는 `render()` 메서드를 구현했습니다.
이 예제는 JSX라는 유사 XML 문법을 사용하고 있습니다. 컴포넌트에서 전달하는 입력 데이터는 `this.props`를 통해 `render()` 에서 접근할 수 있습니다.

**JSX는 React를 사용할 때 필수가 아닌 옵션입니다.** [Babel REPL](babel://es5-syntax-example) 을 사용하여 JSX 컴파일 단계에서 생성된 원시 JavaScript 코드를 확인해보세요.