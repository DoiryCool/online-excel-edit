import { createApp } from 'vue'
import App from '../App.vue'
import Vuex from 'vuex'
import user from './modules/user'
 
const app = createApp(App)
app.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user
  }
})
 
export default store