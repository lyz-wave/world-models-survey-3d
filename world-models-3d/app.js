import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sourceHTML } from "./sources.js";
import { chapters, duration as storyDuration, storyPosition, StoryClock } from "./story.js";
import { modulePrinciples } from "./module-principles.js";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

// 全局响应式状态
const state = {
  era: 0,
  time: 0,
  playing: true,
  pace: 1.0,
  steps: 5,
  ready: false,
  selected: null,
  hallucinationMode: false
};

const story = {
  active: false,
  clock: new StoryClock(),
  cueKey: null
};

const palette = {
  bg: 0x060b11,
  lecunGold: 0xf5a623,
  lecunViolet: 0xa855f7,
  feifeiCyan: 0x00f2fe,
  feifeiGreen: 0x38ef7d,
  actionCoral: 0xff6b6b,
  gradientTrail: 0xff4757,
  rectFlow: 0x70a1ff,
  wire: 0x3a5169,
  idle: 0x1a2634,
  text: 0xe6edf3
};

const wrap = $("#scene-wrap");
const labelsEl = $("#labels");
const renderer = new THREE.WebGLRenderer({
  canvas: $("#scene"),
  alpha: true,
  antialias: true,
  powerPreference: "high-performance"
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

let width = 1, height = 1;
const dummy = new THREE.Object3D();
const colorHelper = new THREE.Color();
const labels = [];
let transition = null;
let syncing = false;

const isSingle = () => !story.active && width < 980;
const viewport = v => ({
  x: isSingle() ? 0 : (v.side * width) / 2,
  w: isSingle() ? width : width / 2,
  show: !isSingle() || v.side === state.era
});

// 构建左右双视口
const views = [0, 1].map(side => {
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xe4f3ff, 0x121b24, 2.4));

  const mainLight = new THREE.DirectionalLight(0xfff5e6, 3.4);
  mainLight.position.set(side === 0 ? -14 : 14, 24, 20);
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(side === 0 ? palette.lecunViolet : palette.feifeiCyan, 2.2);
  rimLight.position.set(side === 0 ? 12 : -12, 10, -14);
  scene.add(rimLight);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 500);
  const surface = document.createElement("div");
  surface.style.cssText = "position:absolute;top:0;bottom:0;touch-action:none;";
  wrap.insertBefore(surface, labelsEl);

  const controls = new OrbitControls(camera, surface);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 5;
  controls.maxDistance = 65;
  controls.maxPolarAngle = Math.PI * 0.85;

  const world = new THREE.Group();
  scene.add(world);

  const grid = new THREE.GridHelper(38, 38, side === 0 ? 0x3d2b1f : 0x13394d, 0x111c27);
  grid.position.y = -0.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.4;
  scene.add(grid);

  const v = {
    side,
    scene,
    camera,
    controls,
    surface,
    world,
    nodes: [],
    edges: [],
    components: [],
    selected: null
  };

  surface.addEventListener("pointerdown", e => {
    v.down = [e.clientX, e.clientY];
    transition = null;
  });
  surface.addEventListener("pointerup", e => {
    if (v.down && Math.hypot(e.clientX - v.down[0], e.clientY - v.down[1]) < 6) {
      if (!state.hallucinationMode) {
        selectAt(v, e.clientX, e.clientY);
      }
    }
  });

  controls.addEventListener("start", () => {
    if (story.active) pauseStory();
    transition = null;
  });

  controls.addEventListener("change", () => {
    if (syncing || transition || story.active || !state.ready) return;
    syncing = true;
    const o = views[1 - side];
    const delta = camera.position.clone().sub(controls.target);
    o.controls.target.copy(controls.target);
    o.camera.position.copy(o.controls.target).add(delta);
    o.controls.update();
    syncing = false;
  });

  return v;
});

const guideSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
guideSVG.classList.add("label-guides");
guideSVG.setAttribute("aria-hidden", "true");
labelsEl.prepend(guideSVG);

// 辅助建模函数
function createRackBox(parent, id, x, y, z, w, h, d, colorHex) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.userData.componentId = id;
  parent.add(group);

  // 外框机架容器 (下钻时消隐淡化)
  const shell = new THREE.Group();
  shell.userData.componentId = id;
  group.add(shell);

  const bodyGeo = new THREE.BoxGeometry(w, h, 0.12);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.45,
    roughness: 0.3,
    transparent: true,
    opacity: 0.28
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.z = -d / 2;
  body.userData.componentId = id;
  body.userData.initialOpacity = 0.28;
  shell.add(body);

  const edgesGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
  const edgesMat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.8,
    linewidth: 2
  });
  const wireframe = new THREE.LineSegments(edgesGeo, edgesMat);
  wireframe.userData.componentId = id;
  wireframe.userData.initialOpacity = 0.8;
  shell.add(wireframe);

  // 1. 前置开箱活动舱门 (Front Hatch Door with bottom hinge pivot)
  const hatchPivot = new THREE.Group();
  hatchPivot.position.set(0, -h / 2, d / 2);
  shell.add(hatchPivot);

  const hatchGeo = new THREE.BoxGeometry(w * 0.98, h * 0.98, 0.04);
  const hatchMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.6,
    roughness: 0.25,
    transparent: true,
    opacity: 0.52
  });
  const hatchMesh = new THREE.Mesh(hatchGeo, hatchMat);
  hatchMesh.position.set(0, h / 2, 0); // 居中于 pivot 上方
  hatchMesh.userData.componentId = id;
  hatchPivot.add(hatchMesh);

  const hatchFrameGeo = new THREE.EdgesGeometry(hatchGeo);
  const hatchFrameMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85
  });
  const hatchFrame = new THREE.LineSegments(hatchFrameGeo, hatchFrameMat);
  hatchFrame.position.copy(hatchMesh.position);
  hatchPivot.add(hatchFrame);

  // 2. 双侧机械伸缩滑轨 (Telescopic Rails)
  const railMat = new THREE.LineBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.9
  });
  const leftRailGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-w / 2 + 0.1, -h / 2 + 0.05, 0),
    new THREE.Vector3(-w / 2 + 0.1, -h / 2 + 0.05, 0.1)
  ]);
  const leftRail = new THREE.Line(leftRailGeo, railMat);
  shell.add(leftRail);

  const rightRailGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(w / 2 - 0.1, -h / 2 + 0.05, 0),
    new THREE.Vector3(w / 2 - 0.1, -h / 2 + 0.05, 0.1)
  ]);
  const rightRail = new THREE.Line(rightRailGeo, railMat);
  shell.add(rightRail);

  // 3. 内部运作几何容器与可抽出托盘 (The Extracted Tray & Core Mechanism)
  const interior = new THREE.Group();
  interior.userData.componentId = id;
  group.add(interior);

  // 托盘底座 (Sleek Extracted Core Pedestal / Tray)
  const trayBaseGeo = new THREE.BoxGeometry(w * 0.94, 0.06, d * 0.94);
  const trayBaseMat = new THREE.MeshStandardMaterial({
    color: colorHex,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.75
  });
  const trayBase = new THREE.Mesh(trayBaseGeo, trayBaseMat);
  trayBase.position.y = -h / 2 + 0.03;
  trayBase.userData.componentId = id;
  interior.add(trayBase);

  // 全包裹隐形命中体 (确保 3D 点击 100% 精准响应)
  const hitBoxGeo = new THREE.BoxGeometry(w, h, d);
  const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
  hitBox.userData.componentId = id;
  group.add(hitBox);

  return {
    group,
    shell,
    interior,
    body,
    wireframe,
    hatchPivot,
    hatchMesh,
    hatchFrame,
    leftRail,
    rightRail,
    trayBase,
    hitBox,
    w,
    h,
    d
  };
}

function createTubeCurve(parent, points, colorHex, radius = 0.04) {
  const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, 36, radius, 8, false);
  const mat = new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness: 0.25,
    metalness: 0.7,
    transparent: true,
    opacity: 0.7
  });
  const mesh = new THREE.Mesh(geo, mat);
  parent.add(mesh);
  return { mesh, curve };
}

function createInstanced(parent, count, geometry, material) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.frustumCulled = false;
  parent.add(mesh);
  return mesh;
}

function setInstance(mesh, index, pos, scale, colorHex) {
  dummy.position.set(...pos);
  dummy.scale.set(...scale);
  dummy.rotation.set(0, 0, 0);
  dummy.updateMatrix();
  mesh.setMatrixAt(index, dummy.matrix);
  if (colorHex !== undefined) {
    mesh.setColorAt(index, colorHelper.setHex(colorHex));
  }
}

// -------------------------------------------------------------
// Yann LeCun 体系 (AMI / H-JEPA) 建模
// -------------------------------------------------------------
let dynamicRolloutGroup = null;
let gradientBall = null;
let gradientTrail = null;
const gradientTrailPoints = [];

