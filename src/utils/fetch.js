import axios from 'axios';

/*
* fetch base class
* */
class Fetch {
  /*
  * build fetch methods, include `get`、`post`、`del`、`put`
  * */
  constructor() {
    this.fetch = this.generateInstance();
    this.get = this._fetch();
    this.post = this._fetch('post');
    this.put = this._fetch('put');
    this.del = this._fetch('delete');
  }

  /*
  * generate fetch instance
  * if u want to do somethind before request or after response, this will be useful
  * */
  generateInstance() {
    const instance = axios.create({
      baseURL: '',
      headers: {
        // 指定请求头
      }
    });

    instance.interceptors.request.use(config => {
      // Request interception, unified configuration


      return config;
    }, err => {
      // request error, unified handle

      return Promise.reject(err);
    });


    instance.interceptors.response.use(res => {
      // response interception, unified configuration

      return res;
    }, err => {
      // request error, unified handle

      return Promise.reject(err)
    });

    return instance;
  }

  /*
  * package request methods
  * expose a function which return promise instance
  * */
  _fetch(type = 'get') {
    let initData = Object.create(null);
    switch (type) {
      case 'get':
        initData['method'] = 'get';
        break;
      case 'post':
        initData['method'] = 'post';
        break;
      case 'put':
        initData['method'] = 'put';
        break;
      case 'delete':
        initData['method'] = 'delete';
        break;
      default:
        initData['method'] = type;
    }
    return (url, data, options) => {
      let originData;
      if (type === 'get') {
        originData = Object.assign(initData, {params: data}, options)
      } else {
        originData = Object.assign(initData, {data}, options)
      }
      return this.fetch(originData);
    }
  }
}

export default Fetch;

