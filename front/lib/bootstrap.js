'use strict'

const fs = require('fs')
const path = require('path')
const ts = require('typescript')

const compilerOptions = ts.readConfigFile(
  path.join(__dirname, '../tsconfig.json'),
  p => {
    return fs.readFileSync(p, 'utf-8')
  }
).config

const oldRequireTs = require.extensions['.ts']
require.extensions['.ts'] = function(m, filename) {
  if (filename.match(/node_modules/)) {
    if (oldRequireTs) {
      return oldRequireTs(m, filename)
    }
    return m._compile(fs.readFileSync(filename), filename)
  }

  // Node requires all require hooks to be sync.
  const source = fs.readFileSync(filename).toString()

  try {
    let result = ts.transpile(
      source,
      compilerOptions['compilerOptions'],
      filename
    )

    // Send it to node to execute.
    return m._compile(result, filename)
  } catch (err) {
    console.error('Error while running script "' + filename + '":')
    console.error(err.stack)
    throw err
  }
}
