<template>
    <div>
        <h3>当前零部件的物料编码为：{{ initialData.materialCode }}</h3>
        <div class="product-codes with-border">
            <label>产品代号:</label>
            <el-checkbox-group v-model="productCodes">
                <el-checkbox label="DC" style="margin-right: 5%;">DC</el-checkbox>
                <el-checkbox label="BDC">BDC</el-checkbox>
            </el-checkbox-group>
        </div>

        <div class="options-container">
            <div class="left-options">
                <div class="additional-options">
                    <label>引流-直径:</label>
                    <el-checkbox-group v-model="DCdrainDiameters">
                        <el-checkbox label="05" style="margin-right: 5%;">5F</el-checkbox>
                        <el-checkbox label="06" style="margin-right: 5%;">6F</el-checkbox>
                        <el-checkbox label="07" style="margin-right: 5%;">7F</el-checkbox>
                        <el-checkbox label="08" style="margin-right: 5%;">8F</el-checkbox>
                        <el-checkbox label="10" style="margin-right: 5%;">10F</el-checkbox>
                        <el-checkbox label="12" style="margin-right: 5%;">12F</el-checkbox>
                        <el-checkbox label="14" style="margin-right: 5%;">14F</el-checkbox>
                        <el-checkbox label="16">16F</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>引流-长度:</label>
                    <el-checkbox-group v-model="DCdrainLengths">
                        <el-checkbox label="20" style="margin-right: 10%;">20cm</el-checkbox>
                        <el-checkbox label="25" style="margin-right: 10%;">25cm</el-checkbox>
                        <el-checkbox label="30" style="margin-right: 10%;">30cm</el-checkbox>
                        <el-checkbox label="35" style="margin-right: 10%;">35cm</el-checkbox>
                        <el-checkbox label="40">40cm</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>引流-锁定形式:</label>
                    <el-checkbox-group v-model="DCdrainLockForms">
                        <el-checkbox label="L" style="margin-right: 35%;">L:可锁定型</el-checkbox>
                        <el-checkbox label="N">N:非锁定型</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>引流-头端样式:</label>
                    <el-checkbox-group v-model="DCdrainHeadStyles">
                        <el-checkbox label="J" style="margin-right: 41%;">J:J型</el-checkbox>
                        <el-checkbox label="P">P:猪尾型</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>引流-配置代号:</label>
                    <el-checkbox-group v-model="DCdrainConfigCodes">
                        <el-checkbox label="T" style="margin-right: 8%;">T型</el-checkbox>
                        <el-checkbox label="TP" style="margin-right: 8%;">TP型</el-checkbox>
                        <el-checkbox label="SA" style="margin-right: 8%;">SA型</el-checkbox>
                        <el-checkbox label="SAP" style="margin-right: 8%;">SAP型</el-checkbox>
                        <el-checkbox label="SB">SB型</el-checkbox>
                        <el-checkbox label="SBP">SBP型</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="right-options">
                <div class="additional-options">
                    <label>胆道-直径:</label>
                    <el-checkbox-group v-model="BDCdrainDiameters">
                        <el-checkbox label="06" style="margin-right: 13%;">6F</el-checkbox>
                        <el-checkbox label="07" style="margin-right: 13%;">7F</el-checkbox>
                        <el-checkbox label="08" style="margin-right: 13%;">8F</el-checkbox>
                        <el-checkbox label="10" style="margin-right: 13%;">10F</el-checkbox>
                        <el-checkbox label="12">12F</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>胆道-长度:</label>
                    <el-checkbox-group v-model="BDCdrainLengths">
                        <el-checkbox label="25" style="margin-right: 10%;">25cm</el-checkbox>
                        <el-checkbox label="30" style="margin-right: 10%;">30cm</el-checkbox>
                        <el-checkbox label="35" style="margin-right: 10%;">35cm</el-checkbox>
                        <el-checkbox label="40">40cm</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>胆道-引流方式:</label>
                    <el-checkbox-group v-model="BDCdrainMethods">
                        <el-checkbox label="None" style="margin-right: 10%;">无内容:内外引流</el-checkbox>
                        <el-checkbox label="W">W:外引流</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>胆道-头端样式:</label>
                    <el-checkbox-group v-model="BDCdrainHeadStyles">
                        <el-checkbox label="L" style="margin-right: 11%;">L:可锁定猪尾型</el-checkbox>
                        <el-checkbox label="N">N:非锁定猪尾型</el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="additional-options">
                    <label>胆道-配置代号:</label>
                    <el-checkbox-group v-model="BDCdrainConfigCodes">
                        <el-checkbox label="T" style="margin-right: 8%;">T型</el-checkbox>
                        <el-checkbox label="TP" style="margin-right: 8%;">TP型</el-checkbox>
                        <el-checkbox label="SA" style="margin-right: 8%;">SA型</el-checkbox>
                        <el-checkbox label="SAP" style="margin-right: 8%;">SAP型</el-checkbox>
                        <el-checkbox label="SB">SB型</el-checkbox>
                        <el-checkbox label="SBP">SBP型</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
        <div style="text-align: right; margin-top: 40px;">
            <el-button type="primary" style="width: 100px;" @click="handleConfirm">确定</el-button>
            <el-button style="width: 100px; margin-left: 10px;" @click="handleCancel">取消</el-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';
