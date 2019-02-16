<template>
  <Tree :data="treeData" :render="renderContent" @on-select-change="selected"></Tree>
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
    this.fetchProcessDefinitionTree();
  },
  methods: {
    selected() {
      console.log("选择节点");
    },
    fetchProcessDefinitionTree() {
      workflowDesignApi.getProcessDefinitionTree().then(res => {
        if (res.status === 0) {
          //后端定义的流程定义树的属性名称为title、children，与iview默认的一致，因此不需要额外赋值
          this.treeData = this.getTree(res.data);
          // this.treeData = res.data;
        }
      });
    },
    getTree(tree = []) {
      let arr = [];
      let obj = {};
      obj.title = tree.title;
      obj.children = tree.children;
      obj.expand = true;
      arr.push(obj);
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
                // type: "ios-cube"
              },
              style: {
                // marginRight: "8px"
              }
            }),
            h("span", data.title)
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
      console.log(
        data + "获取到id--判断选中的时候模型还是流程--再进行判断删除"
      );
      const parentKey = root.find(el => el === node).parent;
      const parent = root.find(el => el.nodeKey === parentKey).node;
      const index = parent.children.indexOf(data);
      parent.children.splice(index, 1);
    }
  }
};
</script>






