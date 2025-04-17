<template>
  <view class="profile-container">
    <view class="user-header">
      <view class="blur-bg">
        <image src="/static/profile-bg.png" mode="aspectFill"></image>
      </view>
      <view v-if="loading && !currentUser" class="loading-container">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>
      <template v-else>
        <view class="user-info">
          <view class="avatar-container">
            <image class="avatar" :src="currentUser?.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
            <view class="edit-avatar">
              <i class="fas fa-camera"></i>
            </view>
          </view>
          <view class="user-details">
            <view class="username">{{ currentUser?.username || '用户名' }}</view>
            <view class="user-bio">{{ currentUser?.bio || '还没有个人简介' }}</view>
            <view class="user-tags">
              <view class="tag" v-for="(tag, index) in currentUser?.tags" :key="index">{{ tag }}</view>
            </view>
          </view>
        </view>
        <view class="user-stats">
          <view class="stat-item">
            <view class="stat-num">{{ currentUser?.following || 0 }}</view>
            <view class="stat-label">关注</view>
          </view>
          <view class="stat-item">
            <view class="stat-num">{{ currentUser?.followers || 0 }}</view>
            <view class="stat-label">粉丝</view>
          </view>
          <view class="stat-item">
            <view class="stat-num">{{ currentUser?.posts || 0 }}</view>
            <view class="stat-label">动态</view>
          </view>
        </view>
        <view class="edit-profile-btn" @click="navigateToEditProfile">
          编辑资料
        </view>
      </template>
    </view>

    <view class="content-tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'posts' }"
        @click="changeTab('posts')"
      >
        我的动态
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'likes' }"
        @click="changeTab('likes')"
      >
        我的点赞
      </view>
    </view>

    <scroll-view scroll-y class="content-list" refresher-enabled @refresherpulling="onPullDownRefresh">
      <view v-if="loading" class="loading-container">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <template v-else-if="activeTab === 'posts'">
        <view v-if="userPosts.length === 0" class="empty-container">
          <i class="far fa-file-alt empty-icon"></i>
          <text>还没有发布任何动态</text>
        </view>

        <view class="post-item" v-for="post in userPosts" :key="post.id">
          <view class="post-content">
            <view class="post-text">
              {{ post.content }}
              <text v-for="(tag, index) in post.tags" :key="index" class="post-tag">#{{ tag }} </text>
            </view>
            <view class="post-images" v-if="post.images && post.images.length > 0">
              <image
                class="post-image"
                :class="{ 'single-image': post.images.length === 1 }"
                v-for="(image, index) in post.images"
                :key="index"
                :src="image"
                mode="aspectFill"
              ></image>
            </view>
          </view>
          <view class="post-footer">
            <view class="post-time">{{ post.createTime }}</view>
            <view class="post-actions">
              <view class="action-item" :class="{ 'active': post.likedBy.includes(1) }" @click="likePost(post, true)">
                <i :class="post.likedBy.includes(1) ? 'fas fa-heart' : 'far fa-heart'"></i>
                <text class="count">{{ post.likes }}</text>
              </view>
              <view class="action-item">
                <i class="far fa-comment"></i>
                <text class="count">{{ post.comments }}</text>
              </view>
            </view>
          </view>
        </view>
      </template>

      <template v-else>
        <view v-if="likedPosts.length === 0" class="empty-container">
          <i class="far fa-heart empty-icon"></i>
          <text>还没有点赞任何内容</text>
        </view>

        <view class="post-item" v-for="post in likedPosts" :key="post.id">
          <view class="post-header">
            <view class="user-info">
              <image class="avatar" :src="post.userAvatar" mode="aspectFill"></image>
              <text class="username">{{ post.username }}</text>
            </view>
          </view>
          <view class="post-content">
            <view class="post-text">
              {{ post.content }}
              <text v-for="(tag, index) in post.tags" :key="index" class="post-tag">#{{ tag }} </text>
            </view>
            <view class="post-images" v-if="post.images && post.images.length > 0">
              <image
                class="post-image"
                :class="{ 'single-image': post.images.length === 1 }"
                v-for="(image, index) in post.images"
                :key="index"
                :src="image"
                mode="aspectFill"
              ></image>
            </view>
          </view>
          <view class="post-footer">
            <view class="post-time">{{ post.createTime }}</view>
            <view class="post-actions">
              <view class="action-item" :class="{ 'active': post.likedBy.includes(1) }" @click="likePost(post, false)">
                <i :class="post.likedBy.includes(1) ? 'fas fa-heart' : 'far fa-heart'"></i>
                <text class="count">{{ post.likes }}</text>
              </view>
              <view class="action-item">
                <i class="far fa-comment"></i>
                <text class="count">{{ post.comments }}</text>
              </view>
            </view>
          </view>
        </view>
      </template>
    </scroll-view>

    <view class="bottom-menu">
      <view class="menu-item" @click="showSettingActionSheet">
        <i class="fas fa-cog"></i>
        <text>设置</text>
      </view>
      <view class="menu-item" @click="showFeedbackActionSheet">
        <i class="fas fa-bullhorn"></i>
        <text>反馈</text>
      </view>
      <view class="menu-item" @click="navigateToHelp">
        <i class="far fa-question-circle"></i>
        <text>帮助</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { mockApi } from '../../mock/index';
