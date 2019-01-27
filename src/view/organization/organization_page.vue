<template>
  <div>
    <div class="split">
      <Split v-model="split1" mode="horizontal">
        <div slot="left" class="split-pane">
          <organization-tree></organization-tree>
        </div>
        <div slot="right" class="split-pane">
          <Divider type="vertical"/>
          <Button type="primary" ghost @click="changeComponent='addDepartment'">新建部门</Button>
          <Divider type="vertical"/>
          <Button type="primary" ghost @click="changeComponent='addJobPosition'">新建岗位</Button>
          <Divider type="vertical"/>
          <Button type="primary" ghost @click="changeComponent='addPeople'">新建人员</Button>
          <Divider type="vertical"/>
          <Divider type="horizontal"/>
          <component :is="changeComponent"></component>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
import organizationTree from "@/view/organization/organizationTree.vue";
import addDepartment from "@/view/organization/addDepartment.vue";
import addJobPosition from "@/view/organization/addJobPosition.vue";
import addPeople from "@/view/organization/addPeople.vue";

export default {
  name: "organization_page",
  components: {
    organizationTree,
    addDepartment,
    addJobPosition,
    addPeople
  },
  data() {
    return {
      split1: 0.15,
      changeComponent: "addDepartment"
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
</style>

