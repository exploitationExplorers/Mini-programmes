<template>
  <view class="chat-container">
    <!-- 聊天头部 -->
    <view class="chat-header">
      <view class="user-info">
        <text class="username">{{ username }}</text>
        <text class="status">在线</text>
      </view>
    </view>

    <!-- 聊天内容区域 -->
    <scroll-view
      scroll-y
      class="chat-messages"
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
    >
      <view class="loading" v-if="loading">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>

      <view class="message-list">
        <view
          class="message-item"
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="{ 'self': message.isSelf }"
        >
          <view class="avatar" v-if="!message.isSelf">
            <image :src="userAvater || '/static/default-avatar.png'" mode="aspectFill"></image>
          </view>
          <view class="message-content">
            <view class="message-bubble">
              <text v-if="!message.isEmoji">{{ message.content }}</text>
              <view v-else class="emoji-message">
                <text class="emoji-large">{{ message.content }}</text>
              </view>
            </view>
            <view class="message-time">{{ message.time }}</view>
          </view>
          <view class="avatar" v-if="message.isSelf">
            <image src="/static/default-avatar.png" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 遮罩层 -->
    <view class="emoji-mask" v-if="showEmoji" @click="closeEmojiPicker"></view>

    <!-- 表情选择器 -->
    <view class="emoji-picker" v-if="showEmoji">
      <view class="emoji-header">
        <view class="emoji-title">表情</view>
        <view class="emoji-close" @click="closeEmojiPicker">
          <i class="fas fa-times"></i>
        </view>
      </view>
      <scroll-view scroll-y class="emoji-container">
        <view class="emoji-grid">
          <view
            class="emoji-item"
            v-for="(emoji, index) in emojiList"
            :key="index"
            @click="selectEmoji(emoji)"
          >
            <text class="emoji-text">{{ emoji.emoji }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 输入区域 -->
    <view class="chat-input-area">
      <view class="input-box">
        <input
          type="text"
          v-model="messageText"
          placeholder="输入消息..."
          confirm-type="send"
          @confirm="sendMessage"
        />
        <view class="emoji-btn" @click="showEmojiPicker">
          <i class="far fa-smile"></i>
        </view>
      </view>
      <view class="send-btn" @click="sendMessage">
        <i class="fas fa-paper-plane"></i>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">

import { onLoad } from '@dcloudio/uni-app';
import { ref, onMounted, nextTick } from 'vue';

// 获取路由参数
// const query = computed(() => {
//   const pages = getCurrentPages();
//   const currentPage = pages[pages.length - 1];
//   // @ts-ignore
//   return currentPage.$page?.options || {};
// });
// const userId = computed(() => Number(query.value.id) || 0);
// const username = computed(() => query.value.username || '用户');
// const userAvater = computed(() => query.value.image);
const userId = ref(0);
const username = ref<String>('');
const userAvater = ref('');
onLoad((options: any) => {
  console.log(options,'options');
  userId.value = Number(options.id) || 0;
  username.value = options.username || '用户';
  userAvater.value = options.image;

});
// 聊天相关状态
const chatMessages = ref<any[]>([]);
const messageText = ref('');
const loading = ref(false);
const scrollTop = ref(0);

// 表情相关状态
const showEmoji = ref(false);
// 使用 emoji 字符代替图片
const emojiList = ref([
  { id: 1, emoji: '😀' }, // 笑脸
  { id: 2, emoji: '😁' }, // 笑脸带笑眼
  { id: 3, emoji: '😂' }, // 笑中带泪
  { id: 4, emoji: '😃' }, // 开心笑
  { id: 5, emoji: '😄' }, // 开心笑带笑眼
  { id: 6, emoji: '😅' }, // 尴尬笑
  { id: 7, emoji: '😆' }, // 狂笑
  { id: 8, emoji: '😇' }, // 天使笑
  { id: 9, emoji: '😈' }, // 恶魔笑
  { id: 10, emoji: '😉' }, // 眨眼
  { id: 11, emoji: '😊' }, // 害羞笑
  { id: 12, emoji: '😋' }, // 馋嘴
  { id: 13, emoji: '😌' }, // 安心
  { id: 14, emoji: '😍' }, // 爱心眼
  { id: 15, emoji: '😎' }, // 墨镜笑
  { id: 16, emoji: '😏' }, // 得意笑
  { id: 17, emoji: '😚' }, // 亲吻
  { id: 18, emoji: '😛' }, // 吐舌头
  { id: 19, emoji: '😜' }, // 调皮
  { id: 20, emoji: '😝' }, // 吐舌头闭眼
  { id: 21, emoji: '😞' }, // 失望
  { id: 22, emoji: '😟' }, // 担忧
  { id: 23, emoji: '😪' }, // 困倦
  { id: 24, emoji: '😫' }, // 疲惫
]);

// 显示/隐藏表情选择器
const showEmojiPicker = () => {
  showEmoji.value = true;
};

// 关闭表情选择器
const closeEmojiPicker = () => {
  showEmoji.value = false;
};

// 选择表情
const selectEmoji = (emoji: any) => {
  // 发送表情消息
  chatMessages.value.push({
    isSelf: true,
    content: emoji.emoji,
    isEmoji: true,
    time: formatTime(new Date())
  });

  // 滚动到底部
  scrollToBottom();

  // 隐藏表情选择器
  showEmoji.value = false;

  // 模拟对方回复
  setTimeout(() => {
    const randomResponses = [
      '这个表情真可爱！',
      '哈哈，有趣！',
      '我也喜欢这个表情！',
      '太有趣了！',
      '很适合这个场景！'
    ];

    const randomIndex = Math.floor(Math.random() * randomResponses.length);

    chatMessages.value.push({
      isSelf: false,
      content: randomResponses[randomIndex],
      time: formatTime(new Date()),
      avatar: '/static/image/boy/download-3.jpg'
    });

    // 再次滚动到底部
    scrollToBottom();
  }, 1000);
};

// 模拟聊天数据
const mockMessages = [
  {
    isSelf: false,
    content: '你好，很高兴认识你！',
    time: '10:00',
    avatar: '/static/image/boy/download-3.jpg'
  },
  {
    isSelf: true,
    content: '你好，我也很高兴认识你！',
    time: '10:01'
  },
  {
    isSelf: false,
    content: '你平时有什么兴趣爱好吗？',
    time: '10:02',
    avatar: '/static/image/boy/download-3.jpg'
  },
  {
    isSelf: true,
    content: '我喜欢看书、听音乐，偶尔也会出去旅行。你呢？',
    time: '10:03'
  },
  {
    isSelf: false,
    content: '我喜欢摄影和绘画，有时也会参加一些志愿者活动。',
    time: '10:05',
    avatar: '/static/image/boy/download-3.jpg'
  }
];

// 加载聊天记录
const loadChatMessages = () => {
  loading.value = true;

  // 模拟API请求延迟
  setTimeout(() => {
    chatMessages.value = [...mockMessages];
    loading.value = false;

    // 滚动到底部
    scrollToBottom();
  }, 500);
};

// 加载更多历史消息
const loadMoreMessages = () => {
  if (loading.value) return;

  loading.value = true;

  // 模拟加载更多历史消息
  setTimeout(() => {
    const historyMessages = [
      {
        isSelf: false,
        content: '嗨，最近怎么样？',
        time: '昨天 09:30',
        avatar: '/static/image/boy/download-3.jpg'
      },
      {
        isSelf: true,
        content: '挺好的，在忙一个新项目。',
        time: '昨天 09:35'
      }
    ];

    chatMessages.value = [...historyMessages, ...chatMessages.value];
    loading.value = false;
  }, 800);
};

// 发送消息
const sendMessage = () => {
  if (!messageText.value.trim()) return;

  // 添加新消息
  chatMessages.value.push({
    isSelf: true,
    content: messageText.value,
    time: formatTime(new Date())
  });

  // 清空输入框
  messageText.value = '';

  // 滚动到底部
  scrollToBottom();

  // 模拟对方回复
  setTimeout(() => {
    chatMessages.value.push({
      isSelf: false,
      content: '好的，我明白了！',
      time: formatTime(new Date()),
      avatar: '/static/image/boy/download-3.jpg'
    });

    // 再次滚动到底部
    scrollToBottom();
  }, 1000);
};

// 滚动到底部
const scrollToBottom = () => {
  // 使用nextTick确保DOM已更新
  nextTick(() => {
    // 随机大数，确保滚动到底部
    scrollTop.value = Math.random() * 10000;
  });
};

// 格式化时间
const formatTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

onMounted(() => {
  loadChatMessages();
});
</script>

<style lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;

  .chat-header {
    padding: 20rpx 30rpx;
    background-color: #ffffff;
    border-bottom: 1rpx solid #f0f0f0;

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;

      .username {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .status {
        font-size: 24rpx;
        color: #7668fa;
        margin-top: 4rpx;
      }
    }
  }

  .chat-messages {
    flex: 1;
    padding: 20rpx;

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0;

      .loading-spinner {
        width: 40rpx;
        height: 40rpx;
        border: 3rpx solid #f3f3f3;
        border-top: 3rpx solid #7668fa;
        border-radius: 50%;
        margin-bottom: 10rpx;
        animation: spin 1s linear infinite;
      }

      text {
        font-size: 24rpx;
        color: #999;
      }
    }

    .message-list {
      padding-bottom: 20rpx;
    }

    .message-item {
      display: flex;
      margin-bottom: 30rpx;

      &.self {
        flex-direction: row-reverse;

        .message-content {
          align-items: flex-end;

          .message-bubble {
            background-color: #7668fa;
            color: #ffffff;
            border-radius: 20rpx 4rpx 20rpx 20rpx;
          }
        }
      }

      .avatar {
        width: 80rpx;
        height: 80rpx;
        margin: 0 20rpx;

        image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .message-content {
        display: flex;
        flex-direction: column;
        max-width: 70%;

        .message-bubble {
          padding: 20rpx;
          background-color: #ffffff;
          border-radius: 4rpx 20rpx 20rpx 20rpx;
          box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

          text {
            font-size: 28rpx;
            line-height: 1.4;
            word-break: break-word;
          }

          .emoji-message {
            display: flex;
            justify-content: center;
            align-items: center;

            .emoji-large {
              font-size: 80rpx;
              line-height: 1;
            }
          }
        }

        .message-time {
          font-size: 22rpx;
          color: #999;
          margin-top: 10rpx;
        }
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }

  // 遮罩层样式
  .emoji-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
  }

  // 表情选择器样式
  .emoji-picker {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 480rpx;
    background-color: #ffffff;
    border-top: 1rpx solid #f0f0f0;
    box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.08);
    border-radius: 24rpx 24rpx 0 0;
    z-index: 101;
    animation: slideUp 0.3s ease;

    .emoji-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      .emoji-title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
      }

      .emoji-close {
        width: 50rpx;
        height: 50rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;

        i {
          font-size: 24rpx;
          color: #999;
        }

        &:active {
          background-color: #f5f5f5;
        }
      }
    }

    .emoji-container {
      height: calc(100% - 90rpx);
      padding: 20rpx;

      .emoji-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .emoji-item {
          width: 16.666%;
          height: 110rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 20rpx;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            background-color: transparent;
            transition: all 0.2s ease;
          }

          .emoji-text {
            font-size: 50rpx;
            transition: all 0.2s ease;
            z-index: 1;
          }

          &:active {
            &::after {
              background-color: rgba(118, 104, 250, 0.1);
            }

            .emoji-text {
              transform: scale(1.2);
            }
          }
        }
      }
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .chat-input-area {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #ffffff;
    border-top: 1rpx solid #f0f0f0;

    .input-box {
      flex: 1;
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      border-radius: 36rpx;
      padding: 0 20rpx;

      input {
        flex: 1;
        height: 70rpx;
        font-size: 28rpx;
      }

      .emoji-btn {
        padding: 0 10rpx;

        i {
          font-size: 40rpx;
          color: #999;
        }
      }
    }

    .send-btn {
      width: 70rpx;
      height: 70rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20rpx;
      background-color: #7668fa;
      border-radius: 50%;

      i {
        font-size: 30rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
