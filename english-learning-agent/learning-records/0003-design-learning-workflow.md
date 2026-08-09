# 0003 — 设计学习工作流（状态机）

## 学到了什么
- **Workflow + Agent 混合架构**：学习大流程（6 阶段顺序）路径可预测 → Workflow 固定；阶段内对话灵活 → Agent 自由。直接落地前一课 Lesson 13 的判断框架。
- TypeScript 联合类型 `type Phase = "preview" | "reading" | ...` 定义状态机的状态集合，编译期抓拼写错误（比 Python Enum 更严格）
- `Record<Phase, PhaseInfo>` / `Record<Phase, string>` 保证每个阶段都有配置/提示，漏了就编译报错——类型系统做完整性检查
- 数据驱动：`PHASE_ORDER` 数组存顺序，`getNextPhase` 用 `indexOf + 1` 算转移，加阶段只需插数组项
- 阶段专属系统提示写成数据（`PHASE_PROMPTS`），用 `{article}` 占位符 + `.replace()` 注入文章，不写进后端逻辑
- `sendMessage` 的 body 同时传 `articleText` 和 `phase`，后端按 phase 选提示
- 同样输入不同状态不同行为 = 状态机的本质（「开始」在预习阶段列生词，在练习阶段出题）

## 关键代码位置
- `lib/learning-phases.ts` — 课程引擎：Phase 类型、PHASE_ORDER、PHASE_INFO、getNextPhase、PHASE_PROMPTS
- `app/api/chat/route.ts` — 从 body 取 phase，`PHASE_PROMPTS[phase].replace("{article}", articleText)` 组装 instructions
- `app/page.tsx` — currentPhase 状态 + 进度条 + 「进入下一阶段」按钮 + body 传 phase

## 非显然决策
- **阶段切换让用户点按钮，不让 AI 自动判断**：「学完了没」是主观的，用户可能想多问。控制权在人手里符合成人自主阅读定位。AI 只在阶段末尾提示「可以说下一步」，引导不强制。
- **提示写成数据而非写进后端**：提示是教学内容会频繁调整，放独立文件改教学不动后端逻辑，职责清晰。
- **用 Record 而非普通对象**：保证状态机每个状态都有配置，类型系统兜底。
- **阶段切换是前端状态（不持久化）**：刷新就丢，第 8 课做持久化。

## 待优化（后续课程处理）
- 阶段提示是粗稿 → 第 4-7 课逐个打磨
- 没记住学过什么（切到练习 AI 不知预习讲了哪些词）→ 第 8 课持久化
- 阶段切换纯手动 → 第 9 课用工具调用让 AI 建议切换
- 没限制 AI 越界（预习阶段可能出题）→ 第 6 课用结构化输出约束

## 概念对应
- `Phase` 联合类型 = Python Enum（但编译期更严格）
- `PHASE_ORDER` + `getNextPhase` = 状态机转移函数
- Workflow + Agent 混合 = 前一课 Lesson 13 的判断框架落地
