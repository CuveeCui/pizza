const Koa = require('koa');
const KoaStatic = require('koa-static');
const chalk = require('chalk');
const {
  resolve
} = require('path');
const app = new Koa();

app.use(KoaStatic(
  resolve(__dirname, 'dist')
))


app.listen(3003, () => {
  console.log(chalk.green('server is running on http://127.0.0.1:3003'));
  try {
    require('child_process').exec('open http://127.0.0.1:3003');
  } catch(e) {}
})