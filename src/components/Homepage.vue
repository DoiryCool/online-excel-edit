<template>
  <el-container>
    <!-- <el-header class="nav">Router</el-header> -->
    <el-main>
      <el-row>
        <el-col :span="18">
          <el-row>
            <el-col :span="5">
              <el-table :data="tableData" stripe height="650">
                <!-- <el-table-column fixed="true" type="index" width="30" /> -->
                <el-table-column prop="filename" label="文件名" width="85" />
                <el-table-column prop="auther" label="所有者" width="80" />
                <el-table-column>
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      @click.native.prevent="download(scope.row)"
                      ><el-icon><FolderOpened /></el-icon
                    ></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="19">
              <el-row>
                <gc-spread-sheets
                  class="spread-host"
                  @workbookInitialized="initSpread"
                >
                  <gc-worksheet></gc-worksheet>
                  <gc-worksheet></gc-worksheet>
                  <gc-worksheet></gc-worksheet>
                </gc-spread-sheets>
                <el-row id="statusBar"></el-row>
              </el-row>
              <el-row>
                <el-col :span="11" class="options-container">
                  <el-row class="options-container">
                    <el-row class="inputContainer">
                      <input
                        type="file"
                        id="fileDemo"
                        class="input"
                        @change="changeFileDemo"
                      />
                      <el-button
                        type="primary"
                        size="small"
                        id="loadExcel"
                        class="button"
                        @click="loadExcel"
                      >
                        导入
                        <el-icon><Upload /></el-icon>
                      </el-button>
                    </el-row>
                    <el-row class="inputContainer">
                      <input
                        id="exportFileName"
                        value="default.xlsx"
                        @change="changeExportFileName"
                      />
                      <el-button
                        type="primary"
                        size="small"
                        id="saveExcel"
                        @click="saveExcel"
                      >
                        导出
                        <el-icon><Download /></el-icon>
                      </el-button>
                    </el-row>
                  </el-row>
                </el-col>
                <el-col :span="13" class="options-container">
                  <el-row>
                    <el-button type="primary" @click="print()">
                      打印<el-icon><View /></el-icon>
                    </el-button>
                    <el-button type="primary" @click="hAlignLeft()">
                      <el-icon><Back /></el-icon>左对齐
                    </el-button>
                    <el-button type="primary" @click="hAlignRight()">
                      <el-icon><Right /></el-icon>右对齐
                    </el-button>
                  </el-row>
                  <el-row>
                    <input
                      id="uploadFileName"
                      value="default.xlsx"
                      class="input"
                      @change="changeUploadFileName"
                    />
                    <el-button type="primary" @click="upload()">
                      上传<el-icon><Upload /></el-icon>
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <!-- <el-col :span="1"></el-col> -->
        <el-col :span="6">
          <el-row>
            <el-card style="width: 450px; height: 150px; color: #333">
              <div style="padding-bottom: 10px; border-bottom: 1px solid #ccc">
                在线用户<span style="font-size: 12px"
                  >（点击聊天气泡开始聊天）</span
                >
              </div>
              <div
                style="padding: 10px 0"
                v-for="user in users"
                :key="user.username"
              >
                <span>{{ user.username }}</span>
                <el-icon
                  class="el-icon-chat-dot-round"
                  style="margin-left: 10px; font-size: 16px; cursor: pointer"
                  @click="chatUser = user.username"
                  ><ChatRound
                /></el-icon>
                <span
                  style="font-size: 12px; color: limegreen; margin-left: 5px"
                  v-if="user.username === chatUser"
                  >chatting...</span
                >
              </div>
            </el-card>
            <div
              style="
                width: 450px;
                margin: 0 auto;
                background-color: white;
                border-radius: 5px;
                box-shadow: 0 0 10px #ccc;
              "
            >
              <div style="text-align: center; line-height: 50px">
                Web聊天室（{{ chatUser }}）
              </div>
              <div
                style="
                  height: 350px;
                  overflow: auto;
                  border-top: 1px solid #ccc;
                "
                v-html="content"
              ></div>
              <div style="height: 100px">
                <el-input
                  v-model="text"
                  :autosize="{ minRows: 4 }"
                  type="textarea"
                ></el-input>
                <div style="text-align: right; padding-right: 10px">
                  <el-button type="primary" size="small" @click="send"
                    >发送</el-button
                  >
                </div>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import request from "@/utils/request";
let socket;
// import httpUtils from "@/HttpUtils.ts"
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import "@grapecity/spread-sheets-vue";
import "@grapecity/spread-sheets-charts";
import "@grapecity/spread-sheets-resources-zh";
import "@grapecity/spread-sheets-print";
import * as GC from "@grapecity/spread-sheets";
import * as ExcelIO from "@grapecity/spread-excelio";
import { saveAs } from "file-saver";
import axios from "axios";
// import { HttpStatusCode } from "axios";

