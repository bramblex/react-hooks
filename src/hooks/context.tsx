import * as React from 'react'
import { useCounter } from "../context"

export interface HooksComponentContexts {
    [counter: number]: [any, React.Context<any>]
}

export function bindContexts(contexts: HooksComponentContexts, renderFunc: () => React.ReactNode): () => React.ReactNode {
    renderFunc()

    const contextsArray = Object
        .getOwnPropertyNames(contexts)
        .map(_counter => {
            const counter: number = parseInt(_counter)
            return [counter, contexts[counter][1]] as [number, React.Context<any>]
        })

    if (contextsArray.length <= 0) {
        return renderFunc
    } else {
        return contextsArray.reduceRight((lastRenderFunc, [counter, context]) => () => (
            <context.Consumer>
                {value => {
                    contexts[counter] = [value, context]
                    return lastRenderFunc()
                }}
            </context.Consumer>
        ), renderFunc)
    }
}

export function useContext<T>(context: React.Context<T>) {
    const { component, counter } = useCounter()
    const componentContexts = component.__hooks__.contexts
    if (!componentContexts.hasOwnProperty(counter)) {
        componentContexts[counter] = [(context as any)._currentValue, context]
    }
    return componentContexts[counter][0]
}