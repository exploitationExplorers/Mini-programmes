// 消息数据
export interface Message {
  id: number;
  userId: number;
  username: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export const messages: Message[] = [
  {
    id: 1,
    userId: 2,
    username: '李华',
    avatar: '/static/image/boy/1.webp',
    lastMessage: '你好，最近怎么样？',
    time: '14:30',
    unread: 2
  },
  {
    id: 2,
    userId: 3,
    username: '王芳',
    avatar: '/static/image/girl/images-1.jpg',
    lastMessage: '我找到了一个很好的手语学习资源，分享给你',
    time: '13:45',
    unread: 0
  },
  {
    id: 3,
    userId: 4,
    username: '赵明',
    avatar: '/static/image/boy/3.webp',
    lastMessage: '周末有空一起参加摄影活动吗？',
    time: '昨天',
    unread: 1
  },
  {
    id: 4,
    userId: 5,
    username: '刘洋',
    avatar: '/static/image/girl/images-3.jpg',
    lastMessage: '我创作了一首新歌，想听听你的意见',
    time: '昨天',
    unread: 0
  },
  {
    id: 5,
    userId: 6,
    username: '陈静',
    avatar: '/static/image/girl/images-1.jpg',
    lastMessage: '关于特殊教育的讲座，你有兴趣参加吗？',
    time: '周二',
    unread: 0
  },
  {
    id: 6,
    userId: 7,
    username: '林小雨',
    avatar: '/static/image/boy/download-2.jpg',
    lastMessage: '我画了一幅新画，想请你给点意见',
    time: '周一',
    unread: 3
  },
  {
    id: 7,
    userId: 8,
    username: '张伟',
    avatar: '/static/image/boy/download-1.jpg',
    lastMessage: '那个编程问题我已经解决了，谢谢你的帮助',
    time: '周一',
    unread: 0
  },
  {
    id: 8,
    userId: 9,
    username: '黄小米',
    avatar: '/static/image/girl/images-2.jpg',
    lastMessage: '今晚8点我会直播，欢迎来看',
    time: '06-10',
    unread: 0
  },
  {
    id: 9,
    userId: 10,
    username: '周杰',
    avatar: '/static/image/boy/download-5.jpg',
    lastMessage: '下周的运动会你参加吗？',
    time: '06-09',
    unread: 0
  },
  {
    id: 10,
    userId: 11,
    username: '系统通知',
    avatar: '/static/image/commont/images.png',
    lastMessage: '欢迎使用听障交友App，祝您使用愉快！',
    time: '06-08',
    unread: 0
  }
];
