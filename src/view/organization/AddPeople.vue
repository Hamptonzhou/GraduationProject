<template>
  <Form ref="peopleForm" :model="peopleForm" :rules="rulePeopleForm" :label-width="100">
    <Row>
      <i-col span="5">
        <FormItem label="登录账号" prop="loginName">
          <Input v-model="peopleForm.loginName" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="性别" prop="gender">
          <Select v-model="peopleForm.gender">
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="用户密码" prop="userPassword">
          <Input type="password" v-model="peopleForm.userPassword" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="peopleForm.confirmPassword" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="真实姓名" prop="realName">
          <Input v-model="peopleForm.realName" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="身份证号码" prop="identityNumber">
          <Input v-model="peopleForm.identityNumber" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="手机号码" prop="phone">
          <Input v-model="peopleForm.phone" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="邮箱地址" prop="email">
          <Input v-model="peopleForm.email" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="学历" prop="education">
          <Input v-model="peopleForm.education" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="民族" prop="ethnicity">
          <Input v-model="peopleForm.ethnicity" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="所属岗位" prop="parentId">
          <treeselect v-model="peopleForm.parentId" :options="options" @open="clickOpen" @select="selectedNode"
            placeholder="请选择人员的岗位" clearable searchable :show-count="true" noChildrenText="" noOptionsText="无可用数据" />
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="工号" prop="jobNumber">
          <Input v-model="peopleForm.jobNumber" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="5">
        <FormItem label="注册时间" prop="registerTime">
          <DatePicker type="date" @on-change="peopleForm.registerTime=$event"></DatePicker>
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="入职时间" prop="joinTime">
          <DatePicker type="date" @on-change="peopleForm.joinTime=$event"></DatePicker>
        </FormItem>
      </i-col>
    </Row>

    <Row>
      <i-col span="5">
        <FormItem label="岗位角色" prop="jobPosition">
          <RadioGroup v-model="peopleForm.jobPosition">
            <Radio label="管理层"></Radio>
            <Radio label="普通职员"></Radio>
          </RadioGroup>
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="锁定账户" prop="enable">
          <i-switch v-model="peopleForm.enable" size="large" true-value="1" false-value="0">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="14">
        <FormItem label="当前住址" prop="address">
          <Input v-model="peopleForm.address" />
        </FormItem>
      </i-col>
    </Row>
    <Row>
      <i-col span="14">
        <FormItem label="员工描述" prop="userDescription">
          <Input v-model="peopleForm.userDescription" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </i-col>
    </Row>
    <FormItem>
      <Button type="primary" @click="handleSubmit('peopleForm')">保存提交</Button>
      <Divider type="vertical" />
      <Button @click="handleReset('peopleForm')">清空全部</Button>
    </FormItem>
  </Form>
</template>
<script>
import organizationAPI from "@/api/organization.js";
// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  // register the component
  components: { Treeselect },
  data() {
    //请求后端接口，验证登录账号是否存在
    const validateloginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入登录账号"));
      }
      organizationAPI
        .checkLoginNameExist(this.peopleForm.loginName)
        .then(res => {
          if (res.data === true) {
            callback(new Error("登录账号已被使用"));
          } else {
            callback();
          }
        });
    };
    //确认密码验证器
    const validatePassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请确认密码"));
      } else if (value !== this.peopleForm.userPassword) {
        callback(new Error("密码不一致"));
      } else {
        callback();
      }
    };
    return {
      options: [],
      peopleForm: {
        loginName: "",
        userPassword: "",
        confirmPassword: "",
        realName: "",
        jobNumber: "",
        gender: "",
        identityNumber: "",
        phone: "",
        email: "",
        address: "",
        ethnicity: "",
        education: "",
        registerTime: "",
        joinTime: "",
        jobPosition: "",
        parentId: null,
        enable: "",
        userDescription: ""
      },
      rulePeopleForm: {
        loginName: [
          {
            required: true,
            validator: validateloginName,
            trigger: "blur"
          }
        ],
        userPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validatePassword,
            trigger: "blur"
          }
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur"
          }
        ],
        jobNumber: [
          {
            required: true,
            message: "请确认工号",
            trigger: "blur"
          }
        ],
        identityNumber: [
          {
            required: true,
            message: "请输入身份证号码",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          }
        ],
        address: [
          {
            message: "请输入住址",
            trigger: "blur"
          }
        ],
        ethnicity: [
          {
            required: true,
            message: "请填写民族",
            trigger: "blur"
          }
        ],
        education: [
          {
            required: true,
            message: "请输入学历",
            trigger: "blur"
          }
        ],
        jobPosition: [
          {
            required: true,
            message: "请选择岗位",
            trigger: "blur"
          }
        ],
        parentId: [
          {
            required: true,
            message: "请选择所属部门",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        registerTime: {
          required: true,
          type: "string",
          message: "请选择注册时间",
          trigger: "change"
        },
        joinTime: [
          {
            required: true,
            type: "string",
            message: "请选择入职时间",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    //选择岗位的下拉列表树
    selectedNode(node, instanceId) {
      console.log(node.id);
      this.parentId = node.id;
    },

    //点击下拉框时，才进行加载组织树
    clickOpen() {
      organizationAPI
        .getDepartmentTree()
        .then(res => {
          if (res.status === 0) {
            this.options = this.getTree(res.data);
          } else {
            this.$Message.error("else-无法获取部门列表");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求获取部门列表失败");
        });
    },
    getTree(tree = []) {
      let arr = [];
      let obj = {};
      obj.id = tree.id;
      obj.title = tree.title;
      obj.children = tree.children;
      arr.push(obj);
      //将对象转换成字符串
      var departmentTreeString = JSON.stringify(arr).replace(/title/g, "label");
      //将字符串转换成对象
      var departmentTree = JSON.parse(departmentTreeString);
      return departmentTree;
    },

    //提交表单
    handleSubmit(peopleForm) {
      this.$refs[peopleForm].validate(valid => {
        if (valid) {
          organizationAPI
            .saveOrUpdateUser(this.peopleForm)
            .then(res => {
              console.log(res);
              if (res.status === 0) {
                this.$Message.success("新增员工 " + res.data + " 成功!");
                this.handleReset("peopleForm");
              } else {
                this.$Message.error("新增员工失败!");
              }
            })
            .catch(err => {
              this.$Message.error("catch-请求失败!");
            });
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    // 清空表单
    handleReset(peopleForm) {
      this.$refs[peopleForm].resetFields();
    }
  }
};
</script>

<style scoped>
.ivu-col-span-5 {
  display: block;
  width: 400px;
}
.ivu-input-icon-normal,
.ivu-input {
  padding-right: 200px;
}
</style>



