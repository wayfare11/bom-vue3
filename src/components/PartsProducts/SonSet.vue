<template>
    <div>
        <label class="parent-label">物料编码的子级</label>
        <div class="input-container">
            <el-input class="quarter-width" placeholder="请输入物料编码" v-model="materialCode"></el-input>
            <div class="input-spacing"></div>
            <el-input class="quarter-width" placeholder="请输入名称" v-model="Name"></el-input>
            <div class="input-spacing"></div>
            <el-button type="info" style="width: 100px;" @click="handleSearch">搜索</el-button>
        </div>

        <div class="table-container">
            <el-table ref="multipleTable" :data="displayedData" style="width: 100%"
                @selection-change="handleSelectionChange" max-height="443" show-overflow-tooltip>
                <el-table-column type="selection" align="center" width="40" fixed="left"></el-table-column>
                <el-table-column label="序号" prop="index" align="center" width="80"></el-table-column>
                <el-table-column label="物料编码" prop="materialCode" align="center" min-width="100"></el-table-column>
                <el-table-column label="图纸号" prop="drawingCode" align="center" min-width="100"></el-table-column>
                <el-table-column label="名称" prop="Name" align="center" min-width="100"></el-table-column>
                <el-table-column label="规格/型号" prop="specification" align="center" min-width="100"></el-table-column>
                <el-table-column label="材料" prop="material" align="center" min-width="60"></el-table-column>
                <el-table-column label="颜色" prop="color" align="center" min-width="60"></el-table-column>
                <el-table-column label="数量" prop="numbers" align="center" min-width="60"></el-table-column>
                <el-table-column label="单位" prop="unit" align="center" min-width="60"></el-table-column>
                <el-table-column label="物料类别" prop="materialCategory" align="center" min-width="60"></el-table-column>
                <el-table-column label="备注" prop="Note" align="center" min-width="60"></el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <Pagination :total="tableData.length" :page-size="pageSize" :current-page="currentPage"
                @select-change="handleSelectChange" />
        </div>
        <div class="button-container">
            <el-button type="primary" style="width: 100px;" @click="handleConfirm">确定</el-button>
            <el-button style="width: 100px; margin-left: 20px;" @click="handleCancel">取消</el-button>
        </div>
    </div>
</template>

<script>
import Pagination from '../publicComponents/Pagination.vue';
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import dayjs from 'dayjs';