import { sendSock, createWebSocket, closeSock } from "@/api/socket";
GC.Spread.Common.CultureManager.culture("zh-ch");
//   var SpreadJSKey = "xxxx";
//   GC.Spread.Sheets.LicenseKey = SpreadJSKey;

// You need to license the ExcelIO module separately using the same license key
//   ExcelIO.LicenseKey = SpreadJSKey;
let interval;

export default {
  name: "Im",
  data: function () {
    return {
      tableData: [],
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      user: {},
      isCollapse: false,
      users: [],
      chatUser: "",
      text: "",
      messages: [],
      content: "",
      autoGenerateColumns: false,
      spread: null,
      eventLog: "",
      filePath: "",
    };
  },
  created() {
    this.init();
    axios
      .post("http://20.160.144.194:8181/api/files/all")
      .then((response) => {
        this.tableData = response.data;
      })
      .catch(function (response) {
        console.log(response);
      })
      .then(function (response) {
        console.log(response);
      });
  },
  methods: {
    sendSuccess() {
      this.$message({ type: "success", message: "seccess" });
    },
    sendFail() {
      this.$message({ type: "warning", message: "failed" });
    },
    send() {
      if (!this.chatUser) {
        this.$message({ type: "warning", message: "请选择聊天对象" });
        return;
      }
      if (!this.text) {
        this.$message({ type: "warning", message: "请输入内容" });
      } else {
        if (typeof WebSocket == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");
          let message = {
            from: this.user.username,
            to: this.chatUser,
            text: this.text,
          };
          socket.send(JSON.stringify(message));
          this.messages.push({ user: this.user.username, text: this.text });
          this.createContent(null, this.user.username, this.text);
          this.text = "";
        }
      }
    },
    createContent(remoteUser, nowUser, text) {
      let html;
      if (nowUser) {
        html =
          '<div class="el-row" style="padding: 5px 0">\n' +
          '  <div class="el-col el-col-22" style="text-align: right; padding-right: 4px">\n' +
          '    <div class="tip left">' +
          text +
          "</div>\n" +
          "  </div>\n" +
          '  <div class="el-col el-col-2">\n' +
          '  <span class="el-avatar el-avatar--circle" style="height: 40px; width: 35px; line-height: 40px;">\n' +
          '    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover;">\n' +
          "  </span>\n" +
          "  </div>\n" +
          "</div>";
      } else if (remoteUser) {
        html =
          '<div class="el-row" style="padding: 5px 0">\n' +
          '  <div class="el-col el-col-2" style="text-align: right">\n' +
          '  <span class="el-avatar el-avatar--circle" style="height: 40px; width: 40px; line-height: 40px;">\n' +
          '    <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" style="object-fit: cover;">\n' +
          "  </span>\n" +
          "  </div>\n" +
          '  <div class="el-col el-col-22" style="text-align: left; padding-left: 10px">\n' +
          '    <div class="tip right">' +
          text +
          "</div>\n" +
          "  </div>\n" +
          "</div>";
      }
      console.log(html);
      this.content += html;
    },
    init() {
      let _this = this;
      if (typeof WebSocket == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
      }

      this.user = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
      let username = this.user.username;

      createWebSocket(username, this.global_callback);
      let socketUrl = "ws://20.160.144.194:8181/socket/imserver/" + username;
      if (socket != null) {
        socket.close();
        socket = null;
      }
      // 开启一个websocket服务
      socket = new WebSocket(socketUrl);
      socket.onopen = function () {
        interval = setInterval(() => {
          let message = {
            msg: "pingc",
          };
          socket.send(JSON.stringify(message));
        }, 10 * 1000);
        console.log("websocket已打开");
      };
      socket.onmessage = function (msg) {
        console.log("收到数据====" + msg.data);
        let data = JSON.parse(msg.data);
        if (data.users) {
          _this.users = data.users.filter((user) => user.username !== username);
        } else {
          if (data.from === _this.chatUser) {
            _this.messages.push(data);
            _this.createContent(data.from, null, data.text);
          }
        }
      };
      //关闭事件
      socket.onclose = function () {
        console.log("websocket已关闭");
        clearInterval(interval);
      };
      //发生了错误事件
      socket.onerror = function () {
        console.log("websocket发生了错误");
      };
    },
    initSpread: function (spread) {
      this.spread = spread;
      spread.suspendPaint();
      let spreadNS = GC.Spread.Sheets;
      let self = this;
      let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
        document.getElementById("statusBar")
      );
      statusBar.bind(spread);
      spread.resumePaint();
      spread.bind(spreadNS.Events.ActiveSheetChanged, function (e, args) {
        self.eventLog =
          "SpreadEvent: " +
          GC.Spread.Sheets.Events.ActiveSheetChanged +
          " event called" +
          "\n" +
          "oldSheetName: " +
          args.oldSheet.name() +
          "\n" +
          "newSheetName: " +
          args.newSheet.name();
      });
      spread.bind(spreadNS.Events.CellClick, function (e, args) {
        let sheetArea =
          args.sheetArea === 0
            ? "sheetCorner"
            : args.sheetArea === 1
            ? "columnHeader"
            : args.sheetArea === 2
            ? "rowHeader"
            : "viewPort";
        self.eventLog =
          "SpreadEvent: " +
          GC.Spread.Sheets.Events.CellClick +
          " event called" +
          "\n" +
          "sheetArea: " +
          sheetArea +
          "\n" +
          "row: " +
          args.row +
          "\n" +
          "col: " +
          args.col;
      });

      spread.bind(spreadNS.Events.SelectionChanging, function (e, args) {
        let selection = args.newSelections.pop();
        let sheetArea =
          args.sheetArea === 0
            ? "sheetCorner"
            : args.sheetArea === 1
            ? "columnHeader"
            : args.sheetArea === 2
            ? "rowHeader"
            : "viewPort";
        self.eventLog =
          "SpreadEvent: " +
          GC.Spread.Sheets.Events.SelectionChanging +
          " event called" +
          "\n" +
          "sheetArea: " +
          sheetArea +
          "\n" +
          "row: " +
          selection.row +
          "\n" +
          "column: " +
          selection.col +
          "\n" +
          "rowCount: " +
          selection.rowCount +
          "\n" +
          "colCount: " +
          selection.colCount;
      });
      spread.bind(spreadNS.Events.SelectionChanged, function (e, args) {
        let selection = args.newSelections.pop();
        if (selection.rowCount > 1 && selection.colCount > 1) {
          let sheetArea =
            args.sheetArea === 0
              ? "sheetCorner"
              : args.sheetArea === 1
              ? "columnHeader"
              : args.sheetArea === 2
              ? "rowHeader"
              : "viewPort";
          self.eventLog =
            "SpreadEvent: " +
            GC.Spread.Sheets.Events.SelectionChanged +
            " event called" +
            "\n" +
            "sheetArea: " +
            sheetArea +
            "\n" +
            "row: " +
            selection.row +
            "\n" +
            "column: " +
            selection.col +
            "\n" +
            "rowCount: " +
            selection.rowCount +
            "\n" +
            "colCount: " +
            selection.colCount;
        }
      });
      spread.bind(spreadNS.Events.EditStarting, function (e, args) {
        self.eventLog =
          "SpreadEvent: " +
          GC.Spread.Sheets.Events.EditStarting +
          " event called" +
          "\n" +
          "row: " +
          args.row +
          "\n" +
          "column: " +
          args.col;
      });
      spread.bind(spreadNS.Events.EditEnded, function (e, args) {
        self.eventLog =
          "SpreadEvent: " +
          GC.Spread.Sheets.Events.EditEnded +
          " event called" +
          "\n" +
          "row: " +
          args.row +
          "\n" +
          "column: " +
          args.col +
          "\n" +
          "text: " +
          args.editingText;

        this.user = sessionStorage.getItem("user")
          ? JSON.parse(sessionStorage.getItem("user"))
          : {};
        let username = this.user.username;
        let message = {
          row: args.row,
          col: args.col,
          text: args.editingText,
        };
        sendSock(JSON.stringify(message));
      });
      spread.resumePaint();
    },
    global_callback(msg) {
      let spread = this.spread;
      let sheet = spread.getActiveSheet();
      sheet.setText(msg.row, msg.col, msg.text);
    },
    changeFileDemo(e) {
      this.importExcelFile = e.target.files[0];
    },
    changeExportFileName(e) {
      this.exportFileName = e.target.value;
      document.getElementById("exportFileName").value = e.target.value;
    },
    changeUploadFileName(e) {
      this.uploadFileName = e.target.value;
      document.getElementById("uploadFileName").value = e.target.value;
    },
    loadExcel() {
      let spread = this.spread;
      let excelIo = new ExcelIO.IO();
      let excelFile = this.importExcelFile;
      excelIo.open(
        excelFile,
        function (json) {
          spread.fromJSON(json);
          document.getElementById("exportFileName").value = excelFile.name;
          document.getElementById("uploadFileName").value = excelFile.name;
          sendSuccess();
        },
        function (error) {
          console.log(error);
          sendFail();
        }
      );
    },
    saveExcel() {
      let spread = this.spread;
      let excelIo = new ExcelIO.IO();
      let fileName =
        document.getElementById("exportFileName").value || "export";
      if (fileName.substr(-5, 5) !== ".xlsx") {
        fileName += ".xlsx";
      }
      let json = spread.toJSON();
      excelIo.save(
        json,
        function (blob) {
          saveAs(blob, fileName);
          sendSuccess();
        },
        function (error) {
          console.log(error);
          sendFail();
        }
      );
    },
    print() {
      let spread = this.spread;
      if (spread) {
        spread.print();
      }
    },
    hAlignLeft() {
      if (this.spread) {
        let sheet = this.spread.getActiveSheet();
        let range = sheet.getSelections()[0];
        sheet.suspendPaint();
        sheet
          .getRange(range.row, range.col, range.rowCount, range.colCount)
          .hAlign(GC.Spread.Sheets.HorizontalAlign.left);
        sheet.resumePaint();
      }
    },
    hAlignRight() {
      if (this.spread) {
        let sheet = this.spread.getActiveSheet();
        let range = sheet.getSelections()[0];
        sheet.suspendPaint();
        sheet
          .getRange(range.row, range.col, range.rowCount, range.colCount)
          .hAlign(GC.Spread.Sheets.HorizontalAlign.right);
        sheet.resumePaint();
      }
    },
    upload() {
      this.user = sessionStorage.getItem("user")
        ? JSON.parse(sessionStorage.getItem("user"))
        : {};
      let username = this.user.username;
      let fileName =
        document.getElementById("uploadFileName").value || "export";
      if (fileName.substr(-5, 5) !== ".xlsx") {
        fileName += ".xlsx";
      }
      console.log("filename:" + fileName);
      let excelIo = new ExcelIO.IO();
      let spread = this.spread;
      let json = spread.toJSON();
      excelIo.save(
        json,
        function (blob) {
          let data = new FormData();
          data.append("username", username);
          data.append("fileName", fileName);
          data.append("file", blob);
          let xhr = new XMLHttpRequest();
          xhr.open("POST", "http://20.160.144.194:8181/api/upload", true);

          xhr.onload = function (e) {
            if (this.status == 200) {
              this.sendSuccess();
            } else {
              this.sendFail();
              console.log("failed");
            }
          };
          xhr.send(data);
        },
        function (e) {
          console.log(e.errorMessage);
        }
      );
    },
    download(row) {
      console.log(row);
      let excelIo = new ExcelIO.IO();
      let spread = this.spread;
      let data = new FormData();
      data.append("filePath", row.path);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "http://20.160.144.194:8181/api/download", true);
      xhr.responseType = "blob";
      xhr.onload = function (e) {
        if (this.status == 200) {
          let blob = this.response;
          excelIo.open(
            blob,
            function (json) {
              let workbookObj = json;
              spread.fromJSON(workbookObj);
              document.getElementById("exportFileName").value = row.filename;
              document.getElementById("uploadFileName").value = row.filename;
            },
            function (e) {
              console.log(e.errorMessage);
            }
          );
        }
      };
      xhr.send(data);
    },
  },
};
</script>

