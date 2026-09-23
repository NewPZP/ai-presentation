# 国内部署方案（带自有域名）· ai-presentation

> 结论先行版运行手册。价格均为公开活动价/参考区间，下单前请以官网当前页面为准（文中标了来源链接）。
> 撰写时间：2026-09-23

---

## 0. TL;DR

本项目是**纯静态站**（41 个 HTML + 4 个 JS + 4 个 CSS，无后端、无数据库、无构建步骤），首页 gzip 后仅 ~12 KB，全站 ~9.3 MB。
这种站**不需要买服务器**，只需要"静态托管 + 一个已备案的域名"。要挂国内节点加速，**ICP 备案是硬门槛**。

| 档位 | 方案 | 首年成本 | 之后每年 | 适合 |
|---|---|---|---|---|
| ⭐ **首选**（速度好 + 省心） | 腾讯云 **EdgeOne Pages 免费版** + 备案域名 | 域名 ~50 + 备案资源 ~40~100 ≈ **100~160 元** | 域名 + 备案资源 ≈ **100~200 元** | 想国内秒开、又不想运维服务器 |
| **最省钱**（单机搞定） | 阿里云**轻量应用服务器**（新客 38~68 元/年）+ Nginx + 免费证书 | ≈ **90~140 元** | 视续费价（99 计划可续费同价） | 愿意自己配一次 Nginx |
| **免备案**（最省事） | EdgeOne Pages 加速区域选「全球可用区（不含中国大陆）」+ 域名 | ≈ **50~100 元**（只有域名） | ≈ **70~90 元** | 不想折腾备案、能接受境外节点延迟 |
| 不推荐 | Cloudflare Pages / Vercel / GitHub Pages + 自有域名 | 0~域名钱 | — | 国内访问慢且不稳定，国内分享体验差 |

