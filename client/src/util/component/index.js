import VueQrcode from 'vue3-qrcode'
import { QrcodeStream } from 'vue3-qrcode-reader'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import Menu from '../../components/Menu.vue'
import AppAdd from '../../components/Add.vue'
import CreateItem from '../../components/CreateIten.vue'
import CreateMark from '../../components/CreateMark.vue'

export default function (Vue) {
  // Vue.component('qr-code', VueQrcode);
  // Vue.component('read-qr-code', QrcodeStream);
  Vue.component('loading', Loading);
  Vue.component('error', Error);
  Vue.component('app-menu', Menu);
  Vue.component('app-add', AppAdd);
  Vue.component('create-item', CreateItem);
  Vue.component('create-mark', CreateMark);
}