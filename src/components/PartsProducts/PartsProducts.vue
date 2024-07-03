<template>
    <div class="main-container">
        <div style="margin-top: 20px;">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-input v-model="searchName" placeholder="请输入名称" style="width: 100%;"></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input v-model="searchMaterialCode" placeholder="请输入物料编码" style="width: 100%;"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="" @click="handleSearchClick" style="min-width: 100px;">搜索</el-button>
                </el-col>
                <el-col :span="8" class="button-container">
                    <el-button type="info" @click="handleResetClick" style="min-width: 100px;">重置</el-button>
                    <el-button type="primary" style="min-width: 100px;" @click="handleAddClick">新增</el-button>
                    <el-button type="danger" style="min-width: 100px; margin-left: 10px;"
                        @click="handleDeleteClick">删除</el-button>
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
                        <el-table-column label="物料编码" prop="materialCode" min-width="80"></el-table-column>
                        <el-table-column label="图纸号" prop="drawingCode" min-width="100"></el-table-column>
                        <el-table-column label="名称" prop="Name" min-width="100"></el-table-column>
                        <el-table-column label="规格/型号" prop="specification" min-width="100"></el-table-column>
                        <el-table-column label="材料" prop="material" min-width="120"></el-table-column>
                        <el-table-column label="颜色" prop="color" min-width="120"></el-table-column>
                        <el-table-column label="数量" prop="numbers" min-width="60"></el-table-column>
                        <el-table-column label="单位" prop="unit" min-width="60"></el-table-column>
                        <el-table-column label="物料类别" prop="materialCategory" min-width="60"></el-table-column>
                        <el-table-column label="备注" prop="Note" min-width="60"></el-table-column>
                        <el-table-column label="单价" prop="perPrice" min-width="60"></el-table-column>
                        <el-table-column label="总价" prop="totalPrice" min-width="60"></el-table-column>
                        <el-table-column label="操作" width="200" fixed="right">
                            <template #default="{ row }">
                                <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                                <el-button type="text" @click="handleParent(row)">父级</el-button>
                                <el-button type="text" @click="handleChild(row)">子级</el-button>
                                <el-button type="text" @click="handleCondition(row)">条件</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>

        <div class="container">
            <Pagination :total=tableData.length :page-size="pageSize" :current-page="currentPage"
                @select-change="handleSelectChange" />
        </div>

    </div>

    <el-dialog title="查询条件设置" v-model="dialogVisible" width="70%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <ConditionsSet :key="selectedRow.id" :initialData="selectedRow" @cancel="handleCancelConditions"
            @ConditionSetformSubmitted="handleConditionSetformSubmitted" />
    </el-dialog>

    <el-dialog title="新增零部件物料" v-model="addDialogVisible" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <AddComponentMaterial @cancel="handleCancelConditions"
            @AddComponentformSubmitted="handleAddComponentformSubmitted" />
    </el-dialog>

    <el-dialog title="编辑零部件物料" v-model="editDialogVisible" width="30%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <EditComponentMaterial :key="selectedRow.id" :initialData="selectedRow" @cancel="handleCancelConditions"
            @EditComponentformSubmitted="handleEditComponentformSubmitted" />
    </el-dialog>

    <el-dialog title="父级设置" v-model="parentSetDialogVisible" width="90%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <ParentSet :key="selectedRow.id" :initialData="selectedRow" @cancel="handleCancelConditions"
            @ParentSetformSubmitted="handleParentSetformSubmitted" />
    </el-dialog>

    <el-dialog title="子级设置" v-model="sonSetDialogVisible" width="90%" draggable :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <SonSet :key="selectedRow.id" :initialData="selectedRow" @cancel="handleCancelConditions"
            @sonSetformSubmitted="handleSonSetformSubmitted" />
    </el-dialog>
</template>

<script>
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import Pagination from '../publicComponents/Pagination.vue';
import ConditionsSet from './ConditionsSet.vue'
import AddComponentMaterial from './AddComponentMaterial.vue'
import EditComponentMaterial from './EditComponentMaterial.vue'
import ParentSet from './ParentSet.vue'
import SonSet from './SonSet.vue'
import dayjs from 'dayjs'; // 引入 dayjs

