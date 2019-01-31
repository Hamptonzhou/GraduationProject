<template>
  <div>
    <div class="split">
      <Split v-model="split" mode="horizontal">
        <div slot="left" class="split-pane">
          <process-definition-tree></process-definition-tree>
        </div>
        <div slot="right" class="split-pane">
          <Divider type="vertical"/>
          <Button type="primary" ghost size="large" @click="changeComponent='createProcess'">新建流程</Button>
          <Divider type="vertical"/>
          <Button type="primary" ghost size="large" @click="changeComponent='editProcess'">编辑流程</Button>
          <Divider type="vertical"/>
          <Button
            type="primary"
            ghost
            size="large"
            @click="changeComponent='deploymentProcess'"
          >发布流程</Button>
          <Divider type="vertical"/>
          <Divider type="horizontal"/>
          <component :is="changeComponent"></component>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
import ProcessDefinitionTree from "@/view/workflowDesigne/components/ProcessDefinitionTree.vue";

import createProcess from "@/view/workflowDesigne/components/createProcess.vue";
import editProcess from "@/view/workflowDesigne/components/editProcess.vue";
import deploymentProcess from "@/view/workflowDesigne/components/deploymentProcess.vue";

export default {
  name: "workflowDesigne_page",
  components: {
    ProcessDefinitionTree,
    createProcess,
    editProcess,
    deploymentProcess
  },
  data() {
    return {
      split: 0.15,
      changeComponent: ""
    };
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

