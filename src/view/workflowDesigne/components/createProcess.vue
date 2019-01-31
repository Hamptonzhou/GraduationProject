<template>
  <div>
    <h1>新建流程显示页面</h1>
    <button @click="getPage">调出页面</button>
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  name: "",
  data() {
    return {};
  },
  methods: {
    getPage() {
      workflowDesignApi.showWorkflowDesignPage();
    }
  },
  mounted() {
    //发出请求画图页面的请求
  }
};
</script>

