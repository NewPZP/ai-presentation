# NOTES.md — 教学笔记

## 用户画像（2026-07-28 首次对话确立）
- AI 新手：会用 ChatGPT，但没系统学过 LLM/Agent
- 会一点编程（Python/JS 基础），但没调过 LLM API
- 目标：做个人项目/创业，要真能交付，不只要理论
- 听过「AI Agent 2.0」这个词，理解为「Agent 工程实战」

## 教学偏好
- 中文教学，代码注释用中文
- 偏实战，每节课要有可运行的产出
- 不喜欢空泛理论，要落到代码和决策上

## 教学策略
- 起点：从「LLM 调用 vs Agent」的最小心智模型切入，先给一个能跑的 15 行 Agent
- 不要一开始就上 LangChain/LangGraph，先用原生 Python + OpenAI/Anthropic SDK，让概念清晰
- 每个概念都要有「为什么需要它」的真实场景，避免为教而教
- 「Agent 2.0」框架：在教学中区分 1.0（AutoGPT 式、脆弱、单 Agent、纯 prompt 驱动）和 2.0（工具原生、有 harness、有评测、有持久状态、可控），让用户知道自己在学的是后者

## 待确认
- 用户更倾向 Python 还是 JS/TS（首次代码先用 Python，必要时再问）
- 是否已有 OpenAI 或 Anthropic 的 API Key
