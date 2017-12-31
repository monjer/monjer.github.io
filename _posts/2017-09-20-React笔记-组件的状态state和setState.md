---
title: React笔记-组件的状态state和setState
date: 2017-09-20 09:10
---

### 引入state和setState

上篇提到，React组件内的`props`属性是不可变得，我们没有办法通过直接修改`props`上的属性来达到更新组件的目的，只能一次又一次的通过重新构建新的`props`对象，并重复调用`ReactDOM.render()`才能实现组件的刷新。但是随着深入使用React的化，在后面我们会发现在一个纯React构建的应用中，通常情况下`ReactDOM.render()`只会调用一次，并传入我们的根元素（root element）。那么有没有一种办法可以用来实现组件的更新呢？答案是`state`属性和`setState`方法。

### 函数组件转换为类组件

`state`顾名思义代表了一个组件的状态，那么`setState`代表的是改变组件的状态，它们俩个存在于React的类组件上，因此在使用之前你需要将原来的函数组件转换为类组件。这个转换的过程比较简单，以一个Clock组件为例，比如：

```js
function Clock(props) {
  return <span>
    {props.date.toLocaleString()}
  </span>
}
```

转换为类组件

```js
class Clock extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <span>
        {this.props.date.toLocaleString()}
      </span>
    )
  }
}
```

转换的步骤可以总结为：

1. 新建一个同名的组件类，并继承自`React.Component`
2. 在类中新建一个`render`方法，并将原来函数参数中的内容移动到此方法内
3. 在`render`方法内JSX中原来的`props`参数，替换成类组件中的`this.props`属性
4. 定义类的构造器`constructor`，接受外部传入的`props`，然后必须调用`super(props)`，如果在构造器内你没有任何处理，此步骤可省略。

完成这个转换是第一步，第二步是要找出`props`属性对象中，那些可能会发生变更的元素，并将这些元素构建成一个新的对象，这个对象就是我们的`state`对象，我们可以在构造器内初始化我们的`state`对象。

```js
class Clock extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  render() {
    return (
      <span >
        {this.state.date.toLocaleString()}
      </span>
    )
  }
}
```

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/h8Lrhr4k/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### setState的初步用法

现在我们的Clock本身并不能自更新，那么我们如何才能实现它的自更新呢？原理很简单，我们只要在某个时机启动一个定时器，然后在组件对象上调用`setState()`方法，同时传入新的`date`对象既可以了。这里我们首先引入组件的生命周期的概念，所谓组件的生命周期，可以简单的把组件想象成一个具有生命力的对象，需要创建它，渲染它，更新它，以及销毁它，这一些列发生的事件就是组件的生命周期，反映到React代码上来就是，组件的渲染到页面上，称之为挂载（mounting），会触发`componentDidMount()`方法，将组件从页面上移除，称之为卸载（umounting），会触发`componentWillUnmount`方法，这两个方法在组件的生命周期内只会调用一次，并且这些方法的调用都是由React内部的机制进行维护的，这些东西有些偏原理性质的，我们这里之关心它是什么和干了什么即可。那么根据这些信息，我们就可以继续完成我们的Clock了。

```js
class Clock extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      date: new Date()
    }
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.updateDate()
    }, 1000)
  }

  updateDate() {
    this.setState({date: new Date()})
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  render() {
    return (
      <span>{this.state.date.toLocaleString()}</span>
    )
  }
}

```

这里我们在`componentDidMount`方法内开启了一个定时器`this.timerId`，定时调用`updateDate`方法，在`updateDate`方法内又会调用`setState`并设置新的`state`对象，这样便完成了组件的刷新，在组件卸载时我们会在`componentWillUnmount`方法内取消定时器。`this.props`和`this.state`是React组件内置定义的属性，对于其它非渲染变量或数据，我们直接保存在`this`上就可以了。

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/jr3r7wf1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### setState的陷阱

#### 1.不要直接修改`state`

直接修改`this.state`不会引起界面的重渲染，更新`this.state`的唯一入口是调用`setState()`，因此：
 
```js
this.state.name = "new name"
```
需要替换为
 
```js
this.setState({name: "new name"})
```
#### 2.同一周期内`state`的更新是异步的

为了性能优化，React会将同一周期内多次`setState`的调用合并为一次调用，因此`this.state`的更新是异步的，非即时的，在计算时如果你的state依赖于之前的state，这时你需要注意了。因此
   
```js
class Counter extends React.Component {
    
  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }
    
  componentDidMount() {
    this.setState({
      num: 100
    })
    console.log(this.state.num) // 此处的num为0
    this.setState({
      num: this.state.num + 1
    })
  }
    
  render() {
    return ( 
       <span> {this.state.num} </span>
    )
  }
}
```

最终的输出结果是`1`，当然React也提供了解决的办法，`setState`方法还有一种调用方式是接受一个回调函数，参数为`prevState`，`props`，`prevState`代表了上一个state对象，回调函数需要返回一个新的state对象。
    
```js
class Counter extends React.Component {
    
  constructor(props) {
    super(props)
    this.state = {
      num: 0
    }
  }
    
  componentDidMount() {
    this.setState({
      num: 100
    })
    console.log(this.state.num)
    this.setState((prevState, props)=>{
    	return {
        num: prevState.num + 1
      }
    })
  }      
    
  render() {
    return ( 
       <span> {this.state.num} </span>
    )
  }
}
```
最终的输出结果是`101`

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/7kvs270b/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



#### 3.`state`的更新会被合并

调用`setState`来更新状态时，React会将新的状态合并到当前状态，而不是简单的替换，因为不会引发数据覆盖的问题，比如

```js
this.state = {
  name: 'Tom',
  age: 18
}
```
```js
componentDidMount() {
  setTimeout(()=> {
    this.setState({
      name: "Tom new "
    });
  },1000);

  setTimeout(()=> {
    this.setState({
      age: 19
    });
  },10000);
}
```

`age`的更新不会将`name`擦除，`setState`方法传入的state对象最后都会进行合并，只有同名的属性才会进行覆盖。