function buildLeCunArchitecture(v) {
  const nodes = [
    {
      id: "sensor_perception",
      label: "感知编码器 (Enc)",
      sub: "Perception sx · Invariant Filter",
      desc: "多模态视觉/本体编码，将像素映射为紧凑潜特征，滤除不可预测细节微观噪声",
      x: -4.0, y: 2.0, z: 0, w: 3.4, h: 1.6, d: 1.4,
      color: palette.lecunGold
    },
    {
      id: "short_term_memory",
      label: "工作记忆 (Memory)",
      sub: "H-JEPA Multi-scale Buffer",
      desc: "分层时序潜状态记忆环，支持高频 10Hz 微动作与低频 1Hz 宏观任务状态缓存",
      x: -8.0, y: 5.5, z: 0, w: 2.8, h: 2.2, d: 1.2,
      color: 0xe09436
    },
    {
      id: "world_model_predictor",
      label: "JEPA 预测器 (Predictor)",
      sub: "Latent Dynamics · st+1 = T(st, at, zt)",
      desc: "核心分层世界模型：潜空间因果推演，带潜变量 zt 进行确定性与不确定性预测",
      x: -3.5, y: 6.8, z: 0, w: 4.4, h: 2.8, d: 1.6,
      color: palette.lecunGold
    },
    {
      id: "configurator",
      label: "配置器 (Configurator)",
      sub: "H-JEPA Level 2 Scheduler",
      desc: "前额中央控制器：动态分发多尺度目标 w，调节 Actor 能量函数权重与注意力门控",
      x: -3.5, y: 12.0, z: 0, w: 4.2, h: 1.6, d: 1.2,
      color: palette.lecunViolet
    },
    {
      id: "actor_planner",
      label: "规划决策器 (Actor)",
      sub: "CEM-MPC Rollouts Tree",
      desc: "心智决策树多步展开，反向传播求导寻优动作序列 at:t+H",
      x: 0.8, y: 4.5, z: 0, w: 3.2, h: 2.2, d: 1.4,
      color: palette.actionCoral
    },
    {
      id: "critic_cost",
      label: "代价曲面 (Critic/Cost)",
      sub: "Energy-based Landscape E(s, w)",
      desc: "动态 3D 能量损失曲面：实时梯度下山，引导 Actor 向能量谷底全局最优点收敛",
      x: 0.8, y: 9.0, z: 0, w: 3.2, h: 2.2, d: 1.4,
      color: palette.gradientTrail
    }
  ];

  v.nodes = nodes;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  nodes.forEach(n => {
    const rack = createRackBox(v.world, n.id, n.x, n.y, n.z, n.w, n.h, n.d, n.color);
    const comp = {
      n,
      rack,
      group: rack.group,
      shell: rack.shell,
      interior: rack.interior,
      hatchPivot: rack.hatchPivot,
      hatchMesh: rack.hatchMesh,
      leftRail: rack.leftRail,
      rightRail: rack.rightRail,
      zoom: 0,
      objects: [],
      unfold: null
    };

    if (n.id === "sensor_perception") {
      const mat = new THREE.MeshStandardMaterial({ color: palette.lecunGold, roughness: 0.3 });

      // Stage 1 (Left): 输入像素 Patch 矩阵 (输入帧 xt)
      const inputGroup = new THREE.Group();
      rack.interior.add(inputGroup);
      const inputInst = createInstanced(inputGroup, 16, boxGeo, mat);
      for (let i = 0; i < 16; i++) {
        const col = (i % 4) - 1.5;
        const row = Math.floor(i / 4) - 1.5;
        setInstance(inputInst, i, [col * 0.22, row * 0.22, 0], [0.18, 0.18, 0.18], 0xcc8822);
      }
      inputInst.instanceMatrix.needsUpdate = true;

      // Stage 2 (Center): 不变性滤波晶格 (消除微观噪声)
      const filterGeo = new THREE.PlaneGeometry(1.1, 1.1, 4, 4);
      const filterMat = new THREE.MeshStandardMaterial({
        color: palette.lecunViolet,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const filterMesh = new THREE.Mesh(filterGeo, filterMat);
      filterMesh.position.set(0, 0, 0.08);
      rack.interior.add(filterMesh);

      // Stage 3 (Right): 紧凑潜空间表征向量 sx 柱群
      const tokenGroup = new THREE.Group();
      rack.interior.add(tokenGroup);
      const tokenInst = createInstanced(tokenGroup, 8, boxGeo, new THREE.MeshStandardMaterial({ color: palette.lecunGold, metalness: 0.8, roughness: 0.2 }));
      for (let i = 0; i < 8; i++) {
        setInstance(tokenInst, i, [(i % 2 - 0.5) * 0.25, (Math.floor(i / 2) - 1.5) * 0.3, 0.1], [0.18, 0.24, 0.45], palette.lecunGold);
      }
      tokenInst.instanceMatrix.needsUpdate = true;

      comp.unfold = (z, t) => {
        inputGroup.position.x = -0.95 * z;
        inputGroup.rotation.y = Math.sin(t * 2) * 0.1 * z;
        tokenGroup.position.x = 0.95 * z;
        filterMesh.scale.set(0.6 + 0.45 * z, 0.6 + 0.45 * z, 1);
        filterMesh.rotation.z = t * 0.5 * z;
      };
      comp.objects.push(inputInst, tokenInst);
    } else if (n.id === "short_term_memory") {
      const memoryGroup = new THREE.Group();
      rack.interior.add(memoryGroup);

      const fastMat = new THREE.MeshStandardMaterial({ color: 0xe09436, roughness: 0.3 });
      const fastInst = createInstanced(memoryGroup, 16, boxGeo, fastMat);
      for (let i = 0; i < 16; i++) {
        const th = (i / 16) * Math.PI * 2;
        setInstance(fastInst, i, [Math.cos(th) * 0.55, Math.sin(th) * 0.4, 0], [0.12, 0.12, 0.25], 0xe09436);
      }
      fastInst.instanceMatrix.needsUpdate = true;

      const slowMat = new THREE.MeshStandardMaterial({ color: palette.lecunViolet, roughness: 0.3 });
      const slowInst = createInstanced(memoryGroup, 8, boxGeo, slowMat);
      for (let i = 0; i < 8; i++) {
        const th = (i / 8) * Math.PI * 2;
        setInstance(slowInst, i, [Math.cos(th) * 0.95, Math.sin(th) * 0.7, 0.08], [0.18, 0.15, 0.3], palette.lecunViolet);
      }
      slowInst.instanceMatrix.needsUpdate = true;

      comp.unfold = (z, t) => {
        memoryGroup.rotation.x = Math.PI * 0.28 * z;
        memoryGroup.rotation.y = Math.sin(t * 0.8) * 0.15 * z;
        for (let i = 0; i < 16; i++) {
          const th = (i / 16) * Math.PI * 2 + t * 2.8 * z;
          const r = 0.55 + 0.14 * z;
          setInstance(fastInst, i, [Math.cos(th) * r, Math.sin(th) * r, 0], [0.12, 0.12, 0.25], 0xe09436);
        }
        fastInst.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < 8; i++) {
          const th = (i / 8) * Math.PI * 2 + t * 0.45 * z;
          const r = 0.92 + 0.20 * z;
          setInstance(slowInst, i, [Math.cos(th) * r, Math.sin(th) * r, 0.1], [0.18, 0.15, 0.3], palette.lecunViolet);
        }
        slowInst.instanceMatrix.needsUpdate = true;
      };
      comp.objects.push(fastInst, slowInst);
    } else if (n.id === "world_model_predictor") {
      // 3 端口因果动力学爆发展开核心
      const stGroup = new THREE.Group();
      rack.interior.add(stGroup);
      const stInst = createInstanced(stGroup, 8, boxGeo, new THREE.MeshStandardMaterial({ color: 0xcc8822 }));
      for (let i = 0; i < 8; i++) setInstance(stInst, i, [0, (i - 3.5) * 0.25, 0], [0.2, 0.18, 0.3], 0xcc8822);
      stInst.instanceMatrix.needsUpdate = true;

      const ztGroup = new THREE.Group();
      rack.interior.add(ztGroup);
      const ztNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 6), new THREE.MeshStandardMaterial({ color: palette.lecunViolet }));
      ztNozzle.rotation.x = Math.PI;
      ztGroup.add(ztNozzle);

      const atGroup = new THREE.Group();
      rack.interior.add(atGroup);
      const atBlock = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.3), new THREE.MeshStandardMaterial({ color: palette.actionCoral }));
      atGroup.add(atBlock);

      const coreGroup = new THREE.Group();
      rack.interior.add(coreGroup);
      const coreInst = createInstanced(coreGroup, 36, boxGeo, new THREE.MeshStandardMaterial({ color: palette.lecunGold, roughness: 0.2 }));
      for (let i = 0; i < 36; i++) {
        const cx = (i % 6 - 2.5) * 0.32;
        const cy = (Math.floor(i / 6) - 2.5) * 0.26;
        setInstance(coreInst, i, [cx, cy, 0], [0.22, 0.18, 0.4], palette.lecunGold);
      }
      coreInst.instanceMatrix.needsUpdate = true;

      const stNextGroup = new THREE.Group();
      rack.interior.add(stNextGroup);
      const nextInst = createInstanced(stNextGroup, 8, boxGeo, new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 }));
      for (let i = 0; i < 8; i++) setInstance(nextInst, i, [0, (i - 3.5) * 0.25, 0], [0.22, 0.2, 0.35], 0xffd700);
      nextInst.instanceMatrix.needsUpdate = true;

      comp.unfold = (z, t) => {
        stGroup.position.x = -1.2 * z;
        atGroup.position.y = -0.95 * z;
        ztGroup.position.y = 1.0 * z;
        ztNozzle.rotation.z = Math.sin(t * 4) * 0.2;
        stNextGroup.position.x = 1.2 * z;
        coreGroup.scale.setScalar(1.0 + 0.2 * z);
        coreGroup.rotation.y = Math.sin(t * 1.5) * 0.12 * z;
      };
      comp.objects.push(stInst, coreInst, nextInst);
    } else if (n.id === "configurator") {
      const pyramidGroup = new THREE.Group();
      rack.interior.add(pyramidGroup);

      const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
      const crystalMat = new THREE.MeshStandardMaterial({ color: palette.lecunViolet, metalness: 0.9, roughness: 0.1 });
      const goalCrystal = new THREE.Mesh(crystalGeo, crystalMat);
      pyramidGroup.add(goalCrystal);

      const subgoalInst = createInstanced(pyramidGroup, 12, boxGeo, new THREE.MeshStandardMaterial({ color: 0xba68c8, roughness: 0.3 }));
      for (let i = 0; i < 12; i++) {
        setInstance(subgoalInst, i, [(i % 4 - 1.5) * 0.45, (Math.floor(i / 4) - 1) * 0.35, 0], [0.28, 0.16, 0.3], 0xba68c8);
      }
      subgoalInst.instanceMatrix.needsUpdate = true;

      comp.unfold = (z, t) => {
        goalCrystal.position.y = 0.65 * z;
        goalCrystal.rotation.y = t * 1.5;
        goalCrystal.rotation.x = Math.sin(t) * 0.3;
        subgoalInst.position.y = -0.18 * z;
        subgoalInst.scale.setScalar(1.0 + 0.18 * z);
      };
      comp.objects.push(subgoalInst);
    } else if (n.id === "actor_planner") {
      dynamicRolloutGroup = new THREE.Group();
      rack.interior.add(dynamicRolloutGroup);
      rebuildActorRollouts(state.steps);

      comp.unfold = (z, t) => {
        dynamicRolloutGroup.position.z = 0.35 * z;
        dynamicRolloutGroup.scale.setScalar(1.0 + 0.25 * z);
        dynamicRolloutGroup.rotation.y = Math.sin(t * 1.2) * 0.1 * z;
      };
    } else if (n.id === "critic_cost") {
      const surfaceGeo = new THREE.PlaneGeometry(2.6, 1.8, 24, 18);
      const pos = surfaceGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const px = pos.getX(i);
        const py = pos.getY(i);
        const distSq = px * px + py * py;
        const pz = 0.38 * distSq - 0.14 * Math.cos(px * 4) * Math.cos(py * 4);
        pos.setZ(i, pz);
      }
      surfaceGeo.computeVertexNormals();

      const surfaceMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        wireframe: true,
        transparent: true,
        opacity: 0.8
      });
      const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
      surfaceMesh.position.z = 0.1;
      rack.interior.add(surfaceMesh);

      const ballGeo = new THREE.SphereGeometry(0.09, 12, 12);
      const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      gradientBall = new THREE.Mesh(ballGeo, ballMat);
      gradientBall.position.set(0, 0, 0.2);
      rack.interior.add(gradientBall);

      const trailGeo = new THREE.BufferGeometry();
      const trailMat = new THREE.LineBasicMaterial({
        color: palette.gradientTrail,
        transparent: true,
        opacity: 0.9,
        linewidth: 2
      });
      gradientTrail = new THREE.Line(trailGeo, trailMat);
      rack.interior.add(gradientTrail);

      comp.unfold = (z, t) => {
        surfaceMesh.rotation.x = Math.PI * 0.28 * z;
        surfaceMesh.scale.setScalar(1.0 + 0.22 * z);
      };
    }

    v.components.push(comp);
  });

  v.edges = [
    { from: "sensor_perception", to: "world_model_predictor", color: palette.lecunGold, pts: [[-4.0, 2.8, 0], [-4.0, 4.5, 0], [-3.8, 5.4, 0]] },
    { from: "sensor_perception", to: "short_term_memory", color: 0xe09436, pts: [[-5.7, 2.0, 0], [-7.5, 2.0, 0], [-7.8, 4.4, 0]] },
    { from: "short_term_memory", to: "world_model_predictor", color: 0xe09436, pts: [[-6.6, 6.0, 0], [-5.7, 6.4, 0]] },
    { from: "configurator", to: "world_model_predictor", color: palette.lecunViolet, pts: [[-3.5, 11.2, 0], [-3.5, 8.2, 0]] },
    { from: "configurator", to: "critic_cost", color: palette.lecunViolet, pts: [[-1.4, 11.8, 0], [0.8, 11.8, 0], [0.8, 10.1, 0]] },
    { from: "world_model_predictor", to: "critic_cost", color: palette.lecunGold, pts: [[-1.3, 7.5, 0], [0.8, 7.5, 0], [0.8, 7.9, 0]] },
    { from: "critic_cost", to: "actor_planner", color: palette.gradientTrail, pts: [[0.8, 7.9, 0.4], [0.8, 5.6, 0.4]] },
    { from: "actor_planner", to: "world_model_predictor", color: palette.actionCoral, pts: [[-0.8, 4.8, 0], [-2.0, 4.8, 0], [-2.0, 5.6, 0]] }
  ];

  v.edges.forEach(e => {
    e.pipe = createTubeCurve(v.world, e.pts, e.color, 0.035);
  });
}

