import buble from 'rollup-plugin-buble'
const {uglify} = require('rollup-plugin-uglify')
import typescript from 'rollup-plugin-typescript2'

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/react-hooks.min.js',
        format: 'umd',
        name: 'ReactHooks',
        sourcemap: true,
    },
    external: ['react'],
    plugins: [
        typescript(),
        buble(),
        // uglify()
    ]
}
