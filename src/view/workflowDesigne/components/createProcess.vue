<template>
  <div>
    <!-- <Button type="primary" size="large" @click="getWorkflowDesignPage">调出流程图设计页面</Button> -->
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  mounted() {
    this.getWorkflowDesignPage();
  },
  methods: {
    //发出请求画图页面的请求
    getWorkflowDesignPage() {
      workflowDesignApi
        .showWorkflowDesignPage()
        .then(res => {
          if (res.status === 0) {
            console.log(res.data.modelId, res.data.redirect);
            //打开新窗口
            window.open(
              "http://localhost:9600/modeler.html?modelId=" + res.data.modelId
            );
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

