// courses.js —— 个人主页「作品墙」数据
// index.html 会把这里的每一门课程渲染成作品墙里的一张卡片。
// 每个字段对应卡片上的一部分内容：
//   title      —— 卡片标题（课程名）
//   status     —— 卡片左上角的状态标签，用来标识课程状态：
//                  · 已完结 → 如「已完结 · 4 阶段」：正常彩色卡片
//                  · 预告   → 如「预告 · 即将上线」：卡片排最前，斜纹背景区分
//   desc       —— 卡片简介
//   stats      —— 卡片弹窗里的统计（节课 / 阶段 / 总时长）
//   gradient   —— 卡片封面的渐变色，格式 "起始色, 结束色"（如 "#1e3a8a, #0ea5e9"）
//   path       —— 课程目录名；「教程」入口据此打开 <path>/lessons/*.html
//   stages     —— 课程阶段与课节目录（点开教程入口后弹窗里的目录）
//   github     —— 【可选】关联的 GitHub 仓库链接；留空/删除则卡片不显示 GitHub 角标
//   video      —— 【可选】关联的视频链接；留空/删除则卡片不显示视频角标
//   date       —— 【可选】预告项目的预计上线时间（如「预计 2026 年 10 月上线」）
//   highlights —— 【可选】作者打的亮点标签（多个，抓眼球），如 ["版本答案", "免费"]
//
// 预告项目写法：status 用「预告 · 即将上线」，stages 留空 []、path 留空 ""，可配 date。
//
// 注意：
//   1) title/status/desc/stats/gradient/path/stages 由 add-course.py 维护；
//      github / video / date / highlights 为手动可选配置，add-course.py 同步时会保留它们。
//   2) 数组内部不要写 // 行内注释（add-course.py 按 JSON 解析数组，注释会报错）；
//      字段说明统一看上方这段注释。
const COURSES = [
  {
    title: "多 Agent 协作实战",
    status: "预告 · 即将上线",
    desc: "定制自己的 Agent 团队，多 Agent Battle 头脑风暴。",
    highlights: ["新品"],
    stats: [],
    gradient: "#92400e, #f59e0b",
    path: "",
    date: "预计 2026 年 10 月上线",
    stages: []
  }
,
  {
    title: "AI Agent 2.0 基础",
    status: "已完结 · 4 阶段",
    desc: "很基础，但有必要看下",
    highlights: ["基础"],
    stats: [{ big: "14", lbl: "节课" }, { big: "4", lbl: "阶段" }, { big: "~210min", lbl: "总时长" }],
    gradient: "#1e3a8a, #0ea5e9",
    path: "ai-agent-2.0",
    stages: [
      { name: "阶段一 · 基础", lessons: [
        { n: "01", t: "什么是 AI Agent？", f: "0001-what-is-an-ai-agent.html" },
        { n: "02", t: "让 Agent 自己选工具", f: "0002-let-agent-choose-tools.html" },
        { n: "03", t: "系统提示与最简记忆", f: "0003-system-prompt-and-memory.html" },
        { n: "04", t: "长期记忆", f: "0004-long-term-memory.html" },
        { n: "05", t: "封装 Agent 类与错误处理", f: "0005-agent-class-and-error-handling.html" },
        { n: "06", t: "把 Agent 变成 Web 服务", f: "0006-agent-as-web-service.html" }
      ]},
      { name: "阶段二 · 能用", lessons: [
        { n: "07", t: "Agent 评测", f: "0007-agent-evals.html" },
        { n: "08", t: "流式输出", f: "0008-streaming-output.html" }
      ]},
      { name: "阶段三 · 生产化", lessons: [
        { n: "09", t: "生产化部署", f: "0009-production-deployment.html" },
        { n: "10", t: "切换到 Claude", f: "0010-switch-to-claude.html" },
        { n: "11", t: "RAG 与向量记忆", f: "0011-rag-and-vector-memory.html" }
      ]},
      { name: "阶段四 · 进阶", lessons: [
        { n: "12", t: "多 Agent 委托", f: "0012-multi-agent-handoff.html" },
        { n: "13", t: "何时用 Agent / 何时用 Workflow", f: "0013-when-to-use-agent-vs-workflow.html" },
        { n: "14", t: "项目实战", f: "0014-capstone-project.html" }
      ]}
    ]
  }
,
  {
    title: "别让 AI 瞎写代码｜工程化 Agent+skills 开发全流程",
    status: "已完结 · 4 阶段",
    desc: "一款写给自己学习英语的工具，走完 setup → grill-me → to-spec → to-tickets → implement 整条 Skill 流水线，从需求到交付一条龙，把 AI 开发做成工程。",
    highlights: ["项目实战"],
    stats: [{ big: "8", lbl: "节课" }, { big: "4", lbl: "阶段" }, { big: "~120min", lbl: "总时长" }],
    gradient: "#134e4a, #14b8a6",
    path: "linguaai-course",
    github: "https://github.com/NewPZP/learn_english_with_ai",
    stages: [
      { name: "阶段一 · 起步", lessons: [
        { n: "01", t: "全景：Agent + Skill 开发范式", f: "0001-overview-and-roadmap.html" },
        { n: "02", t: "原型设计：solo-design 定界面", f: "0002-prototype-design.html" }
      ]},
      { name: "阶段二 · 核心流水线", lessons: [
        { n: "03", t: "需求产出：想法变工单", f: "0003-requirements.html" },
        { n: "04", t: "实现循环：工单到提交", f: "0004-implementation-loop.html" }
      ]},
      { name: "阶段三 · 调试与技术", lessons: [
        { n: "05", t: "踩坑与调试：反馈回路", f: "0005-debugging-and-pitfalls.html" },
        { n: "06", t: "技术实现：LinguaAI 架构", f: "0006-technical-architecture.html" }
      ]},
      { name: "阶段四 · 元与展望", lessons: [
        { n: "07", t: "元课程：教程如何生成", f: "0007-meta-how-this-course-was-made.html" },
        { n: "08", t: "展望与挖坑：可改进之处", f: "0008-future-and-pitfalls.html" }
      ]}
    ]
  }
];
