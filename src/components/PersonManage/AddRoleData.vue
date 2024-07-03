<template>
    <el-form :model="formData" :rules="formRules" ref="form" label-width="120px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item label="设为管理员" prop="normal_root">
            <el-radio-group v-model="formData.normal_root" :disabled="isNormalRootDisabled">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="新增数据权限" prop="add_data_permission">
            <el-radio-group v-model="formData.add_data_permission">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="编辑数据权限" prop="edit_data_permission">
            <el-radio-group v-model="formData.edit_data_permission">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="删除数据权限" prop="delete_data_permission">
            <el-radio-group v-model="formData.delete_data_permission">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
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
                username: '',
                password: '',
                normal_root: 0,
                add_data_permission: 0,
                edit_data_permission: 0,
                delete_data_permission: 0
            },
            formRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: this.validatePassword, trigger: 'blur' }
                ],
                normal_root: [
                    { required: true, message: '请选择是否为管理员', trigger: 'change' }
                ],
                add_data_permission: [
                    { required: true, message: '请选择是否新增数据权限', trigger: 'change' }
                ],
                edit_data_permission: [
                    { required: true, message: '请选择是否编辑数据权限', trigger: 'change' }
                ],
                delete_data_permission: [
                    { required: true, message: '请选择是否删除数据权限', trigger: 'change' }
                ]
            },
            currentUserData: null,
            isNormalRootDisabled: false
        }
    },
    created() {
        this.currentUserData = JSON.parse(sessionStorage.getItem('user_data'))
        if (this.currentUserData && this.currentUserData.super_root === 0) {
            this.isNormalRootDisabled = true;
        }
    },
    watch: {
        'formData.username': function(newVal) {
            this.formData.username = newVal.trim();
        },
        'formData.password': function(newVal) {
            this.formData.password = newVal.trim();
        }
    },
    methods: {
        validatePassword(rule, value, callback) {
            const passwordPattern = /^[A-Za-z0-9!@#$%^&*()_+=-]+$/;
            if (!passwordPattern.test(value)) {
                callback(new Error('密码只可以为大小写字母、数字、字符'));
            } else {
                callback();
            }
        },
        handleConfirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 先检查用户名是否存在
                    const checkUrl = `${baseURL}/judgeUserName`;
                    axios.get(checkUrl, { params: { username: this.formData.username } })
                        .then(response => {
                            if (response.data === "True") {
                                this.$message.error('用户名已存在');
                            } else {
                                // 用户名不存在，继续提交表单
                                const url = `${baseURL}/roleAdd`;
                                axios.post(url, this.formData)
                                    .then(response => {
                                        this.logOperation(this.formData); // 日志记录
                                        this.$emit('AddRoleformSubmitted');
                                        this.handleCancel();
                                    })
                                    .catch(error => {
                                        console.error('表单数据提交失败', error);
                                    });
                            }
                        })
                        .catch(error => {
                            console.error('用户名检查失败', error);
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

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'add',
                operation_content: `新增用户，用户名为：${newData.username}。设为管理员：${newData.normal_root === 1 ? '是' : '否'}，新增数据权限：${newData.add_data_permission === 1 ? '是' : '否'}，编辑数据权限：${newData.edit_data_permission === 1 ? '是' : '否'}，删除数据权限：${newData.delete_data_permission === 1 ? '是' : '否'}`,
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
