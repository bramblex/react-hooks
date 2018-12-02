import * as React from 'react'
import { HooksComponentState } from './hooks/state'
import { HooksComponentMemos } from './hooks/memo'
import { HooksComponentRefs, HooksComponentImperativeMethods } from './hooks/ref'
import { HooksComponentContexts, bindContexts } from './hooks/context'
import { HooksComponentEffects, runEffects, cleanupEffects } from './hooks/effect'
import { withContext } from './context';

export declare class HooksComponent<Props extends {} = {}> extends React.Component<Props, HooksComponentState> {
    public state: HooksComponentState
    public __hooks__: {
        refs: HooksComponentRefs,
        memos: HooksComponentMemos,
        contexts: HooksComponentContexts,
        effects: HooksComponentEffects,
        layoutEffects: HooksComponentEffects,
        imperativeMethods?: HooksComponentImperativeMethods<{}>,
    }
}

export type RenderFunc<Props extends {} = {}>
    = (props: Props, ref: React.RefObject<HooksComponent<Props>>) => React.ReactNode


function bindComponent<Props extends {}>(component: HooksComponent<Props>, renderFunc: RenderFunc<Props>) {
    const ref = React.createRef<HooksComponent<Props>>();
    (ref as any).current = component
    return withContext(component, () => renderFunc(component.props, ref))
}

export function withHooks<Props extends {}>(renderFunc: RenderFunc<Props>): React.ComponentClass<Props, HooksComponentState> {
    const HooksComponentClass = class extends React.Component<Props, HooksComponentState> {
        public state: HooksComponent['state'] = {}
        public __hooks__: HooksComponent['__hooks__'] = {
            effects: {},
            layoutEffects: {},
            refs: {},
            contexts: {},
            memos: {},
            imperativeMethods: undefined
        }

        constructor(props: Props) {
            super(props)
            this.render = bindContexts(
                this.__hooks__.contexts,
                bindComponent(this, renderFunc)
            )
        }

        componentWillMount() {
            runEffects(this.__hooks__.layoutEffects)
        }

        componentDidMount() {
            runEffects(this.__hooks__.effects)
        }

        componentWillUpdate() {
            runEffects(this.__hooks__.effects)
            runEffects(this.__hooks__.layoutEffects)
        }

        componentWillUnmount() {
            cleanupEffects(this.__hooks__.effects)
            cleanupEffects(this.__hooks__.layoutEffects)
        }

    } as React.ComponentClass<Props, HooksComponentState>

    HooksComponentClass.displayName = (renderFunc as any).name
    return HooksComponentClass
}