// 动态重建心智展开树 (随时空展开步数 T 实时生长分叉)
function rebuildActorRollouts(steps) {
  if (!dynamicRolloutGroup) return;
  while (dynamicRolloutGroup.children.length > 0) {
    dynamicRolloutGroup.remove(dynamicRolloutGroup.children[0]);
  }

  const mat = new THREE.LineBasicMaterial({
    color: palette.actionCoral,
    transparent: true,
    opacity: 0.85,
    linewidth: 1.5
  });

  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffa8a8 });
  const nodeGeo = new THREE.SphereGeometry(0.04, 6, 6);

  function growBranch(start, depth, maxDepth, angle, spread) {
    if (depth >= maxDepth) return;
    const len = 0.35 / (depth * 0.4 + 1);
    const end = [
      start[0] + Math.sin(angle) * len * spread,
      start[1] + Math.cos(angle) * len,
      start[2] + (depth % 2 === 0 ? 0.05 : -0.05)
    ];

    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    ]);
    dynamicRolloutGroup.add(new THREE.Line(geo, mat));

    const sphere = new THREE.Mesh(nodeGeo, nodeMat);
    sphere.position.set(...end);
    dynamicRolloutGroup.add(sphere);

    // 二叉/三叉扩展
    growBranch(end, depth + 1, maxDepth, angle - 0.45, spread);
    growBranch(end, depth + 1, maxDepth, angle + 0.45, spread);
  }

  const treeDepth = Math.min(5, Math.ceil(steps / 2));
  growBranch([0, -0.7, 0.1], 0, treeDepth, 0, 1.2);
}

// -------------------------------------------------------------
// 李飞飞团队体系 (World Labs Atlas / 空间智能) 建模
// -------------------------------------------------------------
let gaussianSplatsMesh = null;
let rectifiedFlowVectors = [];
let spatialAnchorGroup = null;

function buildFeiFeiArchitecture(v) {
  const nodes = [
    {
      id: "spatial_input",
      label: "空间接地输入 (Input)",
      sub: "6-DoF Camera + Depth Poses",
      desc: "多视角图像 + 显式欧氏 6-DoF 轨迹相机位姿与度量级深度图输入",
      x: 3.5, y: 1.8, z: 0, w: 4.2, h: 1.6, d: 1.4,
      color: palette.feifeiCyan
    },
    {
      id: "spatial_context",
      label: "空间上下文 (Context)",
      sub: "3D Grounded Euclidean Anchor",
      desc: "真 3D 空间坐标锚定，根据几何常识自发补全走廊拐角，根治物理穿模与凭空消失",
      x: 0.0, y: 5.5, z: 0, w: 3.2, h: 2.2, d: 1.3,
      color: palette.feifeiGreen
    },
    {
      id: "autoregressive_backbone",
      label: "自回归扩散骨干 (DiT)",
      sub: "Autoregressive DiT + KV Cache",
      desc: "因果自回归时空多模态 Transformer，结合 KV 缓存实现连续物理时空流式推进",
      x: 3.8, y: 6.8, z: 0, w: 4.2, h: 2.8, d: 1.6,
      color: palette.feifeiCyan
    },
    {
      id: "rectified_flow",
      label: "流匹配扩散头 (Flow)",
      sub: "Straight-line Optimal Transport",
      desc: "Rectified Flow 直线流匹配：ODE 极速连续去噪，最优传输速度场预测",
      x: 3.8, y: 11.0, z: 0, w: 4.0, h: 1.8, d: 1.4,
      color: palette.rectFlow
    },
    {
      id: "gaussian_splatting",
      label: "3D 高斯场 (3DGS)",
      sub: "1200+ Splats · Object Permanence",
      desc: "显式 3D 高斯云团：具备真实三维几何、协方差与球谐光泽，保证物体持久性",
      x: 8.0, y: 6.8, z: 0, w: 3.4, h: 3.2, d: 1.6,
      color: palette.feifeiGreen
    },
    {
      id: "neural_renderer_sim",
      label: "实时仿真与渲染 (Sim)",
      sub: "60fps Interactive Engine",
      desc: "端侧 60fps 实时自由视角漫游渲染，真实碰撞仿真与具身策略数据机",
      x: 4.8, y: 14.5, z: 0, w: 4.6, h: 1.8, d: 1.4,
      color: palette.feifeiCyan
    }
  ];

  v.nodes = nodes;
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);

  nodes.forEach(n => {
    const rack = createRackBox(v.world, n.id, n.x, n.y, n.z, n.w, n.h, n.d, n.color);
    const comp = {
      n,
      rack,
      group: rack.group,
      shell: rack.shell,
      interior: rack.interior,
      hatchPivot: rack.hatchPivot,
      hatchMesh: rack.hatchMesh,
      leftRail: rack.leftRail,
      rightRail: rack.rightRail,
      zoom: 0,
      objects: [],
      unfold: null
    };

    if (n.id === "spatial_input") {
      const inputCamGroup = new THREE.Group();
      rack.interior.add(inputCamGroup);

      const frustumGeo = new THREE.ConeGeometry(0.65, 1.2, 4);
      frustumGeo.rotateX(Math.PI / 2);
      const frustumMat = new THREE.MeshStandardMaterial({
        color: palette.feifeiCyan,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const frustum = new THREE.Mesh(frustumGeo, frustumMat);
      inputCamGroup.add(frustum);

      const rgbGeo = new THREE.PlaneGeometry(0.8, 0.55);
      const rgbMat = new THREE.MeshBasicMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const rgbPlane = new THREE.Mesh(rgbGeo, rgbMat);
      rgbPlane.position.z = 0.4;
      inputCamGroup.add(rgbPlane);

      const axes = new THREE.AxesHelper(0.75);
      axes.position.set(0, 0, 0.1);
      inputCamGroup.add(axes);

      comp.unfold = (z, t) => {
        frustum.scale.set(1.0 + 0.25 * z, 1.0 + 0.25 * z, 1.0 + 0.45 * z);
        rgbPlane.position.z = 0.4 + 0.35 * z;
        axes.scale.setScalar(1.0 + 0.3 * z);
        inputCamGroup.rotation.y = Math.sin(t * 1.5) * 0.15 * z;
      };
    } else if (n.id === "spatial_context") {
      const contextGroup = new THREE.Group();
      rack.interior.add(contextGroup);

      const frustumGeo = new THREE.ConeGeometry(0.35, 0.6, 4);
      frustumGeo.rotateX(Math.PI / 2);
      const fMatA = new THREE.MeshBasicMaterial({ color: palette.feifeiGreen, wireframe: true });
      const frustumA = new THREE.Mesh(frustumGeo, fMatA);
      contextGroup.add(frustumA);

      const fMatB = new THREE.MeshBasicMaterial({ color: palette.feifeiCyan, wireframe: true });
      const frustumB = new THREE.Mesh(frustumGeo, fMatB);
      frustumB.rotation.y = Math.PI * 0.7;
      contextGroup.add(frustumB);

      const corridorGeo = new THREE.BoxGeometry(1.4, 0.6, 0.6);
      const corridorMat = new THREE.MeshStandardMaterial({
        color: palette.feifeiGreen,
        wireframe: true,
        transparent: true,
        opacity: 0.6
      });
      const corridorMesh = new THREE.Mesh(corridorGeo, corridorMat);
      contextGroup.add(corridorMesh);

      spatialAnchorGroup = new THREE.Group();
      contextGroup.add(spatialAnchorGroup);
      rebuildSpatialAnchors(state.steps);

      comp.unfold = (z, t) => {
        frustumA.position.set(-0.95 * z, 0.15 * z, 0);
        frustumB.position.set(0.95 * z, -0.15 * z, 0.15 * z);
        corridorMesh.scale.set(z * 1.2, 0.9 + 0.15 * z, 0.9 + 0.15 * z);
        corridorMesh.visible = (z > 0.05);
        spatialAnchorGroup.position.z = 0.25 * z;
      };
    } else if (n.id === "autoregressive_backbone") {
      const ditGroup = new THREE.Group();
      rack.interior.add(ditGroup);

      // Past KV-Cache (Left)
      const kvInst = createInstanced(ditGroup, 16, boxGeo, new THREE.MeshStandardMaterial({ color: 0x1e88e5, roughness: 0.3 }));
      for (let i = 0; i < 16; i++) {
        setInstance(kvInst, i, [(i % 2 - 0.5) * 0.22, (Math.floor(i / 2) - 3.5) * 0.22, 0], [0.18, 0.18, 0.35], 0x1e88e5);
      }
      kvInst.instanceMatrix.needsUpdate = true;

      // DiT Attention Core (Center)
      const coreInst = createInstanced(ditGroup, 24, boxGeo, new THREE.MeshStandardMaterial({ color: palette.feifeiCyan, roughness: 0.2 }));
      for (let i = 0; i < 24; i++) {
        const col = i % 6 - 2.5;
        const row = Math.floor(i / 6) - 1.5;
        setInstance(coreInst, i, [col * 0.3, row * 0.28, 0.1], [0.22, 0.2, 0.45], palette.feifeiCyan);
      }
      coreInst.instanceMatrix.needsUpdate = true;

      // Next Spacetime Token (Right)
      const nextToken = new THREE.Mesh(boxGeo, new THREE.MeshStandardMaterial({ color: palette.feifeiGreen, metalness: 0.8, roughness: 0.2 }));
      nextToken.scale.set(0.35, 0.35, 0.6);
      ditGroup.add(nextToken);

      comp.unfold = (z, t) => {
        kvInst.position.x = -1.1 * z;
        coreInst.scale.setScalar(1.0 + 0.2 * z);
        coreInst.rotation.y = Math.sin(t * 2) * 0.1 * z;
        nextToken.position.x = 1.1 * z;
        nextToken.rotation.y = t * 2.0;
      };
      comp.objects.push(kvInst, coreInst);
    } else if (n.id === "rectified_flow") {
      const flowTunnelGroup = new THREE.Group();
      rack.interior.add(flowTunnelGroup);

      const arrowMat = new THREE.LineBasicMaterial({ color: palette.rectFlow, linewidth: 2 });
      rectifiedFlowVectors = [];
      for (let i = 0; i < 18; i++) {
        const u = (i % 6 - 2.5) * 0.55;
        const vRow = (Math.floor(i / 6) - 1) * 0.4;
        const start = new THREE.Vector3(u, vRow, -0.4);
        const end = new THREE.Vector3(u, vRow, 0.4);
        const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(geo, arrowMat);
        flowTunnelGroup.add(line);

        const headGeo = new THREE.ConeGeometry(0.04, 0.12, 6);
        headGeo.rotateX(Math.PI / 2);
        const headMat = new THREE.MeshBasicMaterial({ color: palette.rectFlow });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.copy(end);
        flowTunnelGroup.add(head);

        rectifiedFlowVectors.push({ line, head, start, end, u, vRow });
      }

      comp.unfold = (z, t) => {
        flowTunnelGroup.position.z = 0.25 * z;
        flowTunnelGroup.scale.set(1.0 + 0.15 * z, 1.0 + 0.15 * z, 1.0 + 0.6 * z);
      };
    } else if (n.id === "gaussian_splatting") {
      const count = 1200;
      const ptsGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = (Math.random() - 0.5) * Math.PI;
        const rad = 0.8 + 0.25 * Math.sin(u * 3) * Math.cos(v * 2);

        positions[i * 3 + 0] = rad * Math.cos(v) * Math.cos(u);
        positions[i * 3 + 1] = rad * Math.sin(v) * 0.9;
        positions[i * 3 + 2] = rad * Math.cos(v) * Math.sin(u) * 0.7;

        const mix = Math.sin(u) * 0.5 + 0.5;
        colors[i * 3 + 0] = THREE.MathUtils.lerp(0.0, 0.22, mix);
        colors[i * 3 + 1] = THREE.MathUtils.lerp(0.95, 0.95, mix);
        colors[i * 3 + 2] = THREE.MathUtils.lerp(0.85, 0.99, mix);
      }

      ptsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      ptsGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const ptsMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      gaussianSplatsMesh = new THREE.Points(ptsGeo, ptsMat);
      gaussianSplatsMesh.position.set(0, 0, 0.1);
      rack.interior.add(gaussianSplatsMesh);

      comp.unfold = (z, t) => {
        gaussianSplatsMesh.scale.setScalar(1.0 + 0.35 * z);
        gaussianSplatsMesh.position.z = 0.25 * z;
      };
    } else if (n.id === "neural_renderer_sim") {
      const cockpitGroup = new THREE.Group();
      rack.interior.add(cockpitGroup);

      const frameGeo = new THREE.BoxGeometry(2.4, 1.4, 0.08);
      const frameMat = new THREE.MeshStandardMaterial({
        color: palette.feifeiCyan,
        wireframe: true,
        transparent: true,
        opacity: 0.75
      });
      const simFrame = new THREE.Mesh(frameGeo, frameMat);
      cockpitGroup.add(simFrame);

      const simBall = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0x38ef7d }));
      cockpitGroup.add(simBall);

      const gridHelper = new THREE.GridHelper(2.0, 8, palette.feifeiCyan, 0x113344);
      gridHelper.rotation.x = Math.PI / 2;
      cockpitGroup.add(gridHelper);

      comp.unfold = (z, t) => {
        cockpitGroup.scale.setScalar(0.95 + 0.25 * z);
        cockpitGroup.rotation.y = Math.sin(t * 1.5) * 0.1 * z;
        simBall.position.set(
          Math.sin(t * 3.5) * 0.6 * z,
          Math.abs(Math.sin(t * 4.2)) * 0.35 - 0.15,
          0.15
        );
      };
    }

    v.components.push(comp);
  });

  v.edges = [
    { from: "spatial_input", to: "spatial_context", color: palette.feifeiGreen, pts: [[2.0, 2.4, 0], [0.8, 2.4, 0], [0.8, 4.4, 0]] },
    { from: "spatial_input", to: "autoregressive_backbone", color: palette.feifeiCyan, pts: [[3.5, 2.6, 0], [3.5, 4.2, 0], [3.8, 5.4, 0]] },
    { from: "spatial_context", to: "autoregressive_backbone", color: palette.feifeiGreen, pts: [[1.6, 6.4, 0], [2.2, 6.4, 0], [2.2, 6.8, 0]] },
    { from: "autoregressive_backbone", to: "rectified_flow", color: palette.rectFlow, pts: [[3.8, 8.2, 0], [3.8, 10.1, 0]] },
    { from: "autoregressive_backbone", to: "gaussian_splatting", color: palette.feifeiGreen, pts: [[5.9, 6.8, 0], [6.3, 6.8, 0]] },
    { from: "rectified_flow", to: "neural_renderer_sim", color: palette.feifeiCyan, pts: [[3.8, 11.9, 0], [4.4, 13.6, 0]] },
    { from: "gaussian_splatting", to: "neural_renderer_sim", color: palette.feifeiGreen, pts: [[8.0, 8.4, 0], [8.0, 13.6, 0], [7.1, 13.6, 0]] }
  ];

  v.edges.forEach(e => {
    e.pipe = createTubeCurve(v.world, e.pts, e.color, 0.035);
  });
}

