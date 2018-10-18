module.exports = {
  prompt: {
    'project_type': {
      type: 'list',
      name: 'project_type',
      message: 'Project type',
      choices: ['SPA', 'MPA']
    },
    'project_name': {
      type: 'string',
      name: 'project_name',
      message: `Project name`,
    },
    'description': {
      type: 'string',
      name: 'description',
      message: 'Project description'
    },
    'author': {
      type: 'string',
      name: 'author',
      message: `Author`
    },
    'sentry': {
      type: 'confirm',
      name: 'sentry',
      message: 'Use sentry to your code?',
      default: true
    }
  },
  filters: {
    'meta.js': true,
    'server.js': true,
    '.gitignore': true,
    'test/*': true,
    'test/*/*': true,
    'sentry.properties': 'sentry',
    'yarn-error.log': true
  },
  skips: [],
  success: () => {

  }    
  
}