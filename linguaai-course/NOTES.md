# NOTES

## 用户偏好
- 中文授课；用户习惯按课号顺序推进（「继续第 N 课」）
- 用户本人即 LinguaAI 的搭建者：向用户确认的是教学法与取舍，不是技术内容
- 教程读者：软件从业者（不要求精通前端），教学分享场景
- **核心转向：教程重点是「怎么用 AI Agent + Skill 来开发」，技术实现篇幅大幅压缩**
- **课程形态：按阶段组织（不是每个 skill 一课），每课精炼，15 分钟内可完成**

## 真实工具链与成本（写课引用）
- **主力模型**：GLM-5.3（TRAE Work 内）
- **原型设计**：TRAE Work（产品自带界面设计能力，非 prototype skill）
- **Skill 目录**：`.agents/skills/<skill-name>/SKILL.md`（本仓库内，共 40+ 个 skill，均属 Matt Pocock 工程套件）
- **成本**：本工程约 5000 积分；TRAE Work Pro 会员 99 元/月，含 4000 + 200×30（签到）= 约 10000 积分/月

## Skill 真实机制（已读 SKILL.md，写课以此为准）
- **`disable-model-invocation: true`**：核心流水线 skill 均带此标记，需用户显式触发，模型不自动调用
- **`setup-matt-pocock-skills`**：一次性配置（issue tracker / triage 标签 / domain 文档）
- **`grill-me`** → 内部调用 `/grilling`：无休止访谈，逐个问题、每个问题给推荐答案、一次只问一个
- **`to-spec`**：不访谈，综合成 spec（PRD）。模板：Problem / Solution / User Stories / Implementation Decisions / Testing Decisions / Out of Scope / Further Notes。发布到 tracker 并打 `ready-for-agent`
- **`to-tickets`**：拆成 **tracer-bullet 垂直切片**，每片贯穿 schema→API→UI→test，声明阻塞边，按依赖序发布
- **`implement`**：读工单 → `/tdd` 测试先行 → 类型检查/单测 → 全量测试 → `/code-review` → 提交
- **`tdd`**：红→绿循环，seam 先行，反模式（实现耦合 / 同义反复 / 水平切片）
- **`code-review`**：双轴（Standards 规范 + Spec 需求），并行子代理并列汇报
- **`diagnosing-bugs`**：6 阶段，Phase 1 建紧反馈回路（红能力/确定性/快/可无人值守）
- **`triage`**：issue 状态机（needs-triage/needs-info/ready-for-agent/ready-for-human/wontfix）
- **`domain-modeling`**：术语表 CONTEXT.md + ADR（难逆+反直觉+真权衡才写）
- **`codebase-design`**：深度模块（小接口+大实现），词汇：module/interface/implementation/depth/seam/adapter/leverage/locality
- **`prototype`**：一次性原型，两分支（逻辑状态机 / UI 变体），用完丢弃、只留结论

## 教学范式（每课遵循）
- 每课交付一个「阶段级方法」，LinguaAI 只作案例穿插
- 引用真实开发史佐证：工单编号、提交、会话记忆中的决策
- 技术代码只出现必要的「接缝示意」，不做系统讲解
- Skill 讲解落到「触发方式 → 输入输出 → 关键行为 → 怎么验收」，基于真实 SKILL.md

## 课程地图（8 课 · 按阶段组织）
1. **全景**：Agent + Skill 范式 + 工具链 + 成本 + 流水线总览 + 课程地图
2. **原型设计**：solo-design skill（TRAE Work 内置）先把「长什么样」可视化定下来
3. **需求产出**：setup-matt-pocock-skills → grill-me → to-spec → to-tickets（一个需求如何变成一组工单）
4. **实现循环**：implement + tdd + code-review（拿工单到提交的完整循环）
5. **踩坑与调试**：diagnosing-bugs 反馈回路 + 本工程真实 bug 复盘（CORS、TTS、工厂引用等）
6. **技术实现**：LinguaAI 的架构浓缩（app/worker、适配器、音频引擎、pdf 解析）——只讲架构思路，不讲代码细节
7. **元课程**：teach skill 是怎么生成这套教程的（从 MISSION/NOTES 到每课 HTML 的过程）
8. **展望与挖坑**：本工程可改进之处（会话复用、token 优化、项目记忆边界、skill 编排自动化等）——为后续课程留白

## 素材锚点（写课时引用）
- 提交历史：`git log --oneline --reverse`（50 commits）
- 工单：GitHub Issues #1（PRD）→ #2–#11（主工单）→ #12–#36（增强/修复）
- 会话摘要：`~/.trae-cn/memory/projects/.../20260801…20260907/topics.md`
- README.md；演示动图 docs/screenshots/demo.gif
- Skill 定义：`.agents/skills/<name>/SKILL.md`

## 工作区注意
- MISSION.md / RESOURCES.md / NOTES.md / lessons/ / assets/ / learning-records/ 为教学产物，未确认前不提交 git
- 全部 8 课已完成：0001 全景 / 0002 原型设计(solo-design) / 0003 需求产出 / 0004 实现循环 / 0005 踩坑与调试 / 0006 技术实现 / 0007 元课程 / 0008 展望与挖坑
