import vue from 'rollup-plugin-vue'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'
import strip from 'rollup-plugin-strip'

export default {
  globals: { vue: 'Vue' },
  input: 'src/index.js',
  plugins: [
    resolve(),
    vue(),
    buble(),
    strip({
      functions: [ 'console.log' ]
    })
  ],
  output: [
    { file: 'dist/vue-intercom.js', format: 'umd', name: 'VueIntercom' }
  ]
}
