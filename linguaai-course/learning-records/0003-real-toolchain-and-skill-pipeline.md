# 记录真实工具链与成本，Skill 流水线成为课程主线

用户补充了真实开发工具链与成本，课程重心进一步收窄到「Skill 流水线」。

**事实**：
- 主力模型 GLM-5.3（TRAE Work 内），原型设计用 TRAE Work
- 核心 Skill 流水线：grill-me（讨论需求）→ to-spec（整理需求发 issue）→ to-ticket（拆分需求）→ implement（实现），过程中按需调用 tdd 等辅助 skill
- 成本：本工程约 5000 积分；TRAE Work Pro 会员 99 元/月，含 4000 + 200×30（签到）= 约 10000 积分/月

**Implications**：
- 课程地图把前 5 课改为 Skill 流水线的逐站拆解（grill-me / to-spec / to-ticket / implement+tdd），替代原「应用壳/领域模型/适配器」等技术主题
- 第 1 课加入真实工具链与成本卡片，Skill 流水线表格成为核心教学内容
- grill-me / to-spec / to-ticket 的内部机制（prompt、触发方式、输出格式）当前不在本地 skill 目录，写第 2–4 课前需向用户确认细节
