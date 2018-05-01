// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store';
import { Group, Cell , XButton , Popup , XInput , XDialog , Icon , PopupHeader , Flexbox , FlexboxItem ,  Divider , CheckIcon , AlertPlugin} from 'vux'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import router from './router'
import App from './App'

FastClick.attach(document.body)

Vue.config.productionTip = false
Vue.component('Group', Group);
Vue.component('Cell', Cell);
Vue.component('XButton', XButton);
Vue.component('Popup', Popup);
Vue.component('XInput', XInput);
Vue.component('XDialog', XDialog);
Vue.component('Icon', Icon);
Vue.component('PopupHeader', PopupHeader);
Vue.component('Flexbox', Flexbox);
Vue.component('FlexboxItem', FlexboxItem);
Vue.component('Divider', Divider);
Vue.component('CheckIcon', CheckIcon);

Vue.use(AlertPlugin)
window.top_vue=new Vue({
  router,
  store: store,
  render: h => h(App)
}).$mount('#app-box')
