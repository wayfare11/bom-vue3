<template>
    <div class="top-margin">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="物料编码" prop="materialCode" inline>
                <el-input v-model="form.materialCode"></el-input>
            </el-form-item>
            <el-form-item label="文件编号" prop="fileNumber" inline>
                <el-input v-model="form.fileNumber"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name" inline>
                <el-input v-model="form.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="版本号" prop="version" inline>
                <el-input v-model="form.version"></el-input>
            </el-form-item>
            <el-form-item label="产品规格" prop="productSpec" inline>
                <el-input v-model="productSpec" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="产品代号" prop="productCode" inline>
                <el-select v-model="form.productCode" placeholder="请选择产品代号" clearable :disabled="true">
                    <el-option label="DC" value="DC"></el-option>
                    <el-option label="BDC" value="BDC"></el-option>
                </el-select>
            </el-form-item>

            <div v-if="form.productCode === 'DC'">
                <div class="additional-text-title">引流导管套装</div>
                <el-form-item label="直径" prop="dc.nameDiameter" inline class="top-padding">
                    <el-select v-model="form.dc.nameDiameter" placeholder="请选择直径" clearable>
                        <el-option v-for="diameter in diameterOptionsDC" :key="diameter.value" :label="diameter.label"
                            :value="diameter.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="长度" prop="dc.length" inline>
                    <el-select v-model="form.dc.length" placeholder="请选择长度" clearable>
                        <el-option v-for="lengthOption in lengthOptionsDC" :key="lengthOption.value"
                            :label="lengthOption.label" :value="lengthOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="锁定形式" prop="dc.lockingForm" inline>
                    <el-select v-model="form.dc.lockingForm" placeholder="请选择锁定形式" clearable>
                        <el-option v-for="lockingFormOption in lockingFormOptions" :key="lockingFormOption.value"
                            :label="lockingFormOption.label" :value="lockingFormOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头端样式" prop="dc.headStyle" inline>
                    <el-select v-model="form.dc.headStyle" placeholder="请选择头端样式" clearable>
                        <el-option v-for="headStyleOption in headStyleOptionsDC" :key="headStyleOption.value"
                            :label="headStyleOption.label" :value="headStyleOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置代号" prop="dc.configCode" inline>
                    <el-select v-model="form.dc.configCode" placeholder="请选择配置代号" clearable>
                        <el-option v-for="configOption in configOptions" :key="configOption.value"
                            :label="configOption.label" :value="configOption.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <div v-if="form.productCode === 'BDC'">
                <div class="additional-text-title">引流导管套装</div>
                <el-form-item label="直径" prop="bdc.nameDiameter" inline class="top-padding">
                    <el-select v-model="form.bdc.nameDiameter" placeholder="请选择直径" clearable>
                        <el-option v-for="diameter in diameterOptionsBDC" :key="diameter.value" :label="diameter.label"
                            :value="diameter.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="长度" prop="bdc.length" inline>
                    <el-select v-model="form.bdc.length" placeholder="请选择长度" clearable>
                        <el-option v-for="lengthOption in lengthOptionsBDC" :key="lengthOption.value"
                            :label="lengthOption.label" :value="lengthOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="引流方式" prop="bdc.drainageMethod" inline>
                    <el-select v-model="form.bdc.drainageMethod" placeholder="请选择引流方式" clearable>
                        <el-option v-for="drainageMethodOption in drainageMethodOptions"
                            :key="drainageMethodOption.value" :label="drainageMethodOption.label"
                            :value="drainageMethodOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="头端样式" prop="bdc.headStyle" inline>
                    <el-select v-model="form.bdc.headStyle" placeholder="请选择头端样式" clearable>
                        <el-option v-for="headStyleOption in headStyleOptionsBDC" :key="headStyleOption.value"
                            :label="headStyleOption.label" :value="headStyleOption.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置代号" prop="bdc.configCode" inline>
                    <el-select v-model="form.bdc.configCode" placeholder="请选择配置代号" clearable>
                        <el-option v-for="configOption in configOptions" :key="configOption.value"
                            :label="configOption.label" :value="configOption.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <span class="buttonsSet">
                <el-button type="primary" @click="handleEditConfirm">确定</el-button>
                <el-button @click="handleDialogEditClose">取消</el-button>
            </span>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import dayjs from 'dayjs';

