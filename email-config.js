/**
 * Email Configuration
 *
 * QQ邮箱授权码获取步骤：
 * 1. 登录 https://mail.qq.com
 * 2. 点击 "设置" → "账户"
 * 3. 找到 "POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
 * 4. 开启 "POP3/SMTP服务"
 * 5. 会提示生成授权码，按照步骤生成
 * 6. 复制授权码到下面的 AUTH_CODE 字段
 */

module.exports = {
  // QQ邮箱配置
  email: {
    service: 'qq', // 邮件服务类型
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // SSL连接

    // 你的QQ邮箱地址
    from: '847151276@qq.com',

    // QQ邮箱授权码（不是密码，需要在QQ邮箱设置中生成）
    // 请替换为你的QQ邮箱授权码
    authCode: 'YOUR_QQ_AUTH_CODE_HERE',

    // 接收反馈的邮箱地址（可以是其他邮箱）
    notifyEmail: '847151276@qq.com'
  },

  /**
   * 获取nodemailer的传输配置
   */
  getTransporter() {
    const nodemailer = require('nodemailer');

    if (this.email.authCode === 'YOUR_QQ_AUTH_CODE_HERE') {
      console.warn('⚠️  警告：邮件授权码未配置！');
      console.warn('请在 email-config.js 中配置你的QQ邮箱授权码');
      return null;
    }

    return nodemailer.createTransport({
      host: this.email.host,
      port: this.email.port,
      secure: this.email.secure,
      auth: {
        user: this.email.from,
        pass: this.email.authCode
      }
    });
  }
};
