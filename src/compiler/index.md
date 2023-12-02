模板编译成 AST 抽象语法树、AST 抽象语法树优化和代码生成相关代码。

编译的工作可以在构建时用runtime-only版本，借助webpack和vue-loader等工具或插件来进行编译。

也可以在运行时，使用包含构建功能的runtime + compiler版本。

显然，编译是一项比较消耗性能的工作，所以我们日常的开发中，更推荐使用runtime-only的版本开发(体积也更小)，也就是通过.vue文件的形式开发。

```js
// 需要使用带编译的版本
new Vue({
  data: {
    msg: 'hello,world'
  }
  template: '<div>{{msg}}</div>'
})

// 不需要使用带编译的版本
new Vue({
  data: {
    msg: 'hello,world'
  },
  render (h) {
    return h('div', this.msg)
  }
})
```