import type { Post } from '../../mock/posts';
import type { User } from '../../mock/users';

const activeTab = ref('posts');
const userPosts = ref<Post[]>([]);
const likedPosts = ref<Post[]>([]);
const currentUser = ref<User | null>(null);
const loading = ref(false);

// 加载当前用户信息
const loadUserInfo = async () => {
  loading.value = true;
  try {
    // 模拟当前用户ID为1
    currentUser.value = await mockApi.getUserById(1);
  } catch (error) {
    console.error('加载用户信息失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};

// 加载用户发布的帖子
const loadUserPosts = async () => {
  loading.value = true;
  try {
    userPosts.value = await mockApi.getUserPosts(1); // 当前用户ID为1
  } catch (error) {
    console.error('加载用户帖子失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    uni.stopPullDownRefresh();
  }
};

// 加载用户点赞的帖子
const loadLikedPosts = async () => {
  loading.value = true;
  try {
    likedPosts.value = await mockApi.getLikedPosts(1); // 当前用户ID为1
  } catch (error) {
    console.error('加载点赞帖子失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    uni.stopPullDownRefresh();
  }
};

// 切换标签
const changeTab = (tab: string) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;

  if (tab === 'posts') {
    loadUserPosts();
  } else {
    loadLikedPosts();
  }
};

// 下拉刷新
const onPullDownRefresh = () => {
  if (activeTab.value === 'posts') {
    loadUserPosts();
  } else {
    loadLikedPosts();
  }
};

// 点赞帖子
const likePost = (post: Post, isUserPost: boolean) => {
  const postList = isUserPost ? userPosts : likedPosts;
  const index = postList.value.findIndex(p => p.id === post.id);

  if (index !== -1) {
    const isLiked = post.likedBy.includes(1); // 1是当前用户ID

    if (isLiked) {
      // 取消点赞
      postList.value[index].likes--;
      postList.value[index].likedBy = post.likedBy.filter(id => id !== 1);
    } else {
      // 点赞
      postList.value[index].likes++;
      postList.value[index].likedBy.push(1);
    }
  }
};

const navigateToEditProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/edit-profile'
  });
};

const navigateToHelp = () => {
  uni.navigateTo({
    url: '/pages/profile/help-center'
  });
};

const showSettingActionSheet = () => {
  uni.showActionSheet({
    itemList: ['账号与安全', '隐私设置', '通知设置', '辅助功能', '关于我们', '退出登录'],
    success: (res) => {
      console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
      // 根据选择项进行相应处理
      if (res.tapIndex === 5) {
        // 退出登录
        uni.showModal({
          title: '提示',
          content: '确定要退出登录吗？',
          success: (res) => {
            if (res.confirm) {
              console.log('用户点击确定');
              // 执行退出登录逻辑
            }
          }
        });
      }
    }
  });
};

const showFeedbackActionSheet = () => {
  uni.showActionSheet({
    itemList: ['功能反馈', '问题反馈', '联系客服'],
    success: (res) => {
      console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
      // 根据选择处理相应的反馈类型
    }
  });
};

onMounted(() => {
  loadUserInfo();
  loadUserPosts();
});
</script>

<style lang="scss">
.profile-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); /* 减去tabbar高度 */
  background-color: #f8f9fa;

  .user-header {
    position: relative;
    padding: 40rpx 30rpx 30rpx;
    background-color: #ffffff;

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60rpx 0;
      position: relative;
      z-index: 1;

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

    .blur-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 240rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
        filter: blur(10px);
        opacity: 0.7;
        transform: scale(1.1);
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(118, 104, 250, 0.6), #ffffff);
      }
    }

    .user-info {
      position: relative;
      display: flex;
      padding-top: 60rpx;
      z-index: 1;

      .avatar-container {
        position: relative;
        margin-right: 30rpx;

        .avatar {
          width: 150rpx;
          height: 150rpx;
          border-radius: 50%;
          border: 4rpx solid #ffffff;
        }

        .edit-avatar {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 50rpx;
          height: 50rpx;
          background-color: #7668fa;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            color: #ffffff;
            font-size: 30rpx;
          }
        }
      }

      .user-details {
        flex: 1;

        .username {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 10rpx;
        }

        .user-bio {
          font-size: 28rpx;
          color: #666;
          margin-bottom: 16rpx;
          line-height: 1.4;
        }

        .user-tags {
          display: flex;
          flex-wrap: wrap;

          .tag {
            font-size: 24rpx;
            color: #7668fa;
            background-color: rgba(118, 104, 250, 0.1);
            padding: 4rpx 16rpx;
            border-radius: 20rpx;
            margin-right: 16rpx;
            margin-bottom: 10rpx;
          }
        }
      }
    }

    .user-stats {
      display: flex;
      margin-top: 40rpx;
      position: relative;
      z-index: 1;

      .stat-item {
        flex: 1;
        text-align: center;

        .stat-num {
          font-size: 36rpx;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          font-size: 24rpx;
          color: #666;
          margin-top: 6rpx;
        }
      }
    }

    .edit-profile-btn {
      margin-top: 30rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      border-radius: 35rpx;
      background-color: #f2f3f5;
      color: #333;
      font-size: 28rpx;
      position: relative;
      z-index: 1;
    }
  }

  .content-tabs {
    display: flex;
    height: 100rpx;
    background-color: #ffffff;
    margin-top: 20rpx;

    .tab-item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
      color: #666;
      position: relative;

      &.active {
        color: #7668fa;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          width: 60rpx;
          height: 6rpx;
          background-color: #7668fa;
          border-radius: 3rpx;
        }
      }
    }
  }

  .content-list {
    flex: 1;
    padding: 20rpx;
  }

  .post-item {
    margin-bottom: 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .post-header {
      margin-bottom: 20rpx;

      .user-info {
        display: flex;
        align-items: center;

        .avatar {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .username {
          font-size: 28rpx;
          color: #333;
          font-weight: bold;
        }
      }
    }

    .post-content {
      .post-text {
        font-size: 28rpx;
        color: #333;
        line-height: 1.6;
        margin-bottom: 20rpx;
      }

      .post-images {
        display: flex;
        flex-wrap: wrap;

        .post-image {
          width: 31%;
          height: 180rpx;
          margin-right: 2%;
          margin-bottom: 10rpx;
          border-radius: 8rpx;
        }
      }
    }

    .post-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      .post-time {
        font-size: 24rpx;
        color: #999;
      }

      .post-actions {
        display: flex;

        .action-item {
          display: flex;
          align-items: center;
          margin-left: 30rpx;

          i {
            font-size: 32rpx;
            color: #666;
            margin-right: 8rpx;
          }

          &.active {
            i {
              color: #7668fa;
            }

            .count {
              color: #7668fa;
            }
          }

          .count {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }

  .content-list {
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

    .post-tag {
      color: #7668fa;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  .bottom-menu {
    display: flex;
    padding: 20rpx 0;
    background-color: #ffffff;
    border-top: 1rpx solid #f0f0f0;

    .menu-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      i {
        font-size: 44rpx;
        color: #666;
        margin-bottom: 10rpx;
      }

      text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}
</style>
