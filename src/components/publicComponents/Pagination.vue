<template>
    <div class="pagination-container">
        <el-text size="large">共{{ total }}条数据</el-text>

        <el-select v-model="selectedItem" placeholder="Select" style="width: 240px" @change="onSelectChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>

        <el-button class="forwardButton" type="info" @click="prevPage" :disabled="currentPage === 1">前一页</el-button>
        <el-text size="large">第{{ currentPage }}页/共{{ totalPages }}页</el-text>
        <el-button class="nextButton" type="info" @click="nextPage"
            :disabled="currentPage === totalPages">后一页</el-button>
        <el-input v-model="inputPage" type="number" style="width: 240px" placeholder="请输入要跳转的页码"
            @input="onInputPageChange" />
        <el-button class="gotoButton" type="info" @click="gotoPage">跳转</el-button>
    </div>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
    name: 'Pagination',
    props: {
        total: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        }
    },
    setup(props, { emit }) {

        const inputPage = ref('');

        const options = [
            { label: '每页10条', value: 10 },
            { label: '每页20条', value: 20 },
            { label: '每页50条', value: 50 },
            { label: '每页100条', value: 100 },
            { label: '每页1000条', value: 1000 },
        ];
        const selectedItem = ref(10)
        const pageSize = computed(() => parseInt(selectedItem.value));
        const totalPages = computed(() => Math.ceil(props.total / pageSize.value));

        // 监听输入，确保只能输入数字且在合法范围内
        function onInputPageChange() {
            let parsedValue = parseInt(inputPage.value);
            if (inputPage.value === '') {
                // 如果输入框内容为空，则清空输入框
                inputPage.value = '';
            } else if (isNaN(parsedValue) || parsedValue < 1) {
                inputPage.value = 1; // 如果输入值不是数字或小于1，则设置为1
            } else if (parsedValue > totalPages.value) {
                inputPage.value = totalPages.value; // 如果输入值大于最大页码，则设置为最大页码
            } else {
                inputPage.value = parsedValue; // 更新为解析后的整数值
            }
        }


        watch(selectedItem, (newValue) => {
            selectedItem.value = newValue;
        });

        watch(() => props.currentPage, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                currentPageInRange();
            }
        });

        function currentPageInRange() {
            if (props.currentPage > totalPages.value) {
                currentPage.value = totalPages.value; // 将 currentPage 设置为 totalPages
                emit('select-change', { perPages: selectedItem.value, currentPage: totalPages.value });
            }
        }

        function onPageSizeChange() {
            if (props.currentPage > totalPages.value) {
                currentPageInRange(); // 调用 currentPageInRange 来确保 currentPage 在合法范围内
            }
        }

        function prevPage() {
            if (props.currentPage > 1) {
                emit('select-change', { perPages: selectedItem.value, currentPage: props.currentPage - 1 });
            }
        }

        function nextPage() {
            if (props.currentPage < totalPages.value) {
                emit('select-change', { perPages: selectedItem.value, currentPage: props.currentPage + 1 });
            }
        }

        function gotoPage() {
            let page = parseInt(inputPage.value);
            if (page >= 1 && page <= totalPages.value) {
                emit('select-change', { perPages: selectedItem.value, currentPage: page });
                inputPage.value = '';
            }
        }

        function onSelectChange() {
            emit('select-change', { perPages: selectedItem.value, currentPage: 1 });
        }

        return {
            // currentPage,
            pageSize,
            inputPage,
            onInputPageChange,
            currentPageInRange,
            options,
            selectedItem,
            totalPages,
            onPageSizeChange,
            prevPage,
            nextPage,
            gotoPage,
            onSelectChange,
        };
    }
};

</script>

<style scoped>
.pagination-container {
    display: flex;
    justify-content: flex-end;
    /* 将所有子元素放置在每一行的最右侧 */
}

.el-text,
.el-select,
.el-button,
.el-input {
    margin-right: 20px;
    /* 添加间隔 */
}

.forwardButton {
    min-width: 80px;
}

.nextButton {
    min-width: 80px;
}

.gotoButton {
    min-width: 80px;
    margin-right: 0;
    /* 移除右边距 */
}
</style>
