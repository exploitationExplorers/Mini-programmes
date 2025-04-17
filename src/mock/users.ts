// 用户数据
export interface User {
  id: number;
  username: string;
  avatar: string;
  bio: string;
  tags: string[];
  isRecommended: boolean;
  followers: number;
  following: number;
  posts: number;
}

export const users: User[] = [
  {
    id: 1,
    username: '张小明',
    avatar: '/static/default-avatar.png',
    bio: '听力障碍不是障碍，沟通无界限',
    tags: ['听障', '90后', '程序员'],
    isRecommended: false,
    followers: 356,
    following: 128,
    posts: 48
  },
  {
    id: 2,
    username: '李华',
    avatar: '/static/default-avatar.png',
    bio: '热爱生活，热爱手语',
    tags: ['视障', '教师'],
    isRecommended: true,
    followers: 245,
    following: 89,
    posts: 32
  },
  {
    id: 3,
    username: '王芳',
    avatar: '/static/default-avatar.png',
    bio: '手语翻译员，希望帮助更多人',
    tags: ['手语翻译', '志愿者'],
    isRecommended: true,
    followers: 512,
    following: 67,
    posts: 105
  },
  {
    id: 4,
    username: '赵明',
    avatar: '/static/default-avatar.png',
    bio: '热爱摄影，记录美好生活',
    tags: ['听障', '摄影师'],
    isRecommended: true,
    followers: 189,
    following: 210,
    posts: 78
  },
  {
    id: 5,
    username: '刘洋',
    avatar: '/static/default-avatar.png',
    bio: '音乐是我的语言',
    tags: ['视障', '音乐家'],
    isRecommended: true,
    followers: 423,
    following: 156,
    posts: 64
  },
  {
    id: 6,
    username: '陈静',
    avatar: '/static/default-avatar.png',
    bio: '特殊教育工作者，致力于听障儿童教育',
    tags: ['特教', '教师'],
    isRecommended: true,
    followers: 378,
    following: 92,
    posts: 41
  },
  {
    id: 7,
    username: '林小雨',
    avatar: '/static/default-avatar.png',
    bio: '喜欢画画，用画笔表达自己',
    tags: ['听障', '画家'],
    isRecommended: false,
    followers: 267,
    following: 183,
    posts: 56
  },
  {
    id: 8,
    username: '张伟',
    avatar: '/static/default-avatar.png',
    bio: '软件工程师，热爱技术',
    tags: ['程序员', '科技爱好者'],
    isRecommended: false,
    followers: 156,
    following: 201,
    posts: 37
  },
  {
    id: 9,
    username: '黄小米',
    avatar: '/static/default-avatar.png',
    bio: '手语主播，分享生活点滴',
    tags: ['听障', '主播'],
    isRecommended: false,
    followers: 892,
    following: 124,
    posts: 215
  },
  {
    id: 10,
    username: '周杰',
    avatar: '/static/default-avatar.png',
    bio: '运动健将，永不言弃',
    tags: ['听障', '运动员'],
    isRecommended: false,
    followers: 345,
    following: 178,
    posts: 89
  }
];
