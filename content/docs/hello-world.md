---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: installation.html
next: introducing-jsx.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
---

React를 접하는 가장 쉬운 방법은 [Codepen에서 이 Hello World 예제](codepen://hello-world) 를 사용하는 것입니다. 아무것도 설치할 필요가 없습니다. 다른 탭을 열어서 예제를 따라 가면 됩니다. 로컬 개발 환경을 사용하려면 [설치](/docs/installation.html) 페이지를 확인하십시오.

가장 작은 React 예제는 다음과 같습니다.

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

이 코드는 페에지에서 헤더의 "Hello, world!"를 렌더링합니다.

다음 몇 섹션에서는 React를 사용하는 방법을 소개합니다. 요소와 컴포넌트 같은 React 앱의 구성 블록을 살펴볼 것입니다. 이를 마스터하면 재사용 가능한 작은 조각으로 복잡한 앱을 만들 수 있습니다.

## 자바스크립트 참고사항

React는 자바스크립트 라이브러리이며 이는 곧 자바스크립트 언어에 대한 기본 지식이 필요하다는 것입니다. 자신감이 부족하시다면 [JavaScript 재입문하기](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) 문서를 읽는 것을 추천하며, 이후에 좀 더 수월하게 따라오실 수 있을 겁니다.

또한 예제에서 ES6 문법을 종종 사용합니다. 여전히 비교적 새로운 문법이기 때문에 많은 부분에 사용하고 있지는 않지만,
[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions),
[classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) 정도에는 익숙해지는 것을 권장합니다. [Babel REPL](babel://es5-syntax-example) 을 사용해서 ES6 코드가 어떻게 컴파일되는지 확인할 수 있습니다.