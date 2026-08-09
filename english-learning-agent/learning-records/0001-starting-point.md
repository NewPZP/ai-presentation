# 起点画像与课程方向（English Learning Agent）

用户在 2026-08-01 发起本课程，确立以下起点和方向：

## 背景
- 已完成前一课程 `ai-agent-2.0/` 全部 14 课，掌握 Agent 工程核心能力：工具调用、Agent 循环、系统提示、短期/长期记忆、FastAPI 服务化、评估、流式输出、生产部署、Claude 接入、RAG、多 Agent 委托、Workflow vs Agent 决策
- 有 Python/JS 基础，**没有 React/TypeScript/Next.js 经验**——这是本课程的主要学习曲线

## 目标
构建一个**人机协作学习英文文章的 AI Agent 应用**，核心是引导式学习流程：预习单词 → 朗读 → 重点词汇 → 句子讲解 → 练习 → 检验。不是翻译/总结工具，而是像真人英语老师一样的互动教学。

## 技术决策（用户已确认）
- 全栈：Next.js（App Router）+ TypeScript
- AI 框架：Vercel AI SDK（streamText + useChat）
- **LLM 提供方：火山方舟（Volcengine Ark）/ 豆包模型**——用户实际使用的 API。火山方舟提供 OpenAI 兼容接口，因此不用 `@ai-sdk/openai`，改用 `@ai-sdk/openai-compatible` 的 `createOpenAICompatible` 接入。base URL：`https://ark.cn-beijing.volces.com/api/v3`。调用时传**接入点 ID**（如 `ep-2025xxxx-xxxxx`）作为模型名，不传模型名本身。环境变量：`ARK_API_KEY` + `ARK_MODEL_ENDPOINT`。
- UI：聊天式 Web 界面
- 部署：Vercel
- 目标用户：自己用（成人/泛用）

## 课程设计含义
- Agent 概念不重复教，只在用到时标注「对应前一课的 XXX」
- Next.js/React/TS 基础在做中学，不单独开入门课
- 学习流程的架构决策：Workflow（固定节点）+ 节点内 Agent（自由对话）——对应前一课 Lesson 13 的框架
- 每课产出能 `pnpm dev` 跑起来的增量功能
- 共 10 课，从项目搭建到部署上线

## 第一课产出
Next.js + AI SDK 项目搭建，跑通流式聊天界面。用户第一次接触：create-next-app、App Router 目录结构、route.ts（POST handler）、useChat hook、'use client' 指令。
