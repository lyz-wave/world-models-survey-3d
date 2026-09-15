---
name: academic-deep-research
description: >-
  Academic Deep Research and Literature Survey skill suite. Use this skill when conducting systematic literature reviews,
  comparing research papers via 3-Way Scan (WHY/HOW/WHAT), formulating FINER-grade research questions (Socratic guidance),
  evaluating methodologies, verifying citations and academic claims, or synthesizing state-of-the-art research landscapes.
---

# Academic Deep Research Skill Suite

本技能集成了开源社区学术调研的工业级方法论（借鉴 `Imbad0202/academic-research-skills` 与 Stanford STORM 的核心设计），旨在为学术研究者提供严谨、无幻觉、结构化、可复现的文献调研与综述支持。

---

## 一、 核心工作模式 (Modes)

| 模式名称 | 触发意图 / 场景 | 核心产出与特点 |
| :--- | :--- | :--- |
| **`lit-review`** | 针对特定科研主题做文献综述与技术演进梳理 | 梳理技术演进脉络、流派分支、关键研究空白（Research Gaps）与代表性论文矩阵 |
| **`three-way-scan`** | 深入横向对比多篇同赛道核心论文 | 采用 **WHY (动机) / HOW (方法架构) / WHAT (实证与局限)** 结构化论文卡片 |
| **`socratic`** | 想法较模糊，需要启发式梳理开题方向 | 苏格拉底式 5 层递进提问，将宽泛主题收敛至符合 FINER 标准的具体研究问题 (RQ) |
| **`systematic-review`**| 需要遵循医学/工科严谨标准的系统性文献回顾 | 依据 PRISMA 规范设定纳排标准（Inclusion/Exclusion）、偏倚风险评估与证据综合 |
| **`fact-check`** | 核验特定学术主张与引文真实性 | 论文事实比对、引文真实性防幻觉核查、数据声明支持度审计 |

---

## 二、 论文 3-Way Scan 解剖标准

当需要对重要论文进行深度调研或横向对比时，严格执行三段式解剖规范：

1. **WHY（动机与科学问题）**：
   - 痛点：针对前人方案的何种本质局限（如计算复杂度高、复合误差大、缺少时空因果等）？
   - 核心洞见：作者基于什么核心假设或直觉提出新解法？

2. **HOW（数学形式与架构实现）**：
   - 表征空间（Representation Space）：输入如何编码？潜变量是连续分布（Gaussian）、离散分类（Categorical），还是特征嵌入？
   - 转移与因果动力学（Dynamics & Transitions）：采用 RNN、RSSM、Transformer 还是 Diffusion/DiT 建模？
   - 动作条件化（Action-conditioning）：动作如何注入动力学模型（交叉注意力、拼接、AdaLN 等）？
   - 损失函数与优化目标：重建损失、对比学习损失、KL 正则项、预测误差的权衡。

3. **WHAT（实证表现与局限性）**：
   - 关键基准实验：采用的主流 Benchmark、评价指标、Baseline 对比与核心消融结论。
   - 局限与盲区：长程预测是否崩溃？对非因果动作是否敏感？泛化能力边界在哪里？

---

## 三、 学术防幻觉与引文规范 (Anti-Hallucination Protocol)

在执行文献调研与引文推荐时，必须遵循以下铁律：
1. **文献真实性（Authenticity）**：引用的每篇核心文献必须提供真实的作者、年份、发表会议/期刊（或 ArXiv ID）；严禁捏造不存在的论文或拼接虚假文献。
2. **主张对齐度（Claim-Source Alignment）**：论文结论必须忠实于原文实验结果，不夸大其词，不把作者的未来展望当作已有结论。
3. **局限性明示（Explicit Limitations）**：每篇论文的技术评估必须包含其未能解决的缺陷，保持中立批判的学术视角。

---

## 四、 参考文献与模板库

- [3-Way Scan 结构化卡片模板](./references/three_way_scan_template.md)
- [文献综述与知识脉络调研规范](./references/lit_review_protocol.md)