**关键事实（有官方出处）：**
- 域名解析到**中国内地**服务器，**必须先完成 ICP 备案**，否则会被云厂商监测系统**阻断访问**（[阿里云官方说明](https://help.aliyun.com/zh/icp-filing/not-for-the-record-dns-can-access-to-different-areas)）。
- 域名解析到**非中国内地**服务器，**无需工信部备案**（官方口径：需做公安备案），域名可正常持有、续费、解析（同上链接）。
- EdgeOne Pages 免费版**静态加速流量与请求不限量**、长期免费，绑定自定义域名时：**中国大陆/全球可用区需工信部备案**，「全球可用区（不含中国大陆）」**不需要备案**（[腾讯云 Pages 域名管理文档](https://edgeone.cloud.tencent.com/pages/document/162936836982489088)、[Pages 定价页](https://pages.edgeone.ai/zh/pricing)、[正式版公告](https://pages.edgeone.ai/zh/resources/pages-general-availability)）。
- **EdgeOne（含 Pages）本身不是可备案资源**，它只负责校验域名是否已有备案号；备案必须先走腾讯云轻量 / CVM / Serverless 等资源，或在其他接入商完成备案（详见 §3.2.1 与 §3.2.2）。

---

## 1. 项目体检（部署前必须知道的事实）

| 项目 | 实测值 | 对部署的影响 |
|---|---|---|
| 技术形态 | 纯静态 HTML/CSS/JS，无 `package.json`、无构建 | 任何静态托管都能跑，不需要 CI 构建步骤 |
| 文件数 | 41 个 HTML、21 个 MD、4 个 JS、4 个 CSS | 全量上传即可 |
| 全站体积 | ~9.3 MB（不含 `.git`/`.agents`） | 存储费几乎为 0 |
| 首页体积 | index.html 25 KB → gzip **7.9 KB**；courses.js 3.0 KB；profile.js 1.1 KB | 首屏极轻，CDN 流量成本可忽略 |
| 最大资产 | `linguaai-course/docs/screenshots/demo.gif` **8.0 MB**（占全站 87%） | 唯一需要优化的大件 |
| 路径写法 | 全部相对路径，无 `/xxx` 根绝对路径 | 可部署在任意子目录/域名根，**无需改代码** |
| 外部依赖 | 无 CDN/字体/接口依赖（外链只是正文里的参考链接） | 国内直连不会被墙掉的资源拖慢 |
| 运行期依赖 | 仅浏览器 `localStorage`（明暗主题） | 无需 Node/Python 运行时 |

### 体检发现的 4 个上线前小问题

1. **死链 1 处**：`rag-interview-course/reference/rag-roadmap.html` 里 `../RESOURCES.md` 指向的文件**不存在**（同目录只有 GLOSSARY/MISSION/NOTES）。要么补文件，要么删链接。
2. **`.md` 链接会变成"下载/纯文本"**：`ai-agent-2.0/lessons/0001-what-is-an-ai-agent.html`、`rag-interview-course/lessons/0001-rag-interview-battle-map.html`、`rag-interview-course/reference/rag-roadmap.html` 共 5 处 `href="../*.md"`。静态托管不会渲染 Markdown，点开是下载或纯文本，建议改成 HTML 页或去掉。
3. **8 MB GIF**：移动端首次打开很吃亏。建议转 `webp`/`mp4`（可减到 1 MB 内）或改为点击后加载。
4. **部署时排除**：`.git/`、`.agents/`（124 个文件，仅本地用）、2 个 `.DS_Store`、以及 `add-course.py`（本地课程管理脚本，不需要公开）。另 `index.html:202` 的 `mailto:hello@example.com` 只是 JS 注入前的兜底值，`profile.js` 正常时会被替换，可留可改。

---

## 2. 三条路线对比

| 维度 | A. EdgeOne Pages（推荐） | B. 阿里云轻量 + Nginx | C. 免备案（境外节点） |
|---|---|---|---|
| 国内访问速度 | 好（国内边缘节点，3200+ 节点） | 好（单机直连，取决于带宽） | 一般（延迟通常 +50~150 ms，晚高峰更差） |
| 是否需要 ICP 备案 | **需要**（选大陆/全球含大陆区域时） | **需要** | 不需要 |
| 备案资源（走哪家） | 腾讯云（轻量/CVM/Serverless 资源包）或阿里云 | 阿里云轻量本身即可 | — |
| 部署方式 | Git 推送自动发布 / 控制台直接上传 / CLI | SSH + `scp`/`rsync` | 同 A 或 B |
| HTTPS | 平台自动签发并续期 | 需自配（免费证书现为 **3 个月**有效期，需定期续） | 同左 |
| 流量成本 | 免费版**不限量** | 受轻量**月流量包**限制，超出按量计费 | 免费版不限量 |
| 运维负担 | 几乎为 0 | 要管系统、Nginx、证书续期、安全更新 | 几乎为 0 |
| 首年 ≈ 成本 | 100~160 元 | 90~140 元 | 50~100 元 |

**怎么选：**
- 只要"能上线、国内快、以后不折腾" → **A**。
- 想一台机器顺便放别的东西（个人 API、爬虫、图床、练手项目） → **B**，且**买同一台机器即可备案**，一鱼两吃。
- 完全不想碰备案（个人站、访问量小、可接受境外节点） → **C**。

---

## 2.1 常见困惑：EdgeOne Pages 和「轻量服务器」到底什么关系

**一句话：两个不同产品线的产品，功能上没有依赖；它们只在两件事上产生关系——「备案」和「源站」。**

- **EdgeOne Pages** = Serverless/边缘托管的 **PaaS**：你只交代码/文件，平台负责构建、发布、全球 CDN 分发、边缘函数、KV。你**没有公网 IP、没有操作系统、没有 root**。
- **轻量应用服务器（Lighthouse）** = **IaaS 云主机（VPS）**：一台有公网 IP、系统盘、月流量包的虚拟机。Nginx、证书、安全更新、备份全要你自己管。

三层关系：

| 层面 | 关系 |
|---|---|
| 产品归属 | 都属于腾讯云，但属不同产品线（EdgeOne 是「边缘安全加速平台 EO」，轻量属「轻量应用服务器」）。**互不依赖**，可以只用其中一个 |
| **备案** | ⭐ 关键：**轻量是腾讯云认可的可备案资源，EdgeOne（含 Pages）不是**。所以流行"买台最便宜的轻量只为拿备案号，站点实际跑在 Pages 上" |
| 回源/加速 | 轻量既能自己直出（Nginx），也能当 **EdgeOne 的源站**（边缘加速 + 轻量回源）。此时是「边缘 + 源站」关系；Pages 的源站是平台自带存储，不存在源站配置这回事 |

> ⚠️ 用自己腾讯云轻量/CVM 做 EdgeOne 源站时，若未在腾讯云完成**接入备案**，**所有到源站的请求（含回源）会被拦截**；Pages 不涉及此条（[EdgeOne 备案 FAQ](https://cloud.tencent.com/document/product/1552/110835)）。

| 维度 | EdgeOne Pages | 轻量应用服务器 |
|---|---|---|
| 产品类型 | Serverless / 边缘托管 PaaS | IaaS 云主机（VPS） |
| 你要管什么 | 只交文件，其余平台管 | 系统、Nginx、证书续期、安全更新、备份 |
| 公网 IP | 无（走平台 CDN 节点） | 有独立公网 IP |
| 流量 | 免费版**静态流量与请求不限量** | 套餐含**月流量包**，超出按量计费（[价格总览](https://cloud.tencent.com/document/product/1207/73452)） |
| 能跑后端吗 | 只能 Functions/KV（无持久进程、无数据库） | 随便跑 Node/Python/MySQL/Docker |
| HTTPS | 平台自动签发 + 续期 | 自己配（免费证书现为 3 个月一续） |
| 国内加速 | 3200+ 边缘节点，需备案 | 单机直连，速度取决于带宽与地域 |
| **备案资格** | ❌ 不能用于备案 | ✅ 可用于备案（包年包月 ≥3 个月） |
| 成本 | 免费版 0 元 | 新客活动价约 38 元/年 |
| 适合 | 静态站、作品集、博客、SPA | 需要动态能力、爬虫、图床、练手、想要一台真机器 |

**三种组合怎么选（针对本项目）：**

1. **只用 Pages（推荐）**：纯静态站的最优解，性能最好、零运维；另外买台最便宜的轻量**只为备案**。
2. **只用轻量 + Nginx**：适合想顺便放别的服务；一台机同时提供备案资格和站点托管，不需要 Pages。
3. **轻量做源站 + EdgeOne 加速**：适合"轻量上跑着动态应用"的场景。本项目是纯静态，把文件直接交给 Pages 比"放机器上再套 CDN"更简单、更省（少一跳回源、少一次运维）。

**两个容易搞混的点：**

- 买轻量**只为备案** ≠ 站点必须部署在轻量上。备案针对的是「域名 + 接入商」，阿里云官方也说明「备案服务器仅用于获取备案服务码，您的业务可以运行在其他云产品上」（[阿里云备案服务器检查](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-server-access-information-check)）——但**退订备案服务器仍有被取消接入的风险**，跨厂商时还有接入商口径问题（见 §3.2.1）。
- Pages 的"免费不限量"和轻量的"月流量包"是两种计费模型：静态站放 Pages 基本不会产生流量费，放轻量则要盯住月流量包。
  官方也有把两者组合起来的教程：[10 分钟用 Lighthouse + EdgeOne 搭建全球网站](https://www.tencentcloud.com/techpedia/146578)。

---

## 3. 路线 A：EdgeOne Pages + 备案域名（推荐，逐步操作）

### 3.1 买域名（第 0 天，10 分钟）

- 在**阿里云（万网）/ 腾讯云 / 华为云**注册，`.com` 或 `.cn` 都行；三家都自带备案通道，别去境外注册商（境外注册商域名在国内备案会有额外材料与核验麻烦）。
- 选**常用后缀**（`.com`/`.cn`/`.net`），避开 `.top`/`.xyz` 等被部分管局限制或用户信任度低的后缀。
- 立刻做**域名实名认证**（个人：身份证；通常几小时~1 个工作日）。
- **重要**：备案主体（你本人）必须与**域名持有者**一致，且域名实名信息要与备案信息一致，否则备案会被驳回。
- 只注册一个根域名就够；`www` 是免费的子域。

参考成本：`.com` 首年活动价常见 30~60 元、**续费约 70~90 元/年**（`.cn` 通常更便宜）。以注册商结算页为准。

### 3.1.1 域名候选（2026-09-23 用 whois 实测，可注册）

命名主题：昵称「阿票」→ `piao`，站点定位是「个人主页 + AI/Agent 教程」。

| 域名 | .com | .cn | 感觉 / 适合 |
|---|---|---|---|
| `piaolab` | ✅ 空 | ✅ 空 | **首选**：票的实验室，短、好念、技术 + 创作感，主页和课程都撑得住 |
| `piaonotes` | ✅ 空 | ✅ 空 | 票的笔记，和「个人技术学习笔记」的备案定位最贴合 |
| `piaostack` | ✅ 空 | ✅ 空 | 偏工程感，适合 Agent / 工作流类内容 |
| `agentpiao` | ✅ 空 | ✅ 空 | 差异化，「Agent 票」，AI 标签最直白 |
| `piaowiki` / `piaonote` | ✅ 空 | ✅ 空 | 知识库 / 讲义气质 |
| `piaolearn` / `piaoclass` / `piaocourse` | ✅ 空 | ✅ 空 | 课程感强；个人备案时内容要写清「免费分享」 |
| `pzhipiao` / `panzhipiao` | ✅ 空 | ✅ 空 | 全拼实名型，备案一致性最好，缺点是长、不易传播 |
| `newpzp` | ✅ 空 | ✅ 空 | 与 GitHub 账号 NewPZP 一致，极客感 |
| `piaohub` / `piaostudio` / `piaocloud` / `piaoshow` | ❌ 占用 | ✅ 空 | .com 已被占，想用只能拿 .cn |
| `piaoloom` | ✅ 空 | ✅ 空 | 「阿票的织机」：loom 的编织意象很贴 Agent 编排，且个人标签 + 低撞名（.com.cn 也空） |
| `piaoplant` / `piaogrove` / `piaogarden` | ✅ 空 | ✅ 空 | 若喜欢 plant 的生长意象：改成个人词根后 `piaoplant` 连 `.net` 都是空的 |
| `agentloom` | ❌ 占用 | ✅ 空 | ⚠️ 不推荐做主品牌：.com 已被 Cloudflare 托管者占用；AWS 2026 年发布的 AI Agent 治理平台就叫 **Loom**，GitHub 上还有 `linora-u/AgentLoom` 等至少 4 个同名项目，且 `loom.com` 是知名视频工具商标 |
| `agentplant` | ❌ 占用 | ✅ 空 | ⚠️ 撞名少（没找到同名产品），但 `.com` 被占、`.net` 空着；读音中段 `/ntpl/` 拗口，且同属已饱和的 `agent*` 模式 |
| `apiao` / `aipiao` / `piaoai` / `piaozhi` / `piaopiao` | ❌ 占用 | ❌ 占用 | 已被注册，不用考虑 |

> 📌 **实测结论（2026-09-23）：`agent*` 前缀的 `.com` 基本已被扫完。** 连查 17 个组合全部占用的包括：`agentloom`、`agentplant`、`agentgrove`、`agentgarden`、`agentnest`、`agentorchard`、`agentfoundry`、`agentatelier`、`agentbrew`、`agentweaver`、`agentworkshop`、`agentweave`、`agentcraft`、`loomagent`、`loomlab`、`weavelab`……唯一的例外是 `agentpiao.com`（带自己词根）。
> 反过来，`piao*` 词根的组合几乎全空。**结论：用个人词根做前缀，而不是用行业热词** —— 可得性、独特性、SEO 辨识度同时解决。

命名与合规红线：

1. **只用 MIIT 认可的后缀**：`.com` / `.cn` / `.net` / `.com.cn` 等。`.dev`、`.app`、`.io`、`.me` 这类**无法在国内备案**，别选。
2. **绝对不要**把 `deepseek`、`harness` 等品牌/商标词放进域名（商标侵权 + 备案与投诉风险）。
3. 域名持有者实名必须用**真名**，与备案主体一致，别用昵称；买完立刻做实名认证（几小时~1 个工作日），否则备案第一步就卡住。
4. `.com` 做主域，**顺手把同名 `.cn` 一起拿下**（保护性注册，年费很便宜），避免以后被抢注。
5. 不要数字、不要连字符，尽量 ≤ 10 个字符——口播、名片、视频片尾都方便。

### 3.1.2 语义方向：带「定制」含义的候选（2026-09-23 实测）

定位来自 `profile.js` 里的头衔「AI 定制」，所以域名直接承载「定制」语义是加分的。实测：**`piao*` 词根 + 定制类英文词的组合，`.com` / `.cn` / `.com.cn` / `.net` 基本全部空着**（而 `ai*` 前缀的同类词 `aicustom`、`aibespoke`、`aitailor`、`aifit`、`dingzhiai` 全部已被注册）。

| 域名 | 语义贴合 | 好念好拼 | 气质 | 中文受众秒懂 | 备注 |
|---|---|---|---|---|---|
| `piaotailor` | ★★★★★ | ★★★★ | ★★★★ | ★★★ | **首推**：tailor 兼「裁缝」与「tailored solution（定制方案）」，语义最准，四后缀全空 |
| `piaoatelier` | ★★★★ | ★★★ | ★★★★★ | ★★ | 高定工坊的调性最好；但 `atelier` 已被 AI 领域使用（useatelier.ai、Shopify 的 Atelier AI），且读音拼写有门槛 |
| `piaocustom` | ★★★★★ | ★★★★★ | ★★★ | ★★★★ | 最直白、拼写零门槛；缺点是词太泛、不够高级 |
| `piaocouture` | ★★★★ | ★★ | ★★★★★ | ★★ | 高定感最强，但时尚/服装联想最重，拼写最易错 |
| `piaomade` | ★★★ | ★★★★★ | ★★★★ | ★★★ | 最短最干净，「为你而做」 |
| `piaoforge` | ★★★ | ★★★★ | ★★★★ | ★★★ | 锻造/打造感，maker 气质 |
| `piaobespoke` | ★★★★ | ★★ | ★★★★ | ★ | bespoke = 英式全定制，高级但 11 字符、偏小众 |
| `piaodingzhi` / `dingzhipiao` | ★★★★★ | ★★★ | ★★ | ★★★★★ | 就是「定制」二字的拼音，纯中文受众零歧义；代价是长、国际不友好 |

不推荐：`piaotailored`、`piaocustomize`（12 字符，口播和输入都吃力）。

> ⚠️ **如果「定制」意味着将来要接单/收费**：个人 ICP 备案不能承载经营性内容。域名本身没问题，但页面上一旦出现报价、下单、合同等，就需要企业主体备案（经营性 ICP）。建议先以「个人技术分享 + 案例展示」上线，商业化时再做备案变更。
>
> 📌 品牌配套建议：中文名「阿票定制」/ 英文 Piao Tailor；一句话定位沿用现有文案「把复杂的 Agent 与工作流拆开讲透，再按你的场景做出来」；邮箱用 `hi@<主域>`；站点结构 `/`（主页）、`/courses`（教程）、`/custom`（定制服务，可先只放理念不放报价）。

### 3.1.3 不带个人名字的「定制」候选（2026-09-23 实测 60+ 个）

**实测结论：只要用常见英文/行业词组合表达「定制」，`.com` 已被扫完。**
全军覆没（`.com` 已占用）的包括：`tailorai`、`tailorlab`、`tailorly`、`tailorcraft`、`tailorflow`、`tailorforge`、`tailorstudio`、`tailorhouse`、`tailorhub`、`tailorhq`、`bespokeai`、`bespokelab`、`bespokely`、`bespokery`、`bespokio`、`atelierai`、`atelio`、`ateliera`、`coutureai`、`couturelab`、`couturio`、`coutura`、`customai`、`customlab`、`customly`、`customcraft`、`customforge`、`customio`、`customix`、`customery`、`customhouse`、`madeforyou`、`foryouai`、`sartor`、`sartoria`、`sartoro`、`sartorium`、`customizeai`、`custommade`、`bestcustom`。
能空着的只有三类：**拼音词根**、**生造词**、**非 `.com` 后缀**。对应三条可行路线：

**路线 1（推荐）：中文词根 + `.com`** —— 语义零歧义，中文受众秒懂

| 域名 | .com | .cn | 含义 |
|---|---|---|---|
| `liangtilab` | ✅ 空 | ✅ 空 | 「量体裁衣」的 lab，最有画面感，比「定制」更含蓄 |
| `dingzhilab` | ✅ 空 | ✅ 空 | 最直白的「定制 lab」，通用性最强 |
| `dingzhistudio` | ✅ 空 | ✅ 空 | 定制工作室 |
| `dingzhipu` | ✅ 空 | ✅ 空 | 定制铺，亲和、手作感 |
| `dingzhiguan` / `dingzhiworks` | ✅ 空 | ✅ 空 | 定制馆 / 定制工坊 |
| `zhuanshulab` | ✅ 空 | ✅ 空 | 「专属 lab」，比「定制」更高级的措辞 |

**路线 2：坚持英文品牌 → 用 `.com.cn`**（MIIT 认可后缀，备案无障碍，观感比 `.cn` 更像品牌）
实测可拿：`tailorai.com.cn`、`bespokeai.com.cn`、`coutureai.com.cn`、`bespokely.com.cn`、`tailorly.com.cn`、`customio.com.cn`、`atelierai.com.cn` —— 名词对应的 `.com` 全部在别人手里，必须接受。

**路线 3：生造词 / 非英语词**（如意大利语 `sartoria` = 裁缝店）—— `.cn` 空着、独特性高，但中文受众的传达力弱，和「让人一眼知道做定制」的目标相冲突，谨慎使用。

> 若目标是「中文受众一眼看懂 + 拿到 `.com`」，选 `liangtilab.com` 或 `dingzhilab.com`，并把同名 `.cn` 一并注册。若必须英文品牌名，就选 `tailorai.com.cn`。

### 3.1.4 五个 `.cn` 候选横向对比（2026-09-23 实测，决策记录）

| 域名 | 长度 | 贴合「定制」 | 好念 | 好拼 | 品牌气质 | 撞名 | .com | .cn | .com.cn | .net | 评分 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `craftagent` | 10 | ★★★★ 手艺/精工，隐含按需打造 | ★★★★ | ★★★★ | ★★★★ | 中度（GitHub 上有 `craft-ai-agents/craft-agents-oss`） | ❌ | ✅ | ✅ | ❌ | **8/10** |
| `customizeagent` | 14 | ★★★★★ 直译「定制 Agent」 | ★★★ | ★★ | ★★★ | 低（但是 Copilot 文档里的通用说法） | ❌ | ✅ | ✅ | ✅ | **7/10** |
| `developagent` | 12 | ★★ 是「开发」不是「定制」 | ★★★★ | ★★★★ | ★★★ | 低 | ❌ | ✅ | ✅ | ✅ | 5.5/10 |
| `agentplant` | 10 | ★★ 方向相反：plant = 工厂量产 | ★★ `/ntpl/` 拗口 | ★★★ | ★★★ | 低 | ❌ | ✅ | ✅ | ✅ | 5/10 |
| `ai-presentation` | 14 | ★ 无关（演示/汇报） | ★★ 有连字符 | ★★★ | ★★ | 高（GitHub 通用 topic） | ❌ | ✅ | ✅ | ✅ | 4/10 |

三点关键判断：

1. **`agentplant` 的语义方向与「定制」相反** —— plant 是「工厂」（标准化、量产），而定制的本质是「一对一、小批量、专属」。这是五个里唯一语义反了的。再叠加 `/ntpl/` 辅音簇拗口，垫底。
2. **`ai-presentation` 与「定制」无关**，还带连字符（口播/输入都吃亏）、14 字符最长。它唯一的优势是与 GitHub 仓库 `NewPZP/ai-presentation` 同名 —— 作为**项目标识** 10/10，作为**品牌域名** 4/10。
3. **五个的 `.com` 全部被占** —— 无论选哪个，都要接受"用户习惯性输 `.com` 会跑到别人站"。如果这点不能接受，回到 §3.1.3 的 `liangtilab.com` / `dingzhilab.com`（`.com` 空着）。

**结论**：要「一眼看出做定制」选 `customizeagent.cn`（中文名可直接叫「客制 Agent」，`.com.cn` / `.net` 也一并拿下）；要「像个品牌、好念好做视觉」选 `craftagent.cn`（中文副标可用「客制工坊」，注意 `.net` 已被占）。

### 3.2 准备备案资源 + 提交备案（第 0~1 天）

备案不能"凭空备案"，必须挂靠一家云厂商的**中国内地**云资源（拿到"备案服务码"）。各家最低门槛：

| 厂商 | 可用于备案的最低资源 | 条件 | 服务码数量 |
|---|---|---|---|
| 阿里云 | 轻量应用服务器 | 包年包月、购买时长 **>3 个月**（含续费累计）、中国内地 | 5 个 |
| 阿里云 | ECS | 包年包月 **>3 个月** + 必须买公网带宽 | 5 个 |
| 阿里云 | 云虚拟主机 / 函数计算套餐包 / 云市场建站(≥99 元且 12 个月) | 见文档 | 5 / 1 / 1 |
| 腾讯云 | 轻量应用服务器（Lighthouse） | 包年包月 **≥3 个月**，且备案期间剩余有效期 ≥1 个月 | 个人账号同实例最多 5 个网站 |
| 腾讯云 | CVM / Serverless 资源包 / 云开发 TCB | Serverless 需购买指定调用资源包 | Serverless 可备案 2 个网站 |

来源：[阿里云可备案服务器列表](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-server-access-information-check)、[腾讯云备案云资源](https://cloud.tencent.com/document/product/243/18908)。

**省钱技巧**：如果你本来就打算走 A 路线，可以买**阿里云轻量新客 38 元/年（每日 10:00 / 15:00 限量抢购，常规价 68 元/年）**，只用来拿备案服务码；也可以直接买腾讯云轻量 3 个月用于腾讯云侧备案。2026 年阿里云轻量的公开活动价参考：[阿里云服务器价格整理](https://developer.aliyun.com/article/1747583)（同样有 99 计划：经济型 e 2 核 2G / 99 元/年**续费同价**、通用型 u1 2 核 4G / 199 元/年**续费同价**）。

> ⚠️ 备案通过后**不要把备案用的服务器直接退掉**：官方明确提示"退订用于备案的服务器时，需保留至少一台中国内地节点服务器对域名进行解析，否则有备案核查取消接入风险"（阿里云文档同上）。

备案流程与时间（腾讯云官方口径，[备案流程](https://cloud.tencent.com/document/product/243/18909)）：

```
① 验证备案域名/类型        （当场）
② 填写主体+网站信息、上传证件、人脸核验（30~60 分钟，小程序可办）
③ 接入商审核              1~2 个工作日
④ 工信部短信核验          收到短信后 24 小时内到 beian.miit.gov.cn 完成，否则作废重来
⑤ 管局审核                法定上限 20 个工作日（多数省份 3~10 个工作日）
⑥ 通过 → 拿到「X ICP 备 XXXXXXXX 号」
```

个人备案的填写要点：
- 备案省份按**身份证所在省**选（浙江管局对杭州/温州户籍都友好）。
- 网站名称**不要**出现"XX 网/XX 平台/XX 学院/XX 在线/XX 科技"等企业化或敏感词，写成"个人技术笔记""XX 的学习记录"这类最稳。
- 网站内容填"个人技术学习笔记/教程分享"，**不要**写"课程售卖""付费内容"，否则会被要求转企业备案。
- 备案期间**不要把域名解析到内地服务器**、不要让内地 80/443 端口能访问，等通过后再解析。

### 3.2.1 ⚠️ EdgeOne Pages 自己不能备案：正确顺序

**关键事实：EdgeOne（含 Pages）不在腾讯云可备案资源列表里。** [腾讯云备案云资源](https://cloud.tencent.com/document/product/243/18908) 明确列出的可备案资源只有：CVM、轻量应用服务器（Lighthouse）、Serverless 资源包、负载均衡、云开发 TCB、备案授权码 —— **没有 EdgeOne**。EdgeOne 自己的口径也只是「**校验**域名是否已有备案号」，不提供备案通道：

- 加速区域为「全球可用区」或「中国大陆可用区」的域名**必须已完成 ICP 备案**；未备案的域名只能选「全球可用区（不含中国大陆）」。
- 备案失效时，EdgeOne 会**停止该站点下所有域名的加速服务与域名解析服务**（短信/邮件/站内信提醒）；恢复备案后需到控制台**重新启用**域名。
- 备案数据同步有延迟：工信部审核通过后**等 1~2 小时**再去 EdgeOne 添加/启用域名。
  （以上均见 [EdgeOne 域名 ICP 备案相关问题](https://cloud.tencent.com/document/product/1552/110835)）

所以顺序是 **先备案拿到备案号 → 再往 Pages 加域名**：

```
① 买腾讯云轻量（与备案同一账号）
② 腾讯云备案系统提交首次备案，拿到 ICP 备案号
③ 等 1~2 小时（工信部数据同步）
④ EdgeOne Pages 添加自定义域名，加速区域选「中国大陆可用区」或「全球可用区（含中国大陆）」
⑤ 加 CNAME → 平台自动签发并续期 HTTPS
```

**跨厂商备案（备案在阿里云、加速用 EdgeOne）可行吗？**
- 技术上可以：EdgeOne 只校验工信部备案号，**不强制要求腾讯云接入备案**；官方明确「源站为腾讯云服务器（CVM/Lighthouse）时才会检测腾讯云接入备案，且检测结果仅作提醒不强制限制接入」——EdgeOne Pages 的源站是平台自带存储，不涉及这条。但要注意：**若你以后回源到自己的腾讯云服务器且未做接入备案，回源请求会被拦截**。
- 两个真实隐患：① 腾讯云备案文档的通用口径是「未在对应接入商处完成备案，会被识别为未备案域名，不可在该平台上开展业务」，且**新增接入同样需要有腾讯云可备案资源**；② 原接入商（阿里云）会做核查，官方原话是「备案成功后退订用于备案的服务器时，需保留至少一台阿里云中国内地节点服务器对域名进行解析，否则有**备案核查取消接入**风险」——域名全量指向 EdgeOne 之后被取消接入，备案号就会失效。
- **建议**：既然用 EdgeOne Pages，就**用腾讯云备案**（轻量新客 2 核 2G 约 38 元/年，是当前最省钱的合规路径）。确实想在阿里云备案，就把站点也放阿里云（OSS+CDN 或轻量 + Nginx），别跨厂商。

**备案期间怎么让站点先上线**：项目加速区域先选「**全球可用区（不含中国大陆）**」，绑定自定义域名先跑起来（该区域**不要求备案**）；备案通过后再切到大陆区域。注意平台生成的「项目域名/部署域名」在大陆区域只有 3 小时有效的预览链接、在非大陆区域会被大陆网络返回 401，**自定义域名不受这个限制**（官方也建议绑定自定义域名建立稳定访问通道）。

### 3.2.2 腾讯云备案实操步骤（个人主体，微信小程序）

1. **前置**：域名已完成实名认证（境外注册商的域名无法备案）；腾讯云账号已完成**个人实名认证**，且账号实名、域名持有者、备案主体必须是**同一个人**。
2. 微信搜「腾讯云助手」小程序（或腾讯云 App）→ 登录 → 备案 → **开始备案 → 首次备案**。
3. **验证备案类型**：备案地区选身份证所在省；备案性质选「个人」；应用服务类型选「网站/域名」；填要备案的域名。
4. **云资源**：选你账号下那台腾讯云轻量/CVM。⚠️ **个人账号不能生成备案授权码**，也无法借用他人账号的资源，所以资源必须买在自己账号下。个人主体一个轻量实例**最多备案 5 个网站**。
5. **主体信息**：姓名/证件与账号实名一致；通信地址精确到门牌；按提示做**人脸核验**（小程序内完成，不用邮寄材料）。
6. **网站信息**：网站名称写「个人技术学习笔记」这类，**不要出现「XX 网 / XX 平台 / XX 学院 / XX 科技」**；服务内容写「个人技术学习与教程分享」，**不要出现课程售卖、付费内容**（否则会被要求转企业/经营性备案）。
7. **提交** → 腾讯云审核 **1~2 个工作日** → 收到工信部短信后**必须在 24 小时内**到 [beian.miit.gov.cn](https://beian.miit.gov.cn/) 完成短信核验（超时订单作废，要重来）→ 管局审核（法定上限 **20 个工作日**，多数省份 3~10 天）。
8. **通过后**：先在页脚展示「X ICP 备 XXXXXXXX 号」并链接工信部（改法见 §3.5），再在开通后 30 日内补**公安联网备案**。

### 3.3 部署站点（第 0 天就能做完，先不绑域名）

准备好发布包（排除本地文件）：

```bash
cd /Users/panzhipiao/workspace/ai-presentation
rsync -av --exclude='.git' --exclude='.agents' --exclude='.DS_Store' \
      --exclude='add-course.py' ./ /tmp/ai-presentation-dist/
```

然后任选一种（1~3 是常规方式，4~5 是让 AI/命令行直接部署）：

1. **Git 集成（推荐）**：EdgeOne Pages 控制台 → 新建项目 → 导入 Git 仓库 → 授权 GitHub → 选 `NewPZP/ai-presentation`。
   - 构建命令：留空（本项目无需构建，若强制要求可填 `exit 0`）
   - 输出目录：仓库根目录 `.`（或按平台要求填 `/`）
   - 以后 `git push` 即自动发布。
2. **直接上传**：控制台用"直接上传"，把上面的 `/tmp/ai-presentation-dist/` 拖进去（适合先试效果）。
3. **CLI / GitHub Action**：适合放进自动化流水线，见 [EdgeOne Pages 部署指南 / EdgeOne CLI](https://pages.edgeone.ai/zh/document/edgeone-cli)。
4. **MCP（让 AI Agent 直接部署）**：官方 [EdgeOne Pages MCP](https://cloud.tencent.com/developer/mcp/server/10011)（npm：`@edgeone/makers-mcp`，旧名 `edgeone-pages-mcp-fullstack`）提供 `deploy_folder`、`account_info` 两个工具（已实测可启动并列出这两个工具）。在 DSH 里注册 MCP 服务器：编辑 `~/.dsh/profiles/desktop/cordis.patch.yml`（profile 补丁层，支持 `insert` 列表）：

```yaml
- insert:
    - id: mcp-edgeone-makers
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: edgeone
        transport: stdio
        command: npx
        args: ['-y', '@edgeone/makers-mcp@latest', '--region', 'china']
        toolCallTimeoutMs: 600000
```

重启 DSH 后工具以 `mcp__edgeone__deploy_folder` 形式出现。不带 `EDGEONE_PAGES_API_TOKEN` 时首次部署会自动打开浏览器登录页；配上 token（或 `EDGEONE_PAGES_PROJECT_NAME`）即可全自动、并指定已存在的项目。
5. **零凭据的匿名部署（最快验证，不需要账号）**：
   `npx edgeone@latest makers deploy <目录> --anonymous --site china --skip-ai-gateway-sync --json`
   会返回临时访问 URL + 认领链接；**项目必须在有效期内 `claim`，否则会被删除**，预览链接也有时效（实测带 token 的链接 3 小时）。

**加速区域选择**：项目设置里选「中国大陆可用区」或「全球可用区（含中国大陆）」（**需备案**）；如果暂时没备案，先选「全球可用区（不含中国大陆）」做预览。

### 3.4 绑定域名 + HTTPS（备案通过后）

1. 备案通过后**等 1~2 小时**（工信部数据同步），再到 Pages 控制台 → 项目设置 → 把**加速区域**改为「中国大陆可用区」或「全球可用区（含中国大陆）」→ 域名管理 → 添加自定义域名（如 `www.yourdomain.com`，根域也可以）。
2. 按提示到域名 DNS 处加 **CNAME**（根域用 CNAME 展平/或直接解析 `@`）；建议把域名 DNS 托管到腾讯云 DNSPod，校验最顺。
3. 平台校验通过后**自动签发并续期 HTTPS 证书**，无需自己管 3 个月一换的免费证书。
4. 若提示「未备案 / 需接入备案」：先确认工信部查询已能查到备案号（[查询入口](https://beian.miit.gov.cn/)）；若备案在阿里云而控制在腾讯云侧提示接入，**新增接入同样需要有腾讯云可备案资源**（[接入备案](https://cloud.tencent.com/document/product/243/37403)），因此更推荐一开始就用腾讯云备案。
5. 备案若中途失效，EdgeOne 会停掉该站点全部域名的加速与解析，恢复备案后需回控制台**重新启用**域名。

### 3.5 上线后必做

**① 页脚展示备案号（法定要求，必须带工信部链接）。**
本项目 footer 是 `index.html:204` 的 `<footer class="footer" data-profile="footer"></footer>`，且该元素由 JS 以 `textContent` 注入文案，所以**不要**把链接塞进 `profile.js`，直接在 footer 下面加一行：

```html
<!-- index.html，紧跟在第 204 行 footer 之后 -->
<p class="footer" style="border-top:0;padding-top:0">
  <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener">浙ICP备2026XXXXXX号-1</a>
</p>
```

**② 公安联网备案**：网站开通后按规定在 [全国互联网安全管理服务平台](http://www.beian.gov.cn/) 做公安备案（工信部备案 ≠ 公安备案，两者都要；多地要求开通后 30 日内完成，实际执行尺度不一）。通过后同样把公安备案号放到页脚。

**③ 缓存与 404**：HTML 建议短缓存/协商缓存（避免改版后用户看到旧页），静态资源可长缓存；给站点配一个自定义 404 页（本项目没有 `404.html`）。

**④ 监控流量**：Pages 控制台有流量/请求/带宽指标，个人站基本用不完免费额度。

---

## 4. 路线 B：阿里云轻量 + Nginx（一台机全包）

**为什么也值得考虑**：这台机器既能拿来备案（5 个服务码），又能直接当 Web 服务器，不需要 CDN，不依赖第三方平台免费策略；对 41 个静态页 + 月几百 PV，2 核 2G/200M 峰值带宽绰绰有余。

```bash
# 服务器上（Alibaba Cloud Linux / Ubuntu 均可）
sudo mkdir -p /srv/ai-presentation
# 本地推送（把 dist 目录同步上去）
rsync -avz --delete /tmp/ai-presentation-dist/ root@<服务器IP>:/srv/ai-presentation/
```

```nginx
# /etc/nginx/conf.d/ai-presentation.conf
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name yourdomain.com www.yourdomain.com;

    root /srv/ai-presentation;
    index index.html;
    charset utf-8;

    # 免费证书（3 个月有效期，用 acme.sh/certbot 自动续期）
    ssl_certificate     /etc/nginx/ssl/yourdomain.com.pem;
    ssl_certificate_key /etc/nginx/ssl/yourdomain.com.key;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1k;

    # HTML 短缓存，静态资源长缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|webp|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    # 无扩展名路径兜底
    location / {
        try_files $uri $uri/ $uri.html =404;
    }
    error_page 404 /404.html;
}
```

> 免费证书现状：阿里云/腾讯云免费 DV 证书**有效期已调整为 3 个月**、每账号每年约 20 张，因此**必须做自动续期**（acme.sh 更省事）。来源：[免费 SSL 证书调整说明](https://www.51dns.com/info/detail/10826.html)。

**这条路的长期成本**取决于续费价：轻量新客 38 元/年是首年活动价；阿里云「99 计划」的经济型 e（2 核 2G，99 元/年，**续费同价**）更适合长期持有，且同样满足备案条件（包年包月 >3 个月 + 公网带宽）。

---

## 5. 路线 C：免备案（境外节点）

两种做法：

1. **EdgeOne Pages 加速区域选「全球可用区（不含中国大陆）」**：绑定自定义域名**无需备案**，免费版流量不限量，中国内地访问走境外节点（延迟通常比国内节点高 50~150 ms，晚高峰波动更明显）。
2. **香港/新加坡轻量服务器 + Nginx**：域名解析到境外 IP，同样无需备案（[阿里云官方说明](https://help.aliyun.com/zh/icp-filing/not-for-the-record-dns-can-access-to-different-areas)）；成本按官网活动价，通常每月二三十元起。

注意事项：
- 域名在国内注册商注册、解析到境外服务器是**允许**的（不会因未备案被回收或限制解析）。
- 官方口径：非内地服务器**也需要做公安备案**；实际执行各地尺度不同，若长期运营建议补上。
- 若以后想转国内加速，随时可以补备案（备案不依赖是否已在境外上线）。

---

## 6. 时间线（推荐路线 A）

| 时间 | 动作 | 产出 |
|---|---|---|
| D0（30 分钟） | 注册域名 + 实名认证 | 拿到域名 |
| D0（30 分钟） | 买阿里云轻量（38/68 元）或腾讯云轻量 3 个月 | 备案资源 |
| D0（1 小时） | 部署到 EdgeOne Pages（Git 导入或直接上传），用平台预览域名验证站点 | 站点已可访问（预览域名） |
| D0（1 小时） | 修掉本文 §1 的 4 个上线前问题 | 干净的发布包 |
| D1 | 提交备案（接入商审核 1~2 工作日） | 备案订单 |
| D2~D3 | 工信部短信核验（24 小时内完成） | 进入管局审核 |
| D3~D15 | 管局审核（多数省份 3~10 工作日，上限 20） | **ICP 备案号** |
| 通过后当天 | 绑定自定义域名 + HTTPS + 页脚备案号 | `https://yourdomain.com` 国内直连 |
| 上线 30 日内 | 公安联网备案 | 公安备案号 |

**总耗时：约 1~3 周**，其中真正要动手的时间不到半天。

---

## 7. 成本估算

| 项目 | 首年 | 第二年及以后 | 说明 |
|---|---|---|---|
| 域名（.com） | 30~60 元 | 70~90 元 | 活动价 / 续费价，以注册商为准 |
| 备案资源（阿里云轻量 38~68 元 或 腾讯云轻量 3 个月） | 38~68 元 | 99 元（99 计划续费同价）或按活动价续 | 既满足备案，也可直接当服务器 |
| 静态托管（EdgeOne Pages 免费版） | 0 | 0 | 静态流量/请求不限量 |
| HTTPS 证书 | 0 | 0 | 平台自动签发（自建 Nginx 则需 3 个月一续） |
| **合计（A 路线）** | **约 100~160 元** | **约 100~200 元** | 若 B 路线用同一台机托管，则无需额外托管费 |
| **合计（C 路线，免备案）** | **约 50~100 元** | **约 70~90 元** | 只有域名成本 |

对比：如果走对象存储 + CDN（阿里云 OSS / 腾讯云 COS）也是可行的（存储费按 GB/月、流量按 GB 计费，个人站一年通常几十元以内），但**绑定自定义域名同样要求域名已备案**（[阿里云 OSS/CDN 备案规则](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-server-access-information-check)），且配置项更多，对本项目没有额外收益，因此不作为首选。

---

## 8. 合规红线与坑

1. **不敢"先解析后备案"**：未备案域名指向内地服务器会被**直接阻断**，还可能影响同一账号后续备案。
2. **不要退掉备案服务器**：会触发"取消接入"，备案号可能被注销。
3. **域名持有者 = 备案主体**，中途过户域名需同步做备案变更。
4. **备案信息变更要及时**：换手机号/换接入商/换服务器（跨厂商）都要做变更或新增接入，否则核查时会被注销。
5. **个人备案不能做经营性内容**：一旦出现课程售卖、付费社群、广告联盟、带货链接，需转企业备案（经营性 ICP）。目前本站是免费教程/个人主页，属安全区。
6. **内容合规**：教程正文里若含破解、翻墙、代理、外挂、以及指向被墙站点的推广，容易被抽查下架，建议过一遍。
7. **别用境外注册商域名去备案**：不是绝对不行，而是要多走域名核验材料，不值得。
8. **平台免费策略有变更风险**：EdgeOne Pages 免费版目前"永久提供、流量不限量"，但**建议同时保留一份可一键切到"阿里云轻量 + Nginx"的能力**（本项目是纯静态，切换成本几乎为 0 —— 这正是它的最大优势）。

---

## 9. 上线前检查清单（可直接勾）

- [ ] 域名已实名认证，持有者与备案主体一致
- [ ] 备案资源已购买（包年包月、内地节点、时长≥3 个月）并拿到服务码
- [ ] `rag-interview-course/reference/rag-roadmap.html` 的 `../RESOURCES.md` 死链已处理
- [ ] 三处 HTML 里的 5 个 `*.md` 链接已改为 HTML 或移除
- [ ] `demo.gif`（8 MB）已压缩/替换为 webp 或 mp4
- [ ] 发布包已排除 `.git/`、`.agents/`、`.DS_Store`、`add-course.py`
- [ ] 站点在预览域名下全量点过一遍（首页筛选、教程弹窗、课节跳转、明暗模式）
- [ ] 自定义域名 + HTTPS 生效，`http` 自动跳 `https`
- [ ] 页脚已展示 ICP 备案号并链接 `https://beian.miit.gov.cn/`
- [ ] 公安联网备案已提交
- [ ] 缓存策略（HTML no-cache / 资源长缓存）与 404 页已配置
- [ ] 备案服务器未退订；续费提醒已设置（域名 + 服务器）

---

## 10. 参考来源

- [未备案域名解析至不同地区服务器的访问规则 · 阿里云](https://help.aliyun.com/zh/icp-filing/not-for-the-record-dns-can-access-to-different-areas)
- [备案服务器检查（可备案云产品列表/服务码规则） · 阿里云](https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/icp-filing-server-access-information-check)
- [EdgeOne 域名 ICP 备案相关问题（加速区域要求/备案失效机制/接入备案提醒） · 腾讯云](https://cloud.tencent.com/document/product/1552/110835)
- [ICP 接入备案（新增接入同样需要腾讯云可备案资源） · 腾讯云](https://cloud.tencent.com/document/product/243/37403)
- [ICP 备案流程（审核时长/短信核验/管局 20 工作日） · 腾讯云](https://cloud.tencent.com/document/product/243/18909)
- [备案云资源（轻量/CVM/Serverless 备案条件） · 腾讯云](https://cloud.tencent.com/document/product/243/18908)
- [EdgeOne Pages 域名管理与加速区域备案要求 · 腾讯云](https://edgeone.cloud.tencent.com/pages/document/162936836982489088)
- [EdgeOne Pages 定价与免费版说明](https://pages.edgeone.ai/zh/pricing) ｜ [正式版公告（免费版长期有效）](https://pages.edgeone.ai/zh/resources/pages-general-availability)
- [Edge Functions and Pages 计费 · 阿里云 ESA](https://help.aliyun.com/en/edge-security-acceleration/esa/user-guide/functions-and-pages-billing)
- [2026 年阿里云服务器价格整理（轻量 38 元/年、99 计划）](https://developer.aliyun.com/article/1747583)
- [腾讯云轻量应用服务器 2 核 2G 新客 38 元/年（2026）](https://cloud.tencent.cn/developer/article/2657551)
- [免费 SSL 证书有效期调整为 3 个月](https://www.51dns.com/info/detail/10826.html)
