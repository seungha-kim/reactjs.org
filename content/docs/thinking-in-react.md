---
id: thinking-in-react
title: React 방식으로 생각하기
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

우리는 React 는 규모가 크고 빠른 웹 어플리케이션을 자바스크립트로 개발 할 때 최고의 방법이라고 생각합니다. Facebook 과 Instagram도 React를 사용했고, 앱들이 커질때 유용했습니다.

React에는 여러 멋진 면이 있는데, 그 중 하나는 앱을 만드는 과정을 거치는 동안에 여러분이 특별한 사고방식을 갖도록 만든다는 것입니다. 이 문서에서는 React 를 사용하여 검색 가능한 상품 데이터 표를 만들 때 어떠한 생각 흐름으로 진행이 되는지 알아보겠습니다.

## 가짜 데이터로 시작하기

우리가 이미 JSON API 와 디자이너의 디자인이 이미 주어졌다고 상상해보세요. 시안은 다음과 같이 생겼습니다:

![Mockup](../images/blog/thinking-in-react-mock.png)

우리의 JSON API 는 다음과 같은 데이터를 반환 합니다:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## 1단계: UI 를 컴포넌트 계층으로 분리하기

여러분들이 가장 먼저 해야 할 것은 시안을 보고 각 컴포넌트(와 서브 컴포넌트) 에 박스를 그리고 이름을 지어주는 것 입니다. 만약에 당신이 디자이너와 함께 일을 한다면, 이 작업을 디자이너분이 이미 했을 수도 있으니, 한번 물어보세요. 디자이너가 작업한 포토샵 레이어 명이 여러분의 컴포넌트 이름이 될 수도 있습니다!