<style>
.nav {
  background-color: #eee;
}
.el-row {
  margin-bottom: 8px;
  background-color: white;
}
.el-col {
  border-radius: 4px;
}
.communicationArea {
  background-color: white;
  border-top: 1px solid rgb(190, 190, 190);
  border-left: 1px solid rgb(190, 190, 190);
  border-right: 1px solid rgb(190, 190, 190);
  border-bottom: 1px solid rgb(190, 190, 190);
  height: 70vh;
}
.spread-host {
  width: 100%;
  height: 600px;
}
.inputContainer {
  width: 100%;
  height: auto;
  border: 1px solid #eee;
  box-sizing: border-box;
}
.options-container {
  width: 350px;
  padding: 12px;
  height: 12%;
  box-sizing: border-box;
  background: #fbfbfb;
  overflow: auto;
}
.tip {
  color: white;
  text-align: center;
  border-radius: 10px;
  font-family: sans-serif;
  padding: 10px;
  width: auto;
  display: inline-block !important;
  display: inline;
}
.right {
  background-color: deepskyblue;
}
.left {
  background-color: forestgreen;
}
.el-icon-chat-dot {
  background-image: "icons/people.png";
}
#statusBar {
  bottom: 0;
  height: 25px;
  width: 100%;
  position: relative;
  float: left;
}
</style>
