<template>
  <div>
    <Modal v-model="showImageModal" fullscreen footer-hide title="流程状态">
      <center> <img :src='image'></center>
    </Modal>
    <!-- 业务表单模态框组件 -->
    <rendering-form ref="renderingFormComp"></rendering-form>
    <Form inline>
      <FormItem>
        <Input v-model="keyword" @on-change="searchByKeyword" clearable search enter-button placeholder="业务受理号或业务名称"
          style="width: 300px" />
      </FormItem>
      <FormItem>
        <Button @click="getProcessImage" type="primary" :loading="loadingImage" size="large">查看流程状态</Button>
      </FormItem>
      <FormItem>
        <Button @click="getBusinessForm" type="primary" :loading="loadingForm" size="large">查看业务表单</Button>
      </FormItem>
      <FormItem>
        <Button shape="circle" icon="md-refresh" @click="getTableList"></Button>
      </FormItem>
    </Form>
    <Table border size="large" :loading="isloading" highlight-row @on-current-change="getCurrentRow" @on-row-dblclick="getDoubleClick"
      :height="tableHeight" :columns="columns" :data="tableList"></Table>
    <Page :total="total" show-elevator show-sizer show-total :page-size="30" :page-size-opts="[30, 50, 100]" @on-change="getCurrentPage"
      @on-page-size-change="getPageSize" />
    <Modal v-model="showDoubleClickModal" title="业务流程备注信息">
      <textarea ref="remarkTextarea" cols="80" rows="10" autofocus placeholder="无备注信息" disabled></textarea>
    </Modal>
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
import { mapState } from "vuex";
import "./style.css";

import renderingForm from "@/view/formDesigner/renderingForm.vue";

export default {
  name: "personalDoneWork_page",
  components: { renderingForm },
  data() {
    return {
      columns: [
        {
          type: "index",
          width: 70,
          align: "center"
        },
        {
          key: "businessAcceptNumber",
          title: "业务受理号",
          sortable: true,
          sortType: "desc",
          width: 150,
          align: "center"
        },
        {
          key: "businessName",
          title: "业务名称",
          width: 250,
          align: "center"
        },
        {
          key: "businessStartTime",
          title: "业务开始时间",
          width: 170,
          align: "center"
        },
        {
          key: "taskName",
          title: "环节名称",
          width: 250,
          align: "center"
        },
        {
          key: "taskStartTime",
          title: "环节开始时间",
          width: 170,
          align: "center"
        },
        {
          key: "claimTime",
          title: "接办时间",
          width: 170,
          align: "center"
        },

        {
          key: "taskEndTime",
          title: "结束处理时间",
          width: 170,
          align: "center"
        },
        {
          key: "durationTime",
          title: "处理耗时",
          align: "center",
          width: 150
        },
        {
          title: "备注信息",
          key: "remarkContent",
          width: 200,
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
      isloading: false,
      tableList: [],
      total: null,
      currentPage: 1,
      pageSize: 30,
      keyword: null,
      isShow: false,
      tableHeight: 680,
      showDoubleClickModal: false,
      image: null,
      showImageModal: false,
      loadingImage: false,
      processInstanceId: null,
      loadingForm: false
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
            this.loadingImage = false;
            if (res.status === 0) {
              if (typeof res.data.image !== "undefined") {
                this.image = "data:image/png;base64," + res.data.image;
                this.showImageModal = true;
              }
            } else {
              this.$Message.error("else-无法获取流程图片");
            }
          })
          .catch(err => {
            this.$Message.error("catch-请求服务器异常");
            this.loadingImage = false;
          });
      }
    },
    //查看渲染之后的业务表单
    getBusinessForm() {
      this.loadingForm = true;
      if (this.processInstanceId === null) {
        this.loadingForm = false;
        this.$Message.info("请选择一项工作");
      } else {
        //根据this.processInstanceId获取业务key，业务key赋值businessFormId，传递businessFormId到组件渲染表单
        workflowDesignApi
          .getBusinessFormId(this.processInstanceId)
          .then(res => {
            this.loadingForm = false;
            if (res.status === 0) {
              console.log(res);
              debugger;
              this.$refs.renderingFormComp.showForm(res.data);
            } else {
              this.$Message.error("获取业务表单失败");
            }
          })
          .catch(err => {
            this.$Message.error("catch-请求服务器异常");
          });
      }
    }
  }
};
</script>

