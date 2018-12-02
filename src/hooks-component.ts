import * as React from 'react'
import { HooksComponentState } from './hooks/state'

export declare class HooksComponent<Props extends {} = {}> extends React.Component<Props, HooksComponentState> {
    public state: HooksComponentState
}

export type RenderFunc<Props extends {}>
    = (props: Props, ref: React.RefObject<HooksComponent<Props>>) => React.ReactNode


export function withHooks<Props extends {}>(renderFunc: RenderFunc<Props>): React.ComponentClass<Props, HooksComponentState> {
    const HooksComponentClass = class extends React.Component<Props, HooksComponentState> {
    } as React.ComponentClass<Props, HooksComponentState>
    HooksComponentClass.displayName = (renderFunc as any).name
    return HooksComponentClass
}

// export function withHooks<Props>(rawRenderFunc: (props: Props) => React.ReactNode): React.FunctionComponent<Props> {

//   const componentClass = class extends React.Component<Props, IHooksComponentState> implements IHooksComponentExtension {
//     public state: IHooksComponentState = {}
//     public hooksEffect: IHooksComponentEffect = {}
//     public hooksEffectDelayed: Array<() => void> = []
//     public hooksContext: IHooksComponentContext = {}

//     private readonly renderFunc: () => React.ReactNode

//     constructor(props: Props) {
//       super(props)

//       // renderFunc 绑定 Hooks Context
//       const renderFunc = () => {
//         hooksContextPush(this)
//         const renderResult = rawRenderFunc(this.props)
//         hooksContextPop()
//         return renderResult
//       }

//       // 初始化执行
//       renderFunc()

//       // 看环境是否使用了 Context
//       const contexts = Object
//         .getOwnPropertyNames(this.hooksContext)
//         .map((useContextNu) => [useContextNu, this.hooksContext[parseInt(useContextNu)][1]]) as Array<[number, React.Context<any>]>

//       // 若使用 Context，则绑定所有 Context
//       if (contexts.length > 0) {
//         this.renderFunc = contexts.reduceRight((lastRenderFunc, [useContextNu, context]) => () => (
//           <context.Consumer>
//             {value => {
//               // 将 Context 更新的值存进 hooksContext 里面，以便 useContext 能更新所需要的值
//               this.hooksContext[useContextNu] = [value, context]
//               return lastRenderFunc()
//             }}
//           </context.Consumer>
//         ), renderFunc)
//       } else {
//         this.renderFunc = renderFunc
//       }

//       // 清理，避免 Effect 提前执行
//       this.hooksEffectDelayed = []
//       this.hooksEffect = {}
//     }

//     // 执行 Effect
//     public runEffect() {
//       for (const effectFunc of this.hooksEffectDelayed) {
//         effectFunc()
//       }
//       this.hooksEffectDelayed = []
//     }

//     // 清除 Effect
//     public cleanupEffect() {
//       for (const useEffectNu of Object.getOwnPropertyNames(this.hooksEffect)) {
//         const [cleanup] = this.hooksEffect[parseInt(useEffectNu)]
//         if (cleanup) {
//           cleanup()
//         }
//       }
//       this.hooksEffect = {}
//     }

//     public componentDidUpdate() {
//       this.runEffect()
//     }

//     public componentDidMount() {
//       this.runEffect()
//     }

//     public componentWillUnmount() {
//       this.cleanupEffect()
//     }

//     public render() {
//       return this.renderFunc()
//     }

//   }

//   // 获取组件名
//   Object.defineProperty(componentClass, 'name', { get: () => (rawRenderFunc as any).name })
//   return componentClass as any
// }
