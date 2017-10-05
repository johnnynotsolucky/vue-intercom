export const callIf = (a, f) => a && f()

export const assert = (condition, msg) =>
  callIf(!condition, () => {
    throw new Error(`[vue-intercom] ${msg}`)
  })

export const is = (t, o) =>
  o instanceof t || (o !== null && o !== undefined && o.constructor === t)

export const mapInstanceToProps = (vm, props) => {
  const o = {}
  props.forEach(p => (o[p] = { get: () => vm[p] }))
  return o
}
