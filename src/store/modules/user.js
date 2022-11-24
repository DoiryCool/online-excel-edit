import { login } from '@/api/login'
import { register } from '@/api/register'

const user = {
  actions: {
    // 登录
    Login({ commit }, userInfo) { //定义 Login 方法，在组件中使用 this.$store.dispatch("Login") 调用
      return new Promise((resolve, reject) => { //封装一个 Promise
        login(userInfo.username.trim(), userInfo.password).then(response => { //使用 login 接口进行网络请求
          commit('') //提交一个 mutation，通知状态改变
          resolve(response) //将结果封装进 Promise   
        }).catch(error => {
          reject(error)
        })
      })
    },
    Register({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo.username.trim(), userInfo.password, userInfo.email).then(response => {
          commit('') //提交一个 mutation，通知状态改变
          resolve(response) //将结果封装进 Promise   
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
export default user