
export type HooksInputs = any[] | undefined

export function inputsChange(oldInputs: HooksInputs, newInputs: HooksInputs) {
    if (oldInputs && newInputs) {
        if (oldInputs.length > 0 && newInputs.length > 0) {
            if (oldInputs.length === newInputs.length) {
                for (let i = 0, l = oldInputs.length; i < l; i++) {
                    if (!Object.is(oldInputs[i], newInputs[i]) ) {
                        return true
                    }
                }
            } else {
                return true
            }
        }
        return false
    }
    return true
}
