import request from '@/utils/request'
 
export function register(username, password, email) {
  return request({
    url: '/api/user/register',
    method: 'post',
    params: {
        username,
        password,
        email
    }
  })
}