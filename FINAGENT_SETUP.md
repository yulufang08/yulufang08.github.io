# FinAgent Web UI 集成指南

> 在 personal-site 中使用 FinAgent

---

## 🎯 功能说明

你的 personal-site 现在包含一个 **FinAgent Web UI 集成**，允许你在个人网站中直接访问和使用 FinAgent。

### 功能特性

```
✅ 一键启动 Web UI
✅ 自动检查服务状态
✅ 模态窗口嵌入显示
✅ 支持全屏使用
✅ 实时状态指示
✅ 支持 Esc 快速关闭
```

---

## 🚀 如何使用

### Step 1: 启动 FinAgent 服务

```bash
# 进入项目目录
cd "d:\A CODE\Agent_application_standalone"

# 或如果是在原位置
cd "d:\A CODE\Claude\Agent_application"

# 启动 Web 服务
python finagent_web.py
```

你会看到：
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### Step 2: 打开 personal-site

在浏览器中访问你的 personal-site：

```
file:///d:\A CODE\Claude\personal-site\index.html
```

或用 HTTP 服务器启动（推荐）：

```bash
cd "d:\A CODE\Claude\personal-site"

# Python 3
python -m http.server 8000

# 然后访问
http://localhost:8000
```

### Step 3: 使用 FinAgent

在 **Miscellaneous** 部分找到 **FinAgent** 卡片：

1. 观察状态指示
   - 🟢 **✅ 服务运行中** - 表示可以使用
   - 🔴 **❌ 服务未启动** - 需要运行 Python 脚本

2. 点击 **🚀 启动 Web UI** 按钮

3. Web UI 在弹窗中打开

4. 输入你的 API Key（在 `.env` 中配置）

5. 开始进行产业研究！

---

## 📋 使用流程

```
1. 启动 Python 服务
   python finagent_web.py
        ↓
2. 打开 personal-site
   访问 index.html
        ↓
3. 查看 FinAgent 卡片
   状态自动检查
        ↓
4. 点击"启动 Web UI"
   弹窗打开
        ↓
5. 输入 API Key
   使用研究功能
        ↓
6. 获取研究报告
   查看来源和分析
```

---

## 🔧 自定义配置

### 改变 Web UI 地址

如果你的 FinAgent 运行在不同的地址（如云端服务器），编辑 `index.html`：

```javascript
// 查找这一行 (约 280 行)
const FINAGENT_URL = 'http://localhost:5000';

// 改为你的服务器地址
const FINAGENT_URL = 'http://your-server.com:5000';
// 或
const FINAGENT_URL = 'https://your-domain.com';
```

### 改变检查间隔

默认每 5 秒检查一次服务状态，可以修改：

```javascript
// 查找这一行
setInterval(checkFinagentStatus, 5000);

// 改为 (毫秒)
setInterval(checkFinagentStatus, 10000);  // 10 秒
```

---

## 🎨 UI 定制

### 改变按钮颜色

编辑 `<button id="finagent-launch-btn">` 的 `style` 属性：

```html
<!-- 改变渐变色 -->
style="... background: linear-gradient(135deg, #your-color 0%, #your-color2 100%); ..."
```

### 改变卡片样式

编辑 FinAgent 卡片的最外层 `<div>` 的 `style`：

```html
<!-- 改变边框颜色 -->
<div style="border: 2px solid #your-color; ...">
```

---

## 🐛 故障排除

### Q: 点击按钮没反应

**A**: 检查 FinAgent 是否启动

```bash
# 终端运行
python finagent_web.py

# 应该看到
 * Running on http://127.0.0.1:5000
```

### Q: 提示"服务未启动"

**A**:

```bash
# 确保你在正确的目录
cd "d:\A CODE\Agent_application_standalone"

# 检查依赖
pip install -r requirements.txt

# 启动服务
python finagent_web.py
```

### Q: 无法通过 iframe 访问

**A**: 如果是远程服务器，需要配置 CORS：

在 `finagent_web.py` 中，CORS 已配置为允许 localhost 访问。如果你改变地址，可能需要更新 CORS 设置。

### Q: 状态一直显示"检查中..."

**A**: 检查浏览器控制台 (F12) 的错误信息。通常是：
- FinAgent 服务未启动
- 端口不正确
- 防火墙阻止连接

