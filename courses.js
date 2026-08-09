// 课程数据 - 由 add-course.py 维护，请勿手动编辑
const COURSES = [
  {
    title: "AI Agent 2.0 基础",
    tag: "已完结 · 4 阶段",
    desc: "从零做出真能干活的 Agent 并部署上线。覆盖工具、记忆、流式、评测、生产化、RAG、多 Agent 全链路。",
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
];
