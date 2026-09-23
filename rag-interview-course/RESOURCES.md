# RAG 面试冲刺 · 学习资源

本课程只信任这里列出的来源。课程里的每一处事实性断言都应该能追到下面的某一条；如果你发现某节课说了这里没依据的话，直接质问我。

**验证口径（2026-09-23）**：每条都标了置信度。`已核` = 实际抓取过页面、或通过 arXiv API 核对过编号与标题，**并且**记下了它的局限；`未核` 只出现在 `## Gaps` 里，不会写进上面的正文。凡是「一手论文 / 官方博客」的条目，我都注明了它的数据是在什么条件下测的——**厂商自测的数字不能当第三方结论用，这一点面试时同样成立**。

本文件的来源数量（29 条）远小于典型「RAG 资料合集」，这是故意的：宁可少，不可假。

## 原始论文与算法原理

以下 arXiv 条目的**编号、标题、提交日期均通过 arXiv API 核对**；非 arXiv 条目注明核验方式。

- [已核 · 论文: _Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks_ — Lewis et al., NeurIPS 2020](https://arxiv.org/abs/2005.11401)
  RAG 的原始论文（2020-05-22）。提出「参数化记忆（seq2seq）+ 非参数化记忆（Wikipedia 稠密向量索引）」，并对比 RAG-Sequence / RAG-Token 两种边缘化方式。
  Use for: 回答「RAG 从哪来、为什么不是微调」。**注意**：它的原始形式是端到端微调检索器与生成器，和今天「现成 embedding + 现成 LLM」的工程式 RAG 不是一回事——点出这个差别是加分项。

- [已核 · 论文: _Dense Passage Retrieval for Open-Domain Question Answering_ — Karpukhin et al., EMNLP 2020](https://arxiv.org/abs/2004.04906)
  双塔稠密检索的奠基工作（2020-04-10）：用 in-batch negatives + BM25 hard negatives 训练，top-20 检索准确率比 Lucene-BM25 高 9%–19%。
  Use for: 回答「为什么要 dense retrieval、retriever 怎么训」——这个训练配方必须能复述。

- [已核 · 论文: _Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks_ — Reimers & Gurevych, EMNLP 2019](https://arxiv.org/abs/1908.10084)
  用 siamese / triplet 结构把 BERT 改造成可离线编码的句向量模型（2019-08-27），把 1 万句找最相似对从 65 小时降到 5 秒。
  Use for: 回答「bi-encoder 和 cross-encoder 有什么区别」——这是标准引用。

- [已核 · 论文: _ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT_ — Khattab & Zaharia, SIGIR 2020](https://arxiv.org/abs/2004.12832)
  晚交互（late interaction）架构（2020-04-27）：query / document 分别编码后做 MaxSim 细粒度匹配，效果接近 BERT 重排但快两个数量级。
  Use for: 回答「双塔和交叉编码器之外还有没有第三条路」——**这是拉开差距的答案**。

- [已核 · 论文: _Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods_ — Cormack, Clarke & Büttcher, SIGIR 2009](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf)
  RRF 的原始出处（作者 Cormack 在滑铁卢大学主页；PDF 已下载确认标题与作者，2 页短文；DOI 10.1145/1571941.1572114）。
  Use for: 回答「两路检索结果怎么合并」——RRF 只用排名不用分数，所以无需对齐 BM25 与余弦这两个量纲不同的分数。**注意**：这是 2009 年的 IR 论文，不是 RAG 时代产物；说出「老方法解决新问题」很加分。

- [已核 · 论文: _Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs_ — Malkov & Yashunin](https://arxiv.org/abs/1603.09320)
  HNSW 原始论文（2016-03-30，v4 于 2018）：多层可导航小世界图、指数衰减的层级分配、邻居选择启发式，达成对数级查询复杂度。
  Use for: 回答「一亿条向量怎么做到毫秒级」以及 `efSearch` / `M` 参数怎么调。

- [已核 · 教材: _Okapi BM25: a non-binary model_ — Introduction to Information Retrieval, Ch.11 (Manning/Raghavan/Schütze, Stanford)](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
  BM25 的标准形式与参数语义的权威出处：<code>k₁</code> 调节词频缩放（<strong>k₁=0 退化为二值模型</strong>），<code>b</code> 控制文档长度归一化（<strong>b=1 完全归一化、b=0 不归一化</strong>），无优化时的推荐值为 k₁ 取 1.2–2、b 取 0.75。另给出 IDF 精细变体 `log((N-df+0.5)/(df+0.5))` 及其「词出现于过半文档时变负」的缺陷。
  Use for: 第 3 课 BM25 公式与参数的全部依据；算法岗问「k₁ 和 b 分别控制什么」时靠它答，不靠记忆。

- [已核 · 论文: _Approximate Nearest Neighbor Negative Contrastive Learning for Dense Text Retrieval_（ANCE）— Xiong et al., 2020](https://arxiv.org/abs/2007.00808)
  指出稠密检索的瓶颈在**负样本分布与测试时不一致**，提出用随训练同步更新的 ANN 索引采样「更真实」的负例（2020-07-01，v2 2020-10）。
  Use for: 回答「hard negative 为什么有效」——这是该问题的首选论文，也是算法岗的高频深挖点。

- [已核 · 论文: _BEIR: A Heterogenous Benchmark for Zero-shot Evaluation of Information Retrieval Models_ — Thakur et al., NeurIPS 2021](https://arxiv.org/abs/2104.08663)
  18 个异构数据集的零样本检索基准（2021-04-17）。结论：**BM25 是极强的基线**，重排与晚交互零样本表现最好但代价高，稠密检索的泛化仍有明显空间。
  Use for: 回答「为什么生产上还要 hybrid + rerank」——这是最硬的实证弹药。

- [已核 · 论文: _MTEB: Massive Text Embedding Benchmark_ — Muennighoff et al., 2022](https://arxiv.org/abs/2210.07316)
  8 类任务、58 数据集、112 语言的嵌入模型综合基准（2022-10-13）。关键结论：**没有任何单一嵌入方法在所有任务上占优**。
  Use for: 回答「embedding 模型怎么选、MTEB 榜单能不能直接信」。**注意**：榜单本身在 HF Spaces 上，引用具体排名时必须核对当期榜单，别背过期的名次。

- [已核 · 论文: _Lost in the Middle: How Language Models Use Long Contexts_ — Liu et al., TACL 2023](https://arxiv.org/abs/2307.03172)
  实验证明相关信息落在长上下文**中间**时性能显著下降，「长上下文模型」也不例外（2023-07-06）。
  Use for: 回答「检索到 20 条要不要全塞进去、怎么排」——这是上下文组装环节的必引依据。

- [已核 · 论文（综述）: _Retrieval-Augmented Generation for Large Language Models: A Survey_ — Gao et al.](https://arxiv.org/abs/2312.10997)
  把 RAG 划分为 Naive / Advanced / Modular 三代，系统整理检索、生成、增强三部分与评测（2023-12-18，v5 2024-03）。
  Use for: 建立「RAG 技术全景」的话术骨架，也是你 2–3 个月路线的地图。**注意**：作者自标 Ongoing Work，结构会变。

## 官方工程实践与架构

- [已核 · 官方工程博客: _Introducing Contextual Retrieval_ — Anthropic, 2024-09-19](https://www.anthropic.com/engineering/contextual-retrieval)
  **阶段一的核心一手资料**。同一套数据上的可叠加收益：单用向量检索 top-20 失败率 5.7% → 加 BM25 降到 2.9% → 再加 rerank 降到 1.9%。另给上下文增强切分的做法与成本（约 $1.02 / 百万文档 token），以及「知识库小于 20 万 token 就别上 RAG」的判断。
  Use for: 切分、混合检索、重排收益的量化依据。**注意**：其中的 embedding 对比用的是 Gemini / Voyage，**没测开源模型**，数字不能外推到 BGE / Qwen 系列。

- [已核 · 官方工程博客: _Chunking Strategies for LLM Applications_ — Pinecone](https://www.pinecone.io/learn/chunking-strategies/)
  梳理固定长度、递归字符、文档结构、语义、上下文增强等切分策略及取舍（更新至 2025-06）；包含常被忽略的 **chunk expansion**（取邻近块）与「先固定长度、再按 chunk size 网格化做 A/B」的工程方法。
  Use for: 第 2 课切分策略的主源。**注意**：偏入门，无自研实验数据，语义切分部分引用的是社区 notebook。

- [已核 · 官方工程博客: _Hybrid Search in Qdrant_ — Dylan Couzon, Qdrant](https://qdrant.tech/articles/hybrid-search/)
  并列 dense / sparse 各自失效的反例，RRF 与 DBSF 融合的差异，加一路稀疏检索的实测延迟代价，以及 5 个公开数据集上「RRF 在 4/5 数据集优于单路」的 nDCG@10 对比。
  Use for: 回答「加混合检索到底有没有用」——目前最有说服力的一手材料。**注意**：延迟数字来自单容器单请求，不能当生产结论。

- [已核 · 官方工程博客: _Unlocking the Power of Hybrid Search: A Deep Dive into Weaviate's Fusion Algorithms_ — Weaviate](https://weaviate.io/blog/hybrid-search-fusion-algorithms)
  用逐步数值例子讲清 `rankedFusion`（1/(rank+60)）与 `relativeScoreFusion`（归一化后加权求和）的区别、`alpha` 参数的语义，以及 v1.24 起默认改为 relativeScoreFusion。
  Use for: 回答「两路分数尺度不同怎么融合」——图示化解释最好的一篇。**注意**：2023 年文章，文中 6% recall 提升是厂商内部 FIQA 基准，非第三方复现。**另有一处需要当心的缺陷**：文中 rankedFusion 的示例数值表内部不自洽——RRF 分数在同一路内应当随名次单调递减，但该表给出的值并非如此（例如向量一路名次最后但分数最高）。因此第 3 课**只采用该文的机制描述与 alpha 语义，未采用它的示例数字**，RRF 手算范例由我们自己按 `Σ 1/(k+r(d))` 独立计算并复核。引用该文时不要搬它的数值表。

## 评测与指标

- [已核 · 论文: _Ragas: Automated Evaluation of Retrieval Augmented Generation_ — Es et al.](https://arxiv.org/abs/2309.15217)
  提出无需人工标注的 RAG 评估指标体系，拆成「检索是否找到相关且聚焦的上下文」「LLM 是否忠实使用上下文」「生成本身质量」三个维度（2023-09-26，v2 2025-04）。
  Use for: 回答「没有标注数据怎么评测」。

- [已核 · 官方文档: Ragas — 可用指标清单](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
  逐一列出 Context Precision / Context Recall / Noise Sensitivity / Response Relevancy / Faithfulness 等指标。
  Use for: 明确「faithfulness 和 answer relevancy 分别衡量什么、什么时候用哪个」。**注意**：文档随版本频繁变动（v0.1→v0.4 有迁移指南），回答时要说明版本。

- [已核 · 教材章节: _Evaluation of ranked retrieval results_ — Introduction to Information Retrieval, Ch.8 (Manning/Raghavan/Schütze, Stanford)](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
  从 precision-recall 曲线讲到 11 点插值、MAP、Precision@k、R-precision、ROC，并给出 **nDCG 的完整公式与归一化因子含义**。
  Use for: 讲 Recall@k / MAP / nDCG 定义时的权威来源，最不容易被面试官挑错。**注意**：**该页没有单独定义 MRR**，MRR 见 Gaps。

## 高级与前沿 RAG

- [已核 · 官方工程博客: _When Is a Reranker Worth It?_ — Dylan Couzon, Qdrant, 2026-08-23](https://qdrant.tech/articles/when-a-reranker-is-worth-it/)
  **第 4 课的主源**。核心方法是「排序差距诊断」：把候选集当作完美排序打分，与当前得分之差就是任何排序阶段能捞回的上限（200 候选深度下为 nDCG@10 的 0.247–0.487）。另有：三步测法（10 个候选起步）、四个交叉编码器 × 五个数据集的增益表（含 WANDS 对默认 RRF +0.039、对调好融合 −0.008 的关键反例）、失败诊断的两个不匹配（窗口截断、训练领域）、候选数规则（10 个上就输的配置加到 200 仍输）、CPU 吞吐表（100 候选下 0.5–5 秒/查询）。
  Use for: 重排的全部量化依据与验证纪律。**注意**：自述为方向性参考（单分片单批次、未量化未过滤、Apple M5 Pro 15 线程 CPU），必须在自己的语料与并发下重测。

- [已核 · 官方工程博客: _Candidate Depth: How Much Retrieval Is Enough?_ — Dylan Couzon, Qdrant, 2026-08-21](https://qdrant.tech/articles/candidate-depth/)
  候选深度的定义与测量：「最优可能 vs 当前得分」随深度 10→500 的曲线（最优可能涨 +0.103–0.282，当前得分只动 +0.002–0.010）、RRF 在深处可能使融合分数下降（CodeSearchNet 峰在 200、DBPedia 峰在 50）、**深度按分片计**（12 分片 × limit 200 = 集合级最多 2400 个候选）、`hnsw_ef` 的饱和度实测（16→512 对 fused nDCG@10 影响 ≤0.0022，延迟涨 4%–49%）、int8 量化的影响（≤0.0001）。
  Use for: 第 4 课候选数与第 5 课评测的设计依据；也解释了「加深候选」与「改排序」的分工。**注意**：同为方向性参考，需自行重测。

- [已核 · 论文: _Precise Zero-Shot Dense Retrieval without Relevance Labels_（HyDE）— Gao et al., 2022](https://arxiv.org/abs/2212.10496)
  先让 LLM 生成一篇「假想文档」再编码检索，靠编码器的稠密瓶颈过滤幻觉细节（2022-12-20）。
  Use for: 回答「查询改写有哪些做法」。**注意**：Anthropic 的 Contextual Retrieval 报告中提到评估过同类思路、收益有限——能平衡表述是加分项。

- [已核 · 论文: _Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection_ — Asai et al., 2023](https://arxiv.org/abs/2310.11511)
  通过 reflection token 让模型按需检索并自我批判检索结果与自身生成（2023-10-17）。
  Use for: 回答「自适应检索 / 什么时候不该检索」，以及**「为什么不直接上它」**——训练成本是关键代价。

- [已核 · 论文: _Corrective Retrieval Augmented Generation_（CRAG）— Yan et al., 2024](https://arxiv.org/abs/2401.15884)
  用轻量检索评估器给检索质量打置信度，据此触发 correct / incorrect / ambiguous 三种动作，必要时退化为 web 搜索，并用 decompose-then-recompose 过滤无关句（2024-01-29，v3 更新实验）。
  Use for: 回答「检索错了怎么办 / RAG 鲁棒性」——比「加个拒答」完整。**注意**：web 搜索兜底依赖外部服务，要说明工程成本。

- [已核 · 论文（厂商研究）: _From Local to Global: A Graph RAG Approach to Query-Focused Summarization_ — Edge et al., Microsoft Research, 2024](https://arxiv.org/abs/2404.16130)
  用 LLM 两阶段构建实体知识图谱 + 社区摘要，解决「整个语料的全局性问题」这类朴素 RAG 必失败的场景（2024-04-24）。
  Use for: 回答 GraphRAG 与向量 RAG 的分工边界。**注意**：成本高（需对全语料做 LLM 抽取），面试中应说明适用场景而非当默认方案。

- [已核 · 论文（综述）: _Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG_ — Singh et al.](https://arxiv.org/abs/2501.09136)
  按 agent 数量、控制结构、自主性、知识表示四个维度给 Agentic RAG 分类，梳理 reflection / planning / tool use / multi-agent 四种设计模式（2025-01-15，v4 2026-04）。
  Use for: 回答「Agentic RAG 与普通 RAG 的区别」的体系化依据。**注意**：偏架构分类，缺统一基准上的定量对比。

## 中文面试八股与实战（二手）

**这一类的定位：只当「题目索引」用，绝不当答案权威源。** 三条都已抓取确认正文存在，但都不足以作为事实依据。真正带可复现失败细节的中文踩坑复盘，本次一条都没找到。

- [已核 · 二手解读: 详解面试高频的 28 个 RAG 问题（霍格沃兹测试开发学社，腾讯云开发者社区）](https://cloud.tencent.com/developer/article/2586630)
  按「基础认知 / 常见十大坑 / 高级机制 / RAG-Fusion / 优化策略」整理 28 个高频问法。
  Use for: **列问题清单自查**——把每个问题当索引，再回到上面的论文补答案。**注意**：答案普遍只有科普深度，部分术语不严谨（把 Context Window Re-weighting 当标准方案）；发布方是培训招生引流，2025-11 整理稿。

- [已核 · 二手解读: 别轻易写「熟悉 RAG」：一次次穿帮的简历背后，是对技术复杂度的误判（掘金）](https://juejin.cn/post/7507203999102763048)
  从面试官视角拆解全链路与追问点（dense vs sparse、混合检索、幻觉控制、Precision/Recall、MRR、MAP、嵌入模型选型），有真实「简历穿帮」叙事。
  Use for: 学「怎么讲」的语感与追问预判。**注意**：多处转述 DataCamp / Galileo / Pinecone 却**不给链接**，数据不可回溯，**没有一手踩坑细节**。

- [已核 · 二手解读: RAG 科普文！检索增强生成的技术全景解析（致Great，腾讯云开发者社区）](https://cloud.tencent.com/developer/article/2496542)
  术语词典式全景：分块方法、检索家族（BM25 / SPLADE / DPR / ANCE / ColBERT / cross-encoder）、指标（Precision@k / MRR / MAP / nDCG / 忠实度 / 幻觉率）、RAGOps 分层、新兴模式。
  Use for: 快速扫一遍名词，确认自己没漏掉某个概念。**注意**：实为某英文综述的**中文机器翻译摘编**，有实质术语错误（accuracy 与 precision 混译成「准确度/准确率」），**引用前必须回原始来源校准**。

## Wisdom（社区）

- [已核 · 社区: Weaviate Community Forum](https://forum.weaviate.io/)
  Discourse 论坛，分 Support / General / Showcase / Announcements。厂商核心工程师（Dirk、DudaNogueira、Shahin 等）亲自回帖并有 Accepted Answer 标记；可见真实议题如多租户 + 命名向量的存储行为、parent-document retrieval 的评分设计、批量写入超时与内存不释放。
  Use for: 向量库与落地的实战问答。**注意**：由 Weaviate 厂商运营，Discourse 自带 flag / 版主机制、讨论有沉淀，但**对竞品不中立**，流量远小于 r/RAG，近期有 AI 生成的 Showcase 灌水帖。

> 社区这一类目前只有一条，明显偏薄——原因见 Gaps（Reddit / HF 论坛 / Discord 本次均无法验证）。**如果你愿意，这一块值得单独花一次时间补**，因为它是把知识变成「智慧」的唯一途径。

## 2025–2026 值得注意的变化

**这一节直接影响你的面试话术，不是背景知识。**

- [已核 · 官方博客: _Qwen3 Embedding: Advancing Text Embedding and Reranking Through Foundation Models_ — Qwen Team, 2025-06-05](https://qwenlm.github.io/blog/qwen3-embedding/)
  Apache 2.0 开源 Qwen3-Embedding（0.6B / 4B / 8B，32K 序列、MRL 自定义维度、instruction-aware）与 Qwen3-Reranker 系列；8B embedding 于 2025-06-05 登顶 MTEB multilingual（70.58），附 MTEB-R / CMTEB-R / MLDR / MTEB-Code 对比表。
  **对应的话术变化**：中文场景的默认组合可以是「开源 embedding + 开源 reranker」，**不必再默认 Cohere / Voyage**——这一点会让你的答案比只会背旧方案的人新一档。**注意**：厂商自测，且 rerank 评测的 top-100 候选由自家 0.6B embedding 召回，属**同源评测**，这个局限要能自己指出来。

- [已核 · 官方工程博客: _Effective context engineering for AI agents_ — Anthropic, 2025-09-29](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
  提出用 **context engineering** 取代 prompt engineering 作为重心：上下文是有限的注意力预算，引用 context rot 研究说明 token 越多召回越差；给出 just-in-time 检索、compaction、结构化笔记（agentic memory）、sub-agent 架构四类长任务策略。
  **对应的话术变化**：把 RAG 定位成「上下文工程的一个子集」，并准备好回答「预检索 vs 运行时按需检索」的取舍。**注意**：属方法论与客户观察，**没有公开消融数据**，compaction / memory tool 的结论与 Claude 产品实现强绑定。

## Gaps

本课程需要但**尚未验证到可信来源**的内容。写在这里是为了让未来的搜索有的放矢，也为了让你知道哪些说法我暂时不背书。

**本次网络限制导致未能验证（不代表这些来源不存在）**

本会话环境下 `github.com` / `raw.githubusercontent.com` / `reddit.com` / `discuss.huggingface.co` / `platform.openai.com`（403 Cloudflare）/ `milvus.io`（重定向循环）/ `jina.ai` 均不可达或超时，`docs.cohere.com` 与 Databricks 博客返回 200 但正文由 JS 渲染、抓不到内容。因此在**可访问的网络下应当重新验证**以下高价值来源：

- GitHub 中文高信号仓库：`wdndev/llm_interview_note`（中文大模型面试笔记主力仓库）、Datawhale `llm-universe` / `self-llm` / `happy-llm`、`NirDiamant/RAG_Techniques`（30+ 可运行 notebook）。
- `microsoft/graphrag` 官方实现、`pgvector` README（HNSW vs IVFFlat 一手说明）、`facebookresearch/faiss` wiki（IVF-PQ 工程参数）。
- 社区：r/RAG、r/LocalLLaMA、LlamaIndex Discord、Hugging Face forums、Cohere 文档。Discord 邀请链接必须人工在浏览器确认有效性。
- LlamaIndex / LangChain 官方 retrieval 文档。

**内容上真正的缺口**

- **MRR 的一手定义页** — Stanford IR Book 第 8 章覆盖 MAP / nDCG / Precision@k / R-precision / ROC，但**没有单列 MRR**。要用 MRR 必须先找到可信定义来源。
- **cross-encoder 重排的原始论文** — monoBERT（_Passage Re-ranking with BERT_, arXiv 1901.04085）本次未验证，导致「重排」缺一篇原理级一手条目。
- **查询改写的原始论文** — Query2Doc（2303.07678）、Rewrite-Retrieve-Read（2305.14283）未验证。
- **IVF-PQ / Product Quantization 的原始出处** — Jégou et al. 2011（IEEE TPAMI）在付费墙后，FAISS 侧又依赖不可达的 GitHub。**算法岗第 10 课正缺这一条。**
- **「长上下文 vs RAG」的直接一手材料** — 目前只能靠 Anthropic 的「<200k token 就别上 RAG」与 Lost in the Middle 间接支撑，缺直接对比实验。
- **可复现的中文踩坑复盘** — 本次一条都没找到。这类材料对「项目深挖」轮次最有用，值得继续找。
- **中文术语校准** — 中文来源里 accuracy / precision / recall 的混译很常见。本课程一律以 RAGAS 文档与 Stanford IR Book 的英文定义为准。

**找到但主动放弃（记录在此以免重复踩坑）**

- [《大模型RAG实战…踩坑全记录》（腾讯云 article/2617250）](https://cloud.tencent.com/developer/article/2617250) — 只抓到导语，正文疑在登录/推广墙后，内容不足以支撑教学。
- [Microsoft Research GraphRAG 发布博客](https://www.microsoft.com/en-us/research/blog/graphrag-new-tool-for-complex-data-discovery-now-on-github/) — 200 但正文在导航后被截断；注意 `.../graphrag-unlocking-llm-discovery-on-narrative-private-datasets/` 是 **404**，别用那个。
- [Voyage AI contextualized chunk embeddings](https://blog.voyageai.com/2024/09/23/contextualized-chunk-embeddings/) — **404**，站点已改版，需重找当期 URL。
- [Cohere Rerank 概览](https://docs.cohere.com/docs/rerank-overview) — 200 但正文 JS 渲染，抓不到内容，**不作正文引用**。
