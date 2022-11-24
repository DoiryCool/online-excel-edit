import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import '@element-plus/icons-vue';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import router from './router'
import store from './store'
import VueCookies from 'vue-cookies'
import { GcSpreadSheets, GcWorksheet, GcColumn } from '@grapecity/spread-sheets-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { back_port , ip} from './config/configs'

import axios from 'axios'
axios.defaults.baseURL = 'http://' + ip + ':' + back_port;

const app = createApp(App)
app.component('gc-spread-sheets', GcSpreadSheets);
app.component('gc-worksheet', GcWorksheet);
app.component('gc-column', GcColumn);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(store).use(VueCookies).use(ElementPlus, { locale }).mount('#app')
app.config.globalProperties.$http = axios
