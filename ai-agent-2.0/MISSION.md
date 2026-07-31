# Mission: 从零构建并部署一个能真正干活的 AI Agent

## Why
用户是 AI 新手（会用 ChatGPT、会一点编程），目标是做一个用于个人项目/创业的 Agent 产品。他听过「AI Agent 2.0」这个说法，想要的是 Agent 工程实战能力——不是理论科普，而是能从零把一个 Agent 跑起来、调好、上线交付的全栈能力。学会之后，他可以独立做出自己的 Agent 产品或 Side Project。

## Success looks like
- 能用一句话讲清楚「Agent 和直接调 LLM API 有什么区别」，并且自己写的代码体现了这个区别
- 能从零写出一个带工具调用、循环、记忆的最小 Agent（不依赖重型框架）
- 能为一个具体场景设计 Agent 的工具集、系统提示、评估方式
- 能把一个 Agent 部署成可被他人使用的服务（API 或 Web）
- 能判断什么时候该用 Agent、什么时候该用更简单的工作流（不盲目堆复杂度）

## Constraints
- 起点是 AI 新手 + 会点编程（Python/JS 基础），不能假设已懂 Prompt Engineering 或调过 LLM API
- 偏向个人项目/创业，单人参战，所以要优先选择轻量、生产可用、社区活跃的技术栈
- 用中文教学，代码注释也用中文
- 优先 Anthropic / OpenAI / Lilian Weng 等一手权威资料，不依赖二手解读

## Out of scope
- 模型训练 / 微调 / RAG 系统的深入实现（先聚焦 Agent 本身）
- 多智能体复杂协作框架的源码剖析（先把单 Agent 做扎实）
- Agent 的安全对抗攻防（先能跑起来，安全作为进阶）
- 纯理论方向的 LLM 前沿研究综述
