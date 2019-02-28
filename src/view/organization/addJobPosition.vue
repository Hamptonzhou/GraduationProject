<template>
  <div>
    <Form ref="departmentForm" :model="departmentForm" :rules="ruleDepartmentForm" :label-width="100">
      <Row>
        <i-col span="10">
          <FormItem label="岗位名称" prop="jobPositionName">
            <Input v-model="departmentForm.jobPositionName" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="岗位负责人" prop="contactUserId">
            <Input v-model="departmentForm.contactUserId" />
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="所属部门" prop="parentId">
            <Select v-model="departmentForm.parentId">
              <Option v-for="department in departmentList" :key="department.id" :value="department.id">{{department.departmentName}}</Option>
            </Select>
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="10">
          <FormItem label="岗位描述" prop="departmentDescription">
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
      departmentList: [],
      departmentForm: {
        jobPositionName: "",
        fax: "",
        contactUserId: "",
        parentId: "",
        departmentDescription: ""
      },
      ruleDepartmentForm: {
        jobPositionName: [
          {
            required: true,
            message: "请输入岗位名称",
            trigger: "blur"
          }
        ],
        contactUserId: [
          {
            required: true,
            message: "请输入岗位负责人",
            trigger: "blur"
          }
        ],
        parentId: [
          {
            required: true,
            message: "请输入所属部门",
            trigger: "change"
          }
        ]
      }
    };
  },
  mounted() {
    this.getDepartmentList();
  },
  methods: {
    //获取所有部门列表
    getDepartmentList() {
      organizationAPI
        .getDepartmentList("#")
        .then(res => {
          if (res.status === 0) {
            this.departmentList = res.data;
          } else {
            ruleDepartmentForm.parentId.message = "无法获取部门列表";
          }
        })
        .catch(err => {
          console.log("catch-请求获取部门列表失败");
        });
    },
    //提交表单
    handleSubmit(departmentForm) {
      this.$refs[departmentForm].validate(valid => {
        if (valid) {
          organizationAPI
            .saveOrUpdateDepartment(this.departmentForm)
            .then(res => {
              if (res.status === 0) {
                this.$Message.success("新增岗位成功!");
                this.handleReset("departmentForm");
              } else {
                this.$Message.error("新增岗位失败!");
              }
            })
            .catch(err => {
              console.log("catch-请求提交表单失败");
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
<style>
</style>