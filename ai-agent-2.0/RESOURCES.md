# AI Agent Engineering Resources

## Knowledge

- [Article: "Building Effective Agents" — Anthropic](https://www.anthropic.com/engineering/building-effective-agents)
  Anthropic 与数十家企业合作后的实战总结。核心区分 Workflow（预定义路径）vs Agent（LLM 自主控制路径），并给出 5 种工作流模式 + 自主 Agent 的取舍。**本工作区的核心锚点**，第一课就基于它。Use for: 何时该用 Agent、何时该用更简单的工作流、五种编排模式。

- [Article: "LLM Powered Autonomous Agents" — Lilian Weng](https://lilianweng.github.io/posts/2023-06-23-agent/)
  OpenAI 研究主管 2023 年的开山之作，把 Agent 拆成 Planning + Memory + Tool Use 三大组件。虽然是 2023 年，但仍是所有后续讨论的基底。Use for: Agent 的经典三件套定义、ReAct/CoT 规划、记忆分类。

- [Whitepaper: "Agents" — Google](https://www.kaggle.com/whitepaper-agents)
  Google 官方 Agent 白皮书，把 Agent 讲得很系统，适合作为入门的权威补充。Use for: 与 Anthropic 视角对照、认知架构、工具调用的形式化定义。

- [Docs: OpenAI Agents SDK（中文）](https://openai-agents-sdk.doczh.com/)
  OpenAI 把实验性 Swarm 升级为生产级 SDK，是 2026 年 Agent 工程的主流运行时之一。核心抽象：Agent / Runner / Tool / Handoff / Guardrail。Use for: 进阶阶段的实战框架、多 Agent 委托、生产部署。

- [Course: ai-engineering-from-scratch (GitHub)](https://github.com/multica-ai/andrej-karpathy-...)（待补全精确链接）
  2026 年 5 月 GitHub 热榜项目，503 课、20 阶段、约 320 小时，从线性代数到多智能体。Use for: 当用户需要补 AI 基础底子时的系统化路径。注意：体量大，不全与 Agent 直接相关，按需取用。

## Wisdom (Communities)

- [r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/)
  偏本地模型与 Agent 实操讨论，信号密度高。Use for: 工程实战经验、踩坑分享、模型选型。
  *待确认用户是否愿意加入英文社区*

- [WayToAGI 飞书知识库](https://waytoagi.feishu.cn/)
  中文 AI 社区，有 LLM Agent 的中文翻译和讨论。Use for: 中文语境下的 Agent 实践交流。

## Gaps

- 暂缺：针对「中文 + 个人开发者 + 从零到上线」的端到端 Agent 部署教程。后续需要在第一课之后补充一个「把 Agent 跑成本地服务」的资源。
- 暂缺：Agent 评测（evals）的高质量入门资料，等用户做到那一步时再找。
