<template>
  <div>
    <Modal v-model="showModal" :title="businessFormName" fullscreen @on-ok="handleSave">
      <fm-generate-form ref="generateForm" :data="jsonDataObject" :value="formValues">
      </fm-generate-form>
    </Modal>
  </div>
</template>
<script>
import formDesignerAPI from "@/api/formDesigner.js";

export default {
  //   props: ["jsonData"],
  data() {
    return {
      showModal: false,
      businessFormName: null,
      jsonDataObject: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small"
        }
      },
      formValues: {},
      businessFormId: null
    };
  },
  //   watch: {
  //     jsonData: function() {
  //       this.showModal = true;
  //       this.jsonDataObject = JSON.parse(this.jsonData);
  //     }
  //   },
  methods: {
    //渲染表单模板
    showForm(businessFormId, businessFormNaming) {
      this.businessFormId = businessFormId;
      formDesignerAPI
        .getFormDataById(businessFormId)
        .then(res => {
          console.log(res.data);
          if (res.status === 0) {
            this.businessFormName = businessFormNaming || "业务表单";
            //渲染表单模板数据
            this.jsonDataObject = JSON.parse(res.data.formData);
            //渲染表单数据
            console.log(res.data.formDataValues);
            this.formValues = JSON.parse(res.data.formDataValues);
            this.showModal = true;
          } else {
            this.$Message.error("无法获取业务表单！");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器异常");
        });
    },
    //保存表单数据
    handleSave() {
      //获取表单的值
      this.$refs.generateForm
        .getData()
        .then(data => {
          console.log(JSON.stringify(data));
          //表单对象
          let BusinessFormData = {
            id: this.businessFormId,
            formDataValues: JSON.stringify(data) //json对象转化为json字符串
          };
          //保存
          formDesignerAPI
            .saveFormData(BusinessFormData)
            .then(res => {
              if (res.status === 0) {
                this.$Message.success("保存业务表单数据成功！");
              } else {
                this.$Message.error("保存业务表单数据失败！");
              }
            })
            .catch(err => {
              this.$Message.error("请求服务器失败");
            });
        })
        .catch(e => {
          this.$Message.error("获取表单数据失败！");
        });
    }
  }
};
</script>
