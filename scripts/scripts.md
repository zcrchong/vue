rollup构建配置和构建脚本，Vue.js能够通过不同的环境构建不同的版本的秘密都在这个目录下。


# alias别名
我们在开发Vue应用时，经常会用到@别名，其中@代表src目录：
```js
// 使用别名
import HelloWorld from '@/components/HelloWorld.vue'

// 相当于
import HelloWorld from 'src/components/HelloWorld.vue'
```