import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
import type { GlobalAPI } from 'types/global-api'
// 声明Vue构造函数
// Vue构造函数其实就是一个普通的函数，我们只能通过new操作符进行访问，既new Vue()的形式，Vue函数内部也使用了instanceof操作符来判断实例的父类是否为Vue构造函数，不是的话则在开发环境下输出警告信息。
function Vue(options) {
  if (__DEV__ && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
// 调用以下方法
// 除了声明Vue构造函数，这部分的代码也调用了几种mixin方法，其中每种mixin方法各司其职，处理不同的内容。
//@ts-expect-error Vue has function type
initMixin(Vue)
//@ts-expect-error Vue has function type
stateMixin(Vue)
//@ts-expect-error Vue has function type
eventsMixin(Vue)
//@ts-expect-error Vue has function type
lifecycleMixin(Vue)
//@ts-expect-error Vue has function type
renderMixin(Vue)

export default Vue as unknown as GlobalAPI
