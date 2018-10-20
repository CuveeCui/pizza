import Loadable from 'react-loadable';
import Loading from '@/components/loading/com_loading';

export default {
  link: Loadable({
    loader: () => import(/* webpackChunkName: "home" */ '@/pages/link/pages_link'),
    loading: Loading
  })
};