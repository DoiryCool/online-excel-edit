var websock = null;
var global_callback = null;
var serverPort = "8181/socket/edit/"; // webSocket连接端口
var wsuri = "ws://20.160.144.194:" + serverPort;

let interval;
function createWebSocket(username, callback) {
  if (websock == null || typeof websock !== WebSocket) {
    initWebSocket(username, callback);
  } 
}
function initWebSocket(username, callback) {
  global_callback = callback;
  // 初始化websocket
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
  // 连接发生错误的回调方法
  websock.onerror = function () {
    console.log("WebSocket连接发生错误");
     //createWebSocket();啊，发现这样写会创建多个连接，加延时也不行
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
// 实际调用的方法
function sendSock(agentData ) {
  
  if (websock.readyState === websock.OPEN) {
    // 若是ws开启状态
    websocketsend(agentData);
  } else if (websock.readyState === websock.CONNECTING) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData);
    }, 1000);
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData);
    }, 1000);
  }
}
function closeSock() {
  websock.close();
}
// 数据接收
function websocketonmessage(msg) {
  // console.log("收到数据："+JSON.parse(e.data));
  // console.log("收到数据："+msg);
  // global_callback(JSON.parse(msg.data));
  // 收到信息为Blob类型时
  let result = null;
  // debugger
  if (msg.data instanceof Blob) {
    const reader = new FileReader();
    reader.readAsText(msg.data, "UTF-8");
    reader.onload = (e) => {
      result = JSON.parse(reader.result);
      //console.log("websocket收到", result);
      global_callback(result);
    };
  } else {
    result = JSON.parse(msg.data);
    global_callback(result);
  }
}
// 数据发送
function websocketsend(agentData) {
  console.log("发送数据：" + agentData);
  clearInterval(interval);
  websock.send(agentData);
}
// 关闭
function websocketclose(e) {
  console.log("connection closed (" + e.code + ")");
}
function websocketOpen(e) {
  console.log("连接打开");
}
export { sendSock, createWebSocket, closeSock };
