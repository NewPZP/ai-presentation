# Mission: 用 DeepSeek Harness 打造属于自己的 AI Agent

## Why
用户已经在「AI Agent 2.0」课程中从零手写过 Agent 循环（工具调用、记忆、Web 服务化）。现在他想站在更高的工程起点上——不再手写一切，而是用 DeepSeek Harness（DSH）这套「一切皆插件」的开源 Agent 运行框架，快速拼装出一个真正能干活、可扩展、可部署的个人 AI Agent。

他要的不是又一套理论，而是：
- 能讲清楚 Harness 在 Agent 技术栈中的定位（Model + Harness = Agent）
- 能亲手跑起来 DSH，配置模型、工具、权限
- 知道必备插件有哪些、怎么选、怎么装
- 掌握 Cordis 插件机制，能自己写一个工具插件
- 积累最佳实践和踩坑经验（安全、成本、可追溯、模型切换）

## Success looks like
- 能用一句话解释「Harness 和直接调 LLM API / 和 LangChain 类框架的区别」
- 能在本地启动 DSH Web UI，接入至少一个模型供应商（DeepSeek 或 OpenAI 兼容），跑通一个真实的文件编辑任务
- 能说出四种运行模式（Standard / PTC / Minimal / Creator）的适用场景
- 能安装并使用 3 个以上社区必备插件（dsh-market、modlens、dsh-at-file 等）
- 能写一个最小的 Tool 插件并让模型调用它
- 能配置沙箱权限、看懂 Trajectory 轨迹、控制 API 成本

## Constraints
- 用户已有 Agent 基础（手写过循环、工具、记忆），不要从「什么是 Agent」讲起，直接进入 Harness 层
- 偏个人开发者，单人参战，优先轻量、生产可用、社区活跃的方案
- 中文教学，代码注释用中文
- 优先官方一手资料（harnessdeepseek.org、官方 GitHub、官方 Cordis 教程），辅以高质量社区实测文章
- DSH 仍处于 Developer Preview（0.1.2-rc.1），API 可能变动，教学中要标注版本和「可能变化」的风险

## Out of scope
- Cordis 内核的深度源码剖析（会用到，但不深挖微内核原理）
- 多智能体复杂协作的生产级架构（先把单 Agent + 插件机制吃透）
- 模型微调 / 训练（DSH 是运行时，不涉及训练）
- 纯理论的 Agent Harness 学术综述