---

## 🔒 安全注意

### API Key 管理

```
✅ 在本地 .env 文件中存储
✅ personal-site 本身无法看到密钥
✅ 密钥只在 FinAgent Web UI 中输入

❌ 不要在 HTML 中硬编码 API Key
❌ 不要在 GitHub 上提交包含密钥的配置
```

### 私密性

```
🔒 personal-site 是完全静态的 HTML
🔒 FinAgent 只在你的本地运行
🔒 没有数据发送到任何远程服务器（除了 Groq API）
🔒 其他人无法访问你的本地 Web UI
```

---

## 📱 响应式设计

Web UI 在弹窗中自动适应窗口大小：

```
📱 手机: 自动缩放
💻 平板: 中等显示
🖥️  桌面: 全屏显示
```

可以按 **Esc** 或点击 **✕** 关闭窗口。

---

## 🌐 部署到远程服务器

如果你想在公网上访问 FinAgent：

### 1. 部署 FinAgent 到服务器

```bash
# 在服务器上
pip install -r requirements.txt
python finagent_web.py  # 或用 Gunicorn/Waitress
```

### 2. 更新 personal-site 配置

```javascript
const FINAGENT_URL = 'https://your-domain.com:5000';
```

### 3. 配置 HTTPS（推荐）

编辑 `finagent_web.py`：

```python
if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        ssl_context=('cert.pem', 'key.pem')  # 添加 SSL
    )
```

---

## 📊 监控服务状态

页面会自动：

```
✅ 每 5 秒检查一次服务状态
✅ 更新"状态"按钮的显示
✅ 禁用/启用"启动"按钮
✅ 显示详细的错误信息
```

状态指示：
- 🟢 **✅ 服务运行中** - 绿色，可以使用
- 🔴 **❌ 服务未启动** - 红色，需要启动

---

## 🎯 使用场景

### 场景 1: 本地开发

```
1. 启动 FinAgent 服务
2. 打开 personal-site
3. 在浏览器中直接使用
4. 开发时频繁使用
```

### 场景 2: 演示展示

```
1. 在你的电脑上启动服务
2. 打开 personal-site
3. 向他人展示功能
4. 演示产业研究能力
```

### 场景 3: 远程访问

```
1. 部署 FinAgent 到云服务器
2. 配置 HTTPS
3. 任何地方访问 personal-site
4. 通过网页使用 FinAgent
```

---

## 💡 技巧

### 快速访问

收藏书签：
```
名称: FinAgent
URL: file:///d:\A CODE\Claude\personal-site\index.html
```

### 快速启动脚本

创建 `start-finagent.bat` (Windows)：

```batch
@echo off
cd "d:\A CODE\Agent_application_standalone"
python finagent_web.py
pause
```

或 `start-finagent.sh` (Linux/macOS)：

```bash
#!/bin/bash
cd "d:\A CODE\Agent_application_standalone"
python finagent_web.py
```

### 自动启动（可选）

使用 Windows 任务计划程序或 macOS 开机启动，自动启动 FinAgent 服务。

---

## 📚 相关文档

- [SECURITY_GUIDE.md](../Agent_application_standalone/SECURITY_GUIDE.md) - 安全指南
- [GROQ_SETUP.md](../Agent_application_standalone/GROQ_SETUP.md) - Groq 配置
- [README_GROQ.md](../Agent_application_standalone/README_GROQ.md) - 快速参考

---

## ✅ 检查清单

启动前确认：

- [ ] FinAgent 项目在正确位置
- [ ] `requirements.txt` 依赖已安装
- [ ] `.env` 文件已配置
- [ ] `GROQ_API_KEY` 已设置
- [ ] personal-site `index.html` 已更新
- [ ] 浏览器可以打开 personal-site

启动后验证：

- [ ] `python finagent_web.py` 正常运行
- [ ] 看到 `Running on http://127.0.0.1:5000`
- [ ] personal-site 加载成功
- [ ] FinAgent 卡片显示状态
- [ ] 点击"启动 Web UI"有反应
- [ ] Web UI 在弹窗中打开

---

**现在你可以在 personal-site 中直接使用 FinAgent 了！** 🎉

有问题？查看本指南或检查浏览器控制台错误 (F12)。

