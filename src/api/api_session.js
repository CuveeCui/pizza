import Fecth from '@/utils/utils_fetch';

class Api_session extends Fecth {
  constructor() {
    super();
    this.instance = null;
  }

  /*
  * build singleton
  * */
  static getInstance() {
    if (!this.instance) {
      this.instance = new Api_session();
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

export default Api_session.getInstance();