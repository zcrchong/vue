import {
  warn,
  nextTick,
  emptyObject,
  handleError,
  defineReactive,
  isArray
} from '../util/index'

import { createElement } from '../vdom/create-element'
import { installRenderHelpers } from './render-helpers/index'
import { resolveSlots } from './render-helpers/resolve-slots'
import { normalizeScopedSlots } from '../vdom/helpers/normalize-scoped-slots'
import VNode, { createEmptyVNode } from '../vdom/vnode'

import { isUpdatingChildComponent } from './lifecycle'
import type { Component } from 'types/component'
import { setCurrentInstance } from 'v3/currentInstance'
import { syncSetupSlots } from 'v3/apiSetup'

export function initRender(vm: Component) {
  vm._vnode = null // 子树的根节点  
  vm._staticTrees = null // v-once的缓存树  
  const options = vm.$options
  const parentVnode = (vm.$vnode = options._parentVnode!) // 父树中的占位符节点  
  const renderContext = parentVnode && (parentVnode.context as Component)
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = parentVnode
    ? normalizeScopedSlots(
        vm.$parent!,
        parentVnode.data!.scopedSlots,
        vm.$slots
      )
    : emptyObject
  // 将createElement函数绑定到该实例上，以便在内部获得正确的渲染上下文  
  // 参数顺序：标签，数据，子节点，标准化类型，始终标准化  
  // 内部版本由从模板编译的渲染函数使用  
  // @ts-expect-error
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // 标准化对于公共版本始终应用于用户编写的渲染函数中  
  // @ts-expect-error
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)

  // $attrs & $listeners 被暴露出来以便于创建Higher-Order Components (HOC) 它们必须是响应式的，这样使用它们的HOC就可以始终被更新
  const parentData = parentVnode && parentVnode.data

  /* istanbul ignore else */
  if (__DEV__) {
    defineReactive(
      vm,
      '$attrs',
      (parentData && parentData.attrs) || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
      },
      true
    )
    defineReactive(
      vm,
      '$listeners',
      options._parentListeners || emptyObject,
      () => {
        !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
      },
      true
    )
  } else {
    defineReactive(
      vm,
      '$attrs',
      (parentData && parentData.attrs) || emptyObject,
      null,
      true
    )
    defineReactive(
      vm,
      '$listeners',
      options._parentListeners || emptyObject,
      null,
      true
    )
  }
}

export let currentRenderingInstance: Component | null = null

// for testing only
export function setCurrentRenderingInstance(vm: Component) {
  currentRenderingInstance = vm
}
// 主要在Vue.prototype上定义各种私有方法和一个非常重要的实例方法：$nextTick
export function renderMixin(Vue: typeof Component) {
  // install runtime convenience helpers
  // 它会在Vue.prototype上挂载各种私有方法，例如this._n = toNumber、this._s = toString、this._v = createTextVNode和this._e = createEmptyVNode。
  installRenderHelpers(Vue.prototype)
  // nextTick会在Vue构造函数上挂载一个全局的nextTick()方法，而此处为实例方法，本质上引用的是同一个nextTick。
  Vue.prototype.$nextTick = function (fn: (...args: any[]) => any) {
    return nextTick(fn, this)
  }
  // _render()方法会把模板编译成VNode
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode && vm._isMounted) {
      vm.$scopedSlots = normalizeScopedSlots(
        vm.$parent!,
        _parentVnode.data!.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
      if (vm._slotsProxy) {
        syncSetupSlots(vm._slotsProxy, vm.$scopedSlots)
      }
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode!
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      setCurrentInstance(vm)
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e: any) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (__DEV__ && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(
            vm._renderProxy,
            vm.$createElement,
            e
          )
        } catch (e: any) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
      setCurrentInstance()
    }
    // if the returned array contains only a single node, allow it
    if (isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (__DEV__ && isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
}
