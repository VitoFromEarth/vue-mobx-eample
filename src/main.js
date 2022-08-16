import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import Observer from 'mobx-vue-lite';
import App from './App.vue';

createApp(App)
  .use(Antd)
  .use(Observer)
  .mount('#app')
