# Anonymous Feedback System

## 概述
此后端程序用于收集 Anonymous Feedback 页面提交的用户反馈，所有反馈都保存在 `feedback.json` 文件中。每当收到新反馈时，系统会自动发送邮件通知（需配置）。

## 文件说明

- **server.js** - 后端Express服务器程序
- **package.json** - Node.js依赖配置
- **feedback.json** - 反馈数据存储文件（自动创建和更新）
- **anonymous.html** - 已修改，现在会向后端发送反馈

## 使用步骤

### 1. 配置邮件服务（可选但推荐）

编辑 `email-config.js` 文件，获取 QQ 邮箱授权码：

**步骤：**
1. 登录 [QQ邮箱](https://mail.qq.com)
2. 点击 **设置** → **账户**
3. 找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
4. 点击 **开启** POP3/SMTP服务
5. 按照提示通过验证（手机号/密码/验证码）
6. **复制授权码**
7. 粘贴到 `email-config.js` 中的 `authCode` 字段

```javascript
// email-config.js
module.exports = {
  email: {
    // ... 其他配置 ...
    authCode: 'YOUR_QQ_AUTH_CODE_HERE',  // 替换为你的授权码
    notifyEmail: '847151276@qq.com'      // 改为你的邮箱
  }
};
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动服务器
```bash
npm start
```

输出示例：
```
╔════════════════════════════════════════════╗
║   Personal Site Feedback Server Running   ║
╚════════════════════════════════════════════╝

📍 Server: http://localhost:3000
📁 Feedback file: D:\A CODE\Claude\personal-site\feedback.json
🔗 Feedback API: POST http://localhost:3000/api/feedback
👀 View feedbacks: http://localhost:3000/api/feedbacks

Press Ctrl+C to stop the server.
```

### 3. 访问网站
在浏览器中打开：
```
http://localhost:3000
```

### 4. 查看反馈
有两种方式查看收集到的反馈：

**方式1：直接打开feedback.json文件**
```
D:\A CODE\Claude\personal-site\feedback.json
```

**方式2：通过API端点**
在浏览器中访问：
```
http://localhost:3000/api/feedbacks
```

## 📧 邮件功能说明

当收到新反馈时，系统会自动发送邮件通知到配置的邮箱。邮件内容包括：

- 💬 反馈内容
- ⏰ 提交时间
- 🔑 反馈ID
- 📱 用户设备信息

**邮件示例：**
```
主题: 🆕 New Feedback - 03/13/2026
发件人: 847151276@qq.com

您好，

您在个人网站上收到了新的匿名反馈。

反馈内容：
"这是一条用户反馈..."

提交时间: 2026/03/13 10:30:00 (CST)
反馈ID: 1710324567890
设备信息: Mozilla/5.0...
```

## 反馈数据格式

feedback.json 的结构：
```json
{
  "feedbacks": [
    {
      "id": 1710324567890,
      "message": "用户提交的反馈内容",
      "timestamp": "2026-03-12T10:30:00.000Z",
      "userAgent": "Mozilla/5.0..."
    },
    {
      "id": 1710324578901,
      "message": "另一条反馈",
      "timestamp": "2026-03-12T10:31:00.000Z",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

## API 端点

### POST /api/feedback
提交新反馈

**请求体：**
```json
{
  "message": "用户反馈内容"
}
```

**响应：**
```json
{
  "success": true,
  "message": "Feedback saved successfully",
  "feedbackId": 1710324567890
}
```

### GET /api/feedbacks
查看所有反馈（需要服务器运行）

**响应：**
```json
{
  "feedbacks": [...]
}
```

### GET /api/health
健康检查

**响应：**
```json
{
  "status": "Server is running",
  "timestamp": "2026-03-12T10:30:00.000Z"
}
```

## 故障排除

**问题：端口3000已被占用**
解决：修改 server.js 中的 `PORT` 变量为其他端口（如3001）

**问题：feedback.json 权限错误**
解决：确保文件夹有写入权限，或手动创建 feedback.json

**问题：邮件未发送**
解决：
1. 检查 `email-config.js` 中的授权码是否正确配置
2. 确保 QQ 邮箱已开启 POP3/SMTP 服务
3. 检查服务器终端日志是否有错误信息（`❌ Failed to send email`）
4. 尝试重新生成 QQ 邮箱授权码
5. 检查防火墙是否阻止了 SMTP 端口（465）

**问题：Anonymous Feedback 页面提交失败**
解决：
1. 检查服务器是否运行：访问 http://localhost:3000/api/health
2. 检查浏览器控制台是否有错误信息
3. 检查服务器终端是否有错误日志

**问题：邮件显示"发件人地址无效"**
解决：
1. 确保 `email-config.js` 中的 `from` 字段是有效的 QQ 邮箱地址
2. 验证授权码没有过期（如果过期需要重新生成）

## 安全建议

- 此系统适合个人或小规模使用
- 如需生产环境使用，建议：
  - 添加速率限制（防止滥用）
  - 添加数据验证和清理
  - 使用数据库（而不是JSON文件）
  - 添加身份验证（查看反馈时）
  - 启用HTTPS

## 停止服务器
在终端中按 `Ctrl+C`
