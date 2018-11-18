# react-hooks

React Hooks API 在低版本 React 16.6 下面的一个实现，可以在不升级 React 版本的前提下体验新的 React Hooks API。（虽然指实现了三个 Basic API

## Install

```
npm install blx-react-hooks
# or
yarn add blx-react-hooks
```

## Usage
在声明函数式组件的时候，通过用 `withHooks()` 函数封装就可以就使用 `useState()` / `useEffect()` / `useContext()` 三个 Hooks API 了。与 React 的 Hooks API 只差了需要 `withHooks()` 函数进行封装。

```JSX
import {withHooks, useState} from 'blx-react-hooks'

// 如果想在调试的时候看到组件名，定义function的时候必须要定义成一个命名函数
const Counter = withHooks(function Counter({title, initCount}) {
  const [count, setCount] = useState(initCount)
  return (
    <div>
      <h1>{title} </h1>
      <button onClick={() => setCount(count - 1)}> - </button>
      Count: {count}
      <button onClick={() => setCount(count + 1)}> + </button>
    </div>
  )
})
```

完整示例 [https://github.com/bramblex/react-hooks/blob/master/example.html](https://github.com/bramblex/react-hooks/blob/master/example.html)

## API

* withHooks
* useState
* useEffect
* useContext


## Document
API 的文档直接参见 React Hooks API 的文档：[https://reactjs.org/docs/hooks-intro.html](https://reactjs.org/docs/hooks-intro.html)
