<template>
  <div>
    <!-- 查看流程图模态框 -->
    <Modal v-model="showImageModal" fullscreen footer-hide title="流程状态">
      <center> <img :src='image'></center>
    </Modal>
    <!-- 备注信息模态框 -->
    <Modal v-model="showDoubleClickModal" title="业务流程备注信息">
      <textarea ref="remarkTextarea" cols="65" rows="10" autofocus placeholder="无备注信息"></textarea>
    </Modal>
    <!-- 业务表单模态框组件 -->
    <rendering-form ref="renderingFormComp"></rendering-form>
    <Form ref="businessDefinitionForm" :model="businessDefinitionForm" :rules="rulebusinessDefinitionForm" :label-width="100">
      <Row>
        <i-col span="5">
          <FormItem label="业务标题" prop="businessTitle">
            <Input v-model="businessDefinitionForm.businessTitle" />
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="所用流程" prop="useProcessId">
            <treeselect v-model="businessDefinitionForm.useProcessId" :options="ProcessTree" @open="getProcessTree"
              @select="selectedProcessTreeNode" placeholder="请选择流程" clearable searchable noChildrenText="无子项"
              noOptionsText="无可用数据" />
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="所用表单" prop="useFormId">
            <treeselect v-model="businessDefinitionForm.useFormId" :options="FormTree" @open="getFormTree" @select="selectedFormTreeNode"
              placeholder="请选择表单" clearable searchable noChildrenText="无子项" noOptionsText="无可用数据" />
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem>
            <Button @click="getProcessDefinitionImage" type="primary" ghost :loading="loadingImage" size="large">查看流程</Button>
            <Divider type="vertical" />
            <Button @click="getBusinessForm" type="primary" ghost :loading="loadingForm" size="large">查看表单</Button>
            <Divider type="vertical" />
            <Button @click="handleSave" type="primary" size="large">保 存</Button>
            <Divider type="vertical" />
            <Button @click="handleReset" type="primary" size="large">重 置</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
    <Table border size="large" :loading="isloading" highlight-row @on-current-change="getCurrentRow" @on-row-dblclick="getDoubleClick"
      :height="tableHeight" :columns="columns" :data="tableList"></Table>
    <Page :total="total" show-elevator show-sizer show-total :page-size="30" :page-size-opts="[30, 50, 100]" @on-change="getCurrentPage"
      @on-page-size-change="getPageSize" />
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
import { mapState } from "vuex";
import renderingForm from "@/view/formDesigner/renderingForm.vue";
import "./style.css";

// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import formDesignerAPI from "@/api/formDesigner.js";

