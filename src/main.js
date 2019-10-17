import Vue from 'vue';
import './assets/styles/line-awesome.css';
import './assets/styles/animate.css';
import '../node_modules/vue-date-pick/dist/vueDatePick.css';
import vClickOutside from 'v-click-outside';
import VueTextareaAutosize from 'vue-textarea-autosize';
import DatePick from 'vue-date-pick';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import moment from 'moment';
import store from './store';
import SComponents from './components/common';
import router from './router/index';
import App from './App';

Vue.prototype.moment = moment;

Vue.use(Antd);
SComponents.forEach((component) => {
  Vue.component(component.name, component);
});

Vue.component('date-pick', DatePick);
Vue.use(VueTextareaAutosize);
Vue.use(vClickOutside);


Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
  store.commit('closeTaskViewAndAdd');
  next();
});
Vue.router = router;
Vue.use(require('../node_modules/@websanova/vue-auth'), {
  auth: {
    request(req, token) {
      this.options.http._setHeaders.call(this, req, { Authorization: `Bearer ${token}` });
    },
    response(res) {
      return (res.data || {}).jwt;
    },
  },
  registerData: {
    url: 'users',
    method: 'POST',
  },
  loginData: {
    url: 'sign_in',
  },
  rolesVar: 'role',
  fetchData: { url: 'current_user', method: 'GET', enabled: true },
  parseUserData(data) {
    return data.user;
  },
  refreshData: {
    url: 'current_user', method: 'GET', enabled: true, interval: 30,
  },
  http: require('../node_modules/@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('../node_modules/@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
