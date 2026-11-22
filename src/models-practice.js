/* ============ 统计与概率 + 综合与实践：互动模型 ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,mid=V.mid,unit=V.unit,lerp2=V.lerp2;
  var D2R=Math.PI/180;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};} // 局部数学坐标（y 向上）
  function rot(p,c,a){var dx=p.x-c.x,dy=p.y-c.y,cs=Math.cos(a),sn=Math.sin(a);
    return{x:c.x+dx*cs-dy*sn,y:c.y+dx*sn+dy*cs};}
  function tick(b,p,q,col){var m=mid(p,q),d=unit(sub(q,p)),n={x:-d.y,y:d.x};
    b.line({x:m.x+n.x*7,y:m.y+n.y*7},{x:m.x-n.x*7,y:m.y-n.y*7},col||C.slate,2);}

  /* ---------- 平均数/中位数/众数 ---------- */
  var centralTendency={
    id:'central-tendency',domain:'stats',topic:'statistics',level:1,
    title:'描述统计 · 集中趋势与离散程度',brief:'同一组数据的五个统计量：均值/中位数/众数看「集中位置」，方差/标准差看「分散程度」。拖动数据点或制造极端值，观察谁稳、谁敏感。',
    keys:'平均数 中位数 众数 方差 标准差 极差 统计量 极端值 离散',
    idea:'描述一组数据分两步：①集中趋势——均值(总和÷个数)、中位数(排序后中间值)、众数(频次最高)；②离散程度——方差 σ²=Σ(xᵢ−x̄)²/n、标准差 σ=√σ²、极差(最大−最小)。上方点图看集中位置，下方离差柱看分散程度；柱越高、方差越大。',
    proof:['平均数 x̄=Σxᵢ/n，任何一个数据改变都会影响它，怕极端值。','中位数按位置取中间值，极端值几乎不改变它——最稳健。','众数看频次，反映最常见的值，可能不止一个。','方差 σ²=Σ(xᵢ−x̄)²/n 度量每个数据偏离均值的平均程度；σ 是它的平方根，与原数据同单位。极端值会被平方放大，故对方差影响极大。'],
    formula:'x̄=Σxᵢ/n　中位数=排序中间值　众数=频次最高　σ²=Σ(xᵢ−x̄)²/n　σ=√σ²　极差=max−min',
    tips:['拖动数轴上的点：相同数值会自动堆叠，堆叠最高处即众数','点「制造极端值」：把一点拉到最右，比较均值/中位数/方差谁变化最大','点「两极分化」：数据向两端散开，观察方差与离差柱显著升高'],
    legend:[{c:C.blue,t:'数据点'},{c:C.orange,t:'平均数'},{c:C.green,t:'中位数'},{c:C.purple,t:'众数'},{c:C.red,t:'离差柱'}],
    hint:'上半看集中位置，下半看分散程度',
    interaction:'拖动数据点（或制造极端值、两极分化），对比五个统计量的变化灵敏度。',
    controls:[
      {type:'button',key:'outlier',label:'制造极端值',onclick:function(b,s){s.data[0]=10;b.draw();}},
      {type:'button',key:'polarize',label:'两极分化',onclick:function(b,s){s.data=[0,0,1,1,9,9,10,10,5,5];b.draw();}},
      {type:'button',key:'reset',label:'还原数据',onclick:function(b,s){s.data=[2,3,3,4,4,4,5,6,7,8];b.draw();}}
    ],
    init:function(b,s){s.data=[2,3,3,4,4,4,5,6,7,8];},
    sx:function(v){return{ x:120+v*64,y:330};},
    draw:function(b,s){
      var d=s.data.slice(),n=d.length,x0=120,dx=64,axisY=330;
      // ===== 统计计算 =====
      var mean=d.reduce(function(a,x){return a+x;},0)/n;
      var sorted=d.slice().sort(function(a,b){return a-b;});
      var median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
      var counts={},maxc=0,modes=[];
      d.forEach(function(x){counts[x]=(counts[x]||0)+1;});
      for(var k in counts){var c=counts[k];if(c>maxc){maxc=c;modes=[+k];}else if(c===maxc)modes.push(+k);}
      var mode=modes[0];
      var ss=d.reduce(function(a,x){return a+(x-mean)*(x-mean);},0);
      var variance=ss/n,sd=Math.sqrt(variance),range=sorted[n-1]-sorted[0];

      // ===== 分区标题 =====
      b.text({x:100,y:70},'① 集中趋势：数据在哪儿聚集？',C.slate,15,'start',800);
      b.text({x:100,y:400},'② 离散程度：数据有多分散？（每根柱 = 一个数据与均值的距离平方）',C.slate,15,'start',800);

      // ===== 上半：点图（相同值堆叠）+ 数轴 =====
      b.line({x:x0-10,y:axisY},{x:x0+10*dx+30,y:axisY},'#94a3b8',2);
      for(var v=0;v<=10;v++){
        var px=x0+v*dx;
        b.line({x:px,y:axisY-7},{x:px,y:axisY+7},'#94a3b8',1.5);
        b.text({x:px,y:axisY+22},String(v),'var(--mh-muted)',11,'middle');
      }
      var stack={};
      d.forEach(function(val,i){
        var k=stack[val]||0;stack[val]=k+1;
        var px=x0+val*dx,py=axisY-18-k*24;
        b.line({x:px,y:axisY-8},{x:px,y:py},C.blue,1.4,null,.35);
        b.circle({x:px,y:py},8,C.blue,'#fff',2.4);
        b.handle({x:px,y:py},'d'+i,18);
      });
      // 众数标注（堆叠最高处）
      modes.forEach(function(md){
        var top=axisY-18-(stack[md]-1)*24;
        b.text({x:x0+md*dx,y:top-20},'众数 ×'+maxc,C.purple,11,'middle',800);
      });
      // 三条统计量竖线
      function vline(val,col,label,yy){
        var px=x0+val*dx;
        b.line({x:px,y:105},{x:px,y:axisY-4},col,2.4,'6 4');
        b.text({x:px,y:yy},label,col,11,'middle',800);
      }
      vline(mean,C.orange,'x̄='+mean.toFixed(2),100);
      vline(median,C.green,'中位数='+median,124);
      vline(mode,C.purple,'众数='+mode,148);

      // ===== 下半：离差柱（高度 ∝ 离差平方） =====
      var baseY=545,maxDev=0;
      d.forEach(function(x){var q=(x-mean)*(x-mean);if(q>maxDev)maxDev=q;});
      var scale=maxDev>0?82/maxDev:1;
      var seen={};
      d.forEach(function(val,i){
        var px=x0+val*dx,off=(seen[val]||0)*4;seen[val]=(seen[val]||0)+1;
        var dev=(val-mean)*(val-mean),h=dev*scale;
        var bx=px-7+off;
        b.poly([{x:bx,y:baseY},{x:bx+12,y:baseY},{x:bx+12,y:baseY-h},{x:bx,y:baseY-h}],C.red,.28,C.red,1.6);
        b.text({x:px,y:baseY+20},String(val),'var(--mh-muted)',10,'middle');
      });
      b.line({x:x0-10,y:baseY},{x:x0+10*dx+30,y:baseY},'#94a3b8',1.6);
      // 均值参考线（下半）
      b.line({x:x0+mean*dx,y:415},{x:x0+mean*dx,y:baseY},C.orange,1.8,'6 4');
      b.text({x:x0+mean*dx,y:432},'x̄',C.orange,12,'middle',800);
      // 方差读数框
      b.text({x:820,y:470},'σ² = '+variance.toFixed(2),C.red,15,'end',800);
      b.text({x:820,y:492},'σ = '+sd.toFixed(2),C.red,14,'end',800);
      b.text({x:820,y:512},'极差 = '+range,C.slate,12,'end',700);

      b.readout('数据 ['+d.join(', ')+']　均值 '+mean.toFixed(2)+'　中位数 '+median+'　众数 '+mode+'（×'+maxc+'）　方差 σ²='+variance.toFixed(2)+'　标准差 σ='+sd.toFixed(2)+'　极差 '+range);
    },
    onDrag:function(b,n,w){
      var i=+n.slice(1);b.state.data[i]=Math.max(0,Math.min(10,Math.round((w.x-120)/64)));
    }
  };
  R(centralTendency);

  /* ---------- 大数模拟：频率趋近概率 ---------- */
  var lawOfLargeNumbers={
    id:'large-numbers',domain:'stats',topic:'probability',level:1,
    title:'大数模拟 · 频率趋近概率',brief:'大量重复抛硬币，正面向上的频率会逐渐稳定在 0.5 附近——这就是概率的统计定义。',
    keys:'概率 频率 大数定律 模拟 抛硬币 骰子',
    idea:'随机事件在大量重复试验中，频率会稳定在概率附近。试验次数越多，频率与概率的偏差通常越小。',
    proof:['每次抛硬币正面概率 P=0.5。','做 n 次试验，正面出现 m 次，频率 f=m/n。','当 n 很大时，频率 f 会稳定在 0.5 附近（大数定律）。'],
    formula:'频率 f = m/n　当 n→∞，f → P（概率）',
    tips:['点击"开始"连续模拟，观察频率曲线','改变硬币的偏置概率 p','观察试验次数越多，频率越接近 p'],
    legend:[{c:C.blue,t:'频率'},{c:C.green,t:'理论概率 p'}],
    hint:'试验越多，频率越接近概率',
    interaction:'启动动画看频率随试验次数变化并趋于稳定。',
    controls:[
      {type:'range',key:'p',label:'正面概率 p',min:0.1,max:0.9,step:0.05,digits:2},
      {type:'button',key:'toggle',label:'▶ 开始模拟',onclick:function(b,s){b.playing=!b.playing;var el=document.getElementById('mhb-toggle');if(el)el.textContent=b.playing?'⏸ 暂停':'▶ 开始模拟';}},
      {type:'button',key:'step100',label:'+100 次',onclick:function(b,s){for(var i=0;i<100;i++)b.model.toss(b,s);}},
      {type:'button',key:'reset',label:'重置',onclick:function(b,s){s.n=0;s.m=0;s.history=[];}}
    ],
    init:function(b,s){s.p=0.5;s.n=0;s.m=0;s.history=[];},
    toss:function(b,s){s.n++;if(Math.random()<s.p)s.m++;if(s.history.length>300)s.history.shift();s.history.push(s.m/s.n);},
    step:function(b,s,dt){if(b.playing){for(var i=0;i<8;i++)b.model.toss(b,s);}},
    draw:function(b,s){
      var g=b.scene;
      if(s.n===0){b.text({x:450,y:300},'点击「开始模拟」或「+100 次」开始试验','var(--mh-muted)',16,'middle');}
      // 概率参考线
      var oy=480,scH=340;
      var py=oy-s.p*scH;
      b.line({x:100,y:py},{x:850,y:py},C.green,2,'6 4');
      b.text({x:855,y:py+5},'p='+s.p.toFixed(2),C.green,12,'start',700);
      b.line({x:100,y:oy},{x:850,y:oy},'#94a3b8',1.6);
      b.line({x:100,y:oy-scH},{x:100,y:oy},'#94a3b8',1.6);
      b.text({x:100,y:oy+22},'0','var(--mh-muted)',11,'middle');
      b.text({x:100,y:oy-scH-8},'1','var(--mh-muted)',11,'middle');
      // 频率曲线
      if(s.history.length>1){
        var pts=[];var N=Math.max(s.n,50);
        s.history.forEach(function(f,i){pts.push({x:100+i/300*750,y:oy-f*scH});});
        b.polyline(pts,C.blue,2.4);
      }
      var freq=s.n?s.m/s.n:0;
      if(s.n>0){var cx=100+Math.min(1,s.history.length/300)*750;
        b.circle({x:cx,y:oy-freq*scH},6,C.blue,C.blue,2);}
      b.readout('试验 '+s.n+' 次　正面 '+s.m+' 次　频率 '+(s.n?freq.toFixed(4):'—')+'　理论概率 '+s.p.toFixed(2));
    }
  };
  R(lawOfLargeNumbers);

  /* ---------- 手拉手模型 ---------- */
  var handInHand={
    id:'hand-in-hand',domain:'practice',topic:'geomodel',level:2,
    title:'手拉手模型（旋转全等）',brief:'两个共顶点的等腰三角形，顶角相等，旋转后对应边相等——这是全等与旋转的经典组合模型。',
    keys:'手拉手 旋转 全等 等腰三角形 模型',
    idea:'△OAB 与 △OCD 都是顶角相等的等腰三角形（OA=OB，OC=OD，∠AOB=∠COD），将△OAC 绕 O 旋转可证 △OAC≌△OBD，得 AC=BD。',
    proof:['OA=OB，OC=OD（等腰），∠AOB=∠COD=α。','∠AOC = ∠AOB + ∠BOC = ∠COD + ∠BOC = ∠BOD。','由 SAS 得 △OAC≌△OBD，故 AC=BD（"手拉手"对应边相等）。'],
    formula:'OA=OB, OC=OD, ∠AOB=∠COD ⇒ △OAC≌△OBD ⇒ AC=BD',
    tips:['旋转参数观察两个等腰三角形','拖动点改变形状，验证 AC=BD 恒成立','改变顶角 α'],
    legend:[{c:C.blue,t:'△OAB'},{c:C.orange,t:'△OCD'},{c:C.green,t:'对应边 AC 与 BD'}],
    hint:'共顶点等腰三角形 → 旋转全等 → 对应边相等',
    interaction:'拖动 A、C 改变构型，观察 AC 与 BD 始终相等，夹角恒等于顶角 α。',
    yUp:true,
    controls:[
      {type:'range',key:'alpha',label:'顶角 α (°)',min:30,max:120,step:1,digits:0},
      {type:'buttons',key:'dir',items:[{label:'同向',onclick:function(b,s){s.dir=1;}},{label:'反向',onclick:function(b,s){s.dir=-1;}}]}
    ],
    init:function(b,s){s.alpha=60;s.dir=1;s.A=P(-160,70);s.C=P(120,50);},
    draw:function(b,s){
      var O0=O(),a=s.alpha*D2R;
      // 两个共顶点的等腰三角形：B 由 A 绕 O 转 ±α 得到，D 由 C 绕 O 转 ±α 得到
      // 于是 OA=OB、OC=OD、∠AOB=∠COD=α，满足手拉手条件
      var B=rot(s.A,O0,s.dir*a),D0=rot(s.C,O0,s.dir*a);
      b.poly([O0,s.A,B],C.blue,.13,C.blue,2.6);
      b.poly([O0,s.C,D0],C.orange,.13,C.orange,2.6);
      b.line(s.A,s.C,C.green,3);b.line(B,D0,C.green,3);
      tick(b,O0,s.A,C.blue);tick(b,O0,B,C.blue);
      tick(b,O0,s.C,C.orange);tick(b,O0,D0,C.orange);
      // O 点
      b.circle(O0,6,C.slate,'#fff',2.4);b.text({x:O0.x-14,y:O0.y-12},'O',C.slate,13,'middle',800);
      [[s.A,'A',C.blue],[B,'B',C.blue],[s.C,'C',C.orange],[D0,'D',C.orange]].forEach(function(p){
        b.circle(p[0],5.5,p[2],'#fff',2.4);b.text({x:p[0].x,y:p[0].y-14},p[1],p[2],13,'middle',800);});
      // 拉手线长度标注
      function segLabel(p,q,txt){var m=mid(p,q);b.text({x:m.x,y:m.y+16},txt,C.green,12,'middle',700);}
      segLabel(s.A,s.C,'AC='+dist(s.A,s.C).toFixed(1));
      segLabel(B,D0,'BD='+dist(B,D0).toFixed(1));
      b.handle(s.A,'A',18);b.handle(s.C,'C',18);
      var ac=dist(s.A,s.C),bd=dist(B,D0);
      b.readout('AC = '+ac.toFixed(2)+'　BD = '+bd.toFixed(2)+'　→ AC − BD = '+(ac-bd).toFixed(4)+'（恒为 0，△OAC≌△OBD）');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else b.state.C=w;}
  };
  R(handInHand);

  /* ---------- 相似测高 ---------- */
  var measureHeight={
    id:'measure-height',domain:'practice',topic:'application',level:1,
    title:'相似测高 · 影子法',brief:'同一时刻物高与影长成正比：利用标杆的影长，通过相似三角形求出旗杆等物体的高度。',
    keys:'相似 测高 影子 比例 应用',
    idea:'同一时刻太阳光线平行，物高与影长成正比。已知标杆高 h₁、影长 l₁，测得物体影长 l₂，则物体高 H = h₁·l₂/l₁。',
    proof:['太阳光线平行，标杆与物体都垂直于地面，构成两个相似直角三角形。','由相似得 h₁/l₁ = H/l₂。','所以 H = h₁·l₂/l₁。'],
    formula:'H / l₂ = h₁ / l₁　⇒　H = h₁ · l₂ / l₁',
    tips:['拖动滑块改变标杆影长与物体影长','观察相似三角形与求得的物体高度','改变标杆高度'],
    legend:[{c:C.blue,t:'标杆'},{c:C.orange,t:'待测物体'},{c:C.green,t:'太阳光线'}],
    hint:'同一时刻：物高 : 影长 = 定值',
    interaction:'拖动滑块改变影长，观察相似三角形与高度计算。',
    controls:[
      {type:'range',key:'h1',label:'标杆高 h₁',min:1,max:3,step:0.1,digits:1},
      {type:'range',key:'l1',label:'标杆影长 l₁',min:1,max:4,step:0.1,digits:1},
      {type:'range',key:'l2',label:'物体影长 l₂',min:2,max:8,step:0.1,digits:1}
    ],
    init:function(b,s){s.h1=1.5;s.l1=2;s.l2=6;},
    draw:function(b,s){
      var g=b.scene,sc=52,ground=480,ox=120;
      var H=s.h1*s.l2/s.l1;
      b.line({x:60,y:ground},{x:850,y:ground},'#94a3b8',2);
      b.text({x:850,y:ground+20},'地面','var(--mh-muted)',12,'end');
      // 标杆
      var bx=ox,btop=ground-s.h1*sc;
      b.line({x:bx,y:ground},{x:bx,y:btop},C.blue,5);
      b.line({x:bx,y:ground},{x:bx+s.l1*sc,y:ground},C.blue,2,'5 4');
      b.line({x:bx,y:btop},{x:bx+s.l1*sc,y:ground},C.green,2,'6 4');
      b.text({x:bx-8,y:(ground+btop)/2},'h₁='+s.h1.toFixed(1),C.blue,12,'end',700);
      b.text({x:bx+s.l1*sc/2,y:ground+20},'l₁='+s.l1.toFixed(1),C.blue,12,'middle',700);
      // 物体
      var px=430,ptop=ground-H*sc;
      b.line({x:px,y:ground},{x:px,y:ptop},C.orange,6);
      b.line({x:px,y:ground},{x:px+s.l2*sc,y:ground},C.orange,2,'5 4');
      b.line({x:px,y:ptop},{x:px+s.l2*sc,y:ground},C.green,2,'6 4');
      b.text({x:px-8,y:(ground+ptop)/2},'H=?',C.orange,13,'end',800);
      b.text({x:px+s.l2*sc/2,y:ground+20},'l₂='+s.l2.toFixed(1),C.orange,12,'middle',700);
      if(ptop>10){b.text({x:px+12,y:ptop+10},'H = '+H.toFixed(2),C.orange,13,'start',800);}
      b.readout('h₁='+s.h1.toFixed(1)+', l₁='+s.l1.toFixed(1)+', l₂='+s.l2.toFixed(1)+'　⇒　H = h₁·l₂/l₁ = '+H.toFixed(2)+'　（相似三角形）');
    }
  };
  R(measureHeight);

  /* ---------- 黄金分割 ---------- */
  var goldenRatio={
    id:'golden-ratio',domain:'practice',topic:'application',level:2,
    title:'黄金分割',brief:'把线段分成大小两段，若全长:大段 = 大段:小段，这个比就是黄金比 φ≈0.618。',
    keys:'黄金分割 黄金比 0.618 比例 美学',
    idea:'若点 C 把 AB 分成 AC（大段）与 CB（小段），满足 AB/AC = AC/CB，则 AC/AB = (√5−1)/2 ≈ 0.618，称为黄金比。',
    proof:['设 AB=1，AC=x（大段），则 CB=1−x。','由 AB/AC = AC/CB 得 1/x = x/(1−x)，即 x²+x−1=0。','解得 x=(√5−1)/2≈0.618。'],
    formula:'φ = (√5−1)/2 ≈ 0.618　满足 全长:大段 = 大段:小段',
    tips:['拖动分割点 C，观察何时接近黄金比','对照黄金矩形与螺旋','读数显示当前比例与 0.618 的差'],
    legend:[{c:C.blue,t:'大段 AC'},{c:C.orange,t:'小段 CB'}],
    hint:'全长:大段 = 大段:小段 ≈ 1.618',
    interaction:'拖动分割点 C，观察比例何时达到黄金比。',
    controls:[
      {type:'range',key:'c',label:'分割点位置 AC/AB',min:0.3,max:0.9,step:0.001,digits:3},
      {type:'button',key:'gold',label:'跳到黄金分割点',onclick:function(b,s){s.c=(Math.sqrt(5)-1)/2;H.refreshControls(s);}}
    ],
    init:function(b,s){s.c=0.5;},
    draw:function(b,s){
      var g=b.scene,x0=120,x1=780,y=300,phi=(Math.sqrt(5)-1)/2;
      var cx=x0+s.c*(x1-x0);
      b.line({x:x0,y:y},{x:x1,y:y},'#94a3b8',3);
      b.line({x:x0,y:y},{x:cx,y:y},C.blue,7,null,.9);
      b.line({x:cx,y:y},{x:x1,y:y},C.orange,7,null,.9);
      [[x0,'A',C.blue],[cx,'C','#334155'],[x1,'B',C.orange]].forEach(function(p){
        b.circle({x:p[0],y:y},6,p[2],'#fff',2.4);b.text({x:p[0],y:y-18},p[1],p[2],14,'middle',800);});
      b.handle({x:cx,y:y},'C',16);
      b.text({x:(x0+cx)/2,y:y+26},'AC='+s.c.toFixed(3),C.blue,12,'middle',700);
      b.text({x:(cx+x1)/2,y:y+26},'CB='+(1-s.c).toFixed(3),C.orange,12,'middle',700);
      // 黄金比参考线
      var gx=x0+phi*(x1-x0);
      b.line({x:gx,y:y-60},{x:gx,y:y+60},C.green,2,'5 4');
      b.text({x:gx,y:y-70},'φ≈0.618',C.green,12,'middle',700);
      var ratio=s.c/(1-s.c);
      b.readout('AC/AB = '+s.c.toFixed(4)+'　CB/AB = '+(1-s.c).toFixed(4)+'　AC/CB = '+ratio.toFixed(4)+(Math.abs(s.c-phi)<.005?'　✓ 黄金分割！':''));
    },
    onDrag:function(b,n,w){if(n==='C'){b.state.c=Math.max(.3,Math.min(.9,(w.x-120)/660));H.refreshControls(b.state);}}
  };
  R(goldenRatio);

  /* ---------- 几何概型 ---------- */
  var geometricProbability={
    id:'geometric-probability',domain:'stats',topic:'probability',level:2,
    title:'几何概型 · 面积比',brief:'向正方形内随机投点，落在内切圆内的概率 = 圆面积/正方形面积 = π/4。',
    keys:'几何概型 面积比 概率 π 投点 模拟',
    idea:'几何概型中，事件概率 = 有利区域度量/总区域度量。向正方形投点落在内切圆的概率 = πr²/(2r)² = π/4 ≈ 0.785。',
    proof:['设正方形边长为 2r，内切圆半径为 r。','正方形面积 = (2r)² = 4r²，圆面积 = πr²。','概率 P = 圆面积/正方形面积 = πr²/4r² = π/4 ≈ 0.785。'],
    formula:'P = S_圆 / S_正方形 = π/4 ≈ 0.7854',
    tips:['点击「投点」模拟随机投点','观察圆内点数与总点数之比趋近 π/4','用读数反推 π 的近似值'],
    legend:[{c:C.blue,t:'圆内点'},{c:C.orange,t:'圆外点'}],
    hint:'概率 = 面积之比',
    interaction:'启动投点动画，观察频率趋近 π/4。',
    controls:[
      {type:'button',key:'toggle',label:'▶ 开始投点',onclick:function(b,s){b.playing=!b.playing;var el=document.getElementById('mhb-toggle');if(el)el.textContent=b.playing?'⏸ 暂停':'▶ 开始投点';}},
      {type:'button',key:'add100',label:'+200 点',onclick:function(b,s){for(var i=0;i<200;i++)b.model.toss(b,s);}},
      {type:'button',key:'reset',label:'重置',onclick:function(b,s){s.n=0;s.inside=0;s.pts=[];}}
    ],
    init:function(b,s){s.n=0;s.inside=0;s.pts=[];},
    toss:function(b,s){
      var x=Math.random()*2-1,y=Math.random()*2-1;
      var inside=x*x+y*y<=1;s.n++;if(inside)s.inside++;
      if(s.pts.length>600)s.pts.shift();s.pts.push({x:x,y:y,in:inside});
    },
    step:function(b,s,dt){if(b.playing){for(var i=0;i<6;i++)b.model.toss(b,s);}},
    draw:function(b,s){
      var g=b.scene,cx=400,cy=300,r=210;
      // 正方形
      b.poly([{x:cx-r,y:cy-r},{x:cx+r,y:cy-r},{x:cx+r,y:cy+r},{x:cx-r,y:cy+r}],'none',1,'#94a3b8',2);
      // 内切圆
      b.circle({x:cx,y:cy},r,'#cbd5e1','#faf5ff',2,'6 4');
      // 点
      s.pts.forEach(function(p){
        b.circle({x:cx+p.x*r,y:cy-p.y*r},2.6,p.in?C.blue:C.orange,p.in?C.blue:C.orange,1);
      });
      b.text({x:cx,y:cy},'π/4 ≈ 0.785','#7c3aed',15,'middle',800);
      var ratio=s.n?s.inside/s.n:0,piEst=ratio*4;
      b.readout('投点 '+s.n+'　圆内 '+s.inside+'　频率 '+(s.n?ratio.toFixed(4):'—')+' → π/4　估计 π ≈ '+(s.n?piEst.toFixed(3):'—'));
    }
  };
  R(geometricProbability);

})();
