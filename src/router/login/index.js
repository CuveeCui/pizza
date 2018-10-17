import Loadable from 'react-loadable';
import Loading from 'components/loading';

export default {
  login: Loadable({
    loader: () => import(/* webpackChunkName: "login" */ 'pages/login'),
    loading: Loading
  })
};