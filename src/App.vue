<script>
export default {
  onLaunch: function() {
    console.log('App Launch');
    // 应用启动时初始化
    this.initializeApp();
  },
  onShow: function() {
    console.log('App Show');
  },
  onHide: function() {
    console.log('App Hide');
  },
  methods: {
    initializeApp() {
      // 这里可以进行初始化全局数据或配置
      const systemInfo = uni.getSystemInfoSync();
      console.log('系统信息:', systemInfo);

      // 检查更新
      if (uni.canIUse('getUpdateManager')) {
        const updateManager = uni.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              uni.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                  if (res.confirm) {
                    updateManager.applyUpdate();
                  }
                }
              });
            });

            updateManager.onUpdateFailed(function() {
              uni.showModal({
                title: '更新提示',
                content: '新版本下载失败，请检查网络后重试！',
                showCancel: false
              });
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
/* 全局样式 */
@import './uni.scss';

page {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Segoe UI, Arial, Roboto, "PingFang SC", "miui", "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 去除按钮的默认样式 */
button {
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 0;
  &::after {
    border: none;
  }
}

/* Font Awesome 样式 */
@import '@fortawesome/fontawesome-free/css/all.css';

/* 图标类 */
.fa-icon {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  text-align: center;
}

/* 替换原有图标 */
.icon-search:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f002"; /* fa-search */
  font-weight: 900;
}
.icon-add:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f067"; /* fa-plus */
  font-weight: 900;
}
.icon-like:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f004"; /* fa-heart */
  font-weight: 400;
}
.icon-like-filled:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f004"; /* fa-heart */
  font-weight: 900;
}
.icon-comment:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f075"; /* fa-comment */
  font-weight: 400;
}
.icon-share:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f064"; /* fa-share */
  font-weight: 900;
}
.icon-image:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f03e"; /* fa-image */
  font-weight: 400;
}
.icon-video:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f03d"; /* fa-video */
  font-weight: 900;
}
.icon-topic:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f086"; /* fa-comments */
  font-weight: 900;
}
.icon-setting:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f013"; /* fa-cog */
  font-weight: 900;
}
.icon-feedback:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f0a1"; /* fa-bullhorn */
  font-weight: 900;
}
.icon-help:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f059"; /* fa-question-circle */
  font-weight: 400;
}
.icon-camera:before {
  font-family: 'Font Awesome 5 Free';
  content: "\f030"; /* fa-camera */
  font-weight: 900;
}

/* 去除滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}

/* 公共动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 安全区适配 */
.safe-area-inset-bottom {
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
}
</style>
