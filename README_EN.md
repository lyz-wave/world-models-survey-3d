# World Models: Academic Research Landscape & 3D Interactive Comparison Platform

<p align="center">
  <a href="https://lyz-wave.github.io/world-models-survey-3d/">
    <img src="https://img.shields.io/badge/🌐_Live_3D_Demo-Click_to_Launch-00f2fe?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Live 3D Demo">
  </a>
  <a href="https://github.com/lyz-wave/world-models-survey-3d">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repo">
  </a>
  <img src="https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js" alt="Three.js">
</p>

<p align="center">
  <b>English</b> | <a href="README.md">简体中文</a>
</p>

> 🌟 **Instant WebGL Experience (GitHub Pages)**: 👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)** 👈
>
> *(Zero installation required. Launch directly in desktop or mobile browsers to explore Yann LeCun's H-JEPA vs. Fei-Fei Li's World Labs Atlas with mechanical drawer unboxing animations, 12 live computational mechanisms, a 60-second synchronized story tour, and an interactive 3D physics hallucination arena!)*

---

## 📖 Overview

This repository provides a systematic academic literature survey and an interactive **3D WebGL comparative knowledge platform** exploring the frontier of **World Models**:

1. **Paradigmatic Divide**: Rigorous comparison between Yann LeCun's **H-JEPA** (latent self-supervised causal representations) and Fei-Fei Li's **World Labs Atlas** (explicit 3D Gaussian spatial intelligence);
2. **Interactive 3D Engine**: Novel mechanical unboxing animations revealing 12 live computational dynamical pipelines;
3. **Physics Hallucination Benchmark Arena**: Interactive side-by-side simulations contrasting traditional 2D video generation hallucinations (Sora/Runway) against 3D World Model physical invariance.

---

## 📂 Repository Structure

```text
world-models-survey-3d/
├── docs/                                    # 📚 Academic Survey & Research Reports (01 - 05)
│   ├── 01_世界模型技术全景与演进脉络.md             # [Macro Landscape] POMDP formulation, 4 paradigms, taxonomy
│   ├── 02_核心里程碑论文三维对比剖析(3-Way-Scan).md # [Micro Analysis] 14 milestone papers evaluated via WHY/HOW/WHAT
│   ├── 03_核心技术挑战与评估基准.md                 # [Bottlenecks] Compounding errors, objective mismatch, benchmarks
│   ├── 04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md # [Frontier] Spatial Context, 3DGS Euclidean grounding, 6-DoF control
│   └── 05_智能结构与空间智能巡检可执行科研Pipeline.md   # [Actionable Pipeline] Complete top-tier paper pipeline for single RTX 3090
├── world-models-3d/                         # 🌟 3D WebGL Comparative Platform (Three.js)
│   ├── index.html                           # Main 3D application entry point
│   ├── app.js                               # Three.js rendering engine, unboxing animations, physics simulation
│   ├── module-principles.js                 # In-depth algorithmic principles for all 12 core modules
│   └── style.css                            # Sci-Fi dark theme UI & telemetry styling
├── index.html                               # Root gateway redirecting to world-models-3d/
└── README.md                                # Project documentation (Chinese)
```

---

## 🚀 Quick Start

### 1. Online Interactive Demo (Recommended)
Visit the live GitHub Pages deployment directly in your browser:
👉 **[https://lyz-wave.github.io/world-models-survey-3d/](https://lyz-wave.github.io/world-models-survey-3d/)**

### 2. Local Setup
No complex dependencies needed, just launch any local HTTP server:

```bash
# Launch local static server
python3 -m http.server 8080 --directory world-models-3d

# Open in browser
open http://localhost:8080
```

---

## 🌟 Key 3D Interactive Highlights

1. **Dual-Architecture Synchronized Comparison**:
   * **Left (Amber / Gold)**: Yann LeCun **AMI / H-JEPA** (Meta FAIR / NYU) — Non-generative, abstract latent space, hierarchical temporal pulsing (10Hz/1Hz), and energy gradient descent.
   * **Right (Cyan / Emerald)**: Fei-Fei Li **World Labs Atlas** (Stanford) — Explicit 3D Gaussian Splatting (3DGS), Rectified Flow velocity matching, and spatial context grounding.
2. **Mechanical Unboxing & Drawer Extension**: Clicking any module opens its front hatch by **95° downward**, projects dual laser telescoping rails forward, and glides the computational internal tray **+2.2 units into the foreground**;
3. **12 Live Computational Dynamic Visualizations**:
   * Energy surface gradient descent orb finding optimal actions;
   * 1,200+ 3DGS radiance ellipsoids spinning and depth-pulsing;
   * Rectified Flow 18 straight velocity vectors streaming in a wind tunnel;
   * Hierarchical working memory dual-ring orthogonal orbital spinning;
   * Branching planning tree dynamically exploring counterfactual futures;
   * 60fps real-time rigid-body collision and differentiable rendering frustum.
4. **60-Second Guided Story Tour**: Frame-synchronized camera choreography and mechanical unboxing across 6 conceptual chapters;
5. **3D Physics Hallucination Benchmark Arena**:
   * **Test 1: Object Permanence**: 2D video generation collapses behind occlusions and permanently vanishes (**Object Lost 🔴**); 3D World Models maintain latent causal momentum (LeCun) and explicit Euclidean 3DGS coordinates (Atlas) (**Preserved 🟢**);
   * **Test 2: Rigid-Body Collision & Penetration**: 2D video generation lacks collision normals and ghosts straight through solid floors into the void (**Collision Failed 🔴**); 3D World Models compute SDF contact and coefficient of restitution ($e=0.72$), bouncing with expanding green shockwave energy rings (**Conserved 🟢**).

---

## 📚 Academic Survey Reports (`docs/`)

| Document | Core Focus | Key Topics |
| :--- | :--- | :--- |
| **[01_Landscape & Evolution](./docs/01_世界模型技术全景与演进脉络.md)** | Mathematical formulation & 4 paradigms | POMDP framework, RSSM (DreamerV1-V3), JEPA cognitive architecture, video diffusion simulators (Genie/OASIS), 4D occupancy grids |
| **[02_3-Way Scan of 14 Papers](./docs/02_核心里程碑论文三维对比剖析(3-Way-Scan).md)** | In-depth micro-analysis of 14 milestone papers | Evaluated via **WHY (Scientific Pain Point) / HOW (Mathematical Architecture) / WHAT (Empirical Findings & Limitations)** |
| **[03_Challenges & Benchmarks](./docs/03_核心技术挑战与评估基准.md)** | 4 fundamental bottlenecks & metrics | Compounding error drift, objective mismatch, latent action disentanglement, Physical Violation Rate (PVR), benchmark suites |
| **[04_Atlas Deep Dive](./docs/04_近两年核心进展与李飞飞Atlas世界模型深度解剖.md)** | Spatial intelligence & frontier breakthroughs | World Labs Atlas deep dive: Spatial Context, 6-DoF camera control, 3DGS export, and Real-to-Sim-to-Real (R2S2R) robotics loop |
| **[05_Actionable Research Pipeline](./docs/05_智能结构与空间智能巡检可执行科研Pipeline.md)** | Reproducible on consumer RTX 3090 | Sparse UAV spatial completion + 3D physical damage field modeling, data cleaning scripts, loss functions, and publication roadmap |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
