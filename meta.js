module.exports = {
  prompt: [
    {
      type: 'list',
      name: 'project_type',
      message: 'Project type',
      choices: ['SPA', 'MPA']
    },
    {
      type: 'string',
      name: 'project_name',
      message: `Project name`,
    },
    {
      type: 'string',
      name: 'description',
      message: 'Project description'
    },
    {
      type: 'string',
      name: 'author',
      message: `Author`
    },
    {
      type: 'confirm',
      name: 'sentry',
      message: 'Use sentry to your code?',
      default: true
    }
  ],
  done: () => {

  }
}