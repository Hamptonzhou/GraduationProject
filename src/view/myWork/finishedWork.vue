<template>
  <div>
    <Modal v-model="showImageModal" fullscreen footer-hide title="流程状态">
      <center> <img :src='image'></center>
    </Modal>
    <Form inline>
      <FormItem>
        <Input v-model="keyword" @on-change="searchByKeyword" clearable search enter-button placeholder="业务受理号或业务名称"
          style="width: 300px" />
      </FormItem>
      <FormItem>
        <Button @click="getProcessImage" type="primary" :loading="loadingImage" size="large">查看流程状态</Button>
      </FormItem>
      <FormItem>
        <Button @click="getBusinessForm" type="primary" size="large">查看业务表单</Button>
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

export default {
  name: "finishedWork_page",
  data() {
    return {
      columns: [
        {
          type: "index",
          width: 100,
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
          width: 200,
          align: "center"
        },
        {
          key: "businessEndTime",
          title: "业务结束时间",
          width: 200,
          align: "center"
        },
        {
          key: "durationTime",
          title: "业务耗时",
          width: 200,
          align: "center"
        },
        {
          title: "备注信息",
          key: "remarkContent",
          width: 300,
          align: "center",
          className: "remark-content-column"
        }
      ],
      isloading: false,
      tableList: [],
      total: null,
      currentPage: 1,
      pageSize: 30,
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
    this.isloading = true;
    this.getTableList();
  },

  methods: {
    getTableList: function() {
      this.isloading = true;
      workflowDesignApi
        .getFinishedWorkList(
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

