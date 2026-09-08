# LinguaAI 建造课程 Resources

## Knowledge

- 本仓库 [README.md](./README.md)
  工程结构、页面路由表、核心数据流、AI 适配器层、Worker 端点的事实来源。用于：每课开头的「我们要建什么」定位。
- GitHub Issues #1–#36（NewPZP/learn_english_with_ai）
  工单原文与验收标准，课程章节的主要出处（#1 PRD、#2–#11 十张主工单、#12–#36 增强与修复）。用于：还原需求是怎么被拆解和验收的。
- `git log --reverse`（本仓库）
  按时间回放 50 次提交的工程演进史。用于：复盘「先做什么后做什么」及其代价。
- [React 官方文档](https://react.dev/learn)
  组件、Hooks、受控组件、测试的权威资料。用于：第 2–7 课组件与状态设计。
- [Vite 官方文档](https://vite.dev/guide/)
  dev server、proxy、构建配置。用于：第 2 课脚手架、第 8 课 CORS 代理。
- [pdf.js（mozilla GitHub）](https://github.com/mozilla/pdf.js)
  文本提取与 GlobalWorkerOptions.workerSrc 配置。用于：第 10 课 PDF 双语导入。
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
  Worker 路由、KV/缓存、CORS。用于：第 9 课发现页后端。
- [火山引擎语音技术 TTS 文档](https://www.volcengine.com/docs/6561/97465)
  认证三头、resource ID 格式、错误码。用于：第 8 课 TTS 接入与踩坑。

## Wisdom (Communities)

- [Cloudflare Developers Discord](https://discord.cloudflare.com/)
  Worker 部署、缓存策略的实时答疑。用于：第 9 课后延伸。
- [Reactiflux Discord](https://www.reactiflux.com/)
  大型 React 社区，#react-help 频道高信噪比。用于：组件设计争议的求证。
- [pdf.js GitHub Discussions](https://github.com/mozilla/pdf.js/discussions)
  解析异常（版式、字体、分栏）的案例库。用于：第 10 课疑难杂症。

## Gaps

- 艾宾浩斯/间隔重复调度算法的权威资料（当前仅工程内实现，第 6 课前需补充 SM-2 类文献）
- 火山引擎中文开发者社区（答疑渠道待补）
