<template>
  <div>
    <img :src="image">
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  props: ["selectedNodeId", "selectedNodeTitle"],
  data() {
    return {
      image: null
    };
  },

  methods: {
    fetchImageResource(selectedNodeId, selectedNodeTitle) {
      if (selectedNodeTitle.includes("草稿")) {
        workflowDesignApi
          .getModelImage(selectedNodeId)
          .then(res => {
            if (res.status === 0) {
              //如果某个模型尚未部署，则不存在图片
              if (typeof res.data.image !== "undefined") {
                this.image = "data:image/png;base64," + res.data.image;
              } else {
                this.image = null;
              }
            } else {
              this.$Modal.error({ title: "错误", content: res.message });
            }
          })
          .catch(err => {
            this.$Modal.error({ title: "错误", content: "请求服务器错误" });
          });
      } else if (selectedNodeTitle.includes("版本")) {
        workflowDesignApi
          .getProcessDefinitionImage(selectedNodeId)
          .then(res => {
            if (res.status === 0) {
              //操作返回的base64的图片数据，显示在页面上
              this.image = "data:image/png;base64," + res.data.image;
            } else {
              this.$Modal.error({ title: "错误", content: res.message });
            }
          })
          .catch(err => {
            this.$Modal.error({ title: "错误", content: "请求服务器错误" });
          });
      }
    }
  },
  watch: {
    selectedNodeId() {
      this.fetchImageResource(this.selectedNodeId, this.selectedNodeTitle);
    }
  }
};
</script>

