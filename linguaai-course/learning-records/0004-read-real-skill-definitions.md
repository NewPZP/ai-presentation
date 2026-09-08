# 读真实 SKILL.md，修正流水线命名与机制

读了 `.agents/skills/` 下的真实定义，发现与用户口头描述有几处需修正：

**事实**：
- `to-ticket` 实为 **`to-tickets`**（复数）；`grill-me` 只是调用 **`grilling`** 的入口
- 核心流水线 skill 均带 **`disable-model-invocation: true`**——需用户显式触发，模型不自动调用
- 还有一个被遗漏的前置 skill：**`setup-matt-pocock-skills`**（一次性配置 issue tracker / triage 标签 / domain 文档）
- `implement` 内部会调用 `/tdd` 和 `/code-review`，不是独立手动串联
- 辅助 skill 还有 `triage`（issue 状态机）、`domain-modeling`、`codebase-design`、`prototype` 等

**Implications**：
- 课程地图第 2 课改为 setup-matt-pocock-skills（原「需求澄清」顺延到第 3 课）
- 第 1 课 Skill 流水线表新增「⓪ 一次性准备」与「disable-model-invocation」关键洞察
- 后续写每课 Skill 时，一律以 `.agents/skills/<name>/SKILL.md` 为唯一事实来源，不复述用户口述
