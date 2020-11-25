import VueQrcode from 'vue3-qrcode'
import { QrcodeStream } from 'vue3-qrcode-reader'
import Loading from '../../components/Loading.vue'
import Error from '../../components/Error.vue'
import Menu from '../../components/Menu.vue'
import AppAdd from '../../components/Add.vue'
import CreateItem from '../../components/CreateIten.vue'
import CreateMark from '../../components/CreateMark.vue'
import CreateCollaborator from '../../components/CreateCollaborator.vue'
import MarkInformation from '../../components/MarkInformation.vue'
import CollaborationInformation from '../../components/CollaborationInformation.vue'
import ItenInformation from '../../components/ItenInformation.vue'
import CreateRent from '../../components/CreateRent.vue'
import RentInformation from '../../components/RentInformation.vue'

export default function (Vue) {
  // Vue.component('qr-code', VueQrcode);
  // Vue.component('read-qr-code', QrcodeStream);

  Vue.component('loading', Loading);
  Vue.component('error', Error);
  Vue.component('app-menu', Menu);
  Vue.component('app-add', AppAdd);
  Vue.component('create-item', CreateItem);
  Vue.component('create-mark', CreateMark);
  Vue.component('create-collaborator', CreateCollaborator);
  Vue.component('create-rent', CreateRent);
  Vue.component('mark-information', MarkInformation);
  Vue.component('collaboration-information', CollaborationInformation);
  Vue.component('iten-information', ItenInformation);
  Vue.component('rent-information', RentInformation);
}