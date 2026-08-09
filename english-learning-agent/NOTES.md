# NOTES.md — 教学笔记

## 用户画像（承接 ai-agent-2.0 课程）
- 已完成 14 课 AI Agent 工程训练，掌握：工具调用、Agent 循环、系统提示、短期/长期记忆、FastAPI 服务化、评估、流式输出、生产部署、Claude 接入、RAG、多 Agent 委托、Workflow vs Agent
- 有 Python/JS 基础，**没有 React/TypeScript/Next.js 经验**——这是本课程的主要学习曲线
- 目标：做一个自己会用的英文学习产品，要真能跑，不接受空泛理论
- 偏好顺序学习，按课号递进

## 教学偏好（沿用）
- 中文教学，代码注释用中文
- 偏实战，每课有可运行产出
- 不喜欢空泛理论，要落到代码和决策上

## 教学策略
- Agent 概念不重复教（已掌握），只在用到时点明「这对应前一课程的 XXX」
- Next.js/React/TS 基础穿插在项目中教，不单独开「React 入门课」——在做中学
- 每课产出能 `pnpm dev` 跑起来的增量功能
- 学习流程设计是 Workflow（固定节点）+ 节点内 Agent（自由对话）——对应前一课 Lesson 13 的决策框架
- 第一课就用 AI SDK 官方 quickstart 做底，确保 API 是最新的
- **第 4 课插入了 UI 设计基础课**（用户要求），课程从 10 课变 11 课。第 4 课引入 shadcn/ui + 设计令牌 + 组件拆分，为后续课打 UI 地基。后续课复用 MessageBubble / PhaseProgress / FileImporter 组件。

## 已知坑点（国内开发环境）
- **Google 字体下载失败**：Next.js 默认模板用 `next/font/google` 加载 Geist 字体，构建时去 `fonts.googleapis.com` 拉取，国内被墙导致卡死或报错。解法优先级：① 删掉 Google 字体用系统字体（最简）② 设 `NEXT_FONT_GOOGLE_MIRROR_URL=https://fonts.googleapis.cn` 走镜像 ③ `next/font/local` 自托管。第一课已内置「排坑」小节。

## 待确认
- 是否已安装 Node.js 22+ 和 pnpm
