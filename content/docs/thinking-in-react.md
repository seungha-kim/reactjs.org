---
id: thinking-in-react
title: React스럽게 생각하기
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React는 규모가 크고 빠른 웹 어플리케이션을 자바스크립트로 만들 때 최고의 방법이라고 생각합니다. Facebook과 Instagram도 React를 사용하였으며 앱이 커질 때 아주 유용했습니다.

React의 여러 멋진 점 중 하나는 앱을 만들면서 앱에 대한 생각을 만든다는 것입니다. 이 문서에서는 React를 사용하여 검색가능한 상품 데이터 테이블을 만들 때 어떤 생각 프로세스를 통하는 지 살펴봅니다.

## 모형 (Mock)으로 시작하기

이미 JSON API와 디자이너에게 받은 모형이 있다고 생각해봅시다. 모형은 이렇게 보입니다.

![Mockup](../images/blog/thinking-in-react-mock.png)

JSON API는 아래와 같은 몇몇 데이터를 반환합니다.

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

## 1단계: UI를 컴포넌트 계층으로 분리하기

가장 먼저 해야할 일은 모형의 각 컴포넌트 (와 서브컴포넌트)에 박스를 그리고 이름을 지어주는 것입니다. 만약 디자이너와 함께 일한다면 디자이너가 이미 이 작업을 끝냈을 수 있으니 한번 물어보세요! 디자이너의 포토샵 레이어 이름이 React 컴포넌트의 이름이 될 수도 있습니다.

