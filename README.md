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

<p align="center">
  <a href="README_EN.md">English</a> | <b>简体中文</b>
</p>

> 🌟 **在线交互体验直达（GitHub Pages）**：👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)** 👈
>
> *(免配置任何本地环境，任何现代浏览器点击即可直达 3D 空间架构交互平台：体验 LeCun H-JEPA vs 李飞飞 Atlas 双架构联动、机械开箱滑轨抽取、12 大内部机理 Live 展开、60 秒导览剧情与物理对抗实验场！)*

---

## 📖 项目简介

本项目针对人工智能核心前沿方向——**世界模型（World Models）**，提供了系统性的学术文献调研报告库与可交互的 **3D WebGL 双架构对比平台**：

1. **宏观哲学与微观解剖**：深入剖析 Yann LeCun **H-JEPA**（潜空间自监督因果表征）与李飞飞 **World Labs Atlas**（显式 3D 高斯空间智能）的技术分野；
2. **沉浸式 3D 可视化**：首创机械开箱抽取机制与 12 大计算动力学实时展开；
3. **物理幻觉对抗实验**：通过遮挡持久性与刚体碰撞穿模两项基准测试，直观对比传统 2D 视频生成（Sora/Runway）的物理幻觉与 3D 世界模型的物理守恒规律。

---

## 📂 仓库结构

```text
world-models-survey-3d/
├── docs/                                    # 📚 学术调研与技术全景报告库 (01 - 05)
│   ├── 01_世界模型技术全景与演进脉络.md             # [宏观全景] POMDP 数学定义、四大核心流派与技术矩阵
│   ├── 02_核心里程碑论文三维对比剖析(3-Way-Scan).md # [微观解剖] 14 篇里程碑论文 WHY/HOW/WHAT 深度剖析
│   ├── 03_核心技术挑战与评估基准.md                 # [前沿瓶颈] 复合误差扩散、目标错配、权威 Benchmark 评估体系
│   ├── 04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md # [前沿重磅] 空间上下文、3DGS 欧氏坐标锚定与 6-DoF 控制
│   └── 05_智能结构与空间智能巡检可执行科研Pipeline.md   # [科研实操] 单卡 RTX 3090 可复现的顶刊科研全流程方案
├── world-models-3d/                         # 🌟 3D WebGL 架构对比与物理对抗实验平台 (Three.js)
│   ├── index.html                           # 3D 平台主入口 (LeCun H-JEPA vs 李飞飞 Atlas)
│   ├── app.js                               # 3D 渲染核心、开箱抽取动效、物理对抗仿真
│   ├── module-principles.js                 # 12 大核心模块内部运作机理详细数据
│   └── style.css                            # 科技感深色 UI 与控制台样式
├── index.html                               # 根目录快速跳转中继 (GitHub Pages)
└── README.md                                # 项目文档 (中文)
```

---

## 🚀 快速开始

### 1. 在线体验（推荐）
直接访问 GitHub Pages 在线体验：
👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)**

### 2. 本地运行
无需安装复杂依赖，仅需本地 HTTP 服务器：

```bash
# 启动本地服务
python3 -m http.server 8080 --directory world-models-3d

# 浏览器访问
open http://localhost:8080
```

---

## 🌟 核心 3D 交互亮点

1. **双架构同屏联动对比**：左侧 Yann LeCun **AMI / H-JEPA**（金黄主题 · 潜空间自监督） vs 右侧 李飞飞 **World Labs Atlas**（青绿主题 · 显式 3DGS 空间智能）；
2. **机械开箱抽取机制**：点击任意模块，舱门下翻 95°、双激光导轨延伸、内部计算构件向前滑出 $+2.2$ 单位至最佳视距；对侧模块与卡片智能避让；
3. **12 大计算机理 Live 展开**：
   * 能量曲面梯度下山小球实时搜寻最优解；
   * 1200+ 3DGS 椭球辐射云团深度着色与自旋微颤；
   * Rectified Flow 18 条直线速度矢量风洞极速去噪；
   * 10Hz / 1Hz 分层时钟环双平面立体自转；
   * 规划决策多分支心智探索树展开；
   * 60fps 实时刚体物理碰撞与可微渲染视锥。
4. **60 秒导览剧情模式**：六大章节伴随全自动运镜、机箱开合与字幕同频推演；
5. **物理幻觉对抗实验场 (Benchmark Arena)**：
   * **① 遮挡持久性测试 (Object Permanence)**：2D 视频生成在遮挡后特征崩溃、出墙即永久消失 (**Object Lost 🔴**)；3D 世界模型隐空间因果追踪 / 3DGS 欧氏坐标锚定保持守恒 (**Preserved 🟢**)；
   * **② 刚体碰撞穿模测试 (Collision & Penetration)**：2D 视频生成缺乏接触法线与不可穿透性，小球如幽灵般垂直穿透坚硬底板坠入虚空 (**Collision Failed 🔴**)；3D 世界模型基于 SDF 与恢复系数 ($e=0.72$) 弹性反弹，激发出绿色能量冲击波 (**Conserved 🟢**)。

---

## 📚 学术调研报告导航 (`docs/`)

| 报告文档 | 核心内容 | 重点涵盖 |
| :--- | :--- | :--- |
| **[01_技术全景与演进脉络](./docs/01_世界模型技术全景与演进脉络.md)** | 形式化数学定义与四大技术流派 | POMDP 框架、RSSM (DreamerV1-V3)、JEPA 认知架构、视频扩散模拟器 (Genie/OASIS)、4D 自动驾驶占用网格 |
| **[02_核心里程碑论文三维对比](./docs/02_核心里程碑论文三维对比剖析(3-Way-Scan).md)** | 14 篇里程碑文献深度解剖 | 采用统一 **WHY (科学痛点) / HOW (数学与实现) / WHAT (实证与局限)** 范式严格对比剖析 |
| **[03_核心技术挑战与评估基准](./docs/03_核心技术挑战与评估基准.md)** | 四大本质瓶颈与评测体系 | 自回归复合误差扩散、目标错配、潜动作解耦难题、3D 物理一致性违背率 (PVR) 与基准评测集 |
| **[04_Atlas世界模型深度解剖](./docs/04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md)** | 空间智能与最新前沿突破 | 李飞飞 World Labs Atlas 深度解密：空间上下文 (Spatial Context)、6-DoF 精准控制、3DGS 导出与 R2S2R 闭环 |
| **[05_智能结构可执行科研Pipeline](./docs/05_智能结构与空间智能巡检可执行科研Pipeline.md)** | 单卡消费级 RTX 3090 可复现实操 | 稀疏无人机航拍空间补全 + 3D 物理损伤场建模，完整包含数据清洗、损失函数定义与顶刊投递规划 |

---

## 📄 开源许可

本项目采用 [MIT License](LICENSE) 开源，学术调研报告与 3D 代码均可自由用于学习、教学与学术研究。
