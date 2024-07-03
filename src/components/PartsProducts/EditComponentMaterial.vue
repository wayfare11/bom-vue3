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
    props: {
        initialData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            formData: {
                id: this.initialData.id,
                majorCategory: this.initialData.majorCategory,
                materialCode: this.initialData.materialCode,
                drawingCode: this.initialData.drawingCode,
                Name: this.initialData.Name,
                specification: this.initialData.specification,
                material: this.initialData.material,
                color: this.initialData.color,
                numbers: this.initialData.numbers,
                unit: this.initialData.unit,
                materialCategory: this.initialData.materialCategory,
                Note: this.initialData.Note,
                perPrice: this.initialData.perPrice
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
                perPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }]
            },
            fieldMap: {
                majorCategory: '物料分类',
                materialCode: '物料编码',
                drawingCode: '图纸号',
                Name: '名称',
                specification: '规格/型号',
                material: '材料',
                color: '颜色',
                numbers: '数量',
                unit: '单位',
                materialCategory: '物料类别',
                Note: '备注',
                perPrice: '价格'
            }
        };
    },
    watch: {
        initialData: {
            immediate: true,
            handler(newData) {
                this.formData = { ...newData };
            }
        }
    },
    methods: {
        handleConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 表单验证通过，执行确认操作
                    const url = `${baseURL}/editComponent`;
                    // 发送数据到后端
                    axios.put(url, this.formData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            // 处理响应
                            if (response.data) {
                                this.$message.success('修改组件成功');
                                this.$emit('EditComponentformSubmitted');
                                this.logOperation(this.formData);
                                this.handleCancel(); // 提交成功后关闭页面
                            } else {
                                this.$message.error('修改组件失败');
                            }
                        })
                        .catch(error => {
                            // 处理错误
                            console.error(error);
                            this.$message.error('提交失败，请重试');
                        });
                } else {
                    // 表单验证不通过，不执行确认操作
                    console.log('表单验证失败，请检查');
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

            const changes = this.getChanges(newData, this.initialData);

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'edit',
                operation_content: `编辑零部件，物料编码为：${this.formData.materialCode}。修改内容：${changes}`,
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
                    changes.push(`${fieldName}: 从 "${oldData[key]}" 修改为 "${newData[key]}"`);
                }
            }

            return changes.join('; ');
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
