<template>
    <div class="main-container">
        <div class="select-container">
            <el-select v-model="selectedItem" placeholder="请选择产品代号" clearable @change="handle_DC_BDC_SelectChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-button class="clearButton" @click="clearSelection" type="info">重置</el-button>
        </div>

        <div class="dc-bdc-container">
            <component :is="selectedComponent" @yinliuDiameterChange="handleYinliuDiameterChange"
                @yinliuLengthChange="handleYinliuLengthChange" @yinliuLockStyleChange="handleYinliuLockStyleChange"
                @yinliuHeadStyleChange="handleYinliuHeadStyleChange"
                @yinliuConfigurationCodeChange="handleYinliuConfigurationCodeChange"
                @dandaoDiameterChange="handleDandaoDiameterChange" @dandaoLengthChange="handleDandaoLengthChange"
                @dandaoFlowChange="handleDandaoFlowChange" @dandaoHeadStyleChange="handleDandaoHeadStyleChange"
                @dandaoConfigurationCodeChange="handleDandaoConfigurationCodeChange">
            </component>
        </div>

        <ButtonsADD @open-add-main-material="showAddMainMaterialDialog" @download-selected="handleDownloadSelected"
            @delete-selected="handleDeleteClick" />

        <el-dialog v-model="dialogVisibleAddMainMaterial" title="新增成品清单" width="30%" draggable :show-close="false"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <AddMainMaterial @closeDialog="handleAddMainMaterialClose" />
        </el-dialog>

        <div class="table-container">
            <el-table :data="currentPageData" class="full-width-table" style="width: 100%" max-height=442px
                @selection-change="handleSelectionChange" show-overflow-tooltip>
                <el-table-column fixed="left" type="selection" width="40" align="center"></el-table-column>
                <el-table-column prop="index" label="序号" width="60" align="center" />
                <el-table-column prop="MaterialCode" label="物料编码" :min-width="150" align="center" />
                <el-table-column prop="fileCode" label="文件编号" :min-width="150" align="center" />
                <el-table-column prop="Name" label="名称" :min-width="300" align="center" />
                <el-table-column prop="ProductSpecifications" label="产品规格" :min-width="300" align="center" />
                <el-table-column prop="Version" label="版本号" :min-width="200" align="center" />
                <!-- <el-table-column prop="totalPrice" label="总价" :min-width="100" align="center" /> -->
                <el-table-column fixed="right" label="操作" :min-width="120" align="center">
                    <template #default="{ row }">
                        <el-button link type="primary" size="large" @click="handleClick(row)">编辑</el-button>
                        <el-button link type="primary" size="large"
                            @click="openCheckComponentDialog(row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <div class="container">
            <Pagination :total=tableData.length :page-size="pageSize" :current-page="currentPage"
                @select-change="handleSelectChange" />
        </div>
    </div>

    <el-dialog title="编辑成品清单" v-model="dialogVisible" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <EditMainMaterial :key="currentMaterial.id" :initData="currentMaterial" @closeDialog="handleDialogClose"
            @editFinishedProductSuccess="handleEditFinishedProductSuccess" />
    </el-dialog>

    <el-dialog title="查看成品清单" v-model="checkComponentDialogVisible" width="95%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <CheckComponent :key="currentRowData.id" :initData="currentRowData" @closeCheckComponent="handleDialogClose" />
    </el-dialog>

    <el-dialog v-model="progressDialogVisible" title="数据处理进度" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <el-progress :percentage="progress" />
    </el-dialog>


</template>

<script setup>
import ButtonsADD from '../publicComponents/addDelDown.vue';
import Pagination from '../publicComponents/Pagination.vue';
import DcConditions from './dcConditions.vue'; // 导入 DC 组件
import BdcConditions from './bdcConditions.vue'; // 导入 BDC 组件
import EditMainMaterial from './editMainMaterial.vue';
import AddMainMaterial from './addMainMaterial.vue';
import CheckComponent from './checkComponents.vue';

import { ref, computed, onMounted, getCurrentInstance } from 'vue';
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import io from 'socket.io-client';
import dayjs from 'dayjs';

const socket = io(baseURL);

const progressDialogVisible = ref(false);
const progress = ref(0);

socket.on('progress', (data) => {
    progress.value = data.progress;
    if (data.error) {
        proxy.$message({
            type: 'error',
            message: `文件处理失败: ${data.error}`
        });
        progressDialogVisible.value = false;
    } else if (data.progress === 100) {
        proxy.$message({
            type: 'success',
            message: '文件处理完成'
        });
        progressDialogVisible.value = false;
    }
});

