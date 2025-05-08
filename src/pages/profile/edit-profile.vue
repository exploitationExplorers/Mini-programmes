<template>
  <view class="edit-profile-container">
    <!-- 头部 -->
    <view class="header">
      <view class="avatar-section">
        <view class="avatar-container">
          <image class="avatar" :src="userForm.avatar || '/static/default-avatar.png'" mode="aspectFill"></image>
          <view class="edit-avatar" @click="chooseAvatar">
            <i class="fas fa-camera"></i>
          </view>
        </view>
        <text class="avatar-hint">点击更换头像</text>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-item">
        <text class="label">用户名</text>
        <input
          type="text"
          v-model="userForm.username"
          placeholder="请输入用户名"
          maxlength="20"
          class="input"
        />
      </view>

      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea
          v-model="userForm.bio"
          placeholder="介绍一下自己吧..."
          maxlength="100"
          class="textarea"
        />
        <text class="char-count">{{ userForm.bio.length }}/100</text>
      </view>

      <view class="form-item">
        <text class="label">标签</text>
        <view class="tags-container">
          <view
            class="tag"
            v-for="(tag, index) in userForm.tags"
            :key="index"
          >
            <text>{{ tag }}</text>
            <text class="delete-tag" @click="removeTag(index)">×</text>
          </view>

          <view class="add-tag" @click="showAddTagModal" v-if="userForm.tags.length < 5">
            <i class="fas fa-plus"></i>
          </view>
        </view>
        <text class="tags-hint">最多添加5个标签</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-buttons">
      <button class="cancel-btn" @click="cancel">取消</button>
      <button class="save-btn" @click="saveProfile" :disabled="saving">
        {{ saving ? '保存中...' : '保存' }}
      </button>
    </view>

    <!-- 添加标签弹窗 -->
    <view class="tag-modal" v-if="showTagModal">
      <view class="modal-mask" @click="hideAddTagModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">添加标签</text>
          <text class="modal-close" @click="hideAddTagModal">×</text>
        </view>
        <view class="modal-body">
          <input
            type="text"
            v-model="newTag"
            placeholder="输入标签名称（最多6个字）"
            maxlength="6"
            class="tag-input"
            @confirm="addTag"
          />
          <view class="suggested-tags">
            <text class="suggested-title">推荐标签</text>
            <view class="suggested-tag-list">
              <view
                class="suggested-tag"
                v-for="(tag, index) in suggestedTags"
                :key="index"
                @click="selectSuggestedTag(tag)"
              >
                {{ tag }}
              </view>
            </view>
          </view>
        </view>
        <view class="modal-footer">
          <button class="cancel-btn" @click="hideAddTagModal">取消</button>
          <button class="confirm-btn" @click="addTag" :disabled="!newTag.trim()">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { mockApi } from '../../mock/index';
import type { User } from '../../mock/users';

// 用户表单数据
const userForm = reactive({
  id: 1, // 当前用户ID
  username: '',
  avatar: '',
  bio: '',
  tags: [] as string[]
});

// 状态变量
const saving = ref(false);
const showTagModal = ref(false);
const newTag = ref('');

// 推荐标签
const suggestedTags = [
  '听障', '视障', '手语', '程序员', '教师', '学生',
  '音乐', '摄影', '绘画', '运动', '旅行', '美食',
  '志愿者', '90后', '00后', '科技', '文学', '电影'
];

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const user = await mockApi.getUserById(userForm.id);
    if (user) {
      userForm.username = user.username;
      userForm.avatar = user.avatar;
      userForm.bio = user.bio;
      userForm.tags = [...user.tags]; // 复制数组，避免直接引用
    }
  } catch (error) {
    console.error('加载用户信息失败', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none'
    });
  }
};

// 选择头像
const chooseAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      userForm.avatar = res.tempFilePaths[0];
    }
  });
};

// 显示添加标签弹窗
const showAddTagModal = () => {
  showTagModal.value = true;
  newTag.value = '';
};

// 隐藏添加标签弹窗
const hideAddTagModal = () => {
  showTagModal.value = false;
};

// 添加标签
const addTag = () => {
  const tag = newTag.value.trim();
  if (tag && !userForm.tags.includes(tag) && userForm.tags.length < 5) {
    userForm.tags.push(tag);
    hideAddTagModal();
  } else if (userForm.tags.includes(tag)) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none'
    });
  }
};

// 选择推荐标签
const selectSuggestedTag = (tag: string) => {
  if (!userForm.tags.includes(tag) && userForm.tags.length < 5) {
    userForm.tags.push(tag);
    hideAddTagModal();
  } else if (userForm.tags.includes(tag)) {
    uni.showToast({
      title: '标签已存在',
      icon: 'none'
    });
  }
};

// 移除标签
const removeTag = (index: number) => {
  userForm.tags.splice(index, 1);
};

