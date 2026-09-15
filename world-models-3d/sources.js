export const sourceHTML = `
  <section>
    <h3>1. 理论奠基与代表文献</h3>
    <table>
      <thead>
        <tr>
          <th>体系</th>
          <th>代表学者与实验室</th>
          <th>权威文献 / 最新发布</th>
          <th>核心范式</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Yann LeCun 体系</strong></td>
          <td>Yann LeCun (Meta FAIR / NYU 柯朗所)</td>
          <td>
            <em>A Path Towards Autonomous Machine Intelligence</em> (2022)<br>
            <em>V-JEPA: Video Joint Embedding Predictive Architecture</em> (Meta 2024)<br>
            <em>H-JEPA: Hierarchical World Models for Multi-Time Scale Planning</em> (2025)
          </td>
          <td><strong>非生成式分层潜空间世界模型 (H-JEPA)</strong><br>拒绝像素重建，在多时间尺度抽象隐空间预测世界因果转移与能量曲面。</td>
        </tr>
        <tr>
          <td><strong>李飞飞 体系</strong></td>
          <td>李飞飞 (Fei-Fei Li)、Justin Johnson、Ben Mildenhall 等 (World Labs / Stanford)</td>
          <td>
            <em>World Labs Atlas Technical Report</em> (2026.09)<br>
            <em>Spatial Intelligence: Foundations & Interactive Worlds</em> (2024)<br>
            <em>WonderWorld: Interactive 3D Scenes</em> (2024)
          </td>
          <td><strong>显式空间智能全能世界模型 (Atlas)</strong><br>基于 3D Gaussian Splats + 自回归 DiT + Rectified Flow 连续流匹配，欧氏 3D 几何锚定。</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section>
    <h3>2. 本系统全新实现的五大硬核技术与物理仿真</h3>
    <table>
      <thead>
        <tr>
          <th>硬核特性</th>
          <th>Yann LeCun: H-JEPA 实现机制</th>
          <th>李飞飞团队: World Labs Atlas 实现机制</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>动态能量寻优 vs 连续流匹配</strong></td>
          <td><strong>实时 3D 能量曲面与梯度下山小球</strong>：动态模拟 Actor 沿着能量坡度 <code>\nabla_a \text{Cost}</code> 滚动寻优动作序列。</td>
          <td><strong>Rectified Flow 向量场</strong>：展示直线 ODE 连续流匹配去噪速度场，对比传统扩散模型弯曲布朗运动的高速最优传输。</td>
        </tr>
        <tr>
          <td><strong>时空动态生长 (Horizon T)</strong></td>
          <td><strong>心智展开树实时分叉</strong>：拖动底部 <code>T</code> 步滑块，Actor 心智展开决策树实时生长二叉/三叉深层分枝。</td>
          <td><strong>无限空间锚点向外蔓延</strong>：随着 <code>T</code> 增加，3DGS 空间上下文锚点阵列向外扩张，展现大尺度无界世界生成。</td>
        </tr>
        <tr>
          <td><strong>抗“物理幻觉”实验</strong></td>
          <td><strong>潜空间因果抗噪</strong>：丢弃像素细节，即便画面出现微观噪声扰动，抽象因果特征依然保持自洽。</td>
          <td><strong>显式 3D 坐标与物体持久性 (Permanence)</strong>：高斯点云锚定欧氏绝对三维坐标，遮挡物移开后三维实体依然存在，从根本杜绝穿模与凭空消失。</td>
        </tr>
        <tr>
          <td><strong>多尺度时间机制</strong></td>
          <td><strong>H-JEPA 分层时钟</strong>：双层时钟环形寄存器，内圈高频 10Hz 微动作推演，外圈低频 1Hz 宏观任务调度。</td>
          <td><strong>自回归因果 KV-Cache</strong>：借力 LLM 的长程 KV 缓存与分布式 Serving，实现跨时间步无衰减的长程物理仿真。</td>
        </tr>
        <tr>
          <td><strong>3D 渲染与世界展现</strong></td>
          <td>非生成式，仅保留高阶语义张量图与状态指标，追求极致推理效率与常识逻辑。</td>
          <td><strong>1200+ 显式 3D 高斯点云 (Additive Blending)</strong>：端侧 60fps 实时自由视角漫游渲染，直接充当机器人仿真器。</td>
        </tr>
      </tbody>
    </table>
  </section>
`;