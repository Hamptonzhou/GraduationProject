<template>
  <div>
    <div class="split">
      <Split v-model="split" mode="horizontal">
        <div slot="left" class="split-pane">
          <organization-tree @childSendParentSelectedNodeId="toShowPeopleComponent">></organization-tree>
        </div>
        <div slot="right" class="split-pane">
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" @click="changeComponent='addDepartment'">新建部门</Button>
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" @click="changeComponent='addJobPosition'">新建岗位</Button>
          <Divider type="vertical" />
          <Button type="primary" ghost size="large" @click="changeComponent='AddPeople'">新建人员</Button>
          <Divider type="vertical" />
          <Divider type="horizontal" />
          <component :is="changeComponent" :selectedNodeId="selectedNodeId"></component>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
import organizationTree from "@/view/organization/organizationTree.vue";
import addDepartment from "@/view/organization/addDepartment.vue";
import addJobPosition from "@/view/organization/addJobPosition.vue";
import AddPeople from "@/view/organization/AddPeople.vue";
import showPeople from "@/view/organization/showPeople.vue";

export default {
  name: "organization_page",
  components: {
    organizationTree,
    addDepartment,
    addJobPosition,
    AddPeople,
    showPeople
  },
  data() {
    return {
      split: 0.15,
      changeComponent: "addDepartment",
      selectedNodeId: null
    };
  },
  methods: {
    toShowPeopleComponent(selectedNodeId) {
      this.selectedNodeId = selectedNodeId;
      this.changeComponent = "showPeople";
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

