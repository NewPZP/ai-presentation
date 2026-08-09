# 0005 — 文章列表与多页学习路由

## 学到了什么
- **Next.js 动态路由**：`app/articles/[id]/[phase]/page.tsx`，方括号 = URL 参数。访问 `/articles/abc/preview` 时 id=abc、phase=preview
- **params 是 Promise（Next.js 15+）**：用 `use(params)` 解包；Next.js 14 直接解构 `{ params }`
- **localStorage 持久化**：浏览器键值存储，刷新不丢。三个坑：只能存字符串（要 JSON 序列化）、SSR 时 window 不存在（要 `typeof window === 'undefined'` 守卫）、可能被禁用/存满（要 try-catch）
- **自定义 Hook**：`useArticles()` 封装带状态的逻辑（增删查改 + localStorage 同步），函数名必须以 `use` 开头，组件调一行拿数据和方法
- **两个 useEffect 模式**：① 挂载时读 localStorage ② articles 变化时写回。`loaded` 标志防止首次渲染的空数组覆盖已有数据
- **`setArticles(prev => ...)` 函数形式更新**：拿到的 prev 永远最新，避免闭包旧值导致数据丢失——React 状态更新安全写法
- **不可变更新**：`{ ...a, phaseStatus: { ...a.phaseStatus, [phase]: status } }`，展开旧对象只改一个字段，React 靠引用变化判断重渲染
- **`<Link>` 客户端导航**：不刷新整页，比 `<a>` 快，保留状态。内部跳转永远用 Link
- **`useRouter().push(url)` 编程式导航**：文章不存在/phase 非法时跳首页
- **类型守卫 `isValidPhase`**：返回 `p is Phase`，校验 URL 参数合法性（用户可能手输错误 phase）

## 关键代码位置
- `lib/learning-phases.ts`（追加）— PhaseStatus 类型、Article 接口、createDefaultPhaseStatus、getProgress
- `lib/storage.ts`（新建）— loadArticles / saveArticles / generateId，含 SSR 守卫和 try-catch
- `hooks/use-articles.ts`（新建）— useArticles Hook：articles 状态 + addArticle/removeArticle/updatePhaseStatus/getArticle
- `components/article-card.tsx`（新建）— 卡片：文件信息 + 6 阶段按钮（带状态圆点）+ 进度条
- `app/page.tsx`（重写）— 首页：标题栏 + 导入按钮 + 文章列表 + 空状态
- `app/articles/[id]/[phase]/page.tsx`（新建）— 学习页：返回按钮 + 阶段标题 + 聊天 + 下一阶段

## 非显然决策
- **每阶段独立页面而非单页切换**：URL 可收藏/分享，刷新不丢上下文，符合多页应用优势。用户明确要求。
- **localStorage 而非数据库**：自己用、零成本、刷新不丢够了。第 10 课升级数据库做跨设备同步。
- **上传接口和对话接口不用改**：第二课分离提取/存储的回报——存储逻辑在前端，接口只管提取/对话，前后端解耦。
- **阶段完成是手动的**：点「下一阶段」才标 completed。AI 自动判断完成度等第 11 课工具调用。
- **对话历史没持久化**：useChat 的 messages 是内存态，离开再回来会丢。第 10 课做。

## 数据流
```
首页点「导入」→ FileImporter 上传 → addArticle(name, text)
  → useArticles 存 state + localStorage
  → ArticleCard 渲染

点阶段按钮 → Link 跳 /articles/[id]/[phase]
  → 学习页 useEffect 标记 inProgress
  → 发消息 body 带 article.text + phase
  → 点「下一阶段」→ updatePhaseStatus(completed) + router.push 下一阶段
  → 回首页看进度更新
```

## 概念对应
- 动态路由 = Flask 的 `<id>` 路由参数
- 自定义 Hook = Python 的类封装（带状态的工具函数）
- localStorage = 浏览器版 SQLite（键值存储，5-10MB）