export default {
  name: "createWork_page",
  // register the component
  components: { Treeselect, renderingForm },
  data() {
    return {
      columns: [
        {
          type: "selection",
          width: 70,
          align: "center"
        },
        {
          type: "index",
          width: 70,
          align: "center"
        },
        {
          key: "businessName",
          title: "业务标题",
          width: 250,
          align: "center"
        },
        {
          key: "processDefinitionName",
          title: "所用流程名称",
          width: 250,
          align: "center"
        },
        {
          key: "businessFormName",
          title: "所用表单名称",
          width: 250,
          align: "center"
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    icon: "md-play",
                    type: "success"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.startProcessDefinition(
                        params.row.processDefinitionId
                      );
                    }
                  }
                },
                "启动业务"
              ),
              h(
                "Button",
                {
                  props: {
                    icon: "md-trash",
                    type: "error"
                  },
                  on: {
                    click: () => {
                      this.deleteBusinessDefinitionItem(params.row.id);
                    }
                  }
                },
                "删除业务"
              )
            ]);
          }
        },
        {
          title: "备注信息",
          key: "remarkContent",
          width: 300,
          align: "center",
          className: "remark-content-column"
        }
      ],
      ProcessTree: [],
      FormTree: [],
      businessDefinitionForm: {
        businessTitle: "",
        useProcessId: null,
        useProcessName: "",
        useFormId: null,
        useFormName: ""
      },
      rulebusinessDefinitionForm: {
        businessTitle: [
          {
            required: true,
            message: "请填写业务标题",
            trigger: "blur"
          }
        ],
        useProcessId: [
          {
            required: true,
            message: "请选择业务流程",
            trigger: "blur"
          }
        ]
        // useFormId: [
        //   {
        //     required: true,
        //     message: "请指定业务表单",
        //     trigger: "blur"
        //   }
        // ]
      },
      isloading: false,
      tableList: [],
      total: null,
      currentPage: 1,
      pageSize: 30,
      keyword: null,
      isShow: false,
      tableHeight: 680,
      showDoubleClickModal: false,
      showImageModal: false,
      loadingImage: false,
      loadingForm: false,
      image: null,
      processDefinitionId: null,
      businessFormId: null
    };
  },
  computed: {
    ...mapState({
      userName: state => state.user.userName
    })
  },
  mounted() {
    this.isloading = true;
    this.getTableList();
  },

  methods: {
    //获取流程下拉数据
    getProcessTree() {
      workflowDesignApi
        .getProcessDefinitionTree()
        .then(res => {
          if (res.status === 0) {
            let tree = res.data;
            let arr = [];
            let obj = {};
            obj.id = tree.id;
            obj.title = tree.title;
            obj.children = tree.children;
            arr.push(obj);
            //将对象转换成字符串
            var ProcessTreeString = JSON.stringify(arr).replace(
              /title/g,
              "label"
            );
            //将字符串转换成对象
            this.ProcessTree = JSON.parse(ProcessTreeString);
          } else {
            this.$Message.error("获取流程下拉列表数据失败！");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器失败！");
        });
    },
    //选择流程
    selectedProcessTreeNode(node) {
      this.businessDefinitionForm.useProcessId = node.id;
      if (node.label.includes("草稿")) {
        this.$Message.error("请勿选择草稿作为流程");
      } else {
        this.businessDefinitionForm.useProcessName = node.label;
      }
      console.log(
        this.businessDefinitionForm.useProcessId +
          "===" +
          this.businessDefinitionForm.useProcessName
      );
    },
    //获取业务表单下拉数据
    getFormTree() {
      formDesignerAPI
        .getAllFormData()
        .then(res => {
          if (res.status === 0) {
            var formTreeString = JSON.stringify(res.data).replace(
              /formName/g,
              "label"
            );
            var formTreeArray = [];
            formTreeArray.push(formTreeString);
            this.FormTree = JSON.parse(formTreeArray);
          } else {
            this.$Message.error("获取表单下拉列表数据失败！");
          }
        })
        .catch(err => {
          this.$Message.error("catch-请求服务器失败！");
        });
    },
    //选择业务表单
    selectedFormTreeNode(node) {
      this.businessDefinitionForm.useFormId = node.id;
      this.businessDefinitionForm.useFormName = node.label;
    },
    //保存业务定义
    handleSave() {
      this.$refs["businessDefinitionForm"].validate(valid => {
        if (valid) {
          workflowDesignApi
            .saveOrUpdateBusinessDefinition(this.businessDefinitionForm)
            .then(res => {
              if (res.status === 0) {
                this.$Message.success("新增业务定义成功！");
                this.handleReset();
                this.getTableList();
              } else {
                this.$Message.error("新增业务定义失败!");
              }
            })
            .catch(err => {
              this.$Message.error("catch-请求服务器失败!");
            });
        } else {
          this.$Message.error("请完善信息!");
        }
      });
    },
    //删除业务定义
    deleteBusinessDefinitionItem(itemId) {
      this.isloading = true;
      workflowDesignApi
        .deleteItem(itemId)
        .then(res => {
          this.isloading = false;
          if (res.status === 0) {
            this.$Message.success("删除成功！");
            this.getTableList();
          } else {
            this.$Message.error("删除失败！");
          }
        })
        .catch(err => {
          this.isloading = false;
          this.$Message.error("catch-请求服务器异常");
        });
    },
    //清空表单
    handleReset() {
      this.$refs["businessDefinitionForm"].resetFields();
    },
    getTableList: function() {
      this.isloading = true;
      workflowDesignApi
        .getBusinessDefinitionList(
          this.currentPage,
          this.pageSize,
          this.keyword
        )
        .then(res => {
          this.isloading = false;
          if (res.status === 0) {
            this.tableList = res.data.rows;
            this.total = res.data.total;
          } else {
            this.$Message.error("获取数据失败");
          }
        })
        .catch(err => {
          this.isloading = false;
          this.$Message.error("catch-请求服务器异常");
        });
    },
    //点击某一行时
    getCurrentRow(currentRow) {
      //获取流程实例ID
      this.processDefinitionId = currentRow.processDefinitionId;
      this.businessFormId = currentRow.businessFormId;
    },
    //双击时，显示详细信息
    getDoubleClick(currentRow) {
      this.showDoubleClickModal = true;
      this.$refs.remarkTextarea.value = currentRow.remarkContent;
    },
    //修改页码
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.getTableList();
    },
    //修改每页显示的条数
    getPageSize(pageSize) {
      this.pageSize = pageSize;
      this.getTableList();
    },
    //查看流程图片
    getProcessDefinitionImage() {
      this.loadingImage = true;
      if (this.processDefinitionId === null) {
        this.loadingImage = false;
        this.$Message.info("请选择一项工作");
      } else {
        workflowDesignApi
          .getProcessDefinitionImage(this.processDefinitionId)
          .then(res => {
            if (res.status === 0) {
              //操作返回的base64的图片数据，显示在页面上
              this.image = "data:image/png;base64," + res.data.image;
              this.loadingImage = false;
              this.showImageModal = true;
            } else {
              this.$Message.error("无法获取流程图！");
            }
          })
          .catch(err => {
            this.$Message.error("catch-请求服务器异常");
          });
      }
    },
    //查看渲染之后的业务表单
    getBusinessForm() {
      this.loadingForm = true;
      if (this.businessFormId === null) {
        this.loadingForm = false;
        this.$Message.info("请选择一项工作");
      } else {
        this.loadingForm = false;
        this.$refs.renderingFormComp.showForm(this.businessFormId);
      }
    },
    //启动流程
    startProcessDefinition(processDefinitionId) {
      this.$Message.info(
        "根据流程定义id启动流程，启动时设置流程中的业务key字段为业务定义id=====" +
          processDefinitionId
      );
    }
  }
};
</script>

<style scoped>
</style>


