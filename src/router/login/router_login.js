import Loadable from 'react-loadable';
import Loading from '@/components/loading/com_loading';

export default {
  login: Loadable({
    loader: () => import(/* webpackChunkName: "login" */ 'pages/login'),
    loading: Loading
  })
};