import * as React from 'react'
import { useCounter } from "../context";
import { HooksInputs, inputsChange } from "../inputs";

export interface HooksComponentMemos {
    [counter: number]: [any, HooksInputs | undefined]
}

export function useMemo<T>(computedFunc: () => T, inputs?: HooksInputs) {
    const { component, counter } = useCounter()
    const componentMemos: { [counter: number]: [T, HooksInputs | undefined] }
        = component.__hooks__.memos

    if (!componentMemos.hasOwnProperty(counter)) {
        componentMemos[counter] = [computedFunc(), inputs]
    } else {
        const [, oldInputs] = componentMemos[counter]
        if (inputsChange(oldInputs, inputs)) {
            componentMemos[counter] = [computedFunc(), inputs]
        }
    }
    return componentMemos[counter][0]
}

export function useCallback<T>(callback: () => T, inputs?: HooksInputs): () => T {
    return useMemo<() => T>(() => callback, inputs)
}