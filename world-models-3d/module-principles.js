export const modulePrinciples = {
  // ================= Yann LeCun 体系 (AMI / H-JEPA) =================
  sensor_perception: {
    title: "多模态感知编码器 (Perception Encoder)",
    sub: "sx = Enc(xt) · 提取不变特征，过滤微观噪声",
    era: 0,
    part: "感知输入与去噪",
    steps: [
      "接收高维多模态物理输入（图像帧、传感器时序、本体位姿流）",
      "通过分层 Transformer 滤除不可预测的微观像素噪声（如水面波光、树叶微动）",
      "将环境物理状态压缩提纯为紧凑、语义不变的抽象潜空间表征向量 sx"
    ],
    desc: "Yann LeCun 自主机器智能（AMI）的感知门户。该模块恪守“绝不预测无谓像素”的铁律，将有限算力集中在物体的因果关系、类别、几何朝向等高阶物理特征上，为后续的因果推演构筑高信噪比的潜基座。",
    math: "s_x = \\text{Encoder}(x_t; \\theta_{\\text{enc}}), \\quad s_x \\in \\mathbb{R}^d \\quad (d \\ll \\dim(x))",
    contrast: "传统视频生成模型（如 Sora）将 90% 的算力耗费在逐像素的表面纹理重建上；JEPA 感知编码器直接在特征空间提纯物理本质，推演效率提升一个数量级。",
    cue: "观察 3D 舞台：金黄色潜空间特征阵列正在逐层过滤表面杂波，提炼因果语义。"
  },

  short_term_memory: {
    title: "分层工作记忆 (H-JEPA Working Memory)",
    sub: "Mt = [st-k, ..., st] · 多尺度时钟环形寄存器",
    era: 0,
    part: "时序状态缓存",
    steps: [
      "内圈时钟以 10Hz 高频捕获近端连续潜状态（短程物理运动与瞬时接触）",
      "外圈时钟以 1Hz 低频对长时间跨度历史进行状态抽象聚合与阶段对齐",
      "为 JEPA 预测器与配置器提供动态时序上下文索引，支持回溯与状态对齐"
    ],
    desc: "模拟生物大脑工作记忆机制。H-JEPA 记忆单元维护着一个多尺度物理状态演化树，内圈高频捕捉毫秒级物理碰撞，外圈低频锚定长程分钟级任务目标，彻底避免单层时序网络在长序列下的记忆衰减与灾难性遗忘。",
    math: "M_t = \\text{Concat}\\Big(s_{t-\\tau}^{\\text{fast}}, \\; s_{T-k}^{\\text{slow}}\\Big) \\in \\mathbb{R}^{K \\times d}",
    contrast: "传统 RNN/LSTM 存在梯度消失和瓶颈问题；双圈时钟环形寄存器实现了多时间尺度的按需检索与因果对齐。",
    cue: "观察 3D 舞台：双圈环形寄存器（内圈橙黄微动作、外圈紫色长程规划）正在同频协同运转。"
  },

  world_model_predictor: {
    title: "JEPA 动力学预测器 (World Model Predictor)",
    sub: "st+1 = T(st, at, zt) · 潜空间因果推演核心",
    era: 0,
    part: "物理演化引擎",
    steps: [
      "接收当前潜状态 st 与 Actor 提议的假设动作 at",
      "从隐分布采样潜在条件变量 zt，以数学方式量化真实世界的不可预测性",
      "通过潜空间交叉自注意力机制，直接在特征空间推演出未来状态 st+1"
    ],
    desc: "全套自主机器智能架构的“心智推演发动机”。它在完全闭合的隐空间内模拟宇宙物理演进，利用潜变量 z 优雅化解了物理世界“一对多分叉”难题（例如一支笔掉落可能倒向任意方向），绝不会因概率坍缩生成不伦不类的模糊图像。",
    math: "s_{t+1} = \\text{Predictor}(s_t, a_t, z_t; \\theta_{\\text{pred}}), \\quad z_t \\sim \\mathcal{N}(0, I)",
    contrast: "传统自回归 LLM 仅能预测下一个离散 Token；JEPA 预测器直接推演高阶连续动力学，全程支持梯度反向传播。",
    cue: "观察 3D 舞台：核心张量推演核正在闪烁，潜变量 z 注入端口正源源不断引入不确定性扰动。"
  },

  configurator: {
    title: "中央前额配置器 (Configurator / Executive)",
    sub: "w ~ pi_goal · 自顶向下任务分发与损失调节",
    era: 0,
    part: "中央调度中枢",
    steps: [
      "解析来自人类的高阶任务指令（如‘避开障碍并安全抓取水杯’）",
      "将其解耦为分层子目标向量序列 w1, w2, ...",
      "动态调节 Critic 能量曲面的加权因子，并协调感知与记忆模块的注意力流"
    ],
    desc: "相当于生物大脑的前额叶皮层（Prefrontal Cortex）。它不直接驱动肌肉电机，而是自顶向下制定战略规划，根据外界环境动态重新配置全系统的目标权重与损失函数形态，赋予机器以真正的‘分层因果规划’能力。",
    math: "\\mathcal{L}_{\\text{total}} = \\alpha(w) \\cdot E_{\\text{task}}(s, w) + \\beta(w) \\cdot E_{\\text{phys}}(s)",
    contrast: "多数端到端模型缺乏顶层战略配置器，遇到复杂多步长程任务极易迷航；配置器使系统兼具宏观视野与微观适应性。",
    cue: "观察 3D 舞台：紫色顶层控制矩阵正在向下方的预测器与代价曲面分发目标调节约束。"
  },

  actor_planner: {
    title: "规划决策器 (Actor / CEM-MPC)",
    sub: "a* = argmin sum E(s, w) · 心智展开决策树",
    era: 0,
    part: "决策与执行",
    steps: [
      "在心智模拟器中提出多组候选动作假设序列 [at, at+1, ...]",
      "利用世界模型前向模拟 H 步物理推演（Rollouts），展开三维决策树",
      "借助 Critic 能量曲面的反向传播梯度，迭代筛选出全局能量最低的动作 a*"
    ],
    desc: "智能体的决策行动大脑。Actor 无需在现实危险物理环境中昂贵试错，而是在世界模型构建的‘虚拟心智空间’内以每秒成百上千次的速度展开推演分支，借助能量函数的梯度指引，精准逼近全局最优执行策略。",
    math: "a_{t:t+H}^* = \\arg\\min_{\\{a_\\tau\\}} \\sum_{\\tau=t}^{t+H} \\text{Cost}(s_\\tau, w)",
    contrast: "传统策略网络输出单一黑盒动作；Actor 结合模型预测控制（MPC）实现了遇到突发障碍时的毫秒级即时在线重规划。",
    cue: "观察 3D 舞台：赤红色心智决策树正在向外分叉蔓延，前向展开多条候选行动路径。"
  },

  critic_cost: {
    title: "能量代价曲面 (Critic / Energy Landscape)",
    sub: "E(s, w) · 动态梯度下山导引",
    era: 0,
    part: "内在与外在评价",
    steps: [
      "接收预测出的未来状态 s 与目标配置 w",
      "计算物理常识合规性、任务达成距离与能量势能",
      "沿着 3D 能量曲面计算梯度 \\nabla_a E，引导 Actor 小球快速下山"
    ],
    desc: "智能体的内在‘价值与痛苦感知体系’。它通过能量基模型（EBM）刻画世界规律与目标差距：当动作导致违反物理常识（如穿墙）或偏离目标时能量急剧飙升；当动作完美契合规律时能量落入谷底。",
    math: "E(s, w) = \\|s - w\\|^2 + \\lambda \\cdot \\mathcal{R}_{\\text{physics}}(s), \\quad \\Delta a \\propto -\\nabla_a E",
    contrast: "传统强化学习采用离散标量奖励（Reward），学习效率低下；能量曲面提供光滑连续的高维几何梯度，指引参数极速收敛。",
    cue: "观察 3D 舞台：白色发光小球正在凹凸曲面上沿梯度坡度盘旋下坠，留下一道炽热轨迹！"
  },

  // ================= 李飞飞 World Labs Atlas 体系 =================
  spatial_input: {
    title: "空间接地多模态输入 (Spatial Grounded Input)",
    sub: "6-DoF [R|t] + RGB-D · 欧氏三维坐标原生接地",
    era: 1,
    part: "空间几何输入",
    steps: [
      "接收文本指令、稀疏参考视角图像与度量级深度图",
      "从传感器提取具有绝对物理尺度的相机 6 自由度位姿 [R|t]",
      "将所有像素点通过逆投影矩阵反投影至真实三维欧氏坐标系"
    ],
    desc: "李飞飞团队空间智能（Spatial Intelligence）的第一块基石。不同于传统大模型把视觉图像仅仅拍扁为一维 Token，Atlas 将相机位姿与度量深度提升为原生一等模态，使模型‘睁开眼’的第一刻就具备了真实物理空间的绝对尺度感知。",
    math: "\\mathbf{x}_{\\text{3D}} = R \\cdot K^{-1} [u, v, 1]^T \\cdot D(u, v) + \\mathbf{t}",
    contrast: "传统视频生成模型无法遵循严格的物理相机运动；Atlas 支持导演级的像素级 6-DoF 轨迹相机受控生成。",
    cue: "观察 3D 舞台：相机视锥与三维空间 XYZ 坐标轴正在精确对齐绝对空间方位。"
  },

  spatial_context: {
    title: "核心颠覆：空间上下文 (Spatial Context)",
    sub: "3D Grounded Euclidean Anchor · 几何拓扑锚定",
    era: 1,
    part: "三维空间上下文",
    steps: [
      "将输入视点显式锚定在统一真实三维欧氏空间坐标与朝向中",
      "在空间不同视点之间建立长程几何一致性与遮挡拓扑锚点",
      "依托空间常识，自发合理想象出连接未知区域的门厅、拐角与过道"
    ],
    desc: "Atlas 区别于 Sora、Genie 等所有现有世界模型的最本质创新！两张毫无视觉重叠的房间照片，只要在空间上下文中指定其相对三维坐标，Atlas 就能凭借强大的物理空间常识，自动且合理地想象出连接两者的走廊，从几何底层根治穿模与形变崩溃。",
    math: "\\mathcal{G}_{\\text{anchor}} = \\{(x_k, y_k, z_k, \\mathbf{f}_k)\\}, \\quad \\text{Consistency Loss} \\to 0",
    contrast: "传统 1D 线性上下文极易随时间步推移发生累积空间漂移；空间上下文依托真实几何，确保全局物体持久不灭。",
    cue: "观察 3D 舞台：翡翠绿色的空间锚点阵列正在向四周构建坚实的三维欧氏几何图谱。"
  },

  autoregressive_backbone: {
    title: "时空因果自回归 DiT (Autoregressive DiT)",
    sub: "Spatial-Temporal Attention + Dynamic KV-Cache",
    era: 1,
    part: "时空自回归骨干",
    steps: [
      "将空间上下文与连续多模态输入切分为三维时空 Patches",
      "采用因果自回归 Transformer 逐时空步推进物理演变",
      "借助大模型成熟的 KV 缓存（KV-Cache）实现高效流式超长时序推演"
    ],
    desc: "结合 LLM 与扩散生成精髓的连续时空物理推演大脑。它将宏观物理现实的展开转化为时空因果自回归序列生成，在兼顾全局几何一致性的同时，实现了跨分钟级的长程物理时空仿真。",
    math: "p(X_{1:T}) = \\prod_{t=1}^T p\\Big(X_t \\;\\Big|\\; X_{<t}, \\; \\mathcal{G}_{\\text{anchor}}\\Big)",
    contrast: "全时空扩散模型受限于显存上限无法生成长程物理过程；自回归 DiT 配合 KV 缓存实现了近乎无限时长的高清仿真。",
    cue: "观察 3D 舞台：多层时空因果计算单元正在高速处理流式多模态 KV 缓存。"
  },

  rectified_flow: {
    title: "直线流匹配扩散头 (Rectified Flow ODE)",
    sub: "dx_t/dt = vt(xt) · 最优传输直线去噪",
    era: 1,
    part: "连续流匹配去噪",
    steps: [
      "从连续物理噪声分布状态 X0 出发",
      "神经网络直接预测从噪声到真实三维场景的最优传输速度场 vt",
      "沿着极速直线常微分方程（ODE）轨迹步进，单次极少步数完成高质量去噪"
    ],
    desc: "新一代生成式物理扩散的数学巅峰。传统 DDPM 扩散模型在去噪过程中如同微粒作布朗运动，轨迹蜿蜒曲折、步数繁多；Rectified Flow 通过流匹配强制让生成轨迹沿着几何直线推进，步数减少 70% 且画质大幅提升。",
    math: "\\frac{d X_t}{d t} = v_t(X_t) \\approx X_1 - X_0, \\quad X_1 = X_0 + \\int_0^1 v_t(X_t) dt",
    contrast: "传统扩散需要 50~100 步弯曲迭代采样；Rectified Flow 直线最优传输只需数步即可输出超逼真空间纹理与深度。",
    cue: "观察 3D 舞台：蓝色直线速度场矢量箭头正在指引粒子沿最短直线路径高速喷射冲刺！"
  },

  gaussian_splatting: {
    title: "显式 3D 高斯空间表征 (Explicit 3DGS Cloud)",
    sub: "1200+ Radiance Splats · 物体持久性 (Permanence)",
    era: 1,
    part: "显式三维几何场",
    steps: [
      "扩散头直接预测数百万个 3D 高斯球的核心参数（中心 \\mu, 协方差 \\Sigma, 不透明度 \\alpha, 球谐系数 c）",
      "在真实三维空间中构建显式几何物理实体（非隐式黑盒）",
      "保证物体被遮挡后其三维高斯点依然驻留原位，实现完美物体持久性"
    ],
    desc: "Atlas 生成结果的核心载体。与难以编辑的纯视频像素不同，3DGS 是一种显式、轻量、高保真的空间表示。每个高斯椭球体都拥有精确的世界坐标，可以像真实物体一样被光栅化、被光线追踪、被物理碰撞检测。",
    math: "G(x) = \\alpha \\cdot \\exp\\left(-\\frac{1}{2}(x - \\mu)^T \\Sigma^{-1} (x - \\mu)\\right), \\quad \\Sigma = R S S^T R^T",
    contrast: "2D 视频生成在相机旋转后原物体很容易被模型‘忘掉’或变形；显式 3DGS 在空间中永久固定，镜头转回时严丝合缝。",
    cue: "观察 3D 舞台：1200+ 翡翠与青蓝相间的高斯点云正在自转，展现带真实物理透视的立体高斯场！"
  },

  neural_renderer_sim: {
    title: "端侧 60fps 实时物理仿真器 (Neural Sim Engine)",
    sub: "Real-time Interactive Rasterizer & Robotics Simulator",
    era: 1,
    part: "端侧仿真与交互",
    steps: [
      "实时接收用户键盘、手柄或机器人策略算法发出的 6-DoF 位姿流",
      "通过基于可微瓦片的高速光栅化管线，在端侧以 60fps 渲染当前视角视图",
      "计算物体表面物理受力、碰撞阻挡与材质形变，闭环反馈给控制策略"
    ],
    desc: "World Labs 世界模型的终极落地应用。它不仅是一个能够输出 1440p 电影级视频的生成器，更是一个能够直接部署到消费级显卡上的端侧交互模拟器，充当具身智能机器人‘虚实迁移（Real-to-Sim-to-Real）’的数据发动机。",
    math: "C(u, v) = \\sum_{i \\in \\mathcal{N}} c_i \\alpha_i \\prod_{j=1}^{i-1} (1 - \\alpha_j) \\quad (\\text{FPS} \\ge 60)",
    contrast: "以往高保真物理仿真依赖庞大的多边形工业软件；Atlas 神经仿真器实现了纯神经网络端到端的高拟真物理闭环。",
    cue: "观察 3D 舞台：端侧高帧率显示视口正在实时同步光栅化计算结果。"
  }
};