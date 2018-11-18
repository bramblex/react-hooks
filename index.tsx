import * as React from 'react'

interface IHooksComponentState {
  [nu: number]: any
}

interface IHooksComponentEffect {
  [nu: number]: [(() => void) | null, any[] | null]
}

interface IHooksComponentContext {
  [nu: number]: [any, React.Context<any>]
}

interface IHooksComponentExtension {
  state: IHooksComponentState
  hooksEffect: IHooksComponentEffect
  hooksContext: IHooksComponentContext
  hooksEffectDelayed: Array<() => void>
}

type IHooksComponent = React.Component<any, IHooksComponentState> & IHooksComponentExtension

interface IHooksContext {
  component: IHooksComponent
  useStateNu: number
  useEffectNu: number
  useContextNu: number
}

const hooksContextStack: IHooksContext[] = []

function hooksContextNew(component: IHooksComponent): IHooksContext {
  return {component, useEffectNu: 0, useStateNu: 0, useContextNu: 0}
}

function hooksContextPush(component: IHooksComponent): void {
  hooksContextStack.push(hooksContextNew(component))
}

function hooksContextPop(): void {
  hooksContextStack.pop()
}

function hooksContextTop(): IHooksContext {
  return hooksContextStack[hooksContextStack.length - 1]
}

export function useState<T>(defaultValue: T): [T, (value: T, callback?: () => void) => void] {
  const context = hooksContextTop()
  const component = context.component
  const useStateNu = context.useStateNu++
  const setState = (value: T, callback?: () => void) => component.setState({[useStateNu]: value}, callback)

  const state = component.state

  if (!state.hasOwnProperty(useStateNu)) {
    state[useStateNu] = defaultValue
  }
  return [state[useStateNu], setState]
}

function isDependenciesChange(dependencies: any[] | null | undefined, lastDependencies: any[] | null | undefined) {
  if (!dependencies || !lastDependencies) {
    return true
  }
  for (let i = 0, l = Math.max(dependencies.length, lastDependencies.length); i < l; i++) {
    if (dependencies[i] !== lastDependencies[i]) {
      return true
    }
  }
  return false
}

export function useEffect(effectFunc: () => ((() => void) | void), dependencies?: any[]): void {
  const context = hooksContextTop()
  const useEffectNu = context.useEffectNu++

  const {hooksEffect, hooksEffectDelayed} = context.component

  function runEffect() {
    const cleanup = effectFunc()
    hooksEffect[useEffectNu] = [cleanup || null, dependencies || null]
  }

  if (hooksEffect.hasOwnProperty(useEffectNu)) {
    const [cleanup, lastDependencies] = hooksEffect[useEffectNu]
    if (isDependenciesChange(dependencies, lastDependencies)) {
      hooksEffectDelayed.push(() => {
        if (cleanup) {
          cleanup()
        }
        runEffect()
      })
    }
  } else {
    hooksEffectDelayed.push(runEffect)
  }
}

export function useContext<T>(componentContext: React.Context<T>): T {
  const context = hooksContextTop()
  const useContextNu = context.useContextNu++
  const {component} = context
  if (component.hooksContext.hasOwnProperty(useContextNu)) {
    const [value] = component.hooksContext[useContextNu]
    return value
  } else {
    const value = (componentContext as any)._currentValue
    component.hooksContext[useContextNu] = [value, componentContext]
    return value
  }
}

export function withHooks<Props>(rawRenderFunc: (props: Props) => React.ReactNode): React.FunctionComponent<Props> {

  const componentClass = class extends React.Component<Props, IHooksComponentState> implements IHooksComponentExtension {
    public state: IHooksComponentState = {}
    public hooksEffect: IHooksComponentEffect = {}
    public hooksEffectDelayed: Array<() => void> = []
    public hooksContext: IHooksComponentContext = {}

    private readonly renderFunc: () => React.ReactNode

    constructor(props: Props) {
      super(props)

      // renderFunc 绑定 Hooks Context
      const renderFunc = () => {
        hooksContextPush(this)
        const renderResult = rawRenderFunc(this.props)
        hooksContextPop()
        return renderResult
      }

      // 初始化执行
      renderFunc()

      // 看环境是否使用了 Context
      const contexts = Object
        .getOwnPropertyNames(this.hooksContext)
        .map((useContextNu) => [useContextNu, this.hooksContext[parseInt(useContextNu)][1]]) as Array<[number, React.Context<any>]>

      // 若使用 Context，则绑定所有 Context
      if (contexts.length > 0) {
        this.renderFunc = contexts.reduceRight((lastRenderFunc, [useContextNu, context]) => () => (
          <context.Consumer>
            {value => {
              // 将 Context 更新的值存进 hooksContext 里面，以便 useContext 能更新所需要的值
              this.hooksContext[useContextNu] = [value, context]
              return lastRenderFunc()
            }}
          </context.Consumer>
        ), renderFunc)
      } else {
        this.renderFunc = renderFunc
      }

      // 清理，避免 Effect 提前执行
      this.hooksEffectDelayed = []
      this.hooksEffect = {}
    }

    // 执行 Effect
    public runEffect() {
      for (const effectFunc of this.hooksEffectDelayed) {
        effectFunc()
      }
      this.hooksEffectDelayed = []
    }

    // 清除 Effect
    public cleanupEffect() {
      for (const useEffectNu of Object.getOwnPropertyNames(this.hooksEffect)) {
        const [cleanup] = this.hooksEffect[parseInt(useEffectNu)]
        if (cleanup) {
          cleanup()
        }
      }
      this.hooksEffect = {}
    }

    public componentDidUpdate() {
      this.runEffect()
    }

    public componentDidMount() {
      this.runEffect()
    }

    public componentWillUnmount() {
      this.cleanupEffect()
    }

    public render() {
      return this.renderFunc()
    }

  }

  // 获取组件名
  Object.defineProperty(componentClass, 'name', { get: () => (rawRenderFunc as any).name })
  return componentClass as any
}
