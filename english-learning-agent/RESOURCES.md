# English Learning Agent — Resources

## Knowledge

### Vercel AI SDK（核心框架）
- [Docs: AI SDK Overview](https://ai-sdk.dev/docs/foundations/overview)
  AI SDK 官方文档入口。AI SDK 是 TypeScript 生态最成熟的多模型统一调用库，核心抽象：`streamText` / `generateText` / `useChat` / `tool`。**本课程的核心框架**。
- [Docs: Next.js App Router Quickstart](https://ai-sdk.dev/docs/getting-started/nextjs-app-router)
  官方快速上手：用 `create-next-app` 搭项目，写 `/api/chat` 路由，接 `useChat` 前端。**第一课的主参考**（原文用官方 OpenAI，我们换成 openai-compatible 接火山方舟）。
- [Docs: Chatbot (useChat)](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
  `useChat` hook 完整文档：`sendMessage`、`status`（submitted/streaming/ready/error）、`stop`、`regenerate`、`setMessages`、自定义 body/headers、message metadata。
- [Docs: Tools and Tool Calling](https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling)
  用 `tool()` + Zod schema 定义工具，`stopWhen` 控制多步工具循环。对应前一课程的 Agent 工具概念。
- [Docs: Chatbot Tool Usage](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage)
  前端如何渲染工具调用的 `tool-{name}` part，做 generative UI。
- [Docs: OpenAI Compatible Providers](https://ai-sdk.dev/providers/openai-compatible-providers)
  用 `createOpenAICompatible` 接入任意 OpenAI 兼容服务。**火山方舟、DeepSeek、Moonshot 等国产模型都走这条路**。
- [GitHub: ai-chatbot (Vercel 官方模板)](https://github.com/vercel/ai-chatbot)
  生产级 Next.js AI 聊天应用模板，含持久化、认证、流式恢复。进阶阶段参考。

### 火山方舟（Volcengine Ark / 豆包模型）
- [火山方舟控制台](https://console.volcengine.com/ark)
  创建接入点（Endpoint）、管理 API Key、查看模型列表。
- [火山方舟 API 调用指南](https://www.volcengine.com/docs/82379/1298454)
  官方 API 文档。base URL：`https://ark.cn-beijing.volces.com/api/v3`，调用时传接入点 ID（如 `ep-2025xxxx-xxxxx`）作为模型名。
- 关键约定：豆包模型（doubao-1.5-pro、doubao-1.5-lite 等）通过「接入点」调用，接入点 ID ≠ 模型名。在控制台「在线推理」里创建接入点，复制 ID 用。

### Next.js
- [Docs: Next.js App Router](https://nextjs.org/docs/app)
  App Router 官方文档：Route Handlers（`app/api/*/route.ts`）、Server/Client Components、文件路由。
- [Learn: Next.js 官方教程](https://nextjs.org/learn)
  官方交互式教程，适合补 React/Next.js 基础。

### PDF / 文本提取
- [npm: pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist)
  Mozilla PDF.js 的 npm 包，浏览器和 Node.js 均可用，文本提取最可靠。**第二课主选**。
- [npm: pdf-parse](https://www.npmjs.com/package/pdf-parse)
  更简单的 Node.js PDF 文本提取，适合纯后端场景。
- [npm: mammoth](https://www.npmjs.com/package/mammoth)
  Word (.docx) → 纯文本/HTML 转换。

### Agent 工程方法论（复用前一课程）
- [Article: "Building Effective Agents" — Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
  Workflow（预定义路径）vs Agent（LLM 自主控制）的取舍。本应用的学习流程是 **Workflow 驱动 + Agent 辅助**——流程节点确定，节点内由 LLM 自由对话。

### 语言学习教学法
- [Wikipedia: Spaced Repetition](https://en.wikipedia.org/wiki/Spaced_repetition)
  间隔重复原理：Leitner 系统、SM-2 算法。用于设计「复习已学词汇」的调度逻辑。
- [Wikipedia: Extensive Reading](https://en.wikipedia.org/wiki/Extensive_reading)
  泛读理论：大量阅读适合自己水平的材料，注意力在内容而非语言形式。本应用的朗读环节参考此理念。
- [Article: Paul Nation — Vocabulary Learning](https://www.victoria.ac.nz/lals/about/staff/publications/paul-nation)
  词汇学习权威研究者。核心观点：高频词优先、从语境中学、需要多次接触（spaced）。

## Wisdom (Communities)
- [r/languagelearning](https://www.reddit.com/r/languagelearning/)
  语言学习社区，有 AI 辅助学习的真实体验讨论。
- [Vercel Community (Discord)](https://vercel.com/discord)
  Next.js + AI SDK 的工程问题答疑。

## Gaps
- 待补：AI SDK `useObject`（结构化流式输出）的实战教程——用于练习题生成。
- 待补：Next.js Server Actions 与 AI SDK 结合的最佳实践——用于学习状态持久化。
