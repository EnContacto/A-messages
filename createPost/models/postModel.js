module.exports = class Post {
  constructor(id, user, content, imageUrl, timestamp) {
    this.id = id;
    this.user = user;
    this.content = content;
    this.imageUrl = imageUrl;
    this.timestamp = timestamp;
  }
};