export default {
    props: {
        initialData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            pageSize: 10,
            currentPage: 1,
            currentId: this.initialData.id,
            tableData: [],
            selectedRows: [],
            materialCode: '',
            Name: '',
        }
    },
    components: {
        Pagination
    },
    created() {
        this.fetchData();
    },
    watch: {
        initialData: {
            immediate: true,
            handler(newVal) {
                this.currentId = newVal.id;
                this.fetchData();
            }
        }
    },
    methods: {
        async handleConfirm() {
            const addedMaterialCodes = [];
            const removedMaterialCodes = [];

            const promises = this.displayedData.map(async (row) => {
                const subsetValues = row.subset.split(',').map(value => value.trim());
                const isSelected = this.selectedRows.includes(row);

                if (isSelected) {
                    if (!subsetValues.includes(this.initialData.materialCode)) {
                        const response = await this.judgeSonSet('judge_son', this.initialData.materialCode, row.materialCode);
                        if (response !== 'success') {
                            this.$message.warning(response);
                            return;
                        }

                        if (row.subset === "") {
                            row.subset = this.initialData.materialCode;
                        } else {
                            subsetValues.push(this.initialData.materialCode);
                            row.subset = subsetValues.join(', ');
                        }

                        try {
                            const putResponse = await axios.put(`${baseURL}/sonSet?id=${row.id}&son_set=${row.subset}`);
                            if (putResponse.status !== 200) {
                                throw new Error(`Failed to update row with ID ${row.id}`);
                            }
                            addedMaterialCodes.push(row.materialCode);
                        } catch (error) {
                            console.error(`Error updating row with ID ${row.id}:`, error);
                            this.$message.error(`Error updating row with ID ${row.id}: ${error.message}`);
                        }
                    }
                } else {
                    if (subsetValues.includes(this.initialData.materialCode)) {
                        const index = subsetValues.indexOf(this.initialData.materialCode);
                        subsetValues.splice(index, 1);
                        row.subset = subsetValues.join(', ');

                        try {
                            const putResponse = await axios.put(`${baseURL}/sonSet?id=${row.id}&son_set=${row.subset}`);
                            if (putResponse.status !== 200) {
                                throw new Error(`Failed to update row with ID ${row.id}`);
                            }
                            removedMaterialCodes.push(row.materialCode);
                        } catch (error) {
                            console.error(`Error updating row with ID ${row.id}:`, error);
                            this.$message.error(`Error updating row with ID ${row.id}: ${error.message}`);
                        }
                    }
                }
            });

            await Promise.all(promises);

            this.logOperation(addedMaterialCodes, removedMaterialCodes);

            this.$emit('sonSetformSubmitted');
            this.$emit('cancel');
            this.setDefaultSelection();
        },

        logOperation(addedMaterialCodes, removedMaterialCodes) {
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

            const operationContent = `
                当前物料编码为：${this.initialData.materialCode}。
                新增子级的物料编码：${addedMaterialCodes.join(', ')}。
                取消子级的物料编码：${removedMaterialCodes.join(', ')}
            `;

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'edit',
                operation_content: operationContent,
                operation_time: timestamp
            };

            axios.post(`${baseURL}/logsAdd`, logPayload)
                .then(response => {
                    // console.log('操作日志记录成功:', response.data);
                })
                .catch(error => {
                    console.error('操作日志记录失败:', error);
                });
        },

        formatDate(date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        },

        async judgeSonSet(judgeMethod, parentMaterialCode, sonSetsMaterialCode) {
            const url = `${baseURL}/judgeSonSet`;
            const config = {
                params: {
                    judge_method: judgeMethod,
                    parent_materialCode: parentMaterialCode,
                    sonSets_materialCode: sonSetsMaterialCode
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            try {
                const response = await axios.get(url, config);
                return response.data;
            } catch (error) {
                console.error('Error judging son set:', error);
                return 'Error';
            }
        },

        handleCancel() {
            this.setDefaultSelection();
            this.$emit('cancel');
        },
        handleSelectionChange(selection) {
            this.selectedRows = selection;
        },
        handleSelectChange(data) {
            this.pageSize = data.perPages;
            this.currentPage = data.currentPage;
        },
        fetchData() {
            const url = `${baseURL}/idExceptList`;
            const config = {
                params: {
                    id: this.currentId,
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            axios.get(url, config)
                .then(response => {
                    this.tableData = response.data;
                    this.setDefaultSelection();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },

        setDefaultSelection() {
            this.$nextTick(() => {
                this.$refs.multipleTable.clearSelection();
                this.displayedData.forEach(row => {
                    const subsetValues = row.subset.split(',').map(value => value.trim());
                    if (subsetValues.includes(this.initialData.materialCode)) {
                        this.$refs.multipleTable.toggleRowSelection(row, true);
                    }
                });
            });
        },

        handleSearch() {
            const url = `${baseURL}/idExceptList`;
            const config = {
                params: {
                    id: this.currentId,
                    materialCode: this.materialCode,
                    Name: this.Name
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            axios.get(url, config)
                .then(response => {
                    this.tableData = response.data;
                    this.currentPage = 1;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
    },
    computed: {
        displayedData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            const displayed = this.tableData.slice(startIndex, endIndex);

            this.$nextTick(() => {
                this.setDefaultSelection();
            });

            return displayed;
        }
    },
}
</script>

<style scoped>
.parent-label {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    display: block;
}

.input-container {
    display: flex;
    margin-bottom: 10px;
}

.quarter-width {
    width: 25%;
}

.input-spacing {
    width: 20px;
}

.button-container {
    text-align: right;
    margin-top: 20px;
}

.table-container {
    min-height: 443px;
}

.pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>