// 动态扩展空间锚点网格 (随时空步数 T 向外无限生成)
function rebuildSpatialAnchors(steps) {
  if (!spatialAnchorGroup) return;
  while (spatialAnchorGroup.children.length > 0) {
    spatialAnchorGroup.remove(spatialAnchorGroup.children[0]);
  }

  const boxGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);
  const mat = new THREE.MeshStandardMaterial({
    color: palette.feifeiGreen,
    metalness: 0.5,
    roughness: 0.2
  });

  const range = 1 + Math.min(2, Math.floor(steps / 4));
  for (let x = -range; x <= range; x++) {
    for (let y = -1; y <= 1; y++) {
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x * 0.65, y * 0.5, (x % 2) * 0.1);
      spatialAnchorGroup.add(mesh);
    }
  }
}

// -------------------------------------------------------------
// 动态信号流动粒子系统
// -------------------------------------------------------------
function buildFlowParticles(v) {
  const geo = new THREE.SphereGeometry(0.08, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95
  });
  v.particles = createInstanced(v.world, 256, geo, mat);
}


function setGroupOpacity(group, opacity, isHighlighted = false) {
  group.traverse(o => {
    if (o.isMesh || o.isLine || o.isLineSegments || o.isPoints) {
      if (o.material) {
        if (!o.userData.baseOpacity) o.userData.baseOpacity = o.material.opacity || 1.0;
        o.material.transparent = true;
        o.material.opacity = o.userData.baseOpacity * opacity;
        if (isHighlighted && o.material.emissive) {
          o.material.emissiveIntensity = 0.5;
        } else if (o.material.emissive) {
          o.material.emissiveIntensity = 0.0;
        }
      }
    }
  });
}


function tickInterior(v, comp) {
  const isStoryTarget = story.active && !story.isOverview && story.activeTargets && (story.activeTargets[v.side] === comp.n.id);
  const isExploreSelected = !story.active && (v.selected?.id === comp.n.id);
  const isSelected = Boolean(isStoryTarget || isExploreSelected);
  const targetZoom = isSelected ? 1.0 : 0.0;
  
  // 平滑补间开箱抽取进度 (0 -> 1)
  comp.zoom = THREE.MathUtils.lerp(comp.zoom, targetZoom, 0.12);
  const z = comp.zoom;

  // 1. 机械开箱动作：前置舱门向下折叠下翻 95 度 (Front Hatch Door opens downward)
  if (comp.hatchPivot) {
    comp.hatchPivot.rotation.x = -Math.PI * 0.54 * z;
    if (comp.hatchMesh) {
      comp.hatchMesh.material.opacity = Math.max(0.06, 0.52 * (1.0 - z * 0.7));
    }
  }

  // 2. 内部计算托盘从盒中抽出，向前优雅滑行至最前端 (Forward glide to foreground: Z +2.2, Y +0.30, Scale ~1.07x)
  comp.interior.position.z = z * 2.2;
  comp.interior.position.y = z * 0.30;
  comp.interior.scale.setScalar(0.95 + z * 0.12);

  // 3. 伸缩机械激光导轨自盒中延伸，连接箱体与抽出托盘 (Physical connection rails)
  if (comp.leftRail && comp.rightRail && comp.rack) {
    const railZ = Math.max(0.05, comp.interior.position.z);
    const w = comp.rack.w, h = comp.rack.h, d = comp.rack.d;
    comp.leftRail.geometry.setFromPoints([
      new THREE.Vector3(-w / 2 + 0.12, -h / 2 + 0.06, -d / 2 + 0.1),
      new THREE.Vector3(-w / 2 + 0.12, -h / 2 + 0.06 + z * 0.30, railZ)
    ]);
    comp.rightRail.geometry.setFromPoints([
      new THREE.Vector3(w / 2 - 0.12, -h / 2 + 0.06, -d / 2 + 0.1),
      new THREE.Vector3(w / 2 - 0.12, -h / 2 + 0.06 + z * 0.30, railZ)
    ]);
    comp.leftRail.material.opacity = z * 0.9;
    comp.rightRail.material.opacity = z * 0.9;
  }

  // 4. 外框机架随下钻消隐 (Shell dissolves so user looks directly inside)
  comp.shell.traverse(m => {
    if (m.material && m !== comp.leftRail && m !== comp.rightRail && m !== comp.hatchMesh) {
      if (!m.userData.initialOpacity) m.userData.initialOpacity = m.material.opacity || 0.8;
      m.material.opacity = m.userData.initialOpacity * (1.0 - z * 0.88);
      m.material.depthWrite = (m.material.opacity > 0.4);
    }
  });

  // 5. 内部计算构件在抽出时大幅提高发光亮度和不透明度
  comp.interior.traverse(m => {
    if (m.material && m.material.opacity !== undefined) {
      m.material.opacity = Math.min(1.0, 0.45 + z * 0.55);
      if (m.material.emissive) {
        m.material.emissiveIntensity = 0.2 + z * 0.7;
      }
    }
  });

  // 6. 各模块内部独特的计算方式在最前端进行三维爆发展开
  if (comp.unfold) {
    comp.unfold(z, state.time);
  }

  // 7. 当处于物理幻觉实验或组件被选中抽出时，进行暗场背景淡化
  if (state.hallucinationMode) {
    const fadeOut = 0.12;
    comp.group.traverse(m => {
      if (m.material) {
        if (!m.userData.origOp) m.userData.origOp = m.material.opacity || 0.8;
        m.material.opacity = m.userData.origOp * fadeOut;
      }
    });
    return;
  }

  if (!story.active) {
    const isAnySelectedOnSide = Boolean(v.selected);
    if (isAnySelectedOnSide && !isSelected) {
      const fadeOut = 0.10;
      comp.group.traverse(m => {
        if (m.material) {
          if (!m.userData.origOp) m.userData.origOp = m.material.opacity || 0.8;
          m.material.opacity = m.userData.origOp * fadeOut;
        }
      });
    } else if (!isAnySelectedOnSide) {
      comp.group.traverse(m => {
        if (m.material && m.userData.origOp) {
          m.material.opacity = m.userData.origOp;
        }
      });
    }
  }
}

function updateStoryFocus(v) {
  const activeId = story.active ? (story.activeTargets ? story.activeTargets[v.side] : null) : null;
  const isOverview = story.active ? story.isOverview : true;

  v.components.forEach(comp => {
    if (!story.active || isOverview) {
      setGroupOpacity(comp.group, 1.0, false);
      comp.group.scale.setScalar(1.0);
    } else if (comp.n.id === activeId) {
      // 沉浸高亮焦点组件
      setGroupOpacity(comp.group, 1.25, true);
      comp.group.scale.setScalar(1.0);
    } else {
      // 自动暗淡其他次要组件
      setGroupOpacity(comp.group, 0.08, false);
      comp.group.scale.setScalar(0.97);
    }
  });

  v.edges.forEach(e => {
    if (!story.active || isOverview) {
      e.pipe.mesh.material.opacity = 0.7;
    } else if (e.from === activeId || e.to === activeId) {
      e.pipe.mesh.material.opacity = 0.95;
    } else {
      e.pipe.mesh.material.opacity = 0.05;
    }
  });
}

