<template>
  <div>
    <Button @click="exportData" type="primary" style="margin: 0 10px 10px 0;">导出日志记录</Button>
    <Table ref="table" :columns="columns" :data="errorList"></Table>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { mapMutations } from "vuex";
export default {
  name: 'error_logger_page',
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
      ]
    };
  },
  computed: {
    errorList() {
      return this.$store.state.app.errorList;
    }
  },
  methods: {
    ...mapMutations(["setHasReadErrorLoggerStatus"]),
    exportData() {
      this.$refs.table.exportCsv({
        filename: "错误日志.csv"
      });
    },
    fetchData() {
      operationLogApi
        .getOperationLogList(
          this.currentPage,
          this.pageSize,
          this.startDate,
          this.endDate,
          this.keyword
        )
        .then(res => {
          if (res.status === 0) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          } else {
            notification({
              type: "warning",
              title: res.message || "获取操作日志有误"
            });
          }
        })
        .catch(err => {
          this.isLoading = false;
          notification({
            type: "error",
            title: err.message || "获取操作日志有误"
          });
        });
    }
  },
  activated() {
    this.setHasReadErrorLoggerStatus();
  },
  mounted() {
    this.setHasReadErrorLoggerStatus();
  }
};
</script>

<style>
</style>
