import Loadable from 'react-loadable';
import Loading from '@/components/loading/com_loading';

export default {
  about: Loadable({
    loader: () => import(/* webpackChunkName: "home" */ '@/pages/about/pages_about'),
    loading: Loading
  })
};