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
                <el-select v-model="form.productCode" placeholder="请选择产品代号" clearable>
                    <el-option label="DC" value="DC"></el-option>
                    <el-option label="BDC" value="BDC"></el-option>
                </el-select>
            </el-form-item>

            <div class="additional-text" v-if="form.productCode === 'DC'">
                <div class="additional-text-title">
                    引流导管套装
                </div>

                <el-form-item label="直径" prop="nameDiameter" inline class="top-padding">
                    <el-select v-model="form.nameDiameter" placeholder="请选择直径" clearable>
                        <el-option v-for="diameter in diameterOptionsDC" :key="diameter.value" :label="diameter.label"
                            :value="diameter.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="长度" prop="length" inline>
                    <el-select v-model="form.length" placeholder="请选择长度" clearable>
                        <el-option v-for="lengthOption in lengthOptionsDC" :key="lengthOption.value"
                            :label="lengthOption.label" :value="lengthOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="锁定形式" prop="lockingForm" inline>
                    <el-select v-model="form.lockingForm" placeholder="请选择锁定形式" clearable>
                        <el-option v-for="lockingFormOption in lockingFormOptions" :key="lockingFormOption.value"
                            :label="lockingFormOption.label" :value="lockingFormOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="头端样式" prop="headStyle" inline>
                    <el-select v-model="form.headStyle" placeholder="请选择头端样式" clearable>
                        <el-option v-for="headStyleOption in headStyleOptionsDC" :key="headStyleOption.value"
                            :label="headStyleOption.label" :value="headStyleOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="配置代号" prop="configCode" inline>
                    <el-select v-model="form.configCode" placeholder="请选择配置代号" clearable>
                        <el-option v-for="configOption in configOptions" :key="configOption.value"
                            :label="configOption.label" :value="configOption.value"></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <div class="additional-text" v-if="form.productCode === 'BDC'">
                <div class="additional-text-title">
                    胆道引流导管套装
                </div>

                <el-form-item label="直径" prop="nameDiameter" inline class="top-padding">
                    <el-select v-model="form.nameDiameter" placeholder="请选择直径" clearable>
                        <el-option v-for="diameter in diameterOptionsBDC" :key="diameter.value" :label="diameter.label"
                            :value="diameter.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="长度" prop="length" inline>
                    <el-select v-model="form.length" placeholder="请选择长度" clearable>
                        <el-option v-for="lengthOption in lengthOptionsBDC" :key="lengthOption.value"
                            :label="lengthOption.label" :value="lengthOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="引流方式" prop="drainageMethod" inline>
                    <el-select v-model="form.drainageMethod" placeholder="请选择引流方式" clearable>
                        <el-option v-for="drainageMethodOption in drainageMethodOptions"
                            :key="drainageMethodOption.value" :label="drainageMethodOption.label"
                            :value="drainageMethodOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="头端样式" prop="headStyle" inline>
                    <el-select v-model="form.headStyle" placeholder="请选择头端样式" clearable>
                        <el-option v-for="headStyleOption in headStyleOptionsBDC" :key="headStyleOption.value"
                            :label="headStyleOption.label" :value="headStyleOption.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="配置代号" prop="configCode" inline>
                    <el-select v-model="form.configCode" placeholder="请选择配置代号" clearable>
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
    data() {
        return {
            form: {
                materialCode: '', // 这里是你的物料编码的数据
                fileNumber: '', // 这里是文件编号的数据
                name: '', // 这里是名称的数据
                version: '', // 这里是版本号的数据
                productSpec: '', // 这里是产品规格的数据
                productCode: '' // 这里是产品代号的数据
                // 其他表单数据
            },
            rules: {
                materialCode: [
                    { required: true, message: '物料编码不能为空', trigger: 'blur' }
                ],
                fileNumber: [
                    { required: true, message: '文件编号不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                version: [
                    { required: true, message: '版本号不能为空', trigger: 'blur' }
                ],
                productCode: [
                    { required: true, message: '产品代号不能为空', trigger: 'change' }
                ],
                // ...其他表单项的验证规则
                nameDiameter: [
                    { required: true, message: '直径不能为空', trigger: 'change' }
                ],
                length: [
                    { required: true, message: '长度不能为空', trigger: 'change' }
                ],
                lockingForm: [
                    { required: true, message: '锁定形式不能为空', trigger: 'change' }
                ],
                headStyle: [
                    { required: true, message: '头端样式不能为空', trigger: 'change' }
                ],
                configCode: [
                    { required: true, message: '配置代号不能为空', trigger: 'change' }
                ],
                drainageMethod: [
                    { required: true, message: '引流方式不能为空', trigger: 'change' }
                ]
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
            // 锁定形式选项数据
            lockingFormOptions: [
                { label: 'L:可锁定型', value: 'L' },
                { label: 'N:非锁定型', value: 'N' }
            ],
            // 头端样式选项数据
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
        };
    },
    computed: {
        productSpec() {
            if (this.form.productCode === 'DC') {
                // Generate the product spec for DC
                const specParts = [
                    this.form.productCode + '-',
                    this.form.nameDiameter ? this.form.nameDiameter : '',
                    this.form.length ? this.form.length + '-' : '',
                    this.form.lockingForm ? this.form.lockingForm : '',
                    this.form.headStyle ? this.form.headStyle + '/' : '',
                    this.form.configCode || ''
                ];
                return specParts.filter(part => part !== '').join('');
            } else if (this.form.productCode === 'BDC') {
                // Set the product spec for BDC
                const specPartsBDC = [
                    this.form.productCode + '-',
                    this.form.nameDiameter ? this.form.nameDiameter : '',
                    this.form.length ? this.form.length : '',
                    (this.form.drainageMethod && this.form.drainageMethod !== 'None') ? this.form.drainageMethod + '-' : '-',
                    this.form.headStyle ? this.form.headStyle + '/' : '',
                    this.form.configCode || ''
                ];
                return specPartsBDC.filter(part => part !== '').join('');

            } else {
                return ''; // Set a default value if needed
            }
        },
    },
    methods: {
        handleDialogEditClose() {
            this.$refs.form.resetFields(); // 重置表单数据
            this.$refs.form.clearValidate();
            this.$emit('closeDialog'); // 触发自定义事件
        },
        handleEditConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let payload = {};
                    if (this.form.productCode === 'DC') {
                        payload = {
                            MaterialCode: this.form.materialCode,
                            fileCode: this.form.fileNumber,
                            Name: this.form.name,
                            ProductSpecifications: this.productSpec,
                            Version: this.form.version,
                            ProductCode: this.form.productCode,
                            yinliuDiameter: this.form.nameDiameter,
                            yinliuLength: this.form.length,
                            yinliuLockStyle: this.form.lockingForm,
                            yinliuHeadStyle: this.form.headStyle,
                            yinliuConfigurationCode: this.form.configCode
                        };
                    } else if (this.form.productCode === 'BDC') {
                        payload = {
                            MaterialCode: this.form.materialCode,
                            fileCode: this.form.fileNumber,
                            Name: this.form.name,
                            ProductSpecifications: this.productSpec,
                            Version: this.form.version,
                            ProductCode: this.form.productCode,
                            dandaoDiameter: this.form.nameDiameter,
                            dandaoLength: this.form.length,
                            drainageMethod: this.form.drainageMethod,
                            dandaoHeadStyle: this.form.headStyle,
                            dandaoConfigurationCode: this.form.configCode
                        };
                    }

                    // 发送POST请求
                    axios.post(`${baseURL}/addMainMaterial`, payload)
                        .then(response => {
                            // console.log('数据提交成功:', response.data);
                            // 记录操作日志
                            this.logOperation();
                            // 关闭对话框或执行其他操作
                            this.handleDialogEditClose();
                        })
                        .catch(error => {
                            console.error('数据提交失败:', error);
                        });
                } else {
                    console.log('表单验证失败，请检查');
                }
            });
        },
        logOperation() {
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

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'add',
                operation_content: `新增成品物料，物料编码为：${this.form.materialCode}，产品规格为：${this.productSpec}`,
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

    watch: {
        'form.productCode': function (newVal, oldVal) {
            if (newVal !== oldVal) {
                // 清空其他下拉框的值
                this.form.nameDiameter = '';
                this.form.length = '';
                this.form.lockingForm = '';
                this.form.headStyle = '';
                this.form.configCode = '';
                this.form.drainageMethod = '';

                // 根据产品代号设置名称
                if (newVal === 'DC') {
                    this.form.name = '一次性使用引流导管套装材料清单';
                } else if (newVal === 'BDC') {
                    this.form.name = '一次性使用胆道引流导管套装材料清单';
                }
            }
        }
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
    /* Align buttons to the right */
    margin-top: 20px;
}
</style>
