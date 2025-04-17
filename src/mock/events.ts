// 活动数据
export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  time: string;
  location: string;
  isOnline: boolean;
  participants: number;
}

export const events: Event[] = [
  {
    id: 1,
    title: '手语交流会',
    description: '来参加我们的手语交流活动，认识更多朋友！',
    image: '/static/event-default.png',
    time: '2023-06-20 14:00',
    location: '线上活动',
    isOnline: true,
    participants: 45
  },
  {
    id: 2,
    title: '听障人士职业发展论坛',
    description: '探讨听障人士在职场中的机会与挑战，分享成功经验。',
    image: '/static/event-default.png',
    time: '2023-06-25 10:00',
    location: '北京市海淀区中关村创业大厦',
    isOnline: false,
    participants: 78
  },
  {
    id: 3,
    title: '手语歌曲演唱会',
    description: '一场视听盛宴，用手语演绎经典歌曲。',
    image: '/static/event-default.png',
    time: '2023-07-01 19:30',
    location: '线上直播',
    isOnline: true,
    participants: 120
  },
  {
    id: 4,
    title: '辅助技术展示会',
    description: '展示最新的听障辅助技术和产品，帮助听障人士更好地融入社会。',
    image: '/static/event-default.png',
    time: '2023-07-05 09:00',
    location: '上海市浦东新区科技馆',
    isOnline: false,
    participants: 95
  },
  {
    id: 5,
    title: '手语电影放映会',
    description: '观看配有手语翻译的电影，享受无障碍的观影体验。',
    image: '/static/event-default.png',
    time: '2023-07-10 18:30',
    location: '线上活动',
    isOnline: true,
    participants: 67
  },
  {
    id: 6,
    title: '听障青年交友派对',
    description: '为听障青年提供一个轻松愉快的社交环境，结交新朋友。',
    image: '/static/event-default.png',
    time: '2023-07-15 15:00',
    location: '广州市天河区文化公园',
    isOnline: false,
    participants: 56
  }
];
