<template>
  <Tree :data="processDefinitionTree"></Tree>
</template>
<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  data() {
    return {
      processDefinitionTree: [
        {
          title: "模型草稿",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            }
          ]
        },
        {
          title: "已发布模型",
          expand: true,
          children: [
            {
              title: "leaf 1-2-1"
            },
            {
              title: "leaf 1-2-1"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getAllModel();
  },
  methods: {
    getAllModel() {
      workflowDesignApi
        .getAllModel()
        .then(res => {
          console.log(res);
          this.processDefinitionTree = res.data;
        })
        .catch(err => {
          console.log("catch--请求服务器失败");
        });
    }
  }
};
</script>
