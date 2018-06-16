---
id: uncontrolled-components
title: 제어되지 않는 컴포넌트
permalink: docs/uncontrolled-components.html
---

폼을 구현할 때에는 웬만하면 [제어되는 컴포넌트](/docs/forms.html)를 사용하시기를 권합니다. 제어되는 컴포넌트를 사용하면, 폼 데이터가 React에 의해 적절히 제어될 수 있기 때문입니다. 반면 제어되지 않는 컴포넌트를 사용하면, 폼 데이터는 DOM의 자체 기능에 의해 제어됩니다.

제어되지 않는 컴포넌트를 만들 때에는 상태 업데이트를 위해 이벤트 핸들러를 작성할 필요가 없습니다. 대신 [ref를 사용](/docs/refs-and-the-dom.html)해서 폼 데이터를 DOM으로부터 가져올 수 있습니다.

예를 들어, 아래 코드는 제어되지 않는 컴포넌트를 통해 이름을 입력받습니다:

```javascript{8,17}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[Try it on CodePen.](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

제어되지 않는 컴포넌트는 진리의 원천을 DOM에 두기 때문에, React를 사용한 코드와 사용하지 않은 코드를 통합하는 작업을 좀 더 쉽게 만들어줄 수 있습니다. 그리고 코드의 양이 상대적으로 적습니다. 좀 지저분하지만 빠른 해결책을 원한다면 제어되지 않는 컴포넌트를 사용하세요. 그렇지 않다면, 제어되는 컴포넌트를 사용하세요.

아직 어떤 상황에서 무엇을 써야하는지 명확히 감이 오지 않는다면, [제어되는 input과 제어되지 않는 input에 대한 글](http://goshakkk.name/controlled-vs-uncontrolled-inputs-react/)이 도움이 될 수 있습니다.

### 기본값 지정하기

React의 렌더링 라이프사이클에서는, 폼 엘리먼트에 지정된 `value` 어트리뷰트가 DOM의 값을 덮어쓸 것입니다. 반면 제어되지 않는 컴포넌트를 사용할 때, DOM의 상태변화는 제어되지 않는 상태로 두면서도 초기값을 지정해주어야 하는 경우가 있습니다. 이런 경우를 위해, `defaultValue` 어트리뷰트를 `value` 대신 사용할 수 있습니다.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

비슷하게 `<input type="checkbox">`와 `<input type="radio">` 엘리먼트는 `defaultChecked` 어트리뷰트를, `<select>`와 `<textarea>`는 `defaultValue` 어트리뷰트를 지원합니다.

## The file input Tag

HTML에서, `<input type="file">` 태그는 서버에 업로드하거나 처리가 필요한 하나 이상의 파일을 기기 저장소에서 선택하는 데 사용되며, 이는 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)를 통해 JavaScript로 구현됩니다.

```html
<input type="file" />
```

React에서 `<input type="file" />`는 언제나 제어되지 않는 컴포넌트인데, 왜냐하면 이 엘리먼트의 값은 오로지 사용자에 의해서만 지정될 수 있기 때문입니다. (즉, 프로그래밍을 통해서 지정하는 것이 불가능)

입력받은 파일과 상호작용하기 위해서는 File API를 사용해야만 합니다. 아래 예제는 submit 이벤트 핸들러 내에서 파일에 접근하기 위해 [DOM node를 가리키는 ref](/docs/refs-and-the-dom.html)를 생성하는 방법을 보여줍니다:

`embed:uncontrolled-components/input-type-file.js`

[Try it on CodePen](codepen://uncontrolled-components/input-type-file)
