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
// import { Designer } from "@grapecity/spread-sheets-designer-vue"
import axios from 'axios'
axios.defaults.baseURL = 'http://20.160.144.194:8181'

const app = createApp(App)
app.component('gc-spread-sheets', GcSpreadSheets);
app.component('gc-worksheet', GcWorksheet);
app.component('gc-column', GcColumn);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router).use(store).use(VueCookies).use(ElementPlus, { locale }).mount('#app')
app.config.globalProperties.$http = axios

//this.$cookies.config("1d","/") //set cookies time = 1d & "/"
