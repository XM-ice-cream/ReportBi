module.exports = {
    root: true,
    env: {
        node: true,
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "vue/no-parsing-error": [2, {
            "x-invalid-end-tag": false
        }]
    }
}