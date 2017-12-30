---
id: static-type-checking
title: 정적 타입 체크
permalink: docs/static-type-checking.html
prev: typechecking-with-prototypes.html
next: refs-and-the-dom.html
---

[Flow](https://flowtype.org/) 와 [TypeScript](https://www.typescriptlang.org/) 같은 정적 타입 체커는 코드를 실행하기 전에 몇몇 문제를 식별합니다. 자동 완성같은 기능을 추가하여 개발자의 작업흐름을 개선하기도 합니다. 이런 이유로 큰 코드 베이스에서는 `PropTypes` 대신 Flow나 TypeScript 사용을 권장합니다.

## Flow

[Flow](https://flow.org/) 는 자바스크립트 코드를 위한 정적 타입 체커입니다. Facebook에 의해 개발되었으며 종종 React와 함께 사용합니다. 변수, 함수 및 React 컴포넌트에 특수한 타입 구문을 사용하여 주석을 달고 실수를 조기에 발견 할 수 있습니다. 더 자세한 건 [Flow 소개](https://flow.org/en/docs/getting-started/) 를 읽어볼 수 있습니다.

Flow를 사용하기 위해서는

* 프로젝트 의존성에 Flow를 추가해야합니다.
* Flow 구문이 컴파일 코드에서 제거되었는 지 확인하세요.
* 타입 주석을 추가하고 Flow를 실행해 체크해야합니다.

아래에서 이 단계를 더 상세하게 소개합니다.

### 프로젝트에 Flow 추가하기

먼저 터미널에서 프로젝트 디렉토리로 이동합니다. 그리고 두 커민드를 실행합니다.

만약 [Yarn](https://yarnpkg.com/) 을 쓴다면,

```bash
yarn add --dev flow-bin
yarn run flow init
```

만약 [npm](https://www.npmjs.com/) 을 쓴다면,

```bash
npm install --save-dev flow-bin
npm run flow init
```

첫번째 커맨드는 프로젝트에 최신 버전 Flow를 설치합니다. 두번째 커맨드는 Flow 설정 파일을 만들고 추후에 커밋해야합니다.

마지막으로, `flow` 를 `package.json` 의 `"scripts"` 섹션에 추가합니다.

```js{4}
{
  // ...
  "scripts": {
    "flow": "flow",
    // ...
  },
  // ...
}
```

### 컴파일된 코드에서 Flow 구문 벗겨내기

Flow는 주석 형태를 확장한 특수한 구문을 사용하는 자바스크립트 언어 확장입니다. 그러나 브러우저는 그런 구문을 모르기 때문에 브라우저에 전송되는 컴파일된 자바스크립트 번들로 끝내면 안됩니다.

이를 수행하는 방법은 자바스크립트를 컴파일할 떄 사용하는 도구에 따라 다릅니다.

#### Create React App

만약 [Create React App](https://github.com/facebookincubator/create-react-app) 을 사용해 프로젝트를 세팅했다면, 축하합니다! Flow 주석이 기본적으로 벗겨져 있기 떄문에 이 단계를 밟지 않아도 됩니다.

#### Babel

>Note:
>
>아래 지시사항은 Create React App 유저를 위한 것이 *아닙니다*. Create React App 이 Babel을 사용하고 있다고는 하지만, 이미 Flow를 이해하도록 설정되어있습니다. Create React App을 사용하지 *않는* 경우에만 이 단계를 진행하십시오.

프로젝트에서 수동으로 Babel을 설정한 경우 Flow를 위한 특별한 프리셋을 설치해야합니다.

만약 Yarn을 사용한다면,

```bash
yarn add --dev babel-preset-flow
```

만약 npm을 사용한다면,

```bash
npm install --save-dev babel-preset-flow
```

그리고 나서 [Babel configuration](http://babeljs.io/docs/usage/babelrc/)에 `flow` 프리셋을 추가합니다. 예를 들어, Babel을 `.babelrc` 파일을 통해 설정한다면 아래와 같이 할 수 있습니다.

```js{3}
{
  "presets": [
    "flow",
    "react"
  ]
}
```

이게 코드에서 Flow 구문을 사용할 수 있게 만듭니다.

>Note:
>
>Flow는 `react` 프리셋을 필수로하지 않지만 종종 함께 사용됩니다. Flow 자체가 JSX 구문을 이해할 수 있습니다.

#### 다른 빌드 셋업

만약 Create React App이나 Babel을 사용하지 않는다면 [flow-remove-types](https://github.com/flowtype/flow-remove-types) 을 사용해 주석을 벗겨낼 수 있습니다.

### Flow 동작시키기

위 지침을 따른 경우 처음부터 Flow를 싱핼할 수 있습니다.

```bash
yarn flow
```

npm을 사용한다면,

```bash
npm run flow
```

아래와 같은 메시지가 나옵니다.

```
No errors!
✨  Done in 0.17s.
```

### Flow 타입 주석 추가하기

기본적으로 Flow는 아래 주석이 포함된 파일만 체크합니다.

```js
// @flow
```

일반적으로는 파일 최상단에 둡니다. 프로젝트 안의 일부 파일에 추가하고 `yarn flow` 나 `npm run flow` 를 실행하여 Flow가 이미 문제를 발견했는 지 살펴보세요.

또한 주석에 상관없이 *모든* 파일을 강제로 검사하게 하는 [옵션](https://flow.org/en/docs/config/options/#toc-all-boolean)이 있습니다. 기존 프로젝트에서는 너무 많겠지만 Flow를 사용하여 모든 타입을 체크하려는 경우 새로운 프로젝트에서 적합합니다.

이제 모든 준비가 끝났습니다! Flow에 대해 자세히 알아보려면 다음 자료를 확인해보시길 바랍니다.

* [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
* [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
* [Flow Documentation: React](https://flow.org/en/docs/react/)
* [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)

## 타입스크립트 (TypeScript)

[타입스크립트 (TypeScript)](https://www.typescriptlang.org/) 는 Microsoft 가 개발한 프로그래밍 언어입니다. 타입스크립트는 자바스크립트이 타입 슈퍼셋이며 자체적인 컴파일러를 가지고 있습니다. 타입 언어이기 때문에 타입스크립트는 앱이 실행되기 훨씬 전에 빌드할 때 오류와 버그를 잡을 수 있습니다. 리액트와 타입스크립트를 사용하는 법에 대해서는 [여기](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter)서 살펴보세요.

타입스크립트를 사용하려면,
* 프로젝트의 의존성에 타입스크립트를 추가해야합니다
* 타입스크립트 컴파일 옵션을 설정합니다
* 올바른 파일 확장을 사용합니다
* 사용할 라이브러리의 정의를 추가합니다

더 자세히 살펴봅시다

### 프로젝트에 타입스크립트 추가하기
모든 일은 터미널에서 한 커맨드로 시작합니다.

[Yarn](https://yarnpkg.com/)을 사용한다면,

```bash
yarn add --dev typescript
```

[npm](https://www.npmjs.com/)을 사용한다면,

```bash
npm install --save-dev typescript
```

축하합니다! 프로젝트에 최신 버전 타입스크립트를 설치했습니다. 타입스크립트를 설치하면 `tsc` 커맨드에 접근할 수 있습니다. 설정하기 전에, `tsc` 를 `package.json` 의 "scripts" 섹션에 추가합니다.

```js{4}
{
  // ...
  "scripts": {
    "build": "tsc",
    // ...
  },
  // ...
}
```

### 타입스크립트 컴파일러 설정하기
컴파일러는 우리가 해야할 일을 말하기 전에는 도움이 되지 않습니다. 타입스크립트에서는 `tsconfig.json` 이라는 특별한 파일에서 규칙을 정의합니다. 이 파일을 생성하려면

```bash
tsc --init
```

새로이 생성된 `tsconfig.json` 을 보면 컴파일러를 설정할 때 사용하는 많은 옵션을 가지고 있습니다. 모든 옵션에 대한 더 상세한 설명은 [여기](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)를 참고하세요.

많은 옵션 중에 `rootDir` 과 `outDir` 을 살펴보려고 합니다. 진정한 의미에서 컴파일러는 타입스크립트 파일을 받아 자바스크립트 파일을 생성합니다. 그러나 우리는 소스 파일과 생성된 출력에 혼란을 겪지 않기를 원합니다.

우리는 이것을 두 단계로 다룹니다.
* 먼저 프로젝트 구조를 아래와 같이 바꿉니다. 소스 코드를 `src` 디렉토리 안에 넣습니다.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* 다음으로 소스 코드가 어디에 있고 어디에 출력되어야하는 지 컴파일러에 알릴 것입니다.

```js{6,7}
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

좋습니다! 이제 빌드스크립트를 동작시키면 컴파일러가 `build` 폴더 안에 생성된 자바스크립트를 둡니다. [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json)는 시작하기에 좋은 규칙 세트가 설정된 `tsconfig.json` 를 제공합니다.

일반적으로 생성된 자바스크립트를 소스 컨트롤에 두지 않으려면, `.gitignore` 에 build 폴더를 추가해야합니다.

### 파일 확장
React에서 대부분의 컴포넌트를 `.js` 파일로 작성할 것입니다. 타입스크립트에는 2가지 파일 확장이 있습니다.

`.ts` 는 기본 파일 확장이고 `.tsx` 는 `JSX` 를 포함하는 파일에 사용되는 특수한 확장입니다.

### 타입스크립트 실행하기

위 구조를 따랐다면 타입스크립트를 실행할 수 있습니다.

```bash
yarn build
```

만약 npm을 사용한다면,

```bash
npm run build
```

만약 아무런 출력이 없다면, 컴파일이 성공적으로 이루어졌다는 것입니다.


### 타입 정의
컴파일러는 다른 패키지의 오류 및 힌트를 나타내도록 선언 파일을 사용합니다. 선언 파일은 라이브러리에 대한 모든 타입 정보를 제공합니다. 이는 프로젝트에서 npm에 있는 것과 같은 자바스크립트 라이브러리를 사용할 수 있게 합니다.

라이브러리에서 선언하는 두가지 방법이 있습니다.

__Bundled__ - 라이브러리는 자신의 선언 파일을 번들합니다. 해야할 일은 라이브러리를 설치하는 일 뿐이므로 바로 사용할 수 있습니다. 라이브러리에 번들 타입이 있는 지 확인하려면 프로젝트 내의 `index.d.ts` 파일을 살펴보세요. 일부 라이브러리는 `typings` 혹은 `types` 필드 아래 `package.json` 에 정의됩니다.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped는 선언 파일을 번들하지 않는 라이브러리에 대한 거대한 저장소입니다. 선언은 Microsoft 및 오픈 소스 컨트리뷰터가 제공하는 크라우드 소스입니다. 예를 들어 React는 선언 파일을 번들하지 않습니다. 대신 DefinitelyTyped에서 가져올 수 있습니다. 이렇게 하려면 터미널에서 커맨드를 실행하세요.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
경우에 따라 사용하려는 패키지가 선언을 번들로 제공하지 않거나 DefinitelyTyped에서 사용할 수 없는 경우가 있습니다. 이 경우 로컬 선언 파일을 가질 수 있습니다. 이렇게 하려면 소스 디렉토리의 루트에 `declarations.d.ts` 파일을 생성합니다. 간단한 선언은 다음과 같습니다.

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

### Create React App에서 타입스크립트 사용하기

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) 는 타입스크립트를 지원하는 `create-react-app` 프로젝트를 자동으로 설정합니다. 다음과 같이 사용할 수 있습니다.

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

**서드 파티** 프로젝트임을 명심하십시오. Create React App의 일부가 아닙니다.

[typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter) 를 시도해볼 수도 있습니다.

이제 코드를 작성할 준비가 되었습니다! 타입스크립트에 대한 자세한 내용은 다음 리소스를 참조하십시오.

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](http://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason

[Reason](https://reasonml.github.io/) 은 새로운 언어가 아닙니다. battle-tested 언어인 [OCaml](http://ocaml.org/) 가 제공하는 새로운 구문 및 툴체인입니다. Reason은 OCaml에 자바스크립트 개발자에게 익숙한 구문을 제공하며 이미 알고있는 기존 NPM/Yarn 워크플로우를 지원합니다.

Reason은 페이스북이 개발하였으며 메신저같은 제품에 사용하고 있습니다. 아직 다소 실험적이지만 Facebook과 [활발한 커뮤니티](https://reasonml.github.io/community/)가 유지하는 [React 전용 바인딩](https://reasonml.github.io/reason-react/)이 있습니다.


## Kotlin

[Kotlin](https://kotlinlang.org/)은 JetBrains가 개발한 정적 타입 언어입니다. 타겟 플랫폼은 JVM, Android, LLVM, [자바스크립트](https://kotlinlang.org/docs/reference/js-overview.html)입니다.

JetBrains은 React 커뮤니티에서 여러가지 도구를 만들고 유지하고 있습니다. [React bindings](https://github.com/JetBrains/kotlin-wrappers) 뿐만 아니라 [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app)도 있습니다. 후자는 빌드 구성 없이 Kotlin으로 React 앱을 만드는 데 도움이 됩니다.

## 다른 언어

자바스크립트로 컴파일될 수 있는 다른 정적 언어는 React와 호환합니다. 예를 들어 [elmish-react](https://fable-elmish.github.io/react) 를 사용한 [F#/Fable](http://fable.io) 같은 것들이 있습니다. 자세한 내용은 해당 사이트를 참고하십시오. 이 페이지에 React에서 사용할 수 있는 정적 타입 언어를 자유로이 추가하세요.