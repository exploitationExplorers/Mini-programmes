<template>
  <view class="community-container">
    <view class="header">
      <view class="tab-bar">
        <view
          class="tab-item"
          :class="{ active: activeTab === 'all' }"
          @click="changeTab('all')"
        >
          全部
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'popular' }"
          @click="changeTab('popular')"
        >
          热门
        </view>
        <view
          class="tab-item"
          :class="{ active: activeTab === 'followed' }"
          @click="changeTab('followed')"
        >
          关注
        </view>
      </view>
      <view class="post-btn" @click="openPostPopup">
        <i class="fas fa-plus"></i>
        <text>发布</text>
      </view>
    </view>

    <scroll-view scroll-y class="post-list" @scrolltolower="loadMore" refresher-enabled @refresherpulling="onPullDownRefresh">
      <view v-if="loading && postList.length === 0" class="loading-container">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view class="post-item" v-for="post in postList" :key="post.id">
        <view class="post-header">
          <view class="user-info">
            <image class="avatar" :src="post.userAvatar" mode="aspectFill"></image>
            <view class="user-details">
              <view class="username">{{ post.username }}</view>
              <view class="post-time">{{ post.createTime }}</view>
            </view>
          </view>
          <view class="follow-btn" v-if="!post.isFollowed">关注</view>
          <view class="following-btn" v-else>已关注</view>
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

        <view class="post-actions">
          <view class="action-item" :class="{ 'active': post.likedBy.includes(1) }" @click="likePost(post)">
            <i :class="post.likedBy.includes(1) ? 'fas fa-heart' : 'far fa-heart'"></i>
            <text class="count">{{ post.likes }}</text>
          </view>
          <view class="action-item">
            <i class="far fa-comment"></i>
            <text class="count">{{ post.comments }}</text>
          </view>
          <view class="action-item">
            <i class="fas fa-share"></i>
            <text class="count">{{ post.shares }}</text>
          </view>
        </view>
      </view>

      <view v-if="loading && postList.length > 0" class="loading-more">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view v-if="!loading && !hasMore && postList.length > 0" class="no-more">
        <text>没有更多内容了</text>
      </view>
    </scroll-view>

    <uni-popup ref="popup" type="bottom" :is-mask-click="true" @change="popupChange">
      <view class="post-popup" v-if="showPostPopup">
        <view class="popup-header">
          <text class="cancel" @click="closePostPopup">取消</text>
          <text class="title">发布动态</text>
          <text class="publish" @click="publishPost">发布</text>
        </view>
        <view class="popup-content">
          <textarea
            class="post-textarea"
            placeholder="分享你的想法..."
            v-model="postContent"
            maxlength="200"
          ></textarea>
          <view class="attachment-buttons">
            <view class="attachment-btn">
              <i class="far fa-image"></i>
              <text>图片</text>
            </view>
            <view class="attachment-btn">
              <i class="fas fa-video"></i>
              <text>视频</text>
            </view>
            <view class="attachment-btn">
              <i class="fas fa-comments"></i>
              <text>话题</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { mockApi } from '../../mock/index';
import type { Post } from '../../mock/posts';

const activeTab = ref('all');
const postList = ref<Post[]>([]);
const showPostPopup = ref(false);
const postContent = ref('');
const popup = ref<InstanceType<typeof uniPopup> | null>(null);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);

// 加载帖子数据
const loadPosts = async (refresh = false) => {
  if (loading.value) return;
  loading.value = true;

  try {
    if (refresh) {
      page.value = 1;
    }

    const result = await mockApi.getPosts(activeTab.value, page.value);

    if (refresh) {
      postList.value = result.list;
    } else {
      postList.value = [...postList.value, ...result.list];
    }

    hasMore.value = result.hasMore;
    page.value++;
  } catch (error) {
    console.error('加载帖子失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    // 停止下拉刷新
    uni.stopPullDownRefresh();
  }
};

// 切换标签
const changeTab = (tab: string) => {
  if (activeTab.value === tab) return;
  activeTab.value = tab;
  loadPosts(true);
};

// 加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) return;
  loadPosts();
};

// 下拉刷新
const onPullDownRefresh = () => {
  loadPosts(true);
};

// 打开发布弹窗
const openPostPopup = () => {
  showPostPopup.value = true;
  popup.value?.open('bottom');
};

// 关闭发布弹窗
const closePostPopup = () => {
  popup.value?.close();
};

