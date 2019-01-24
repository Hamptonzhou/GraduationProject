<template>
  <div>
    <div class="form-inline">
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
    </div>
    <Table border stripe @on-row-click="getRowClick" ref="table" :columns="columns" :data="logList"></Table>
    <Page
      :total="total"
      show-elevator
      show-sizer
      show-total
      @on-change="getCurrentPage"
      @on-page-size-change="getPageSize"
    />
  </div>
</template>

<script>
import logCollectionApi from "@/api/LogCollection.js";
import axios from "axios";

export default {
  name: "logCollection_page",
  data() {
    return {
      columns: [
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
      logList: [],
      total: null,
      currentPage: 1,
      pageSize: 20,
      startDate: null,
      endDate: null,
      keyword: null
    };
  },
  mounted() {
    this.getLogList();
  },

  methods: {
    getLogList: function() {
      axios
        .get("http://localhost:9600/LogAnalyseController/getOperationLogList", {
          params: {
            page: this.currentPage,
            rows: this.pageSize,
            startDate: this.startDate,
            endDate: this.endDate,
            keyword: this.keyword
          }
        })
        .then(res => {
          if (res.data.status === 0) {
            this.logList = res.data.data.rows;
            this.total = res.data.data.total;
          } else {
            alert("无法获取列表");
          }
        })
        .catch(err => {
          alert("无法获取列表");
        });
    },
    //双击时，显示详细信息
    getRowClick(rowData) {
      alert(rowData);
    },
    //搜索框内容变化时，立即调用搜索
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
