<template>
  <div style="height: 100%">
    <!-- <Modal title="流程状态" width="600" v-model="showModal" @on-cancel="showModal=false">
      <fm-generate-form :data="jsonData" :value="values" ref="generateForm">
      </fm-generate-form>
    </Modal> -->
    <Modal v-model="showModal" title="请输入表单名称" @on-ok="handleSave">
      <Form ref="formDesignForm" :model="nameForm" :rules="ruleFormDesign" :label-width="100">
        <FormItem label="表单名称" prop="formName">
          <Input type="text" v-model="nameForm.formName" />
        </FormItem>
      </Form>
    </Modal>
    <fm-making-form ref="makingForm" preview generate-json generate-code>
      <template slot="action">
        <el-button type="text" size="medium" icon="el-icon-download" @click="showModal=true">保存</el-button>
        <!-- <Select clearable style="float:left;width:200px">
          <Option value='NewYork'>aaa</Option>
          <Option value='London'>aaa</Option>
        </Select> -->
      </template>
    </fm-making-form>

  </div>
</template>

<script>
import Vue from "vue";
//form-making依赖element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);
//form-making的组件和样式
import FormMaking from "form-making";
import "form-making/dist/FormMaking.css";
Vue.use(FormMaking);
// form-making的设计器
import { MakingForm } from "form-making";
Vue.component(MakingForm.name, MakingForm);

import formDesignerAPI from "@/api/formDesigner.js";

export default {
  name: "formDesigner_page",
  data() {
    return {
      showModal: false,
      nameForm: {
        formName: ""
      },
      ruleFormDesign: {
        formName: [
          {
            required: true,
            message: "请输入表单名称",
            trigger: "blur"
          }
        ]
      },
      jsonData: {}, // 表单配置中生成的json数据
      values: {} // 表单需要显示的表单数据
    };
  },
  methods: {
    handleSave() {
      this.$refs["formDesignForm"].validate(valid => {
        if (valid) {
          console.log("保存json数据：");
          let formDataObject = this.$refs.makingForm.getJSON();
          let formData = JSON.stringify(formDataObject);
          console.log(this.nameForm.formName);
          console.log(formData);
          formDesignerAPI
            .saveFormData(this.nameForm.formName, formData)
            .then(res => {
              if (res.status === 0) {
                this.$Message.success("表单保存成功！");
              } else {
                this.$Message.error("表单保存失败！");
              }
            })
            .catch(err => {
              this.$Message.error("catch-请求服务器失败");
            });
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    }
  }
};
</script>

<!-- <iframe src="http://localhost:9601/formDesigner/index.html" width=1500 height="800" scrolling="auto" frameborder=0></iframe> -->