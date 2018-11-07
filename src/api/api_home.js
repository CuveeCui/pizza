import Fecth from '@/utils/utils_fetch';

class ApiHome extends Fecth {
  constructor() {
    super();
    this.instance = null;
  }

  /*
  * build singleton
  * */
  static getInstance() {
    if (!this.instance) {
      this.instance = new ApiHome();
    }
    return this.instance;
  }

  /*
  * home interface
  * */
  home(url, data = {}, options = {}) {
    return this.post(url, data, options);
  }
  /*
  * test interface
  */
  test(url, data = {}, options = {}) {
    return this.get(url, data, options);
  }
}

export default ApiHome.getInstance();