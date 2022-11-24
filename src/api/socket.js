import { back_port , ip} from '../config/configs'
var websock = null;
var global_callback = null;
var serverRouter = "/socket/edit/";
var wsuri = "ws://" + ip + ":" + back_port + serverRouter;

let interval;
function createWebSocket(username, callback) {
  if (websock == null || typeof websock !== WebSocket) {
    initWebSocket(username, callback);
  } 
}
function initWebSocket(username, callback) {
  global_callback = callback;
  websock = new WebSocket(wsuri + username);
  websock.onmessage = function (e) {
    websocketonmessage(e);
  };
  websock.onclose = function (e) {
    websocketclose(e);
  };
  websock.onopen = function () {
    websocketOpen();
    interval = setInterval(clock,20 * 1000);
  };
  websock.onerror = function () {
    console.log("WebSocket连接发生错误");
  };
}

function clock() {
    let message = {
        "msg": "ping"
      };
    if(websock.readyState === websock.OPEN){
      sendSock(JSON.stringify(message));
    }
}
function sendSock(agentData ) {
  
  if (websock.readyState === websock.OPEN) {
    websocketsend(agentData);
  } else if (websock.readyState === websock.CONNECTING) {
    setTimeout(function () {
      sendSock(agentData);
    }, 1000);
  } else {
    setTimeout(function () {
      sendSock(agentData);
    }, 1000);
  }
}
function closeSock() {
  websock.close();
}

function websocketonmessage(msg) {
  let result = null;
  // debugger
  if (msg.data instanceof Blob) {
    const reader = new FileReader();
    reader.readAsText(msg.data, "UTF-8");
    reader.onload = (e) => {
      result = JSON.parse(reader.result);
      global_callback(result);
    };
  } else {
    result = JSON.parse(msg.data);
    global_callback(result);
  }
}
function websocketsend(agentData) {
  console.log("发送数据：" + agentData);
  clearInterval(interval);
  websock.send(agentData);
}
function websocketclose(e) {
  console.log("connection closed (" + e.code + ")");
}
function websocketOpen(e) {
  console.log("连接打开");
}
export { sendSock, createWebSocket, closeSock };
