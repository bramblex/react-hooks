
import * as React from 'react'
import { HooksComponentState } from '../src/hooks/state'
import { bindContexts } from '../src/hooks/context'
import { runEffects, cleanupEffects } from '../src/hooks/effect'
import { RenderFunc, HooksComponent, bindComponent } from '../src/hooks-component';

export function fakeWithHooks<Props extends {}>(renderFunc: RenderFunc<Props>): React.ComponentClass<Props, HooksComponentState> {
    const HooksComponentClass = class {
        public state: HooksComponent['state'] = {}
        public __hooks__: HooksComponent['__hooks__'] = {
            setters: {},
            dispatchers: {},
            effects: {},
            layoutEffects: {},
            refs: {},
            contexts: {},
            memos: {},
            imperativeMethods: undefined
        }

        public render: () => React.ReactNode
        public props: Props

        constructor(props: Props) {
            this.props = props
            this.render = bindContexts(
                this.__hooks__.contexts,
                bindComponent(this as any, renderFunc)
            )
        }

        setState(state: Partial<HooksComponentState>, callback?: () => void) {
            this.state = { ...this.state, ...state }
            callback && callback()
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

    } as any as React.ComponentClass<Props, HooksComponentState>

    HooksComponentClass.displayName = (renderFunc as any).name
    return HooksComponentClass
}
