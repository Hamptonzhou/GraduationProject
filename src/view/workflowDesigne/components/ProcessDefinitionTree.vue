<template>
  <Tree :data="treeData" :render="renderContent"></Tree>
</template>
<script>
import workflowDesignApi from "@/api/workflowDesign.js";
export default {
  data() {
    return {
      treeData: [],
      buttonProps: {
        type: "default",
        size: "small"
      }
    };
  },
  mounted() {
    this.fetchAllmodel();
  },
  methods: {
    fetchAllmodel() {
      workflowDesignApi.getAllModel().then(res => {
        if (res.status === 0) {
          this.treeData = this.getTree(res.data);
        }
      });
    },
    getTree(tree = []) {
      console.log(tree);
      let arr = [];
      if (tree.length !== 0) {
        tree.forEach(item => {
          let obj = {};
          obj.name = item.name;
          // workflowDesignApi.fetchChildren()
          obj.children = [
            {
              name: "child 1-1"
            }
          ];
          arr.push(obj);
        });
      }
      return arr;
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          }
        },
        [
          h("span", [
            h("Icon", {
              props: {
                type: "ios-cube"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.name)
          ]),
          h(
            "span",
            {
              style: {
                display: "inline-block",
                float: "right",
                marginRight: "32px"
              }
            },
            [
              h("Button", {
                props: Object.assign({}, this.buttonProps, {
                  icon: "ios-remove"
                }),
                on: {
                  click: () => {
                    //调用下方的remove方法
                    this.remove(root, node, data);
                  }
                }
              })
            ]
          )
        ]
      );
    },
    //删除时触发的逻辑，调用后台接口，删除数据库中的模型
    remove(root, node, data) {
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    }
  }
};
</script>






