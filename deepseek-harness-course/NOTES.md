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

## 桌面端选型结论（2026-09，第 3 课修订）
- **首选 `anywhere-labs/dsh-desktop`**：macOS Universal + Windows x64、**纯 MIT 可商用**、采用最广（约 28.5k ★）、v2.0.13 固定 harness `v0.1.5-rc.2`、复用 `~/.dsh`。代价：Electron，macOS 包约 304MB。
- **轻量替代 `dsh-tauri`**：Tauri 2，macOS 包约 10MB；但许可 **MIT 附加非商用条款** → 商用不可。
- **长期正解：官方桌面端**（即将发布，macOS AS+Intel / Win x64，`dsh-app://` 协议不走本地端口）。
- ⚠️ **教训**：我在上一版第 3 课曾把 dsh-tauri 列为首选，理由是「唯一支持 macOS + 轻量」，但**漏查了许可证里附加的非商用条款**。用户带来 anywhere-labs 这个更主流的项目后修正。**选型清单必须包含「许可证额外条款」和「固定内核版本」两项，不能只看 star 和平台。**
- 社区桌面壳的升级路径是高发故障区（DSH Desktop 的 issue 集中在升级回退、启动 EPERM、置顶弹窗），实操建议：**升级前退出旧版、保留上一版安装包以便回滚**。

## 课程进度（全 6 课已完成 🎓）
- 第 1 课（心智模型：Agent = Model + Harness，一切皆插件）✅
- 第 2 课（安装 + 四种运行模式 + 沙箱三档）✅
- 第 3 课（必备插件：dsh-market / modlens / dsh-at-file / 界面二选一）✅
- 第 4 课（沙箱真实边界 + 审批缝隙 CVE-2026-82533 + Trajectory 可追溯）✅
- 第 5 课（插件骨架 + defineTool + 加载 + 打包 + 三层验证）✅
- 第 6 课（模型切换 + 成本控制 + 能力三层拆分 + 毕业收尾）✅

课程结构：6 课 + 5 份参考文档（cordis-glossary / plugins-quick-ref / sandbox-trajectory-quick-ref / tool-plugin-dev-quick-ref / model-cost-quick-ref）。
**后续 session 方向**：不再加课。用户该拿真实项目练手；若回来提问，优先按 Gaps 里的「MCP 集成」「多 Agent 协作」或具体踩坑切入。

## 关键事实（第 6 课沉淀）
- 换模型三层：改 Settings（99%）→ 改 cordis.yml 的 `provider`/`model` → 继承 `LlmAdapter` 实现 `stream()` 并 `ctx.llm.registerAdapter(providers, adapter)`
- StreamChunk 协议：`block-start`/`block-end` 成对、`index` 从 0 递增、`usage` 必须在 `finish` 之前、`finish` 必须最后
- 适配器错误处理：抛带稳定 code 的 `LlmError`（勿依赖普通 Error）、合并 `attributionHeaders()`、透传 `options.signal`、不支持字段要抛错不得静默丢弃
- **成本核心洞察**：每次调用都重发整个 surface → 上下文越长，之后**每一步**都更贵（累积成本）。省钱主战场是上下文，不是回复长度
- Token 两个口径：`totalTokens`（请求+响应压力）vs `surfaceTokens`（表层路由定价总量 = 各节点之和）；`baseline.kind`：`usage`（真实锚点，准）/ `estimated`（启发式估算）
- 省钱四动作：控制 surface（做完开新会话）· 按任务选模型 · 利用峰谷定价（闲时半价，dsh-peak-indicator）· 装成本看板（dsh-cost-meter）
- 官方五条实践：可丢弃目录 · workspace-write+ask · pin 版本 · 审查插件/MCP/Skills/Hooks · 凭证不进工作区
- 能力三层拆分：Definition / Provider / Consumer（Bash = dsh-shell / dsh-bash-local / dsh-tool-bash）；**不要预防性拆分**，只在角色需独立演进时才分包；显式优于隐式

## 关键事实（第 5 课沉淀）
- 插件契约：导出 `name` + `apply(ctx)`；`ctx` 注册的一切在卸载时自动清理，手动资源用 `ctx.effect(() => cleanup)`
- `export const inject = ['tools']` 让 Cordis 等 tools 服务就绪再 apply（否则 `ctx.tools` 可能 undefined）
- 工具用 `defineTool` 注册：`name` / `description`（模型据此决定调不调）/ `parameters`（自动校验并推导 args 类型）/ `output.schema`（规范值类型）/ `output.render`（转模型可见内容）/ `execute(args, exec)`
- execute 约定：返回「规范值」而非内容块；抛异常 = isError；合法的不理想结果写进规范值；遵守 `exec.signal`
- 开发加载：patch overlay `cordis.yml` 用 `insert` + **绝对路径**，`pnpm dsh web --patch ./scratch-plugin/cordis.yml`；写插件官方要求源码 checkout（为了 `@deepseek-ai/dsh-tools` 的类型）
- 配置原则：**不同部署可能要换值的参数一律做成 Config 字段**（检验：能否在 cordis.yml 改而不动代码）
- 打包：bundle（`dsh.bundle.patch`）vs profile（`dsh.profile.bundles`）；`dsh plugin --profile web add ./pkg`；`--dump-config` 验证层
- 四层加载顺序：bundles → profile 的 cordis.patch.yml → `$DSH_HOME/cordis.patch.yml` → `--patch` overlay；后者胜，且 patch **整体替换** config（非深度合并）
- git 安装坑：拉源码不跑 build（需作者 `prepare`）；pnpm≥10 默认拦截，需 `allowBuilds` 授权——等于允许其代码在安装时于本机执行，**不在沙箱内**
- 验证链：加载日志 → 工具进表 → Trajectory 里的 `tool/call` + `tool/result`（第 3、4 课在此合上）

## 关键事实（第 4 课沉淀）
- 沙箱**只管文件写入**；读取、网络、进程可见性、凭证都不在管辖内（官方 Features 页原话：reads and network access are not confined）
- 审批**只在命令请求超出会话现有权限时**触发，普通命令不弹——CVE-2026-82533 正是绕过了这一点（改设置而非请求权限）
- 受影响：0.1.1-rc.2 及更早；修复：0.1.2-alpha.2 起上 npm，当前 0.1.2-rc.1 已含修复（一次性 token + 签名 cookie）
- 会话日志：`session.jsonl.zstd`（append-only JSONL，zstd 压缩）；resume/fork/search/replay 共用同一流
- 轨迹工具：内置 Trajectory tab（首选）→ dsh-trajectory（导出 HTML）→ dsh-replay（时间旅行调试）
- 官方安全声明：未经安全审计，沙箱与审批「不保证隔离」

## 版本信息
- DSH 当前版本：0.1.2-rc.1（npm next 通道），0.1.1-rc.2（npm latest 通道）
- Node.js 要求：^22.19.0 或 >=24.0.0
- 启动命令：`npx @deepseek-ai/dsh web`（默认跟随 latest，体验新版需 pin 版本）
