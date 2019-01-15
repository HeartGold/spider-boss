require('../lib/bootstrap')
const yargs = require('yargs')

const commands = {
  config: {
    desc: 'get jobs config',
    handler: () => require('../src/getConfig')
  },
  get: {
    isDefault: true,
    desc: 'get',
    handler: () => require('../src/index')
  },
  dev: {
    isDefault: true,
    desc: 'dev',
    handler: () => require('../src/hi')
  }
}

Object.keys(commands).forEach((command) => {
  const { desc, handler, isDefault } = commands[command]

  command = isDefault ? [command, '*'] : command
  yargs.command(command, desc, () => {}, args => {
    handler(args)
  })
})

// enable help (-h, --help, help)
yargs.help('h').alias('h', 'help')

// set locale
yargs.locale('en')

// run
yargs.argv