그러나 어떤 것들을 컨포넌트로 만들어야할 지 어떻게 알 수 있을까요? 그냥 새 함수나 객체를 만들 지 말 지 결정하는 기준을 그대로 적용하세요. 그런 테크닉 중 하나는 [단일 책임 원칙 (single responsibility principle)](https://en.wikipedia.org/wiki/Single_responsibility_principle) 이며, 이는 컴포넌트가 한가지의 작업만 하는 것이 이상적이라는 것입니다. 컴포넌트가 점점 커진다면 작은 서브컴포넌트들로 분리되어야합니다.

주로 JSON 데이터 모델을 유저에게 보여주게 되며, 만약 모델이 제대로 만들어져 있다면 UI (그리고 컴포넌트 구조도)는 제대로 매핑될 것입니다. 그 이유는 UI와 데이터 모델은 보통 *인포메이션 아키텍쳐 (information architecture)* 와 서로 깊게 연관되어있기 때문이며, 이 말은 UI를 컴포넌트로 세부화 시키는 것이 대부분 그렇게 대단한 일이 아니라는 것입니다. 각 컴포넌트가 데이터 모델의 한 조각을 나타내도록 분리하면 됩니다.

![Component diagram](../images/blog/thinking-in-react-components.png)

다섯개의 컴포넌트로 이루어진 간단한 앱을 하나 살펴봅시다. 각 컴포넌트가 표시하는 데이터를 이탤릭체로 표기했습니다.

  1. **`FilterableProductTable` (orange):** 예제 전체를 포함합니다
  2. **`SearchBar` (blue):** 모든 *유저 입력 (user input)* 을 받습니다
  3. **`ProductTable` (green):** *유저 입력 (user input)* 을 기반으로 *데이터 콜렉션 (data collection)* 을 필터해서 보여줍니다.
  4. **`ProductCategoryRow` (turquoise):** 각 *category* 의 헤딩을 보여줍니다
  5. **`ProductRow` (red):** 각 *product* 행을 보여줍니다.

`ProductTable` 을 보면 "Name" 과 "Price" 레이블을 포함한 테이블 헤더는 해당 컴포넌트에 존재하지 않습니다. 이 건 선호의 문제이며 어느 쪽으로 선택할 지는 결정에 따릅니다. 이 예제에서는 `ProductTable` 이 `ProductTable` 의 책임인 *데이터 콜렉션* 렌더링의 일부이기 때문에 `ProductTable` 을 남겨두었습니다. 그러나 이 헤더가 복잡해지면 (즉 정렬을 위한 어포던스를 추가하는 등) 이 자체의 `ProductTableHeader` 컴포넌트를 만드는 것이 더 합리적일 것입니다.

이제 모형에서 컴포넌트를 확인하였으므로 이를 계층 구조로 나열해봅시다. 이 작업은 쉽습니다. 모형의 다른 컴포넌트에서 나타나는 컴포넌트는 계층 구조의 자식으로 나타냅니다.

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## 2단계: React를 이용해 정적버전 만들기

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a>를 살펴보세요.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

이제 컴포넌트 계층구조가 만들어졌으니 앱을 실제로 구현해볼 시간입니다. 가장 쉬운 방법은 데이터 모델을 가지고 UI를 렌더링은 하지만 아무 동작도 하지 않는 버전을 만들어보는 것입니다. 이렇게 과정을 나누는 것이 좋은데 정적 버전을 만드는 것은 생각은 적게 필요하지만 타이핑은 많이 필요로 하고, 상호작용을 만드는 것은 생각은 많이 해야하지만 타이핑은 적게 필요로 하기 때문입니다. 나중에 더 살펴봅시다.

데이터 모델을 렌더하는 앱의 정적 버전을 만들기 위해 다른 컴포넌트를 재사용하는 컴포넌트를 만들고 *props* 를 이용해 데이터를 전달해줍니다. *props* 는 부모가 자식에게 데이터를 넘겨줄 떄 사용할 수 있는 방법입니다. 만약 *state* 에 대해 알고 있다면 정적 버전을 만들기 위해 **state를 일정 사용하지 마세요** . state는 오직 상호작용을 위해, 즉 시간이 지남에 따라 데이터가 바뀌는 것에서 사용합니다. 앱의 정적 버전을 만들 때에는 필요없습니다.

앱을 만들 때 하향식 (top-down)이나 상향식 (bottom-up)으로 만들 수 있습니다. 다시 말해 계층 구조의 상층부에 있는 컴포넌트 (즉 `FilterableProductTable` 부터 시작합니다)부터 만들거나 하층부에 있는 컴포넌트 (`ProductRow`) 부터 만들 수도 있습니다. 간단한 예제에서는 보통 하향식으로 만드는 게 쉽지만 프로젝트가 커지면 상향식으로 만들고 테스트를 작성하면서 진행하는 것이 더 쉽습니다.

이 단계가 끝나면 데이터 렌더링을 위해 만들어진 재사용 가능한 컴포넌트의 라이브러리를 가지게 됩니다. 현재는 앱의 정적 버전이기 때문에 컴포넌트는 `render()` 메서드만 가지고 있을 것입니다. 계층구조의 최상단 컴포넌트 (`FilterableProductTable`)는 prop으로 데이터 모델을 받습니다. 데이터 모델을 변경하고 `ReactDOM.render()` 을 다시 호출하면 UI는 업데이트 됩니다. 어느 곳을 고쳐서 어떻게 UI가 업데이트되는 지 확인하는 일은 어렵지 않은데 지금은 크게 복잡한 부분이 없기 때문입니다. React의 **단방향 데이터 플로우 (one-way data flow)** (또는 *단방향 바인딩 (one-way binding)*)는 앱을 모듈화 하기 좋고 빠르게 만들어줍니다.

이 단계를 실행하는 데 도움이 필요하다면 [React 문서](/docs/) 를 참고하세요.

### 짧은 소개: Props vs State

React 에는 두가지 데이터 "모델"인 props와 state가 있습니다. 이 둘 사이의 차이점을 이해하는 것이 중요합니다. 만약 차이점이 제대로 기억나지 않는다면 [공식 리액트 문서](/docs/interactivity-and-dynamic-uis.html) 를 살펴보세요.

## 3단계: UI state에 대한 최소한의 (하지만 완전한) 표현 찾아내기

UI를 상호작용하게 만드려면 기반 데이터 모델을 변경할 수 있는 방법이 있어야합니다. React는 **state** 로 이를 쉽게합니다.

앱을 올바르게 만들기 위해서는 앱에서 필요로 하는 변경가능한 state의 최소 집합을 생각해보아야 합니다. 여기서 핵심은 [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 원칙입니다. 어플리케이션이 필요로 하는 state를 완전하지만 작은 형태로 표현할 방법을 찾아내고 다른 모든 것은 필요할 때 state에서 계산하면 됩니다. 예를 들어 TODO 리스트를 만든다고 하면, TODO 아이템을 저장하는 배열만 유지하고 TODO 아이템의 갯수를 가지는 state를 별도로 가질 필요는 없습니다. 대신 TODO 갯수를 렌더링해야한다면 TODO 아이템 배열의 길이를 가져오면 됩니다.

예제 어플리케이션 내 데이터들을 생각해봅시다. 우리는 현재,

  * 제품의 원본 목록
  * 유저가 입력한 검색어
  * 체크박스의 값
  * 필터링된 제품 목록

각각 살펴보고 어떤 게 state가 되어야하는 지 살펴봅시다. 각 데이터에 대한 질문을 해볼 수 있습니다.

  1. 부모로부터 props를 통해 전달됩니까? 그러면 확실히 state가 아닙니다.
  2. 시간이 지나도 변하지 않나요? 그러면 확실히 state가 아닙니다
  3. 컴포넌트 안의 다른 state나 props를 가지고 계산 가능한가요? 그렇다면 state가 아닙니다.

제품의 원본 목록은 props를 통해 전달되므로 state가 아닙니다. 검색어와 체크박스는 state로 볼 수 있는데 시간이 지남에 따라 변하기도 하면서 다른 것들로부터 계산될 수 없기 때문입니다. 그리고 마지막으로 필터링된 목록은 state가 아닌데 제품의 원본 목록과 검색어, 체크박스의 값을 조합해서 계산해낼 수 있기 때문입니다.

결국 state는

  * 유저가 입력한 검색어
  * 체크박스의 값

만 남습니다.

## 4단계: State가 어디에 있어야할 지 찾기

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a>를 살펴보세요.</p>

좋습니다. 이제 앱에서 최소한으로 필요하는 state가 뭔지 찾아냈습니다. 다음으로는 어떤 컴포넌트가 state를 변경하거나 *소유* 할 지 찾아야합니다.

기억하세요: React는 항당 컴포넌트 계층구조를 따라 아래로 내려가는 단방향 데이터 흐름을 따릅니다. 어떤 컴포넌트가 어떤 상태를 가져야하는 지 바로 결정하기 어려울 수 있습니다. **많은 초보자들이 이 부분을 가장 이해하기 어려워합니다** 아래 과정을 따라해보세요.

어플리케이션이 가지는 각각의 state에 대해서

  * state를 기반으로 렌더링하는 모든 컴포넌트를 찾으세요
  * 공통 오너 컴포넌트 (common owner component)를 찾으세요 (계층 구조 내에서 특정 state를 필요로하는 모든 컴포넌트들의 위에 있는 하나의 컴포넌트).
  * 공통 오너 혹은 더 상위에 있는 컴포넌트가 state를 가져야합니다.
  * state를 소유할 적절한 컴포넌트를 찾지 못하였다면, 단순히 state를 소유하는 컴포넌트를 하나 만들어서 공통 오너 컴포넌트의 상위 계층에 추가하세요.

이 전략을 어플리케이션에 적용해봅시다.

  * `ProductTable` 은 state에 의존한 상품 리스트의 필터링해야하고 `SearchBar` 는 검색어와 체크박스의 상태를 표시해주어야합니다.
  * 공통 오너 컴포넌트는 `FilterableProductTable` 입니다.
  * 의미상으로도 `FilterableProductTable` 이 검색어와 체크박스의 체크 여부를 가지는 것이 타당합니다.

좋습니다. state를 `FilterableProductTable` 에 두기로 했습니다. 먼저 인스턴스 속성인 `this.state = {filterText: '', inStockOnly: false}` 를 `FilterableProductTable` 의 `constructor` 에 추가하여 어플리케이션의 초기 상태를 반영합니다. 그리고 나서 `filterText` 와 `inStockOnly` 를 `ProductTable` 와 `SearchBar` 에 prop으로 전달합니다. 마지막으로 이 props를 사용하여 `ProductTable` 의 행을 정렬하고 `SearchBar` 의 폼 필드 값을 설정하세요.

이제 어플리케이션의 동작을 볼 수 있습니다. `filterText` 를 `"ball"` 로 설정하고 앱을 새로고침 해보세요. 데이터 테이블이 올바르게 업데이트 된 것을 볼 수 있습니다.

## 5단계: 역방향 데이터 흐름 추가하기

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen"><a href="http://codepen.io">CodePen</a>에서 <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a>를 살펴보세요.</p>

지금까지 우리는 계층 구조 아래로 흐르는 props와 state의 함수로서 앱을 만들었습니다. 이제 다른 방향의 데이터 흐름을 만들어볼 시간입니다. 계층 구조의 깊숙한 곳에 있는 폼 컴포넌트에서 `FilterableProductTable` 의 state를 업데이트할 수 있어야합니다. 

React는 이러한 데이터 흐름을 명시적으로 보이게 만들어서 프로그램이 어떻게 동작하는 지 쉽게 파악할 수 있게 하지만 전통적인 양방향 데이터 바인딩 (two-way data binding)과 비교하면 더 많은 타이핑을 필요로 합니다.

현재 버전 예제에서 타이핑을 하거나 체크박스를 체크하려고 하면 React가 사용자의 입력을 무시합니다. 이는 의도한 것인데 `FilterableProductTable` 에서 넘어온 `state`가 항상 `input`의 `value` prop과 동일하기 떄문입니다.

우리가 어떤 걸 원하는 지 생각해봅시다. 우리는 사용자가 폼을 변경할 때마다 사용자의 입력을 반영할 수 있도록 state를 업데이트하기를 원합니다. 컴포넌트는 그 자신의 state만 변경할 수 있기 때문에 `FilterableProductTable` 는 `SearchBar` 에 콜백을 넘겨서 state가 업데이트되어야 할 때마다 호출되도록 할 것입니다. 우리는 input에 `onChange` 이벤트를 사용해서 알림을 받을 수 있습니다. `FilterableProductTable` 에서 전달된 콜백은 `setState()` 를 호출할 것이며, 앱은 업데이트될 것입니다.

복잡하게 들리지만 코드에선 몇줄밖에 안됩니다. 그리고 앱 전체적으로 데이터가 흐르는 모습을 명시적으로 볼 수 있습니다.

## 이게 전부입니다.

이 글을 통해 React를 가지고 어플리케이션과 컴포넌트를 만드는 데에 대한 사고방식을 얻어갈 수 있기를 바랍니다. 이전보다 더 많은 타이핑을 필요로 할 수 있지만 코드를 쓸 일보다 읽을 일이 더 많다는 사실을 기억하세요. 모듈화되고 명시적인 코드는 정말 읽기 쉬워집니다. 큰 컴포넌트 라이브러리를 만들게 되면 이 명시성과 모듈성에 감사할 것이며 코드 재사용상을 통해 코드 라인이 줄어들기 시작할 것입니다. :)