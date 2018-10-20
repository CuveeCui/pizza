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
    },
    'sensor': {
      type: 'confirm',
      name: 'sensor',
      message: 'Use sensor to your code?',
      default: true
    }
  },
  filters: {
    'meta.js': true,
    'server.js': true,
    '.gitignore': false,
    'test/*': true,
    'test/*/*': true,
    'sentry.properties': 'sentry',
    'yarn-error.log': true
  },
  skips: [],
  success: (name, to,logger) => {
    return new Promise((resolve,reject) => {
      require('child_process').exec(
        `
        cd ${to} \n 
        yarn install --registry=https://registry.npm.taobao.org \n
        `,
        (err, stdout, stderr) => {
          if (err) {
            logger.fatal(err);
            reject(err);
          }
          logger.success(stdout);
          logger.log(`To start: \n\t\t\t\tcd ${name}\n\t\t\t\tyarn start or yarn run dev\n\t\t\t\tyarn run build`);
          resolve();
        }
      )
    })
  }    
  
}