import request from '@/utils/request'
 
export function login(username, password) {
  return request({
    url: '/api/user/login',
    method: 'post',
    params: {
        username,
        password
    }
  })
}