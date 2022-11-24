import { login } from '@/api/login'
import { register } from '@/api/register'

const user = {
  actions: {
    // Login
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.username.trim(), userInfo.password).then(response => {
          commit('')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // Register
    Register({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        register(userInfo.username.trim(), userInfo.password, userInfo.email).then(response => {
          commit('')
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}
export default user