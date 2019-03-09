<template>
  <div>
    <!-- 查看流程图模态框 -->
    <Modal title="流程状态" width="600" v-model="showImageModal" @on-cancel="showImageModal=false">
      <img :src='image'>
    </Modal>
    <!-- 备注信息模态框 -->
    <Modal v-model="showDoubleClickModal" title="业务流程备注信息">
      <textarea ref="remarkTextarea" cols="80" rows="10" autofocus placeholder="无备注信息"></textarea>
    </Modal>

    <Form ref="businessDefinitionForm" :model="businessDefinitionForm" :rules="rulebusinessDefinitionForm" :label-width="100">
      <Row>
        <i-col span="5">
          <FormItem label="业务标题" prop="businessTitle">
            <Input v-model="businessDefinitionForm.businessTitle" />
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="所用流程" prop="useProcessId">
            <treeselect v-model="businessDefinitionForm.useProcessId" clearable searchable :show-count="true"
              noChildrenText="" />
          </FormItem>
        </i-col>
        <i-col span="5">
          <FormItem label="所用表单" prop="useForm">
            <treeselect v-model="businessDefinitionForm.useForm" clearable searchable :show-count="true" noChildrenText="" />
          </FormItem>
        </i-col>
        <i-col span="8">
          <FormItem>
            <Button @click="getProcessImage" type="primary" ghost :loading="loadingImage" size="large">查看流程</Button>
            <Divider type="vertical" />
            <Button @click="getForm" type="primary" ghost :loading="loadingImage" size="large">查看表单</Button>
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
import "./style.css";

// import the component
import Treeselect from "@riophae/vue-treeselect";
// import the styles
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "createWork_page",
  // register the component
  components: { Treeselect },
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
          key: "formName",
          title: "所用表单名称",
          width: 250,
          align: "center"
        },
        {
          key: "taskStartTime",
          title: "所用流程名称",
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
                      this.show(params.index);
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
                      this.remove(params.index);
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
        },
        //隐藏列，用于记录taskId方便操作
        {
          title: "0",
          key: "taskId",
          width: 1,
          render: (h, params) => {
            return h("span", {
              style: {
                display: "none"
              }
            });
          }
        }
      ],
      options: [],
      businessDefinitionForm: {
        businessTitle: "",
        userPassword: "",
        confirmPassword: "",
        realName: "",
        jobNumber: ""
      },
      isloading: false,
      tableList: [],
      total: null,
      currentPage: 1,
      pageSize: 50,
      startDate: null,
      endDate: null,
      keyword: null,
      isShow: false,
      tableHeight: 680,
      showDoubleClickModal: false,
      image: null,
      showImageModal: false,
      loadingImage: false,
      image: null
    };
  },
  computed: {
    ...mapState({
      userName: state => state.user.userName
    })
  },
  mounted() {
    // this.isloading = true;
    // this.getTableList();
  },

  methods: {
    getTableList: function() {
      this.isloading = true;
      workflowDesignApi
        .getPersonalDoneWorkList(
          this.currentPage,
          this.pageSize,
          this.keyword,
          this.userName
        )
        .then(res => {
          this.isloading = false;
          if (res.status === 0) {
            this.tableList = res.data.rows;
            this.total = res.data.total;
          } else {
            this.isloading = false;
            this.$Message.error("else-请求服务器异常");
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
      this.processInstanceId = currentRow.businessAcceptNumber;
    },
    //双击时，显示详细信息
    getDoubleClick(currentRow) {
      this.showDoubleClickModal = true;
      this.$refs.remarkTextarea.value = currentRow.remarkContent;
    },
    //搜索框内容变化时，根据关键字立即调用搜索
    searchByKeyword() {
      this.getTableList();
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
    getProcessImage() {
      this.loadingImage = true;
      if (this.processInstanceId === null) {
        this.$Message.info("请选择一项工作");
        this.loadingImage = false;
      } else {
        workflowDesignApi
          .getProcessImage(this.processInstanceId)
          .then(res => {
            if (res.status === 0) {
              if (typeof res.data.image !== "undefined") {
                this.image = "data:image/png;base64," + res.data.image;
                this.loadingImage = false;
                this.showImageModal = true;
              }
            } else {
              this.$Message.error("else-无法获取流程图片");
              this.loadingImage = false;
            }
          })
          .catch(err => {
            this.$Message.error("catch-请求服务器异常");
            this.loadingImage = false;
          });
      }
    },
    //查看业务表单
    getBusinessForm() {
      this.$Message.info("查看业务表单");
    }
  }
};
</script>

<style scoped>
</style>


