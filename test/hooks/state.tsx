
import * as React from 'react'
import { fakeWithHooks } from '../fake-hooks-component'
import { useState, useReducer } from '../../src/hooks/state';
import * as assert from 'assert'
import { useEffect } from '../../src/hooks/effect';
import { access } from 'fs';

const FakeComponent1 = fakeWithHooks(function FakeComponent() {
    const [count] = useState(0)
    const [count2] = useState(1)
    return null
})

const fakeComponent1 = new FakeComponent1({})
assert.deepStrictEqual(fakeComponent1.state, { 0: 0, 1: 1 })


const FakeComponent2 = fakeWithHooks(function FakeComponent() {
    const [count, setCount] = useState(0)
    const [count2, setCount2] = useState(1)
    useEffect(() => {
        setCount(count + 1)
        setCount2(count2 + 2)
    })
    return null
})

const fakeComponent2 = new FakeComponent2({});
(fakeComponent2 as any).componentDidMount()
assert.deepStrictEqual(fakeComponent2.state, { 0: 1, 1: 3 })


// function reducer(state: number, action: { type: string, payload?: any }) {
//     if (action.type === 'init') {
//         return 1
//     } else if (action.type === 'add') {
//         return state + action.payload
//     }
//     return state
// }
// const FakeComponent3 = fakeWithHooks(function FakeComponent() {
//     const [state, dispatch] = useReducer<number>(reducer, 0)
//     const [state, dispatch] = useReducer<number>(reducer, 0, {type: 'init'})
//     return null
// })
// const fakeComponent3 = new FakeComponent3({});
// (fakeComponent3 as any).componentDidMount()