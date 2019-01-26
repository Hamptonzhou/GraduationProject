<template>
  <Form ref="peopleForm" :model="peopleForm" :rules="rulePeopleForm" :label-width="150">
    <Row>
      <i-col span="5">
        <FormItem label="登录账号" prop="loginName">
          <Input v-model="peopleForm.loginName"/>
        </FormItem>
      </i-col>
      <i-col span="5">
        <FormItem label="真实姓名" prop="realName">
          <Input v-model="peopleForm.realName"/>
        </FormItem>
      </i-col>
    </Row>

    <FormItem label="用户密码" prop="userPassword">
      <Input type="password" v-model="peopleForm.userPassword"/>
    </FormItem>
    <FormItem label="确认密码" prop="confirmPassword">
      <Input type="password" v-model="peopleForm.confirmPassword"/>
    </FormItem>
    <FormItem label="工号" prop="jobNumber">
      <Input v-model="peopleForm.jobNumber"/>
    </FormItem>
    <FormItem label="性别" prop="gender">
      <RadioGroup v-model="peopleForm.gender">
        <Radio label="男">男</Radio>
        <Radio label="女">女</Radio>
      </RadioGroup>
    </FormItem>
    <FormItem label="身份证号码" prop="identityNumber">
      <Input v-model="peopleForm.identityNumber"/>
    </FormItem>
    <FormItem label="手机" prop="phone">
      <Input v-model="peopleForm.phone"/>
    </FormItem>
    <FormItem label="住址" prop="address">
      <Input v-model="peopleForm.address"/>
    </FormItem>

    <FormItem label="民族" prop="ethnicity">
      <Input v-model="peopleForm.ethnicity"/>
    </FormItem>
    <FormItem label="学历" prop="education">
      <Input v-model="peopleForm.education"/>
    </FormItem>
    <FormItem label="工作岗位" prop="jobPosition">
      <Input v-model="peopleForm.jobPosition"/>
    </FormItem>
    <FormItem label="所属部门" prop="parentId">
      <Input v-model="peopleForm.parentId"/>
    </FormItem>
    <FormItem label="账户是否可用" prop="enable">
      <Input v-model="peopleForm.enable"/>
    </FormItem>
    <FormItem label="E-mail" prop="email">
      <Input v-model="peopleForm.email"/>
    </FormItem>
    <FormItem label="注册时间" prop="registerTime">
      <DatePicker
        type="date"
        v-model="peopleForm.registerTime"
        @on-change="peopleForm.registerTime=$event"
      ></DatePicker>
    </FormItem>
    <FormItem label="入职时间" prop="joinTime">
      <DatePicker type="date" v-model="peopleForm.joinTime" @on-change="peopleForm.joinTime=$event"></DatePicker>
    </FormItem>
    <FormItem label="员工描述" prop="userDescription">
      <Input
        v-model="peopleForm.userDescription"
        type="textarea"
        :autosize="{minRows: 2,maxRows: 5}"
      />
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('peopleForm')">保存提交</Button>
      <Button @click="handleReset('peopleForm')" style="margin-left: 8px">清空全部</Button>
    </FormItem>
  </Form>
</template>
<script>
import organizationAPI from "@/api/organization.js";
export default {
  data() {
    //请求后端接口，验证登陆账号是否存在
    const validateloginName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入登陆账号"));
      }
      organizationAPI
        .checkLoginNameExist(this.peopleForm.loginName)
        .then(res => {
          if (res.data === true) {
            callback(new Error("登陆账号已被使用"));
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
        parentId: "",
        enable: "",
        userDescription: ""
      },
      rulePeopleForm: {
        // loginName: [
        //   {
        //     validator: validateloginName,
        //     trigger: "blur"
        //   }
        // ]
        //   userPassword: [
        //     {
        //       required: true,
        //       message: "密码不能为空",
        //       trigger: "blur"
        //     }
        //   ],
        // confirmPassword: [
        //   {
        //     validator: validatePassword,
        //     trigger: "blur"
        //   }
        // ],
        //   realName: [
        //     {
        //       required: true,
        //       message: "请输入真实姓名",
        //       trigger: "blur"
        //     }
        //   ],
        //   jobNumber: [
        //     {
        //       required: true,
        //       message: "请确认工号",
        //       trigger: "blur"
        //     }
        //   ],
        //   identityNumber: [
        //     {
        //       required: true,
        //       message: "请输入身份证号码",
        //       trigger: "blur"
        //     }
        //   ],
        //   phone: [
        //     {
        //       required: true,
        //       message: "请输入手机号码",
        //       trigger: "blur"
        //     }
        //   ],
        //   address: [
        //     {
        //       required: true,
        //       message: "请输入住址",
        //       trigger: "blur"
        //     }
        //   ],
        //   ethnicity: [
        //     {
        //       required: true,
        //       message: "请填写民族",
        //       trigger: "blur"
        //     }
        //   ],
        //   education: [
        //     {
        //       required: true,
        //       message: "请输入学历",
        //       trigger: "blur"
        //     }
        //   ],
        //   jobPosition: [
        //     {
        //       required: true,
        //       message: "请选择岗位",
        //       trigger: "blur"
        //     }
        //   ],
        //   parentId: [
        //     {
        //       required: true,
        //       message: "请选择所属部门",
        //       trigger: "blur"
        //     }
        //   ],
        //   email: [{ type: "email", message: "邮箱格式不正确", trigger: "blur" }],
        //   gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        // registerTime: {
        //   required: true,
        //   type: "date",
        //   message: "请选择注册时间",
        //   trigger: "change"
        // },
        // joinTime: [
        //   {
        //     required: true,
        //     type: "date",
        //     message: "请选择入职时间",
        //     trigger: "change"
        //   }
        // ]
      }
    };
  },
  methods: {
    //提交表单
    handleSubmit(peopleForm) {
      this.$refs[peopleForm].validate(valid => {
        if (valid) {
          organizationAPI
            .saveOrUpdateUser(this.peopleForm)
            .then(res => {
              console.log(res);
              if (res.status === 0) {
                this.$Message.success("新增员工成功!");
              } else {
                this.$Message.error("新增失败!");
              }
            })
            .catch(err => {
              console.log("catch-请求失败");
            });
        } else {
          this.$Message.error("Fail!");
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
