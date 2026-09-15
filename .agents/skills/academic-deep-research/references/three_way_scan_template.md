# 3-Way Scan 结构化论文解剖模板

在对核心文献进行精读与横向对比时，采用以下标准模板输出解剖卡片：

---

### [论文简称] 论文全名 (Venue / Year)
- **作者与机构**：
- **论文链接 / ArXiv ID**：
- **代码开源地址**：

#### 1. WHY (动机与科学问题)
- **核心痛点**：现有方法在什么场景下失效？其根本的技术瓶颈是什么？
- **核心假说 / 直觉**：作者提出了什么关键直觉（Intuition）或架构假设？
- **核心定位**：在学术脉络中属于哪一流派？与同时期关键 Baseline 的本质区别是什么？

#### 2. HOW (数学形式与技术实现)
- **输入与表征建模 (Representation)**：
  - 观测空间 $ 如何映射到潜空间 $ 或离散 Token？
  - 表征是连续的（高斯分布）、离散的（Categorical / VQ）、还是抽象嵌入（JEPA 特征）？
- **状态转移与动力学 (Dynamics & Transition)**：
  - 如何预测 (s_{t+1} | s_{\le t}, a_{\le t})$？采用 RSSM、Transformer、还是 Diffusion/DiT？
  - 时序因果性（Temporal Causality）如何保证？
- **动作条件化机制 (Action Conditioning)**：
  - 动作 $ 是显式的（离散按键/连续控制量）还是隐式的（Latent Action）？
  - 动作信号如何与表征融合（拼接、Cross-Attention、AdaLN-Zero、FiLM）？
- **优化目标与损失函数 (Loss Objectives)**：
  - 重建损失（Reconstruction Loss: 像素/特征/深度）
  - 动力学损失（Dynamics Loss: 状态转移交叉熵或 KL 散度）
  - 奖励/价值预测损失（Reward/Value Loss）
  - 正则化机制（Free bits, KL balancing, Stop-gradient 等）

#### 3. WHAT (实证表现与边界局限)
- **关键基准与实验结果**：
  - 采用的主流评测基准（如 Atari 100k, Crafter, DLS, Minecraft, FVD 等）
  - 相比最强 Baseline 的定性与定量提升幅度
  - 最关键的消融实验（Ablation Study）结论是什么？证明了哪个模块的有效性？
- **本质局限与未解决问题 (Critical Limitations)**：
  - 复合误差（Compounding Error）在多少 step 后显现？
  - 是否存在维度灾难或对不可控噪声的过拟合（Objective Mismatch）？
  - 计算与推理延迟（Latency / Real-time feasibility）表现如何？
