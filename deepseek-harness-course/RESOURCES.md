# DeepSeek Harness 学习资源

## 一手权威资料

- [官方网站 harnessdeepseek.org](https://harnessdeepseek.org/)
  DSH 官方站，包含 Features（四种模式、沙箱、Trajectory）、Guides（踩坑修复）、下载页。**本课程的核心锚点**。Use for: 功能清单、运行模式、沙箱策略、版本号、最佳实践。

- [官方 GitHub 仓库 deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
  MIT 协议开源，2026-08-13 发布 v0.1 开发者预览版。Use for: 源码阅读、issue 跟踪、Cordis 教程。

- [官方文档站 deepseek-harness.github.io](https://deepseek-harness.github.io/deepseek-harness/)
  包含 Cordis 教程（7 章）、第一个 Harness 插件、开发工具插件等中文文档。Use for: 写插件时的权威参考。

- [Cordis 教程（中文）](https://deepseek-harness.github.io/deepseek-harness/develop/cordis-tutorial/)
  官方出品，从「你的第一个插件」到「进入 harness」，7 章可运行示例。Use for: 理解插件机制、生命周期、服务、事件、配置。

## 高质量社区实战

- [freeCodeCamp: What Is an Agent Harness?](https://www.freecodecamp.org/news/what-is-an-agent-harness/)
  把 Claude Code、DSH、Pi 等放在同一架构下对比，讲清楚 Harness 五层模型（工具路由、记忆、规划、沙箱、循环）。Use for: 理解 Harness 在 Agent 技术栈中的定位。

- [DEV.to: DeepSeek Harness: How DeepSeek Uses Cordis](https://dev.to/worldlinetech/deepseek-harness-how-deepseek-uses-cordis-to-redefine-autonomous-ai-agents-599)
  「Kernel to Edge」系列第二篇，讲 DSH 如何用 Cordis 做微内核、和其他框架的对比。Use for: 架构理解。

- [腾讯云：整理了一份 DeepSeek Harness 必备插件清单](https://cloud.tencent.com/developer/article/2734408)
  实测前 10 名社区插件，每个附安装命令和适用人群。Use for: 插件选型。

- [腾讯云：怎么给 DeepSeek Harness 写个插件](https://cloud.tencent.com/developer/article/2726947)
  从打印日志到注册 `text_stats` Tool 的完整流程，附加载证据、Tool call、Trajectory 三类验收标准。Use for: 写第一个插件的实战参考。

- [CSDN: DeepSeek Harness(dsh)插件开发实战](https://blog.csdn.net/qq8864/article/details/163759151)
  以 `dsh-session-export` 为例，讲事件订阅、配置补丁（cordis.patch.yml）、构建安装。Use for: 事件型插件的实现模式。

## Wisdom (Communities)

- [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)
  官方问答区，踩坑和插件开发问题优先在这里搜。Use for: 问题排查、官方回应。

- [dsh-plugin topic on GitHub](https://github.com/topics/dsh-plugin)
  社区插件索引。Use for: 发现新插件。

## Gaps

- 暂缺：针对「中文路径 + macOS」的端到端部署踩坑汇总（官方 Guides 偏 Windows/Linux）
- 暂缺：DSH 与 MCP 集成的完整中文教程（官方提到 MCP 但教程分散）