function updateFlowParticles(v) {
  if (!v.particles || !v.edges.length) return;
  let idx = 0;
  const t = state.time * 0.45;
  const particlesPerEdge = Math.min(8, Math.floor(256 / v.edges.length));

  v.edges.forEach(e => {
    const curve = e.pipe.curve;
    for (let p = 0; p < particlesPerEdge; p++) {
      const progress = ((t + p / particlesPerEdge) % 1.0);
      const pt = curve.getPoint(progress);
      dummy.position.copy(pt);
      dummy.scale.setScalar(0.9 + Math.sin(t * 8 + p) * 0.25);
      dummy.updateMatrix();
      v.particles.setMatrixAt(idx, dummy.matrix);
      v.particles.setColorAt(idx, colorHelper.setHex(e.color));
      idx++;
    }
  });

  v.particles.count = idx;
  v.particles.instanceMatrix.needsUpdate = true;
  if (v.particles.instanceColor) v.particles.instanceColor.needsUpdate = true;
}

// -------------------------------------------------------------
// DOM 标签
// -------------------------------------------------------------
// DOM 标签与 3D 浮动运作原理卡片 (参考 petergpt/transformer-architecture)
// -------------------------------------------------------------
function smooth(a, b, x) {
  x = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return x * x * (3 - 2 * x);
}

function getMetricContent(nodeId, side) {
  const data = modulePrinciples[nodeId];
  if (!data) return { title: "", sub: "" };
  if (side === 0) {
    if (nodeId === "sensor_perception") {
      return {
        title: "sx = Enc(xt) · 潜特征因果提纯",
        sub: "滤除微观像素噪声 · 保持物理因果不变性 · 紧凑特征提取"
      };
    } else if (nodeId === "short_term_memory") {
      return {
        title: "Mt = [st-k, ..., st] · 分层工作记忆",
        sub: "双圈时钟寄存器 · 10Hz 微动作 + 1Hz 长程规划多尺度缓存"
      };
    } else if (nodeId === "world_model_predictor") {
      return {
        title: "st+1 = T(st, at, zt) · JEPA 预测核",
        sub: "潜变量 z 注入不确定性扰动 · 动力学因果闭环 · 绝不生成像素"
      };
    } else if (nodeId === "configurator") {
      return {
        title: "w ~ pi_goal · 前额中央调度中枢",
        sub: "自顶向下任务分解 · 动态调度注意力 · 实时调节 Critic 能量曲面"
      };
    } else if (nodeId === "actor_planner") {
      return {
        title: "a* = argmin sum E · 心智决策树",
        sub: "CEM-MPC 虚拟前向多步展开 · 沿能量曲面梯度反向传播寻优"
      };
    } else if (nodeId === "critic_cost") {
      return {
        title: "E(s, w) · 动态能量代价曲面",
        sub: "物理合规性约束 · 发光小球实时梯度下山 · 引导最优动作极速收敛"
      };
    }
  } else {
    if (nodeId === "spatial_input") {
      return {
        title: "6-DoF [R|t] + RGB-D · 空间接地",
        sub: "相机位姿与度量深度原生模态 · 真实三维欧氏坐标系反投影"
      };
    } else if (nodeId === "spatial_context") {
      return {
        title: "Euclidean Anchor · 空间上下文",
        sub: "3D 几何拓扑锚定 · 自发合理想象未知走廊门厅 · 根绝形变穿模"
      };
    } else if (nodeId === "autoregressive_backbone") {
      return {
        title: "Spatial-Temporal DiT · 时空自回归",
        sub: "因果自回归时空 Attention · 流式 KV-Cache 支持无限长物理仿真"
      };
    } else if (nodeId === "rectified_flow") {
      return {
        title: "dx/dt = vt(x) · 最优传输流匹配",
        sub: "直线常微分方程 (ODE) 极速去噪 · 告别布朗弯曲轨迹 · 步数减少 70%"
      };
    } else if (nodeId === "gaussian_splatting") {
      return {
        title: "1,200+ Splats · 显式 3D 高斯空间场",
        sub: "显式三维几何实体 · 遮挡与跨视角物体持久不灭 (Object Permanence)"
      };
    } else if (nodeId === "neural_renderer_sim") {
      return {
        title: "60fps · 端侧实时物理仿真引擎",
        sub: "可微瓦片高速光栅化 · 真实物理受力与碰撞闭环 · 具身智能数据机"
      };
    }
  }
  return { title: data.title, sub: data.sub };
}

function buildLabels(v) {
  v.nodes.forEach(n => {
    // 1. 常规标题标签按钮
    const el = document.createElement("button");
    el.className = `label ${v.side === 0 ? "lecun" : "feifei"}`;
    el.innerHTML = `${n.label}<small style="display:block;font-size:10px;opacity:0.75;">${n.sub}</small>`;
    el.onclick = (e) => {
      e.stopPropagation();
      focusComponent(v, n);
    };
    labelsEl.appendChild(el);

    const guide = document.createElementNS("http://www.w3.org/2000/svg", "path");
    guideSVG.appendChild(guide);

    // 2. 3D 浮动运作原理 Metric 弹窗 (类似 petergpt/transformer-architecture 的 .label.metric)
    const metricInfo = getMetricContent(n.id, v.side);
    const metricEl = document.createElement("div");
    metricEl.className = `label metric ${v.side === 0 ? "lecun" : "feifei"}`;
    metricEl.innerHTML = `${metricInfo.title}<small>${metricInfo.sub}</small>`;
    metricEl.style.display = "none";
    metricEl.style.opacity = "0";
    labelsEl.appendChild(metricEl);

    labels.push({
      v,
      node: n,
      el,
      guide,
      pos: new THREE.Vector3(n.x, n.y, n.z + n.d / 2),
      metricEl,
      metricPos: new THREE.Vector3(n.x, n.y + n.h / 2 + 1.2, n.z + n.d / 2 + 0.6),
      opacity: 1,
      metricOpacity: 0
    });
  });
}

function updateLabels() {
  const p = new THREE.Vector3();
  const mp = new THREE.Vector3();

  labels.forEach(l => {
    const vp = viewport(l.v);
    if (!vp.show || state.hallucinationMode) {
      l.el.style.display = "none";
      l.guide.style.display = "none";
      if (l.metricEl) l.metricEl.style.display = "none";
      return;
    }

    const comp = l.v.components.find(c => c.n.id === l.node.id);
    const zoom = comp ? comp.zoom : 0;

    // 沉浸导览模式：只展示当前正在讲解的核心目标标签
    if (story.active) {
      if (story.isOverview) {
        l.el.style.display = "none";
        l.guide.style.display = "none";
        if (l.metricEl) l.metricEl.style.display = "none";
        l.el.classList.remove("story-active-target");
        return;
      }
      const activeId = story.activeTargets ? story.activeTargets[l.v.side] : null;
      if (l.node.id !== activeId) {
        l.el.style.display = "none";
        l.guide.style.display = "none";
        if (l.metricEl) l.metricEl.style.display = "none";
        l.el.classList.remove("story-active-target");
        return;
      }
      l.el.classList.add("story-active-target");
    } else {
      l.el.classList.remove("story-active-target");
    }

    // 1. 常规标题按钮标签位置与渐变消隐 (下钻聚焦时淡出，让位给 3D 浮动运作原理)
    l.opacity = (1 - smooth(0.12, 0.58, zoom));
    p.copy(l.pos).project(l.v.camera);

    const isVisibleP = (p.z > 0 && p.z < 1);
    const screenX = ((p.x * 0.5 + 0.5) * vp.w) + vp.x;
    const screenY = ((-p.y * 0.5 + 0.5) * height);
    const inBounds = (screenX >= vp.x + 10 && screenX <= vp.x + vp.w - 10 && screenY >= 65 && screenY <= height - 55);

    if (isVisibleP && inBounds && l.opacity > 0.05) {
      l.el.style.display = "";
      l.el.style.opacity = l.opacity;
      l.el.style.left = `${screenX}px`;
      l.el.style.top = `${screenY}px`;
      l.guide.style.display = "";
      l.guide.style.opacity = l.opacity;
      l.guide.setAttribute("d", `M ${screenX} ${screenY} L ${screenX} ${screenY - 14}`);
    } else {
      l.el.style.display = "none";
      l.guide.style.display = "none";
    }

    // 2. 3D 浮动运作原理卡片 (zoom 增大时平滑弹出，随托盘同步前突至最前端)
    l.metricOpacity = smooth(0.25, 0.82, zoom);
    if (l.metricEl) {
      mp.copy(l.metricPos);
      mp.z += zoom * 2.2;
      mp.y += zoom * 0.30;
      mp.project(l.v.camera);
      const isVisibleM = (mp.z > 0 && mp.z < 1);
      const mScreenX = ((mp.x * 0.5 + 0.5) * vp.w) + vp.x;
      const mScreenY = ((-mp.y * 0.5 + 0.5) * height);
      const mInBounds = (mScreenX >= vp.x + 20 && mScreenX <= vp.x + vp.w - 20 && mScreenY >= 40 && mScreenY <= height - 40);

      if (isVisibleM && mInBounds && l.metricOpacity > 0.05) {
        l.metricEl.style.display = "";
        l.metricEl.style.opacity = l.metricOpacity;
        l.metricEl.style.left = `${mScreenX}px`;
        l.metricEl.style.top = `${mScreenY}px`;
      } else {
        l.metricEl.style.display = "none";
      }
    }
  });
}

// -------------------------------------------------------------
// 相机运镜与组件聚焦
// -------------------------------------------------------------

let inspectorStepInterval = null;
function showComponentInspector(node, side) {
  const data = modulePrinciples[node.id];
  if (!data) return;

  const inspector = $("#component-inspector");
  inspector.classList.remove("theme-lecun", "theme-feifei", "inspector-left", "inspector-right");
  inspector.classList.add(side === 0 ? "theme-lecun" : "theme-feifei");

  // 点击左侧模块(side 0)时，介绍卡片停靠在右侧；点击右侧模块(side 1)时，介绍卡片转移停靠在左侧
  if (side === 0) {
    inspector.classList.add("inspector-right");
    inspector.style.left = "auto";
    inspector.style.right = "20px";
  } else {
    inspector.classList.add("inspector-left");
    inspector.style.left = "20px";
    inspector.style.right = "auto";
  }

  $("#inspector-tag").textContent = side === 0 ? "Yann LeCun · AMI / H-JEPA" : "李飞飞团队 · World Labs Atlas";
  $("#inspector-tag").className = `tag ${side === 0 ? "tag-lecun" : "tag-feifei"}`;
  $("#inspector-part").textContent = data.part;
  $("#inspector-title").textContent = data.title;
  $("#inspector-sub").textContent = data.sub;

  const stepsEl = $("#inspector-steps");
  stepsEl.innerHTML = data.steps.map((st, i) => `
    <div class="step-item ${i === 0 ? "active-step" : ""}" data-step="${i}">
      <span class="step-num">0${i + 1}</span>
      <span>${st}</span>
    </div>
  `).join("");

  // 动态高亮步骤轮播 (实时推演流动感)
  clearInterval(inspectorStepInterval);
  let currentStep = 0;
  inspectorStepInterval = setInterval(() => {
    currentStep = (currentStep + 1) % data.steps.length;
    const items = stepsEl.querySelectorAll(".step-item");
    items.forEach((it, idx) => {
      it.classList.toggle("active-step", idx === currentStep);
    });
  }, 2200);

  $("#inspector-desc").textContent = data.desc;
  $("#inspector-math").textContent = data.math;
  $("#inspector-contrast").textContent = data.contrast;
  $("#inspector-cue").textContent = data.cue;

  inspector.hidden = false;
}

