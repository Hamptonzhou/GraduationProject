<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip" ref="tip">输入有效的用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions(["handleLogin"]),
    //登陆表单子组件传递userName, password到该父组件，在这里进行登陆判断
    handleSubmit({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        if (res.status === 0) {
          this.$router.push({
            name: this.$config.homeName
          });
        } else {
          this.$refs.tip.innerText = res.message;
          this.$refs.tip.style.color = "red";
          this.$refs.tip.style.fontWeight = "bold";
        }
      });
    }
  }
};
</script>

<style>
</style>
