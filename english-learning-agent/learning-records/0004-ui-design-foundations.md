# 0004 — UI 设计基础（设计系统 + 组件库）

## 学到了什么
- **设计系统**：UI 不该靠记忆和临场发挥，用令牌（token）+ 组件集中管理
- **CSS 变量令牌**：shadcn/ui 在 globals.css 用 HSL 三数定义 `--primary` / `--muted` / `--border` / `--radius`，Tailwind 透明度修饰符（`bg-primary/40`）自动生效。改令牌全局生效。
- **shadcn/ui 与传统组件库区别**：源码拷贝进 `components/ui/`，是「你的代码」不是依赖，完全可控
- **组件拆分**：MessageBubble（纯展示）、PhaseProgress（带交互）、FileImporter（受控组件，状态提升）
- **`cn()` 函数**：shadcn/ui 提供，合并 Tailwind 类名 + 条件类名，比模板字符串干净
- **受控组件 / 状态提升**：FileImporter 不持有 articleText，通过 `onFileUploaded` 回调交给父组件
- **lucide-react 图标**：Upload / FileText / Loader2(配 animate-spin 做加载转圈)
- **Button variant 系统**：`variant="secondary" size="sm"`，语义化而非手写颜色类

## 关键代码位置
- `app/globals.css` — CSS 变量令牌，主色改为青绿 `--primary: 173 80% 40%`
- `components/ui/` — shadcn/ui 自动生成的组件（button/card/scroll-area/avatar/separator）
- `components/message-bubble.tsx` — 消息气泡：头像 + 气泡，用户靠右 AI 靠左
- `components/phase-progress.tsx` — 阶段进度条 + 下一步按钮，用 Button variant
- `components/file-importer.tsx` — 文件导入，受控组件，状态提升
- `app/page.tsx` — 从 ~200 行瘦到 ~60 行，复用三个组件

## 非显然决策
- **为什么用 HSL 三数而非 hex**：方便 Tailwind 透明度修饰符 `bg-primary/50` 自动生成 `hsl(var(--primary) / 0.5)`
- **为什么组件源码拷进项目而非 npm 安装**：完全可控，想改就改，不依赖上游版本
- **为什么 FileImporter 不持有 articleText**：状态提升到父组件，多个组件能共享同一份文章数据
- **为什么 MessageBubble 是纯展示组件**：不含状态不调 API，最容易复用和测试

## 后续课程复用
- 第 5 课词汇预习：Card 做词汇卡片，MessageBubble 渲染回复
- 第 7 课练习：Button 做选项，Card 做题目容器
- 第 8 课检验：Card 做评分卡片
- 第 11 课部署：响应式只改组件不动逻辑；深色模式只需加 `.dark` CSS 变量

## 安装命令备忘
```
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button card scroll-area avatar separator
pnpm add lucide-react
```
