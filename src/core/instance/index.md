|-- instance
|   |-- render-helpers      # render渲染相关的工具函数目录
|   |-- events.js           # 事件处理相关
|   |-- init.js             # _init等方法相关
|   |-- inject.js           # inject和provide相关
|   |-- lifecycle.js        # 生命周期相关
|   |-- proxy.js            # 代理相关
|   |-- render.js           # 渲染相关
|   |-- state.js            # 数据状态相关
|   |-- index.js            # 入口文件

可以看到，目录结构文件有很多，而且包含的面也非常杂，但我们现在只需要对我们最关心的几个部分做介绍：

`events.js`：处理事件相关，例如：`$on`，`$off`，`$emit`以及`$once`等方法的实现。
`init.js`：此部分代码逻辑包含了Vue从创建实例到实例挂载阶段的所有主要逻辑。
`lifecycle.js`：生命周期相关，例如：`$destroy、$activated和$deactivated`。
`state.js`：数据状态相关，例如：`data、props以及computed`等。
`render.js`：渲染相关，其中最值得关注的是`Vue.prototype._render`渲染函数的定义。