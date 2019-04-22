<template>
  <div>
    <Row :gutter="20">
      <!-- 卡片 -->
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <!-- 饼状图 -->
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <!-- 柱状图 -->
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量" />
        </Card>
      </i-col>
    </Row>
    <!-- 折线图 -->
    <Row>
      <Card shadow>
        <example style="height: 310px;" />
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from "_c/info-card";
import CountTo from "_c/count-to";
import { ChartPie, ChartBar } from "_c/charts";
import Example from "./example.vue";

import { mapState } from "vuex";
import workflowDesignApi from "@/api/workflowDesign.js";
import formDesignerAPI from "@/api/formDesigner.js";
export default {
  name: "home",
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data() {
    return {
      inforCardData: [
        {
          title: "业务定义",
          icon: "md-create",
          count: 0,
          color: "#2d8cf0"
        },
        { title: "正在办理", icon: "ios-hand", count: 0, color: "#ed3f14" },
        {
          title: "个人已办理",
          icon: "ios-person",
          count: 0,
          color: "#ff9900"
        },
        {
          title: "办理完结业务",
          icon: "md-checkbox",
          count: 0,
          color: "#19be6b"
        },
        {
          title: "可用流程",
          icon: "md-build",
          count: 0,
          color: "#E46CBB"
        },
        { title: "可用表单", icon: "md-grid", count: 0, color: "#9A66E4" }
      ],
      pieData: [
        { value: 335, name: "直接访问" },
        { value: 310, name: "邮件营销" },
        { value: 234, name: "联盟广告" },
        { value: 135, name: "视频广告" },
        { value: 1548, name: "搜索引擎" }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    };
  },
  computed: {
    ...mapState({
      userName: state => state.user.userName,
      userId: state => state.user.userId
    })
  },
  created() {
    this.getBusinessDefinitionCount();
    this.getHanglingWorkCount();
    this.getPersonalDoneWorkCount();
    this.getFinishedWorkCount();
    this.getUseableProcessCount();
    this.getUseableFormCount();
  },
  mounted() {},
  methods: {
    //获取业务定义数量
    getBusinessDefinitionCount: function() {
      workflowDesignApi
        .getBusinessDefinitionList(1, 100, "", this.userId)
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[0].count = res.data.total;
          } else {
            this.$Message.error("获取业务定义数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    },
    //获取正在办理数量
    getHanglingWorkCount: function() {
      workflowDesignApi
        .getHanglingWorkList(1, 100, "", this.userName)
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[1].count = res.data.total;
          } else {
            this.$Message.error("获取正在办理数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    },
    //获取个人已办理数量
    getPersonalDoneWorkCount: function() {
      workflowDesignApi
        .getPersonalDoneWorkList(1, 100, "", this.userName)
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[2].count = res.data.total;
          } else {
            this.$Message.error("获取个人已办理数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    },
    //获取办结工作数量
    getFinishedWorkCount: function() {
      workflowDesignApi
        .getFinishedWorkList(1, 100, "", this.userName)
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[3].count = res.data.total;
          } else {
            this.$Message.error("获取办结工作数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    },
    //获取可用流程数量
    getUseableProcessCount: function() {
      workflowDesignApi
        .getUseableProcessCount()
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[4].count = res.data;
          } else {
            this.$Message.error("获取可用流程数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    },
    //获取可用表单数量
    getUseableFormCount() {
      formDesignerAPI
        .getAllFormData()
        .then(res => {
          if (res.status === 0) {
            this.inforCardData[5].count = res.data.length;
          } else {
            this.$Message.error("获取可用表单数量失败");
          }
        })
        .catch(err => {
          this.$Message.error("请求服务器异常");
        });
    }
  }
};
</script>

<style lang="less">
.count-style {
  font-size: 50px;
}
</style>
