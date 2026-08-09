# 0007 — 词汇卡片轮播 + 架构迁移

## 学到了什么

### 架构迁移（Phase → Feature）
- **迁移而非重写**：从线性 6 阶段（preview/reading/keyVocab/sentence/practice/test）迁移到 6 功能模块（vocab/podcast/listening/vocabQuiz/finalQuiz/progress），只换数据不换逻辑
- **数据驱动设计的回报**：第 3 课把配置数据（PHASE_ORDER、PHASE_INFO）和转移逻辑（getNextPhase）分离，本课换数据时 getNextFeature 一行没改
- **迁移对照**：Phase→Feature、PHASE_ORDER→FEATURE_ORDER、PhaseStatus→FeatureStatus、phaseStatus→featureStatus、[phase]→[feature] 路由
- **localStorage 数据不兼容**：旧数据读不到新字段，用 `article.featureStatus || createDefaultFeatureStatus()` 兼容或清掉旧数据

### 3D 翻转卡片
- **CSS 3D 翻转四属性**：perspective（透视距离）、transform-style: preserve-3d（保留 3D 空间）、backface-visibility: hidden（背面隐藏）、transform: rotateY(180deg)（Y 轴旋转）
- **翻转交互**：点击卡片翻转，点🔊发音不翻转（stopPropagation 阻止冒泡）
- **正面**：单词+音标+发音按钮；**背面**：释义+例句+翻译

### 间隔重复
- **最简队列式**：认识→移出队列（slice(1)），不认识→移到队尾（[first, ...rest] → [...rest, first]）
- **key 重置技巧**：`key={currentWord.word}` 让卡片切换时组件重新挂载，flipped 状态自动归零
- **对比 SM-2 算法**：本课只有认识/不认识两档，真正的 Anki 按遗忘曲线安排复习时间

### 组件设计
- **纯展示组件**（VocabFlipCard）：接收 word + onKnown + onUnknown，不含业务逻辑
- **逻辑容器**（VocabView）：管理队列状态 + 提取词汇 + 间隔重复逻辑
- **条件渲染**：`currentFeature === "vocab"` 只在词汇功能渲染 VocabView，其他功能显示占位

## 关键代码位置
- `lib/learning-features.ts`（新建）— Feature 类型 + FEATURE_ORDER + FEATURE_INFO + getNextFeature + FeatureStatus + Article 接口
- `app/articles/[id]/[feature]/`（重命名自 [phase]）— 路由文件夹迁移
- `hooks/use-articles.ts`（改造）— phaseStatus → featureStatus，updatePhaseStatus → updateFeatureStatus
- `components/article-card.tsx`（改造）— 6 个功能按钮 + 图标 + 完成状态
- `components/vocab-flip-card.tsx`（新建）— 3D 翻转卡片组件
- `app/articles/[id]/[feature]/vocab-view.tsx`（新建）— 间隔重复队列逻辑
- `app/articles/[id]/[feature]/page.tsx`（重写）— 功能模块路由 + 条件渲染

## 非显然决策
- **旧文件保留不删**：迁移期间 learning-phases.ts 保留参考，确认无误后再删。避免迁移中途找不到对照
- **去掉了 useChat**：词汇卡片功能不需要聊天，聊天功能后续在需要的模块里再加。不是每个功能都需要对话
- **其他功能显示占位**：播客/听力/测验显示「后续课程实现」，这样路由系统先就位，后续课程只填内容
- **推荐路径不强制**：FEATURE_ORDER 定义推荐顺序，但用户可自由跳转任何功能。推荐项在 UI 上不做特殊高亮（简化实现）

## 数据流
```
词汇卡片功能：
  进入 /articles/[id]/vocab
  → VocabView 挂载 → useEffect 调 /api/extract-vocab
  → generateObject 返回 { words: [...] }
  → setQueue(data.words)
  → VocabFlipCard 渲染 queue[0]
  → 认识 → slice(1) 移出 → 下一张
  → 不认识 → 移到队尾 → 下一张（这张会再出现）
  → queue 空 → 显示完成 → onComplete → 标记 completed → 跳转下一功能
```

## 概念对应
- 数据驱动设计 = 换数据不换逻辑（第 3 课的回报）
- 间隔重复 = 存储强度理论的最简实现（desirable difficulty）
- key 重置 = React 组件生命周期控制
- 3D 翻转 = CSS transform 3D 空间
