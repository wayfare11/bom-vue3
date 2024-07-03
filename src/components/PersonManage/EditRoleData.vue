<template>
    <el-form :model="formData" :rules="formRules" ref="form" label-width="120px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" disabled></el-input>
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
    props: {
        rowData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            formData: {
                role_id: this.rowData.id,
                username: this.rowData.username,
                password: this.rowData.password,
                normal_root: this.rowData.normal_root,
                add_data_permission: this.rowData.add_data_permission,
                edit_data_permission: this.rowData.edit_data_permission,
                delete_data_permission: this.rowData.delete_data_permission
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
            isNormalRootDisabled: false,
            fieldMap: {
                username: '用户名',
                password: '密码',
                normal_root: '设为管理员',
                add_data_permission: '新增数据权限',
                edit_data_permission: '编辑数据权限',
                delete_data_permission: '删除数据权限'
            }
        }
    },
    created() {
        this.currentUserData = JSON.parse(sessionStorage.getItem('user_data'))
        if (this.currentUserData && this.currentUserData.super_root === 0) {
            this.isNormalRootDisabled = true;
        }
    },
    watch: {
        rowData: {
            immediate: true,
            handler(newData) {
                this.updateFormData(newData);
            }
        }
    },
    methods: {
        updateFormData(data) {
            this.formData = {
                role_id: data.id,
                username: data.username,
                password: data.password,
                normal_root: data.normal_root,
                add_data_permission: data.add_data_permission,
                edit_data_permission: data.edit_data_permission,
                delete_data_permission: data.delete_data_permission
            };
        },
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
                    const url = `${baseURL}/roleEdit`
                    axios.put(url, this.formData)
                        .then(response => {
                            this.$emit('EditRoleformSubmitted');
                            this.logOperation(this.formData); // 日志记录
                            this.handleCancel();
                        })
                        .catch(error => {
                            console.error('表单数据提交失败', error);
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

            const changes = this.getChanges(newData, this.rowData);

            const logPayload = {
                user_name: currentUserData.username,
                user_identity: user_identity,
                operation_type: 'edit',
                operation_content: `编辑用户，用户名为：${this.formData.username}。修改内容：${changes}`,
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
        getChanges(newData, oldData) {
            let changes = [];
            const mapValueToText = (key, value) => {
                if (['normal_root', 'add_data_permission', 'edit_data_permission', 'delete_data_permission'].includes(key)) {
                    return value === 1 ? '是' : '否';
                }
                return value;
            };

            for (let key in newData) {
                if (key !== 'password' && key !== 'role_id' && newData[key] !== oldData[key]) { // 排除密码和role_id字段
                    const fieldName = this.fieldMap[key] || key;
                    const oldValue = mapValueToText(key, oldData[key]);
                    const newValue = mapValueToText(key, newData[key]);
                    changes.push(`${fieldName}: 从 "${oldValue}" 修改为 "${newValue}"`);
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
