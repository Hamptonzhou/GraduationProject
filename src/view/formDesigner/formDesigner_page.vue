<template>
  <div style="height: 100%">
    <!-- 保存表单模态框 -->
    <Modal v-model="showModal" title="请输入表单名称" @on-ok="handleSave">
      <Form ref="formDesignForm" :model="nameForm" :rules="ruleFormDesign" :label-width="100">
        <FormItem label="表单名称" prop="formName">
          <Input type="text" v-model="nameForm.formName" />
        </FormItem>
      </Form>
    </Modal>

    <!-- <fm-generate-form :data="jsonData" :value="values" ref="generateForm">
    </fm-generate-form> -->

    <fm-making-form ref="makingForm" preview>
      <!-- generate-code generate-json -->
      <template slot="action">
        <el-button type="text" size="medium" icon="el-icon-download" @click="showModal=true">保存</el-button>
        <!-- 自定义内容 -->
        <Select clearable style="float:left;width:200px" v-model="selectedNodeId">
          <Option v-for="(item,index) in selectList" :key="index" :value="item.id">{{item.formName}}</Option>
        </Select>
        <Button type="primary" ghost style="float:left;" @click="viewFormData(selectedNodeId)">编辑表单</Button>
        <Button type="primary" ghost style="float:left;" @click="clearContainer">清空容器</Button>
      </template>
    </fm-making-form>

  </div>
</template>

<script>
import formDesignerAPI from "@/api/formDesigner.js";

export default {
  name: "formDesigner_page",
  data() {
    return {
      selectList: null,
      selectedNodeId: null,
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
      jsonData: {
        //表单渲染初始化数据，否则报错list的size、config的length未定义
        list: [],
        config: { labelWidth: 100, labelPosition: "right", size: "small" }
      }, // 表单配置中生成的json数据
      values: {} // 表单需要显示的表单数据
    };
  },
  mounted() {
    this.fetchAllFormData();
  },
  methods: {
    clearContainer() {
      this.$refs.makingForm.setJSON(this.jsonData);
    },
    //获取所有表单数据
    fetchAllFormData() {
      formDesignerAPI
        .getAllFormData()
        .then(res => {
          if (res.status === 0) {
            this.selectList = res.data;
          } else {
            this.$Message.error("获取表单数据失败！");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器失败");
        });
    },
    //保存表单数据
    handleSave() {
      this.$refs["formDesignForm"].validate(valid => {
        if (valid) {
          //直接定义一个对象传递到后台进行映射，但是需要注意，js接口的对象不需要使用{}的形式
          let BusinessFormData = {
            id: this.selectedNodeId,
            formName: this.nameForm.formName,
            formData: JSON.stringify(this.$refs.makingForm.getJSON()) //json对象转化为json字符串
          };
          formDesignerAPI
            .saveFormData(BusinessFormData)
            .then(res => {
              if (res.status === 0) {
                this.fetchAllFormData();
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
    },
    //根据表单id从后台获取表单数据进行渲染
    viewFormData(selectedNodeId) {
      formDesignerAPI
        .getFormDataById(selectedNodeId)
        .then(res => {
          if (res.status === 0) {
            let formData = res.data.formData;
            this.$refs.makingForm.setJSON(JSON.parse(formData));
          } else {
            this.$Message.error("无法获取表单信息");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器失败");
        });
    }
  }
};
</script>

<!-- <iframe src="http://localhost:9601/formDesigner/index.html" width=1500 height="800" scrolling="auto" frameborder=0></iframe> -->