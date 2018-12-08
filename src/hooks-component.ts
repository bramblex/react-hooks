import * as React from 'react'
import { HooksComponentState, HooksComponentStateSetters, HooksComponentStateDispatchers } from './hooks/state'
import { HooksComponentMemos } from './hooks/memo'
import { HooksComponentRefs, HooksComponentImperativeMethods } from './hooks/ref'
import { HooksComponentContexts, bindContexts } from './hooks/context'
import { HooksComponentEffects, runEffects, cleanupEffects } from './hooks/effect'
import { withContext } from './context';

export declare class HooksComponent<Props extends {} = {}> extends React.Component<Props, HooksComponentState> {
    public state: HooksComponentState
    public __hooks__: {
        ref: React.RefObject<HooksComponent<Props>>,
        setters: HooksComponentStateSetters,
        dispatchers: HooksComponentStateDispatchers,
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


export function bindComponent<Props extends {}>(ref: React.RefObject<HooksComponent<Props>>, renderFunc: RenderFunc<Props>) {
    const component = ref.current as HooksComponent<Props>
    return withContext(component, () => renderFunc(component.props, ref))
}

export function withHooks<Props extends React.RefAttributes<any>>(renderFunc: RenderFunc<Props>): React.ComponentClass<Props, HooksComponentState> {
    const HooksComponentClass = class extends React.Component<Props, HooksComponentState> {
        public state: HooksComponent['state'] = {}
        public __hooks__: HooksComponent<Props>['__hooks__'] = {
            ref: React.createRef(),
            setters: {},
            dispatchers: {},
            effects: {},
            layoutEffects: {},
            refs: {},
            contexts: {},
            memos: {},
            imperativeMethods: undefined,
        }

        constructor(props: Props) {
            super(props);
            (this.__hooks__.ref as any).current = this
            this.render = bindContexts(
                this.__hooks__.contexts,
                bindComponent(this.__hooks__.ref, renderFunc)
            )
        }

        componentWillMount() {
            runEffects(this.__hooks__.layoutEffects)
        }

        componentDidMount() {
            runEffects(this.__hooks__.effects)
        }

        componentWillUpdate() {
            runEffects(this.__hooks__.layoutEffects)
        }

        componentDidUpdate() {
            runEffects(this.__hooks__.effects)
        }

        componentWillUnmount() {
            cleanupEffects(this.__hooks__.effects)
            cleanupEffects(this.__hooks__.layoutEffects)
        }

    } as React.ComponentClass<Props, HooksComponentState>

    HooksComponentClass.displayName = (renderFunc as any).name
    return HooksComponentClass
}