const tableData = ref([]);
const selectedRows = ref([]); // 用于存储所选行的数据

const instance = getCurrentInstance();
const { proxy } = instance;


const checkComponentDialogVisible = ref(false);

const currentRowData = ref(null); // 用于存储当前行的数据

const openCheckComponentDialog = (row) => {
    currentRowData.value = row; // 将当前行的数据存储到 currentRowData 中
    checkComponentDialogVisible.value = true; // 打开对话框
};

const dialogVisibleAddMainMaterial = ref(false);
const currentUserData = ref(null);  // 新增用于存储用户数据的变量

const showAddMainMaterialDialog = () => {
    if (currentUserData.value.add_data_permission === 1) {
        dialogVisibleAddMainMaterial.value = true;
    } else {
        proxy.$alert('你没有权限新增数据，请联系管理员', '权限不足', {
            confirmButtonText: '确定',
            type: 'warning'
        });
    }
};

const handleAddMainMaterialClose = () => {
    dialogVisibleAddMainMaterial.value = false;
    handle_DC_BDC_SelectChange();
};

const selectedComponent = ref(null);

// DC查询条件设置
const yinliuDiameterValue = ref(null);
const handleYinliuDiameterChange = (value) => {
    yinliuDiameterValue.value = value;
    handle_DC_BDC_SelectChange();
};

const yinliuLengthValue = ref(null);
const handleYinliuLengthChange = (value) => {
    yinliuLengthValue.value = value;
    handle_DC_BDC_SelectChange();
};

const yinliuLockStyleValue = ref(null);
const handleYinliuLockStyleChange = (value) => {
    yinliuLockStyleValue.value = value;
    handle_DC_BDC_SelectChange();
};

const yinliuHeadStyleValue = ref(null);
const handleYinliuHeadStyleChange = (value) => {
    yinliuHeadStyleValue.value = value;
    handle_DC_BDC_SelectChange();
};

const yinliuConfigurationCodeValue = ref(null);
const handleYinliuConfigurationCodeChange = (value) => {
    yinliuConfigurationCodeValue.value = value;
    handle_DC_BDC_SelectChange();
};

// BDC查询条件设置
const dandaoDiameterValue = ref(null);
const handleDandaoDiameterChange = (value) => {
    dandaoDiameterValue.value = value;
    handle_DC_BDC_SelectChange();
};

const dandaoLengthValue = ref(null);
const handleDandaoLengthChange = (value) => {
    dandaoLengthValue.value = value;
    handle_DC_BDC_SelectChange();
};

const dandaoFlowValue = ref(null);
const handleDandaoFlowChange = (value) => {
    dandaoFlowValue.value = value;
    handle_DC_BDC_SelectChange();
};

const dandaoHeadStyleValue = ref(null);
const handleDandaoHeadStyleChange = (value) => {
    dandaoHeadStyleValue.value = value;
    handle_DC_BDC_SelectChange();
};

const dandaoConfigurationCodeValue = ref(null);
const handleDandaoConfigurationCodeChange = (value) => {
    dandaoConfigurationCodeValue.value = value;
    handle_DC_BDC_SelectChange();
};

const fetchData = async (url, params = {}) => {
    try {
        const response = await axios.get(url, { params });
        tableData.value = response.data;
    } catch (error) {
        console.error('Failed to fetch data', error);
    }
};

const handle_DC_BDC_SelectChange = async (resetPage = false) => {
    const all_url = `${baseURL}/allList`;
    const dc_url = `${baseURL}/dcList`;
    const bdc_url = `${baseURL}/bdcList`;

    if (resetPage) {
        currentPage.value = 1; // 切换产品代号后将当前页设为1
    }

    if (selectedItem.value === null) {
        await fetchData(all_url);
    } else {
        selectedComponent.value = DcConditions;
        if (selectedItem.value === 'dc') {
            await fetchData(dc_url, {
                yinliuDiameter: yinliuDiameterValue.value,
                yinliuLength: yinliuLengthValue.value,
                yinliuLockStyle: yinliuLockStyleValue.value,
                yinliuHeadStyle: yinliuHeadStyleValue.value,
                yinliuConfigurationCode: yinliuConfigurationCodeValue.value
            });
        } else if (selectedItem.value === 'bdc') {
            selectedComponent.value = BdcConditions;
            await fetchData(bdc_url, {
                dandaoDiameter: dandaoDiameterValue.value,
                dandaoLength: dandaoLengthValue.value,
                drainageMethod: dandaoFlowValue.value,
                dandaoHeadStyle: dandaoHeadStyleValue.value,
                dandaoConfigurationCode: dandaoConfigurationCodeValue.value
            });
        } else {
            selectedComponent.value = null; // 清空选中组件
            await fetchData(all_url);
        }
    }

    // 计算总页数并调整 currentPage
    const totalItems = tableData.value.length;
    const totalPages = Math.ceil(totalItems / perPages.value);
    if (currentPage.value > totalPages) {
        currentPage.value = totalPages;
    }

    // 确保 currentPage 不为 0
    if (currentPage.value === 0 && totalPages > 0) {
        currentPage.value = 1;
    }

    if (selectedItem.value !== 'dc') {
        yinliuDiameterValue.value = null;
        yinliuLengthValue.value = null;
        yinliuLockStyleValue.value = null;
        yinliuHeadStyleValue.value = null;
        yinliuConfigurationCodeValue.value = null;
    }
    if (selectedItem.value !== 'bdc') {
        dandaoDiameterValue.value = null;
        dandaoLengthValue.value = null;
        dandaoFlowValue.value = null;
        dandaoHeadStyleValue.value = null;
        dandaoConfigurationCodeValue.value = null;
    }
};


