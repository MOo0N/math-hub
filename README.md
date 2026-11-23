# 数学互动实验室 · MathHub

面向初中数学的交互式课件网站：把定理、公式与几何模型做成可拖动、可调节、可播放的交互演示。

- **在线演示（免登录）**：https://ab27bfee7434d8773.app.workbuddy.host/?sharecode=62JK46YNB7
- **规模**：4 大领域 / 15 个主题 / 62 个交互模型
- **技术**：单文件 HTML、原生 JS + SVG、零外部依赖、零构建工具链

---

## 一、快速开始

```bash
# 1. 修改 src/ 下的任意源文件后，重新构建单文件成品
python3 build.py

# 2. 本地预览
cd dist && python3 -m http.server 8899
# 浏览器打开 http://localhost:8899/index.html
```

构建脚本 `build.py` 会把 `src/` 下的引擎、样式、应用层与所有 `models-*.js` 按固定顺序拼装成 `dist/index.html`。**不要直接编辑 `dist/index.html`**，它是生成物；所有改动应落到 `src/`。

---

## 二、目录结构

| 文件 | 职责 |
|---|---|
| `src/engine.js` | 通用场景引擎 `Board`：SVG 绘图原语、缩放/平移、拖拽手柄、动画循环、智能播放、控件渲染 |
| `src/app.js` | 应用层：SPA 路由（领域→主题→模型）、搜索、筛选、收藏与进度、主题切换、工作台渲染 |
| `src/styles.css` | 设计系统：CSS 变量、深浅色、响应式布局（含移动端单列降级） |
| `src/shell.html` | HTML 外壳，含 4 个注入占位符 |
| `src/models-algebra.js` | 数与代数领域模型 |
| `src/models-geometry.js` | 图形与几何：变换、勾股、全等、圆 |
| `src/models-extremum.js` | 几何最值专题（瓜豆、阿氏圆、将军饮马等 7 个） |
| `src/models-congruence.js` | 全等模型主题（16 个） |
| `src/models-similarity.js` | 相似模型主题（8 个） |
| `src/models-angle.js` | 导角模型主题（8 个） |
| `src/models-practice.js` | 统计与概率、综合与实践 |
| `src/models-more.js` | 补充模型 |
| `build.py` | 构建脚本 |
| `dist/index.html` | 生成物：可直接部署的单文件成品 |

领域与主题的注册在 `src/app.js` 的 `DOMAINS` 常量里；每个模型的领域/主题归属写在模型对象的 `domain`、`topic` 字段。

---

## 三、如何新增一个模型

模型采用**声明式注册**，无需改动引擎。在任意 `models-*.js` 的 IIFE 内添加一个对象并调用 `R(...)`：

```js
var myModel = {
  id:'my-model',              // 全局唯一 id，路由 #/m/my-model
  domain:'geometry',          // 领域：algebra/geometry/stats/practice
  topic:'congruence',         // 主题（见 app.js 的 DOMAINS）
  level:2,                    // 难度 1基础/2进阶/3压轴
  title:'模型名称',
  brief:'一句话说明',
  keys:'关键词 空格分隔',      // 供搜索
  idea:'核心思路（一句话结论）',
  proof:['步骤1','步骤2'],     // 初中证法
  formula:'关键公式',
  tips:['提示1','提示2'],
  legend:[{c:C.blue,t:'图例'}],
  hint:'卡片副标题',
  interaction:'交互说明',
  yUp:true,                   // 数学坐标系 y 向上；屏幕坐标模型省略此项
  controls:[
    {type:'range',key:'a',label:'参数 a',min:1,max:10,step:0.1,digits:1},
    {type:'buttons',key:'mode',items:[{label:'模式A',onclick:function(b,s){s.mode='a';}}]}
  ],
  init:function(b,s){ s.a=5; },
  draw:function(b,s){
    var O={x:450,y:300};
    b.circle(O,40,C.blue,'#fff',2);
    b.text({x:450,y:120},'示例',C.slate,14,'middle');
    b.readout('a = '+s.a.toFixed(1));
  },
  onDrag:function(b,n,w){ /* 拖拽手柄逻辑 */ }
};
R(myModel);
```

### 引擎绘图原语（在 `draw(b,s)` 中调用）

- `b.line(p,q,color,width,dash)`、`b.polyline(points,...)`、`b.poly(points,fill,opacity,stroke,width)`
- `b.circle(center,r,stroke,fill,width)`、`b.text(p,str,color,size,anchor,weight)`
- `b.arc(center,r,a0,a1,color)`、`b.rightAngle(vertex,dirA,dirB,size,color)`
- `b.handle(p,name,r)` 注册可拖拽点（配合 `onDrag(b,name,worldPoint)`）
- `b.readout(str)` 更新底部读数条
- 向量工具 `V`：`add/sub/mul/dist/unit/mid/lerp/lerp2/angDiff`；颜色 `C`：blue/orange/purple/green/red/teal/slate/gray

### 坐标系约定（重要）

- 引擎默认**屏幕坐标**（y 向下）。几何模型通常用**数学坐标**，需在模型上设 `yUp:true`，并用 `P(x,y)`（相对画布中心、y 向上）风格定义点。
- 历史遗留：少数模型手写坐标时混用过两种系统，曾导致图形翻转/错位。新增模型请统一：几何类 `yUp:true` + 数学坐标。

### 播放按钮（智能三分支）

引擎自动判断：有 `step()` 的用自定义动画；无 `step()` 但有 `range` 控件的，播放时自动让首个参数往返扫描；两者都无的纯静态模型不渲染播放按钮。所以通常无需单独处理播放逻辑。

---

## 四、协作开发规范

1. **分支**：`main` 为可发布分支；功能开发用 `feature/xxx`，修复用 `fix/xxx`。
2. **每次改动后运行一键门禁**：

   ```bash
   bash tests/check.sh
   ```

   它会依次执行：全量 `node --check` → `python3 build.py` 重建 → 逐模型无头渲染（查零运行时错误、读数无 `NaN/undefined`）→ **8 条几何恒等式自动断言** → 锁定/解锁交互测试。任一步失败即以非零码退出。依赖：Python 3 + Node.js + Playwright + Chromium。单独跑某项：`python3 tests/verify.py`（渲染+恒等式）、`python3 tests/test_lock.py`（锁定交互）。报告见 `tests/report.json`，截图见 `tests/shots/`（均为生成物，已 gitignore）。
3. **数学正确性优先**：几何模型改动须核对读数中的恒等式（如 `AC−BD=0`、`σ²` 计算），不能只看画面。恒等式断言清单维护在 `tests/verify.py` 的 `IDENTITIES`，新增几何模型时同步补充。
4. **坐标系**：新增几何模型一律 `yUp:true` + 数学坐标，避免重复历史 bug。
5. **不引入外部依赖**：保持零依赖、单文件可直接部署。
6. **中文注释与文档**：与现有代码风格一致。

---

## 五、发布

本地 `dist/index.html` 可直接作为静态站点托管（当前线上即由此部署）。在 WorkBuddy 中可用「发布为应用」能力更新公开链接；更新会覆盖链接现有内容，发布前请与团队确认。
