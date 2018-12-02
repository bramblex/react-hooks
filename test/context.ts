
import { withContext, useCounter } from '../src/context'
import * as assert from 'assert'

const fakeComponent1 = {} as any
const func1 = withContext(fakeComponent1, function func1() {
    const { component: component1, counter: counter1 } = useCounter()
    assert(component1 === fakeComponent1)
    assert(counter1 === 0)
    const { component: component2, counter: counter2 } = useCounter()
    assert(component2 === fakeComponent1)
    assert(counter2 === 1)
})


const fakeComponent2 = {} as any
const func2 = withContext(fakeComponent2, function func2() {
    const { component: component1, counter: counter1 } = useCounter()
    assert(component1 === fakeComponent2)
    assert(counter1 === 0)

    func1()
    func1()

    const { component: component2, counter: counter2 } = useCounter()
    assert(component2 === fakeComponent2)
    assert(counter2 === 1)
})


const fakeComponent3 = {} as any
const func3 = withContext(fakeComponent3, function func3() {
    const { component: component1, counter: counter1 } = useCounter()
    assert(component1 === fakeComponent3)
    assert(counter1 === 0)

    func1()
    func2()

    const { component: component2, counter: counter2 } = useCounter()
    assert(component2 === fakeComponent3)
    assert(counter2 === 1)
})

func3()
func3()
func3()