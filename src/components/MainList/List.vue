<template>
    <div id="app">
        <header>
            <h1><img src="/icon.png" alt="Your Image">BOM管理系统</h1>
        </header>
        <main>
            <nav>
                <ul>
                    <li :class="{ 'active': currentTab === 'productList' }"><a href="#"
                            @click="handleProductListClick">成品清单</a></li>
                    <li :class="{ 'active': currentTab === 'partsList' }"><a href="#"
                            @click="handlePartsListClick">零部件清单</a></li>
                    <li :class="{ 'active': currentTab === 'personList' }"><a href="#"
                            @click="handlePersonListClick">人员管理</a></li>
                    <li v-if="showOperationLogs" :class="{ 'active': currentTab === 'operationLogs' }"><a href="#"
                            @click="handleOperationLogsClick">操作日志</a></li>
                    <li :class="{ 'active': currentTab === 'userManual' }"><a href="#"
                            @click="handleUserManualClick">用户手册</a></li>
                </ul>
            </nav>
            <div class="content">
                <component :is="currentComponent"></component>
                <CustomSection v-if="showCustomSection" />
            </div>
        </main>
        <footer>
            <p>版权所有 &copy; 2024 南京康友医疗科技有限公司</p>
        </footer>
    </div>
</template>

<script>
import FinishedProducts from '../FinishedProducts/FinishedProducts.vue'
import PartsProducts from '../PartsProducts/PartsProducts.vue'
import PersonManage from '../PersonManage/PersonManage.vue'
import UserManual from '../UserManual/UserManual.vue'
import OperationLogs from '../OperationLogs/OperationLogs.vue' // 新增组件导入

export default {
    name: 'App',
    data() {
        return {
            currentComponent: 'FinishedProducts',
            currentTab: 'productList',
            showCustomSection: false,
            currentUserData: null,  // 新增用于存储用户数据的变量
            showOperationLogs: false // 用于控制操作日志标签显示的变量
        };
    },
    created() {
        const storedTab = localStorage.getItem('currentTab');
        if (storedTab) {
            this.currentTab = storedTab;
            // 根据选中的标签页设置当前组件
            this.setCurrentComponent(storedTab);
        }
        // 在组件创建时获取用户数据
        this.currentUserData = JSON.parse(sessionStorage.getItem('user_data'));
        // 判断是否显示操作日志标签
        if (this.currentUserData && (this.currentUserData.super_root || this.currentUserData.normal_root)) {
            this.showOperationLogs = true;
        }
    },
    components: {
        FinishedProducts,
        PartsProducts,
        PersonManage,
        UserManual,
        OperationLogs // 注册新组件
    },
    methods: {
        // 根据选中的标签页设置当前组件
        setCurrentComponent(tab) {
            switch (tab) {
                case 'productList':
                    this.currentComponent = 'FinishedProducts';
                    break;
                case 'partsList':
                    this.currentComponent = 'PartsProducts';
                    break;
                case 'personList':
                    this.currentComponent = 'PersonManage';
                    break;
                case 'operationLogs':
                    this.currentComponent = 'OperationLogs'; // 新增操作日志组件
                    break;
                case 'userManual':
                    this.currentComponent = 'UserManual';
                    break;
                default:
                    this.currentComponent = 'FinishedProducts';
            }
        },
        // 点击标签页时更新选中状态，并将其存储到本地存储中
        updateTab(tab) {
            this.currentTab = tab;
            localStorage.setItem('currentTab', tab);
            this.setCurrentComponent(tab);
        },
        // 点击事件处理逻辑
        handleProductListClick() {
            this.currentComponent = 'FinishedProducts';
            this.currentTab = 'productList';
            this.updateTab('productList');
        },
        handlePartsListClick() {
            this.currentComponent = 'PartsProducts';
            this.currentTab = 'partsList';
            this.updateTab('partsList');
        },
        handlePersonListClick() {
            this.currentComponent = 'PersonManage';
            this.currentTab = 'personList';
            this.updateTab('personList');
        },
        handleOperationLogsClick() {
            this.currentComponent = 'OperationLogs';
            this.currentTab = 'operationLogs';
            this.updateTab('operationLogs');
        },
        handleUserManualClick() {
            this.currentComponent = 'UserManual';
            this.currentTab = 'userManual';
            this.updateTab('userManual');
        }
    }
};
</script>

<style scoped>
#app {
    display: flex;
    flex-direction: column;
    min-height: 98vh;
    /* 设置最小高度为视口高度 */
}

header {
    background-image: linear-gradient(to right, #96cde8, #a7d4e9);
    /* background-color: #96cde8; */
    padding: 10px;
    text-align: left;
}

header h1 {
    color: rgb(0, 0, 0);
    font-size: 25px;
    margin: 0;
    display: flex;
    align-items: center;
}

header img {
    height: 60px;
    margin-right: 20px;
    pointer-events: none;
}

nav {
    background-image: linear-gradient(to right, #a7d4e9, #96cde8);
    padding: 10px;
}

nav ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-around;
}

nav li {
    margin: 0 5px;
}

nav a {
    display: block;
    color: white;
    text-align: center;
    padding: 10px 16px;
    text-decoration: none;
}

nav a:hover {
    background-color: #7db8e7;
    color: #ffffff;
    font-weight: bold;
}

nav .active a {
    background-color: #96cde8;
    /* Change the background color to a different shade of blue */
    color: #000000;
    /* Change the text color to white */
    font-weight: bold;
    border-radius: 5px;
    /* Add some border radius to make it look like a button */
}

main {
    flex: 1;
    /* 主要内容区域拉伸以填充剩余空间 */

}

section {
    margin-bottom: 20px;
}

footer {
    flex-shrink: 0;
    background-image: linear-gradient(to right, #7db8e7, #96cde8);
    /* 防止页脚缩小以适应内容 */
    background-color: #7db8e7;
    padding: 1px;
    text-align: center;
    color: white;
    font-size: 12px;
}

.content {
    min-height: 680px;
}
</style>
