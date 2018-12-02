
export type HooksInputs = any[] | undefined

export function inputsChange(oldInputs: HooksInputs, newInputs: HooksInputs) {
    if (oldInputs && newInputs) {
        if (oldInputs.length > 0 && oldInputs.length === newInputs.length) {
            for (let i = 0, l = oldInputs.length; i < l; i++) {
                if (oldInputs[i] !== newInputs[i]) {
                    return true
                }
            }
        }
        return false
    }
    return true
}