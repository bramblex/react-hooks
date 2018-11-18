import buble from 'rollup-plugin-buble'
import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'index.tsx',
    output: {
        file: 'index.js',
        format: 'cjs'
    },
    plugins: [
        typescript(),
        buble()
    ]
}
