<template>
  <div>
    <div class="split">
      <Split v-model="split" mode="horizontal">
        <div slot="left" class="split-pane">
          <!-- <process-definition-tree></process-definition-tree> -->
          <process-definition-tree-2 v-if="reloadFlag" @childSendParentSelectedNodeIdAndTitle="dealSelectedNodeIdAndTitle"></process-definition-tree-2>
        </div>
        <div slot="right" class="split-pane">
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" @click="changeComponent='createProcess'">新建模型</Button>
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" :disabled="isDisabledFunction" @click="changeComponent='editProcess'">编辑模型</Button>
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" :disabled="isDisabledFunction" @click="deploymentProcess">发布模型</Button>
          <Divider type="vertical" />
          <Button type="error" ghost size="large" @click="deleteModelOrProcessDefinition">删 除</Button>
          <Divider type="vertical" />
          <Divider type="horizontal" />
          <component :is="changeComponent" :selectedNodeId="selectedNodeId" :selectedNodeTitle="selectedNodeTitle"></component>
          <Spin size="large" fix v-if="spinShow">正在发布模型...</Spin>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
import ProcessDefinitionTree from "@/view/workflowDesigne/components/ProcessDefinitionTree.vue";
import ProcessDefinitionTree2 from "@/view/workflowDesigne/components/ProcessDefinitionTree2.vue";

import createProcess from "@/view/workflowDesigne/components/createProcess.vue";
import editProcess from "@/view/workflowDesigne/components/editProcess.vue";
import showImageResource from "@/view/workflowDesigne/components/showImageResource.vue";
import workflowDesignApi from "@/api/workflowDesign.js";

export default {
  name: "workflowDesigne_page",
  components: {
    ProcessDefinitionTree,
    ProcessDefinitionTree2,
    createProcess,
    editProcess,
    showImageResource
  },
  data() {
    return {
      split: 0.15,
      changeComponent: "",
      selectedNodeId: null,
      selectedNodeTitle: null,
      spinShow: false,
      reloadFlag: true
    };
  },
  methods: {
    dealSelectedNodeIdAndTitle(selectedNodeId, selectedNodeTitle) {
      this.selectedNodeId = selectedNodeId;
      this.selectedNodeTitle = selectedNodeTitle;
      this.changeComponent = "showImageResource";
    },
    //发布模型
    deploymentProcess() {
      this.spinShow = true;
      this.reloadFlag = false;
      workflowDesignApi
        .deployment(this.selectedNodeId)
        .then(res => {
          //成功发布
          if (res.status === 0) {
            this.spinShow = false;
            this.reloadFlag = true;
            this.$Modal.success({ title: "成功", content: "发布成功" });
          } else {
            this.spinShow = false;
            this.reloadFlag = true;
            this.$Modal.error({ title: "错误", content: res.message });
          }
        })
        .catch(err => {
          this.spinShow = false;
          this.reloadFlag = true;
          this.$Modal.error({ title: "错误", content: "请求服务器错误" });
        });
    },
    //删除模型或流程
    deleteModelOrProcessDefinition() {
      this.reloadFlag = false;
      if (this.selectedNodeTitle.includes("草稿")) {
        workflowDesignApi
          .deleteModelById(this.selectedNodeId)
          .then(res => {
            if (res.status === 0) {
              this.reloadFlag = true;
              this.$Modal.success({ title: "操作成功", content: res.message });
            } else {
              this.reloadFlag = true;
              this.$Modal.error({ title: "操作失败", content: res.message });
            }
          })
          .catch(err => {
            this.reloadFlag = true;
            this.$Modal.error({ title: "操作失败", content: "请求服务器失败" });
          });
      } else if (this.selectedNodeTitle.includes("版本")) {
        workflowDesignApi
          .deleteDeploymentProcessDefinitionById(this.selectedNodeId)
          .then(res => {
            if (res.status === 0) {
              this.reloadFlag = true;
              this.$Modal.success({ title: "操作成功", content: res.message });
            } else {
              this.reloadFlag = true;
              this.$Modal.error({ title: "操作失败", content: res.message });
            }
          })
          .catch(err => {
            this.reloadFlag = true;
            this.$Modal.error({ title: "操作失败", content: "请求服务器失败" });
          });
      }
    }
  },
  //当选中的不是模型节点的时候，禁用编辑按钮
  computed: {
    isDisabledFunction() {
      if (
        this.selectedNodeTitle !== null &&
        this.selectedNodeTitle.includes("版本")
      ) {
        return true;
      }
    }
  }
};
</script>

<style scoped>
.split {
  height: 780px;
  border: 1px solid #dcdee2;
}
.split-pane {
  padding: 10px;
}
.ivu-divider-horizontal {
  margin: 10px 0;
}
</style>

