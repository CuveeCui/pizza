import Fecth from 'utils/fetch';

class Session extends Fecth {
  constructor() {
    super();
    this.instance = null;
  }

  /*
  * build singleton
  * */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Session();
    }
    return this.instance;
  }

  /*
  * login interface
  * */
  login(url, data = {}, options = {}) {
    return this.post.bind(url, data, options);
  }
}

export default Session.getInstance();