하지만, 어떤 것들을 컴포넌트로 만들어주어야 할지 어떻게 알 수 있을까요? 그냥 여러분이 새 함수나 객체를 만들지 말지 결정할 때 사용하는 기준을 그대로 적용하세요. 그 기준 중 하나는 [single responsibility principle(단일 책임 원칙)](https://en.wikipedia.org/wiki/Single_responsibility_principle)입니다. 즉, 컴포넌트가 한 가지의 작업만 하도록 만드는 것이 이상적입니다. 컴포넌트가 책임지는 작업이 늘어난다면, 이는 더 작은 서브컴포넌트들로 분리되어야 합니다.

주로 여러분들은 유저에게 JSON 데이터 모델을 보여주게 됩니다. 만약에 모델이 제대로 만들어져있다면, UI (그리고 여러분의 컴포넌트 구조)도 잘 매핑 될 것입니다. 그 이유는 UI 와 데이터 모델은 보통 *information architecture(정보 구조)*와 서로 깊게 연관이 되어있기 때문입니다. 그렇기 때문에, 이 UI 를 컴포넌트로 세부화시키는 것은 대부분 그렇게 대단한 일은 아닙니다. 그냥 각 컴포넌트가 데이터 모델의 한 조각을 나타내도록 분리시키세요.

![Component diagram](../images/blog/thinking-in-react-components.png)

여기서 우리의 간단한 앱에서 사용할 다섯 개의 컴포넌트를 보게 될 것입니다. 각 컴포넌트가 나타내는 데이터를 이탤릭체로 표기했습니다.

  1. **`FilterableProductTable` (오렌지색):** 예제 전부를 포함하는 컴포넌트
  2. **`SearchBar` (파랑색):** 모든 *사용자 입력*을 받는 컴포넌트
  3. **`ProductTable` (초록색):** *사용자 입력*으로부터 생성된 *데이터 모음*을 표시하고, 필터링하는 컴포넌트
  4. **`ProductCategoryRow` (청록색):** 각 *category*의 제목을 표시하는 컴포넌트
  5. **`ProductRow` (빨강색):** 각 *product*에 대한 행을 표시하는 컴포넌트

`ProductTable`를 보면, "Name"과 "Price"를 포함하고 있는 테이블 제목 부분을 표시하기 위한 별도의 컴포넌트가 없다는 사실을 확인할 수 있습니다. 이것은 선호의 문제이며, 어느 쪽을 선택할 지는 경우에 따라 다릅니다. 이 예제에서는, 제목을 `ProductTable`의 일부로 남겨두었는데, 이 작업이 데이터 모음을 렌더링하는 `ProductTable`의 책임의 일부이기 때문입니다. 다만, 제목 부분이 복잡해지는 경우(정렬을 위한 UI를 추가한다거나)에는 제목을 위한 `ProductTableHeader` 컴포넌트를 만드는 것이 더 합리적인 선택이라고 할 수 있습니다.

우리의 시안에서 컴포넌트를 이끌어냈으니, 이제 이것들을 계층 구조로 만들어봅시다. 이건 쉽습니다. 우리의 시안에서 다른 컴포넌트의 내부에 표시되는 컴포넌트는 아래 계층 구조에서 자식으로 표현되고 있습니다:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## 2단계: React를 이용해 정적버전 만들기

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a>를 살펴보세요.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

이제 컴포넌트 계층 구조가 만들어졌으니, 앱을 실제로 구현해 볼 시간입니다. 가장 쉬운 방법은 데이터 모델을 가지고 UI를 렌더링하긴 하지만 상호작용은 전혀 없는 버전을 만들어 보는 것입니다. 이렇게 과정을 나누는 것이 좋은데, 정적 버전을 만드는 작업은 많은 타이핑을 필요로 하지만 큰 고민 없이 만들 수 있고, 상호 작용을 만드는 작업은 많은 생각을 필요로 하지만 타이핑에 드는 수고가 크기 않기 때문입니다. 앞으로 그 이유에 대해서 살펴볼 것입니다.

위의 데이터 모델을 렌더링하는 앱의 정적 버전을 만들기 위해서, 다른 컴포넌트를 재사용하는 컴포넌트를 만들고 *props*를 이용해 데이터를 넘겨주는 것이 좋습니다. *props*는 부모가 자식에게 데이터를 넘겨줄 때 쓸 수 있는 한 가지 방법입니다. 만약 *state*에 대해 알고 계시다면, 정적 버전을 만들 때는 **state를 일절 사용하지 마세요.** state는 오직 상호작용을 위해서, 다시 말해 시간이 흐르면서 변하는 데이터를 위해서만 사용하도록 남겨두어야 합니다. 지금 만드는 것은 정적 버전이기 때문에, state를 필요로 하지 않습니다.

앱을 만들 때, 하향식(top-down), 혹은 상향식(bottom-up)으로 만들 수 있습니다. 다시 말해, 계층 구조의 상층부에 있는 컴포넌트(`FilterableProductTable`)부터 시작할 수도 있고 하층부에 있는 컴포넌트(`ProductRow`)부터 시작할 수도 있습니다. 간단한 예제같은 경우는 대개 하향식으로 만드는 것이 쉽지만, 큰 프로젝트의 경우는 상향식으로 만들면서 만든 것을 바로 테스트하는 식으로 개발을 하는 것이 더 쉽습니다.

이 단계를 마치면 여러분은 데이터 렌더링을 위해 만들어진, 재사용 가능한 컴포넌트들의 라이브러리를 갖게 될 것입니다. 이 컴포넌트들은 오로지 `render()` 메소드만을 갖게 될 것인데, 이는 지금 우리가 만드는 것이 앱의 정적 버전이기 때문입니다. 계층 구조의 최상단에 있는 컴포넌트(`FilterableProductTable`)는 데이터 모델을 prop으로 받게 될 것입니다. 데이터 모델에 변경을 가한 뒤 `ReactDOM.render()`을 다시 호출하면, UI가 갱신될 것입니다. 어느 곳을 고쳐서 어떻게 UI가 갱신되는지 확인하는 일은 어렵지 않은데, 현재로서는 크게 복잡한 부분이 없기 때문입니다. React의 **단방향 데이터 흐름**(다른 말로는 *단방향 바인딩*)은 앱을 모듈화하기 좋게, 또 빠르게 동작하게 만들어줍니다.

이 단계를 실행해보는 데 도움이 필요하다면 [React 문서](/docs/)를 참고하세요.

### 짧은 소개: Props vs State

React에는 두 가지 형태의 데이터 "모델"이 있습니다: prop과 state가 그것입니다. 이 둘 사이의 차이점을 이해하는 것은 중요합니다; 만약 그 차이점이 무엇인지 명확히 생각이 나지 않는다면 [React 공식 문서](/docs/interactivity-and-dynamic-uis.html)를 훑어보세요.

## 3단계: UI 상태에 대한 최소한의 (그러나 완전한) 표현 찾아내기

UI를 상호작용 가능하게 만들려면, 기반 데이터 모델에 변경을 가할 수 있는 방법이 있어야 합니다. 이를 위해 React의 **state**를 사용하면 됩니다.

앱을 올바르게 만들기 위해서는, 먼저 앱이 필요로 하는 최소한의 "변경 가능한 상태"를 고민해야 할 필요가 있습니다. 여기서 유념해야 할 것은 [DRY(Don't Repeat Yourself)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)입니다. 여러분의 어플리케이션이 필요로 하는 상태를 완전한 형태로, 그러나 가장 작은 형태로 표현할 방법을 찾아내고, 다른 모든 것들은 필요할 때 상태로부터 계산해내세요. 예를 들어, 여러분이 할일 리스트를 만든다고 하면, 할일 항목을 저장하는 배열만 유지하고, 할일 갯수를 저장하는 상태를 별도로 두지 마세요. 대신, 할일 갯수를 렌더링할 필요가 생기면, 그냥 할일 배열의 길이를 가져다 쓰세요.

우리의 예제 어플리케이션에서 필요로 하는 모든 데이터를 생각해보세요. 다음과 같을 것입니다:

  * 제품 목록의 원본
  * 사용자가 입력한 검색 텍스트
  * 체크박스의 체크 여부
  * 필터링 된 제품 목록

각각을 살펴보고 어떤 것이 state가 되어야 할지 결정해봅시다. 일단 각각의 데이터에 대해 아래 세 가지 질문에 답해보세요:

  1. 부모가 prop을 통해 넘겨주는 데이터인가요? 만약 그렇다면, 그것은 state가 아닐 겁니다.
  2. 시간이 지나도 변하지 않나요? 만약 그렇다면, 그것은 state가 아닐 겁니다.
  3. 컴포넌트 내의 다른 state나 prop으로부터 계산될 수 있는 것인가요? 만약 그렇다면, 그것은 state가 아닙니다.

제품 목록의 원본은 prop을 통해 넘어오기 때문에, state가 아닙니다. 검색 텍스트와 체크박스는 state로 볼 수 있는데, 이것들이 시간이 지남에 따라 변하기도 하고 또 다른 것들로부터 계산될 수 있는 값이 아니기 때문입니다. 마지막으로, 필터링 된 제품 목록은 state가 아닌데, 제품 목록의 원본과 검색 텍스트, 체크박스의 값을 조합해서 계산해낼 수 있기 때문입니다.

결국, 우리의 state는 다음과 같습니다:

  * 사용자가 입력한 검색 텍스트
  * 체크박스의 체크 여부

## 4단계: 상태가 어디에 있어야 할 지 결정하기

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a>를 살펴보세요.</p>

우리는 앱의 상태에 대한 최소한의 표현을 찾아냈습니다. 다음으로는 어떤 컴포넌트가 상태를 변경, 혹은 *소유*할 지를 결정해야 합니다.

기억하세요: React는 항상 컴포넌트 계층 구조를 통해 밑으로 내려가는 단방향 데이터 흐름을 따릅니다. 어떤 컴포넌트가 어떤 상태를 가져야 하는지 바로 결정하기 어려울 수 있습니다. **많은 초보자들이 이 부분을 가장 이해하기 어려워합니다.** 아래의 과정을 따라해보세요:

여러분의 어플리케이션이 가지는 각각의 상태에 대해서:

  * 상태에 기반해 렌더링을 하는 모든 컴포넌트를 찾아내세요.
  * 공통 소유자 컴포넌트(common owner component)를 찾으세요. (계층 구조 내에서 특정 상태를 필요로 하는 모든 다른 컴포넌트들의 위에 있는 하나의 컴포넌트)
  * 공통 소유자 혹은 더 위에 있는 컴포넌트가 상태를 가져야 합니다.
  * 상태를 소유할 적절한 컴포넌트를 찾지 못했다면, 단순히 상태를 소유하는 컴포넌트를 하나 만들어서 공통 소유자 컴포넌트의 상층부에 그것을 추가하세요.

이 전략을 우리의 어플리케이션에 적용해봅시다:

  * `ProductTable`는 상태에 기반해 제품 목록을 필터링해야 하고 `SearchBar`는 검색 텍스트와 체크박스의 상태를 표시해주어야 합니다.
  * 공통 소유자 컴포넌트는 `FilterableProductTable`입니다.
  * 의미상으로도 `FilterableProductTable`이 검색 텍스트와 체크박스의 체크 여부를 갖는 것이 타당합니다.

좋습니다. 이제 우리는 상태를 `FilterableProductTable` 내부에 두기로 결정했습니다. 먼저, `FilterableProductTable`의 `constructor` 메소드에 `this.state = {filterText: '', inStockOnly: false}`와 같이 인스턴스 속성을 추가해서 어플리케이션의 초기 상태를 반영하도록 하세요. 그리고 나서, `ProductTable`과 `SearchBar`에 `filterText`와 `inStockOnly`를 `prop`으로 넘겨주세요. 마지막으로, 이 `prop`들을 사용해 `ProductTable`의 행을 필터링하고 `SearchBar`의 입력 필드의 값을 지정하세요.

이제 여러분의 어플리케이션이 어떻게 동작하는지 확인해볼 수 있습니다. `filterText`를 `"ball"`로 설정하고 앱을 새로고침 해보세요. 데이터 표가 잘 갱신된 것을 확인할 수 있을 것입니다.

## 5단계: 역방향 데이터 흐름 추가하기

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a>를 살펴보세요.</p>

이제까지 우리는 계층 구조의 아래로 흐르는 prop과 state에 대한 함수로서의 앱을 만들었습니다. 이제 다른 방향으로의 데이터 흐름을 만들어 볼 시간입니다: 계층 구조의 깊숙한 곳에 있는 폼 컴포넌트에서 `FilterableProductTable`의 state를 갱신할 수 있어야 합니다.

React는 이러한 데이터 흐름을 명시적으로 보이게끔 만들어서 프로그램이 어떻게 동작하는지를 쉽게 파악할 수 있도록 해주지만, 전통적인 양방향 데이터 흐름과 비교했을 때 조금 더 많은 타이핑을 필요로 합니다.

지금 버전의 예제에서 타이핑을 하거나 체크박스에 체크를 하려고 하면, React가 사용자의 입력을 무시하는 것을 확인할 수 있을 것입니다. 이는 의도적인 것인데, `FilterableProductTable`에서 넘어온 `state`가 `input`의 `value` prop과 언제나 같기 때문입니다.

우리가 어떤 일이 일어나기를 바라는 것인지 생각해봅시다. 우리는 사용자가 폼을 변경할 때마다, 사용자의 입력을 반영하도록 state를 갱신하기를 원합니다. 컴포넌트는 그 자신의 state만 변경할 수 있기 때문에, `FilterableProductTable`는 `SearchBar`에 콜백을 넘겨서 state가 갱신되어야 할 때마다 호출되도록 할 것입니다. 우리는 입력 필드에 `onChange` 이벤트를 사용해서 알림을 받을 수 있습니다. `FilterableProductTable`에 의해 넘겨진 콜백은 `setState()`을 호출할 것이고, 그에 따라 앱이 갱신될 것입니다.

복잡하게 들리지만, 이것은 정말 단지 몇 줄의 코드에 불과합니다. 그리고 앱 전체적으로 데이터가 흘러다니는 모습을 매우 명시적으로 볼 수 있습니다.

## 이게 전부입니다.

이 글을 통해 여러분들이 React를 가지고 컴포넌트와 어플리케이션을 만드는 데 대한 사고방식을 얻어갈 수 있기를 바랍니다. 이 방식은 여러분들이 이제까지 해왔던 것보다 조금 더 많은 타이핑을 필요로 할 수는 있지만, 코드를 쓸 일보다 읽을 일이 훨씬 더 많다는 사실을 기억하세요. 모듈화되고 명시적인 코드는 정말 읽기가 쉬워집니다. 큰 컴포넌트 라이브러리를 만들게 된다면, 여러분은 이 명시성과 모듈성에 고마워하게 될 것입니다. 또한 코드 재사용을 통해 코드의 양이 줄어들기 시작할 것입니다. :)
