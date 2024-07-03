<template>
    <el-form :model="formData" :rules="formRules" ref="form" label-width="100px">
        <el-form-item label="物料分类" prop="majorCategory">
            <el-radio-group v-model="formData.majorCategory">
                <el-radio label="主料">主料</el-radio>
                <el-radio label="包材">包材</el-radio>
                <el-radio label="辅材">辅材</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="物料编码" prop="materialCode">
            <el-input v-model="formData.materialCode" placeholder="请输入物料编码"></el-input>
        </el-form-item>

        <el-form-item label="图纸号" prop="drawingCode">
            <el-input v-model="formData.drawingCode" placeholder="请输入图纸号"></el-input>
        </el-form-item>

        <el-form-item label="名称" prop="Name">
            <el-input v-model="formData.Name" placeholder="请输入名称"></el-input>
        </el-form-item>

        <el-form-item label="规格/型号" prop="specification">
            <el-input v-model="formData.specification" placeholder="请输入规格/型号"></el-input>
        </el-form-item>

        <el-form-item label="材料" prop="material">
            <el-input v-model="formData.material" placeholder="请输入材料"></el-input>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
            <el-input v-model="formData.color" placeholder="请输入颜色"></el-input>
        </el-form-item>

        <el-form-item label="数量" prop="numbers">
            <el-input v-model="formData.numbers" placeholder="请输入数量" type="number"
                @input="handleNumberInput"></el-input>
        </el-form-item>

        <el-form-item label="单位" prop="unit">
            <el-input v-model="formData.unit" placeholder="请输入单位"></el-input>
        </el-form-item>

        <el-form-item label="物料类别" prop="materialCategory">
            <el-input v-model="formData.materialCategory" placeholder="请输入物料类别"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="Note">
            <el-input v-model="formData.Note" placeholder="请输入备注"></el-input>
        </el-form-item>

        <el-form-item label="价格" prop="perPrice">
            <el-input v-model="formData.perPrice" placeholder="请输入价格" type="number"
                @input="handlePriceInput"></el-input>
        </el-form-item>

        <div class="button-container">
            <el-button type="primary" style="width: 100px;" @click="handleConfirm">确定</el-button>
            <el-button style="width: 100px; margin-left: 10px;" @click="handleCancel">取消</el-button>
        </div>
    </el-form>
</template>

<script>

import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import dayjs from 'dayjs';

export default {
    data() {
        return {
            formData: {
                majorCategory: '',
                materialCode: '',
                drawingCode: '',
                Name: '',
                specification: '',
                material: '',
                color: '',
                numbers: 0,
                unit: '',
                materialCategory: '',
                Note: '',
                perPrice: 0
            },
            formRules: {
                majorCategory: [{ required: true, message: '请选择物料分类', trigger: 'blur' }],
                materialCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
                drawingCode: [{ required: true, message: '请输入图纸号', trigger: 'blur' }],
                Name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
                specification: [{ required: true, message: '请输入规格/型号', trigger: 'blur' }],
                material: [{ required: true, message: '请输入材料', trigger: 'blur' }],
                color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
                numbers: [{ required: true, message: '请输入数量', trigger: 'blur' }],
                unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
                materialCategory: [{ required: true, message: '请输入物料类别', trigger: 'blur' }],
                Note: [{ required: true, message: '请输入备注', trigger: 'blur' }],
                perPrice: [{ required: true, message: '请输入单价', trigger: 'blur' }]
            }
        };
    },
    methods: {
        handleConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 表单验证通过，执行确认操作
                    const url = `${baseURL}/addComponent`

                    axios.post(url, this.formData)
                        .then(response => {
                            // console.log('表单数据已成功提交', response.data);
                            this.logOperation(); // 记录操作日志
                            this.$emit('AddComponentformSubmitted');
                            this.handleCancel();
                            // this.$emit('cancel');
                        })
                        .catch(error => {
                            console.error('提交表单数据时出现错误', error);
                        });
                } else {
                    // 表单验证不通过，不执行确认操作
                }
            });
        },
        handleCancel() {
            this.$refs.form.resetFields(); // 重置表单数据
            this.$refs.form.clearValidate();
            this.$emit('cancel');
        },
        handleNumberInput() {
            this.formData.numbers = this.formData.numbers.replace(/[^\d.]/g, ''); // 只保留数字和小数点
            if (this.formData.numbers.indexOf('.') === 0) {
                this.formData.numbers = '0' + this.formData.numbers;
            }
        },
        handlePriceInput() {
            this.formData.perPrice = this.formData.perPrice.replace(/[^\d.]/g, ''); // 只保留数字和小数点
            if (this.formData.perPrice.indexOf('.') === 0) {
                this.formData.perPrice = '0' + this.formData.perPrice;
            }
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
                operation_content: `新增零部件物料，物料编码为：${this.formData.materialCode}，名称为：${this.formData.Name}`,
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
    }
};
</script>

<style scoped>
.button-container {
    text-align: right;
    margin-top: 20px;
}
</style>
