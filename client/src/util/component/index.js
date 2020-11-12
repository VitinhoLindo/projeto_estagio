import VueQrcode from 'vue3-qrcode'
import { QrcodeStream } from 'vue3-qrcode-reader'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import Menu from '../../components/Menu.vue'

export default function (Vue) {
  // Vue.component('qr-code', VueQrcode);
  // Vue.component('read-qr-code', QrcodeStream);
  Vue.component('loading', Loading);
  Vue.component('error', Error);
  Vue.component('app-menu', Menu);
}