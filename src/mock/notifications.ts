// 通知数据
export interface Notification {
  id: number;
  type: 'follow' | 'like' | 'comment' | 'system';
  userId?: number;
  username?: string;
  avatar: string;
  content: string;
  time: string;
  isRead: boolean;
}

export const notifications: Notification[] = [
  {
    id: 1,
    type: 'follow',
    userId: 2,
    username: '李华',
    avatar: '/static/default-avatar.png',
    content: '关注了您，点击查看详情！',
    time: '1小时前',
    isRead: false
  },
  {
    id: 2,
    type: 'like',
    userId: 3,
    username: '王芳',
    avatar: '/static/default-avatar.png',
    content: '赞了您的动态：今天参加了一个手语交流活动...',
    time: '2小时前',
    isRead: false
  },
  {
    id: 3,
    type: 'comment',
    userId: 4,
    username: '赵明',
    avatar: '/static/default-avatar.png',
    content: '评论了您的动态：这个活动很有意义，下次我也想参加！',
    time: '3小时前',
    isRead: true
  },
  {
    id: 4,
    type: 'system',
    avatar: '/static/system-avatar.png',
    content: '您的账号已完成实名认证，现在可以使用所有功能了！',
    time: '昨天',
    isRead: true
  },
  {
    id: 5,
    type: 'follow',
    userId: 5,
    username: '刘洋',
    avatar: '/static/default-avatar.png',
    content: '关注了您，点击查看详情！',
    time: '昨天',
    isRead: true
  },
  {
    id: 6,
    type: 'like',
    userId: 6,
    username: '陈静',
    avatar: '/static/default-avatar.png',
    content: '赞了您的动态：分享一个我最近学到的编程技巧...',
    time: '2天前',
    isRead: true
  },
  {
    id: 7,
    type: 'comment',
    userId: 7,
    username: '林小雨',
    avatar: '/static/default-avatar.png',
    content: '评论了您的动态：这个技巧很实用，谢谢分享！',
    time: '2天前',
    isRead: true
  },
  {
    id: 8,
    type: 'system',
    avatar: '/static/system-avatar.png',
    content: '系统将于今晚22:00-23:00进行维护，请提前做好准备。',
    time: '3天前',
    isRead: true
  }
];
