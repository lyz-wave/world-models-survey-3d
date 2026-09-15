# 核心里程碑论文三维对比剖析 (3-Way-Scan)

> **文献调研报告 · 第二部分**  
> **编制工具**：`academic-deep-research` 技能套件  
> **剖析规范**：标准三段式解剖（WHY 科学痛点 / HOW 数学与架构 / WHAT 实证与局限）  
> **入选文献**：跨越 2018–2024 年四大流派的 14 篇里程碑论文  

---

## 目录
- [【论文 01】World Models (NeurIPS 2018)](#论文-01world-models-neurips-2018)
- [【论文 02】PlaNet: Deep Planning from Pixels (ICML 2019)](#论文-02planet-deep-planning-from-pixels-icml-2019)
- [【论文 03】DreamerV1: Dream to Control (ICLR 2020)](#论文-03dreamerv1-dream-to-control-iclr-2020)
- [【论文 04】DreamerV2: Mastering Atari with Discrete World Models (ICLR 2021)](#论文-04dreamerv2-mastering-atari-with-discrete-world-models-iclr-2021)
- [【论文 05】DreamerV3: Mastering Diverse Domains through World Models (Nature / 2023)](#论文-05dreamerv3-mastering-diverse-domains-through-world-models-nature--2023)
- [【论文 06】DayDreamer: World Models for Physical Robot Learning (CoRL 2022)](#论文-06daydreamer-world-models-for-physical-robot-learning-corl-2022)
- [【论文 07】Iris: Transformers are Sample-Efficient World Models (ICLR 2023)](#论文-07iris-transformers-are-sample-efficient-world-models-iclr-2023)
- [【论文 08】A Path Towards Autonomous Machine Intelligence (LeCun, 2022)](#论文-08a-path-towards-autonomous-machine-intelligence-lecun-2022)
- [【论文 09】I-JEPA: Self-Supervised Learning with JEPA (CVPR 2023)](#论文-09i-jepa-self-supervised-learning-with-jepa-cvpr-2023)
- [【论文 10】V-JEPA: Video Joint-Embedding Predictive Architecture (ICLR 2024)](#论文-10v-jepa-video-joint-embedding-predictive-architecture-iclr-2024)
- [【论文 11】Genie: Generative Interactive Environments (Google DeepMind, 2024)](#论文-11genie-generative-interactive-environments-google-deepmind-2024)
- [【论文 12】GAIA-1: A Generative World Model for Autonomous Driving (Wayve, 2023/2024)](#论文-12gaia-1-a-generative-world-model-for-autonomous-driving-wayve-20232024)
- [【论文 13】UniSim: A Universal Interaction Simulator (Google, ICLR 2024)](#论文-13unisim-a-universal-interaction-simulator-google-iclr-2024)
- [【论文 14】OccWorld: An Efficient World Model for Autonomous Driving (CVPR 2024)](#论文-14occworld-an-efficient-world-model-for-autonomous-driving-cvpr-2024)

---

### 【论文 01】World Models (NeurIPS 2018)
- **作者与机构**：David Ha (Google Brain), Jürgen Schmidhuber (IDSIA)
- **论文链接 / ArXiv ID**：arXiv:1803.10122 (NeurIPS 2018)
- **开源代码**：[worldmodels.github.io](https://worldmodels.github.io)

#### 1. WHY (动机与科学问题)
- **核心痛点**：传统强化学习直接将高维像素映射到动作（如 DQN/A3C），导致信用分配（Credit Assignment）极度困难；智能体无法对环境建立因果认知，样本效率极低，且无法脱离交互环境进行离线推演。
- **核心假说**：人类棒球运动员无需在毫秒间重新感知整个视野，而是调用大脑内置的“心理物理模型”预测棒球轨迹。智能体应当通过无监督学习解耦**感知压缩（Vision）**、**时间动力学（Memory）**与**决策执行（Control）**。

#### 2. HOW (数学形式与技术实现)
- **表征建模**：**V 模型 (VAE)** 将 $64 \times 64 \times 3$ 像素帧压缩为 32 维高斯分布潜变量 $z_t \sim \mathcal{N}(\mu_t, \sigma_t^2)$。
- **动力学转移**：**M 模型 (MDN-RNN)** 采用 LSTM 结合混合高斯输出层（MDN），在给定历史隐状态 $h_t$、当前潜变量 $z_t$ 和动作 $a_t$ 下预测未来潜变量的多峰高斯分布 $P(z_{t+1} | z_t, a_t, h_t)$。
- **策略控制**：**C 模型 (Controller)** 仅包含一个极简单的单层全连接网络，输入 $[z_t, h_t]$，通过 CMA-ES 进化算法优化极少数参数。
- **做梦训练机制**：Controller 完全在 M 模型生成的幻觉梦境（带有温度参数 $\tau$ 的自回归展开）中自我博弈和训练，最后直接部署至真实游戏环境。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：在 CarRacing-v0（连续赛车）中取得 906±21 分的高分，首次攻克该基准；在 Doom（毁灭战士吃火球）中完全在纯梦境中学会生存。
- **本质局限**：
  - “作弊/物理法则违背（Adversarial Exploitation）”：CMA-ES 控制器容易找到 M 模型的动力学 Bug（如找到一个永远不刷出火球的梦境轨迹），利用世界模型的预测漏洞刷分；
  - 模块分离训练：VAE、RNN、Controller 分布三阶段单独优化，缺乏端到端特征重整机制。

---

### 【论文 02】PlaNet: Deep Planning from Pixels (ICML 2019)
- **作者与机构**：Danijar Hafner, Timothy Lillicrap, Ian Fischer, Alex Lee (Google Brain / DeepMind)
- **论文链接 / ArXiv ID**：arXiv:1811.04551 (ICML 2019)
- **开源代码**：[github.com/google-research/planet](https://github.com/google-research/planet)

#### 1. WHY (动机与科学问题)
- **核心痛点**：World Models 纯依靠循环神经网络（RNN）推演，在长程预测时面临确定性记忆无法应对环境随机性、而纯随机潜变量又容易遗忘长程历史的两难困境；在线规划难以直接在原始像素上实时运行。
- **核心假说**：将确定性隐状态（用于保持长期连续记忆）与随机潜变量（用于捕获瞬时随机性与部分可观测性）在单一状态空间模型内有机融合。

#### 2. HOW (数学形式与技术实现)
- **RSSM (循环状态空间模型)**：将信念状态解耦为：
  - 确定性状态：$h_t = f_\theta(h_{t-1}, s_{t-1}, a_{t-1})$（由循环网络 GRU 计算）
  - 随机先验分布：$p_\theta(s_t | h_t)$
  - 随机后验分布：$q_\phi(s_t | h_t, o_t)$（仅在训练期通过观测编码器接入）
- **变分下界优化 (ELBO)**：联合优化观测重建 $\ln p(o_t|h_t, s_t)$、奖励预测 $\ln p(r_t|h_t, s_t)$ 与状态先验-后验 KL 散度 $\mathrm{KL}[q(s_t|h_t, o_t) \parallel p(s_t|h_t)]$。
- **潜空间规划 (Latent MPC)**：无需训练显式 Policy 网络，直接在学到的 RSSM 潜空间中运行交叉熵方法（Cross-Entropy Method, CEM）搜索前向 $H$ 步最优动作序列。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：在 DeepMind Control Suite 连续控制任务上，数据采样效率比顶级无模型算法（D4PG, A3C）高出 **200-500%**。
- **本质局限**：CEM 在线规划随动作维度急剧指数爆炸，计算延迟较高，无法泛化至离散高维动作空间（如复杂键盘/按键控制）。

---

### 【论文 03】DreamerV1: Dream to Control (ICLR 2020)
- **作者与机构**：Danijar Hafner, Timothy Lillicrap, Jimmy Ba, Mohammad Norouzi (Google Brain / DeepMind / Toronto)
- **论文链接 / ArXiv ID**：arXiv:1912.01603 (ICLR 2020)
- **开源代码**：[github.com/danijar/dreamer](https://github.com/danijar/dreamer)

#### 1. WHY (动机与科学问题)
- **核心痛点**：PlaNet 使用无梯度的 CEM 搜索动作，只考虑短期有限时域（Horizon $H \approx 12$），无法优化长时回报，且计算昂贵。
- **核心假说**：世界模型的动力学是完全参数化可微的，智能体可以直接在潜空间“展开的梦境”中，通过解析梯度回传（Analytic Gradients）同时训练 Actor 与 Critic。

#### 2. HOW (数学形式与技术实现)
- **潜空间 Actor-Critic (Latent Actor-Critic)**：
  - Actor 网络：$\pi_\psi(a_t | s_t)$
  - Critic 网络：$v_\xi(s_t)$ 估计无限时域 $\lambda$-return：$V_t^\lambda = (1-\lambda)\sum_{n=1}^{H-1} \lambda^{n-1} G_t^{(n)} + \lambda^{H-1} G_t^{(H)}$
- **可微轨迹回传 (Backprop through Time in Latents)**：
  Actor 优化的不是外界交互环境，而是在潜空间中前向推演 $H=15$ 步，损失函数 $\max_\psi \sum_{\tau=t}^{t+H} V^\lambda(\hat{s}_\tau)$ 直接穿透 RSSM 动力学网络更新 $\psi$。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：在 DMC 20 个连续控制任务中全方位刷新样本效率与终局分数，在 500 万交互步内超越无模型算法（D4PG, SAC, TD3）。
- **本质局限**：连续高斯分布潜变量在面对离散动作与突变状态时极易发生后验坍缩，无法有效迁移至 Atari 等离散视觉跳变场景。

---

### 【论文 04】DreamerV2: Mastering Atari with Discrete World Models (ICLR 2021)
- **作者与机构**：Danijar Hafner, Timothy Lillicrap, Mohammad Norouzi, Jimmy Ba (Google Brain / DeepMind)
- **论文链接 / ArXiv ID**：arXiv:2009.14422 (ICLR 2021)
- **开源代码**：[github.com/danijar/dreamerv2](https://github.com/danijar/dreamerv2)

#### 1. WHY (动机与科学问题)
- **核心痛点**：在离散多状态（如 Atari 游戏中的突然死亡、吃金币）环境中，连续高斯分布会强行在两个离散物理状态之间“插值生成平均态”，导致严重的动力学失真与重采样漂移。
- **核心假说**：真实世界的物理事件更符合离散类别分布（Categorical Distribution）。将潜变量全面离散化，并修正先验与后验的不对称学习步调。

#### 2. HOW (数学形式与技术实现)
- **离散分类潜变量 (Categorical Latents)**：
  - 隐状态由 32 个 32 类别的 One-Hot 向量构成（共 $32 \times 32$），使用 Gumbel-Softmax 或直通估计器（Straight-Through Estimator）进行反向传播；
- **KL 平衡机制 (KL Balancing)**：
  - 将传统的对称 KL 散度拆分：
    $$\mathcal{L}_{\mathrm{KL}} = \alpha \mathrm{KL}\left[ \mathrm{sg}(q) \parallel p \right] + (1-\alpha) \mathrm{KL}\left[ q \parallel \mathrm{sg}(p) \right]$$
  - 设定 $\alpha = 0.8$：让先验网络以 4 倍于后验更新的速度逼近后验，有效保护后验表征不被欠拟合的先验带偏。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：**首个在 Atari 55 经典基准上达到并超越人类玩家水平（Human Median）的 Model-Based 算法**；单张 V100 GPU 训练效率超过千核 Rainbow。
- **本质局限**：各任务超参数（奖励缩放、损失权重）仍需微调，面对量纲完全不同的异构任务（如控制机械臂 vs 开车）难以零修改通用。

---

### 【论文 05】DreamerV3: Mastering Diverse Domains through World Models (Nature / 2023)
- **作者与机构**：Danijar Hafner, Jurgis Pasukonis, Jimmy Ba, Timothy Lillicrap (DeepMind / Toronto)
- **论文链接 / ArXiv ID**：arXiv:2301.04104 (2023)
- **开源代码**：[github.com/danijar/dreamerv3](https://github.com/danijar/dreamerv3)

#### 1. WHY (动机与科学问题)
- **核心痛点**：以往强化学习算法需要针对不同环境进行繁琐的超参数调优（如奖励剪裁、网络尺寸、学习率）；长程稀疏奖励任务（如 Minecraft）中，智能体极易被局部极小值捕获。
- **核心假说**：构建一套对异常值免疫、对奖励量纲自适应缩放的鲁棒数学结构，使单个固定的超参数集合能够通杀全领域任务。

#### 2. HOW (数学形式与技术实现)
- **Symlog 变换**：
  $$\mathrm{symlog}(x) = \mathrm{sign}(x) \ln(|x| + 1)$$
  对模型输入、奖励、价值和观测重建全面应用双向对称对数压缩，将跨越数个数量级的损失尺度压制在稳定数值区间。
- **两端截断动态归一化 (Percentile Normalization)**：
  Critic 学习中使用第 5 到第 95 百分位数的返回值实时缩放优势函数（Advantage），彻底根除因单次巨大奖励导致的策略发散。
- **自适应正则与无损失重建**：在极其困难的环境下，甚至无需重建像素即可稳定训练潜空间因果逻辑。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：
  - 在 **Minecraft** 极其严苛的长程开放世界中，在**无任何人类先验演示（No human demonstrations）**的情况下，首次仅靠环境奖励从零合成钻石（Collect Diamond）；
  - 在 Atari 100k、DMC、Crafter、BSuite 等 7 大完全不同的基准上全部取得顶尖 SOTA，完全零超参数微调。
- **本质局限**：模型容量（最大约 2 亿参数）受限于单机训练效率，无法直接吸收互联网百亿级无标注通用视频知识。

---

### 【论文 06】DayDreamer: World Models for Physical Robot Learning (CoRL 2022)
- **作者与机构**：Philipp Wu, Alejandro Escontrela, Danijar Hafner, Ken Goldberg, Pieter Abbeel (UC Berkeley)
- **论文链接 / ArXiv ID**：arXiv:2206.14176 (CoRL 2022)
- **开源代码**：[danijar.com/daydreamer](https://danijar.com/daydreamer)

#### 1. WHY (动机与科学问题)
- **核心痛点**：无模型 RL 在真实物理机器人上训练极其危险（耗时数周、设备剧烈磨损碰撞）；现有 Sim-to-Real 方法依赖高精物理仿真器，但存在严重的“仿真-现实鸿沟（Reality Gap）”。
- **核心假说**：世界模型极其高效的样本利用率，足以支持智能体**在真实物理实体机上在线边学边建模型**，无需仿真器介入。

#### 2. HOW (数学形式与技术实现)
- **异步双进程流水线**：
  - 进程 1（环境交互）：以恒定控制频率实时采集物理传感器（关节角、陀螺仪、RGB 相机）数据与执行动作；
  - 进程 2（后台世界模型更新与梦境策略推演）：异步训练 RSSM 并通过虚拟梦境回传梯度更新 Actor。
- **针对物理机的高频扰动鲁棒性设计**：通过连续与离散潜状态的快速滤波，抹平物理电机的响应延迟。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：
  - 四足机器狗（Unitree A1）：**仅用 1 小时真实机交互**即从零学会侧翻起身并平稳奔跑；
  - 工业机械臂（XArm）：仅用数小时学会多物体抓取、放置与视觉伺服对齐。
- **本质局限**：对不可逆的物理损毁（如机器狗跌落悬崖、机械臂打碎相机）缺乏硬性先验保护边界，依赖人为设定安全防护绳。

---

### 【论文 07】Iris: Transformers are Sample-Efficient World Models (ICLR 2023)
- **作者与机构**：Vincent Micheli, Eloi Alonso, François Fleuret (University of Geneva)
- **论文链接 / ArXiv ID**：arXiv:2209.00588 (ICLR 2023)
- **开源代码**：[github.com/vmicheli/iris](https://github.com/vmicheli/iris)

#### 1. WHY (动机与科学问题)
- **核心痛点**：基于 RNN 的 RSSM 在长序列推理中存在信息瓶颈（Vanishing Context），难以准确保持数十步之前的物体遮挡与全局时空因果。
- **核心假说**：自注意力机制（Self-Attention）与离散分词（Discrete Tokenization）能够以纯自回归方式构建比 RNN 表达能力强得多的世界模型。

#### 2. HOW (数学形式与技术实现)
- **视觉离散化**：采用 VQ-VAE 将每帧画面编码为 $8 \times 8$ 的离散 Token 网格；
- **自回归 Transformer 世界模型**：将历史 Token 序列与动作交织排布：$(z_1, a_1, z_2, a_2, \dots)$，使用因果自注意力掩码预测下一个视觉 Token 与即时奖励。
- **在 Transformer 梦境中训练 Actor-Critic**：策略网络直接在自回归展开的 Token 空间内学习。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：在 Atari 100k 基准上（仅允许 10 万次交互步，相当于人类玩 2 小时），取得平均 1.046 的人类标准化得分，创下样本效率历史新高。
- **本质局限**：自回归 Transformer 生成 Token 时的二次方注意力复杂度导致推演延迟较高，难以进行极深时域的梦境并行展开。

---

### 【论文 08】A Path Towards Autonomous Machine Intelligence (LeCun, 2022)
- **作者与机构**：Yann LeCun (Meta FAIR / NYU)
- **论文链接 / 来源**：OpenReview Position Paper (2022)

#### 1. WHY (动机与科学问题)
- **核心痛点**：生成式模型（Generative AI / LLM / 扩散模型）执着于预测每一个像素或单词，但现实世界充满不可预测的微观不确定性；自回归概率生成具有不可克服的复合幻觉（Compounding Hallucination），无法通往具备真正世界常识的自主智能。
- **核心假说**：生物大脑的核心功能是**在抽象特征空间（Feature Space）建立多层次的能量预测模型**。应当彻底摒弃像素解码器，转向联合嵌入预测架构（JEPA）。

#### 2. HOW (数学形式与技术实现)
- **六大模块认知架构**：配置器（Configurator）、感知器（Perception）、**世界模型（World Model）**、内在代价模型（Cost/Critic）、记忆（Short/Long-term Memory）、行动器（Actor）。
- **JEPA 数学内核**：
  $$\mathcal{L} = D\left(\mathrm{Predictor}(E_x(x), z), E_y(y)\right)$$
  其中 $E_x, E_y$ 分别为上下文与目标编码器，$z$ 为潜在潜变量变量（代表世界不可控的不确定性或动作），$D$ 为特征空间的散度度量（如余弦相似度或 $L_2$）。通过正则化（VICReg / EMA 动量）防止特征坍缩（Informational Collapse）。

#### 3. WHAT (实证表现与边界局限)
- **学术地位**：奠定了 Meta 之后 I-JEPA、V-JEPA 系列自监督世界模型的理论圣经。
- **本质局限**：属于宏大哲学愿景与体系定位论文，当时尚未给出完整的控制闭环可运行端到端代码实现。

---

### 【论文 09】I-JEPA: Self-Supervised Learning with JEPA (CVPR 2023)
- **作者与机构**：Mahmoud Assran, Quentin Duval, Nicolas Ballas, Yann LeCun 等 (Meta FAIR)
- **论文链接 / ArXiv ID**：arXiv:2301.08243 (CVPR 2023)
- **开源代码**：[github.com/facebookresearch/ijepa](https://github.com/facebookresearch/ijepa)

#### 1. WHY (动机与科学问题)
- **核心痛点**：现有的掩码自编码器（如 MAE）通过遮蔽像素并重建像素训练，模型学到了大量高频低级边缘纹理，而缺乏对物体全局语义与不变性的理解。
- **核心假说**：从已知图像大块区域（Context Block）直接预测未知大块区域（Target Block）的高维语义表征，能够迫使模型提取全局拓扑结构。

#### 2. HOW (数学形式与技术实现)
- **非对称多块掩码（Multi-block Masking）**：在图像上随机采样大尺度上下文块和多个具有一定尺度的目标块；
- **架构解耦**：
  - Context Encoder（ViT）只处理上下文 Token；
  - Predictor（轻量 ViT）结合位置嵌入，预测目标块在 Target Encoder（通过 EMA 动量更新）中的嵌入输出；
- 损失直接采用特征空间的 $L_1 / L_2$ 范数。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：无任何像素级重建、无负样本对比，自监督预训练效率比 MAE 快 **2.5 倍**；在线性探测（Linear Probing）和半监督语义分类上大幅击败 MAE 和 DINO。
- **本质局限**：局限于静态图像的二维空间语义关联，未引入时间序列与连续动力学因果。

---

### 【论文 10】V-JEPA: Video Joint-Embedding Predictive Architecture (ICLR 2024)
- **作者与机构**：Adrien Bardes, Quentin Garrido, Jean Ponce, Yann LeCun 等 (Meta FAIR)
- **论文链接 / ArXiv ID**：arXiv:2311.17042 (ICLR 2024)
- **开源代码**：[github.com/facebookresearch/vjepa](https://github.com/facebookresearch/vjepa)

#### 1. WHY (动机与科学问题)
- **核心痛点**：视频数据时空维度膨胀极大，采用像素级生成（如 Video-MAE, 视频扩散）训练极其缓慢且浪费显存；传统的视频自监督难以区分前景主干运动与背景随机流动。
- **核心假说**：物理规律（如重力加速度、刚体碰撞阻挡）本质上蕴含在特征时空演变中。通过掩盖大面积连续时空柱体（Spatio-Temporal Tubes），强迫模型学会特征级物理因果补全。

#### 2. HOW (数学形式与技术实现)
- **时空管状掩码 (3D Spatio-Temporal Masking)**：将视频帧切分为三维 Patch（$2 \times 16 \times 16$），遮蔽掉高达 90% 的时空块；
- **纯特征空间因果预测**：Predictor 必须根据已知极少量的片段，预测未来未知时间步、未知空间区域的 ViT 特征；
- 采用 3D 相对位置编码（RoPE-3D）强化三维物理拓扑感知。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：
  - 在 Kinetics-400 和 Something-Something-v2 等强动作相关基准上，冻结特征微调性能大幅领先 Video-MAE；
  - 表现出强大的“无监督物理直觉”：能准确追踪被完全遮挡的移动小球轨迹。
- **本质局限**：模型属于被动观测型（Passive Observer），缺乏显式动作（Action）的输入接口，无法直接作为强化学习的环境仿真器。

---

### 【论文 11】Genie: Generative Interactive Environments (Google DeepMind, 2024)
- **作者与机构**：Jake Bruce, Michael Dennis, Ashley Edwards, Jack Parker-Holder 等 (Google DeepMind)
- **论文链接 / ArXiv ID**：arXiv:2402.15391 (ICML 2024)
- **官方页面**：[sites.google.com/view/genie-2024](https://sites.google.com/view/genie-2024)

#### 1. WHY (动机与科学问题)
- **核心痛点**：传统世界模型依赖带有显式“动作控制标签（Action Labels）”的数据集，但互联网上数亿小时的高清视频（如 YouTube 游戏通关、日常人类活动）只有纯视频流，无法用于动作条件化世界模型的训练。
- **核心假说**：智能体的动作本质上是连续两帧视觉变化之间的“因果潜变量”。可以通过无监督自编码器自动推断出离散的“潜在动作空间（Latent Action Space）”。

#### 2. HOW (数学形式与技术实现)
- **三大模块架构**：
  1. **时空视频分词器 (ST-ViViT Tokenizer)**：将连续视频压缩为离散视觉 Tokens；
  2. **潜动作模型 (Latent Action Model, LAM)**：
     - 输入连续帧 $(x_{1:t}, x_{t+1})$，利用 VQ-VAE 结构将其压缩为一个极小字典（如离散 8 种状态）的潜动作 Token $\hat{a}_t$；
     - 训练目标为：在仅提供 $\hat{a}_t$ 的条件下辅助动力学模型还原 $x_{t+1}$，迫使 $\hat{a}_t$ 承载最具解释性的物理控制量（走、跳、跌落）；
  3. **自回归动力学模型 (Dynamics Model)**：
     - 11B 参数的因果 Masked Transformer，以自回归方式：$P(x_{t+1} | x_{1:t}, \hat{a}_{1:t})$。
- 用户可在推理时指定任意单张图像作为初始帧，并用键盘方向键（映射为 8 个离散动作之一）实时玩转虚拟生成的 2D 平台跳跃游戏。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：首次展示了从互联网 20 万小时未标注 2D 游戏视频中自学无监督物理法则与控制；生成的游戏轨迹符合重力、惯性与碰撞反馈。
- **本质局限**：
  - 推理延迟高达数十秒生成几帧（非实时交互，演示为预离线生成）；
  - 缺乏长程记忆保持：角色离开屏幕左侧再走回来，原来的砖块可能会变异或消失（Object Permanence 缺陷）。

---

### 【论文 12】GAIA-1: A Generative World Model for Autonomous Driving (Wayve, 2023/2024)
- **作者与机构**：Anthony Hu, Lloyd Russell, Hudson Yeo, Zak Murez 等 (Wayve)
- **论文链接 / ArXiv ID**：arXiv:2309.17080 (2023)
- **开源情况**：企业闭源系统，公开发表高水平技术报告与评测集

#### 1. WHY (动机与科学问题)
- **核心痛点**：端到端自动驾驶（End-to-End AD）最大的瓶颈在于长尾极端工况（Edge Cases，如车祸边缘、行人鬼探头）在真实道路上极度稀缺且无法实车复测；传统游戏渲染器（CARLA）纹理过于机械，存在严重的 Domain Gap。
- **核心假说**：将驾驶世界模拟构建为一个由多模态自回归模型驱动的生成系统，使其兼具视频的逼真度与根据驾驶指令生成未来结果的因果响应性。

#### 2. HOW (数学形式与技术实现)
- **世界多模态表征**：
  - 将车辆多传感器视频编码为时空 Tokens；
  - 将文本驾驶指令（如“紧急向右打方向盘避让障碍物”）与车辆底盘动作序列（转向角、油门、刹车）编码为同维 Token 嵌入；
- **90 亿参数世界模型**：
  - 6.5B 参数的大规模自回归 Transformer 预测未来潜空间视觉 Tokens；
  - 搭配 2.5B 视频扩散解码器（Diffusion Decoder），将隐状态转换为高清 360° 全景视频；
- 具备强大的反事实推演能力（Counterfactual Simulation）：在同一初始路口，若输入“左转”或“右转”，世界模型会自洽生成两条完全不同但物理真实的街道演进。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：成功模拟了长达数分钟的高保真复杂城市场景演化；准确反映出路面水渍反光、动态行人避让等细腻物理规律。
- **本质局限**：计算开销极其巨大（数千张 A100 训练，推理需云端 GPU 集群支持）；模型仍偶发结构形变（如红绿灯倒计时跳变、车辆偶尔穿模）。

---

### 【论文 13】UniSim: A Universal Interaction Simulator (Google, ICLR 2024)
- **作者与机构**：Mengjiao Yang, Yilun Du, Kamyar Ghasemipour, Jonathan Tompson 等 (Google DeepMind / MIT)
- **论文链接 / ArXiv ID**：arXiv:2310.05873 (ICLR 2024)
- **开源代码**：[universal-simulator.github.io](https://universal-simulator.github.io)

#### 1. WHY (动机与科学问题)
- **核心痛点**：传统机器人仿真器（如 MuJoCo, PyBullet）只能仿真刚体几何接触，对布料折叠、揉面团、倒水、撕纸等富含连续介质物理交互的日常动作完全无能为力。
- **核心假说**：通过将真实人类交互视频与机器人传感器动作进行联合对齐，建立一个跨形态（Cross-embodiment）的统一交互物理生成模型。

#### 2. HOW (数学形式与技术实现)
- **统一交互接口**：将机器人底层电机指令、机械臂末端位姿、自然语言高级意图和无标注人类双手视频映射至统一的条件输入接口；
- **条件视频扩散世界模型**：基于 3D-U-Net 视频扩散骨干，给定当前物理场景图像 $x_0$ 和目标动作/交互 $a$，通过条件去噪扩散过程逐步生成真实的下一场景帧；
- 能够直接用作离线强化学习与行为克隆的虚拟交互环境。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：
  - 在 13 大类复杂日常操作任务中展示了极高保真度（包括擦桌子污渍消除、折叠毛巾形变）；
  - 直接在其生成的“模拟世界”中训练的高阶机器人策略，零样本迁移到真实机械臂上的成功率达 **60% 以上**。
- **本质局限**：对高速动态交互（如乒乓球弹跳、极快速抓取）由于扩散生成步数限制易产生帧间运动模糊与接触穿透。

---

### 【论文 14】OccWorld: An Efficient World Model for Autonomous Driving (CVPR 2024)
- **作者与机构**：Wenzhao Zheng, Borui Zhang, Junjie Chen, Jiwen Lu 等 (Tsinghua University)
- **论文链接 / ArXiv ID**：arXiv:2311.16038 (CVPR 2024)
- **开源代码**：[github.com/wzzheng/OccWorld](https://github.com/wzzheng/OccWorld)

#### 1. WHY (动机与科学问题)
- **核心痛点**：基于 2D 图像生成的自动驾驶世界模型（如 GAIA）在本质上面临空间透视歧义，无法提供自动驾驶规控模块迫切需要的真实三维几何结构与物理包围盒。
- **核心假说**：在 3D 语义占用栅格（3D Semantic Occupancy Grid）的抽象离散体素空间中建模世界动力学，能够直接保证三维几何一致性并大幅削减算力。

#### 2. HOW (数学形式与技术实现)
- **3D 空间离散体素化与压缩**：
  - 将物理空间离散为 $H \times W \times D$ 的体素（每个体素包含占用概率与语义标签：车辆、行人、树木、可行驶区域）；
  - 采用 3D VQ-VAE 将高维稀疏体素网格压缩为紧凑的离散时空 Tokens；
- **时空生成 Transformer**：
  - 采用双路径时空注意力网络（Spatial-Temporal Transformer），自回归预测未来连续多个时间步的 3D 占用变化；
  - 动作信号（自车油门、转向）通过交叉注意力直接注入体素演化层。

#### 3. WHAT (实证表现与边界局限)
- **实验表现**：在 nuScenes 自动驾驶基准上，OccWorld 能够长程推演未来 3-5 秒内的 4D 动态道路演进；下游规划器在其想象空间中生成的轨迹碰撞率下降 **40%**。
- **本质局限**：体素分辨率受限于显存容量（目前通常为 $0.4\text{m}$ 级栅格），对微小异型障碍物（如散落路面的铁钉、细碎石块）容易发生网格量化丢失。

---

## 本章横向对比小结

通过上述 14 篇经典文献的 3-Way Scan 解剖，我们可以得出以下技术结论：
1. **潜空间表征趋势**：从早期的简单高斯分布连续潜变量（World Models, PlaNet）全面演进为**离散分类潜变量（DreamerV2/V3）**与**大规模时空 Token（Genie, Iris, OccWorld）**，离散化已成为压制长程误差扩散的黄金标准。
2. **预测目标选择**：形成了以 **JEPA（特征级高维因果，追求极端抗噪与高效理解）** 和 **Diffusion/Transformer（像素与体素级高保真展开，追求逼真物理交互）** 为两极的清晰分工与技术张力。
3. **动作空间革命**：从必须人工标注动作（World Models, Dreamer）突破至通过隐动作模型（LAM, Genie）在无标注互联网海量视频中自监督无监督逆向挖掘动作，为海量非结构化数据转化为具身智能基石彻底清除了障碍。

在下一章中，我们将深入聚焦世界模型在走向工业级应用时面临的核心工程与理论瓶颈，以及前沿评估基准体系。
