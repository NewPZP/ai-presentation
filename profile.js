// profile.js —— 个人主页「个人信息」配置
// 本文件只负责页面上方的个人信息区、社交入口、关于我、联系区、页脚等文案；
// 作品墙（卡片）的数据请到 courses.js 配置。
const PROFILE = {
  // ===== 顶部个人信息区（banner）=====
  name: "阿票",               // 姓名：banner 大标题
  nameInitial: "票",           // 头像里的单字（一般取姓名首字）
  position: "AI 定制",    // 职位/头衔：显示在姓名下方
  heroDesc: "把复杂的 Agent 与工作流拆开讲透，再把它们做成一个个真正能运行的作品。", // 姓名下方的一句话简介

  // ===== 姓名下方的小图标链接（可增减；url 留空则该图标不显示）=====
  socials: [
    { label: "GitHub",  url: "https://github.com/NewPZP" },   // label=按钮文案, url=点击跳转
    { label: "Bilibili", url: "https://space.bilibili.com/45918211" },
    { label: "Email",   url: "mailto:pan.zhipiao@qq.com" }
  ],

  // ===== 关于我（页面中段，每个字符串渲染成一个段落）=====
  about: [
    "西电毕业，目前在杭州定居，老家温州。",
    "深感 AI 的浪潮影响了各行各业，是危机也是挑战……"
  ],

  // ===== 联系区（页面底部）=====
  email: "pan.zhipiao@qq.com",        // 联系邮箱：决定「发送邮件」按钮的收件地址
  contact: {
    title: "想一起做些东西？",          // 联系区标题
    desc: "欢迎来信交流，或约一杯咖啡。"  // 联系区副文案
  },

  // ===== 页脚 =====
  footer: "© 2026 阿票 · 个人主页"     // 页面最底部版权行
};
