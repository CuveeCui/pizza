module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "browsers": [
            "> 1%",
            "last 5 versions",
            "not ie <= 8"
          ]
        }
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import"
  ],
  "env": {
    "test": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "modules": "commonjs",
            "targets": {
              "browsers": [
                "> 1%",
                "last 5 versions",
                "not ie <= 8"
              ]
            }
          }
        ],
        "@babel/preset-react"
      ]
    }
  }
}