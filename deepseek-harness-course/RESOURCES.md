# DeepSeek Harness 学习资源

## 一手权威资料

- [官方网站 harnessdeepseek.org](https://harnessdeepseek.org/)
  DSH 官方站，包含 Features（四种模式、沙箱、Trajectory）、Guides（踩坑修复）、下载页。**本课程的核心锚点**。Use for: 功能清单、运行模式、沙箱策略、版本号、最佳实践。

- [官方 GitHub 仓库 deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
  MIT 协议开源，2026-08-13 发布 v0.1 开发者预览版。Use for: 源码阅读、issue 跟踪、Cordis 教程。

- [官方文档站 deepseek-harness.github.io](https://deepseek-harness.github.io/deepseek-harness/)
  包含 Cordis 教程（7 章）、第一个 Harness 插件、开发工具插件等中文文档。Use for: 写插件时的权威参考。

- [官方 · 第一个 Harness 插件](https://deepseek-harness.github.io/deepseek-harness/develop/basic/)
  插件的最小契约（`name` + `apply(ctx)`）、`inject` 声明依赖、`ctx.effect()` 手动清理、三种插件形态。Use for: 插件骨架。

- [官方 · 开发一个 Tool](https://deepseek-harness.github.io/deepseek-harness/develop/basic/tool)
  `defineTool` 完整可运行示例（greet 工具）+ `--patch` 加载 + 让模型调用的提示词。**第 5 课主源**。Use for: 写第一个工具。

- [官方参考 · 工具编写参考](https://deepseek-harness.github.io/deepseek-harness/reference/cookbook/adding-a-tool)
  面向模型的工具必须满足的约定：参数校验、只读定义、规范值、isError、`exec.signal`、后台任务、策略钩子、UI 卡片。Use for: 工具「生产可用」的判据。

- [官方 · 插件配置](https://deepseek-harness.github.io/deepseek-harness/develop/basic/config)
  Config 类型 + Schemastery schema、默认值、加载时校验、HMR 热替换。Use for: 让插件接受配置。

- [官方 · 打包与安装插件](https://deepseek-harness.github.io/deepseek-harness/develop/basic/publish)
  bundle vs profile、`dsh plugin add`、四层加载顺序、patch 整体替换 config、git 安装的 `prepare` / `allowBuilds` 授权。Use for: 把插件交付给自己或别人。

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

## 安全与可追溯（第 4 课）

- [The Hacker News: DeepSeek Harness Flaw Let AI Agents Disable Their Own File Sandbox](https://thehackernews.com/2026/09/deepseek-harness-flaw-let-ai-agents.html)
  CVE-2026-82533 完整报道（评分 9.4/10）：Agent 一条命令调用本机无认证接口、把自己切成 `danger-full-access`。讲清了「审批只在请求更大权限时触发」的缝隙，以及修复版本谱系。Use for: 沙箱与审批的真实边界、安全心态。

- [官方 Features 页 · Sandbox & Trajectory](https://harnessdeepseek.org/features.html#sandbox)
  沙箱三档的权威表格，明确列出「管不到的地方」（网络、进程可见性、凭证读取）；Trajectory 部分说明记录范围与新增能力。**第 4 课的核心一手来源**。Use for: 沙箱边界、Trajectory 能力清单。

- [dsh-trajectory](https://github.com/ciceroyang/dsh-trajectory)
  把 `session.jsonl.zstd` 渲染成可分享的自包含 HTML（零依赖、附 SHA-256）。Use for: 交付审计、把轨迹发给别人复核。

- [dsh-replay](https://github.com/zoahdev/dsh-replay)
  时间旅行调试器：对会话日志做 replay / visualize / diff。Use for: 精修 Agent 行为时的深度调试。

## 模型、成本与架构（第 6 课）

- [官方 · LLM 适配器](https://deepseek-harness.github.io/deepseek-harness/develop/practice/llm-adapter)
  继承 `LlmAdapter` 实现 `stream()`、`ctx.llm.registerAdapter`、StreamChunk 协议、`GenerateOptions`、`LlmError` 错误约定。仓库内有 `llm-deepseek`（OpenAI 兼容）与 `llm-pi-ai` 两个完整实现可对照。Use for: 接入新模型供应商。

- [官方 · 能力的三层角色设计](https://deepseek-harness.github.io/deepseek-harness/develop/practice/)
  Service Definition / Service Provider / Consumer 三种角色（以 Bash 为例），以及「不要预防性拆分」「显式优于隐式」。Use for: 让能力可替换的架构习惯。

- [官方参考 · Token 计量](https://deepseek-harness.github.io/deepseek-harness/reference/subsystems/token-meter)
  `TokenMeasurement`：`totalTokens`（请求+响应压力）vs `surfaceTokens`（表层路由定价总量）、`baseline` 的 `usage` / `estimated` 两种口径。Use for: 理解成本从哪来。

- [官方 Guides · 最佳实践与排错](https://harnessdeepseek.org/guides.html)
  首次运行五条实践，加上 Node 版本、端口 3080、Windows ACL、**中文路径**、pnpm 模块、沙箱 HTTPS、杀毒告警等排错。Use for: 日常踩坑速查。

- [dsh-peak-indicator](https://github.com/future007s/dsh-peak-indicator)
  会话头部徽标显示当前收费档期（⚡高峰原价 / 🌙闲时半价）+ 距下次切换倒计时，每 30 秒刷新。Use for: 把批量任务挪到闲时省钱。

## 桌面客户端（第 3 课补充）

- [anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)（DSH Desktop）**← 当前首选**
  社区采用最广的桌面客户端（2026-09-22：约 28.5k ★ / 1,352 fork / 346 open issues，当日仍有提交）。**macOS Universal（Intel + Apple Silicon）+ Windows x64**，**纯 MIT 可商用**。Electron 外壳，自带 Node/pnpm/固定版本内核，安装包较大（macOS DMG 约 304MB）。**v2.0.13 固定 harness `v0.1.5-rc.2`**（远在 CVE 修复线之上），复用 `~/.dsh`；Beta 通道固定 `v0.1.6-alpha.2` 并用独立 `~/.dsh-beta`。默认只监听回环；局域网开放**无鉴权**，官方标为危险。Use for: macOS 上开箱即用、且要商用的首选。

- [dsh-tauri/deepseek-harness-desktop](https://github.com/dsh-tauri/deepseek-harness-desktop)
  轻量替代（2026-09-22：约 2.5k ★）。**Tauri 2**，macOS 包仅约 10MB、内存占用低；Windows / macOS / Linux 三平台。首次启动预设插件含 DSH Market、DSH-better-sidebar、dsh-rewind、DSH-IM。要求 harness `0.1.5-rc.1+`。⚠️ 许可为 MIT **附加非商用条款**。Use for: 只看重轻量、且非商用场景。

- [快科技：DeepSeek Harness 官方桌面端即将就绪](https://post.smzdm.com/p/awwzp3w4/)
  官方桌面端状态：主分支已新增 `apps/desktop`，支持 **macOS Apple Silicon / Intel + Windows x64**（暂无 Linux）。相比第三方的两点架构优势：不走本地端口、改用 `dsh-app://` 协议传数据；与运行时/后端整体打包，版本维护一致。Use for: 桌面端选型与「等官方还是用社区」的判断。

- [ningbainb/deepseek-harness-desktop](https://github.com/ningbainb/deepseek-harness-desktop) · [Links2008/DeepSeek-Harness-Desktop](https://github.com/Links2008/DeepSeek-Harness-Desktop)
  功能较丰富的两份 **Windows 专有** 桌面封装（内置插件商店、SSH、主题、常驻 daemon 等）。macOS 不可用。Use for: 了解生态全貌；Windows 用户可参考。

## Wisdom (Communities)

- [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions)
  官方问答区，踩坑和插件开发问题优先在这里搜。Use for: 问题排查、官方回应。

- [dsh-plugin topic on GitHub](https://github.com/topics/dsh-plugin)
  社区插件索引。Use for: 发现新插件。

## Gaps

- **部分补上**：中文路径导致 `workspace-invalid-path` 的问题，官方 Guides 已确认 `0.1.2-rc.1` 修复了 Win32 拾取器的截断；但「中文路径 + macOS」的端到端汇总仍缺（官方 Guides 偏 Windows/Linux）
- 暂缺：DSH 与 MCP 集成的完整中文教程（官方提到 MCP 但教程分散）
- 暂缺：多 Agent 协作与子代理调度的中文实战（本课程刻意未覆盖，见 MISSION「Out of scope」）