export default {
    props: {
        initData: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            form: {
                materialCode: '',
                fileNumber: '',
                name: '',
                version: '',
                productSpec: '',
                productCode: '',
                dc: {
                    nameDiameter: '',
                    length: '',
                    lockingForm: '',
                    headStyle: '',
                    configCode: ''
                },
                bdc: {
                    nameDiameter: '',
                    length: '',
                    drainageMethod: '',
                    headStyle: '',
                    configCode: ''
                }
            },
            isFormInitialized: false,
            rules: {
                materialCode: [{ required: true, message: '物料编码不能为空', trigger: 'blur' }],
                fileNumber: [{ required: true, message: '文件编号不能为空', trigger: 'blur' }],
                name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
                version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
                productCode: [{ required: true, message: '产品代号不能为空', trigger: 'change' }],
                'dc.nameDiameter': [{ required: true, message: '直径不能为空', trigger: 'change' }],
                'dc.length': [{ required: true, message: '长度不能为空', trigger: 'change' }],
                'dc.lockingForm': [{ required: true, message: '锁定形式不能为空', trigger: 'change' }],
                'dc.headStyle': [{ required: true, message: '头端样式不能为空', trigger: 'change' }],
                'dc.configCode': [{ required: true, message: '配置代号不能为空', trigger: 'change' }],
                'bdc.nameDiameter': [{ required: true, message: '直径不能为空', trigger: 'change' }],
                'bdc.length': [{ required: true, message: '长度不能为空', trigger: 'change' }],
                'bdc.drainageMethod': [{ required: true, message: '引流方式不能为空', trigger: 'change' }],
                'bdc.headStyle': [{ required: true, message: '头端样式不能为空', trigger: 'change' }],
                'bdc.configCode': [{ required: true, message: '配置代号不能为空', trigger: 'change' }]
            },
            diameterOptionsDC: [
                { label: '5F', value: '05' },
                { label: '6F', value: '06' },
                { label: '7F', value: '07' },
                { label: '8F', value: '08' },
                { label: '10F', value: '10' },
                { label: '12F', value: '12' },
                { label: '14F', value: '14' },
                { label: '16F', value: '16' }
            ],
            diameterOptionsBDC: [
                { label: '6F', value: '06' },
                { label: '7F', value: '07' },
                { label: '8F', value: '08' },
                { label: '10F', value: '10' },
                { label: '12F', value: '12' }
            ],
            lengthOptionsDC: [
                { label: '20cm', value: '20' },
                { label: '25cm', value: '25' },
                { label: '30cm', value: '30' },
                { label: '35cm', value: '35' },
                { label: '40cm', value: '40' }
            ],
            lengthOptionsBDC: [
                { label: '25cm', value: '25' },
                { label: '30cm', value: '30' },
                { label: '35cm', value: '35' },
                { label: '40cm', value: '40' }
            ],
            lockingFormOptions: [
                { label: 'L:可锁定型', value: 'L' },
                { label: 'N:非锁定型', value: 'N' }
            ],
            headStyleOptionsDC: [
                { label: 'J:J型', value: 'J' },
                { label: 'P:猪尾型', value: 'P' }
            ],
            headStyleOptionsBDC: [
                { label: 'L:可锁定型猪尾型', value: 'L' },
                { label: 'N:非锁定型猪尾型', value: 'N' }
            ],
            configOptions: [
                { label: 'T型', value: 'T' },
                { label: 'TP型', value: 'TP' },
                { label: 'SA型', value: 'SA' },
                { label: 'SAP型', value: 'SAP' },
                { label: 'SB型', value: 'SB' },
                { label: 'SBP型', value: 'SBP' }
            ],
            drainageMethodOptions: [
                { label: '无内容:内外引流', value: 'None' },
                { label: 'W:外引流', value: 'W' }
            ],
            fieldMap: {
                MaterialCode: '物料编码',
                fileCode: '文件编号',
                Name: '名称',
                Version: '版本号',
                ProductSpecifications: '产品规格',
                ProductCode: '产品代号',
                yinliuDiameter: '直径 (DC)',
                yinliuLength: '长度 (DC)',
                yinliuLockStyle: '锁定形式 (DC)',
                yinliuHeadStyle: '头端样式 (DC)',
                yinliuConfigurationCode: '配置代号 (DC)',
                dandaoDiameter: '直径 (BDC)',
                dandaoLength: '长度 (BDC)',
                drainageMethod: '引流方式 (BDC)',
                dandaoHeadStyle: '头端样式 (BDC)',
                dandaoConfigurationCode: '配置代号 (BDC)'
            }
        };
    },
    computed: {
        productSpec() {
            if (this.form.productCode === 'DC') {
                const specParts = [
                    this.form.productCode + '-',
                    this.form.dc.nameDiameter ? this.form.dc.nameDiameter : '',
                    this.form.dc.length ? this.form.dc.length + '-' : '',
                    this.form.dc.lockingForm ? this.form.dc.lockingForm : '',
                    this.form.dc.headStyle ? this.form.dc.headStyle + '/' : '',
                    this.form.dc.configCode || ''
                ];
                return specParts.filter(part => part !== '').join('');
            } else if (this.form.productCode === 'BDC') {
                const specPartsBDC = [
                    this.form.productCode + '-',
                    this.form.bdc.nameDiameter ? this.form.bdc.nameDiameter : '',
                    this.form.bdc.length ? this.form.bdc.length : '',
                    (this.form.bdc.drainageMethod && this.form.bdc.drainageMethod !== 'None') ? this.form.bdc.drainageMethod + '-' : '-',
                    this.form.bdc.headStyle ? this.form.bdc.headStyle + '/' : '',
                    this.form.bdc.configCode || ''
                ];
                return specPartsBDC.filter(part => part !== '').join('');
            } else {
                return '';
            }
        },
    },
    methods: {
        handleDialogEditClose() {
            this.$refs.form.resetFields();
            this.$refs.form.clearValidate();
            this.$emit('closeDialog');
        },
        handleEditConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let data = {
                        id: this.initData.id,
                        MaterialCode: this.form.materialCode,
                        fileCode: this.form.fileNumber,
                        Name: this.form.name,
                        ProductSpecifications: this.productSpec,
                        Version: this.form.version,
                        ProductCode: this.form.productCode,
                    };

                    if (this.form.productCode === 'DC') {
                        data = {
                            ...data,
                            yinliuDiameter: this.form.dc.nameDiameter,
                            yinliuLength: this.form.dc.length,
                            yinliuLockStyle: this.form.dc.lockingForm,
                            yinliuHeadStyle: this.form.dc.headStyle,
                            yinliuConfigurationCode: this.form.dc.configCode
                        };
                    } else if (this.form.productCode === 'BDC') {
                        data = {
                            ...data,
                            dandaoDiameter: this.form.bdc.nameDiameter,
                            dandaoLength: this.form.bdc.length,
                            drainageMethod: this.form.bdc.drainageMethod,
                            dandaoHeadStyle: this.form.bdc.headStyle,
                            dandaoConfigurationCode: this.form.bdc.configCode
                        };
                    }

                    // 发送 PUT 请求到后端
                    axios.put(`${baseURL}/editFinishedMaterials`, data)
                        .then(response => {
                            if (response.data === "修改成品成功") {
                                this.$message.success('修改成品成功');
                                this.$emit('editFinishedProductSuccess');
                                this.logOperation(data);
                            } else {
                                this.$message.error('修改成品失败');
                            }
                        })
                        .catch(error => {
                            console.error('提交失败:', error);
                            this.$message.error('提交失败，请重试');
                        });
                } else {
                    console.log('表单验证失败，请检查');
                }
            });
        },
        logOperation(newData) {
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

            const changes = this.getChanges(newData, this.initData);

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'edit',
                operation_content: `编辑成品清单，物料编码为：${this.form.materialCode}。修改内容：${changes}`,
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
        getChanges(newData, oldData) {
            let changes = [];

            for (let key in newData) {
                if (newData[key] !== oldData[key]) {
                    const fieldName = this.fieldMap[key] || key;
                    const newValue = this.getLabelForValue(key, newData[key]);
                    const oldValue = this.getLabelForValue(key, oldData[key]);
                    changes.push(`${fieldName}: 从 "${oldValue}" 修改为 "${newValue}"`);
                }
            }

            return changes.join('; ');
        },
        getLabelForValue(key, value) {
            const optionMaps = {
                yinliuDiameter: this.diameterOptionsDC,
                yinliuLength: this.lengthOptionsDC,
                yinliuLockStyle: this.lockingFormOptions,
                yinliuHeadStyle: this.headStyleOptionsDC,
                yinliuConfigurationCode: this.configOptions,
                dandaoDiameter: this.diameterOptionsBDC,
                dandaoLength: this.lengthOptionsBDC,
                drainageMethod: this.drainageMethodOptions,
                dandaoHeadStyle: this.headStyleOptionsBDC,
                dandaoConfigurationCode: this.configOptions
            };

            const options = optionMaps[key];
            if (options) {
                const option = options.find(option => option.value === value);
                return option ? option.label : value;
            }

            return value;
        },
        formatDate(date) {
            return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
        },
        initializeForm() {
            if (this.initData) {
                this.form.materialCode = this.initData.MaterialCode || '';
                this.form.fileNumber = this.initData.fileCode || '';
                this.form.name = this.initData.Name || '';
                this.form.version = this.initData.Version || '';
                this.form.productCode = this.initData.ProductCode || '';

                if (this.form.productCode === 'DC') {
                    this.form.dc.nameDiameter = this.initData.yinliuDiameter || '';
                    this.form.dc.length = this.initData.yinliuLength || '';
                    this.form.dc.lockingForm = this.initData.yinliuLockStyle || '';
                    this.form.dc.headStyle = this.initData.yinliuHeadStyle || '';
                    this.form.dc.configCode = this.initData.yinliuConfigurationCode || '';
                } else if (this.form.productCode === 'BDC') {
                    this.form.bdc.nameDiameter = this.initData.dandaoDiameter || '';
                    this.form.bdc.length = this.initData.dandaoLength || '';
                    this.form.bdc.drainageMethod = this.initData.drainageMethod || '';
                    this.form.bdc.headStyle = this.initData.dandaoHeadStyle || '';
                    this.form.bdc.configCode = this.initData.dandaoConfigurationCode || '';
                }
                this.isFormInitialized = true;
            }
        }
    },
    watch: {
        'form.productCode': function (newVal, oldVal) {
            if (newVal !== oldVal && this.isFormInitialized) {
                if (newVal === 'DC') {
                    this.form.bdc = {
                        nameDiameter: '',
                        length: '',
                        drainageMethod: '',
                        headStyle: '',
                        configCode: ''
                    };
                } else if (newVal === 'BDC') {
                    this.form.dc = {
                        nameDiameter: '',
                        length: '',
                        lockingForm: '',
                        headStyle: '',
                        configCode: ''
                    };
                }
            }
        },
        initData: {
            immediate: true,
            handler(newVal) {
                this.initializeForm();
            }
        }
    },
    mounted() {
        this.initializeForm();
    },
};
</script>

<style>
.top-margin {
    margin-top: 20px;
}

.additional-text {
    text-align: center;
    margin-top: 20px;
}

.additional-text-title {
    font-weight: bold;
}

.top-padding {
    margin-top: 20px;
}

.buttonsSet {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}
</style>
