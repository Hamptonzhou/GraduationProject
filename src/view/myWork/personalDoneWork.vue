<template>
  <div>
    <Form inline>
      <FormItem>
        <Input v-model="keyword" @on-change="searchByKeyword" clearable search enter-button placeholder="业务受理号或业务名称"
          style="width: 300px" />
      </FormItem>
      <FormItem>
        <Button @click="getProcessImage" type="primary">查看流程状态</Button>
      </FormItem>
      <FormItem>
        <Button @click="getBusinessForm" type="primary">查看业务表单</Button>
      </FormItem>
      <FormItem>
        <Button shape="circle" icon="md-refresh" @click="getTableList"></Button>
      </FormItem>
    </Form>
    <Table border :loading="isloading" highlight-row @on-current-change="getCurrentRow" @on-row-dblclick="getRowClick"
      :height="tableHeight" :columns="columns" :data="tableList"></Table>
    <Page :total="total" show-elevator show-sizer show-total :page-size="50" :page-size-opts="[30, 50, 100]" @on-change="getCurrentPage"
      @on-page-size-change="getPageSize" />
    <Modal v-model="isShow" title="在办工作详情">
    </Modal>
  </div>
</template>

<script>
import workflowDesignApi from "@/api/workflowDesign.js";
import { mapState } from "vuex";

export default {
  name: "personalDoneWork_page",
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
          width: 300,
          align: "center"
        },
        {
          key: "businessStartTime",
          title: "业务开始时间",
          width: 150,
          align: "center"
        },
        {
          key: "taskName",
          title: "环节名称",
          width: 300,
          align: "center"
        },
        {
          key: "taskStartTime",
          title: "环节开始时间",
          width: 150,
          align: "center"
        },
        {
          key: "claimTime",
          title: "接办时间",
          width: 150,
          align: "center"
        },

        {
          key: "taskEndTime",
          title: "结束处理时间",
          width: 150,
          align: "center"
        },
        {
          key: "durationTime",
          title: "处理耗时",
          align: "center",
          width: 150
        }
      ],
      isloading: false,
      tableList: [],
      total: null,
      currentPage: 1,
      pageSize: 50,
      startDate: null,
      endDate: null,
      keyword: null,
      isShow: false,
      LogDetail: {},
      tableHeight: 680
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
            this.isloading = false;
            this.$Message.error("else-请求服务器异常");
          }
        })
        .catch(err => {
          this.isloading = false;
          this.$Message.error("catch-请求服务器异常");
        });
    },
    getCurrentRow() {
      //点击某一行时，获取当前行的数据，然后才进行提交接办等操作
      this.$Message.info("对当前行进行提交或者接办等操作");
    },
    //双击时，显示详细信息
    getRowClick(rowData) {
      this.isShow = true;
      this.LogDetail = rowData;
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
      this.$Message.info("查看流程图片");
    },
    //查看业务表单
    getBusinessForm() {
      this.$Message.info("查看业务表单");
    }
  }
};
</script>

<style scoped>
.ivu-btn {
  border-color: #fff;
}
</style>
