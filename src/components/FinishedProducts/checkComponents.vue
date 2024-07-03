<template>
    <div>
        <label class="bold-large-label">物料编码的零部件</label>
        <div class="row">
            <div class="col">
                <el-input v-model="searchMaterialCode" placeholder="请输入物料编码"></el-input>
            </div>
            <div class="col">
                <el-input v-model="searchName" placeholder="请输入名称"></el-input>
            </div>
            <div class="col">
                <el-select v-model="searchMajorCategory" placeholder="请选择类别" clearable>
                    <el-option label="主料" value="主料"></el-option>
                    <el-option label="包材" value="包材"></el-option>
                    <el-option label="辅材" value="辅材"></el-option>
                </el-select>
            </div>
            <div class="col">
                <el-button type="info" class="wide-button" @click="search">搜索</el-button>
            </div>
        </div>

        <div class="table-container">
            <el-table :data="displayedData" class="full-width-table" style="width: 100%" max-height=442px
                show-overflow-tooltip>
                <el-table-column prop="index" label="序号" width="80" align="center" />
                <el-table-column prop="materialCode" label="物料编码" :min-width="100" align="center" />
                <el-table-column prop="drawingCode" label="图纸号" :min-width="150" align="center" />
                <el-table-column prop="Name" label="名称" :min-width="200" align="center" />
                <el-table-column prop="specification" label="规格/型号" :min-width="150" align="center" />
                <el-table-column prop="material" label="材料" :min-width="80" align="center" />
                <el-table-column prop="color" label="颜色" :min-width="80" align="center" />
                <el-table-column prop="numbers" label="数量" :min-width="80" align="center" />
                <el-table-column prop="unit" label="单位" :min-width="80" align="center" />
                <el-table-column prop="materialCategory" label="物料类别" :min-width="80" align="center" />
                <el-table-column prop="Note" label="备注" :min-width="80" align="center" />
                <el-table-column prop="perPrice" label="单价" :min-width="80" align="center" />
                <el-table-column prop="totalPrice" label="总价" :min-width="80" align="center" />
            </el-table>
        </div>

        <div class="total-and-placeholder">
            <label class="total-label">总价: </label>
            <label class="placeholder-label">{{ all_totalPrice }}</label>
        </div>

        <div class="pagination-and-close">
            <div class="pagination">
                <Pagination :total=PageData.length :page-size="pageSize" :current-page="currentPage"
                    @select-change="handleSelectChange" />
            </div>
            <div>
                <el-button type="primary" @click="closePopup" class="wide-button">关闭</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import Pagination from '../publicComponents/Pagination.vue';

import axios from 'axios';
import { baseURL } from '../../globalVariables.js';

export default {
    props: {
        initData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            pageSize: 10, // 初始值，根据实际情况设置
            currentPage: 1, // 初始值，根据实际情况设置
            PageData: [],
            searchMaterialCode: '',
            searchName: '',
            searchMajorCategory: '',
            all_totalPrice: 0
        };
    },
    components: {
        Pagination
    },
    created() {
        this.search();
        this.calculateAllTotalPrice();
    },
    methods: {
        closePopup() {
            this.$emit('closeCheckComponent');
            this.currentPage = 1;
            this.clearSearchFields();
        },
        handleSelectChange(data) {
            this.pageSize = data.perPages; // 将perPages赋值给pageSize
            this.currentPage = data.currentPage; // 可选：根据需要处理currentPage的值
        },
        async search() {
            let postData = {
                materialCode: this.searchMaterialCode,
                Name: this.searchName,
                majorCategory: this.searchMajorCategory,
                productCode: this.initData.ProductCode
            };

            if (this.initData.ProductCode === 'DC') {
                postData = {
                    ...postData,
                    yinliuDiameter: this.initData.yinliuDiameter,
                    yinliuLength: this.initData.yinliuLength,
                    yinliuLockStyle: this.initData.yinliuLockStyle,
                    yinliuHeadStyle: this.initData.yinliuHeadStyle,
                    yinliuConfigurationCode: this.initData.yinliuConfigurationCode
                };
            } else if (this.initData.ProductCode === 'BDC') {
                postData = {
                    ...postData,
                    dandaoDiameter: this.initData.dandaoDiameter,
                    dandaoLength: this.initData.dandaoLength,
                    drainageMethod: this.initData.drainageMethod,
                    dandaoHeadStyle: this.initData.dandaoHeadStyle,
                    dandaoConfigurationCode: this.initData.dandaoConfigurationCode
                };
            }

            try {
                const response = await axios.get(`${baseURL}/checkMainMaterial`, {
                    params: postData,
                });
                this.PageData = response.data;
                this.calculateAllTotalPrice();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        clearSearchFields() {
            this.searchMaterialCode = '';
            this.searchName = '';
            this.searchMajorCategory = '';
            this.search();
        },
        calculateAllTotalPrice() { // 添加计算总价的方法
            this.all_totalPrice = this.PageData.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(4);
        }
    },
    computed: {
        displayedData() {
            const startIndex = (this.currentPage - 1) * this.pageSize;
            const endIndex = startIndex + this.pageSize;
            return this.PageData.slice(startIndex, endIndex);
        }
    },

}
</script>

<style scoped>
/* 添加适当的样式以确保元素在同一行 */
.row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    /* 添加下边距 */
}

.col {
    flex: 1;
    margin-right: 10px;
    /* 可以根据需要调整间距 */
}

.table-container {
    margin-bottom: 20px;
    min-height: 442px;
    overflow: auto;
}

.wide-button {
    width: 100px;
    /* 根据需要调整按钮宽度 */
}

.bold-large-label {
    font-weight: bold;
    font-size: 15px;
}

.bold-large-label {
    font-weight: bold;
    font-size: 15px;
    display: block;
    /* 将<label>元素改为块级元素 */
    margin-bottom: 20px;
    /* 根据需要调整下边距大小 */
}

.pagination-and-close {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pagination {
    flex: 1;
    /* 占据剩余空间 */
    margin-right: 10px;
    /* 可以根据需要调整间距 */
}

.total-and-placeholder {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-right: 40px;
}

.total-label {
    margin-left: 20px;
    font-weight: bold;
    font-size: 16px;
}

.placeholder-label {
    margin-left: 20px;
    font-size: 16px;
}
</style>