function home(animate = true) {
  if (state.hallucinationMode) {
    state.hallucinationMode = false;
    const btn = $("#hallucination-toggle");
    if (btn) btn.classList.remove("active");
    const banner = $("#hallucination-banner");
    if (banner) banner.hidden = true;
    views.forEach(v => {
      if (v.expRig) v.expRig.group.visible = false;
    });
  }
  state.selected = null;
  views.forEach(v => { v.selected = null; });
  $("#selection").hidden = true;
  $("#component-inspector").hidden = true;
  clearInterval(inspectorStepInterval);
  if (!story.active) {
    $("#explore-controls").hidden = false;
    $("#story-panel").hidden = true;
  }
  const d = 26;
  views.forEach((v, i) => {
    const target = new THREE.Vector3(i === 0 ? -3.5 : 4.0, 7.5, 0);
    const pos = target.clone().add(new THREE.Vector3(0, 1.2, d));
    if (!animate) {
      v.controls.target.copy(target);
      v.camera.position.copy(pos);
      v.controls.update();
    } else {
      transition = {
        time: performance.now(),
        starts: views.map(view => ({ p: view.camera.position.clone(), t: view.controls.target.clone() })),
        targets: views.map((_, idx) => new THREE.Vector3(idx === 0 ? -3.5 : 4.0, 7.5, 0)),
        offsets: views.map(() => new THREE.Vector3(0, 1.2, d))
      };
    }
  });
}

function focusComponent(v, n, animate = true) {
  if (story.active) stopStory();
  if (state.hallucinationMode) toggleHallucinationMode(false);
  state.selected = n;
  $("#selection-name").textContent = `${v.side === 0 ? "LeCun H-JEPA" : "李飞飞 Atlas"} · ${n.label}`;
  $("#selection").hidden = false;

  const target = new THREE.Vector3(n.x, n.y, n.z);
  const offset = new THREE.Vector3(0, 0.7, 12.5);

  const otherSide = 1 - v.side;

  // 仅在被点击的这一侧激活选中下钻；对侧模块不选中、不展开、不动
  views[v.side].selected = n;
  views[otherSide].selected = null;

  const targets = [];
  const offsets = [];

  targets[v.side] = target;
  offsets[v.side] = offset;

  // 对侧视角保持全景概览视角，不跟进拉近
  const overviewTarget = new THREE.Vector3(otherSide === 0 ? -3.5 : 4.0, 7.5, 0);
  const overviewOffset = new THREE.Vector3(0, 1.2, 26);
  targets[otherSide] = overviewTarget;
  offsets[otherSide] = overviewOffset;

  transition = {
    time: performance.now(),
    starts: views.map(view => ({ p: view.camera.position.clone(), t: view.controls.target.clone() })),
    targets,
    offsets
  };

  // 探索模式下聚焦模块时隐藏下方控制与导览栏，保持纯净视野
  $("#explore-controls").hidden = true;
  $("#story-panel").hidden = true;

  // 自动弹出运作原理深度解析窗口（在对侧展示详细介绍）
  showComponentInspector(n, v.side);
}

function selectAt(v, clientX, clientY) {
  const r = wrap.getBoundingClientRect();
  const vp = viewport(v);
  const ray = new THREE.Raycaster();
  ray.setFromCamera(
    {
      x: ((clientX - r.left - vp.x) / vp.w) * 2 - 1,
      y: -((clientY - r.top) / height) * 2 + 1
    },
    v.camera
  );

  const intersects = ray.intersectObjects(v.world.children, true);
  for (const hit of intersects) {
    let o = hit.object;
    while (o && !o.userData.componentId) o = o.parent;
    if (o && o.userData.componentId) {
      const node = v.nodes.find(n => n.id === o.userData.componentId);
      if (node) {
        focusComponent(v, node);
        return;
      }
    }
  }

  // 点击空白区域退出下钻，返回全景
  if (state.selected) {
    home();
  }
}

// -------------------------------------------------------------
// 剧情模式与实验模式
// -------------------------------------------------------------
function startStory() {
  if (state.hallucinationMode) toggleHallucinationMode(false);
  story.active = true;
  for (const v of views) {
    v.controls.enabled = false;
    v.surface.style.pointerEvents = "none";
  }
  document.body.classList.add("is-story");
  $("#explore-controls").hidden = true;
  $("#story-panel").hidden = false;
  $("#story-toggle").setAttribute("aria-pressed", "true");
  $("#story-toggle-label").textContent = "探索模式";
  $("#story-duration").hidden = true;

  story.clock.seek(0, performance.now());
  story.clock.play(performance.now());
  applyStoryCue(storyPosition(0));
  updateStoryTransport();
}

function stopStory() {
  story.clock.pause(performance.now());
  story.active = false;
  story.activeTargets = [null, null];
  story.isOverview = true;
  for (const v of views) {
    v.controls.enabled = true;
    v.surface.style.pointerEvents = "";
    updateStoryFocus(v);
  }
  document.body.classList.remove("is-story");
  $("#story-panel").hidden = true;
  $("#explore-controls").hidden = false;
  $("#story-toggle").setAttribute("aria-pressed", "false");
  $("#story-toggle-label").textContent = "60秒导览剧情";
  $("#story-duration").hidden = false;
  home();
}

function pauseStory() {
  story.clock.pause(performance.now());
  updateStoryTransport();
}

function toggleStoryPlayback() {
  if (story.clock.playing) {
    pauseStory();
  } else {
    if (story.clock.time >= storyDuration) {
      story.clock.seek(0, performance.now());
    }
    story.clock.play(performance.now());
    updateStoryTransport();
  }
}

function applyStoryCue(pos) {
  const { cue, chapter } = pos;
  story.activeTargets = cue.targets || [null, null];
  story.isOverview = !!cue.overview;

  $("#story-kicker").textContent = cue.kicker ?? `第 ${pos.index + 1} 章 · ${chapter.name}`;
  $("#story-title").textContent = cue.title ?? chapter.title;
  $("#story-caption").textContent = cue.caption;

  views.forEach(v => updateStoryFocus(v));

  if (cue.overview) {
    home(true);
  } else if (cue.targets) {
    const n0 = views[0].nodes.find(n => n.id === cue.targets[0]);
    const n1 = views[1].nodes.find(n => n.id === cue.targets[1]);
    const targets = [
      n0 ? new THREE.Vector3(n0.x, n0.y - 0.45, n0.z) : new THREE.Vector3(-3.5, 7.5, 0),
      n1 ? new THREE.Vector3(n1.x, n1.y - 0.45, n1.z) : new THREE.Vector3(4.0, 7.5, 0)
    ];
    const offset = new THREE.Vector3(0, 0.7, 12.5);
    transition = {
      time: performance.now(),
      starts: views.map(view => ({ p: view.camera.position.clone(), t: view.controls.target.clone() })),
      targets,
      offsets: [offset, offset]
    };
  }
}

