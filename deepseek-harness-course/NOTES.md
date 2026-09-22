# NOTES.md — 教学笔记

## 用户画像（从 ai-agent-2.0 课程继承）
- 已学完 Agent 基础：手写过循环、工具调用、记忆、Web 服务化（FastAPI）
- 会一点编程（Python/JS 基础）
- 目标：做个人项目/创业的 Agent 产品，要真能交付

## 教学偏好
- 中文教学，代码注释用中文
- 偏实战，每节课要有可运行的产出
- 不喜欢空泛理论，要落到代码和决策上
- 喜欢按课序推进

## 教学策略
- 起点：直接从 Harness 层切入，不重复「什么是 Agent」
- 先建立心智模型（Agent = Model + Harness），再动手安装
- DSH 仍在 Developer Preview，版本锁定 0.1.2-rc.1，教学中标注变动风险
- 插件部分先「用」再「写」：先装社区必备插件体验，再动手写自己的 Tool 插件
- 强调安全：沙箱权限、API Key 管理、不要一上来就 danger-full-access

## 课程进度
- 第 1 课（心智模型：Agent = Model + Harness，一切皆插件）✅
- 第 2 课（安装 + 四种运行模式 + 沙箱三档）✅
- 第 3 课（必备插件：dsh-market / modlens / dsh-at-file / 界面二选一）✅
- 第 4 课（待创建：沙箱权限精细控制 + Trajectory 可追溯）
- 第 5 课（待创建：写第一个 Tool 插件）
- 第 6 课（待创建：模型切换、成本控制与最佳实践）

## 版本信息
- DSH 当前版本：0.1.2-rc.1（npm next 通道），0.1.1-rc.2（npm latest 通道）
- Node.js 要求：^22.19.0 或 >=24.0.0
- 启动命令：`npx @deepseek-ai/dsh web`（默认跟随 latest，体验新版需 pin 版本）
