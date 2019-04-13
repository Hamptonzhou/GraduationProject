<template>
  <div>
    <Modal v-model="showModal" :title="businessFormName" fullscreen @on-ok="handleSave">
      <fm-generate-form ref="generateForm" :data="jsonDataObject">
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
      }
    };
  },
  //   watch: {
  //     jsonData: function() {
  //       this.showModal = true;
  //       this.jsonDataObject = JSON.parse(this.jsonData);
  //     }
  //   },
  methods: {
    showForm(businessFormId, businessFormNaming) {
      formDesignerAPI
        .getFormDataById(businessFormId)
        .then(res => {
          if (res.status === 0) {
            this.businessFormName = businessFormNaming || "业务表单";
            this.jsonDataObject = JSON.parse(res.data.formData);
            this.showModal = true;
          } else {
            this.$Message.error("无法获取业务表单！");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器异常");
        });
    },
    handleSave() {
      this.$Message.info("把填写好的信息存库");
    }
  }
};
</script>
