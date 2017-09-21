---
title: React笔记-refs属性和DOM引用
date: 2017-09-21 15:00
---

在React中，多数情况下，我们在解决通信问题时都会依赖`props`。但这不能涵盖所有的交互情况，有时我们也需要直接拿到组件对象，或者是直接在组件拿到DOM对象，然后进行下步的处理。React为这种情况也提供了支持，这是通过引入`ref`属性实现的。

### ref属性声明

通过在组件或元素上声明`ref`，我们就可以根据值，在组件的`refs`属性上，来获取组件对象或DOM元素。
在可能的情况下，尽量使用声明式的方式来进行组件交互，但以下几种情况我们也不得不使用`ref`，比如：

+ 处理元素焦点，文本选中或音视频的播放
+ 比如触发动画
+ 与现在已有的第三方DOM库进行集成

非必要的情况下，你需要牢记，在React的世界中绝大多数的情况下要关注的是组件状态`state`的处理。


下面是一个在DOM对应的元素上，使用`ref`的示例

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

  componentDidMount() {
    this.myInput.focus()
  }

  render() {
    return (<input ref={(input) => { this.myInput = input; }}  
                   type="text" 
                   value={this.state.name} 
                   onChange={this.inputHandler}/>)
  }
}
```

以上示例中，在`FormInputField`组件渲染后，我们要将焦点设置到input输入框内。我们首先在`<input/>`上声明`ref`属性，并添加一个回调来获取引用，之后在声明周期的挂载方法`componentDidMount`，通过`this.myInput`获取真实的input的DOM元素，之后再调用原生的`focus()`方法来设置焦点。

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/roLhb9z9/3/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### 在类组件上使用ref

除了在DOM上直接使用`ref`声明外，我们也可以在类组件上进行同样的声明，只不过这是我们引用的不再是DOM对象，而是对应的组件对象。

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
  focusInput() {
    this.myInput.focus()
  }
  render() {
    return (<input ref={(input) => { this.myInput = input;}} 
                   type="text" 
                   value={this.state.name} 
                   onChange={this.inputHandler}/>)
  }
}

class App extends React.Component {
 
 constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    this.inputField.focusInput()
  }
  
  render() {
    return (
      <div>
      <FormInputField ref={(component) => { this.inputField = component;}}></FormInputField>
      </div>
    )
  }
}

```

以上示例，我们在`FormInputField`组件上定义了`focusInput`方法。在`App`组件内使用`FormInputField`时，首先声明`ref`， 并添加一个回调来获取它引用，之后在挂载时，通过`this.inputField`获得组件对象，之后再调用它的`focusInput`方法。

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/roLhb9z9/2/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


### ref与函数组件

在函数组件上不能使用`ref`，因为它没有完整的生命周期，如果要用的化，需要将其转换为类组件，比如以下是错误的

```js
function MyComponent(){
  return <input/>
}

class App extends React.Component{
  render(){
    return(
     <MyComponent
        ref={(input) => { this.textInput = input; }} /> // 此处的回调不会执行
    );
  }
}
```

`MyComponent`是函数组件，在父组件使用它是不能再它上面声明`ref`属性。你需要将其转换为类组件。虽然如此但我们可以在函数组件内部，在其与DOM对应的元素上进行`ref`声明，从而获取DOM对象。

```js
function MyComponent(){
 
  let inputEl;
  function clicked(){
    console.log(inputEl)
  }
  return <input onClick={clicked} ref={(inpit)=>{inputEl = input}}/>
}
```

> 早先版本的React可以使用`refs`属性来获取对象引用，但已标记为不建议使用，参见[问题](https://github.com/facebook/react/pull/8333#issuecomment-271648615)
