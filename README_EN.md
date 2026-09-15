# World Models: Academic Research Landscape & 3D Interactive Comparison Platform

<p align="center">
  <a href="https://lyz-wave.github.io/world-models-survey-3d/">
    <img src="https://img.shields.io/badge/🌐_Live_3D_Demo-Click_to_Launch-00f2fe?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Live 3D Demo">
  </a>
  <a href="https://github.com/lyz-wave/world-models-survey-3d">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repo">
  </a>
  <img src="https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js" alt="Three.js">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<p align="center">
  <b>English</b> | <a href="README.md">简体中文</a>
</p>

> 🌟 **Instant WebGL Experience (GitHub Pages)**: 👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)** 👈
>
> *(Zero installation required. Launch directly in desktop or mobile browsers to explore Yann LeCun's H-JEPA vs. Fei-Fei Li's World Labs Atlas with mechanical drawer unboxing animations, 12 live computational mechanisms, a 60-second synchronized story tour, and an interactive 3D physics hallucination arena!)*

---

## 📖 Overview

This repository presents a systematic, industry-grade academic survey and an interactive 3D WebGL knowledge platform focused on one of the most critical frontiers in artificial intelligence: **World Models**.

It synthesizes state-of-the-art developments across:
1. **Latent Invariance & Self-Supervised World Models**: Yann LeCun's Autonomous Machine Intelligence (AMI) and Hierarchical Joint Embedding Predictive Architecture (**H-JEPA**);
2. **Explicit 3D Geometry & Spatial Intelligence**: Fei-Fei Li's World Labs flagship architecture (**Atlas**, Sep 2026);
3. **Generative World Simulators & 4D Embodied Dynamics**: DreamerV3, Genie, OASIS, GAIA-2, Cosmos, and Sora/Runway paradigms.

---

## 📂 Repository Structure

```text
world-models-survey-3d/
├── docs/                                    # 📚 Academic Literature Survey & Technical Reports
│   ├── 01_世界模型技术全景与演进脉络.md             # [Macro Landscape] Mathematical formulation (POMDP), 4 paradigms, taxonomy
│   ├── 02_核心里程碑论文三维对比剖析(3-Way-Scan).md # [Micro Analysis] 14 milestone papers evaluated via WHY/HOW/WHAT
│   ├── 03_核心技术挑战与评估基准.md                 # [Bottlenecks] Compounding errors, objective mismatch, benchmarks & metrics
│   ├── 04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md # [Frontier] 2024-2026 breakthroughs, Fei-Fei Li Atlas deep dive
│   └── 05_智能结构与空间智能巡检可执行科研Pipeline.md   # [Actionable Pipeline] Complete top-tier paper pipeline for single RTX 3090
│
├── world-models-3d/                         # 🌟 [Flagship WebGL] Interactive 3D Comparison & Physics Arena
│   ├── index.html                           # Main 3D application entry point
│   ├── app.js                               # Three.js rendering engine, unboxing animations, physics simulation
│   ├── module-principles.js                 # In-depth algorithmic principles for all 12 core modules
│   └── style.css                            # Sci-Fi dark theme UI and interactive telemetry styling
│
├── trajectory_architecture_interactive.html # [2D Interactive] Interactive architecture evolution & timeline diagram
├── .agents/skills/academic-deep-research/   # [Embedded Agent Skills] Deep research & literature review protocols
├── .nojekyll                                # Direct static asset serving on GitHub Pages
├── index.html                               # Root gateway redirecting to world-models-3d/
└── README.md                                # Project documentation (Chinese)
```

---

## 🚀 Quick Start

### 1. Online Interactive Demo
Visit the live GitHub Pages deployment directly in your browser:
👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)**

### 2. Local Setup
Run a local static server using Python 3:

```bash
# Clone the repository
git clone https://github.com/lyz-wave/world-models-survey-3d.git
cd world-models-survey-3d

# Launch local HTTP server
python3 -m http.server 8080 --directory world-models-3d

# Open in browser
open http://localhost:8080
```

---

## 🌟 Flagship 3D WebGL Platform Features

The 3D interactive comparison platform is built with vanilla Three.js (no heavy external framework dependencies), offering smooth 60fps rendering:

### 1. Dual-Architecture Synchronized Comparison
* **Left Viewport (Amber / Gold Theme)**: **Yann LeCun: AMI / H-JEPA** (Meta FAIR / NYU) — Non-generative, abstract latent space, hierarchical temporal pulsing (10Hz/1Hz), and energy gradient descent.
* **Right Viewport (Cyan / Emerald Theme)**: **Fei-Fei Li Team: World Labs Atlas** (Stanford) — Explicit 3D Gaussian Splatting (3DGS), Rectified Flow velocity field matching, and spatial context grounding.

### 2. Mechanical Unboxing & Drawer Extension Animations
* Clicking any module opens its front hatch by **95° downward**, projects dual laser telescoping rails forward, and glides the computational internal tray **+2.2 units into the foreground**.
* Simultaneous background dimming isolates focus onto the inspected component without cluttering the screen.
* Clicking the right-hand modules automatically docks detailed explanation telemetry cards on the opposite side to eliminate visual occlusion.

