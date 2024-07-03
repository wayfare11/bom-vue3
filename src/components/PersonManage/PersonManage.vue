<template>
    <div class="main-container">
        <div class="search-bar" style="margin-top: 20px;">
            <el-row :gutter="10" class="search-bar-row">
                <el-col :span="8">
                    <el-input v-model="searchName" placeholder="请输入用户名"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="" @click="handleSearchClick" class="search-button"
                        style="width:80%;">搜索</el-button>
                </el-col>
                <el-col :span="9">
                </el-col>
                <el-col :span="5" class="button-container" style="display: flex;">
                    <el-button type="info" @click="handleResetClick" style="width:100%;">重置</el-button>
                    <el-button type="primary" @click="handleAddClick" style="width:100%;">新增</el-button>
                    <el-button type="danger" @click="handleDeleteClick" style="width:100%;">删除</el-button>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top: 20px; overflow: auto;">
            <el-row>
                <el-col :span="24">
                    <el-table :data="displayedData" style="width: 100%;" :border="false" :max-height="535"
                        :header-cell-style="{ textAlign: 'center' }" :cell-style="{ textAlign: 'center' }"
                        show-overflow-tooltip @selection-change="handleSelectionChange">

                        <el-table-column type="selection" width="40" fixed="left"></el-table-column> <!-- 第一列设置为复选框 -->
                        <el-table-column label="序号" prop="index" width="60"></el-table-column>
                        <el-table-column label="用户名" prop="username" min-width="80"></el-table-column>
                        <el-table-column label="密码" prop="password" min-width="100"
                            :formatter="passwordFormatter"></el-table-column>
                        <el-table-column label="管理员" prop="normal_root" min-width="100"
                            :formatter="booleanFormatter"></el-table-column>
                        <el-table-column label="新增数据权限" prop="add_data_permission" min-width="100"
                            :formatter="booleanFormatter"></el-table-column>
                        <el-table-column label="编辑数据权限" prop="edit_data_permission" min-width="120"
                            :formatter="booleanFormatter"></el-table-column>
                        <el-table-column label="删除数据权限" prop="delete_data_permission" min-width="120"
                            :formatter="booleanFormatter"></el-table-column>
                        <el-table-column label="操作" width="120" fixed="right">
                            <template #default="{ row, $index }">
                                <el-button type="text" @click="handleEdit(row)"
                                    :disabled="isEditDisabled(row)">编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>

        <div class="container">
            <Pagination :total="tableData.length" :page-size="pageSize" :current-page="currentPage"
                @select-change="handleSelectChange" />
        </div>
    </div>

    <el-dialog title="新增用户" v-model="addDialogVisible" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <AddRoleData @cancel="handleCancelRole" @AddRoleformSubmitted="handleAddRoleformSubmitted" />
    </el-dialog>

    <el-dialog title="编辑用户" v-model="editDialogVisible" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <EditRoleData :rowData="currentRow" @cancel="handleCancelRole" :key="currentRow.id"
            @EditRoleformSubmitted="handleEditRoleformSubmitted" />
    </el-dialog>
</template>

<script>
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import Pagination from '../publicComponents/Pagination.vue';
import { ElMessage } from 'element-plus';
import AddRoleData from './AddRoleData.vue';
import EditRoleData from './EditRoleData.vue';
import dayjs from 'dayjs';

