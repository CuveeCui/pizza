module.exports = {
  prompt: {
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
    },
    'ie': {
      type: 'confirm',
      name: 'ie',
      message: 'Compatible your code to IE?',
      default: false
    },
    'eslint': {
      type: 'confirm',
      name: 'eslint',
      message: 'Use eslint to your code?',
      default: true
    }
  },
  filters: {
    'meta.js': true,
    'server.js': true,
    'test/*': true,
    'test/*/*': true,
    'sentry.properties': 'sentry',
    '.eslintrc.js': 'eslint',
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