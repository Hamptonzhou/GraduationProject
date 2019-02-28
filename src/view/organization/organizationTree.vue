<template>
  <div>
    <Tree :data="departmentTree" @on-select-change="selectedNode"></Tree>
  </div>
</template>
<script>
import organizationAPI from "@/api/organization.js";
export default {
  data() {
    return {
      parentId: null,
      newList: [],
      departmentTree: []
    };
  },
  mounted() {
    this.fetchDepartmentTree();
  },
  methods: {
    fetchDepartmentTree() {
      organizationAPI
        .getDepartmentTree()
        .then(res => {
          if (res.status === 0) {
            this.departmentTree = this.getTree(res.data);
          } else {
            this.$Message.error("else-无法获取部门列表");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求获取部门列表失败");
        });
    },

    getTree(tree = []) {
      let arr = [];
      let obj = {};
      obj.id = tree.id;
      obj.title = tree.title;
      obj.children = tree.children;
      obj.expand = true;
      arr.push(obj);
      return arr;
    },
    // 选中节点
    selectedNode(node) {
      this.$Message.info(node);
    },

    // 点击时，根据点击的树节点的parentId去获取当前树节点的所有用户，在右边用卡片显示
    getCurrentTreeNodePeople() {
      this.$Message.info(
        "点击时，根据点击的树节点的parentId去获取当前树节点的所有用户，在右边用卡片显示"
      );
    }
  }
};
</script>
