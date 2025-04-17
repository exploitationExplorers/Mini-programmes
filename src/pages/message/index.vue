<template>
  <view class="message-container">
    <view class="message-tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'chat' }"
        @click="changeTab('chat')"
      >
        聊天
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'notification' }"
        @click="changeTab('notification')"
      >
        通知
      </view>
    </view>

    <view class="search-box">
      <i class="fas fa-search"></i>
      <input
        type="text"
        v-model="searchKeyword"
        placeholder="搜索聊天内容"
        placeholder-class="placeholder"
        @confirm="searchMessages"
      />
      <view v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''; loadMessages()">
        <i class="fas fa-times"></i>
      </view>
    </view>

    <scroll-view scroll-y class="message-list">
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <template v-else-if="activeTab === 'chat'">
        <view v-if="messages.length === 0" class="empty-container">
          <i class="far fa-comment-dots empty-icon"></i>
          <text>暂无消息</text>
        </view>

        <view
          class="message-item"
          v-for="message in messages"
          :key="message.id"
          @click="navigateToChat(message)"
        >
          <view class="avatar">
            <image :src="message.avatar" mode="aspectFill"></image>
            <view class="badge" v-if="message.unread > 0">{{message.unread}}</view>
          </view>
          <view class="content">
            <view class="top-row">
              <text class="name">{{message.username}}</text>
              <text class="time">{{message.time}}</text>
            </view>
            <view class="bottom-row">
              <text class="last-message">{{message.lastMessage}}</text>
            </view>
          </view>
        </view>
      </template>

      <template v-else>
        <view v-if="notifications.length === 0" class="empty-container">
          <i class="far fa-bell empty-icon"></i>
          <text>暂无通知</text>
        </view>

        <view
          class="notification-item"
          v-for="notification in notifications"
          :key="notification.id"
          :class="{ 'unread': !notification.isRead }"
        >
          <view class="avatar">
            <image :src="notification.avatar" mode="aspectFill"></image>
          </view>
          <view class="content">
            <view class="notification-content">
              <text class="name" v-if="notification.username">{{notification.username}}</text>
              <text class="name" v-else>系统通知</text>
              <text class="notification-text">{{notification.content}}</text>
            </view>
            <view class="notification-time">{{notification.time}}</view>
          </view>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mockApi } from '../../mock/index';
import type { Message } from '../../mock/messages';
import type { Notification } from '../../mock/notifications';

const activeTab = ref('chat');
const messages = ref<Message[]>([]);
const notifications = ref<Notification[]>([]);
const loading = ref(false);
const searchKeyword = ref('');

// 加载消息数据
const loadMessages = async () => {
  loading.value = true;
  try {
    messages.value = await mockApi.getMessages();
  } catch (error) {
    console.error('加载消息失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 加载通知数据
const loadNotifications = async () => {
  loading.value = true;
  try {
    notifications.value = await mockApi.getNotifications();
  } catch (error) {
    console.error('加载通知失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 搜索消息
const searchMessages = async () => {
  if (!searchKeyword.value.trim()) {
    await loadMessages();
    return;
  }

  loading.value = true;
  try {
    messages.value = await mockApi.searchMessages(searchKeyword.value);
  } catch (error) {
    console.error('搜索消息失败', error);
    uni.showToast({
      title: '搜索失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 切换标签
const changeTab = (tab: string) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;

  if (tab === 'chat') {
    loadMessages();
  } else {
    loadNotifications();
  }
};

// 跳转到聊天详情页
const navigateToChat = (message: Message) => {
  uni.navigateTo({
    url: `/pages/message/chat-detail?id=${message.id}&username=${message.username}`
  });
};

onMounted(() => {
  loadMessages();
});
</script>

<style lang="scss">
.message-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); /* 减去tabbar高度 */
  background-color: #f8f9fa;

  .message-tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #f0f0f0;

    .tab-item {
      position: relative;
      padding: 0 40rpx;
      font-size: 32rpx;
      color: #666;
      line-height: 100rpx;

      &.active {
        color: #7668fa;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60rpx;
          height: 6rpx;
          background-color: #7668fa;
          border-radius: 3rpx;
        }
      }
    }
  }

  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    margin: 20rpx;
    background-color: #f2f3f5;
    border-radius: 36rpx;
    padding: 10rpx 20rpx;

    i {
      margin-right: 10rpx;
      font-size: 32rpx;
      color: #999;
    }

    input {
      flex: 1;
      height: 60rpx;
      font-size: 28rpx;
      padding-right: 40rpx;
    }

    .placeholder {
      color: #999;
    }

    .clear-btn {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        margin: 0;
        font-size: 24rpx;
      }
    }
  }

  .message-list {
    flex: 1;
    padding: 0 20rpx;

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60rpx 0;

      .loading-spinner {
        width: 60rpx;
        height: 60rpx;
        border: 4rpx solid #f3f3f3;
        border-top: 4rpx solid #7668fa;
        border-radius: 50%;
        margin-bottom: 20rpx;
        animation: spin 1s linear infinite;
      }

      text {
        font-size: 28rpx;
        color: #999;
      }
    }

    .empty-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100rpx 0;

      .empty-icon {
        font-size: 80rpx;
        color: #ccc;
        margin-bottom: 20rpx;
      }

      text {
        font-size: 28rpx;
        color: #999;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  .message-item {
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    .avatar {
      position: relative;
      width: 100rpx;
      height: 100rpx;
      margin-right: 20rpx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .badge {
        position: absolute;
        top: -8rpx;
        right: -8rpx;
        min-width: 36rpx;
        height: 36rpx;
        line-height: 36rpx;
        text-align: center;
        background-color: #ff5151;
        color: #ffffff;
        border-radius: 18rpx;
        font-size: 20rpx;
        padding: 0 6rpx;
      }
    }

    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .top-row {
        display: flex;
        justify-content: space-between;

        .name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
        }

        .time {
          font-size: 24rpx;
          color: #999;
        }
      }

      .bottom-row {
        .last-message {
          font-size: 28rpx;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .notification-item {
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;

    &.unread {
      background-color: rgba(118, 104, 250, 0.05);
    }

    .avatar {
      width: 100rpx;
      height: 100rpx;
      margin-right: 20rpx;

      image {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .content {
      flex: 1;
      display: flex;
      justify-content: space-between;

      .notification-content {
        flex: 1;

        .name {
          font-size: 30rpx;
          font-weight: bold;
          color: #333;
          display: block;
          margin-bottom: 10rpx;
        }

        .notification-text {
          font-size: 28rpx;
          color: #666;
          line-height: 1.4;
        }
      }

      .notification-time {
        font-size: 24rpx;
        color: #999;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
