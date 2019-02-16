<template>
  <div>
    <Button type="primary" size="large" @click="showModelEditPage">调出流程图编辑页面</Button>
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  props: ["selectedNodeId", "selectedNodeTitle"],
  methods: {
    showModelEditPage() {
      workflowDesignApi
        .showModelEditPage(this.selectedNodeId)
        .then(res => {
          if (res.status === 0) {
            console.log(res);
            // 打开新窗口
            window.open("http://localhost:9600" + res.data.redirect);
          } else {
            console.log("else---程序出错状态码非零");
          }
        })
        .catch(err => {
          console.log("catch---请求服务器错误");
        });
    }
  }
};
</script>