export default {
    data() {
        return {
            pageSize: 10, // 初始值，根据实际情况设置
            currentPage: 1, // 初始值，根据实际情况设置
            dialogVisible: false,
            addDialogVisible: false,
            editDialogVisible: false,
            parentSetDialogVisible: false,
            sonSetDialogVisible: false,
            tableData: [],
            selectedRow: null,
            searchName: '', // 添加一个数据属性来存储搜索名称
            searchMaterialCode: '', // 添加一个数据属性来存储搜索物料编码
            // 添加一个属性来存储上一次的搜索名称和物料编码
            prevSearchName: '',
            prevSearchMaterialCode: '',
            selectedRows: [],
            currentUserData: null  // 新增用于存储用户数据的变量
        };
    },
    components: {
        Pagination,
        ConditionsSet,
        AddComponentMaterial,
        EditComponentMaterial,
        ParentSet,
        SonSet,

    },
    created() {
        const url = `${baseURL}/componentList`;
        axios.get(url)
            .then(response => {
                this.tableData = response.data;
                this.displayedData = this.tableData.slice(0, this.pageSize);
            })
            .catch(error => {
                console.error('Error fetching component list:', error);
            });

        // 在组件创建时获取用户数据
        this.currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
    },
    methods: {
        sendSearchRequest() {
            const url = `${baseURL}/componentList`;
            axios.get(url, {
                params: {
                    componentName: this.searchName,
                    componentMaterialCode: this.searchMaterialCode,
                }
            })
                .then(response => {
                    this.tableData = response.data;
                    this.displayedData = this.tableData.slice(0, this.pageSize);
                })
                .catch(error => {
                    console.error('获取零部件列表时出错:', error);
                });
        },
        handleSearchClick() {
            this.sendSearchRequest();
            if (this.searchName !== this.prevSearchName || this.searchMaterialCode !== this.prevSearchMaterialCode) {
                this.currentPage = 1;
                this.prevSearchName = this.searchName;
                this.prevSearchMaterialCode = this.searchMaterialCode;
            }
        },
        handleAddClick() {
            if (this.currentUserData.add_data_permission === 1) {
                this.addDialogVisible = true; // 显示新增对话框
            } else {
                this.$alert('你没有权限新增数据，请联系管理员！', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        },
        handleSelectChange(data) {
            this.pageSize = data.perPages; // 将perPages赋值给pageSize
            this.currentPage = data.currentPage; // 可选：根据需要处理currentPage的值
        },
        handleEdit(row) {
            if (this.currentUserData.edit_data_permission === 1) {
                this.selectedRow = { ...row }; // 使用对象的拷贝，确保不会直接修改原始数据
                this.editDialogVisible = true; // 打开编辑对话框
            } else {
                this.$alert('你没有权限编辑数据，请联系管理员', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        },
        handleResetClick() {
            this.searchName = ''; // 清空输入名称
            this.searchMaterialCode = ''; // 清空物料编码
            this.handleSearchClick(); // 重新查询
        },
        handleParent(row) {
            if (this.currentUserData.edit_data_permission === 1) {
                this.selectedRow = row;
                this.parentSetDialogVisible = true; // 显示父级设置对话框
                this.sendSearchRequest();
            } else {
                this.$alert('你没有权限编辑数据，请联系管理员', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        },
        handleCondition(row) {
            if (this.currentUserData.edit_data_permission === 1) {
                this.selectedRow = row;
                this.dialogVisible = true; // 显示弹出窗口
                this.sendSearchRequest();
            } else {
                this.$alert('你没有权限编辑数据，请联系管理员', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        },
        handleChild(row) {
            if (this.currentUserData.edit_data_permission === 1) {
                this.selectedRow = row;
                this.sonSetDialogVisible = true; // 显示子级设置对话框
                this.sendSearchRequest();
            } else {
                this.$alert('你没有权限编辑数据，请联系管理员', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        },
        handleCancelConditions() {
            this.dialogVisible = false; // 关闭弹出窗口
            this.addDialogVisible = false;
            this.editDialogVisible = false;
            this.parentSetDialogVisible = false;
            this.sonSetDialogVisible = false;
            this.sendSearchRequest();

        },
        handleAddComponentformSubmitted() {
            this.sendSearchRequest();
        },
        handleEditComponentformSubmitted() {
            this.sendSearchRequest();
        },
        handleConditionSetformSubmitted() {
            this.sendSearchRequest();
        },
        handleSonSetformSubmitted() {
            this.sendSearchRequest();
        },
        handleParentSetformSubmitted() {
            this.sendSearchRequest();
        },
        handleSelectionChange(selection) {
            this.selectedRows = selection;
        },
        logOperation(operationType, operationContent) {
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
        },
        handleDeleteClick() {
            if (this.currentUserData.delete_data_permission === 1) {
                const component_url = `${baseURL}/componentList`;
                const component_del_url = `${baseURL}/deleteComponent`;

                if (this.selectedRows.length === 0) {
                    // 如果没有选中任何行，则提示用户选择要删除的数据
                    this.$message({
                        type: 'warning',
                        message: '请选择要删除的数据'
                    });
                } else {
                    this.$confirm('此操作将永久删除选中的数据，是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const selectedIds = this.selectedRows.map(row => row.id);
                        const selectedMaterialCodes = this.selectedRows.map(row => row.materialCode);

                        // 直接传递数组
                        const params = {
                            id: selectedIds
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
                                // 拼接所有选中行的物料编码和名称
                                const operationContent = this.selectedRows.map(row => `物料编码为：${row.materialCode}，名称为：${row.Name}`).join('；');
                                // 记录删除操作日志
                                this.logOperation('delete', `删除零部件物料，${operationContent}`);
                                // 处理后端返回的响应
                                axios.get(component_url)
                                    .then(response => {
                                        this.tableData = response.data;
                                        const totalPages = Math.ceil(this.tableData.length / this.pageSize);
                                        if (totalPages < this.currentPage) {
                                            this.currentPage = totalPages; // 如果当前页超出了新的总页数，则将当前页设置为最后一页
                                        }
                                        this.displayedData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
                                    })
                                    .catch(error => {
                                        console.error('获取零部件列表时出错:', error);
                                    });
                            })
                            .catch(error => {
                                // 处理错误
                                console.error('Error deleting components:', error);
                            });
                    }).catch(() => {
                        // 用户点击取消按钮的回调
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            } else {
                this.$alert('你没有权限删除数据，请联系管理员', '权限不足', {
                    confirmButtonText: '确定',
                    type: 'warning'
                });
            }
        }
    },
    computed: {
        displayedData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.tableData.slice(startIndex, endIndex);
        }
    },
}
</script>

<style scoped>
.button-container {
    text-align: right;
}

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
