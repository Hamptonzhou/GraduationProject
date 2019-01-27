<template>
  <Tree :data="data3" :load-data="loadData"></Tree>
</template>
<script>
export default {
  data() {
    return {
      data3: [
        {
          title: "parent",
          loading: false,
          children: []
        }
      ]
    };
  },
  methods: {
    loadData(item, callback) {
      setTimeout(() => {
        const data = [
          {
            title: "children",
            loading: false,
            children: []
          },
          {
            title: "children",
            loading: false,
            children: []
          }
        ];
        callback(data);
      }, 200);
    }
  }
};
</script>
