# 个人网站 Personal Site

静态个人网站，包含：关于我、文章、视频、Miscellaneous 四个栏目，以及匿名建议入口。

## 功能

- **栏目**：关于我、文章、视频、Miscellaneous（单页内切换）
- **语言**：简体中文 / English，切换后会保存在本地
- **主题**：黑夜模式 / 白天模式，切换后会保存在本地
- **匿名建议**：点击「匿名建议」在新标签页打开表单页，任何人可匿名填写建议（可配合无痕/隐私窗口使用）

## 本地运行

**推荐：用本地 HTTP 服务器打开**（避免直接用 `file://` 可能出现的样式或脚本问题）

- **方式一（需已安装 Python）**：在项目目录下双击 `serve.bat`，或在终端执行：
  ```bash
  cd personal-site
  python -m http.server 8080
  ```
  然后在浏览器打开：**http://localhost:8080** 或 **http://yulufang.com:8080**（见下方）

- **方式二（需已安装 Node.js）**：
  ```bash
  cd personal-site
  npx serve -p 8080
  ```
  然后打开：**http://localhost:8080**

**用域名 yulufang.com 本地访问**：  
1. 用记事本**以管理员身份**打开 `C:\Windows\System32\drivers\etc\hosts`  
2. 在文件末尾添加一行：`127.0.0.1 yulufang.com`  
3. 保存后，先按上面方式启动本地服务器，再在浏览器打开：**http://yulufang.com:8080**

若直接双击 `index.html` 无法正常显示或切换，请用上面任一方式通过本地服务器访问。

## 使用

1. 用浏览器通过 http://localhost:8080 打开，或部署到 GitHub Pages、Netlify 等。
2. 在 `index.html` 和 `anonymous.html` 中把示例文字、链接替换成你的内容。
3. 匿名表单目前仅前端展示与本地逻辑；若需要真实收集反馈，可：
   - 使用 [Formspree](https://formspree.io/)：在 `anonymous.html` 的 `<form>` 上加上 `action="https://formspree.io/f/你的id" method="POST"`；
   - 或使用 Google 表单等，在页面里放一个链接跳转到你的表单。

## 文件说明

| 文件 | 说明 |
|------|------|
| `index.html` | 首页，含导航与四个栏目内容 |
| `anonymous.html` | 匿名建议页，含表单与语言/主题切换 |
| `styles.css` | 样式（含亮/暗主题变量） |
| `i18n.js` | 中英文案与语言切换 |
| `app.js` | 栏目切换、主题切换、语言按钮 |

## 匿名窗口说明

- 导航栏和页脚的「匿名建议」链接使用 `target="_blank"`，在新标签页打开。
- 访客若希望更匿名，可在浏览器中先打开无痕/隐私窗口，再访问该链接并填写表单。