// 发布帖子
const publishPost = () => {
  if (postContent.value.trim()) {
    // 模拟发布帖子
    const newPost: Post = {
      id: Date.now(),
      userId: 1, // 当前用户ID
      username: '张小明', // 当前用户名
      userAvatar: '/static/default-avatar.png',
      content: postContent.value,
      images: [],
      tags: [],
      likes: 0,
      comments: 0,
      shares: 0,
      createTime: new Date().toLocaleString(),
      isFollowed: false,
      likedBy: []
    };

    // 添加到列表开头
    postList.value.unshift(newPost);

    uni.showToast({
      title: '发布成功',
      icon: 'success'
    });
    postContent.value = '';
    closePostPopup();
  } else {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    });
  }
};

// 点赞帖子
const likePost = (post: Post) => {
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

// 弹窗状态变化
const popupChange = (e: {show: boolean}) => {
  if (!e.show) {
    showPostPopup.value = false;
  }
};

onMounted(() => {
  console.log('社区页面已加载');
  loadPosts();
});
</script>

<style lang="scss">
.community-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px); /* 减去tabbar高度 */
  background-color: #f8f9fa;

  .header {
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #f0f0f0;

    .tab-bar {
      display: flex;
      align-items: center;

      .tab-item {
        padding: 0 30rpx;
        font-size: 30rpx;
        color: #666;
        position: relative;

        &.active {
          color: #7668fa;
          font-weight: bold;

          &::after {
            content: '';
            position: absolute;
            bottom: -10rpx;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 6rpx;
            background-color: #7668fa;
            border-radius: 3rpx;
          }
        }
      }
    }

    .post-btn {
      display: flex;
      align-items: center;
      background-color: #7668fa;
      color: #ffffff;
      padding: 10rpx 20rpx;
      border-radius: 30rpx;
      font-size: 26rpx;

      i {
        margin-right: 6rpx;
        font-size: 28rpx;
      }
    }
  }

  .post-list {
    flex: 1;
    padding: 20rpx;

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

    .loading-more {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30rpx 0;

      .loading-spinner {
        width: 40rpx;
        height: 40rpx;
        border: 3rpx solid #f3f3f3;
        border-top: 3rpx solid #7668fa;
        border-radius: 50%;
        margin-right: 10rpx;
        animation: spin 1s linear infinite;
      }

      text {
        font-size: 24rpx;
        color: #999;
      }
    }

    .no-more {
      text-align: center;
      padding: 30rpx 0;

      text {
        font-size: 24rpx;
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

  .post-item {
    margin-bottom: 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .user-info {
        display: flex;
        align-items: center;

        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }

        .user-details {
          .username {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
            margin-bottom: 6rpx;
          }

          .post-time {
            font-size: 24rpx;
            color: #999;
          }
        }
      }

      .follow-btn, .following-btn {
        padding: 6rpx 20rpx;
        border-radius: 30rpx;
        font-size: 24rpx;
      }

      .follow-btn {
        background-color: #7668fa;
        color: #ffffff;
      }

      .following-btn {
        background-color: #f2f3f5;
        color: #666;
      }
    }

    .post-content {
      margin-bottom: 20rpx;

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
          height: 200rpx;
          margin-right: 2%;
          margin-bottom: 10rpx;
          border-radius: 8rpx;

          &.single-image {
            width: 70%;
            height: 300rpx;
          }
        }
      }
    }

    .post-actions {
      display: flex;
      border-top: 1rpx solid #f0f0f0;
      padding-top: 20rpx;

      .action-item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
          font-size: 36rpx;
          color: #666;
          margin-right: 10rpx;
        }

        .count {
          font-size: 26rpx;
          color: #666;
        }

        &.active {
          i {
            color: #ff5151;
          }

          .count {
            color: #ff5151;
          }
        }
      }
    }
  }

  .post-popup {
    background-color: #ffffff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1rpx solid #f0f0f0;

      .cancel {
        font-size: 28rpx;
        color: #666;
      }

      .title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .publish {
        font-size: 28rpx;
        color: #7668fa;
        font-weight: bold;
      }
    }

    .popup-content {
      padding: 30rpx;

      .post-textarea {
        width: 100%;
        height: 300rpx;
        font-size: 28rpx;
        padding: 20rpx 0;
      }

      .attachment-buttons {
        display: flex;
        padding-top: 20rpx;

        .attachment-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 60rpx;

          i {
            font-size: 48rpx;
            color: #7668fa;
            margin-bottom: 10rpx;
          }

          text {
            font-size: 24rpx;
            color: #666;
          }
        }
      }
    }
  }
}
</style>
