import * as React from 'react'
import { HooksComponentState } from './hooks/state';
import {HooksComponent} from './hooks-component'

interface HooksContext {
    component: HooksComponent,
    counter: number
}

const hooksContextStack: HooksContext[] = []

export function useCounter() {
    const context = hooksContextStack[hooksContextStack.length - 1]
    const counter = context.counter++
    return { component: context.component, counter }
}

export function withContext<Ret, Args extends any[]>(component: HooksComponent, func: (...args: Args) => Ret)
    : (...args: Args) => Ret {
    return function (...args) {
        hooksContextStack.push({ component, counter: 0 })
        const result = func(...args)
        hooksContextStack.pop()
        return result
    }
}