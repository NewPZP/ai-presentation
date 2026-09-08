# Mission: 用 AI Agent + Skill 从零交付一个应用（以 LinguaAI 为案例）

## Why
用户在 2026-08-01 至 09-07 期间，用 TRAE Work + GLM-5.3，借助一套工程 Skill 套件（setup-matt-pocock-skills → grill-me/grilling 讨论需求 → to-spec 整理需求发 issue → to-tickets 拆分需求 → implement 实现，过程中按需调用 tdd、code-review 等），以 20+ 会话、36 个 GitHub issue 从零交付了 LinguaAI，总成本约 5000 积分。现在要把这套「怎么用 Agent 和 Skill 开发」的工作方法沉淀成一套可教学的课程——重点不是 LinguaAI 的技术细节，而是**驾驭 AI Agent 协作范式 + 用好 Skill 流水线**。

## Success looks like
- 完成一套 7 课的紧凑课程（每课一个 HTML，含练习与即时反馈测验），按阶段组织：全景 → 需求 → 实现 → 踩坑 → 技术实现 → 元课程（teach skill 生成本教程）→ 展望挖坑
- 需求课讲透 grill-me → to-spec → to-tickets 流水线；实现课讲透 implement + tdd + code-review；踩坑课复盘真实 bug；均基于 `.agents/skills/` 真实 SKILL.md
- 读者上完能独立做到：用一条 Skill 流水线把模糊想法变成已关闭的工单

## Constraints
- 读者是软件从业者（不要求精通前端），中文授课
- **每课篇幅精炼**：一个阶段一课（不是每个 skill 一课），15 分钟内可完成
- 工具链事实：TRAE Work + GLM-5.3（主力模型）；原型设计用 TRAE Work
- 成本事实：本工程约 5000 积分；TRAE Work Pro 会员 99 元/月，含 4000 + 200×30（签到）= 约 10000 积分/月
- 素材以本仓库真实开发史（36 个 issue、50 次提交、会话记忆）与真实 Skill 定义为唯一事实来源
- 用户本人是 LinguaAI 作者，角色是教程作者与审校

## Out of scope
- React / TypeScript / Vite / TTS 等具体技术栈的系统教学（仅第 5 课浓缩讲一节）
- 特定 Agent 产品的推广话术；聚焦可复用的协作方法论与 Skill 用法
- 移动端、账号体系、云端同步等 LinguaAI 未实现的方向