function updateStoryTransport(pos = storyPosition(story.clock.time)) {
  const playBtn = $("#story-play");
  playBtn.innerHTML = story.clock.playing
    ? `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
    : `<svg class="icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

  const seconds = Math.floor(pos.time);
  $("#story-time").textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} / 1:15`;

  story.chapterButtons.forEach((btn, i) => {
    const c = chapters[i];
    const progress = Math.max(0, Math.min(1, (pos.time - c.start) / c.duration));
    btn.style.setProperty("--progress", progress);
    if (i === pos.index) btn.setAttribute("aria-current", "step");
    else btn.removeAttribute("aria-current");
  });
}

// -------------------------------------------------------------
// 物理幻觉对抗实验系统 (Physics Benchmark Arena)
// -------------------------------------------------------------
const expState = {
  active: false,
  testType: "permanence", // 'permanence' | 'collision'
  paradigm: "wm",         // 'wm' | '2d'
  startTime: performance.now()
};

function createExperimentRig(v) {
  const group = new THREE.Group();
  group.position.set(v.side === 0 ? -3.5 : 4.0, 1.8, 3.8);
  group.visible = false;
  v.scene.add(group);

  // 1. 高精实验台底座 (Stage Base)
  const floorGeo = new THREE.BoxGeometry(6.6, 0.16, 3.6);
  const floorMat = new THREE.MeshStandardMaterial({
    color: v.side === 0 ? 0x22130e : 0x091b26,
    metalness: 0.85,
    roughness: 0.25,
    transparent: true,
    opacity: 0.92
  });
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.y = 0;
  group.add(floorMesh);

  // 荧光边缘轮廓线
  const edgeGeo = new THREE.EdgesGeometry(floorGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: v.side === 0 ? palette.lecunViolet : palette.feifeiCyan,
    transparent: true,
    opacity: 0.85
  });
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
  floorMesh.add(edgeLines);

  // 实验台表面坐标网格
  const gridHelper = new THREE.GridHelper(6.0, 12, v.side === 0 ? 0xffb300 : 0x00f2fe, 0x1f3448);
  gridHelper.position.y = 0.085;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.55;
  group.add(gridHelper);

  // 2. 挡板障碍物 (Test 1: 遮挡持久性测试专用)
  const obstacleGroup = new THREE.Group();
  obstacleGroup.position.set(0, 1.15, 0);

  const obsGeo = new THREE.BoxGeometry(1.5, 2.3, 0.28);
  const obsMat = new THREE.MeshStandardMaterial({
    color: 0x181e26,
    metalness: 0.9,
    roughness: 0.15,
    transparent: true,
    opacity: 0.92
  });
  const obsMesh = new THREE.Mesh(obsGeo, obsMat);
  obstacleGroup.add(obsMesh);

  const obsEdge = new THREE.LineSegments(
    new THREE.EdgesGeometry(obsGeo),
    new THREE.LineBasicMaterial({
      color: v.side === 0 ? 0xffb300 : 0x00f2fe,
      transparent: true,
      opacity: 0.9
    })
  );
  obstacleGroup.add(obsEdge);

  const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.3), new THREE.MeshBasicMaterial({ color: 0x445566 }));
  p1.position.x = -0.76;
  const p2 = p1.clone();
  p2.position.x = 0.76;
  obstacleGroup.add(p1, p2);
  group.add(obstacleGroup);

  // 3. 重力碰撞靶盘 (Test 2: 刚体碰撞测试专用)
  const padGroup = new THREE.Group();
  padGroup.position.set(0, 0.09, 0);
  const padMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.92, 0.06, 32),
    new THREE.MeshStandardMaterial({ color: 0x1a2634, metalness: 0.8, roughness: 0.3 })
  );
  padGroup.add(padMesh);

  const padRing = new THREE.Mesh(
    new THREE.RingGeometry(0.55, 0.78, 32),
    new THREE.MeshBasicMaterial({
      color: v.side === 0 ? 0xffb300 : 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    })
  );
  padRing.rotation.x = -Math.PI / 2;
  padRing.position.y = 0.035;
  padGroup.add(padRing);
  group.add(padGroup);

  // 4. 测试物理实体球 (Test Ball)
  const ballGroup = new THREE.Group();
  const ballGeo = new THREE.SphereGeometry(0.32, 32, 32);
  const ballMat = new THREE.MeshStandardMaterial({
    color: v.side === 0 ? 0xffaa00 : 0x00e5ff,
    emissive: v.side === 0 ? 0x663300 : 0x005577,
    roughness: 0.2,
    metalness: 0.8
  });
  const ballMesh = new THREE.Mesh(ballGeo, ballMat);
  ballGroup.add(ballMesh);

  let orbitRing = null;
  if (v.side === 0) {
    orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.022, 16, 48),
      new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.85 })
    );
    ballGroup.add(orbitRing);
  } else {
    const bBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.72, 0.72, 0.72)),
      new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.7 })
    );
    ballGroup.add(bBox);
  }
  group.add(ballGroup);

  // 5. 地面能量冲击波环 (Test 2 弹性反弹时触发)
  const shockwaveGeo = new THREE.RingGeometry(0.08, 0.22, 32);
  const shockwaveMat = new THREE.MeshBasicMaterial({
    color: 0x38ef7d,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0
  });
  const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
  shockwave.rotation.x = -Math.PI / 2;
  shockwave.position.y = 0.1;
  group.add(shockwave);

  // 地下穿模故障报警红环 (2D 穿透底板时触发)
  const breachRingGeo = new THREE.RingGeometry(0.12, 0.28, 32);
  const breachRingMat = new THREE.MeshBasicMaterial({
    color: 0xff3366,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0
  });
  const breachRing = new THREE.Mesh(breachRingGeo, breachRingMat);
  breachRing.rotation.x = -Math.PI / 2;
  breachRing.position.y = -0.5;
  group.add(breachRing);

  // 6. 2D 物理幻觉故障闪烁线框 (Glitch Mesh)
  const glitchGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
  const glitchMat = new THREE.LineBasicMaterial({
    color: 0xff3366,
    transparent: true,
    opacity: 0
  });
  const glitchMesh = new THREE.LineSegments(new THREE.EdgesGeometry(glitchGeo), glitchMat);
  group.add(glitchMesh);

  // 7. 潜空间连续外推轨迹线 (LeCun Test 1 穿透障碍物)
  const latentLineMat = new THREE.LineDashedMaterial({
    color: 0xffaa00,
    dashSize: 0.14,
    gapSize: 0.08,
    transparent: true,
    opacity: 0.95
  });
  const latentLineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.6, 0.5, 0),
    new THREE.Vector3(2.6, 0.5, 0)
  ]);
  const latentLine = new THREE.Line(latentLineGeo, latentLineMat);
  latentLine.computeLineDistances();
  latentLine.position.y = 0;
  group.add(latentLine);

  // 8. 3D 浮空遥测看板 (Billboard)
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  const billboardTex = new THREE.CanvasTexture(canvas);
  const billboardMat = new THREE.SpriteMaterial({ map: billboardTex, transparent: true });
  const billboard = new THREE.Sprite(billboardMat);
  billboard.scale.set(2.6, 0.65, 1);
  billboard.position.set(0, 2.8, 0);
  group.add(billboard);

  return {
    group,
    floorMesh,
    obstacleGroup,
    padGroup,
    ballGroup,
    ballMesh,
    orbitRing,
    shockwave,
    breachRing,
    glitchMesh,
    latentLine,
    billboard,
    canvas,
    ctx,
    billboardTex,
    lastStatusText: "",
    lastStatusColor: ""
  };
}

function updateBillboard(rig, text, color) {
  if (rig.lastStatusText === text && rig.lastStatusColor === color) return;
  rig.lastStatusText = text;
  rig.lastStatusColor = color;
  const { ctx, canvas, billboardTex } = rig;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(10, 16, 24, 0.88)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;

  const r = 24;
  const x = 12, y = 12, w = canvas.width - 24, h = canvas.height - 24;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  billboardTex.needsUpdate = true;
}

function tickExperimentRig(v, rig, now) {
  if (!state.hallucinationMode || !rig.group.visible) return;

  const is2D = (expState.paradigm === "2d");
  const isPermanence = (expState.testType === "permanence");

  rig.obstacleGroup.visible = isPermanence;
  rig.padGroup.visible = !isPermanence;
  rig.latentLine.visible = isPermanence && !is2D && (v.side === 0);

  if (rig.orbitRing) {
    rig.orbitRing.rotation.x += 0.03;
    rig.orbitRing.rotation.y += 0.04;
  }

  const elapsed = (now - expState.startTime) / 1000;

  if (isPermanence) {
    const period = 4.0;
    const cycle = (elapsed % period) / period;
    const x = 2.4 * Math.sin(cycle * Math.PI * 2);
    const inOcclusion = Math.abs(x) < 0.85;

    rig.ballGroup.position.set(x, 0.5, 0);

    if (is2D) {
      if (inOcclusion) {
        const jitter = (Math.random() - 0.5) * 0.15;
        rig.ballGroup.position.x = x + jitter;
        rig.ballGroup.position.y = 0.5 + jitter;

        const dissolve = Math.max(0, 1.0 - (0.85 - Math.abs(x)) / 0.4);
        rig.ballMesh.scale.setScalar(Math.max(0.01, dissolve));
        rig.ballMesh.material.opacity = dissolve;
        rig.ballMesh.material.transparent = true;

        rig.glitchMesh.position.set(x, 0.5, 0);
        rig.glitchMesh.material.opacity = 0.8 + Math.random() * 0.2;
        rig.glitchMesh.scale.setScalar(0.7 + (Math.random() - 0.5) * 0.3);

        updateBillboard(rig, "⚠ 2D 去噪崩溃：特征遮挡丢失", "#ff4757");
      } else {
        const cycleProgress = cycle % 1.0;
        if (cycleProgress > 0.25 && cycleProgress < 0.75) {
          rig.ballMesh.scale.setScalar(0.001);
          rig.glitchMesh.material.opacity = 0;
          updateBillboard(rig, "🔴 物理幻觉：目标永久性丧失 (OBJECT LOST)", "#ff4757");
        } else {
          rig.ballMesh.scale.setScalar(1.0);
          rig.ballMesh.material.opacity = 1.0;
          rig.ballMesh.material.transparent = false;
          rig.glitchMesh.material.opacity = 0;
          updateBillboard(rig, "2D 视频生成：移动进入遮挡区...", "#ffa502");
        }
      }
    } else {
      rig.ballMesh.scale.setScalar(1.0);
      rig.ballMesh.material.opacity = 1.0;
      rig.ballMesh.material.transparent = false;
      rig.glitchMesh.material.opacity = 0;

      if (inOcclusion) {
        if (v.side === 0) {
          updateBillboard(rig, "✓ H-JEPA：潜空间因果动量连续追踪", "#e67e22");
        } else {
          updateBillboard(rig, "✓ Atlas：显式 3D 欧氏坐标刚性锚定", "#00f2fe");
        }
      } else {
        if (v.side === 0) {
          updateBillboard(rig, "LeCun H-JEPA：自监督表征平移不变性", "#e67e22");
        } else {
          updateBillboard(rig, "World Labs Atlas：空间智能三维连续性", "#00f2fe");
        }
      }
    }

    rig.shockwave.material.opacity = 0;
    rig.breachRing.material.opacity = 0;

  } else {
    const period = 3.2;
    const t = elapsed % period;
    rig.ballGroup.position.x = 0;
    rig.ballGroup.position.z = 0;

    if (is2D) {
      const dropY = 4.2 - (t / 2.2) * 6.4;
      rig.ballGroup.position.y = dropY;
      rig.ballMesh.scale.set(1.0, 1.0, 1.0);
      rig.ballMesh.material.opacity = 1.0;

      if (dropY <= 0.35) {
        rig.glitchMesh.position.set(0, dropY, 0);
        rig.glitchMesh.material.opacity = 0.85;
        rig.glitchMesh.scale.setScalar(0.85);

        rig.breachRing.position.y = -0.1;
        rig.breachRing.scale.setScalar(1.0 + (t * 2.0) % 3.0);
        rig.breachRing.material.opacity = Math.max(0, 0.8 - ((t * 2.0) % 3.0) * 0.25);

        rig.shockwave.material.opacity = 0;
        updateBillboard(rig, "🔴 物理幻觉：刚体穿模崩塌 (COLLISION FAILED)", "#ff4757");
      } else {
        rig.glitchMesh.material.opacity = 0;
        rig.breachRing.material.opacity = 0;
        updateBillboard(rig, "2D 视频生成：自由落体接近接触面...", "#ffa502");
      }
    } else {
      rig.breachRing.material.opacity = 0;
      rig.glitchMesh.material.opacity = 0;

      let y = 0.40;
      let scaleY = 1.0;
      let scaleXZ = 1.0;
      let timeSinceImpact = 999;

      if (t < 0.90) {
        const p = t / 0.90;
        y = 0.40 + 3.8 * (1 - p * p);
        timeSinceImpact = 999;
      } else if (t < 2.00) {
        const localT = t - 0.90;
        const dur = 1.10;
        const p = localT / dur;
        y = 0.40 + 2.0 * Math.sin(p * Math.PI);
        timeSinceImpact = localT;
      } else if (t < 2.75) {
        const localT = t - 2.00;
        const dur = 0.75;
        const p = localT / dur;
        y = 0.40 + 0.9 * Math.sin(p * Math.PI);
        timeSinceImpact = localT;
      } else {
        y = 0.40;
        timeSinceImpact = t - 2.75;
      }

      if (y < 0.55 && timeSinceImpact < 0.12) {
        scaleY = 0.65;
        scaleXZ = 1.25;
      } else {
        scaleY = 1.0;
        scaleXZ = 1.0;
      }

      rig.ballGroup.position.y = y;
      rig.ballMesh.scale.set(scaleXZ, scaleY, scaleXZ);

      if (timeSinceImpact < 0.45) {
        const swProgress = timeSinceImpact / 0.45;
        rig.shockwave.scale.setScalar(1.0 + swProgress * 5.5);
        rig.shockwave.material.opacity = Math.max(0, 0.9 * (1.0 - swProgress));
      } else {
        rig.shockwave.material.opacity = 0;
      }

      if (v.side === 0) {
        updateBillboard(rig, "✓ H-JEPA：能量势能壁垒阻止虚空穿透", "#e67e22");
      } else {
        updateBillboard(rig, "✓ Atlas：SDF 符号距离场与刚体动量守恒", "#00f2fe");
      }
    }
  }
}

function updateExpUI() {
  const is2D = (expState.paradigm === "2d");
  const isPermanence = (expState.testType === "permanence");

  const tabPerm = $("#exp-tab-permanence");
  const tabColl = $("#exp-tab-collision");
  if (tabPerm) tabPerm.classList.toggle("active", isPermanence);
  if (tabColl) tabColl.classList.toggle("active", !isPermanence);

  const btn2D = $("#btn-paradigm-2d");
  const btnWM = $("#btn-paradigm-wm");
  if (btn2D) btn2D.classList.toggle("active", is2D);
  if (btnWM) btnWM.classList.toggle("active", !is2D);

  const titleEl = $("#exp-current-title");
  if (titleEl) {
    titleEl.textContent = isPermanence
      ? "物体遮挡持久性测试 (Object Permanence Test)"
      : "刚体碰撞与重力穿模测试 (Collision & Penetration Test)";
  }

  const stat2D = $("#exp-stat-2d");
  const statLeCun = $("#exp-stat-lecun");
  const statFeiFei = $("#exp-stat-feifei");

  if (isPermanence) {
    if (is2D) {
      if (stat2D) stat2D.textContent = "🔴【严重物理幻觉】缺乏 3D 几何常识，物体移入挡板后特征在像素去噪中崩溃，移出后永久丢失！";
      if (statLeCun) statLeCun.textContent = "[对标差异] 2D 扩散在像素空间做无约束猜测；而 H-JEPA 在抽象空间预测因果状态向量，动量无损。";
      if (statFeiFei) statFeiFei.textContent = "[对标差异] 2D 帧间注意力无法维持跨时间 3D 一致性；而 Atlas 拥有欧氏坐标高斯点云，遮挡不改变空间存在。";
    } else {
      if (stat2D) stat2D.textContent = "[待机对比] 点击上方「传统 2D 视频生成」按钮，可观察缺乏 3D 几何约束导致的物体消失幻觉。";
      if (statLeCun) statLeCun.textContent = "✓【隐空间因果守恒】潜向量 s_{t+1} 沿测地线外推，不依赖像素重建，在遮挡中持续追踪实体动量。";
      if (statFeiFei) statFeiFei.textContent = "✓【显式 3DGS 锚定】1200+ 3D 高斯体欧氏空间三维坐标永久固化，视锥几何遮挡绝不改变物体存在性。";
    }
  } else {
    if (is2D) {
      if (stat2D) stat2D.textContent = "🔴【严重物理幻觉】2D 模型不理解物体的不可穿透性与法向量碰撞，小球像幽灵一样穿透坚硬底板坠入虚空！";
      if (statLeCun) statLeCun.textContent = "[对标差异] 2D 生成无动力学世界模型，无法判定不可穿透性；JEPA 分层能量函数天然惩罚负空间穿模。";
      if (statFeiFei) statFeiFei.textContent = "[对标差异] 2D 像素插值导致实体虚空化；Atlas 具有明确的几何表面法线与 SDF 刚体动力学模拟。";
    } else {
      if (stat2D) stat2D.textContent = "[待机对比] 点击上方「传统 2D 视频生成」按钮，可观察缺乏刚体物理体积判定导致的穿模崩溃。";
      if (statLeCun) statLeCun.textContent = "✓【能量势能惩罚】接触面能量势能 E(x, y) 突增，非线性逆动力学约束阻止小球穿入底板负空间。";
      if (statFeiFei) statFeiFei.textContent = "✓【刚体碰撞与 SDF 弹性反弹】显式 3D 高斯点云计算接触法向量与恢复系数 (e=0.72)，激发出能量冲击波。";
    }
  }
}

function toggleHallucinationMode(forceState) {
  state.hallucinationMode = (typeof forceState === "boolean") ? forceState : !state.hallucinationMode;
  const btn = $("#hallucination-toggle");
  const banner = $("#hallucination-banner");

  if (btn) btn.classList.toggle("active", state.hallucinationMode);
  if (banner) banner.hidden = !state.hallucinationMode;

  views.forEach(v => {
    if (v.expRig) {
      v.expRig.group.visible = state.hallucinationMode;
    }
  });

  if (state.hallucinationMode) {
    if (story.active) stopStory();
    if (state.selected) {
      state.selected = null;
      views.forEach(v => { v.selected = null; });
      $("#selection").hidden = true;
      $("#component-inspector").hidden = true;
      clearInterval(inspectorStepInterval);
    }
    expState.startTime = performance.now();
    updateExpUI();

    const offset = new THREE.Vector3(0, 0.8, 9.8);
    transition = {
      time: performance.now(),
      starts: views.map(view => ({ p: view.camera.position.clone(), t: view.controls.target.clone() })),
      targets: [
        new THREE.Vector3(-3.5, 1.8, 3.8),
        new THREE.Vector3(4.0, 1.8, 3.8)
      ],
      offsets: [offset, offset]
    };
  } else {
    home();
  }
}

// -------------------------------------------------------------
// 事件监听
// -------------------------------------------------------------
function resize() {
  width = wrap.clientWidth;
  height = wrap.clientHeight;
  renderer.setSize(width, height, false);

  for (const v of views) {
    const r = viewport(v);
    v.surface.style.left = `${r.x}px`;
    v.surface.style.width = `${r.w}px`;
    v.surface.style.display = r.show ? "" : "none";
    v.camera.aspect = r.w / height;
    v.camera.updateProjectionMatrix();
  }

  $$("[data-era]").forEach(btn => {
    btn.classList.toggle("active", +btn.dataset.era === state.era);
  });
}

new ResizeObserver(resize).observe(wrap);

$("#play").onclick = () => {
  state.playing = !state.playing;
  $("#play").innerHTML = state.playing
    ? `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
    : `<svg class="icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
};

$("#pace").onchange = e => {
  state.pace = parseFloat(e.target.value);
};

$("#context-slider").oninput = e => {
  state.steps = parseInt(e.target.value);
  $("#context-value").textContent = `T = ${state.steps} 步展开`;
  rebuildActorRollouts(state.steps);
  rebuildSpatialAnchors(state.steps);
};

$("#home").onclick = $("#selection").onclick = () => {
  if (story.active) stopStory();
  home();
};

$("#close-inspector").onclick = () => {
  home();
};

$("#sources").onclick = () => {
  $("#source-dialog").showModal();
};
$("#close-sources").onclick = () => {
  $("#source-dialog").close();
};

$("#hallucination-toggle").onclick = toggleHallucinationMode;
const expCloseBtn = $("#exp-close");
if (expCloseBtn) expCloseBtn.onclick = () => toggleHallucinationMode(false);
const tabPerm = $("#exp-tab-permanence");
if (tabPerm) tabPerm.onclick = () => {
  expState.testType = "permanence";
  expState.startTime = performance.now();
  updateExpUI();
};
const tabColl = $("#exp-tab-collision");
if (tabColl) tabColl.onclick = () => {
  expState.testType = "collision";
  expState.startTime = performance.now();
  updateExpUI();
};
const btn2D = $("#btn-paradigm-2d");
if (btn2D) btn2D.onclick = () => {
  expState.paradigm = "2d";
  expState.startTime = performance.now();
  updateExpUI();
};
const btnWM = $("#btn-paradigm-wm");
if (btnWM) btnWM.onclick = () => {
  expState.paradigm = "wm";
  expState.startTime = performance.now();
  updateExpUI();
};
const btnRestart = $("#btn-exp-restart");
if (btnRestart) btnRestart.onclick = () => {
  expState.startTime = performance.now();
};

$("#story-toggle").onclick = () => {
  if (story.active) stopStory();
  else startStory();
};
$("#story-play").onclick = toggleStoryPlayback;
$("#story-exit").onclick = stopStory;
$("#story-previous").onclick = () => {
  const pos = storyPosition(story.clock.time);
  const targetTime = pos.local > 2 ? pos.chapter.start : (chapters[Math.max(0, pos.index - 1)]?.start ?? 0);
  story.clock.seek(targetTime, performance.now());
  applyStoryCue(storyPosition(targetTime));
  updateStoryTransport();
};
$("#story-next").onclick = () => {
  const pos = storyPosition(story.clock.time);
  const nextCh = chapters[pos.index + 1];
  if (nextCh) {
    story.clock.seek(nextCh.start, performance.now());
    applyStoryCue(storyPosition(nextCh.start));
    updateStoryTransport();
  } else {
    stopStory();
  }
};

story.chapterButtons = chapters.map((c, i) => {
  const btn = document.createElement("button");
  btn.title = c.name;
  btn.onclick = () => {
    story.clock.seek(c.start, performance.now());
    applyStoryCue(storyPosition(c.start));
    updateStoryTransport();
  };
  $("#story-chapters").appendChild(btn);
  return btn;
});

$$("[data-era]").forEach(btn => {
  btn.onclick = () => {
    state.era = +btn.dataset.era;
    resize();
  };
});


document.addEventListener("keydown", e => {
  if ($("#source-dialog").open) return;
  if (e.key === "Escape") {
    if (story.active) stopStory();
    else home();
    return;
  }
  if (story.active) {
    if (e.code === "Space") {
      e.preventDefault();
      toggleStoryPlayback();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const pos = storyPosition(story.clock.time);
      const nextCh = chapters[pos.index + 1];
      if (nextCh) {
        story.clock.seek(nextCh.start, performance.now());
        applyStoryCue(storyPosition(nextCh.start));
        updateStoryTransport();
      } else {
        stopStory();
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const pos = storyPosition(story.clock.time);
      const targetTime = pos.local > 2 ? pos.chapter.start : (chapters[Math.max(0, pos.index - 1)]?.start ?? 0);
      story.clock.seek(targetTime, performance.now());
      applyStoryCue(storyPosition(targetTime));
      updateStoryTransport();
    }
  } else {
    if (e.code === "Space" && document.activeElement.tagName !== "BUTTON") {
      e.preventDefault();
      state.playing = !state.playing;
      $("#play").innerHTML = state.playing
        ? `<svg class="icon" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
        : `<svg class="icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
    }
  }
});

function init() {
  buildLeCunArchitecture(views[0]);
  buildFeiFeiArchitecture(views[1]);

  views.forEach(v => {
    buildFlowParticles(v);
    buildLabels(v);
    v.expRig = createExperimentRig(v);
  });

  $("#source-content").innerHTML = sourceHTML;
  state.ready = true;
  $("#loading").style.opacity = "0";
  setTimeout(() => $("#loading").remove(), 300);

  resize();
  home(false);
}

init();

// 主循环
let lastTime = performance.now();
function animate(now) {
  const dt = Math.min(0.08, (now - lastTime) / 1000);
  lastTime = now;

  if (state.playing || story.active) {
    state.time += dt * state.pace;
  }

  const t = state.time;

  // 1. 动态梯度下山小球运算 (Gradient Descent Animation)
  if (gradientBall && gradientTrail) {
    const cycle = (t * 0.8) % 4.0;
    const decay = Math.exp(-cycle * 0.9);
    const theta = cycle * 8.0;
    const bx = Math.cos(theta) * 0.9 * decay;
    const by = Math.sin(theta) * 0.65 * decay;
    const bz = 0.35 * (bx * bx + by * by) + 0.12;
    gradientBall.position.set(bx, by, bz);

    if (cycle < 0.1) {
      gradientTrailPoints.length = 0;
    }
    gradientTrailPoints.push(new THREE.Vector3(bx, by, bz));
    if (gradientTrailPoints.length > 40) gradientTrailPoints.shift();
    gradientTrail.geometry.setFromPoints(gradientTrailPoints);
  }

  // 2. 3DGS 高斯辐射云团自旋与呼吸微颤动
  if (gaussianSplatsMesh) {
    gaussianSplatsMesh.rotation.y = t * 0.18;
    const scalePulse = 1.0 + 0.04 * Math.sin(t * 3.0);
    gaussianSplatsMesh.scale.set(scalePulse, scalePulse, scalePulse);
  }

  // 3. Rectified Flow 直线流匹配向量场脉冲
  if (rectifiedFlowVectors.length > 0) {
    rectifiedFlowVectors.forEach((vec, idx) => {
      const p = ((t * 1.5 + idx * 0.15) % 1.0);
      const curZ = THREE.MathUtils.lerp(vec.start.z, vec.end.z, p);
      vec.head.position.set(vec.u, vec.vRow, curZ);
    });
  }

  // 4. 剧情导览更新
  if (story.active) {
    const pos = story.clock.tick(now, !document.hidden);
    const currentKey = `${pos.index}:${pos.cueIndex}`;
    if (story.cueKey !== currentKey) {
      story.cueKey = currentKey;
      applyStoryCue(pos);
    }
    updateStoryTransport(pos);
    if (pos.complete) stopStory();
  }

  // 相机插值
  if (transition) {
    const prog = Math.min(1, (now - transition.time) / 1000);
    const ease = prog * prog * (3 - 2 * prog);
    syncing = true;
    views.forEach((v, i) => {
      v.controls.target.lerpVectors(transition.starts[i].t, transition.targets[i], ease);
      v.camera.position.lerpVectors(transition.starts[i].p, transition.targets[i].clone().add(transition.offsets[i]), ease);
      v.controls.update();
    });
    syncing = false;
    if (prog === 1) transition = null;
  }

  // 渲染两个视口
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);

  views.forEach(v => {
    const vp = viewport(v);
    if (!vp.show) return;

    if (!story.active && !transition) {
      v.controls.update();
    }

    // 运行每个组件的 3D 弹出和消隐动画
    v.components.forEach(comp => tickInterior(v, comp));

    // 运行物理幻觉对抗实验模拟台
    if (v.expRig) {
      tickExperimentRig(v, v.expRig, now);
    }

    updateFlowParticles(v);

    renderer.setViewport(vp.x, 0, vp.w, height);
    renderer.setScissor(vp.x, 0, vp.w, height);
    renderer.render(v.scene, v.camera);
  });

  renderer.setScissorTest(false);
  updateLabels();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);