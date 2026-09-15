# 世界模型（World Models）学术调研与 3D 架构交互平台

<p align="center">
  <a href="https://lyz-wave.github.io/world-models-survey-3d/">
    <img src="https://img.shields.io/badge/🌐_在线免安装_3D_Demo-立即点击体验-00f2fe?style=for-the-badge&logo=googlechrome&logoColor=black" alt="在线 3D Demo">
  </a>
  <a href="https://github.com/lyz-wave/world-models-survey-3d">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repo">
  </a>
  <img src="https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js" alt="Three.js">
</p>

> 🌟 **在线交互体验直达（GitHub Pages）**：👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)** 👈
>
> *(免配置任何本地环境，任何现代浏览器点击即可直达 3D 空间架构交互平台：体验 LeCun H-JEPA vs 李飞飞 Atlas 双架构联动、机械开箱滑轨抽取、12 大内部原理 Live 展开、60 秒导览剧情与物理对抗实验场！)*

---

## 一、 知识库架构与成果导航

```text
世界模型调研/
├── world-models-3d/                         # [旗舰交互] 3D WebGL 前沿架构双屏深度对比与物理对抗实验场
│   ├── index.html                           # 3D 交互主入口 (LeCun H-JEPA vs 李飞飞 Atlas)
│   ├── app.js                               # 3D 渲染核心、开箱抽取动效、物理对抗仿真
│   ├── module-principles.js                 # 12 大核心模块内部运作机理详细数据
│   └── style.css                            # 科技感深色 UI 与控制台样式
├── trajectory_architecture_interactive.html # [2D 交互] 交互式世界模型架构推演与时间线图
├── .agents/skills/academic-deep-research/   # [内置技能] 学术深度调研与论文对比 Skill 套件
│   ├── SKILL.md                             # 技能定义与触发指令
│   └── references/
│       ├── three_way_scan_template.md       # 论文 WHY/HOW/WHAT 结构化剖析模板
│       └── lit_review_protocol.md           # 严谨文献检索与防幻觉审核规范
│
├── docs/                                    # [学术报告] 深度调研与技术全景文档库
│   ├── 01_世界模型技术全景与演进脉络.md             # [宏观全景] 数学形式化定义、四大流派、演进路线与横向技术矩阵
│   ├── 02_核心里程碑论文三维对比剖析(3-Way-Scan).md # [微观解剖] 14 篇里程碑论文 WHY/HOW/WHAT 深度剖析
│   ├── 03_核心技术挑战与评估基准.md                 # [前沿瓶颈] 复合误差、目标错配、权威 Benchmark 与未来破局点
│   ├── 04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md # [前沿重磅] 2024-2026 最新突破、李飞飞 World Labs Atlas 深度解剖
│   └── 05_智能结构与空间智能巡检可执行科研Pipeline.md   # [落地实操] 单卡 RTX 3090 可执行的顶刊科研全流程 Pipeline
└── README.md
```

---

## 🚀 快速启动 3D 双架构交互对比实验场

本项目包含高精度、纯前端（基于 Three.js）的世界模型 3D 双架构交互对比平台：

```bash
# 启动本地 Web 服务器
python3 -m http.server 8080 --directory world-models-3d

# 浏览器访问
open http://localhost:8080
```

### 核心 3D 交互亮点：
1. **双架构同屏联动对比**：左侧 Yann LeCun **AMI / H-JEPA**（潜空间自监督） vs 右侧 李飞飞 **World Labs Atlas**（显式 3DGS 空间智能）；
2. **机械开箱抽取机制**：点击任意模块，舱门下翻 95°、激光导轨延伸、内部计算构件向前抽出展开；
3. **12 大内部机理动态展开**：梯度下山能量小球、1200+ 高斯椭球辐射场自旋、Rectified Flow 速度矢量风洞去噪等；
4. **60 秒导览剧情模式**：六大章节伴随运镜与机箱开合全自动同频推演讲解；
5. **物理幻觉对抗实验场 (Benchmark Arena)**：亲手对比传统 2D 视频生成（遮挡丢失、刚体穿模虚空）与 3D 世界模型（因果不变性、SDF 刚体弹性反弹冲击波）的物理仿真。

---

## 二、 核心成果概览

