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
        <Button @click="submitTask" type="primary">提交</Button>
      </FormItem>
      <FormItem>
        <Button @click="claimTask" type="primary">接办</Button>
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
  name: "handlingWork_page",
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
          key: "taskType",
          title: "环节类型",
          width: 150,
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
          key: "remark",
          title: "备注信息",
          width: 150,
          align: "center"
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
      processInstanceId: null,
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
        .getHanglingWorkList(
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
    //点击某一行时，获取当前行业务受理号(流程实例id)
    getCurrentRow(currentRow) {
      this.processInstanceId = currentRow.businessAcceptNumber;
    },
    //双击时，显示详细信息
    getRowClick(rowData) {
      this.isShow = true;
      this.LogDetail = rowData;
      console.log(rowData);
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
      if (this.processInstanceId === null) {
        this.$Message.info("请选择一项工作");
      } else {
        this.$Message.info(this.processInstanceId + "的查看流程图片");
      }
    },
    //查看业务表单
    getBusinessForm() {
      this.$Message.info(this.processInstanceId + "查看业务表单");
    },
    //提交环节
    submitTask() {
      this.$Message.info(
        this.processInstanceId +
          "由此流程实例id查询execution表，查表中的活动环节，活动环节就在ru_task中，获取到该环节id即可提交环节"
      );
    },
    //接办环节
    claimTask() {
      this.$Message.info(
        "同上获取到taskid，交给后台claim(taskId, userId)接办环节"
      );
    }
  }
};
</script>

<style scoped>
.ivu-btn {
  border-color: #fff;
}
</style>
