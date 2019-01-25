<template>
  <div class="panel-toolbar">
    <Button type="primary">新建部门</Button>
    <Divider type="vertical"/>
    <Button type="primary">新建人员</Button>
    <Divider type="horizontal"/>
    <add-people></add-people>
  </div>
</template>

<script>
import AddPeople from "@/view/organization/AddPeople.vue";
export default {
  name: "organization_page",
  components: {
    AddPeople
  },
  data() {
    return {};
  },
  computed: {}
};
</script>

<style >
</style>