export default {
    data() {
        return {
            pageSize: 10, // 初始值，根据实际情况设置
            currentPage: 1, // 初始值，根据实际情况设置
            searchName: '',
            prevSearchName: '',
            tableData: [],
            displayedData: [],
            currentUserData: null,
            currentRow: null,
            selectedRows: [],
            addDialogVisible: false,
            editDialogVisible: false
        }
    },
    created() {
        this.currentUserData = JSON.parse(sessionStorage.getItem('user_data'))

        const headers = {
            'Content-Type': 'application/json'
        };

        if (this.currentUserData.super_root === 1) {
            axios.get(`${baseURL}/roleList`, {
                headers: headers,
                params: { superRoot: true }
            }).then(response => {
                this.tableData = response.data;
                this.displayedData = this.tableData.slice(0, this.pageSize);
            });
        }
        else {
            axios.get(`${baseURL}/roleList`, {
                headers: headers,
                params: { superRoot: false }
            }).then(response => {
                this.tableData = response.data;
            });
        }
    },
    components: {
        Pagination,
        AddRoleData,
        EditRoleData
    },
    methods: {
        sendSearchRequest() {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (this.currentUserData.super_root === 1) {
                axios.get(`${baseURL}/roleList`, {
                    headers: headers,
                    params: { superRoot: true, userName: this.searchName }
                }).then(response => {
                    this.tableData = response.data;
                    this.displayedData = this.tableData.slice(0, this.pageSize);
                });
            }
            else {
                axios.get(`${baseURL}/roleList`, {
                    headers: headers,
                    params: { superRoot: false, userName: this.searchName }
                }).then(response => {
                    this.tableData = response.data;
                });
            }
        },
        handleSearchClick() {
            this.sendSearchRequest();
            if (this.searchName !== this.prevSearchName) {
                this.currentPage = 1;
                this.prevSearchName = this.searchName;
            }
        },
        handleResetClick() {
            this.searchName = '';
            this.handleSearchClick(); // 重新查询
        },
        handleAddClick() {
            if (this.currentUserData.super_root === 0 && this.currentUserData.normal_root === 0) {
                this.$alert('普通用户无法创建用户，请联系管理员！', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
                return;
            }
            // 新增数据逻辑
            this.addDialogVisible = true;
        },
        handleDeleteClick() {
            // 获取选中的行
            const selectedRows = this.selectedRows;
            const role_list_url = `${baseURL}/roleList`;
            const role_del_url = `${baseURL}/roleDelete`;

            // 删除权限判断
            if (this.currentUserData.super_root === 0 && this.currentUserData.normal_root === 0) {
                this.$alert('普通用户无法删除用户，请联系管理员！', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
                return;
            }
            if (this.selectedRows.length === 0) {
                ElMessage({
                    message: '请先选择要删除的用户！',
                    type: 'warning'
                });
                return;
            }

            if (this.currentUserData.super_root === 1) {
                // 判断选中的行是否有super_root为1的
                const hasSuperRoot = selectedRows.some(row => row.super_root === 1);

                if (hasSuperRoot) {
                    ElMessage({
                        message: '无法删除超级管理员用户！',
                        type: 'warning'
                    });
                    return;
                }
            }

            if (this.currentUserData.normal_root === 1 && this.currentUserData.super_root === 0) {
                // 判断选中的行是否有super_root为1的或normal_root为1的
                const hasSuperRoot = selectedRows.some(row => row.super_root === 1);
                const hasNormalRoot = selectedRows.some(row => row.normal_root === 1);

                if (hasSuperRoot || hasNormalRoot) {
                    ElMessage({
                        message: '无法删除管理员用户！',
                        type: 'warning'
                    });
                    return;
                }
            }
            // 处理删除逻辑
            this.$confirm('此操作将永久删除选中的用户，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const selectedIds = this.selectedRows.map(row => row.id);

                // 直接传递数组
                const params = {
                    role_id: selectedIds
                };

                axios.delete(role_del_url, {
                    params: params,
                    paramsSerializer: params => {
                        return Object.entries(params)
                            .map(([key, value]) => value.map(v => `${key}=${encodeURIComponent(v)}`).join('&'))
                            .join('&');
                    }
                })
                    .then(response => {
                        // 处理后端返回的响应
                        // console.log(response);
                        axios.get(role_list_url)
                            .then(response => {
                                this.tableData = response.data;
                                const totalPages = Math.ceil(this.tableData.length / this.pageSize);
                                if (totalPages < this.currentPage) {
                                    this.currentPage = totalPages; // 如果当前页超出了新的总页数，则将当前页设置为最后一页
                                }
                                this.displayedData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
                                this.logOperation(selectedRows); // 日志记录
                            })
                            .catch(error => {
                                console.error('获取零部件列表时出错:', error);
                            });
                    })
                    .catch(error => {
                        // 处理错误
                        console.error('Error deleting roles:', error);
                    });
            }).catch(() => {
                // 用户点击取消按钮的回调
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        handleSelectionChange(selectedRows) {
            // 处理选择变化逻辑
            this.selectedRows = selectedRows;
        },

        handleEdit(row) {
            this.currentRow = { ...row }; // 使用对象的拷贝，确保不会直接修改原始数据
            this.editDialogVisible = true; // 打开编辑对话框
        },

        handleSelectChange(data) {
            this.pageSize = data.perPages; // 将perPages赋值给pageSize
            this.currentPage = data.currentPage; // 可选：根据需要处理currentPage的值
        },
        booleanFormatter(row, column, cellValue) {
            return cellValue === 1 ? '√' : '×';
        },
        passwordFormatter(row, column, cellValue) {
            return '••••••';
        },
        handleCancelRole() {
            this.addDialogVisible = false;
            this.editDialogVisible = false;
            this.sendSearchRequest();
        },
        handleAddRoleformSubmitted() {
            this.sendSearchRequest();
        },
        handleEditRoleformSubmitted() {
            this.sendSearchRequest();
        },
        logOperation(deletedRows) {
            const currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
            const timestamp = this.formatDate(new Date());
            let user_identity = '';

            if (currentUserData.super_root === 1) {
                user_identity = 'super_admin';
            } else if (currentUserData.super_root === 0 && currentUserData.normal_root === 1) {
                user_identity = 'admin';
            } else if (currentUserData.super_root === 0 && currentUserData.normal_root === 0) {
                user_identity = 'user';
            }

            const deletedUsernames = deletedRows.map(row => row.username).join(', ');

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'delete',
                operation_content: `删除用户，用户名为：${deletedUsernames}`,
                operation_time: timestamp
            };

            axios.post(`${baseURL}/logsAdd`, logPayload)
                .then(response => {
                    console.log('操作日志记录成功:', response.data);
                })
                .catch(error => {
                    console.error('操作日志记录失败:', error);
                });
        },
        formatDate(date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        }
    },
    computed: {
        isEditDisabled() {
            return (row) => {
                if (this.currentUserData.super_root === 1) {
                    return row.super_root === 1;
                } else if (this.currentUserData.normal_root === 1 && this.currentUserData.super_root === 0) {
                    return row.normal_root === 1;
                } else {
                    return true;
                }
            };
        },
        displayedData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.tableData.slice(startIndex, endIndex);
        }
    },
};
</script>

<style scoped>
.container {
    margin-top: auto;
    /* 将容器推到当前页面内的底部 */
}

.main-container {
    display: flex;
    flex-direction: column;
    min-height: 75vh;
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