const dialogVisible = ref(false);
const currentMaterial = ref(null);

const handleClick = (row) => {
    if (currentUserData.value.edit_data_permission === 1) {
        currentMaterial.value = { ...row };
        dialogVisible.value = true;
    } else {
        proxy.$alert('你没有权限编辑数据，请联系管理员', '权限不足', {
            confirmButtonText: '确定',
            type: 'warning'
        });
    }
};

const handleDialogClose = () => {
    dialogVisible.value = false;
    checkComponentDialogVisible.value = false;
};

const handleEditFinishedProductSuccess = () => {
    dialogVisible.value = false;
    handle_DC_BDC_SelectChange();
};


// 在组件挂载后获取数据
onMounted(() => {
    handle_DC_BDC_SelectChange();
    currentUserData.value = JSON.parse(sessionStorage.getItem('user_data'));
});

const options = [
    { label: 'DC', value: 'dc' },
    { label: 'BDC', value: 'bdc' },
];

const selectedItem = ref(null);

const clearSelection = () => {
    const all_url = `${baseURL}/allList`
    selectedItem.value = null; // Clear the selected item
    selectedComponent.value = null; // Clear the selected component

    yinliuDiameterValue.value = null;
    yinliuLengthValue.value = null;
    yinliuLockStyleValue.value = null;
    yinliuHeadStyleValue.value = null;
    yinliuConfigurationCodeValue.value = null;

    dandaoDiameterValue.value = null;
    dandaoLengthValue.value = null;
    dandaoFlowValue.value = null;
    dandaoHeadStyleValue.value = null;
    dandaoConfigurationCodeValue.value = null;

    axios.get(all_url)
        .then(response => {
            tableData.value = response.data;
        })
        .catch(error => {
            console.error('Failed to fetch data', error);
        });
};

const perPages = ref(10);
const currentPage = ref(1);

const handleSelectChange = (value) => {
    perPages.value = value.perPages;
    currentPage.value = value.currentPage;
};

const handleSelectionChange = (selected) => {
    selectedRows.value = selected;
};

const pageSize = computed(() => {
    const totalItems = tableData.length;
    const pages = Math.ceil(totalItems / perPages.value);
    return pages;
});

const currentPageData = computed(() => {
    const startIndex = (currentPage.value - 1) * perPages.value;
    const endIndex = Math.min(startIndex + perPages.value, tableData.value.length);
    return tableData.value.slice(startIndex, endIndex);
});

