import { useCounter } from "../context";
import { HooksInputs, inputsChange } from "../inputs";

export interface HooksComponentMemos {
    [counter: number]: [any, HooksInputs | undefined]
}

export function useMemo<T>(computedFunc: () => T, inputs?: HooksInputs): T {
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

export function useCallback<Args extends any[], Ret>(callback: (...args: Args) => Ret, inputs?: HooksInputs): (...args: Args) => Ret {
    return useMemo(() => callback, inputs)
}