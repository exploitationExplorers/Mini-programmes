// mock 数据服务
import { users } from './users';
import { posts } from './posts';
import { messages } from './messages';
import { events } from './events';
import { notifications } from './notifications';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟 API 请求
export const mockApi = {
  // 用户相关
  async getRecommendedUsers() {
    await delay(300);
    return users.filter(user => user.isRecommended);
  },
  
  async searchUsers(keyword: string) {
    await delay(300);
    if (!keyword) return [];
    return users.filter(user => 
      user.username.includes(keyword) || 
      user.bio.includes(keyword) ||
      user.tags.some(tag => tag.includes(keyword))
    );
  },
  
  async getUserById(id: number) {
    await delay(200);
    return users.find(user => user.id === id);
  },
  
  // 帖子相关
  async getPosts(type = 'all', page = 1, pageSize = 10) {
    await delay(400);
    let filteredPosts = [...posts];
    
    if (type === 'popular') {
      filteredPosts = filteredPosts.sort((a, b) => b.likes - a.likes);
    } else if (type === 'followed') {
      filteredPosts = filteredPosts.filter(post => post.isFollowed);
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      list: filteredPosts.slice(start, end),
      total: filteredPosts.length,
      hasMore: end < filteredPosts.length
    };
  },
  
  async getUserPosts(userId: number) {
    await delay(300);
    return posts.filter(post => post.userId === userId);
  },
  
  async getLikedPosts(userId: number) {
    await delay(300);
    return posts.filter(post => post.likedBy.includes(userId));
  },
  
  async searchPosts(keyword: string) {
    await delay(400);
    if (!keyword) return [];
    return posts.filter(post => 
      post.content.includes(keyword) || 
      post.tags.some(tag => tag.includes(keyword))
    );
  },
  
  // 消息相关
  async getMessages() {
    await delay(300);
    return messages;
  },
  
  async searchMessages(keyword: string) {
    await delay(300);
    if (!keyword) return [];
    return messages.filter(message => 
      message.lastMessage.includes(keyword) || 
      message.username.includes(keyword)
    );
  },
  
  // 通知相关
  async getNotifications() {
    await delay(200);
    return notifications;
  },
  
  // 活动相关
  async getEvents() {
    await delay(300);
    return events;
  }
};
