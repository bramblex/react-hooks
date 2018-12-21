import { useCounter } from "../context";

export interface HooksComponentState {
    [counter: number]: any
}

export interface HooksComponentStateSetters {
    [counter: number]: SetState<any>
}

export interface HooksComponentStateDispatchers {
    [counter: number]: Dispatch<any>
}

type State<T> = T | (() => T)
type SetState<T> = (state: T | ((oldState: T) => T), callback?: () => void) => void

export function useState<T>(defaultState: State<T>): [T, SetState<T>] {
    const { component, counter } = useCounter()
    const componentState: { [counter: number]: T } = component.state
    const componentSetters = component.__hooks__.setters

    if (!componentState.hasOwnProperty(counter)) {
        if (typeof defaultState === 'function') {
            componentState[counter] = (defaultState as () => T)()
        } else {
            componentState[counter] = defaultState
        }

        componentSetters[counter] = (state, callback?) => {
            const componentState: { [counter: number]: T } = component.state
            if (typeof state === 'function') {
                const oldState = componentState[counter] as T
                component.setState({ [counter]: (state as (oldState: T) => T)(oldState) }, callback)
            } else {
                component.setState({ [counter]: state }, callback)
            }
        }
    }

    return [componentState[counter], componentSetters[counter]]
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
    const componentDispatchers = component.__hooks__.dispatchers

    if (!componentState.hasOwnProperty(counter)) {
        if (initialAction) {
            componentState[counter] = reducer(initialState, initialAction)
        } else {
            componentState[counter] = initialState
        }

        componentDispatchers[counter] = (action, callback?) => {
            const componentState: { [counter: number]: T } = component.state
            component.setState({ [counter]: reducer(componentState[counter], action) }, callback)
        }

    }

    return [componentState[counter], componentDispatchers[counter]]
}
