import request from '@/utils/request' //引入封装好的 axios 请求
 
export function register(username, password, email) { //登录接口
  return request({ //使用封装好的 axios 进行网络请求
    url: '/api/user/register',
    method: 'post',
    params: { //提交的数据
        username,
        password,
        email
    }
  })
}