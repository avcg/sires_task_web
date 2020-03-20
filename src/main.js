import Vue from 'vue';
import './assets/styles/line-awesome.css';
import './assets/styles/animate.css';
import './plugins/ant';
import './plugins/s-components';
import './plugins/click-outside';
import './plugins/text-area-autosize';

import moment from 'moment';
import router from './router/index';
import store from './store';
import App from './App';

Vue.prototype.moment = moment;

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  store.commit('closeTaskViewAndAdd');
  next();
});

Vue.router = router;

Vue.use(require('../node_modules/@websanova/vue-auth'), {
  auth: {
    request(req, token) {
      // eslint-disable-next-line no-underscore-dangle
      this.options.http._setHeaders.call(this, req, { Authorization: `Bearer ${token}` });
    },
    response(res) {
      // return (res.data || {}).jwt;
      return (res.data || {}).token;
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
  // eslint-disable-next-line global-require
  http: require('../node_modules/@websanova/vue-auth/drivers/http/axios.1.x.js'),
  // eslint-disable-next-line global-require
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
