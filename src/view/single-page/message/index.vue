<template>
  <Card shadow>
    <div>
      <!-- 这里是消息的类型选择 -->
      <div class="message-page-con message-category-con">
        <Menu width="auto" active-name="unread" @on-select="handleSelect">
          <MenuItem name="unread">
            <span class="category-title">未读消息</span>
            <Badge style="margin-left: 10px" :count="messageUnreadCount"></Badge>
          </MenuItem>
          <MenuItem name="readed">
            <span class="category-title">已读消息</span>
            <Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageReadedCount"></Badge>
          </MenuItem>
          <MenuItem name="broadcast">
            <span class="category-title">广播消息</span>
            <Badge style="margin-left: 10px" class-name="gray-dadge" :count="messagebroadcastCount"></Badge>
          </MenuItem>
          <!-- <MenuItem name="sended">
            <span class="category-title">已发消息</span>
            <Badge style="margin-left: 10px" class-name="gray-dadge" :count="sengedMessageCount"></Badge>
          </MenuItem>-->
          <MenuItem name="trash">
            <span class="category-title">回收站</span>
            <Badge style="margin-left: 10px" class-name="gray-dadge" :count="messageTrashCount"></Badge>
          </MenuItem>
        </Menu>
      </div>
      <!-- 这里是各种消息的类型概览 -->
      <div class="message-page-con message-list-con">
        <Spin fix v-if="listLoading" size="large"></Spin>
        <Menu width="auto" active-name :class="titleClass" @on-select="handleView">
          <MenuItem v-for="item in messageList" :name="item.id" :key="`msg_${item.id}`">
            <div>
              <p class="msg-title">{{ item.title }}</p>
              <!-- <Badge status="default" :text="item.sendTime"/> -->
              <Button
                style="float: right;margin-right: 20px;"
                :style="{ display: item.loading ? 'inline-block !important' : '' }"
                :loading="item.loading"
                size="small"
                :icon="currentMessageType === 'readed' ? 'md-trash' : 'md-redo'"
                :title="currentMessageType === 'readed' ? '删除' : '还原'"
                type="text"
                v-show="currentMessageType !== 'unread'&&currentMessageType !== 'broadcast'"
                @click.native.stop="removeMsg(item)"
              ></Button>
            </div>
          </MenuItem>
        </Menu>
      </div>
      <!-- 这里是消息的主页面 -->
      <div class="message-page-con message-view-con">
        <Spin fix v-if="contentLoading" size="large"></Spin>
        <div class="message-view-header">
          <h2 class="message-view-title">{{ showingMsgItem.title }}</h2>
          <time class="message-view-time">{{ showingMsgItem.sendTime }}</time>
        </div>
        <div v-html="messageContent"></div>
      </div>
    </div>
  </Card>
</template>

<script>
// 从vuex维护的store文件夹中获取对应的state、mutations、getters、actions，注意：这几个对象分别在vue实例的computed、methods中使用
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
const listDic = {
  unread: "messageUnreadList",
  readed: "messageReadedList",
  trash: "messageTrashList",
  broadcast: "messageBroadcastList"
};
export default {
  name: "message_page",
  data() {
    return {
      listLoading: true,
      contentLoading: false,
      currentMessageType: "unread",
      messageContent: "",
      showingMsgItem: {}
    };
  },
  computed: {
    ...mapState({
      messageUnreadList: state => state.user.messageUnreadList,
      messageReadedList: state => state.user.messageReadedList,
      messageTrashList: state => state.user.messageTrashList,
      messageBroadcastList: state => state.user.messageBroadcastList,
      messageList() {
        return this[listDic[this.currentMessageType]];
      },
      titleClass() {
        return {
          "not-unread-list": this.currentMessageType !== "unread"
        };
      }
    }),

    //在vuex中维护的getters变量
    ...mapGetters([
      //需要获取未读的消息数量，不在这里进行直接调用后端api，而是从vuex的存储中去查找(vuex维护详细相关的组件在stroe文件夹下的user.js)by zhou
      "messageUnreadCount",
      "messageReadedCount",
      "messageTrashCount",
      "messagebroadcastCount"
    ])
  },

  // 初始化的是时候，立刻请求获取消息列表
  mounted() {
    this.listLoading = true;
    this.getMessageList()
      .then(() => this.stopLoading("listLoading"))
      .catch(() => this.stopLoading("listLoading"));
  },
  methods: {
    ...mapMutations([
      //
    ]),

    //在vuex中维护的actions的方法
    ...mapActions([
      "getMessageList",
      "getContentByMsgId",
      "hasRead",
      "removeReaded",
      "restoreTrash"
    ]),

    //抽取出停止加载动画的方法
    stopLoading(name) {
      this[name] = false;
    },

    //选择消息的类型，以在右侧展开相应类型的消息概览
    handleSelect(name) {
      this.currentMessageType = name;
    },

    //根据点击的id，查看消息详细情况
    handleView(msg_id) {
      this.contentLoading = true;
      this.getContentByMsgId({ msg_id })
        .then(content => {
          console.log(msg_id,content);
          this.messageContent = content;
          //根据点击的消息id,在当前的类型列表中找到点击的那条消息的
          const item = this.messageList.find(item => item.id === msg_id);
          if (item) {
            this.showingMsgItem = item;
          }
          //如果是未读的消息，这里将其设置成已读
          if (this.currentMessageType === "unread") {
            console.log(msg_id);
            this.hasRead({ msg_id });
          }
          this.stopLoading("contentLoading");
        })
        .catch(() => {
          this.stopLoading("contentLoading");
        });
    },
    removeMsg(item) {
      item.loading = true;
      const msg_id = item.id;
      if (this.currentMessageType === "readed") {
        console.log(msg_id, item.content);
        this.removeReaded({ msg_id });
      } else {
        console.log(msg_id, item.content);
        this.restoreTrash({ msg_id });
      }
    }
  }
};
</script>

<style lang="less">
.message-page {
  &-con {
    height: ~"calc(100vh - 176px)";
    display: inline-block;
    vertical-align: top;
    position: relative;
    &.message-category-con {
      border-right: 1px solid #e6e6e6;
      width: 200px;
    }
    &.message-list-con {
      border-right: 1px solid #e6e6e6;
      width: 230px;
    }
    &.message-view-con {
      position: absolute;
      left: 446px;
      top: 16px;
      right: 16px;
      bottom: 16px;
      overflow: auto;
      padding: 12px 20px 0;
      .message-view-header {
        margin-bottom: 20px;
        .message-view-title {
          display: inline-block;
        }
        .message-view-time {
          margin-left: 20px;
        }
      }
    }
    .category-title {
      display: inline-block;
      width: 65px;
    }
    .gray-dadge {
      background: gainsboro;
    }
    .not-unread-list {
      .msg-title {
        color: rgb(170, 169, 169);
      }
      .ivu-menu-item {
        .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
          display: none;
        }
        &:hover {
          .ivu-btn.ivu-btn-text.ivu-btn-small.ivu-btn-icon-only {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