// 保存个人资料
const saveProfile = async () => {
  // 表单验证
  if (!userForm.username.trim()) {
    uni.showToast({
      title: '用户名不能为空',
      icon: 'none'
    });
    return;
  }

  saving.value = true;
  console.log('准备保存用户信息:', userForm);

  try {
    // 调用API更新用户信息
    const userData = {
      username: userForm.username,
      avatar: userForm.avatar,
      bio: userForm.bio,
      tags: userForm.tags
    };

    console.log('发送更新请求:', userData);
    const updatedUser = await mockApi.updateUserProfile(userForm.id, userData);

    if (updatedUser) {
      console.log('更新成功，返回的用户数据:', updatedUser);
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });

      // 设置全局变量，标记需要刷新
      const app = getApp();
      if (app) {
        app.globalData = app.globalData || {};
        app.globalData.needRefreshUserInfo = true;
      }

      // 延迟返回，让用户看到成功提示
    //   setTimeout(() => {
    //     uni.navigateBack();
    //   }, 1500);
    }
  } catch (error) {
    console.error('保存失败', error);
    uni.showToast({
      title: '保存失败，请重试',
      icon: 'none'
    });
  } finally {
    saving.value = false;
  }
};

// 取消编辑
const cancel = () => {
  uni.navigateBack();
};

// 页面加载时获取用户信息
onMounted(() => {
  loadUserInfo();
});
</script>

<style lang="scss">
.edit-profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;

  .header {
    padding: 40rpx 0;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;

      .avatar-container {
        position: relative;
        margin-bottom: 20rpx;

        .avatar {
          width: 180rpx;
          height: 180rpx;
          border-radius: 50%;
          border: 4rpx solid #f0f0f0;
        }

        .edit-avatar {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 60rpx;
          height: 60rpx;
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

      .avatar-hint {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .form-section {
    background-color: #ffffff;
    padding: 0 30rpx;

    .form-item {
      position: relative;
      padding: 30rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 28rpx;
        color: #333;
        font-weight: bold;
        margin-bottom: 20rpx;
        display: block;
      }

      .input {
        width: 100%;
        height: 80rpx;
        font-size: 28rpx;
        color: #333;
      }

      .textarea {
        width: 100%;
        height: 180rpx;
        font-size: 28rpx;
        color: #333;
        line-height: 1.5;
      }

      .char-count {
        position: absolute;
        right: 0;
        bottom: 30rpx;
        font-size: 24rpx;
        color: #999;
      }

      .tags-container {
        display: flex;
        flex-wrap: wrap;

        .tag {
          display: flex;
          align-items: center;
          background-color: rgba(118, 104, 250, 0.1);
          color: #7668fa;
          font-size: 24rpx;
          padding: 10rpx 20rpx;
          border-radius: 30rpx;
          margin-right: 20rpx;
          margin-bottom: 20rpx;

          .delete-tag {
            margin-left: 10rpx;
            font-size: 28rpx;
            color: #7668fa;
          }
        }

        .add-tag {
          width: 80rpx;
          height: 50rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1rpx dashed #7668fa;
          border-radius: 30rpx;
          margin-bottom: 20rpx;

          i {
            font-size: 24rpx;
            color: #7668fa;
          }
        }
      }

      .tags-hint {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
        display: block;
      }
    }
  }

  .bottom-buttons {
    display: flex;
    padding: 40rpx 30rpx;

    .cancel-btn, .save-btn {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      font-size: 28rpx;
    }

    .cancel-btn {
      background-color: #f2f3f5;
      color: #666;
      margin-right: 20rpx;
    }

    .save-btn {
      background-color: #7668fa;
      color: #ffffff;

      &:disabled {
        opacity: 0.6;
      }
    }
  }

  .tag-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;

    .modal-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #ffffff;
      border-radius: 20rpx 20rpx 0 0;
      overflow: hidden;

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1rpx solid #f0f0f0;

        .modal-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }

        .modal-close {
          font-size: 40rpx;
          color: #999;
        }
      }

      .modal-body {
        padding: 30rpx;

        .tag-input {
          width: 100%;
          height: 80rpx;
          background-color: #f5f5f5;
          border-radius: 40rpx;
          padding: 0 30rpx;
          font-size: 28rpx;
          margin-bottom: 30rpx;
        }

        .suggested-tags {
          .suggested-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 20rpx;
            display: block;
          }

          .suggested-tag-list {
            display: flex;
            flex-wrap: wrap;

            .suggested-tag {
              font-size: 24rpx;
              color: #666;
              background-color: #f5f5f5;
              padding: 10rpx 20rpx;
              border-radius: 30rpx;
              margin-right: 20rpx;
              margin-bottom: 20rpx;

              &:active {
                background-color: rgba(118, 104, 250, 0.1);
                color: #7668fa;
              }
            }
          }
        }
      }

      .modal-footer {
        display: flex;
        padding: 20rpx 30rpx 50rpx;

        .cancel-btn, .confirm-btn {
          flex: 1;
          height: 80rpx;
          line-height: 80rpx;
          text-align: center;
          border-radius: 40rpx;
          font-size: 28rpx;
        }

        .cancel-btn {
          background-color: #f2f3f5;
          color: #666;
          margin-right: 20rpx;
        }

        .confirm-btn {
          background-color: #7668fa;
          color: #ffffff;

          &:disabled {
            opacity: 0.6;
          }
        }
      }
    }
  }
}
</style>