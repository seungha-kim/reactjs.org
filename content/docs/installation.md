---
id: installation
title: 설치
permalink: docs/installation.html
redirect_from:
  - "download.html"
  - "downloads.html"
  - "docs/tooling-integration.html"
  - "docs/package-management.html"
  - "docs/language-tooling.html"
  - "docs/environments.html"
next: hello-world.html
---

React는 유연하며 다양한 프로젝트에 사용될 수 있습니다. React로 새로운 앱을 만들 수도 있고, 이미 사용 중인 기반 코드를 재작성하지 않고도 단계적으로 React를 도입할 수도 있습니다.

여러분이 원하는 바에 가장 부합하는 선택지는 무엇인가요? 

* [React 시작하기](#trying-out-react)
* [새 앱 만들기](#creating-a-new-application)
* [기존 앱에 React 추가하기](#adding-react-to-an-existing-application)

## React 시작하기

단순히 관심이 있어서 React를 다뤄보고 싶다면 CodePen을 사용할 수 있습니다. [Hello World 예제 코드](http://codepen.io/gaearon/pen/rrpgNB?editors=0010)로 시작해보세요. 아무 것도 설치하지 않아도 되며, 코드를 수정하기만 하면 바로 동작하는 걸 볼 수 있습니다.

만약 텍스트 에디터에서 사용하기를 원한다면, [이 HTML 파일을 다운](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) 받을 수 있으며, 수정한 후 로컬 파일시스템에서 열어서 브라우저에서 확인 가능합니다. 느린 런타임 코드 변환을 하므로 프로덕션 환경에서는 사용하지 마십시오.

만약 전체 어플리케이션을 만들기 위해 사용하고 싶다면, React를 시작하기 위한 두 유명한 방법이 있습니다.
Create React App을 사용하거나, 이미 존재하는 어플리케이션에 추가하는 것입니다.

## Creating a New Application

[Create React App](http://github.com/facebookincubator/create-react-app)은 새 React 싱글 페이지 어플리케이션 만들기를 시작하기 위한 최고의 방법입니다. 최신 자바스크립트 기능을 사용할 수 있게 개발 환경을 세팅해주어, 좋은 개발자 경험을 사용하며, 프로덕션 앱을 위한 최적화도 진행합니다. 기기에 Node >= 6 이상이 필요합니다.

```bash
npm install -g create-react-app
create-react-app my-app

cd my-app
npm start
```

만약 npm 5.2.0+를 설치했다면, [npx](https://www.npmjs.com/package/npx)를 대신 사용할 수 있습니다.

```bash
npx create-react-app my-app

cd my-app
npm start
```

Create React App은 backend 로직이나 데이터베이스를 제어할 수 없습니다. Create React App은 frontend 빌드 파이프라인만 생성하기 때문에 backend를 원하는 대로 사용할 수 있습니다. Create React App은 [Babel](http://babeljs.io/)이나 [webpack](https://webpack.js.org/)같은 빌드 도구를 사용하나, 설정 없이도 동작합니다.

프로덕션을 배포할 준비가 되었을 때, `npm run build` 를 실행하면 `build` 폴더 안에 제작한 앱의 최적화된 빌드를 생성합니다. [Create React App README](https://github.com/facebookincubator/create-react-app#create-react-app-)나 [유저 가이드](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents)에서 더 자세한 사항을 볼 수 있습니다.

## 기존 앱에 React 추가하기

React를 사용하기 위해 앱을 다시 작성할 필요는 없습니다.

개별 Widget 같이 어플리케이션의 작은 부분부터 React를 추가하는 걸 권장하며 사용 사례에 맞게 동작하는 지 확인할 수 있습니다.

React는 빌드 파이프라인 없이도 [사용이 가능](/docs/react-without-es6.html)하지만, 생산성을 높이기 위해서는 설정하는 것을 권장합니다. 모던 빌드 파이프라인은 보통 다음과 같이 구성됩니다.

* **패키지 매니저** 에는 [Yarn](https://yarnpkg.com/) 이나 [npm](https://www.npmjs.com/) 같은 게 있습니다. 패키지 매니저는 third-party 패키지의 방대한 생태계를 활용할 수 있게 하며, 쉽게 설치하고 업데이트 할 수 있게 합니다.
* **번들러** 에는 [webpack](https://webpack.js.org/) 이나 [Browserify](http://browserify.org/) 같은 게 있습니다. 번들러는 코드를 모듈방식으로 작성할 수 있게 하고 이를 작은 패키지로 묶어서 로딩 시간을 최적화 할 수 있습니다.
* **컴파일러** 에는 [Babel](http://babeljs.io/)이 있습니다. 컴파일러는 모던 자바스크립트 코드를 작성해도 오래된 브라우저에서 동작할 수 있게 해줍니다.

### React 설치하기

>**Note:**
>
> 설치가 완료되면 프로덕션 환경에서 React의 빠른 버전을 사용하도록 [프로덕션 빌드 프로세스](/docs/optimizing-performance.html#use-the-production-build) 를 설정하는 걸 강력히 권장합니다.

프론트엔드 의존성을 관리하기 위해 [Yarn](https://yarnpkg.com/) 이나 [npm](https://www.npmjs.com/) 을 사용하는 걸 권장합니다. 만약 패키지 매니저를 처음 사용한다면, [Yarn 문서](https://yarnpkg.com/en/docs/getting-started) 가 시작하기에 좋은 가이드가 될 것입니다.

Yarn을 이용해 React를 설치할 수 있습니다.

```bash
yarn init
yarn add react react-dom
```

To install React with npm, run:

```bash
npm init
npm install --save react react-dom
```

Yarn과 npm 둘다 [npm registry](http://npmjs.com/) 에서 패키지를 다운로드합니다.

### ES6와 JSX 사용하기

React를 사용할 때 [Babel](http://babeljs.io/) 과 함께 사용하여 자바스크립트 코드에서 ES6와 JSX를 사용하는 걸 권장합니다. ES6는 개발을 쉽게 만드는 모던 자바스크립트 기능의 집합이며 JSX는 React에서 잘 동작하는 JavaScript 언어 확장입니다.

[Babel 설정 설명](https://babeljs.io/docs/setup/) 에서 여러 빌드 환경에서 Babel을 어떻게 설정하는 지 설명합니다.
[`babel-preset-react`](http://babeljs.io/docs/plugins/preset-react/#basic-setup-with-the-cli-) 및
[`babel-preset-env`](http://babeljs.io/docs/plugins/preset-env/) 을 설치하고
[`.babelrc` configuration](http://babeljs.io/docs/usage/babelrc/) 에서 사용 가능하도록 설정했는 지 확인하십시오.

### ES6와 JSX로 시작하는 Hello World
[webpack](https://webpack.js.org/) 이나 [Browserify](http://browserify.org/) 같은 번들러를 사용하는 걸 권장하며, 그렇게 하면 코드를 모듈방식으로 작성할 수 있게 하고 이를 작은 패키지로 묶어서 로딩 시간을 최적화 할 수 있습니다.

가장 작은 React 예제는 다음과 같습니다.

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

이 코드는 `root` 라는 id를 가진 DOM 요소에 렌더링 되므로, `<div id="rood"></div>` 가 HTML 파일 내 어디에든 필요합니다.

비슷하게, 다른 자바스크립트 UI 라이브러리로 작성된 기존 앱 내부의 DOM 요소 내부에 React 컴포넌트를 렌더링할 수도 있습니다.

[기존 코드에 React를 도입하는 법에 대해 더 자세히 알아봅시다.](/docs/integrating-with-other-libraries.html#integrating-with-other-view-libraries)

### 개발 및 프로덕션 버전

기본적으로, React는 많은 도움이 되는 경고를 포함하고 있습니다. 이러한 경고들은 개발 단계에서 많은 도움이 됩니다.

**그러나, 그러한 경고들이 React의 개발 버전을 크고 느리게 만들기 때문에 앱을 배포할 때는 프로덕션 버전을 사용해야 합니다.**

[웹사이트가 올바른 버전의 React를 제공하고 있는 지 확인하는 방법](/docs/optimizing-performance.html#use-the-production-build) 과 프로덕션 빌드 프로세스를 가장 효율적으로 구성하는 방법에 대해 알아보세요.

* [Creating a Production Build with Create React App](/docs/optimizing-performance.html#create-react-app)
* [Creating a Production Build with Single-File Builds](/docs/optimizing-performance.html#single-file-builds)
* [Creating a Production Build with Brunch](/docs/optimizing-performance.html#brunch)
* [Creating a Production Build with Browserify](/docs/optimizing-performance.html#browserify)
* [Creating a Production Build with Rollup](/docs/optimizing-performance.html#rollup)
* [Creating a Production Build with webpack](/docs/optimizing-performance.html#webpack)

### CDN 사용하기

npm을 사용한 클라이언트 패키지 관리를 하지 않으려는 경우, `react` 와 `react-dom` npm 패키지는 CDN에서 호스트되는 `umd` 폴더에 단일 파일 배포를 제공합니다.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

위 버전은 개발 용도로만 사용해야하며, 프로덕션에는 적절하지 않습니다. React의 최적화된 프로덕션 버전은 다음과 같이 사용할 수 있습니다.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

`react` 나 `react-dom` 의 특정 버전을 불러오고 싶다면, `16` 을 원하는 버전의 숫자로 바꾸면 됩니다.

만약 Bower를 사용한다면, React는 `react` 패키지를 통해 사용할 수 있습니다.

#### `crossorigin` 속성이 왜 존재하나요?

만약 React를 CDN으로 제공한다면, [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 속성을 주는 걸 권장합니다.

```html
<script crossorigin src="..."></script>
```

또한 사용 중인 CDN이 `Access-Control-Allow-Origin: *` HTTP 헤더를 설정했는 지 확인해야합니다.

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

이 설정이 React 16과 그 이후 버전에서 더 나은 [에러 처리 경험](/blog/2017/07/26/error-handling-in-react-16.html) 을 제공합니다.