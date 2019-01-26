<template>
  <div class="panel-toolbar">
    <Button type="primary">新建部门</Button>
    <Divider type="vertical"/>
    <Button type="primary">新建岗位</Button>
    <Divider type="vertical"/>
    <Button type="primary">新建人员</Button>
    <Divider type="horizontal"/>
    <add-people></add-people>
    <add-job-position></add-job-position>
    <add-department></add-department>
  </div>
</template>

<script>
import addPeople from "@/view/organization/addPeople.vue";
import addJobPosition from "@/view/organization/addJobPosition.vue";
import addDepartment from "@/view/organization/addDepartment.vue";

export default {
  name: "organization_page",
  components: {
    addPeople,
    addJobPosition,
    addDepartment
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style >
</style>
