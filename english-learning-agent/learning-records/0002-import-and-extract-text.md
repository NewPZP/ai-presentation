# 0002 — 文件导入与文本提取

## 学到了什么
- Next.js Route Handler 接收文件上传：用 `req.formData()` 解析 `multipart/form-data`，对应 FastAPI 的 `UploadFile`
- `pdfjs-dist` 服务端文本提取：动态 `import("pdfjs-dist/legacy/build/pdf.mjs")` 避免构建时报 `window is not defined`；设 `workerSrc = ""` 关掉 worker 用主线程跑
- `getTextContent()` 返回 `items` 数组，每个 `TextItem.str` 是文字片段，拼接成整页文本
- 扫描件 PDF（图片版）提取不到文字，需要 OCR，本课暂不支持
- AI SDK 的 `sendMessage` 第二参数 `body` 可传递非对话数据（如 `articleText`）给后端
- 架构决策：文章是背景知识不是对话，放 `body` 注入 `instructions`（系统提示），不塞进 `messages`

## 关键代码位置
- `lib/extract-text.ts` — 文本提取工具函数，按后缀名分发（PDF/TXT/MD）
- `app/api/upload/route.ts` — 上传接口，返回 `{ text, fileName, wordCount }`
- `app/page.tsx` — `articleText` 状态 + 隐藏 `<input type="file">` + `sendMessage({ text }, { body: { articleText } })`
- `app/api/chat/route.ts` — 从 body 解构 `articleText`，动态拼进 `instructions`

## 非显然决策
- **为什么文章放 body 而不是 messages**：文章是上下文/背景知识，塞进 messages 会让对话历史臃肿且每轮重复传。放 body、后端注入 instructions 更符合语义——对应前一课「系统提示存系统提示，对话存对话」原则。
- **为什么文本提取和对话分两个 API**：提取是一次性重活（解析 PDF 慢），对话是高频轻活，分开职责清晰。
- **为什么用 `pdfjs-dist/legacy/build/`**：新版入口依赖浏览器 API，legacy 入口在 Node.js 服务端跑得稳。
- **为什么用动态 import**：`pdfjs-dist` 顶层 import 会在 Next.js 构建时报错（访问 `window`），动态 import 保证只在运行时服务端加载。

## 待优化（后续课程处理）
- MVP 阶段文章直接拼进 `instructions`，超长文章（万字+）会超 token 限制 → 第 8 课换 RAG 检索
- 文章存在前端状态，刷新就丢 → 第 8 课做持久化
- 只支持 PDF/TXT/MD → 后续可加 Word（mammoth）、EPUB
- 没有 OCR → 扫描件 PDF 无法处理

## 类型谓词技巧
`filter((item): item is TextItem => ...)` 是 TypeScript 类型谓词，过滤后 TS 知道剩余元素都是 `TextItem`，可安全访问 `item.str`。普通 `filter` 做不到这点。