const handleDeleteClick = () => {
    if (currentUserData.value.delete_data_permission === 1) {
        const component_del_url = `${baseURL}/deleteFinishedMaterials`;  // 用于发送删除请求

        if (selectedRows.value.length === 0) {
            // 如果没有选中任何行，则提示用户选择要删除的数据
            proxy.$message({
                type: 'warning',
                message: '请选择要删除的数据'
            });
        } else {
            proxy.$confirm('此操作将永久删除选中的数据，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const selectedIds = selectedRows.value.map(row => row.id);
                const selectedProductCodes = selectedRows.value.map(row => row.ProductCode);

                const params = {
                    id: selectedIds,
                    productCode: selectedProductCodes
                };

                axios.delete(component_del_url, {
                    params: params,
                    paramsSerializer: params => {
                        return Object.entries(params)
                            .map(([key, value]) => value.map(v => `${key}=${encodeURIComponent(v)}`).join('&'))
                            .join('&');
                    }
                })
                    .then(response => {
                        // 拼接所有选中行的物料编码和产品规格
                        const operationContent = selectedRows.value.map(row => `物料编码为：${row.MaterialCode}，产品规格为：${row.ProductSpecifications}`).join('；');
                        // 记录删除操作日志
                        logOperation('delete', `删除成品物料，${operationContent}`);
                        // 刷新数据
                        handle_DC_BDC_SelectChange();
                    })
                    .catch(error => {
                        console.error('Error deleting components:', error);
                    });
            }).catch(() => {
                proxy.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    } else {
        proxy.$alert('你没有权限删除数据，请联系管理员', '权限不足', {
            confirmButtonText: '确定',
            type: 'warning'
        });
    }
};

const logOperation = (operationType, operationContent) => {
    const currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
    const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
    let user_identity = '';

    if (currentUserData.super_root === 1) {
        user_identity = 'super_admin';
    } else if (currentUserData.super_root === 0 && currentUserData.normal_root === 1) {
        user_identity = 'admin';
    } else if (currentUserData.super_root === 0 && currentUserData.normal_root === 0) {
        user_identity = 'user';
    }

    const logPayload = {
        user_name: currentUserData.username,
        user_identity: user_identity,
        operation_type: operationType,
        operation_content: operationContent,
        operation_time: timestamp
    };

    console.log('操作日志:', logPayload);

    axios.post(`${baseURL}/logsAdd`, logPayload)
        .then(response => {
            // console.log('操作日志记录成功:', response.data);
        })
        .catch(error => {
            console.error('操作日志记录失败:', error);
        });
};



const handleDownloadSelected = async () => {
    if (selectedRows.value.length === 0) {
        proxy.$message({
            type: 'warning',
            message: '请选择要下载的数据'
        });
        return;
    }

    let customFileName = null;
    let isValidFileName = false;

    while (!isValidFileName) {
        customFileName = prompt("请输入下载文件的名称（不包括扩展名）:");
        if (customFileName === null) {
            proxy.$message({
                type: 'info',
                message: '您已取消下载'
            });
            return;
        }
        if (customFileName.trim() === "") {
            proxy.$message({
                type: 'warning',
                message: '文件名不能为空'
            });
            // 等待一段时间再重新显示输入框
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            isValidFileName = true;
        }
    }

    try {
        const dataToSend = {
            selectedRows: selectedRows.value,
            customFileName: customFileName
        };

        // 打开进度条对话框
        progressDialogVisible.value = true;
        progress.value = 0;

        // 发送请求获取文件
        const response = await axios.post(`${baseURL}/download`, dataToSend);
        if (response.data === "success") {
            // 创建一个隐藏的链接并触发点击事件来下载文件
            const downloadUrl = `${baseURL}/downloadFile?filename=${customFileName}`
            const link = document.createElement('a');
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    } catch (error) {
        console.error('Failed to download file', error);
        proxy.$message({
            type: 'error',
            message: '文件下载失败'
        });
    }
};


</script>

<style scoped>
/* 现有样式保持不变 */

.select-container {
    margin-top: 10px;
    /* 添加上边距 */
    margin-bottom: 0px;
    /* 添加下边距 */
}

.select-container .el-select {
    width: 30%;
    border: 1px solid #909090;
    border-radius: 5px;
    /* 添加圆角 */
}

.clearButton {
    margin-left: 20px;
    width: 100px;
}

.main-container {
    display: flex;
    flex-direction: column;
    min-height: 75vh;
}

.container {
    margin-top: auto;
    /* 将容器推到当前页面内的底部 */
}

.dc-bdc-container {
    margin-bottom: 5px;
}

/* 新增样式 */
:deep(.el-table) {
    border: 1px solid black !important;
    border-collapse: collapse;
    /* 确保边框合并 */
}

:deep(.el-table th),
:deep(.el-table td) {
    border: 1px solid black !important;
    border-right: none;
    /* 移除右边框 */
    border-bottom: none;
    /* 移除下边框 */
    color: black !important;
    /* 设置字体颜色为黑色 */
}

/* 确保最后一列的右边框和最后一行的下边框存在 */
:deep(.el-table th:last-child),
:deep(.el-table td:last-child) {
    border-right: 1px solid black !important;
}

:deep(.el-table tr:last-child th),
:deep(.el-table tr:last-child td) {
    border-bottom: 1px solid black !important;
}

/* 确保表头的字体颜色也为黑色 */
:deep(.el-table th) {
    color: black !important;
}

/* 复选框的样式 */
:deep(.el-checkbox__inner) {
    border: 1px solid black !important;
}
</style>

