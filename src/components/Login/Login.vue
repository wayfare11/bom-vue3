<template>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <div class="login-container">
        <form @submit.prevent="login" class="login-form">
            <div class="title-container">
                <img src="/icon.png" alt="icon" class="icon">
                <h2>欢迎使用BOM工具</h2>
            </div>
            <div class="input-group">
                <input type="text" id="username" v-model="username" required placeholder="请输入用户名">
            </div>
            <div class="input-group">
                <input type="password" id="password" v-model="password" required placeholder="请输入密码">
            </div>
            <div class="error-container">
                <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
            </div>
            <button type="submit" class="login-button">登录</button>
        </form>
    </div>
</template>


<script>
import axios from 'axios';
import { baseURL } from '../../globalVariables.js';

export default {
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        };
    },
    components: {
    },
    methods: {
        async login() {
            try {
                const url = `${baseURL}/login`
                const response = await axios.post(url, null, {
                    auth: {
                        username: this.username,
                        password: this.password
                    }
                });

                // 登录成功后
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('user_data', JSON.stringify(response.data[0]));

                this.$router.push('/list');
            } catch (error) {
                this.errorMessage = '用户名或密码错误';
            }
        }
    }
};
</script>

<style scoped>
.error-container {
    height: 10px;
    /* 设置固定高度 */
    width: 100%;
    /* 按需设置宽度 */
    display: flex;
    /* 使用flex布局以便于内容居中 */
    align-items: center;
    /* 垂直居中 */
    justify-content: flex-start;
    /* 水平居左 */
}

.error-message {
    font-size: 15px;
    color: red;
    text-align: left;
    margin-left: 10px;
    /* 其他样式，如字体大小、边距等 */
}

.title-container {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.title-container h2 {
    margin: 0;
    /* 清除默认的margin */
}

.icon {
    margin-right: 20px;
    width: 55px;
    height: 50px;
    border: solid rgb(205, 196, 196);
    padding: 5px;
    border-radius: 8px;
    pointer-events: none;
}

.login-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    background-image: url('/icon.png');
    background-size: 120%;
    background-repeat: no-repeat;
    background-position: center;
    background-color: rgba(0, 0, 0, 0.1);
}



.login-form {
    width: 30%;
    height: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
    margin-bottom: 50px;
}

.input-group {
    margin-bottom: 20px;
    /* 添加行间距 */
    width: 100%;
    text-align: left;
}

input {
    width: calc(100% - 20px);
    /* Adjusted width to account for padding and border */
    padding: 10px 10px;
    /* Adjusted padding */
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 20px;
}

.login-button:hover {
    background-color: #0056b3;
}

/* 在样式中添加针对手机端的媒体查询 */
@media screen and (max-width: 600px) {
    .icon {
        margin-right: 10px;
        width: 40px;
        height: 40px;
    }

    .login-container {
        background-size: 200%;
    }

    .login-form {
        width: 80%;
    }

    input {
        width: calc(100% - 15px);
        padding: 8px;
    }

    .login-button {
        padding: 8px;
    }
}
</style>
