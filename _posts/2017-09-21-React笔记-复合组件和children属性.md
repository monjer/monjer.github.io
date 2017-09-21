---
title: React笔记-复合组件和children属性
date: 2017-09-21 11:00
---

从面向对象的角度出发，在React中实现新组件的开发方式有两种方式，一种是组合，另一种是继承。React推荐优先使用组合的方式来创建新的组件，因为它为组合方式的组件新建提供了较好的支持。

### 复合组件

复合组件，也可以理解为容器组件，这类组件通常只是提供了一个容器或者框架，至于内部的内容或者说是会包含什么样的子组件，是不固定的。常见的组件常见的有窗口，面板，表单等等。

比如我们定义一个窗口`Window`组件:

```js
class Window extends React.Component {

  constructor(props) {
    super(props);
    this.onBgClick = this.onBgClick.bind(this)
  }
  onBgClick() {
    this.props.onClose()
  }
  render() {
    return (
      <div>
        <div className="window-mask" onClick={this.onBgClick}></div>
        <div className="window">
          <header className="window--header">{this.props.title}</header>
          <section className="window--body">
            {this.props.children}
          </section>
          <footer className="window--footer">
            <button onClick={this.props.onClose}>确认</button>
            <button onClick={this.props.onClose}>取消</button>
          </footer>
        </div>
      </div>
    )
  }
}
```

在窗口体内的`section.window--body`内我们加入了`{this.props.children}`，`children`属性是组件`props`对象的一个特殊属性，用来表示子组件包含的JSX元素，类似一个元素的占位符，因为在React的世界里，渲染元素也是对象，可以当做正常的变量使用。因此当我们需要一个`HelloWorldWindow`时，我们不必再继承`Window`组件，只要按如下把`HelloWorldWindow `内容包含进来就可以了

```js
<Window title="HelloWorldWindow"  onClose={()=>{this.toggleWindow()}}>
   <p>Hello world</p>   
</Window>
```
下面是一个完整的示例：

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/3z3408tt/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

这种组件的新建方式成为复合组件，避免了继承带来的多层次构建问题。

### 多个组件占位符

有时某个组件会包含多个子组件，而且这些子组件会占据不同的位置，在不同的层级上，这时候丹丹使用`children`已经无法满足要求了，这是我们可以继续发挥`props`的优势，在`props`上声明我们所需要的子组件，然后由使用者传入，比如：

```js
class LayoutPanel extends React.Component {
  render() {
    return (
      <div className="layoutPanel">
        <div className="layoutPanel--left">
          {this.props.leftPanelContent}
        </div>
        <div className="layoutPanel--right">
          {this.props.rightPanelContent}
        </div>
      </div>
    )
  }
}
```

`LayoutPanel`是一个布局组件，规定了左右的布局方式，同时分别定义了`leftPanelContent`和`rightPanelContent`两个子组件占位符，这样在使用`LayoutPanel`时只要把这两个占位符的子组件以属性的方式传入就可以了。

```js
class App extends React.Component {
  render() {
    let leftPanel = <div>这是左侧面板</div>
    let rightPanel = <div>这是右侧面板</div>
    return (
      <div>
        <LayoutPanel leftPanelContent={leftPanel} rightPanelContent={rightPanel}></LayoutPanel>
      </div>
    )
  }
}

```
下面是完整的示例

<iframe width="100%" height="300" src="//jsfiddle.net/monjer/ot7wcts1/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>





















