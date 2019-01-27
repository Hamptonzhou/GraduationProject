<template>
  <Tree
    :data="departmentList"
    :load-data="loadChildren"
    @on-select-change="getCurrentTreeNodePeople"
  ></Tree>
</template>
<script>
import organizationAPI from "@/api/organization.js";
export default {
  data() {
    return {
      parentId: null,
      newList: [],
      departmentList: [
        {
          title: "所有部门",
          loading: false,
          children: [],
          departmentId: ""
        }
      ]
    };
  },
  methods: {
    // item 当前节点的信息
    loadChildren(item, callback) {
      console.log(item);
      if (this.parentId === null) {
        this.parentId = "#";
      } else {
        this.parentId = item.departmentId;
      }
      //获取所有部门列表
      organizationAPI
        .getDepartmentList(this.parentId)
        .then(res => {
          if (res.status === 0) {
            var list = res.data;
            console.log(list);
            list.forEach(department => {
              const oneDepartment = {
                title: department.departmentName,
                loading: false,
                children: [],
                departmentId: department.id
              };
              this.newList.push(oneDepartment);
            });
            console.log(this.newList);
            callback(this.newList);
            //清空数组
            this.newList = [];
          } else {
            console.log("无法获取部门列表");
          }
        })
        .catch("catch-请求获取部门列表失败");

      // 模拟异步请求
      //   setTimeout(() => {
      //     const data = [
      //       {
      //         title: "子级1",
      //         loading: false,
      //         children: []
      //       },
      //       {
      //         title: "子级2",
      //         loading: false,
      //         children: []
      //       }
      //     ];
      //     callback(data);
      //   }, 200);
    },

    // 点击时，根据点击的树节点的parentId去获取当前树节点的所有用户，在右边用卡片显示
    getCurrentTreeNodePeople() {
      console.log(
        "点击时，根据点击的树节点的parentId去获取当前树节点的所有用户，在右边用卡片显示"
      );
    }
  }
};
</script>
