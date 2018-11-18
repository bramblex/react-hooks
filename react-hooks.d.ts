import * as React from 'react';
export declare function useState<T>(defaultValue: T): [T, (value: T, callback?: () => void) => void];
export declare function useEffect(effectFunc: () => ((() => void) | void), dependencies?: any[]): void;
export declare function useContext<T>(componentContext: React.Context<T>): T;
export declare function withHooks<Props>(rawRenderFunc: (props: Props) => React.ReactNode): React.FunctionComponent<Props>;