### 3. 12 Live Computational Dynamic Visualizations
* **Gradient Descent Energy Orb**: Simulates real-time optimization over a high-dimensional Critic energy surface $E(s, a)$.
* **3DGS Radiance Swarm**: An active cluster of 1,200+ 3D Gaussian ellipsoids dynamically spinning and pulsing with depth-aware rendering.
* **Rectified Flow Velocity Wind Tunnel**: 18 straight-line particle vectors streaming in real-time to demonstrate optimal transport denoising.
* **Hierarchical Working Memory Ring**: Dual 10Hz/1Hz orbital rings rotating on distinct orthogonal planes.
* **Planning Decision Tree**: Branching rollout nodes dynamically expanding prospective futures.
* **Simulation Cockpit**: Interactive 60fps physics collision ball and differentiable rendering camera frustum.

### 4. 60-Second Synchronized Guided Story Mode
* Click **"60秒导览剧情"** to enter an automated documentary walkthrough spanning 6 conceptual chapters.
* Camera choreography, drawer unboxing, mechanical retraction, and subtitles are all frame-synchronized to provide an effortless educational journey.

### 5. 3D Physics Hallucination Benchmark Arena
Click **"物理幻觉实验"** to summon a dedicated physics evaluation rig in the 3D viewport, comparing 2D video generation failure modes against 3D World Model physical invariance:
* **Test 1: Object Permanence (遮挡持久性测试)**:
  * *2D Diffusion*: Behind obstacles, tokens collapse; exiting the barrier, the object is permanently lost (**Object Lost 🔴**).
  * *World Model*: Latent momentum trajectories penetrate occlusions (LeCun) while 3DGS coordinates stay anchored in Euclidean space (Atlas) (**Preserved 🟢**).
* **Test 2: Rigid-Body Collision & Penetration (刚体碰撞穿模测试)**:
  * *2D Diffusion*: Lacking non-penetration constraints, free-falling objects ghost straight through the solid floor into the void (**Collision Failed 🔴**).
  * *World Model*: Computes surface normal contact and coefficient of restitution ($e=0.72$), triggering realistic elastic rebound with expanding green shockwave energy rings (**Conserved 🟢**).

---

## 📚 Core Survey Papers Summary (`docs/`)

### 1. [01_世界模型技术全景与演进脉络.md](./docs/01_世界模型技术全景与演进脉络.md)
* **Mathematical Foundation**: Unified POMDP formulation, compact belief state encoding, and counterfactual transition dynamics.
* **Four Core Paradigms**:
  1. *Model-Based RL & RSSM*: Ha & Schmidhuber (2018), PlaNet, DreamerV1-V3, DayDreamer, Iris.
  2. *Joint Embedding Predictive Architecture (JEPA)*: LeCun AMI, I-JEPA, V-JEPA, V-JEPA 2.0.
  3. *Generative Video & Interactive Simulators*: Genie (11B), GAIA-1/2, UniSim, OASIS.
  4. *Embodied & Autonomous Driving 4D Models*: OccWorld, Drive-WM, 4D Occupancy Grids.

### 2. [02_核心里程碑论文三维对比剖析(3-Way-Scan).md](./docs/02_核心里程碑论文三维对比剖析(3-Way-Scan).md)
* Evaluates 14 seminal papers under a standardized **WHY (Core Scientific Pain Point) / HOW (Mathematical Formulation & Architecture) / WHAT (Empirical Findings & Limitations)** protocol.

### 3. [03_核心技术挑战与评估基准.md](./docs/03_核心技术挑战与评估基准.md)
* **Four Intrinsic Bottlenecks**: Autoregressive compounding error drift, objective mismatch (high-frequency pixel noise drowning latent dynamics), latent action causal entanglement, and 3D physical consistency violations.
* **Benchmark Protocols**: Decision & control (Atari 100k, DMC, MineDojo), video spatio-temporal consistency (FVD, Action Consistency Error ACE, Physical Violation Rate PVR), and autonomous driving closed-loop safety.

### 4. [04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md](./docs/04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md)
* **World Labs Atlas Deep Dive (Sep 2026)**:
  * *Architecture*: Multimodal Autoregressive Diffusion Transformer with Rectified Flow.
  * *Core Breakthrough*: **Spatial Context** — explicit 3D Euclidean coordinate grounding that resolves the lack of 3D permanence in 2D video generation.
  * *Capabilities*: Controllable 6-DoF 1440p camera generation, single-image 3DGS export, Real-to-Sim-to-Real (R2S2R) robotics simulation, and bullet-time novel view synthesis.

### 5. [05_智能结构与空间智能巡检可执行科研Pipeline.md](./docs/05_智能结构与空间智能巡检可执行科研Pipeline.md)
* **End-to-End Actionable Pipeline**: Tailored for Smart Structures and Civil Infrastructure Inspection.
* **Hardware Accessible**: 100% executable on a single consumer NVIDIA RTX 3090 (24GB VRAM).
* **Open Datasets**: Mill 19, UrbanScene3D, and CODEBRIM with zero hardware acquisition cost.
* **Deliverables**: GLOMAP/gsplat execution commands, loss function mathematical specs, and an 8-week publication roadmap targeted at *Automation in Construction* or *CAutoIE*.

---

## 🛠️ Methodological Framework

The research repository incorporates standards from:
* **Stanford STORM**: Synthesizing multi-perspective inquiry with verifiable citations.
* **academic-deep-research**: Automated 3-Way Scan paper evaluation suite located at [`.agents/skills/academic-deep-research/`](./.agents/skills/academic-deep-research/SKILL.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Academic survey materials and code are open for educational and scientific research use.
