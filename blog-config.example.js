// Blog Configuration Template
// 配置模板 - 复制此文件为 blog-config.js 并填入你的密码哈希

const crypto = require('crypto');

module.exports = {
  // 生成密码哈希的步骤：
  // 1. 在 Node.js 中运行：
  //    node -e "const c=require('crypto'); console.log(c.createHash('sha256').update('你的密码').digest('hex'))"
  // 2. 将输出的 64 位哈希值复制到下方
  //
  // 例如：密码 "JIU99" 的哈希是 "4e72f66896a262542b72acc2cc95847e5386507f242ba18143413e72c3ef45ae"

  passwordHash: 'PUT_YOUR_SHA256_HASH_HERE',

  // Token 有效期（小时）- 用户登录后多久需要重新输入密码
  tokenExpiryHours: 720, // 30 天
};
