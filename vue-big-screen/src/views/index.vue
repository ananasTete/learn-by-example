<template>
  <div class="layout-container">
    <el-container>
      <!-- 顶部区域 -->
      <el-header class="header">
        <el-space>
          <el-button type="primary" @click="toggleLeftSidebar"> 左侧 </el-button>
          <el-button type="primary" @click="toggleRightSidebar"> 右侧 </el-button>
        </el-space>
      </el-header>

      <!-- 内容区域 -->
      <el-container class="main-container">
        <!-- 左侧边栏 -->
        <el-aside :width="leftCollapse ? '0px' : '200px'" class="aside left-aside">
          <Left />
        </el-aside>

        <!-- 中间内容 -->
        <el-main class="bg-gray-200"> 
          <Content />
        </el-main>

        <!-- 右侧边栏 -->
        <el-aside :width="rightCollapse ? '0px' : '300px'" class="aside right-aside"> </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Left from './components/left/index.vue';
import Content from './components/content/index.vue';

// 控制侧边栏折叠状态
const leftCollapse = ref(false);
const rightCollapse = ref(false);

// 切换左侧边栏状态
const toggleLeftSidebar = () => {
  leftCollapse.value = !leftCollapse.value;
};

// 切换右侧边栏状态
const toggleRightSidebar = () => {
  rightCollapse.value = !rightCollapse.value;
};
</script>

<style lang="less" scoped>
.layout-container {
  width: 100%;
  height: 100vh;

  .header {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    padding: 0 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .main-container {
    height: calc(100vh - 60px);

    .aside {
      background-color: #f9fafb;
      transition: width 0.3s;
      overflow: hidden;

      &.left-aside {
        border-right: 1px solid #e5e7eb;
      }

      &.right-aside {
        border-left: 1px solid #e5e7eb;
      }
    }

    .main-content {
      background-color: #ffffff;
    }
  }
}
</style>
