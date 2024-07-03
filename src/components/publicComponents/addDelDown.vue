<template>
    <div class="button-add-del-down-container" style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
        <el-button class="addButton customWidth" type="primary"  @click="openAddMainMaterial">新增</el-button>
        <el-button class="deleteButton customWidth" type="danger" @click="deleteSelected">删除</el-button>
        <el-button class="downloadButton customWidth" type="" @click="downloadSelected">下载</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    openAddMainMaterial() {
      this.$emit('open-add-main-material');
    },
    downloadSelected() {
      this.$emit('download-selected');
    },
    deleteSelected() {
      this.$emit('delete-selected');
    }
  }
}
</script>

<style scoped>
.customWidth {
    width: 100px;
}
</style>
