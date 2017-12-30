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

## TypeScript

[TypeScript](https://www.typescriptlang.org/) is a programming language developed by Microsoft. It is a typed superset of JavaScript, and includes its own compiler. Being a typed language, Typescript can catch errors and bugs at build time, long before your app goes live. You can learn more about using TypeScript with React [here](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

To use TypeScript, you need to:
* Add Typescript as a dependency to your project
* Configure the TypeScript compiler options
* Use the right file extensions
* Add definitions for libraries you use

Let's go over these in detail.

### Adding TypeScript to a Project
It all begins with running one command in your terminal.

If you use [Yarn](https://yarnpkg.com/), run:

```bash
yarn add --dev typescript
```

If you use [npm](https://www.npmjs.com/), run:

```bash
npm install --save-dev typescript
```

Congrats! You've installed the latest version of TypeScript into your project. Installing TypeScript gives us access to the `tsc` command. Before configuration, let's add `tsc` to the "scripts" section in our `package.json`:

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

### Configuring the TypeScript Compiler
The compiler is of no help to us until we tell it what to do. In TypeScript, these rules are defined in a special file called `tsconfig.json`. To generate this file run:

```bash
tsc --init
```

Looking at the now generated `tsconfig.json`, you can see that there are many options you can use to configure the compiler. For a detailed description of all the options, check [here](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

Of the many options, we'll look at `rootDir` and `outDir`. In its true fashion, the compiler will take in typescript files and generate javascript files. However we don't want to get confused with our source files and the generated output.

We'll address this in two steps:
* Firstly, let's arrange our project structure like this. We'll place all our source code in the `src` directory.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

* Next, we'll tell the compiler where our source code is and where the output should go.

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

Great! Now when we run our build script the compiler will output the generated javascript to the `build` folder. The [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json) provides a `tsconfig.json` with a good set of rules to get you started.

Generally, you don't want to keep the generated javascript in your source control, so be sure to add the build folder to your `.gitignore`.

### File extensions
In React, you most likely write your components in a `.js` file. In TypeScript we have 2 file extensions:

`.ts` is the default file extension while `.tsx` is a special extension used for files which contain `JSX`.

### Running TypeScript

If you followed the instructions above, you should be able to run TypeScript for the first time.

```bash
yarn build
```

If you use npm, run:

```bash
npm run build
```

If you see no output, it mean's that it completed successfully.


### Type Definitions
To be able to show errors and hints from other packages, the compiler relies on declaration files. A declaration file provides all the type information about a library. This enables us to use javascript libraries like those on npm in our project. 

There are two main ways to get declarations for a library:

__Bundled__ - The library bundles it's own declaration file. This is great for us, since all we need to do is install the library, and we can use it right away. To check if a library has bundled types, look for an `index.d.ts` file in the project. Some libraries will have it specified in their `package.json` under the `typings` or `types` field.

__[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)__ - DefinitelyTyped is a huge repository of declarations for libraries that don't bundle a declaration file. The declarations are crowd-sourced and managed by Microsoft and open source contributors. React for example doesn't bundle it's own declaration file. Instead we can get it from DefinitelyTyped. To do so enter this command in your terminal.

```bash
# yarn
yarn add --dev @types/react

# npm
npm i --save-dev @types/react
```

__Local Declarations__
Sometimes the package that you want to use doesn't bundle declarations nor is it available on DefinitelyTyped. In that case, we can have a local declaration file. To do this, create a `declarations.d.ts` file in the root of your source directory. A simple declaration could look like this:

```typescript
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```

### Using TypeScript with Create React App

[react-scripts-ts](https://www.npmjs.com/package/react-scripts-ts) automatically configures a `create-react-app` project to support TypeScript. You can use it like this:

```bash
create-react-app my-app --scripts-version=react-scripts-ts
```

Note that it is a **third party** project, and is not a part of Create React App.

You can also try [typescript-react-starter](https://github.com/Microsoft/TypeScript-React-Starter#typescript-react-starter).

You are now ready to code! We recommend to check out the following resources to learn more about Typescript:

* [TypeScript Documentation: Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript Documentation: Migrating from Javascript](http://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
* [TypeScript Documentation: React and Webpack](http://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

## Reason

[Reason](https://reasonml.github.io/) is not a new language; it's a new syntax and toolchain powered by the battle-tested language, [OCaml](http://ocaml.org/). Reason gives OCaml a familiar syntax geared toward JavaScript programmers, and caters to the existing NPM/Yarn workflow folks already know.

Reason is developed at Facebook, and is used in some of its products like Messenger. It is still somewhat experimental but it has [dedicated React bindings](https://reasonml.github.io/reason-react/) maintained by Facebook and a [vibrant community](https://reasonml.github.io/community/).

## Kotlin

[Kotlin](https://kotlinlang.org/) is a statically typed language developed by JetBrains. Its target platforms include the JVM, Android, LLVM, and [JavaScript](https://kotlinlang.org/docs/reference/js-overview.html). 

JetBrains develops and maintains several tools specifically for the React community: [React bindings](https://github.com/JetBrains/kotlin-wrappers) as well as [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app). The latter helps you start building React apps with Kotlin with no build configuration.

## Other Languages

Note there are other statically typed languages that compile to JavaScript and are thus React compatible. For example, [F#/Fable](http://fable.io) with [elmish-react](https://fable-elmish.github.io/react). Check out their respective sites for more information, and feel free to add more statically typed languages that work with React to this page!
