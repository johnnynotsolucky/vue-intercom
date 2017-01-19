module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  'rules': {
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-underscore-dangle': 0
  }
}
