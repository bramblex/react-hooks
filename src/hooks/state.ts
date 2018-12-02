import { useCounter } from "../context";

export interface HooksComponentState {
    [counter: number]: any
}

type State<T> = T | (() => T)
type SetState<T> = (state: T | ((oldState: T) => T), callback?: () => void) => void

export function useState<T>(defaultState: State<T>): [T, SetState<T>] {
    const { component, counter } = useCounter()
    const componentState: { [counter: number]: T } = component.state

    if (!componentState.hasOwnProperty(counter)) {
        if (typeof defaultState === 'function') {
            componentState[counter] = (defaultState as () => T)()
        } else {
            componentState[counter] = defaultState
        }
    }

    const setState: SetState<T> = (state, callback?) => {
        if (typeof state === 'function') {
            const oldState = componentState[counter] as T
            component.setState({ [counter]: (state as (oldState: T) => T)(oldState) }, callback)
        } else {
            component.setState({ [counter]: state }, callback)
        }
    }

    return [componentState[counter], setState]
}

interface Action {
    type: string,
    payload?: any
}

type Reducer<T> = (state: T, action: Action) => T

type Dispatch<T> = (action: Action, callback?: () => void) => void

export function useReducer<T>(reducer: Reducer<T>, initialState: T, initialAction?: Action): [T, Dispatch<T>] {
    const { component, counter } = useCounter()
    const componentState: { [counter: number]: T } = component.state

    if (!componentState.hasOwnProperty(counter)) {
        if (initialAction) {
            componentState[counter] = reducer(initialState, initialAction)
        } else {
            componentState[counter] = initialState
        }
    }

    const dispatch: Dispatch<T> = (action, callback?) => {
        return component.setState(
            { [counter]: reducer(componentState[counter], action) },
            callback
        )
    }

    return [componentState[counter], dispatch]
}
