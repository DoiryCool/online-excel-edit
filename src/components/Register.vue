<template>
  <div>
    <el-card class="login-form-layout">
      <el-form
        autocomplete="on"
        :model="registerForm"
        ref="registerForm"
        label-position="left"
      >
        <div style="text-align: center">
          <svg-icon
            icon-class="login-mall"
            style="width: 56px; height: 56px; color: #409eff"
          ></svg-icon>
        </div>
        <h2 class="login-title color-main">Register</h2>
        <el-form-item prop="username">
          <el-input
            name="username"
            type="text"
            @keyup.enter.native="handleRegister"
            v-model="registerForm.username"
            autocomplete="on"
            placeholder="Please input username"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :type="pwdType"
            @keyup.enter.native="handleRegister"
            v-model="registerForm.password"
            autocomplete="on"
            placeholder="Please input password"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="cpassword"
            :type="pwdType"
            @keyup.enter.native="handleRegister"
            v-model="registerForm.cpassword"
            autocomplete="on"
            placeholder="Please confirm password"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            name="email"
            :type="text"
            @keyup.enter.native="handleRegister"
            v-model="registerForm.email"
            autocomplete="on"
            placeholder="Please input email"
          >
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px">
          <el-button
            style="width: 45%"
            type="primary"
            :loading="loading"
            @click.native.prevent="handleRegister"
            >Register</el-button
          >
          <el-button
            style="width: 45%"
            type="primary"
            :loading="loading"
            @click.native.prevent="back"
            >Back</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        cpassword: "",
        email: "",
      },
      loading: false,
      pwdType: "password",
    };
  },
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Register", this.registerForm)
            .then((response) => {
              this.loading = false;
              let code = response.data.code;
              if (code == 200) {
                this.$router.push({
                  path: "/Login",
                  query: { data: response.data.data },
                });
              } else {
                this.$router.push({
                  path: "/Login",
                  query: { message: response.data.description },
                });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("参数验证不合法！");
          return false;
        }
      });
    },
    back() {
      this.$router.push({
        path: "/Login",
      });
    },
  },
};
</script>

<style>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