import dayjs from 'dayjs'; // 引入 dayjs

export default {
    props: {
        initialData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            productCodes: this.initialData.ProductCode ? this.initialData.ProductCode.split(',') : [],
            DCdrainDiameters: this.initialData.yinliuDiameter ? this.initialData.yinliuDiameter.split(',') : [],
            DCdrainLengths: this.initialData.yinliuLength ? this.initialData.yinliuLength.split(',') : [],
            DCdrainLockForms: this.initialData.yinliuLockStyle ? this.initialData.yinliuLockStyle.split(',') : [],
            DCdrainHeadStyles: this.initialData.yinliuHeadStyle ? this.initialData.yinliuHeadStyle.split(',') : [],
            DCdrainConfigCodes: this.initialData.yinliuConfigurationCode ? this.initialData.yinliuConfigurationCode.split(',') : [],
            BDCdrainDiameters: this.initialData.dandaoDiameter ? this.initialData.dandaoDiameter.split(',') : [],
            BDCdrainLengths: this.initialData.dandaoLength ? this.initialData.dandaoLength.split(',') : [],
            BDCdrainMethods: this.initialData.drainageMethod ? this.initialData.drainageMethod.split(',') : [],
            BDCdrainHeadStyles: this.initialData.dandaoHeadStyle ? this.initialData.dandaoHeadStyle.split(',') : [],
            BDCdrainConfigCodes: this.initialData.dandaoConfigurationCode ? this.initialData.dandaoConfigurationCode.split(',') : [],
            labelMap: {
                DC: 'DC',
                BDC: 'BDC',
                '05': '5F',
                '06': '6F',
                '07': '7F',
                '08': '8F',
                '10': '10F',
                '12': '12F',
                '14': '14F',
                '16': '16F',
                '20': '20cm',
                '25': '25cm',
                '30': '30cm',
                '35': '35cm',
                '40': '40cm',
                L: 'L:可锁定型',
                N: 'N:非锁定型',
                J: 'J:J型',
                P: 'P:猪尾型',
                T: 'T型',
                TP: 'TP型',
                SA: 'SA型',
                SAP: 'SAP型',
                SB: 'SB型',
                SBP: 'SBP型',
                None: '无内容:内外引流',
                W: 'W:外引流',
            },
            fieldMap: {
                ProductCode: '产品代号',
                yinliuDiameter: '引流-直径',
                yinliuLength: '引流-长度',
                yinliuLockStyle: '引流-锁定形式',
                yinliuHeadStyle: '引流-头端样式',
                yinliuConfigurationCode: '引流-配置代号',
                dandaoDiameter: '胆道-直径',
                dandaoLength: '胆道-长度',
                drainageMethod: '胆道-引流方式',
                dandaoHeadStyle: '胆道-头端样式',
                dandaoConfigurationCode: '胆道-配置代号',
            }
        };
    },
    created() {
        this.setDefaultSelection();
    },
    methods: {
        setDefaultSelection() {
            this.productCodes = this.initialData.ProductCode ? this.initialData.ProductCode.split(',') : [];
            this.DCdrainDiameters = this.initialData.yinliuDiameter ? this.initialData.yinliuDiameter.split(',') : [];
            this.DCdrainLengths = this.initialData.yinliuLength ? this.initialData.yinliuLength.split(',') : [];
            this.DCdrainLockForms = this.initialData.yinliuLockStyle ? this.initialData.yinliuLockStyle.split(',') : [];
            this.DCdrainHeadStyles = this.initialData.yinliuHeadStyle ? this.initialData.yinliuHeadStyle.split(',') : [];
            this.DCdrainConfigCodes = this.initialData.yinliuConfigurationCode ? this.initialData.yinliuConfigurationCode.split(',') : [];
            this.BDCdrainDiameters = this.initialData.dandaoDiameter ? this.initialData.dandaoDiameter.split(',') : [];
            this.BDCdrainLengths = this.initialData.dandaoLength ? this.initialData.dandaoLength.split(',') : [];
            this.BDCdrainMethods = this.initialData.drainageMethod ? this.initialData.drainageMethod.split(',') : [];
            this.BDCdrainHeadStyles = this.initialData.dandaoHeadStyle ? this.initialData.dandaoHeadStyle.split(',') : [];
            this.BDCdrainConfigCodes = this.initialData.dandaoConfigurationCode ? this.initialData.dandaoConfigurationCode.split(',') : [];
        },
        logOperation(operationType, operationContent) {
            const currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
            const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
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
                operation_type: operationType,
                operation_content: operationContent,
                operation_time: timestamp
            };

            // console.log('操作日志:', logPayload);

            axios.post(`${baseURL}/logsAdd`, logPayload)
                .then(response => {
                    // console.log('操作日志记录成功:', response.data);
                })
                .catch(error => {
                    console.error('操作日志记录失败:', error);
                });
        },
        handleConfirm() {
            const data = {
                id: this.initialData.id,
                ProductCode: this.productCodes.join(','),
                yinliuDiameter: this.DCdrainDiameters.join(','),
                yinliuLength: this.DCdrainLengths.join(','),
                yinliuLockStyle: this.DCdrainLockForms.join(','),
                yinliuHeadStyle: this.DCdrainHeadStyles.join(','),
                yinliuConfigurationCode: this.DCdrainConfigCodes.join(','),
                dandaoDiameter: this.BDCdrainDiameters.join(','),
                dandaoLength: this.BDCdrainLengths.join(','),
                drainageMethod: this.BDCdrainMethods.join(','),
                dandaoHeadStyle: this.BDCdrainHeadStyles.join(','),
                dandaoConfigurationCode: this.BDCdrainConfigCodes.join(','),
            };

            const initialData = {
                ProductCode: this.initialData.ProductCode,
                yinliuDiameter: this.initialData.yinliuDiameter,
                yinliuLength: this.initialData.yinliuLength,
                yinliuLockStyle: this.initialData.yinliuLockStyle,
                yinliuHeadStyle: this.initialData.yinliuHeadStyle,
                yinliuConfigurationCode: this.initialData.yinliuConfigurationCode,
                dandaoDiameter: this.initialData.dandaoDiameter,
                dandaoLength: this.initialData.dandaoLength,
                drainageMethod: this.initialData.drainageMethod,
                dandaoHeadStyle: this.initialData.dandaoHeadStyle,
                dandaoConfigurationCode: this.initialData.dandaoConfigurationCode,
            };

            const changes = {};

            for (const key in initialData) {
                if (initialData[key] !== data[key]) {
                    const from = initialData[key] ? initialData[key].split(',').map(item => this.labelMap[item]).join(',') : '';
                    const to = data[key] ? data[key].split(',').map(item => this.labelMap[item]).join(',') : '';
                    changes[key] = { from, to };
                }
            }

            if (Object.keys(changes).length > 0) {
                const url = `${baseURL}/conditionSet`;

                axios.put(url, data)
                    .then(response => {
                        let operationContent = `修改零部件物料编码${this.initialData.materialCode}的查询条件。`;
                        for (const key in changes) {
                            const fieldName = this.fieldMap[key];
                            operationContent += `${fieldName}从"${changes[key].from}"改为"${changes[key].to}"。`;
                        }
                        this.logOperation('edit', operationContent);
                        this.$emit('ConditionSetformSubmitted');
                        this.$emit('cancel');
                    })
                    .catch(error => {
                        console.error('Error sending PUT request', error);
                    });
            } else {
                // console.log('数据没有变化，不发送请求');
                this.$emit('cancel');
            }
        },
        handleCancel() {
            this.setDefaultSelection();
            this.$emit('cancel');
        }
    }
};
</script>

<style scoped>
.product-codes {
    margin-bottom: 10px;
}

.with-border {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}

.additional-options {
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
}

.options-container {
    display: flex;
    flex-direction: row;
}

.left-options {
    flex: 1;
    border-right: 1px solid #ccc;
    padding-right: 20px;
    /* 可以根据需要调整右边距 */
}

.right-options {
    flex: 1;
    padding-left: 20px;
}
</style>
