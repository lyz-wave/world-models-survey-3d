export const chapters = [
  {
    id: "philosophy",
    name: "哲学分野",
    title: "世界模型的核心哲学分野",
    duration: 12,
    cues: [
      {
        at: 0,
        overview: true,
        targets: [null, null],
        kicker: "第 1 章 · 核心哲学分野",
        title: "非生成式潜表征 vs 显式三维生成",
        caption: "LeCun 坚信世界模型绝不应生成无谓的像素，而在抽象隐空间中推演因果；李飞飞团队则认为智能的核心在于三维物理空间的几何接地与高保真交互仿真。"
      },
      {
        at: 6,
        targets: ["world_model_predictor", "gaussian_splatting"],
        title: "隐空间转移矩阵 vs 显式三维物理场",
        caption: "左侧 JEPA 在隐空间推演下一状态 s_{t+1}；右侧 Atlas 输出具象且可物理漫游的 3D 高斯辐射场与连续视频。"
      }
    ]
  },
  {
    id: "representation",
    name: "感知表征",
    title: "输入与表征：特征向量 vs 3DGS 空间场",
    duration: 12,
    cues: [
      {
        at: 0,
        targets: ["sensor_perception", "spatial_input"],
        kicker: "第 2 章 · 输入与表征范式",
        title: "抽象多模态编码 vs 空间接地输入",
        caption: "LeCun 的感知编码器提取去除噪声的抽象不变特征；Atlas 将相机 6-DoF 位姿、度量深度图和图像直接输入三维物理坐标系。"
      },
      {
        at: 6,
        targets: ["short_term_memory", "spatial_context"],
        title: "短期工作记忆 vs 欧氏空间上下文",
        caption: "LeCun 采用环形记忆暂存时序潜状态；Atlas 提出颠覆性的“空间上下文”，在真 3D 几何坐标中锚定所有参考视点。"
      }
    ]
  },
  {
    id: "dynamics",
    name: "预测动力学",
    title: "动力学推进：JEPA 预测器 vs 自回归流匹配",
    duration: 14,
    cues: [
      {
        at: 0,
        targets: ["world_model_predictor", "autoregressive_backbone"],
        kicker: "第 3 章 · 动力学推演机制",
        title: "隐空间动力学 vs 因果自回归 Transformer",
        caption: "JEPA 在抽象潜空间应用潜在条件变量 z 进行不确定性推演；Atlas 借鉴 LLM 的自回归因果推进与 KV-Cache 长程缓存。"
      },
      {
        at: 7,
        targets: ["world_model_predictor", "rectified_flow"],
        title: "能量最小化 vs Rectified Flow 流匹配",
        caption: "JEPA 避免像素概率坍缩；Atlas 采用先进的连续流匹配扩散头 (Rectified Flow)，实现直线最优速度场极速去噪。"
      }
    ]
  },
  {
    id: "geometry",
    name: "空间几何",
    title: "空间几何：抗物理幻觉的关键路径",
    duration: 12,
    cues: [
      {
        at: 0,
        targets: ["world_model_predictor", "spatial_context"],
        kicker: "第 4 章 · 空间几何与抗幻觉",
        title: "放弃像素预测 vs 几何一致性约束",
        caption: "LeCun 通过不预测低阶像素，彻底规避视频跳帧、闪烁和穿模；Atlas 依托 3D 几何与多视角一致性，用欧氏几何根治物理幻觉。"
      },
      {
        at: 6,
        targets: ["sensor_perception", "gaussian_splatting"],
        title: "抽象语义不变性 vs 物体持久性 (Permanence)",
        caption: "3D 高斯点云使物体离开视野后依然保持在 3D 空间，完美解决遮挡再现时的物体一致性问题。"
      }
    ]
  },
  {
    id: "action",
    name: "决策交互",
    title: "决策与交互：代价梯度规划 vs 6-DoF 物理闭环",
    duration: 13,
    cues: [
      {
        at: 0,
        targets: ["actor_planner", "neural_renderer_sim"],
        kicker: "第 5 章 · 动作、规划与交互闭环",
        title: "心智轨迹优化 vs 自由视角物理交互",
        caption: "LeCun 的 Actor 在心智中展开多条行动假设；李飞飞的神经渲染器在端侧以 60fps 实时渲染相机自由漫游与外力碰撞。"
      },
      {
        at: 7,
        targets: ["critic_cost", "neural_renderer_sim"],
        title: "能量基代价函数 (Critic) vs 具身环境仿真",
        caption: "Critic 评估未来状态的不适度并反传梯度引导 Actor；Atlas 则作为高精度模拟引擎，为具身智能机器人提供千万倍的试错数据。"
      }
    ]
  },
  {
    id: "vision",
    name: "终极愿景",
    title: "终极图景：自主机器智能 vs 物理世界模拟器",
    duration: 12,
    cues: [
      {
        at: 0,
        overview: true,
        targets: [null, null],
        kicker: "第 6 章 · 终极图景与 AGI 路径",
        title: "通往 AGI 的两条世界模型道路",
        caption: "Yann LeCun 构建能够因果推理与分层常识规划的心智大脑；李飞飞团队构建能够理解三维空间、重构真实世界的物理通用基座。"
      }
    ]
  }
];

let offset = 0;
for (const chapter of chapters) {
  chapter.start = offset;
  offset += chapter.duration;
}
export const duration = offset;
export const cues = chapters.flatMap((chapter, index) =>
  chapter.cues.map((cue, cueIndex) => ({
    ...cue,
    time: chapter.start + cue.at,
    chapterIndex: index,
    cueIndex
  }))
);

export function storyPosition(seconds) {
  const time = Math.max(0, Math.min(duration, seconds));
  const index = chapters.findLastIndex(c => time >= c.start);
  const chapter = chapters[index] || chapters[0];
  const local = Math.min(chapter.duration, time - chapter.start);
  const cueIndex = Math.max(0, chapter.cues.findLastIndex(c => local >= c.at));
  return {
    time,
    index,
    chapter,
    local,
    cueIndex,
    cue: chapter.cues[cueIndex] || chapter.cues[0],
    complete: time >= duration
  };
}

export class StoryClock {
  constructor() {
    this.time = 0;
    this.playing = false;
    this.last = null;
  }
  tick(now, visible = true) {
    if (this.playing && visible && this.last !== null) {
      this.time = Math.min(duration, this.time + Math.max(0, now - this.last) / 1000);
    }
    this.last = now;
    if (this.time >= duration) this.playing = false;
    return storyPosition(this.time);
  }
  play(now) {
    if (this.time >= duration) this.time = 0;
    this.playing = true;
    this.last = now;
  }
  pause(now) {
    this.tick(now);
    this.playing = false;
    this.last = null;
  }
  seek(time, now) {
    this.time = Math.max(0, Math.min(duration, time));
    this.last = now;
    if (this.time >= duration) this.playing = false;
    return storyPosition(this.time);
  }
  resetVisibility() {
    this.last = null;
  }
}