### 1. [05_智能结构与空间智能巡检可执行科研Pipeline.md](./docs/05_智能结构与空间智能巡检可执行科研Pipeline.md) 🚀 **科研实操执行方案**
- **适配专业**：智能结构与智能工程（Smart Structures and Intelligent Engineering）
- **计算条件**：单张 NVIDIA GeForce RTX 3090（24GB VRAM）完全兼容
- **数据来源**：100% 公开无人机航拍与基础设施病害基准（Mill 19, UrbanScene3D, CODEBRIM），零硬件实购成本
- **核心模块**：
  - 选题定位与学术故事线（稀疏航拍视角空间补全 + 3D 物理损伤场联合建模）
  - 环境配置全指令（PyTorch + gsplat + GLOMAP/COLMAP）
  - 数据处理脚本与位姿解算代码
  - 损失函数数学形式化定义与 10-12 周科研里程碑
  - 目标投递期刊（*Automation in Construction* / *CAutoIE*）论文结构与图表规划

### 2. [04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md](./docs/04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md) 🔥 **最新前沿聚焦**
- **李飞飞 World Labs 旗舰模型 Atlas (2026.09 最新发布)**：
  - **核心架构**：多模态自回归扩散变换器（Multimodal Autoregressive Diffusion Transformer，流匹配 Rectified Flow）。
  - **颠覆性创新**：提出**“空间上下文（Spatial Context）”**，将图像与视频显式接地（Grounding）在 3D 欧几里得坐标中，彻底解决纯 2D 视频生成缺乏三维持久性与物理一致性的本质瓶颈。
  - **四大杀手级能力**：像素级 6-DoF 相机精准受控生成（1440p / 1 分钟）、稀疏视角极速 3D 重建并导出 3D Gaussian Splats（3DGS）、时空物理仿真与 Real-to-Sim-to-Real（R2S2R）具身机器人仿真闭环、“子弹时间”多视角重构。
  - **基准表现**：在复杂相机运镜胜率上超主流模型 75%-94%；在 DTU/ETH3D/ScanNet 7 大基准的三维重建误差（AbsRel）上以 25.3 击败专门的 3D 重建模型。
- **近两年核心赛道突破**：
  - **3D 空间世界模型**：HunyuanWorld 1.0, ABot-World-0, GaussianWorld
  - **实时端到端交互游戏世界**：Google GameNGen (DOOM 20fps), Decart Oasis (Minecraft 20fps), Matrix-Game 3.0
  - **自动驾驶闭环**：Wayve GAIA-2, NVIDIA Cosmos-Drive-Dreams / OmniDreams, Doe-1

### 3. [01_世界模型技术全景与演进脉络.md](./docs/01_世界模型技术全景与演进脉络.md)
- **数学本质**：基于 POMDP 的紧凑信念状态表征、状态动力学转移与反事实推演。
- **四大核心技术流派**：
  1. **潜空间强化学习动力学 (RSSM / Model-Based RL)**：Ha & Schmidhuber (2018), PlaNet, DreamerV1-V3, DayDreamer, Iris
  2. **联合嵌入预测架构 (JEPA)**：LeCun 认知框架, I-JEPA, V-JEPA, V-JEPA 2.0（特征级因果预测 vs 像素级生成）
  3. **视频扩散与交互世界模拟器 (Generative World Simulators)**：Genie (DeepMind 11B), GAIA-1/2 (Wayve), UniSim (Google), OASIS (Decart)
  4. **具身智能与自动驾驶 4D 模型 (Embodied & Autonomous Driving)**：OccWorld, Drive-WM, 3D 占用栅格动力学

### 4. [02_核心里程碑论文三维对比剖析(3-Way-Scan).md](./docs/02_核心里程碑论文三维对比剖析(3-Way-Scan).md)
按 **WHY（科学痛点）/ HOW（数学与架构实现）/ WHAT（实证表现与局限性）** 统一标准，逐一深度解剖 14 篇经典与前沿文献。

### 5. [03_核心技术挑战与评估基准.md](./docs/03_核心技术挑战与评估基准.md)
- **四大本质瓶颈**：自回归复合误差扩散、目标错配（高频背景噪声吃掉显存）、潜动作因果解耦难题、3D 空间持久性与物理定律违背。
- **评测基准体系**：决策控制类（Atari 100k, DMC, Crafter, MineDojo）、时空视频一致性（FVD, 动作一致性误差 ACE, 物理违背率 PVR）、自动驾驶（nuScenes 4D Occupancy, 闭环碰撞率）。
