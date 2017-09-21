---
title: React笔记-Form表单与受控组件
date: 2017-09-20 17:00
---

在React中渲染Form表单时，与渲染其它HTML的DOM元素有些不同。因为对于其它的HTML DOM元素，它们是没有状态的，所谓的没有状态一来是指它们并不直接接受用户输入，二来是它们通常不会保留DOM元素内置的数据。但Form表单不同的是，它们直接面向用户输入，因此会承载数据，这样便有了直接挂到DOM元素本身的状态。React在处理Form表单的渲染时引入了受控组件的概念。

### 受控组件

所谓受控组件一般指的是组件的数据或状态有React负责维护。通常来说表单元素`input`，`textarea`，`select`都会直接接受用户输入来更新自己。但在React中组件的状态基本上都是保存在`state`属性上的，只有通过`setState`方法调用才能更新。因此为了保证“状态维护的单一原则”，这里我们将表单的状态控制也交由React组件来管理，由React组件来响应用户输入，之后更新对应的表单控件的DOM元素。因此这种由React来控制值的表单组件被称作受控组件。具体来说就是React组件通过注册事件的方式来接受用户输入，之后在通过调用`setState`方法来更新之前绑定到表单控件`value`字段的属性，比如：

```js
class FormInputField extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      name: ''
    }
    this.inputHandler = this.inputHandler.bind(this)
  }

  inputHandler(e) {
    this.setState({name: e.target.value})
  }

  render() {
    return (<input type="text" value={this.state.name} onChange={this.inputHandler}/>)
  }
}
const element = <FormInputField></FormInputField>;
ReactDOM.render(element, document.getElementById('app'))
```
以上示例代码中，我们将`<input/>`的`value`绑定到组件的`this.state.name`属性上，同时为`<input/>`添加`onChange`事件，之后用户输入的时候会触发`onChange`事件，之后在事件处理函数中我们通过`e.target.value`拿到用户得值来更新组件的`this.state.name`，这样组件刷新更新`<input/>`的值。

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/p6L13wsr/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

也许有人会问这样做有点多此一举，但事实上受控组件也会带来不少好处，比如我们可以在`setState`之前添加一些额外的处理，比如首先从数据的流转上统一，所有的状态都在`state`里，其实可以进行数据二次处理，比如

```js
inputHandler(e){
  this.setState({
    name: e.target.value.toUpperCase()
  })
})
```

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/p6L13wsr/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

再比如数据校验

```
inputHandler(e) {
  let val = e.target.value;
  if (val.length > 10) {
    e.preventDefault();
    return;
  }
  this.setState({name: val})
}
```

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/p6L13wsr/2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### textarea的处理

`<textarea/>`的处理与`<input/>`的处理类似

```js
class CommentArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: ''
    }
    this.inputHandler = this.inputHandler.bind(this)
  }
  inputHandler(e) {
    let val = e.target.value;
    this.setState({name: val})
  }

  render() {
    return (
      <textarea type="text" value={this.state.name} onChange={this.inputHandler}></textarea>
    )
  }
}
const element = <CommentArea></CommentArea>;
ReactDOM.render(element, document.getElementById('app'))
```

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/p6L13wsr/5/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### select的处理

原来`<select>`的默认选中是在`<option>`上添加`selected`属性，但在React中我们设置`value`的值，来控制默认选中，其它的处理与`<input>`类似，比如

```js
class LanuageSelect extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      language: 'CSS'
    }
    this.inputHandler = this.inputHandler.bind(this)
  }

  inputHandler(e) {
    let val = e.target.value;
    this.setState({language: val})
  }

  render() {
    return (
      <select type="text" value={this.state.language} onChange={this.inputHandler}>
        <option value="JavaScript">JavaScript</option>
        <option value="CSS">CSS</option>
        <option value="HTML">HTML</option>
      </select>
    )
  }
}
const element = <LanuageSelect></LanuageSelect>;
ReactDOM.render(element, document.getElementById('app'))
```

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/p6L13wsr/6/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
