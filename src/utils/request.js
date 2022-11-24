import axios from 'axios' 
import { back_port , ip} from '../config/configs'

const service = axios.create({
  baseURL: 'http://' + ip + ':' + back_port,
  timeout: 15000, // 请求超时时间
})
 
export default service