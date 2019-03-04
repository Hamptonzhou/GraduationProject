<template>
  <div>
    <!-- <iframe src="http://localhost:9601/formDesigner/index.html" width=1500 height="800" scrolling="auto" frameborder=0></iframe> -->
    <fm-making-form preview generate-code generate-json>
      <template slot="action">
      </template>
    </fm-making-form>
  </div>
</template>

<script>
export default {
  name: "formDesigner_page",
  data() {
    return {
      jsonData: {
        list: [
          {
            type: "input",
            name: "单行文本",
            icon: "icon-input",
            options: {
              width: "100%",
              defaultValue: "",
              required: false,
              dataType: "string",
              pattern: "",
              placeholder: "",
              remoteFunc: "func_1551404566000_23366"
            },
            key: "1551404566000_23366",
            model: "input_1551404566000_23366",
            rules: [
              {
                type: "string",
                message: "单行文本格式不正确"
              }
            ]
          },
          {
            type: "textarea",
            name: "多行文本",
            icon: "icon-diy-com-textarea",
            options: {
              width: "100%",
              defaultValue: "",
              required: false,
              pattern: "",
              placeholder: "",
              remoteFunc: "func_1551404567000_13190"
            },
            key: "1551404567000_13190",
            model: "textarea_1551404567000_13190",
            rules: []
          }
        ],
        config: {
          labelWidth: 100,
          labelPosition: "top",
          size: "small"
        }
      }, // 表单配置中生成的json数据
      values: {}, // 表单需要显示的表单数据
      remoteFuncs: {
        // 组件配置时配置的远端方法,保持和配置时输入的名称一致
        func_test(resolve) {
          // 模拟接口请求
          setTimeout(() => {
            const options = [
              { id: "1", name: "1111" },
              { id: "2", name: "2222" },
              { id: "3", name: "3333" }
            ];

            // 获取到的值和标签可以通过配置页远端配置
            // 值:id  标签：name

            resolve(options); // 将后端获取的数据放入回调函数中
          }, 2000);
        }
      }
    };
  },
  mounted() {}
};
</script>
