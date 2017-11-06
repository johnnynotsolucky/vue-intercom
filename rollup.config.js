import vue from 'rollup-plugin-vue'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
  globals: { vue: 'Vue' },
  input: 'src/index.js',
  plugins: [
    resolve(),
    vue(),
    buble()
  ],
  output: [
    { file: 'dist/vue-intercom.js', format: 'umd', name: 'VueIntercom' }
  ]
}
