import * as React from 'react'
import { useCounter } from "../context";
import { HooksComponent } from '../hooks-component';
import { inputsChange } from '../inputs';

export interface HooksComponentRefs {
    [counter: number]: React.RefObject<any>
}

export function useRef<T>(initialValue: T): React.RefObject<T> {
    const { component, counter } = useCounter()
    const componentRefs: { [counter: number]: React.RefObject<T> } = component.__hooks__.refs

    if (!componentRefs.hasOwnProperty(counter)) {
        const ref = React.createRef<T>();
        (ref as any).current = initialValue
        componentRefs[counter] = ref
    }

    return componentRefs[counter]
}


export type HooksComponentImperativeMethods<T extends {}>
    = [T, any[] | undefined]

export function useImperativeMethods<T extends {}>(ref: React.RefObject<HooksComponent>, createInstance: () => T, inputs?: any[]): void {
    const component = ref.current
    if (component) {
        const componentImperativeMethods = component.__hooks__.imperativeMethods

        if (!componentImperativeMethods) {
            const instance = createInstance()
            Object.getOwnPropertyNames(instance).forEach((name) => {
                (component as any)[name] = (instance as any)[name]
            })
            component.__hooks__.imperativeMethods = [instance, inputs]
        } else {
            const [oldInstance, oldInputs] = componentImperativeMethods
            if (inputsChange(oldInputs, inputs)) {
                const instance = createInstance()
                Object.getOwnPropertyNames(oldInstance).forEach((name) => {
                    delete (component as any)[name]
                })
                Object.getOwnPropertyNames(instance).forEach((name) => {
                    (component as any)[name] = (instance as any)[name]
                })
            }
        }
    }
}