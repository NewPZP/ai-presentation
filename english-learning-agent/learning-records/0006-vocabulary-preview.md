# 0006 — 词汇预习：智能挑词与结构化词汇表

## 学到了什么
- **结构化输出 generateObject**：AI SDK 的 `generateObject` 让 AI 返回 JS 对象而非文本流。用 Zod Schema 强制格式，AI 返回后自动校验，不合规会重试
- **streamText vs generateObject 选择原则**：展示给人读的文字用 streamText（聊天）；程序处理的数据用 generateObject（提取/分类/列表）
- **Zod Schema**：类型定义 + 运行时校验 + AI 指令三合一。`z.object()` 定义结构，`z.string()`/`z.enum()` 声明字段类型
- **`.describe()` 给 AI 看的指令**：Schema 转 JSON Schema 发给 LLM，describe 文字就是字段填写说明，质量直接影响 AI 输出
- **`z.enum()` 限制枚举值**：比 `z.string()` 更严格，防止 AI 自由发挥，前端可安全映射（如难度颜色）
- **`z.infer<typeof schema>` 类型推导**：从 Schema 自动推导 TS 类型，单一数据源，改 Schema 类型自动更新
- **Zod = JS 版 pydantic**：用户有 Python 基础，这个类比帮助理解
- **三态 UI**：未提取（按钮）/ 提取中（loading）/ 已提取（卡片网格），用两个 state 控制
- **条件渲染**：`currentPhase === "preview"` 只在词汇预习阶段显示提取功能
- **响应式网格**：`grid-cols-1 sm:grid-cols-2`，手机 1 列平板 2 列

## 关键代码位置
- `lib/schemas.ts`（新建）— vocabWordSchema / vocabListSchema，含 describe 和 z.infer 类型推导
- `app/api/extract-vocab/route.ts`（新建）— generateObject + Zod Schema，system 提示写挑词原则
- `components/vocab-card.tsx`（新建）— 词汇卡片：单词/音标/词性/释义/原句/翻译/难度标签
- `app/articles/[id]/[phase]/page.tsx`（改造）— preview 阶段加提取按钮 + 卡片网格，其他阶段不变

## 非显然决策
- **词汇提取单独一个 API**：不用 streamText 的聊天接口，因为词汇表是数据不是对话。generateObject 和 streamText 分两个接口各司其职
- **挑词原则写在 system 提示**：不告诉 AI 怎么挑，可能选出 the/is/and。原则越具体质量越高（词频中等偏上、跳过常见词、包含短语、例句来自原文）
- **generateObject 非流式可接受**：词汇表不需要打字机效果，一次性返回卡片一起出现
- **难度用 enum 不用 string**：限制三个值，前端可安全映射颜色（basic=绿/intermediate=黄/advanced=红）

## 数据流
```
preview 阶段 → 点「提取生词」
  → fetch /api/extract-vocab { articleText }
  → generateObject(model, schema, system+prompt)
  → AI 返回 { words: [{word, phonetic, pos, definition, example, translation, difficulty}] }
  → Zod 校验通过
  → setVocabWords(data.words)
  → VocabCard 渲染卡片网格
```

## 概念对应
- generateObject = Python 的 pydantic + LLM 的 JSON mode
- Zod Schema = pydantic BaseModel
- z.infer = pydantic 的 TypeAdapter
- 结构化输出 = Agent 从「能聊天」到「能干活」的关键能力
