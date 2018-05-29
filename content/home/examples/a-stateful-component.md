---
title: 상태를 가지는 컴포넌트 (Stateful component)
order: 1
---

`this.props` 를 통해 입력된 데이터를 가져오는 것 외에도, 컴포넌트는 내부 상태 데이터를 관리할 수 있습니다. (`this.state` 를 통해 접근) 컴포넌트의 상태 데이터가 바뀌면, `render()`가 다시 호출되고 그로 인해 마크업이 갱신됩니다.