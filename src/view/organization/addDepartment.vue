<template>
  <div>
    <Form ref="departmentForm" :model="departmentForm" :rules="ruleDepartmentForm" :label-width="100">
      <Row>
        <i-col span="10">
          <FormItem label="部门名称" prop="departmentName">
            <Input v-model="departmentForm.departmentName" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="部门负责人" prop="contactUserId">
            <Input v-model="departmentForm.contactUserId" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="部门传真" prop="fax">
            <Input v-model="departmentForm.fax" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="部门描述" prop="departmentDescription">
            <Input v-model="departmentForm.departmentDescription" />
          </FormItem>
        </i-col>
      </Row>
      <FormItem>
        <Button type="primary" @click="handleSubmit('departmentForm')">保存提交</Button>
        <Button @click="handleReset('departmentForm')" style="margin-left: 8px">清空全部</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import organizationAPI from "@/api/organization.js";

export default {
  data() {
    return {
      departmentForm: {
        departmentName: "",
        contactUserId: "",
        parentId: "#", //部门的父级id设置为#，岗位的父级id设置为部门的id
        fax: "",
        departmentDescription: ""
      },
      ruleDepartmentForm: {
        departmentName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur"
          }
        ],
        contactUserId: [
          {
            required: true,
            message: "请输入部门负责人",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //提交表单
    handleSubmit(departmentForm) {
      this.$refs[departmentForm].validate(valid => {
        if (valid) {
          organizationAPI
            .saveOrUpdateDepartment(this.departmentForm)
            .then(res => {
              if (res.status === 0) {
                this.handleReset("departmentForm");
                this.$Message.success("新增部门成功!");
              } else {
                this.$Message.error("新增部门失败!");
              }
            })
            .catch(err => {
              this.$Message.error("catch-新增部门失败!");
            });
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    // 清空表单
    handleReset(departmentForm) {
      this.$refs[departmentForm].resetFields();
    }
  }
};
</script>

<style scoped>
/* 不起效？？？ */
.ivu-form.ivu-form-item-label {
  font-size: 14px;
}
</style>
