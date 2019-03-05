<template>
  <div>
    <!-- 搜索框 -->
    <div style="margin-top: 10px;display: flex;justify-content: center">
      <el-input placeholder="默认展示部分用户，可以通过用户名搜索用户..." prefix-icon="el-icon-search" v-model="keywords" style="width: 400px"
        size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
    </div>
    <!-- 卡片 -->
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap" v-loading="loading">
      <el-card style="width:330px;margin-top: 10px;" v-for="(user,index) in users" :key="index" v-loading="cardloading[index]">
        <div slot="header" style="text-align: left">
          <span>{{user.realName}}</span>
          <el-button style="float: right; padding: 3px 0;color: #ff0509" type="text" icon="el-icon-delete" @click="deleteUser(user.userId)">删除
          </el-button>
        </div>
        <div>
          <div><img :src="user.avatar" :alt="user.realName" style="width: 70px;height: 70px"></div>
          <div style="text-align: left;color:#20a0ff;font-size: 13px;margin-top: 13px">
            <span>登陆账户名：</span><span>{{user.loginName}}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 13px;margin-top: 13px">
            <span>电子邮箱：</span><span>{{user.email}}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 13px;margin-top: 13px">
            <span>入职时间：</span><span>{{user.joinTime }}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 13px;margin-top: 13px;display: flex;align-items: center">
            <span>用户状态：</span>
            <i-switch v-model="user.enable" size="large" true-value="1" false-value="0" @on-change="enableChange(user.userId,index)">
              <span slot="open">启用</span>
              <span slot="close">禁用</span>
            </i-switch>
          </div>
          <!-- <div style="text-align: left;color:#20a0ff;font-size: 13px;margin-top: 13px">
            <span>用户角色:</span>
            <el-tag v-for="role in user.roles" :key="role.id" size="mini" style="margin-right: 8px" type="success">
              {{role.name}}
            </el-tag>
          </div> -->
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
import organizationAPI from "@/api/organization.js";
export default {
  props: ["selectedNodeId"],
  data() {
    return {
      loading: false,
      eploading: [],
      cardloading: [],
      keywords: "",
      users: [],
      allRoles: [],
      roles: [],
      cpRoles: []
    };
  },
  mounted: function() {
    this.cardloading = Array.apply(null, Array(20)).map(function(item, i) {
      return false;
    });
    this.eploading = Array.apply(null, Array(20)).map(function(item, i) {
      return false;
    });
  },
  watch: {
    selectedNodeId: function() {
      this.loadUserList(this.selectedNodeId);
    }
  },
  methods: {
    loadUserList(selectedNodeId) {
      this.loading = true;
      organizationAPI
        .loadUserList(selectedNodeId)
        .then(res => {
          if (res.status === 0) {
            this.loading = false;
            this.users = res.data.rows;
          } else {
            this.loading = false;
            this.$Message.error("else-获取用户列表失败");
          }
        })
        .catch(err => {
          this.loading = false;
          this.$Message.error("catch-请求服务器失败");
        });
    },
    //删除用户
    deleteUser(id) {
      console.log(id);
      var _this = this;
      this.$Modal.confirm({
        title: "删除警告",
        content: "删除该用户, 是否继续?",
        onOk: () => {
          _this.loading = true;
          organizationAPI
            .deleteUser(id)
            .then(res => {
              if (res.status === 0) {
                _this.loading = false;
                this.$Message.success("删除成功！");
                _this.loadUserList(this.selectedNodeId);
              } else {
                _this.loading = false;
                this.$Message.error("删除失败");
              }
            })
            .catch(err => {
              this.$Message.error("catch-请求服务器错误");
            });
        },
        onCancel: () => {
          this.$Message.info("已取消删除");
        }
      });
    },
    //启用或禁用用户
    enableChange(id, index) {
      var _this = this;
      _this.cardloading.splice(index, 1, true);
      organizationAPI
        .enableChange(id)
        .then(res => {
          if (res.status === 0) {
            _this.cardloading.splice(index, 1, false);
            _this.$Message.success("更新成功!");
          } else {
            _this.cardloading.splice(index, 1, false);
            _this.$Message.error("更新失败!");
            _this.loadOneUserById(id);
          }
        })
        .catch(err => {
          _this.cardloading.splice(index, 1, false);
          _this.$Message.error("更新失败!");
        });
    },
    //重新加载某个用户信息
    loadOneUserById(id) {
      var _this = this;
      organizationAPI
        .loadOneUserById(id)
        .then(res => {
          if (res.status === 0) {
            _this.users.splice(index, 1, res.data);
          } else {
            _this.$Message.error("数据加载失败!!");
          }
        })
        .catch(err => {
          _this.$Message.error("catch-数据加载失败!!");
        });
    },

    saveRoles(id, index) {
      var selRoles = this.roles;
      if (this.cpRoles.length == selRoles.length) {
        for (var i = 0; i < this.cpRoles.length; i++) {
          for (var j = 0; j < selRoles.length; j++) {
            if (this.cpRoles[i].id == selRoles[j]) {
              selRoles.splice(j, 1);
              break;
            }
          }
        }
        if (selRoles.length == 0) {
          return;
        }
      }
      var _this = this;
      _this.cardloading.splice(index, 1, true);
      putRequest("/admin/user/role", { rids: this.roles, id: id }).then(
        resp => {
          if (resp.status == 200 && resp.data.status == "success") {
            _this.$message({ type: resp.data.status, message: resp.data.msg });
            _this.loadOneUserById(id, index);
          } else {
            _this.cardloading.splice(index, 1, false);
            _this.$message({ type: "error", message: "更新失败!" });
          }
        },
        resp => {
          _this.cardloading.splice(index, 1, false);
          if (resp.response.status == 403) {
            var data = resp.response.data;
            _this.$message({ type: "error", message: data });
          }
        }
      );
    },
    showRole(aRoles, id, index) {
      this.cpRoles = aRoles;
      this.roles = [];
      this.loadRoles(index);
      for (var i = 0; i < aRoles.length; i++) {
        this.roles.push(aRoles[i].id);
      }
    },

    loadRoles(index) {
      var _this = this;
      _this.eploading.splice(index, 1, true);
      getRequest("/admin/roles").then(
        resp => {
          _this.eploading.splice(index, 1, false);
          if (resp.status == 200) {
            _this.allRoles = resp.data;
          } else {
            _this.$message({ type: "error", message: "数据加载失败!" });
          }
        },
        resp => {
          _this.eploading.splice(index, 1, false);
          if (resp.response.status == 403) {
            var data = resp.response.data;
            _this.$message({ type: "error", message: data });
          }
        }
      );
    },

    searchClick() {
      this.loading = true;
      this.loadUserList();
    }
  }
};
</script>

