<template>
  <div>
    <Modal v-model="showModal" title="业务表单" fullscreen @on-ok="handleSave">
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
      jsonDataObject: null
    };
  },
  //   watch: {
  //     jsonData: function() {
  //       this.showModal = true;
  //       this.jsonDataObject = JSON.parse(this.jsonData);
  //     }
  //   },
  methods: {
    showForm(businessFormId) {
      formDesignerAPI
        .getFormDataById(businessFormId)
        .then(res => {
          if (res.status === 0) {
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
