---
title: 단순한 컴포넌트
order: 0
---

React 컴포넌트에서는 입력된 데이터를 가지고 화면에 무엇을 표시할 것인지 반환하기 위해 `render()` 메서드를 사용합니다.
이 예제는 XML과 비슷한 JSX라는 문법을 사용하고 있습니다. `render()` 안에서 `this.props`를 통해 컴포넌트로 전달된 입력 데이터에 접근할 수 있습니다.

**React를 사용하기 위해 반드시 JSX를 사용해야 하는 것은 아닙니다.** [Babel REPL](babel://es5-syntax-example)을 사용해서 JSX 코드를 컴파일하고, 그 결과로 생성된 JavaScript 코드 원본을 확인해보세요.