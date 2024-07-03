<template>
    <div class="container">
        <div class="flex-container">
            <el-input v-model="inputText" placeholder="请输入用户名" class="flex-item" clearable></el-input>
            <el-select v-model="selectedOption1" placeholder="请选择角色" class="flex-item" clearable>
                <el-option v-for="item in options1" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-select v-model="selectedOption2" placeholder="请选择操作" class="flex-item" clearable>
                <el-option v-for="item in options2" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" @click="handleSearch" class="search-button">搜索</el-button>
            <el-button @click="handleReset" class="reset-button">重置</el-button>
        </div>

        <el-table :data="currentPageData" class="table" max-height="442px">
            <el-table-column label="序号" width="100" align="center">
                <template v-slot="scope">
                    {{ (currentPage - 1) * perPages + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" width="200" align="center"></el-table-column>
            <el-table-column label="角色" width="200" align="center">
                <template v-slot="scope">
                    <span>{{ getRoleLabel(scope.row.user_role) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template v-slot="scope">
                    <span>{{ getOperationLabel(scope.row.action) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="操作内容" min-width="180" align="center"></el-table-column>
            <el-table-column label="时间" width="300" align="center">
                <template v-slot="scope">
                    <span>{{ formatTimestamp(scope.row.timestamp) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <Pagination :total="tableData.length" :page-size="pageSize" :current-page="currentPage"
                @select-change="handleSelectChange" />
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Pagination from '../publicComponents/Pagination.vue';
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';

export default {
    components: {
        Pagination,
    },
    setup() {
        const inputText = ref('');
        const selectedOption1 = ref('');
        const selectedOption2 = ref('');
        const options1 = ref([
            { value: 'super_admin', label: '超级管理员' },
            { value: 'admin', label: '管理员' },
            { value: 'user', label: '用户' },
        ]);
        const options2 = ref([
            { value: 'add', label: '新增' },
            { value: 'edit', label: '编辑' },
            { value: 'delete', label: '删除' },
        ]);

        const tableData = ref([]);

        const currentPage = ref(1);
        const perPages = ref(10);

        const pageSize = computed(() => {
            const totalItems = tableData.value.length;
            const pages = Math.ceil(totalItems / perPages.value);
            return pages;
        });

        const handleSelectChange = (value) => {
            perPages.value = value.perPages;
            currentPage.value = value.currentPage;
        };

        const currentPageData = computed(() => {
            const sortedData = [...tableData.value].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const startIndex = (currentPage.value - 1) * perPages.value;
            const endIndex = Math.min(startIndex + perPages.value, sortedData.length);
            return sortedData.slice(startIndex, endIndex);
        });

        const handleSearch = async () => {
            try {
                const response = await axios.get(`${baseURL}/logsList`, {
                    params: {
                        user_name: inputText.value,
                        user_identity: selectedOption1.value,
                        operation_type: selectedOption2.value,
                    },
                });
                tableData.value = response.data;
            } catch (error) {
                console.error('获取数据失败:', error);
            }
        };

        const handleReset = () => {
            inputText.value = '';
            selectedOption1.value = '';
            selectedOption2.value = '';
            fetchTableData();
        };

        const fetchTableData = async () => {
            try {
                const response = await axios.get(`${baseURL}/logsList`);
                tableData.value = response.data;
            } catch (error) {
                console.error('获取数据失败:', error);
            }
        };

        const getOperationLabel = (action) => {
            switch (action) {
                case 'add':
                    return '新增';
                case 'edit':
                    return '编辑';
                case 'delete':
                    return '删除';
                default:
                    return action;
            }
        };

        const getRoleLabel = (role) => {
            switch (role) {
                case 'super_admin':
                    return '超级管理员';
                case 'admin':
                    return '管理员';
                case 'user':
                    return '用户';
                default:
                    return role;
            }
        };

        const formatTimestamp = (timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        };

        onMounted(() => {
            fetchTableData();
        });

        return {
            inputText,
            selectedOption1,
            selectedOption2,
            options1,
            options2,
            tableData,
            currentPage,
            perPages,
            pageSize,
            currentPageData,
            handleSelectChange,
            handleSearch,
            handleReset,
            getOperationLabel,
            getRoleLabel,
            formatTimestamp,
        };
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 77vh;
}

.flex-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin-top: 40px;
}

.flex-item {
    flex: 1;
    margin-right: 10px;
    max-width: 300px;
}

.search-button {
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 16px;
}

.reset-button {
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 16px;
}

/* 表格样式 */
:deep(.el-table) {
    border: 1px solid black !important;
    border-collapse: collapse;
    margin-top: 60px;
}

:deep(.el-table th),
:deep(.el-table td) {
    border: 1px solid black !important;
    border-right: none;
    border-bottom: none;
    color: black !important;
}

:deep(.el-table th:last-child),
:deep(.el-table td:last-child) {
    border-right: 1px solid black !important;
}

:deep(.el-table tr:last-child th),
:deep(.el-table tr:last-child td) {
    border-bottom: 1px solid black !important;
}

:deep(.el-table th) {
    color: black !important;
}

/* 分页容器样式 */
.pagination-container {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    box-sizing: border-box;
}
</style>
