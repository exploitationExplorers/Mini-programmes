<template>
  <view class="discover-container">
    <view class="search-bar">
      <view class="search-box">
        <i class="fas fa-search"></i>
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="搜索好友、话题"
          placeholder-class="placeholder"
          @confirm="searchUsers"
        />
        <view v-if="searchKeyword" class="clear-btn" @click="searchKeyword = ''; loadRecommendedUsers()">
          <i class="fas fa-times"></i>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" refresher-enabled @refresherpulling="onPullDownRefresh">
      <!-- 人员推荐区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">为您推荐</text>
          <text class="section-more" @click="loadRecommendedUsers">刷新</text>
        </view>

        <view v-if="loading && users.length === 0" class="loading-container">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>

        <view v-else-if="users.length === 0" class="empty-container">
          <i class="far fa-user empty-icon"></i>
          <text>暂无推荐用户</text>
        </view>

        <scroll-view v-else scroll-x class="user-scroll">
          <view
            class="user-card"
            v-for="user in users"
            :key="user.id"
            @click="navigateToUserDetail(user.id)"
          >
            <view class="user-avatar">
              <image :src="user.avatar" mode="aspectFill"></image>
            </view>
            <view class="user-name">{{user.username}}</view>
            <view class="user-tag" v-if="user.tags && user.tags.length > 0">{{user.tags[0]}}</view>
            <button class="follow-btn" @click.stop="followUser(user.id)" :class="{ 'followed': isUserFollowed(user.id) }">
              {{ isUserFollowed(user.id) ? '已关注' : '关注' }}
            </button>
          </view>
        </scroll-view>
      </view>

      <!-- 活动区域 -->
      <view class="section">
        <view class="section-header">
          <text class="section-title">热门活动</text>
          <text class="section-more" @click="loadEvents">刷新</text>
        </view>

        <view v-if="loading && events.length === 0" class="loading-container">
          <view class="loading-spinner"></view>
          <text>加载中...</text>
        </view>

        <view v-else-if="events.length === 0" class="empty-container">
          <i class="far fa-calendar-alt empty-icon"></i>
          <text>暂无活动</text>
        </view>

        <view v-else class="event-list">
          <view
            class="event-card"
            v-for="event in events"
            :key="event.id"
            @click="navigateToEventDetail(event.id)"
          >
            <image class="event-image" :src="event.image" mode="aspectFill"></image>
            <view class="event-info">
              <view class="event-title">{{ event.title }}</view>
              <view class="event-desc">{{ event.description }}</view>
              <view class="event-meta">
                <text class="event-time">{{ event.time }}</text>
                <text class="event-location">{{ event.location }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mockApi } from '../../mock/index';
import type { Event } from '../../mock/events';
import type { User } from '../../mock/users';

const events = ref<Event[]>([]);
const users = ref<User[]>([]);
const loading = ref(false);
const searchKeyword = ref('');
const followedUsers = ref<number[]>([]); // 存储已关注用户的ID

// 加载活动数据
const loadEvents = async () => {
  loading.value = true;
  try {
    events.value = await mockApi.getEvents();
  } catch (error) {
    console.error('加载活动失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    uni.stopPullDownRefresh();
  }
};

// 加载推荐用户
const loadRecommendedUsers = async () => {


  loading.value = true;
  try {
    users.value = await mockApi.getRecommendedUsers();
  } catch (error) {
    console.error('加载推荐用户失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    uni.stopPullDownRefresh();
  }
};

// 搜索用户
const searchUsers = async () => {
  if (!searchKeyword.value.trim()) {
    await loadRecommendedUsers();
    return;
  }

  loading.value = true;
  try {
    users.value = await mockApi.searchUsers(searchKeyword.value);
  } catch (error) {
    console.error('搜索用户失败', error);
    uni.showToast({
      title: '搜索失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onPullDownRefresh = () => {
  loadEvents();
  loadRecommendedUsers();
};

// 跳转到用户详情
const navigateToUserDetail = (userId: number) => {
  uni.navigateTo({
    url: `/pages/profile/user-detail?id=${userId}`
  });
};

// 跳转到活动详情
const navigateToEventDetail = (eventId: number) => {
  uni.navigateTo({
    url: `/pages/discover/event-detail?id=${eventId}`
  });
};

// 关注用户
const followUser = (userId: number) => {
  // 检查用户是否已经关注
  const index = followedUsers.value.indexOf(userId);

  if (index === -1) {
    // 如果没有关注，则添加到关注列表
    followedUsers.value.push(userId);
    uni.showToast({
      title: '关注成功',
      icon: 'success',
      duration: 1500
    });
  } else {
    // 如果已经关注，则取消关注
    followedUsers.value.splice(index, 1);
    uni.showToast({
      title: '已取消关注',
      icon: 'none',
      duration: 1500
    });
  }

  // 实际应用中应该调用API来更新关注状态
  // 这里只是模拟前端状态变化
};

// 检查用户是否已关注
const isUserFollowed = (userId: number) => {
  return followedUsers.value.includes(userId);
};

onMounted(() => {
  loadEvents();
  loadRecommendedUsers();
});
</script>

<style lang="scss">
.discover-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); /* 减去tabbar高度 */
  background-color: #f8f9fa;

  .search-bar {
    padding: 20rpx 30rpx;
    background-color: #ffffff;

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
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
  }

  .content-scroll {
    flex: 1;

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40rpx 0;

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
      padding: 60rpx 0;

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

  .section {
    margin: 30rpx 0;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    margin: 20rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .section-more {
        font-size: 24rpx;
        color: #7668fa;
      }
    }
  }

  .user-scroll {
    white-space: nowrap;

    .user-card {
      display: inline-block;
      width: 150rpx;
      margin-right: 20rpx;
      text-align: center;

      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        margin: 0 auto;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .user-name {
        font-size: 26rpx;
        margin-top: 10rpx;
        color: #333;
      }

      .user-tag {
        font-size: 20rpx;
        color: #7668fa;
        background-color: rgba(118, 104, 250, 0.1);
        display: inline-block;
        padding: 4rpx 10rpx;
        border-radius: 8rpx;
        margin-top: 6rpx;
      }

      .follow-btn {
        margin-top: 10rpx;
        font-size: 22rpx;
        padding: 0;
        height: 50rpx;
        line-height: 50rpx;
        background-color: #7668fa;
        color: #ffffff;
        border-radius: 25rpx;
        transition: all 0.3s ease;

        &.followed {
          background-color: #f2f3f5;
          color: #666;
          border: 1px solid #e0e0e0;
        }
      }
    }
  }

  .event-list {
    .event-card {
      display: flex;
      margin-bottom: 20rpx;

      .event-image {
        width: 180rpx;
        height: 120rpx;
        border-radius: 8rpx;
        margin-right: 20rpx;
      }

      .event-info {
        flex: 1;

        .event-title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
        }

        .event-desc {
          font-size: 24rpx;
          color: #666;
          margin-bottom: 10rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }

        .event-meta {
          display: flex;

          .event-time, .event-location {
            font-size: 22rpx;
            color: #999;
            margin-right: 20rpx;
          }
        }
      }
    }
  }
}
</style>
