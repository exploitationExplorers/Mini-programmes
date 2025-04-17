// 帖子数据
export interface Post {
  id: number;
  userId: number;
  username: string;
  userAvatar: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  createTime: string;
  isFollowed: boolean;
  likedBy: number[];
}

export const posts: Post[] = [
  {
    id: 1,
    userId: 1,
    username: '徐伟琦',
    userAvatar: '/static/image/boy/1.webp',
    content: '今天参加了一个手语交流活动，认识了很多新朋友，感觉很开心！',
    images: ['/static/image/books/1.jpg'],
    tags: ['手语交流', '新朋友'],
    likes: 45,
    comments: 12,
    shares: 5,
    createTime: '2023-06-15 14:30',
    isFollowed: false,
    likedBy: [2, 3, 5]
  },
  {
    id: 2,
    userId: 3,
    username: '张鑫',
    userAvatar: '/static/image/boy/2.webp',
    content: '分享一个手语教学视频，希望对大家有帮助！#手语学习 #日常交流',
    images: ['/static/image/books/5.jpg', '/static/image/books/6.jpg', '/static/image/books/7.jpg'],
    tags: ['手语学习', '日常交流'],
    likes: 78,
    comments: 23,
    shares: 15,
    createTime: '2023-06-14 10:15',
    isFollowed: true,
    likedBy: [1, 4, 6, 8]
  },
  {
    id: 3,
    userId: 5,
    username: '欧阳娜娜',
    userAvatar: '/static/image/girl/images-1.jpg',
    content: '用音乐感受世界，即使听不见，也能感受到音乐的律动。#音乐无障碍 #感受律动',
    images: [],
    tags: ['音乐无障碍', '感受律动'],
    likes: 120,
    comments: 34,
    shares: 28,
    createTime: '2023-06-13 16:45',
    isFollowed: true,
    likedBy: [1, 2, 7, 9]
  },
  {
    id: 4,
    userId: 2,
    username: '章子怡',
    userAvatar: '/static/image/girl/images-2.jpg',
    content: '今天给学生们讲解了如何使用辅助技术进行学习，他们学得很认真！#特殊教育 #辅助技术',
    images: ['/static/image/books/8.jpg', '/static/image/books/9.jpg'],
    tags: ['特殊教育', '辅助技术'],
    likes: 56,
    comments: 18,
    shares: 7,
    createTime: '2023-06-12 09:30',
    isFollowed: false,
    likedBy: [3, 6]
  },
  {
    id: 5,
    userId: 4,
    username: '张望',
    userAvatar: '/static/image/boy/3.webp',
    content: '分享一组我拍摄的城市风光照片，希望通过我的镜头让更多人看到这个美丽的世界。#摄影 #城市风光',
    images: ['/static/image/books/10.jpg', '/static/image/books/11.jpg', '/static/image/books/12.jpg'],
    tags: ['摄影', '城市风光'],
    likes: 89,
    comments: 25,
    shares: 12,
    createTime: '2023-06-11 15:20',
    isFollowed: true,
    likedBy: [1, 5, 8, 10]
  },
  {
    id: 6,
    userId: 6,
    username: '陈静',
    userAvatar: '/static/image/girl/images-2.jpg',
    content: '今天和孩子们一起做了一个有趣的手工活动，他们很开心！#特殊教育 #手工活动',
    images: ['/static/image/books/13.jpg'],
    tags: ['特殊教育', '手工活动'],
    likes: 67,
    comments: 19,
    shares: 8,
    createTime: '2023-06-10 11:40',
    isFollowed: false,
    likedBy: [2, 7, 9]
  },
  {
    id: 7,
    userId: 1,
    username: '张小明',
    userAvatar: '/static/default-avatar.png',
    content: '分享一个我最近学到的编程技巧，希望对同样是程序员的朋友有帮助！#编程 #技术分享',
    images: [],
    tags: ['编程', '技术分享'],
    likes: 42,
    comments: 15,
    shares: 6,
    createTime: '2023-06-09 17:30',
    isFollowed: false,
    likedBy: [4, 8]
  },
  {
    id: 8,
    userId: 7,
    username: '林小雨',
    userAvatar: '/static/image/girl/images-3.jpg',
    content: '完成了一幅新画作，用色彩表达内心的感受。#绘画 #艺术创作',
    images: ['/static/image/books/14.jpg'],
    tags: ['绘画', '艺术创作'],
    likes: 95,
    comments: 28,
    shares: 17,
    createTime: '2023-06-08 14:15',
    isFollowed: true,
    likedBy: [1, 3, 5, 9]
  },
  {
    id: 9,
    userId: 9,
    username: '黄小米',
    userAvatar: '/static/image/girl/images-1.jpg',
    content: '今天直播间来了很多新朋友，感谢大家的支持！#直播 #手语主播',
    images: ['/static/image/books/15.jpg', '/static/image/books/16.jpg'],
    tags: ['直播', '手语主播'],
    likes: 156,
    comments: 47,
    shares: 32,
    createTime: '2023-06-07 20:00',
    isFollowed: true,
    likedBy: [1, 2, 4, 6, 8, 10]
  },
  {
    id: 10,
    userId: 10,
    username: '周杰',
    userAvatar: '/static/image/boy/download-1.jpg',
    content: '今天完成了10公里的跑步训练，为下个月的比赛做准备！#运动 #跑步',
    images: ['/static/image/books/17.jpg'],
    tags: ['运动', '跑步'],
    likes: 78,
    comments: 23,
    shares: 9,
    createTime: '2023-06-06 18:45',
    isFollowed: false,
    likedBy: [3, 5, 7]
  },
  {
    id: 11,
    userId: 1,
    username: '张小明',
    userAvatar: '/static/image/boy/download-4.jpg',
    content: '分享一个我最近在用的辅助听力app，真的很好用！#辅助技术 #听力障碍',
    images: ['/static/image/books/18.jpg'],
    tags: ['辅助技术', '听力障碍'],
    likes: 63,
    comments: 21,
    shares: 14,
    createTime: '2023-06-05 13:20',
    isFollowed: false,
    likedBy: [2, 4, 6, 8]
  },
  {
    id: 12,
    userId: 3,
    username: '李鹏飞',
    userAvatar: '/static/image/boy/download-5.jpg',
    content: '今天参加了一个手语翻译培训，学到了很多新知识！#手语翻译 #培训',
    images: [],
    tags: ['手语翻译', '培训'],
    likes: 45,
    comments: 17,
    shares: 5,
    createTime: '2023-06-04 16:30',
    isFollowed: true,
    likedBy: [1, 5, 9]
  },
  {
    id: 13,
    userId: 5,
    username: '刘洋',
    userAvatar: '/static/image/boy/3.webp',
    content: '创作了一首新歌，希望大家喜欢！#音乐创作 #新歌',
    images: ['/static/image/books/19.jpg'],
    tags: ['音乐创作', '新歌'],
    likes: 112,
    comments: 36,
    shares: 25,
    createTime: '2023-06-03 19:45',
    isFollowed: true,
    likedBy: [1, 2, 4, 7, 10]
  },
  {
    id: 14,
    userId: 2,
    username: '李华',
    userAvatar: '/static/image/boy/download-1.jpg',
    content: '分享一些视障人士使用手机的小技巧，希望对大家有帮助！#视障 #辅助技术',
    images: ['/static/image/books/20.jpg', '/static/image/books/21.jpg'],
    tags: ['视障', '辅助技术'],
    likes: 78,
    comments: 29,
    shares: 18,
    createTime: '2023-06-02 10:15',
    isFollowed: false,
    likedBy: [3, 6, 9]
  },
  {
    id: 15,
    userId: 4,
    username: '赵明',
    userAvatar: '/static/image/boy/download-2.jpg',
    content: '分享一组我拍摄的自然风光照片，大自然真美！#摄影 #自然风光',
    images: ['/static/image/books/22.jpg', '/static/image/books/23.jpg', '/static/image/books/24.jpg'],
    tags: ['摄影', '自然风光'],
    likes: 95,
    comments: 31,
    shares: 22,
    createTime: '2023-06-01 14:30',
    isFollowed: true,
    likedBy: [1, 5, 7, 8]
  }
];
