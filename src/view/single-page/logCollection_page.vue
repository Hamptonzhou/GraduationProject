<template>
  <div>
    <div>
      <Button @click="exportData" type="primary" style="margin: 0 10px 10px 0;">导出日志记录</Button>
      <DatePicker
        type="daterange"
        split-panels
        placeholder="筛选日期"
        style="width: 200px"
        @on-change="handleChange"
      ></DatePicker>
      <Input
        v-model="keyword"
        @on-change="searchByKeyword"
        clearable
        search
        enter-button
        placeholder="操作用户或方法名"
        style="width: 300px"
      />
      <Icon type="md-refresh" size="20" @click="getLogList"/>
    </div>
    <Table
      border
      stripe
      :loading="isloading"
      @on-row-dblclick="getRowClick"
      ref="table"
      :columns="columns"
      :data="logList"
    ></Table>
    <Page
      :total="total"
      show-elevator
      show-sizer
      show-total
      :page-size="50"
      :page-size-opts="[30, 50, 100]"
      @on-change="getCurrentPage"
      @on-page-size-change="getPageSize"
    />
    <Modal v-model="isShow" title="日志详情">
      <div>操作用户：{{ LogDetail.realName}}</div>
      <div>用户ID：{{ LogDetail.userId}}</div>
      <div>客户端IP：{{ LogDetail.clientIp}}</div>
      <div>请求地址：{{ LogDetail.requestUri}}</div>
      <div>操作方法：{{ LogDetail.method}}</div>
      <div>方法参数：{{ LogDetail.parameter}}</div>
      <div>请求耗时：{{ LogDetail.executionTime}}</div>
      <div>请求时间：{{ LogDetail.date}}</div>
    </Modal>
  </div>
</template>

<script>
import logCollectionApi from "@/api/LogCollection.js";

export default {
  name: "logCollection_page",
  data() {
    return {
      columns: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          key: "realName",
          title: "操作用户",
          width: 110,
          align: "center"
        },
        {
          key: "clientIp",
          title: "客户端IP",
          width: 150,
          align: "center"
        },
        {
          key: "requestUri",
          title: "请求地址",
          width: 430,
          align: "center"
        },
        {
          key: "method",
          title: "操作方法",
          align: "center"
        },
        {
          key: "parameter",
          title: "方法参数",
          width: 330,
          align: "center"
        },

        {
          key: "executionTime",
          title: "耗时(ms)",
          width: 90,
          align: "center"
        },
        // {
        //   key: "description",
        //   title: "日志描述",
        //   align: "center"
        // },
        {
          key: "date",
          title: "请求发送时间",
          sortable: true,
          sortType: "desc",
          align: "center",
          width: 150
        }
      ],
      isloading: false,
      logList: [],
      total: null,
      currentPage: 1,
      pageSize: 50,
      startDate: null,
      endDate: null,
      keyword: null,
      isShow: false,
      LogDetail: {}
    };
  },
  mounted() {
    this.isloading = true;
    this.getLogList();
  },

  methods: {
    getLogList: function() {
      this.isloading = true;
      logCollectionApi
        .getOperationLogList(
          this.currentPage,
          this.pageSize,
          this.startDate,
          this.endDate,
          this.keyword
        )
        .then(res => {
          this.isloading = false;
          if (res.status === 0) {
            this.logList = res.data.rows;
            this.total = res.data.total;
          } else {
            this.isloading = false;
            console.log("else-无法获取列表");
          }
        })
        .catch(err => {
          this.isloading = false;
          console.log("catch-无法获取列表");
        });
    },

    //双击时，显示详细信息
    getRowClick(rowData) {
      this.isShow = true;
      this.LogDetail = rowData;
      console.log(rowData);
    },
    //搜索框内容变化时，根据关键字立即调用搜索
    searchByKeyword() {
      this.getLogList();
    },
    //日期选择框变化时，触发@on-change后调用该函数，进行日期设置
    handleChange(date) {
      this.startDate = date[0];
      this.endDate = date[1];
      this.getLogList();
    },
    //修改页码
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      this.getLogList();
    },
    //修改每页显示的条数
    getPageSize(pageSize) {
      this.pageSize = pageSize;
      this.getLogList();
    },
    //导出csv文件
    exportData() {
      this.$refs.table.exportCsv({
        filename: new Date() + "错误日志.csv"
      });
    }
  }
};
</script>

<style>
</style>
