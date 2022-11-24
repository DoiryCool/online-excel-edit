<template>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="uId" label="Id" width="180" />
    <el-table-column prop="uAccount" label="Account" width="180" />
    <el-table-column prop="uEmail" label="Email" />
    <el-table-column prop="uRegisterTime" label="RegisterTime" />
  </el-table>
</template>

<script lang="ts">
import axios from "axios";

export default {
  name: "UserTable",
  data: () => {
    return {
      tableData: [],
    };
  },
  created: function () {
    
  },
};
</script>
