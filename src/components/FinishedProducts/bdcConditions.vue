<template>
    <div>
        <h3>BDC（胆道引流导管）筛选条件</h3>
        <div class="select-container">
            <el-select v-model="selectedItem1" clearable placeholder="请选择直径" class="select-item" @change="emitDiameter"
                style="margin-left: 0;">
                <el-option v-for="option in diameterOptions" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
            <el-select v-model="selectedItem2" clearable placeholder="请选择有效长度" class="select-item" @change="emitLength">
                <el-option v-for="option in lengthOptions" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
            <el-select v-model="selectedItem3" clearable placeholder="请选择引流方式" class="select-item" @change="emitFlow">
                <el-option v-for="option in flowOptions" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
            <el-select v-model="selectedItem4" clearable placeholder="请选择头端样式" class="select-item" @change="emitHeadStyle">
                <el-option v-for="option in headStyleOptions" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
            <el-select v-model="selectedItem5" clearable placeholder="请选择配置代号" class="select-item" @change="emitConfigurationCode"
                style="margin-right: 0;">
                <el-option v-for="option in configOptions" :key="option.value" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup(props, { emit }) {
        const selectedItem1 = ref(null);
        const selectedItem2 = ref(null);
        const selectedItem3 = ref(null);
        const selectedItem4 = ref(null);
        const selectedItem5 = ref(null);

        const diameterOptions = [
            { label: '6F', value: '06' },
            { label: '7F', value: '07' },
            { label: '8F', value: '08' },
            { label: '10F', value: '10' },
            { label: '12F', value: '12' }
        ];

        const lengthOptions = [
            { label: '25cm', value: '25' },
            { label: '30cm', value: '30' },
            { label: '35cm', value: '35' },
            { label: '40cm', value: '40' }
        ];

        const flowOptions = [
            { label: '无内容:内外引流', value: 'None' },
            { label: 'W:外引流', value: 'W' }
        ];

        const headStyleOptions = [
            { label: 'L:可锁定猪尾型', value: 'L' },
            { label: 'N:非锁定猪尾型', value: 'N' }
        ];

        const configOptions = [
            { label: 'T型', value: 'T' },
            { label: 'TP型', value: 'TP' },
            { label: 'SA型', value: 'SA' },
            { label: 'SAP型', value: 'SAP' },
            { label: 'SB型', value: 'SB' },
            { label: 'SBP型', value: 'SBP' }
        ];

        const emitDiameter = () => {
            emit('dandaoDiameterChange', selectedItem1.value);
        };

        const emitLength = () => {
            emit('dandaoLengthChange', selectedItem2.value);
        };

        const emitFlow = () => {
            emit('dandaoFlowChange', selectedItem3.value);
        };

        const emitHeadStyle = () => {
            emit('dandaoHeadStyleChange', selectedItem4.value);
        };

        const emitConfigurationCode = () => {
            emit('dandaoConfigurationCodeChange', selectedItem5.value);
        };

        return {
            selectedItem1,
            selectedItem2,
            selectedItem3,
            selectedItem4,
            selectedItem5,
            diameterOptions,
            lengthOptions,
            flowOptions,
            headStyleOptions,
            configOptions,
            emitDiameter,
            emitLength,
            emitFlow,
            emitHeadStyle,
            emitConfigurationCode
        };
    }
}
</script>

<style>
.select-container {
    display: flex;
    justify-content: space-between;
}

.select-item {
    flex: 1;
    margin: 0 10px;
}
</style>