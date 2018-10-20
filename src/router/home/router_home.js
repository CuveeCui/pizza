import Loadable from 'react-loadable';
import Loading from '@/components/loading/com_loading';

export default {
  home: Loadable({
    loader: () => import(/* webpackChunkName: "home" */ '@/pages/home/pages_home'),
    loading: Loading
  })
};