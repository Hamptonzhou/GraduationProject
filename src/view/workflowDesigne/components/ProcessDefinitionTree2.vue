<template>
  <Tree :data="treeData" @on-select-change="selected"></Tree>
</template>
<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  data() {
    return {
      treeData: [],
      selectedNodeId: null,
      selectedNodeTitle: null
    };
  },
  mounted() {
    this.fetchProcessDefinitionTree();
  },
  methods: {
    //保存选中的节点id和标题
    selected(node) {
      this.selectedNodeId = node[0].id;
      this.selectedNodeTitle = node[0].title;
      //把数据传递到父组件
      this.$emit(
        "childSendParentSelectedNodeIdAndTitle",
        this.selectedNodeId,
        this.selectedNodeTitle
      );
    },
    //获取流程定义树
    fetchProcessDefinitionTree() {
      workflowDesignApi.getProcessDefinitionTree().then(res => {
        if (res.status === 0) {
          this.treeData = this.getTree(res.data);
        }
      });
    },
    //构造流程定义树的结构以适应iview的属性控件的属性
    getTree(tree = []) {
      let arr = [];
      let obj = {};
      obj.id = tree.id;
      obj.title = tree.title;
      obj.children = tree.children;
      obj.expand = true;
      arr.push(obj);
      return arr;
    }
  }
};
</script>






