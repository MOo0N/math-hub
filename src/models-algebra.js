/* ============ 数与代数：互动模型 ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,mid=V.mid;

  /* ---------- 绝对值与数轴 ---------- */
  var absModel={
    id:'abs-numberline',domain:'algebra',topic:'number',level:1,
    title:'绝对值与数轴距离',brief:'|x−a| 就是数轴上 x 到 a 的距离；|x−a|+|x−b| 是到两定点距离之和。',
    keys:'绝对值 数轴 距离 零点 两点距离和',
    idea:'|x − a| 的几何意义是数轴上点 x 到定点 a 的距离。因此 |x−a|+|x−b| 表示 x 到 a、b 两点的距离之和，当 x 落在 [a,b] 之间时取最小值 b−a。',
    proof:['|x−a| = 数轴上 x 与 a 两点间的距离，与正负无关。','|x−a|+|x−b|：若 x 在 a、b 之间，距离和恰好等于 |a−b|（把两段拼起来正好是全长）。','若 x 在区间外，距离和 = |a−b| + 2×(区间外的超出量)，必然更大。所以最小值在 x∈[a,b] 时取得。'],
    formula:'|x−a| + |x−b| ≥ |a−b|，当 x∈[a,b] 时取等号',
    tips:['拖动红点 x，观察两条距离线段如何变化','拖动 a、b 改变定点','点击「到最小值」把 x 拖进区间内'],
    legend:[{c:C.blue,t:'x 到 a 的距离'},{c:C.orange,t:'x 到 b 的距离'},{c:C.green,t:'距离之和'}],
    hint:'把绝对值看作数轴上的距离',
    interaction:'拖动红色点 x 在数轴上移动，观察 |x−a|、|x−b| 及它们的和如何变化。',
    controls:[
      {type:'range',key:'x',label:'动点 x',min:-6,max:6,step:0.05,digits:2},
      {type:'range',key:'a',label:'定点 a',min:-5,max:5,step:0.1,digits:1},
      {type:'range',key:'b',label:'定点 b',min:-5,max:5,step:0.1,digits:1},
      {type:'button',key:'best',label:'到最小值区间',onclick:function(b,s){s.x=(s.a+s.b)/2;H.refreshControls(s);}}
    ],
    init:function(b,s){s.x=3.5;s.a=-2;s.b=2;},
    sx:function(v){return{x:450+v*62,y:300};},
    draw:function(b,s){
      var g=b.scene,m=b.model,X=m.sx(s.x),A=m.sx(s.a),B=m.sx(s.b);
      b.line(m.sx(-6),m.sx(6),'#94a3b8',2);
      for(var v=-6;v<=6;v++){var p=m.sx(v);b.line({x:p.x,y:p.y-7},{x:p.x,y:p.y+7},'#94a3b8',1.5);
        b.text({x:p.x,y:p.y+26},String(v),'var(--mh-muted)',11,'middle');}
      var inRange=s.x>=Math.min(s.a,s.b)&&s.x<=Math.max(s.a,s.b);
      // 两条距离线段（画在数轴上方不同高度）
      b.line({x:A.x,y:270},{x:X.x,y:270},C.blue,5,null,.85);
      b.line({x:X.x,y:245},{x:B.x,y:245},C.orange,5,null,.85);
      b.text({x:(A.x+X.x)/2,y:262},'|x−a|='+Math.abs(s.x-s.a).toFixed(2),C.blue,12,'middle',700);
      b.text({x:(X.x+B.x)/2,y:237},'|x−b|='+Math.abs(s.x-s.b).toFixed(2),C.orange,12,'middle',700);
      [[A,'a='+s.a,C.blue],[B,'b='+s.b,C.orange]].forEach(function(t){
        b.circle(t[0],7,t[2],'#fff',2.5);b.text({x:t[0].x,y:t[0].y-16},t[1],t[2],13,'middle',700);
      });
      b.circle(X,9,C.red,C.red,2);b.handle(X,'x',16);
      b.text({x:X.x,y:X.y-18},'x='+s.x.toFixed(2),C.red,13,'middle',800);
      var sum=Math.abs(s.x-s.a)+Math.abs(s.x-s.b),min=Math.abs(s.a-s.b);
      b.readout('|x−a| + |x−b| = '+sum.toFixed(2)+'　最小值 '+min.toFixed(2)+(Math.abs(sum-min)<.02?'  ✓ 取到最小值':(inRange?'':'（把 x 拖进 [a,b]）')));
    },
    onDrag:function(b,n,w){if(n==='x'){b.state.x=Math.max(-6,Math.min(6,(w.x-450)/62));H.refreshControls(b.state);}}
  };
  R(absModel);

  /* ---------- 乘法公式面积拼图 ---------- */
  var multFormula={
    id:'mult-formula',domain:'algebra',topic:'number',level:1,
    title:'乘法公式 · 面积拼图',brief:'用长方形与正方形的面积拼接，直观验证平方差与完全平方公式。',
    keys:'乘法公式 平方差 完全平方 面积 拼图',
    idea:'代数恒等式可以用几何面积来"看见"：把边长写成 a+b 或 a−b，用面积守恒验证 (a+b)²、(a−b)² 与 a²−b² 的关系。',
    proof:[
      '完全平方：(a+b)² 表示一个边长 a+b 的大正方形面积，把它切成 a²、2ab、b² 三块，故 (a+b)²=a²+2ab+b²。',
      '平方差：a²−b² 可拼成①一个长 (a+b)、宽 (a−b) 的长方形，故 a²−b²=(a+b)(a−b)。',
      '拖动滑块改变 a、b，各块面积随之改变，但等式始终成立。'
    ],
    formula:'(a+b)² = a² + 2ab + b²　　a² − b² = (a+b)(a−b)',
    tips:['切换"完全平方 / 平方差"两种拼图','拖动 a、b 滑块改变边长，观察面积标注','注意面积守恒：整体 = 各部分之和'],
    legend:[{c:C.blue,t:'a² 块'},{c:C.orange,t:'b² 块'},{c:C.green,t:'ab 块'}],
    hint:'面积守恒 = 代数恒等式',
    interaction:'拖动 a、b 滑块改变边长，观察面积拼图如何随边长变化。',
    controls:[
      {type:'buttons',key:'mode',items:[
        {label:'完全平方',onclick:function(b,s){s.mode='square';}},
        {label:'平方差',onclick:function(b,s){s.mode='diff';}}
      ]},
      {type:'range',key:'a',label:'边长 a',min:1,max:5,step:0.1,digits:1},
      {type:'range',key:'b',label:'边长 b',min:0.5,max:4,step:0.1,digits:1}
    ],
    init:function(b,s){s.mode='square';s.a=3;s.b=2;},
    draw:function(b,s){
      var g=b.scene,scale=62,ox=200,oy=470,a=s.a*scale,bb=s.b*scale;
      function pt(x,y){return{x:ox+x,y:oy-y};}
      if(s.mode==='square'){
        // (a+b)^2 大正方形
        b.poly([pt(0,0),pt(a+bb,0),pt(a+bb,a+bb),pt(0,a+bb)],'#faf5ff',1,C.purple,2.5);
        // 切分：a×a, a×b, b×a, b×b
        b.poly([pt(0,0),pt(a,0),pt(a,a),pt(0,a)],C.blue,.28);
        b.poly([pt(a,0),pt(a+bb,0),pt(a+bb,a),pt(a,a)],C.green,.3);
        b.poly([pt(0,a),pt(a,a),pt(a,a+bb),pt(0,a+bb)],C.green,.3);
        b.poly([pt(a,a),pt(a+bb,a),pt(a+bb,a+bb),pt(a,a+bb)],C.orange,.32);
        b.text({x:pt(a/2,a/2).x,y:pt(a/2,a/2).y},'a²='+(s.a*s.a).toFixed(1),C.blue,15,'middle',800);
        b.text({x:pt(a+bb/2,a/2).x,y:pt(a+bb/2,a/2).y},'ab',C.green,14,'middle',700);
        b.text({x:pt(a/2,a+bb/2).x,y:pt(a/2,a+bb/2).y},'ab',C.green,14,'middle',700);
        b.text({x:pt(a+bb/2,a+bb/2).x,y:pt(a+bb/2,a+bb/2).y},'b²',C.orange,14,'middle',700);
        b.text({x:pt(0,0).x,y:pt(0,0).y+22},'a='+s.a.toFixed(1),'var(--mh-muted)',12,'start');
        b.text({x:pt(a+bb,0).x,y:pt(a+bb,0).y+22},'b='+s.b.toFixed(1),'var(--mh-muted)',12,'end');
        var lhs=Math.pow(s.a+s.b,2),rhs=s.a*s.a+2*s.a*s.b+s.b*s.b;
        b.readout('(a+b)² = '+lhs.toFixed(2)+'　=　a²+2ab+b² = '+rhs.toFixed(2)+'  ✓');
      }else{
        // a^2 - b^2 拼成长方形 (a+b)×(a-b)
        var aa=Math.max(s.a,s.b),bb2=Math.min(s.a,s.b);
        var A=aa*scale,Bb=bb2*scale;
        b.poly([pt(0,0),pt(A,0),pt(A,A),pt(0,A)],C.blue,.14,C.blue,2);
        b.poly([pt(0,0),pt(Bb,0),pt(Bb,Bb),pt(0,Bb)],C.orange,.35,C.orange,2);
        // 剩余 L 形重新拼：这里直接画出等效长方形
        var rx=500,ry=470,w=(aa+bb2)*scale,h=(aa-bb2)*scale;
        function rt(x,y){return{x:rx+x,y:ry-y};}
        b.poly([rt(0,0),rt(w,0),rt(w,h),rt(0,h)],C.green,.22,C.green,2.5);
        b.text({x:rt(w/2,h/2).x,y:rt(w/2,h/2).y},'面积 = a²−b²',C.green,14,'middle',800);
        b.text({x:rt(w/2,0).x,y:rt(w/2,0).y+22},'长 a+b='+(aa+bb2).toFixed(1),'var(--mh-muted)',12,'middle');
        b.text({x:rt(0,h/2).x-8,y:rt(0,h/2).y},'宽 a−b='+(aa-bb2).toFixed(1),'var(--mh-muted)',12,'end');
        // 标签跟随实际大小：aa=max(a,b) 为大正方形边长，bb2=min(a,b)
        b.text({x:pt(A/2,A/2).x,y:pt(A/2,A/2).y},'('+(aa===s.a?'a':'b')+')²',C.blue,14,'middle',700);
        b.text({x:pt(Bb/2,Bb/2).x,y:pt(Bb/2,Bb/2).y},'('+(bb2===s.b?'b':'a')+')²',C.orange,14,'middle',700);
        var l=aa*aa-bb2*bb2,r=(aa+bb2)*(aa-bb2);
        b.readout('a²−b² = '+l.toFixed(2)+'　=　(a+b)(a−b) = '+r.toFixed(2)+'  ✓');
      }
    }
  };
  R(multFormula);

  /* 一次函数坐标映射：数学(x,y) ↔ SVG，绘制与拖动共用同一套映射，
     保证「改 k 绕 B 旋转、改 b 上下平移」两件事彼此独立、互不串扰。 */
  var LX=450,LY=300,LS=70;
  function linP(x,y){return{x:LX+x*LS,y:LY-y*LS};}   // 数学 → SVG
  function linT(w){return{x:(w.x-LX)/LS,y:(LY-w.y)/LS};} // SVG → 数学

  /* ---------- 一次函数：两页共用的坐标/读数/绘图工具 ---------- */
  function linNF(v,d){return typeof v==='number'?v.toFixed(d==null?1:d):String(v);}
  /* 坐标轴：带箭头、刻度与数字（保留原有显示效果） */
  function linAxes(b){
    var P=linP;
    b.line(P(-6.3,0),P(6.3,0),'var(--mh-muted)',1.6);
    b.line(P(0,-4.3),P(0,4.3),'var(--mh-muted)',1.6);
    b.poly([P(6.35,0),P(6.12,0.14),P(6.12,-0.14)],'var(--mh-muted)',1);
    b.poly([P(0,4.35),P(-0.14,4.12),P(0.14,4.12)],'var(--mh-muted)',1);
    b.text({x:P(6.3,0).x+10,y:P(6.3,0).y+4},'x','var(--mh-muted)',13,'start',700);
    b.text({x:P(0,4.3).x+10,y:P(0,4.3).y-2},'y','var(--mh-muted)',13,'start',700);
    for(var i=-6;i<=6;i++){if(i!==0){b.line(P(i,-0.07),P(i,0.07),'var(--mh-muted)',1);
      b.text({x:P(i,0).x,y:P(i,0).y+18},String(i),'var(--mh-muted)',10,'middle');}}
    for(var j=-4;j<=4;j++){if(j!==0){b.line(P(-0.06,j),P(0.06,j),'var(--mh-muted)',1);
      b.text({x:P(0,j).x-8,y:P(0,j).y+4},String(j),'var(--mh-muted)',10,'end');}}
    b.text({x:P(0,0).x-8,y:P(0,0).y+18},'0','var(--mh-muted)',10,'end');
  }
  /* 主直线 + 截距点 B + 斜率三角形 Q + x 轴交点；返回用于读数的小工具 */
  function linMain(b,s){
    var P=linP,k=s.k,bb=s.b;
    b.line(P(-6.3,-6.3*k+bb),P(6.3,6.3*k+bb),C.blue,3.4);
    var Bp=P(0,bb);b.circle(Bp,8,C.orange,'#fff',2.6);b.handle(Bp,'B',20);
    b.text({x:Bp.x+12,y:Bp.y-10},'B(0,'+linNF(bb,1)+')',C.orange,12,'start',700);
    var dx=2,qy=k*dx+bb,Hpt=P(dx,bb),Qp=P(dx,qy);
    b.line(Bp,Hpt,'#4f7a5b',1.8,'5 4');b.line(Hpt,Qp,'#4f7a5b',1.8,'5 4');
    b.circle(Qp,7,C.green,'#fff',2.4);b.handle(Qp,'Q',20);
    b.text({x:(Bp.x+Hpt.x)/2,y:Bp.y+18},'Δx='+dx,'#4f7a5b',11,'middle',700);
    b.text({x:Qp.x+10,y:(Hpt.y+Qp.y)/2},'Δy='+linNF(k*dx,1),'#4f7a5b',11,'start',700);
    b.text({x:Qp.x+10,y:Qp.y-11},'Q 改斜率',C.green,11,'start',700);
    if(Math.abs(k)>0.03){var xx=-bb/k;
      if(xx>=-6.3&&xx<=6.3){var Xp=P(xx,0);b.circle(Xp,5,C.blue,'#fff',2);
        b.text({x:Xp.x,y:Xp.y+32},'('+linNF(xx,2)+',0)',C.blue,11,'middle',700);}}
  }
  function linQuads(kk,b0){
    if(Math.abs(kk)<0.03)return b0>0.03?'一、二':b0<-0.03?'三、四':'—';
    if(Math.abs(b0)<0.03)return kk>0?'一、三':'二、四';
    if(kk>0)return b0>0?'一、二、三':'一、三、四';
    return b0>0?'一、二、四':'二、三、四';
  }
  function linTrend(k){return k>0.03?'↗ k>0 递增':k<-0.03?'↘ k<0 递减':'→ k=0 水平';}
  /* 两页共用的拖拽：B 只改 b（上下平移），Q 只改 k（绕 B 旋转） */
  function linOnDrag(b,n,w){
    b._tween=null; // 手动拖拽优先，取消进行中的补间动画
    var s=b.state,m=linT(w);
    if(n==='B')s.b=Math.max(-4,Math.min(4,Math.round(m.y*10)/10));
    else if(n==='Q')s.k=Math.max(-4,Math.min(4,Math.round((m.y-s.b)/2*10)/10));
    H.refreshControls(s);
  }
  /* 预测模式：随机出一条目标直线（tk、tb），先隐藏解析式让学生调 k、b 去对齐 */
  function predNew(s){
    var ks=[-3,-2.5,-2,-1.5,-1,-0.5,0.5,1,1.5,2,2.5,3];
    var bs=[-3,-2,-1,0,1,2,3];
    s.tk=ks[Math.floor(Math.random()*ks.length)];
    s.tb=bs[Math.floor(Math.random()*bs.length)];
    s.predictRevealed=false;
  }
  /* 缓入缓出按钮：先结算上一段补间到稳定终点，再基于当前真实状态取反，
     保证连续/快速点击每次都正确（不会出现取到中间值而取反不到位）。 */
  function linKFlip(bd){
    bd.finishTween();
    var s=bd.state;
    bd.tweenTo({k:Math.round(-s.k*10)/10},0.55);
  }
  function linBFlip(bd){
    bd.finishTween();
    var s=bd.state;
    bd.tweenTo({b:Math.round(-s.b*10)/10},0.55);
  }

  /* ---------- 一次函数（初级）· k 与 b：形状、旋转、平移 ---------- */
  var linearFn={
    id:'linear-function',domain:'algebra',topic:'function',level:1,
    title:'一次函数 · k 与 b',brief:'y=kx+b：k 定倾斜（绕 (0,b) 旋转），b 定位置（沿 y 轴上下平移）。',
    keys:'一次函数 斜率 k 截距 b 直线 增减性 象限 旋转 平移',
    idea:'k 是斜率，决定倾斜方向与陡峭；b 是纵截距，直线恒过定点 B(0,b)。改 k 时 B 不动、直线绕 B 旋转；改 b 时倾斜不变、直线上下平移。',
    proof:[
      '斜率 k = Δy/Δx：从 B(0,b) 水平走 Δx、再竖直走 Δy=Δx·k 回到直线，比值恒为 k。k>0 上升，k<0 下降，|k| 越大越陡。',
      '令 x=0 得 y=b，直线恒过定点 B(0,b)。所以只改 k 时直线绕 B 旋转（B 不动）；只改 b 时斜率不变，整条线沿 y 轴上下平移——两者互不影响。',
      '由 k、b 的符号可直接判断增减性与所过象限：k>0 递增、k<0 递减；b>0 交 y 轴正半轴，b<0 交 y 轴负半轴。'
    ],
    formula:'y = kx + b　｜　k = Δy/Δx（斜率）　｜　纵截距 B(0,b)　｜　x 轴交点 (−b/k, 0)',
    tips:[
      '先解锁画布，再拖橙色点 B：只改 b，直线上下平移，倾斜不变',
      '拖绿色点 Q：只改 k，直线绕 B(0,b) 旋转，截距不动',
      '点「k 变号」「b 变号」看平滑的缓动旋转与平移',
      'k=0 时直线水平，此时是常数函数 y=b'
    ],
    legend:[{c:C.blue,t:'主直线 y=kx+b'},{c:C.orange,t:'截距 B(0,b)·平移'},{c:C.green,t:'斜率点 Q·旋转'}],
    hint:'B 点管上下，Q 点管倾斜',
    interaction:'先解锁画布：拖橙色 B 点改 b（上下平移），拖绿色 Q 点改 k（绕 B 旋转）；也可拖右侧滑块或点变号按钮看缓动演示。',
    scenario:['判断一次函数的增减性、经过哪些象限','从图像快速读出与两坐标轴的交点','理解 k、b 各自独立控制图像的形状与位置'],
    figure:['蓝色主直线与坐标轴刻度','橙色截距点 B(0,b) 与绿色斜率三角形 Δx、Δy','x 轴上标出直线与 x 轴的交点'],
    example:[
      'y=2x−4：k=2>0 递增；b=−4，过一、三、四象限；与 y 轴交于 (0,−4)，与 x 轴交于 (2,0)。',
      '把 y=2x−4 的 k 变为 −2：直线绕 (0,−4) 旋转，变为下降；截距仍是 −4 不变。'
    ],
    mistakes:[
      '把 k 与 b 的作用弄反：k 管倾斜旋转，b 管上下平移',
      '误以为改 k 会让直线上下移动——其实直线恒过 (0,b)，不会平移',
      'k=0 时是常数函数 y=b，不是一次函数；除非 b=0 否则没有 x 轴交点'
    ],
    controls:[
      {type:'range',key:'k',label:'斜率 k（旋转）',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'b',label:'截距 b（平移）',min:-4,max:4,step:0.1,digits:1},
      {type:'buttons',key:'presets',items:[
        {label:'k 变号（旋转）',onclick:linKFlip},
        {label:'b 变号（平移）',onclick:linBFlip}
      ]}
    ],
    init:function(b,s){s.k=1.5;s.b=1;},
    draw:function(b,s){
      linAxes(b);linMain(b,s);
      var k=s.k,bb=s.b;
      b.readout('y = '+linNF(k,1)+'x '+(bb>=0?'+ ':'− ')+linNF(Math.abs(bb),1)+
        '　'+linTrend(k)+'　过'+linQuads(k,bb)+'象限　y轴(0,'+linNF(bb,1)+')　x轴'+
        (Math.abs(k)>0.03?'('+linNF(-bb/k,2)+', 0)':'无（与 x 轴平行）'));
    },
    onDrag:linOnDrag
  };
  R(linearFn);

  /* ---------- 一次函数（进阶）· 交点与方程、不等式 ---------- */
  var linearAdv={
    id:'linear-function-advanced',domain:'algebra',topic:'function',level:2,
    title:'一次函数 · 交点与方程、不等式',brief:'两条直线的交点对应方程的解；图像谁在上、谁在下对应不等式解集。对比直线按需开启。',
    keys:'一次函数 交点 方程 不等式 解集 两直线 对比',
    idea:'两条直线 y=kx+b 与 y=k₂x+b₂ 的交点横坐标，就是方程 kx+b=k₂x+b₂ 的解；图像在上方对应的 x 范围，就是不等式 kx+b>k₂x+b₂ 的解集。',
    proof:[
      '两直线交点满足 kx+b=k₂x+b₂，移项得 (k−k₂)x=b₂−b，故 x=(b₂−b)/(k−k₂)（k≠k₂ 时有唯一交点）。',
      '把交点横坐标代回任一解析式即得交点纵坐标。若 k=k₂ 且 b≠b₂，两线平行无交点，方程无解；若还 b=b₂，两线重合、解有无数个。',
      '比较两图像高低：kx+b>k₂x+b₂ 时，主直线在上方。若 k>k₂，交点右侧主直线更高，解集为 x>交点横坐标；若 k<k₂，取交点左侧。'
    ],
    formula:'交点横坐标 x=(b₂−b)/(k−k₂)　｜　kx+b=k₂x+b₂ 的解 = 交点横坐标　｜　kx+b>k₂x+b₂ 的解集看图像上下',
    tips:[
      '先解锁画布；点「显示对比直线」调出紫色虚线',
      '拖橙色 B 点或绿色 Q 点改变主直线，观察交点怎样移动',
      '可调对比斜率 k₂、截距 b₂；交点横坐标即时给出方程解',
      'x 轴上的绿色粗线标出不等式 kx+b>k₂x+b₂ 的解集',
      '预测挑战：勾选「预测模式」，调 k、b 让主直线与青色虚线重合，再点「揭晓」看目标解析式'
    ],
    legend:[{c:C.blue,t:'主直线 y=kx+b'},{c:C.orange,t:'截距 B·平移'},
      {c:C.green,t:'斜率点 Q·旋转'},{c:C.purple,t:'对比线 y=k₂x+b₂'},
      {c:C.red,t:'交点（方程的解）'},{c:C.teal,t:'预测目标线（青色虚线）'}],
    hint:'交点横坐标 = 方程解；图像上下 = 不等式解集',
    interaction:'先解锁画布，点「显示对比直线」开启第二组参数；拖动主直线上的 B、Q 点，观察交点与方程解、不等式解集如何变化。',
    scenario:['用图像法解一元一次方程（求交点横坐标）','用图像法解一元一次不等式（看图像上下）','理解「方程的解 = 交点」「不等式解集 = 图像高低」','预测挑战：调 k、b 对齐目标直线，反推它的解析式'],
    figure:['蓝色主直线与紫色虚线对比直线','红色交点及其在 x 轴上的投影','x 轴上的绿色解集区间'],
    example:[
      '解 2x−4=−x+2：两线交点横坐标 x=2，即方程的解为 x=2（代入得 y=0，交点 (2,0)）。',
      '解 2x−4 > −x+2：因 2>−1，交点右侧主直线更高，故解集为 x>2。'
    ],
    mistakes:[
      '把交点横坐标与纵坐标弄反：方程的解是横坐标 x',
      '找不等式解集时忘记比较 k 与 k₂：k<k₂ 时解集在交点左侧',
      'k=k₂ 时两线平行无交点（方程无解），不能套用 x=(b₂−b)/(k−k₂)'
    ],
    controls:[
      {type:'range',key:'k',label:'斜率 k（旋转）',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'b',label:'截距 b（平移）',min:-4,max:4,step:0.1,digits:1},
      {type:'buttons',key:'presets',items:[
        {label:'k 变号（旋转）',onclick:linKFlip},
        {label:'b 变号（平移）',onclick:linBFlip}
      ]},
      {type:'check',key:'showCompare',label:'显示对比直线（交点与不等式）'},
      {type:'range',key:'k2',label:'对比斜率 k₂',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'b2',label:'对比截距 b₂',min:-4,max:4,step:0.1,digits:1},
      {type:'buttons',key:'compareOps',items:[
        {label:'两线平行',onclick:function(bd,s){bd._tween=null;s.k2=s.k;s.b2=s.b+2;s.showCompare=true;H.refreshControls(s);}},
        {label:'隐藏对比',onclick:function(bd,s){bd._tween=null;s.showCompare=false;H.refreshControls(s);}}
      ]},
      {type:'check',key:'predictMode',label:'预测模式：显示目标直线（调 k、b 去对齐）'},
      {type:'buttons',key:'predictOps',items:[
        {label:'揭晓目标式',onclick:function(bd,s){s.predictRevealed=true;}},
        {label:'换一个目标',onclick:function(bd,s){predNew(s);bd.finishTween();}}
      ]}
    ],
    init:function(b,s){
      s.k=1.5;s.b=1;s.k2=-0.8;s.b2=-2;s.showCompare=false;
      s.predictMode=false;predNew(s);   // 预测模式初始目标（隐藏，开启时才画）
    },
    draw:function(b,s){
      linAxes(b);linMain(b,s);
      var P=linP,k=s.k,bb=s.b,k2=s.k2,b2=s.b2,show=!!s.showCompare,extra='';

      /* 预测模式：画一条目标虚线（解析式先隐藏），学生调 k、b 去对齐，再揭晓。
         独立于对比直线逻辑，不改动交点/不等式演示。 */
      if(s.predictMode){
        var tk=s.tk,tb=s.tb;
        b.line(P(-6.3,-6.3*tk+tb),P(6.3,6.3*tk+tb),C.teal,3,'8 5',.9);
        var hit=Math.abs(k-tk)<0.06&&Math.abs(bb-tb)<0.06;
        var label=s.predictRevealed
          ? ('目标：y='+linNF(tk,1)+'x '+(tb>=0?'+ ':'− ')+linNF(Math.abs(tb),1))
          : '目标线（先猜，别看答案）';
        /* 标签落在目标线上且在可见区内：优先右侧 x=4.4，越界则退到上/下边界交点 */
        var lx=4.4,ly=tk*lx+tb;
        if(ly>3.2||ly<-3.2){
          ly=ly>0?3.2:-3.2;
          lx=Math.abs(tk)>0.06?(ly-tb)/tk:0;
          if(lx>5.4||lx<-5.4){lx=lx>0?5.4:-5.4;ly=tk*lx+tb;}
        }
        b.text({x:P(lx,ly).x+(lx>0?-8:8),y:P(lx,ly).y-11},label,C.teal,12,lx>0?'end':'start',800);
        if(hit){
          b.text({x:P(-5.9,3.9).x,y:P(-5.9,3.9).y},'✓ 已对齐目标！',C.green,15,'start',800);
          extra+='　｜预测：✓ 已对齐（k='+linNF(k,1)+'，b='+linNF(bb,1)+'）';
        }else{
          var dk=tk-k,db=tb-bb;
          extra+='　｜预测：目标线已画出，调 k（'+(dk>0.05?'再增大':dk<-0.05?'再减小':'已对')+'）、b（'+
            (db>0.05?'再增大':db<-0.05?'再减小':'已对')+'）去对齐'+(s.predictRevealed?'　目标 y='+linNF(tk,1)+'x+' +linNF(tb,1):'');
        }
      }
      if(show){
        b.line(P(-6.3,-6.3*k2+b2),P(6.3,6.3*k2+b2),C.purple,2.6,'7 5');
        function band(xa,xb){
          var by=0.18;
          b.line(P(xa,by),P(xb,by),C.green,6,null,0.55);
          b.line(P(xa,by-0.13),P(xa,by+0.13),C.green,2);
          b.line(P(xb,by-0.13),P(xb,by+0.13),C.green,2);
        }
        var den=k-k2;
        if(Math.abs(den)<0.03){
          if(Math.abs(bb-b2)<0.03)extra+='　｜两线重合：交点无数个';
          else{band(-6.2,6.2);extra+='　｜两线平行：无交点，方程无解；不等式'+(bb>b2?'恒成立':'无解');}
        }else{
          var xi=(b2-bb)/den,yi=k*xi+bb,Ip=P(xi,yi);
          if(Math.abs(xi)<=6.3&&Math.abs(yi)<=4.3){
            b.circle(Ip,7,C.red,'#fff',2.6);b.line(P(xi,0),Ip,C.red,1.3,'3 3',0.7);
            b.text({x:Ip.x+11,y:Ip.y-10},'交点('+linNF(xi,2)+','+linNF(yi,2)+')',C.red,12,'start',700);
            b.text({x:P(xi,0).x,y:P(xi,0).y+48},'x='+linNF(xi,2),C.red,11,'middle',700);
          }
          if(den>0)band(Math.max(-6.2,xi),6.2);else band(-6.2,Math.min(6.2,xi));
          extra+='　｜交点横坐标 '+linNF(xi,2)+' ⇔ 方程解 x='+linNF(xi,2)+'　不等式>解集 x'+(den>0?'>':'<')+linNF(xi,2);
        }
      }
      b.readout('y = '+linNF(k,1)+'x '+(bb>=0?'+ ':'− ')+linNF(Math.abs(bb),1)+
        (show?'　对比 y='+linNF(k2,1)+'x '+(b2>=0?'+ ':'− ')+linNF(Math.abs(b2),1):'　（对比直线未开启）')+extra);
    },
    onDrag:linOnDrag
  };
  R(linearAdv);

  /* ---------- 一次函数③ · 变化率与残影：把 k 从「倾角」正解为「变化率」 ----------
     教学意图：k 的抽象不在于倾斜，而在于「每向右走 1，y 变 k」。让动点沿直线
     匀速跑，Δx 匀速增长、Δy=k·Δx 同步增长，比值恒为 k；拖 k 留扇形残影、
     拖 b 留平行带残影，用「运动留痕」区分两种参数的本质差别。 */
  /* 在参数改变前调用，把「改变前」的状态压入对应轨迹（保留最近 14 条） */
  function rateRecord(b,key){
    var s=b.state;
    var trail=key==='k'?(b._trailK||(b._trailK=[])):(b._trailB||(b._trailB=[]));
    var last=trail[trail.length-1];
    if(!last||Math.abs(last.k-s.k)>0.06||Math.abs(last.b-s.b)>0.06){
      trail.push({k:s.k,b:s.b});
      if(trail.length>14)trail.shift();
    }
  }
  function rateClear(b){b._trailK=[];b._trailB=[];}
  function rateDrawTrails(b){
    var P=linP;
    (b._trailK||[]).forEach(function(t,i,arr){
      var op=0.10+0.32*(i+1)/arr.length;
      b.line(P(-6.3,-6.3*t.k+t.b),P(6.3,6.3*t.k+t.b),C.orange,1.7,null,op);
    });
    (b._trailB||[]).forEach(function(t,i,arr){
      var op=0.10+0.32*(i+1)/arr.length;
      b.line(P(-6.3,-6.3*t.k+t.b),P(6.3,6.3*t.k+t.b),C.green,1.7,null,op);
    });
  }
  var linearRate={
    id:'linear-function-rate',domain:'algebra',topic:'function',level:1,
    title:'一次函数 · 变化率与残影',
    brief:'k=Δy/Δx 是变化率（坡度），不是倾角；拖 k 留扇形、拖 b 留平行带，看懂两个参数的本质差别。',
    keys:'一次函数 变化率 斜率 坡度 残影 旋转 平移 Δy/Δx',
    idea:'k 的本质是「每向右走 1 格，y 上升 k 格」的变化率（坡度）。让动点沿直线匀速跑，Δx 匀速增长而 Δy=k·Δx 同步增长，比值恒为 k——这就是「斜率不变」的真正含义。拖 k 时直线绕定点 B(0,b) 转动、一串位置扫出扇形；拖 b 时斜率不变、一串位置排成平行带。',
    proof:[
      '从 B(0,b) 出发水平走 Δx、再竖直走 Δy 回到直线，则 Δy=k·Δx，所以 Δy/Δx=k 恒成立，与走多远无关——这就是「变化率恒定」。',
      'k 是「变化快慢」：k=2 时每走 1 格上升 2 格，k=−1 时每走 1 格下降 1 格。k 不是倾角：k 从 1 变到 2，倾斜角并不翻倍（正切不是线性的）。',
      '拖 k 时直线绕定点 B(0,b) 转动，一串位置扫出扇形（交于一点）；拖 b 时斜率不变，一串位置排成平行带（永不相交）。'
    ],
    formula:'k = Δy / Δx（每步爬升量，坡度）　｜　y = kx + b　｜　b = 起点高度（x=0 时的 y）',
    tips:[
      '点「播放」，看动点 P 沿直线匀速跑，Δx 与 Δy 同步跳动、比值恒为 k',
      '拖橙色 B 点（或 b 滑块）：留下绿色平行带残影，方向始终不变',
      '拖绿色 Q 点（或 k 滑块）：留下橙色扇形残影，全部绕 B 转动',
      '点「清除残影」重置画面；把 k 调成负数，观察 Δy 变成下降'
    ],
    legend:[{c:C.blue,t:'主直线 y=kx+b'},{c:C.orange,t:'拖 k·扇形残影'},{c:C.green,t:'拖 b·平行带残影'},{c:C.red,t:'动点 P'}],
    hint:'k 是每步爬升量，不是倾角',
    interaction:'先点播放看动点跑动理解变化率；再拖动 B/Q 点或滑块，观察扇形与平行带两种残影。',
    scenario:['理解「斜率 = 变化率 = 每步爬升量」','区分「k 管转动」与「b 管平移」的本质','解释为什么 k 越大直线越陡'],
    figure:['匀速跑动的红点 P 与绿色直角三角形 Δx、Δy','拖 k 留下的橙色扇形残影','拖 b 留下的绿色平行带残影'],
    example:[
      'y=2x+1：从 B(0,1) 走 Δx=3，Δy=2×3=6，比值 Δy/Δx=6/3=2=k。每走 1 格上升 2 格。',
      'y=−1.5x+1：每走 1 格下降 1.5 格，Δy/Δx=−1.5=k，动点向右跑时 y 不断减小。'
    ],
    mistakes:[
      '把 k 当成倾斜角度：k 是 Δy/Δx 的比值（坡度），k 翻倍角度并不翻倍',
      '以为动点跑得越远 k 越大：Δx、Δy 同步变大，比值 k 始终不变',
      '把 b 当成「与 x 轴交点」：b 是起点高度（x=0 时的 y），是与 y 轴的交点纵坐标'
    ],
    controls:[
      {type:'range',key:'k',label:'变化率 k（坡度·旋转）',min:-4,max:4,step:0.1,digits:1,
        onchange:function(b,s){rateRecord(b,'k');}},
      {type:'range',key:'b',label:'起点高度 b（平移）',min:-4,max:4,step:0.1,digits:1,
        onchange:function(b,s){rateRecord(b,'b');}},
      {type:'buttons',key:'rateOps',items:[
        {label:'k 变号',onclick:function(b,s){b.finishTween();rateRecord(b,'k');b.tweenTo({k:Math.round(-s.k*10)/10},0.55);}},
        {label:'b 变号',onclick:function(b,s){b.finishTween();rateRecord(b,'b');b.tweenTo({b:Math.round(-s.b*10)/10},0.55);}},
        {label:'清除残影',onclick:function(b,s){rateClear(b);}}
      ]}
    ],
    init:function(b,s){s.k=1.5;s.b=1;s.px=0;b._trailK=[];b._trailB=[];},
    draw:function(b,s){
      var P=linP,k=s.k,bb=s.b;
      linAxes(b);rateDrawTrails(b);                 // 残影画在底层
      b.line(P(-6.3,-6.3*k+bb),P(6.3,6.3*k+bb),C.blue,3.4);
      var Bp=P(0,bb);
      b.circle(Bp,9,C.orange,'#fff',2.6);b.handle(Bp,'B',20);
      b.text({x:Bp.x+12,y:Bp.y-10},'B(0,'+linNF(bb,1)+')',C.orange,12,'start',700);
      var dx=2,qy=k*dx+bb,Hp=P(dx,bb),Qp=P(dx,qy);
      b.line(Bp,Hp,'#4f7a5b',1.5,'5 4');b.line(Hp,Qp,'#4f7a5b',1.5,'5 4');
      b.circle(Qp,7,C.green,'#fff',2.4);b.handle(Qp,'Q',20);
      b.text({x:Qp.x+10,y:Qp.y-11},'Q 改 k',C.green,11,'start',700);
      // 动点 P 与变化率三角形：Δx 匀速增，Δy=k·Δx
      var px=s.px==null?0:s.px,py=k*px+bb,Pp=P(px,py),Xp=P(px,bb);
      b.line(Bp,Xp,C.green,2,'4 3');b.line(Xp,Pp,C.green,2,'4 3');
      b.circle(Pp,8,C.red,'#fff',2.6);
      b.text({x:Pp.x+11,y:Pp.y-10},'P',C.red,12,'start',800);
      if(Math.abs(px)>0.15){
        b.text({x:(Bp.x+Xp.x)/2,y:Bp.y+16},'Δx='+linNF(px,2),'#4f7a5b',11,'middle',700);
        b.text({x:Xp.x+10,y:(Xp.y+Pp.y)/2},'Δy='+linNF(k*px,2),'#4f7a5b',11,'start',700);
      }
      b.readout('动点 P：Δx='+linNF(px,2)+'　Δy=k·Δx='+linNF(k*px,2)+
        '　｜　Δy/Δx='+linNF(k,2)+' 恒为 k　｜　坡度 k='+linNF(k,1)+'　起点 b='+linNF(bb,1)+
        '　'+(b.playing?'（跑动中）':'（点播放让 P 跑起来）'));
    },
    onDrag:function(b,n,w){
      b._tween=null;
      if(n==='B')rateRecord(b,'b');else if(n==='Q')rateRecord(b,'k');
      linOnDrag(b,n,w);
    },
    step:function(b,s,dt){
      s.px=(s.px==null?0:s.px)+dt*2.4;   // 水平匀速：每秒走 2.4 格
      if(s.px>6)s.px=0;                    // 到右端回到起点重新跑
    }
  };
  R(linearRate);

  /* ---------- 一次函数④ · 看图猜式：反向推参数（带连对计分） ----------
     认知冲突：学生习惯「拖参数看图像」，这里反过来——只看图像猜 k、b 符号与象限，
     先选后揭晓，制造「我以为…原来是…」的落差，训练中考高频的读图能力。 */
  var QUIZ_K=[-3,-2,-1.5,-1,-0.5,0.5,1,1.5,2,3];   // 避开 0 与过小值，图像清晰
  var QUIZ_B=[-3,-2,-1,1,2,3];
  function quizNew(s){
    var k=QUIZ_K[Math.floor(Math.random()*QUIZ_K.length)];
    var b=QUIZ_B[Math.floor(Math.random()*QUIZ_B.length)];
    s.qk=k;s.qb=b;
    s.qAnsK=null;s.qAnsB=null;s.qAnsQ=null;
    s.qRevealed=false;s.qFeedback='';
  }
  function quizSign(v){return v>0?1:(v<0?-1:0);}
  function quizCorrect(s){
    return !!(s.qAnsK!=null&&s.qAnsB!=null&&s.qAnsQ!=null&&
      s.qAnsK===quizSign(s.qk)&&s.qAnsB===quizSign(s.qb)&&s.qAnsQ===linQuads(s.qk,s.qb));
  }
  var linearQuiz={
    id:'linear-function-guess',domain:'algebra',topic:'function',level:1,
    title:'一次函数 · 看图猜式',
    brief:'藏起解析式，只看图像判断 k 的符号、b 的符号与所过象限——先猜后揭晓，连对有计分。',
    keys:'一次函数 看图 判断 k符号 b符号 象限 读图 练习',
    idea:'正向是「由式子画图像」，反向是「由图像读参数」。看直线上升还是下降定 k 的正负；看它与 y 轴交于上方还是下方定 b 的正负；再由 k、b 符号组合判断经过哪几个象限。这是中考读图题的核心。',
    proof:[
      'k 定增减：直线从左向右上升 ⟹ k>0；下降 ⟹ k<0；水平 ⟹ k=0。',
      'b 定纵截距：直线与 y 轴交于正半轴 ⟹ b>0；负半轴 ⟹ b<0；过原点 ⟹ b=0。',
      '象限由 k、b 符号共同决定：k>0、b>0 过一二三；k>0、b<0 过一三四；k<0、b>0 过一二四；k<0、b<0 过二三○四。'
    ],
    formula:'k 看升降　｜　b 看 y 轴交点　｜　象限由 (k,b) 符号组合决定',
    tips:[
      '先不看答案，独立判断三个问题，再点「揭晓答案」',
      '直线越陡不代表 k 的符号改变，只看上升还是下降',
      '判断象限时先看 k 定「主方向」，再用 b 决定往上还是往下平移',
      '连对会累计，答错归零；用「换一题」刷熟练度'
    ],
    legend:[{c:C.blue,t:'待判断的直线 y=kx+b'},{c:C.orange,t:'与 y 轴交点（定 b）'},{c:C.green,t:'x 轴交点'}],
    hint:'只看图，先猜后揭晓',
    scoreBadge:true,
    interaction:'观察画布上的直线，在右侧依次选择 k 符号、b 符号与所过象限，再点「揭晓答案」核对。',
    scenario:['由图像快速判断 k、b 的符号','由图像判断直线经过的象限','训练中考高频「一次函数图像与系数符号」读图题'],
    figure:['隐藏解析式的蓝色直线','与 y 轴、x 轴的交点（揭晓后标出数值）','揭晓后显示真实解析式与对错反馈'],
    example:[
      '图像左低右高、与 y 轴交于正半轴：k>0、b>0，过一、二、三象限。',
      '图像左高右低、与 y 轴交于负半轴：k<0、b<0，过二、三、四象限。'
    ],
    mistakes:[
      '把「越陡」当成 k 的符号：陡峭只看 |k| 大小，符号只看升／降',
      '找 b 时看成 x 轴交点：b 是 y 轴交点纵坐标，不是 x 轴交点',
      '判断象限只凭 k：必须结合 b 的符号才能确定过哪三个象限'
    ],
    controls:[
      {type:'choice',key:'qAnsK',label:'① k 的符号（看升降）',items:[
        {value:1,label:'k > 0'},{value:-1,label:'k < 0'}]},
      {type:'choice',key:'qAnsB',label:'② b 的符号（看 y 轴交点）',items:[
        {value:1,label:'b > 0'},{value:-1,label:'b < 0'}]},
      {type:'choice',key:'qAnsQ',label:'③ 经过的象限',items:[
        {value:'一、二、三',label:'一二三'},{value:'一、三、四',label:'一三四'},
        {value:'一、二、四',label:'一二四'},{value:'二、三、四',label:'二三四'}]},
      {type:'button',key:'quizReveal',label:'揭晓答案',onclick:function(b,s){
        if(s.qRevealed)return;
        if(s.qAnsK==null||s.qAnsB==null||s.qAnsQ==null){s.qFeedback='⚠ 请先答完三题';return;}
        s.qRevealed=true;
        if(quizCorrect(s)){s.qStreak=(s.qStreak||0)+1;s.qBest=Math.max(s.qBest||0,s.qStreak);s.qFeedback='✓ 全对！真实式子：'+quizExpr(s);}
        else{s.qStreak=0;s.qFeedback='✗ 再看一眼：'+quizExpr(s)+'　正确答案 k'+(quizSign(s.qk)>0?'>0':'<0')+'、b'+(quizSign(s.qb)>0?'>0':'<0')+'、过'+linQuads(s.qk,s.qb)+'象限';}
      }},
      {type:'button',key:'quizNext',label:'换一题 →',onclick:function(b,s){
        quizNew(s);H.refreshControls(s);
        // 清除选项选中态与对错着色
        Array.prototype.forEach.call(document.querySelectorAll('#mh-controls [data-choice]'),function(g){
          Array.prototype.forEach.call(g.children,function(x){x.classList.remove('on','correct','wrong');});
        });
      }}
    ],
    init:function(b,s){s.qStreak=0;s.qBest=0;quizNew(s);},
    draw:function(b,s){
      linAxes(b);
      var k=s.qk,bb=s.qb,P=linP;
      b.line(P(-6.3,-6.3*k+bb),P(6.3,6.3*k+bb),C.blue,3.4);
      var Bp=P(0,bb);b.circle(Bp,8,C.orange,'#fff',2.6);
      var show=s.qRevealed;
      b.text({x:Bp.x+12,y:Bp.y-10},show?'B(0,'+linNF(bb,1)+')':'B(0, ?)',C.orange,12,'start',700);
      if(Math.abs(k)>0.03){var xx=-bb/k;
        if(xx>=-6.3&&xx<=6.3){var Xp=P(xx,0);b.circle(Xp,5,C.green,'#fff',2);
          b.text({x:Xp.x,y:Xp.y+32},show?'('+linNF(xx,2)+',0)':'(?,0)',C.green,11,'middle',700);}}
      if(show){
        b.text({x:P(-5.8,4.0).x,y:P(-5.8,4.0).y},'真实：'+quizExpr(s),C.red,15,'start',800);
      }
      // 选项对错着色
      if(show){
        markChoice('qAnsK',quizSign(s.qk));markChoice('qAnsB',quizSign(s.qb));markChoice('qAnsQ',linQuads(s.qk,s.qb));
      }
      var sc=document.getElementById('mh-quiz-score');
      if(sc)sc.innerHTML='连对 <b>'+(s.qStreak||0)+'</b>　最高连对 <b>'+(s.qBest||0)+'</b>';
      b.readout((show?'✓ 已揭晓　':'? 请先判断　')+(s.qFeedback||'')+'　｜　点右侧选项作答');
    }
  };
  function quizExpr(s){return 'y = '+linNF(s.qk,1)+'x '+(s.qb>=0?'+ ':'− ')+linNF(Math.abs(s.qb),1);}
  function markChoice(key,truth){
    var g=document.querySelector('[data-choice="'+key+'"]');
    if(!g)return;
    Array.prototype.forEach.call(g.children,function(x){
      x.classList.remove('correct','wrong');
      var v=x.getAttribute('data-value');
      if(String(truth)===v)x.classList.add('correct');
      else if(x.classList.contains('on'))x.classList.add('wrong');
    });
  }
  R(linearQuiz);

  /* ---------- 最优方案 · 线性规划入门（初中版） ----------
     只用初中学过的知识：不等式组的解集（描点定一侧）、两直线交点=方程组解、
     一次函数的上下平移（复用 b 平移的直觉）、把角点代回式子比大小。
     不出现「可行域/目标函数/顶点定理」等高中术语。 */
  var LPX=140,LPY=490,LPS=70;                 // 本模型专用坐标映射
  function lpP(x,y){return{x:LPX+x*LPS,y:LPY-y*LPS};}
  function lpT(w){return{x:(w.x-LPX)/LPS,y:(LPY-w.y)/LPS};}
  function lpAxes(b){
    b.line(lpP(-0.6,0),lpP(11,0),'var(--mh-muted)',1.8);
    b.line(lpP(0,-1),lpP(0,6.6),'var(--mh-muted)',1.8);
    b.poly([lpP(11,0),lpP(10.75,0.14),lpP(10.75,-0.14)],'var(--mh-muted)',1);
    b.poly([lpP(0,6.6),lpP(-0.14,6.35),lpP(0.14,6.35)],'var(--mh-muted)',1);
    b.text({x:lpP(11,0).x+8,y:lpP(11,0).y+4},'x','var(--mh-muted)',13,'start',700);
    b.text({x:lpP(0,6.6).x+10,y:lpP(0,6.6).y-2},'y','var(--mh-muted)',13,'start',700);
    for(var i=1;i<=10;i++){var px=lpP(i,0);
      b.line({x:px.x,y:px.y-6},{x:px.x,y:px.y+6},'var(--mh-muted)',1);
      b.text({x:px.x,y:px.y+18},String(i),'var(--mh-muted)',10,'middle');}
    for(var j=1;j<=6;j++){var py=lpP(0,j);
      b.line({x:py.x-6,y:py.y},{x:py.x+6,y:py.y},'var(--mh-muted)',1);
      b.text({x:py.x-9,y:py.y+4},String(j),'var(--mh-muted)',10,'end');}
    b.text({x:lpP(0,0).x-8,y:lpP(0,0).y+18},'0','var(--mh-muted)',10,'end');
  }
  var LP_VERTS=[{x:0,y:0,v:0},{x:8,y:0,v:24},{x:6,y:2,v:26},{x:0,y:5,v:20}];
  var linearLP={
    id:'linear-programming',domain:'practice',topic:'application',level:3,
    title:'最优方案 · 线性规划入门',
    brief:'摆摊卖 A、B 两种商品，本钱和货架有限——怎么进货赚最多？只用不等式组、交点与一次函数平移就能解决。',
    keys:'线性规划 最优方案 不等式组 一次函数平移 交点 初中 应用题',
    idea:'把「能选的方案」用不等式组圈成一块区域，把「赚钱多少」写成 P=3x+4y（即 y=−0.75x+P/4，是一条一次函数直线）。P 越大直线越往上平移，最后离开这块区域时经过的角点，就是最赚钱的方案。全程只用初中知识。',
    proof:[
      '设卖 A 商品 x 件、B 商品 y 件。限制条件：x≥0、y≥0（数量非负）；x+y≤8（货架只能放 8 件）；x+2y≤10（本钱 10 元，A 成本 1 元、B 成本 2 元）。',
      '把每个不等式看成一条直线，用「代入 (0,0) 判断在哪一侧」描出所有能选的点，得到一块区域（蓝绿色阴影）。它的角点由两两直线的交点给出：解方程组 x+y=8 与 x+2y=10 得 (6,2)。',
      '利润 P=3x+4y 改写成 y=−0.75x+P/4，是一次函数：P 增大时直线整体平移。把角点代回 P=3x+4y 比大小：(0,0)=0、(8,0)=24、(6,2)=26、(0,5)=20，最大 26——即 A 卖 6 件、B 卖 2 件。'
    ],
    formula:'P = 3x + 4y　⇔　y = −0.75x + P/4（一次函数平移）　｜　最大利润在角点取得',
    tips:[
      '先读限制条件：x+y≤8 是货架，x+2y≤10 是本钱，x、y 都不能为负',
      '蓝绿色阴影是「所有能选的方案」；四个角点由边界直线相交得到',
      '拖动橙色点或「利润线 P」滑块，看直线向上平移；它最后离开阴影的点就是最优',
      '点「顶点代入表」把四个角点代回 P=3x+4y 比大小，验证平移的结论'
    ],
    legend:[{c:C.blue,t:'限制 x+y≤8'},{c:C.purple,t:'限制 x+2y≤10'},{c:C.green,t:'能选的方案区域'},{c:C.orange,t:'利润线 P=3x+4y'},{c:C.red,t:'最优角点'}],
    hint:'平移利润线，最后离开区域的角点最优',
    interaction:'拖动右侧「利润线 P」滑块或画布上橙色点，让利润线向上平移；观察它最后碰到阴影的哪个角点。',
    scenario:['用不等式组刻画出所有可行方案','用一次函数平移找到最大利润','体会「限制条件 + 目标」的优化问题建模'],
    figure:['蓝绿色阴影：满足全部限制的方案区域','四个角点及标注的最优角点 (6,2)','橙色利润线 y=−0.75x+P/4 随 P 平移'],
    example:[
      'A 商品赚 3 元、B 商品赚 4 元，货架 8 件、本钱 10 元。方案 (6,2)：6+2=8≤8，6+2×2=10≤10，利润 3×6+4×2=26 元，最大。',
      '方案 (8,0) 虽然件数用满，但利润 3×8=24 元 < 26 元；方案 (0,5) 利润 4×5=20 元，都不是最优。'
    ],
    mistakes:[
      '只看「货架放满」就选 (8,0)：件数多不等于赚钱多，要代入利润式比较',
      '把限制条件的不等号方向画反：用测试点 (0,0) 代入判断阴影在哪一侧',
      '以为最优点一定在区域中间：把利润线平移后会发现最优总在边界角点上'
    ],
    controls:[
      {type:'range',key:'P',label:'利润线 P（上下平移）',min:0,max:32,step:0.5,digits:1},
      {type:'buttons',key:'lpOps',items:[
        {label:'自动平移演示',onclick:function(b,s){b.finishTween();b.tweenTo({P:26},2.2);}},
        {label:'跳到最优 P=26',onclick:function(b,s){b.finishTween();s.P=26;H.refreshControls(s);}},
        {label:'顶点代入表',onclick:function(b,s){s.showCalc=!s.showCalc;H.refreshControls(s);}}
      ]}
    ],
    init:function(b,s){s.P=8;s.showCalc=false;},
    draw:function(b,s){
      var P=s.P||0;
      lpAxes(b);
      // 限制条件直线（虚线）
      b.line(lpP(0,8),lpP(8,0),C.blue,2.4,'6 4');
      b.line(lpP(0,5),lpP(10,0),C.purple,2.4,'6 4');
      b.text({x:lpP(1.2,6.9).x,y:lpP(1.2,6.9).y},'x+y≤8（货架）',C.blue,12,'start',700);
      b.text({x:lpP(6.4,1.1).x,y:lpP(6.4,1.1).y},'x+2y≤10（本钱）',C.purple,12,'start',700);
      // 能选的方案区域（填充）
      b.poly([lpP(0,0),lpP(8,0),lpP(6,2),lpP(0,5)],C.green,.18,C.green,2.2);
      LP_VERTS.forEach(function(v){
        var best=v.v===26;
        b.circle(lpP(v.x,v.y),best?8:5,best?C.red:C.green,'#fff',best?2.8:2);
        b.text({x:lpP(v.x,v.y).x+(best?12:8),y:lpP(v.x,v.y).y-8},
          '('+v.x+','+v.y+')→'+v.v+(best?' 最优':''),best?C.red:'var(--mh-muted)',best?12:11,'start',best?800:500);
      });
      // 利润线 y=-0.75x+P/4，可拖橙色手柄改 P
      var xmax=Math.min(10.6,P/3);
      if(xmax>0.05){
        var ytop=P/4;
        b.line(lpP(0,ytop),lpP(xmax,ytop-0.75*xmax),C.orange,3.4);
        var hp=lpP(0,ytop);
        if(ytop<=6.5){b.circle(hp,7,C.orange,'#fff',2.4);b.handle(hp,'P',18);}
        b.text({x:lpP(xmax,ytop-0.75*xmax).x-4,y:lpP(xmax,ytop-0.75*xmax).y-9},
          '利润线 P='+linNF(P,1),C.orange,12,'end',700);
      }
      if(s.showCalc){
        var tx=lpP(0,0).x+520,ty=lpP(0,6).y;
        b.text({x:tx,y:ty},'角点代入 P=3x+4y',C.ink,13,'start',800);
        LP_VERTS.forEach(function(v,i){
          b.text({x:tx,y:ty+20+i*19},'('+v.x+','+v.y+') → 3×'+v.x+'+4×'+v.y+'='+v.v+(v.v===26?'  ← 最大':''),
            v.v===26?C.red:'var(--mh-muted)',12,'start',v.v===26?800:500);
        });
      }
      var atBest=Math.abs(P-26)<0.3;
      b.readout('利润线 P=3x+4y　当前 P='+linNF(P,1)+
        '　｜　四个角点利润：(0,0)=0、(8,0)=24、(6,2)=26、(0,5)=20'+
        '　｜　最大 26 元（A 6 件、B 2 件）'+(atBest?'　✓ 已到最优':''));
    },
    onDrag:function(b,n,w){
      if(n==='P'){
        var m=lpT(w);
        b.state.P=Math.max(0,Math.min(32,Math.round(4*m.y*2)/2));
        H.refreshControls(b.state);
      }
    }
  };
  R(linearLP);

  /* ---------- 反比例函数 k 的几何意义 ---------- */
  var inverseFn={
    id:'inverse-function',domain:'algebra',topic:'function',level:2,
    title:'反比例函数 · k 的几何意义',brief:'y=k/x 上任意一点向两坐标轴作垂线，围成的矩形面积恒为 |k|。',
    keys:'反比例函数 双曲线 k 面积不变 矩形',
    idea:'设 P(x,y) 在 y=k/x 上，则 xy=k。P 向两轴作垂线围成的矩形面积 = |x|·|y| = |xy| = |k|，与 P 的位置无关——这就是 k 的几何意义。',
    proof:['由 y=k/x 得 xy=k。','矩形面积 = |x|·|y| = |xy| = |k|，与点 P 的位置无关。','所以双曲线上任意一点对应的矩形面积都相等，都等于 |k|。'],
    formula:'y = k/x　矩形面积 S = |x·y| = |k|（恒定）',
    tips:['拖动双曲线上的点 P，观察矩形面积读数','改变 k，观察双曲线开口与矩形面积的变化','注意矩形面积始终等于 |k|'],
    legend:[{c:C.blue,t:'双曲线 y=k/x'},{c:C.orange,t:'面积矩形'}],
    hint:'面积不变：S = |k|',
    interaction:'拖动双曲线上的点 P，或改变 k，观察矩形面积。',
    controls:[
      {type:'range',key:'k',label:'比例系数 k',min:-8,max:8,step:0.2,digits:1},
      {type:'range',key:'x',label:'点 P 的横坐标',min:0.8,max:5,step:0.05,digits:2}
    ],
    init:function(b,s){s.k=4;s.x=2;},
    draw:function(b,s){
      var g=b.scene,ox=450,oy=300,sc=52;
      function P(x,y){return{x:ox+x*sc,y:oy-y*sc};}
      b.line(P(-7,0),P(7,0),'#94a3b8',1.8);b.line(P(0,-5),P(0,5),'#94a3b8',1.8);
      b.text({x:P(7,0).x+6,y:oy+18},'x','var(--mh-muted)',13,'start',700);
      b.text({x:ox+10,y:P(0,5).y},'y','var(--mh-muted)',13,'start',700);
      if(Math.abs(s.k)>0.05){
        // 双曲线两支
        [[-1],[1]].forEach(function(br){
          var sign=br[0],pts=[];
          for(var x=sign*0.5;Math.abs(x)<=7;x+=sign*0.08){
            var y=s.k/x;if(Math.abs(y)<=6)pts.push(P(x,y));
          }
          if(pts.length>1)b.polyline(pts,C.blue,2.6);
        });
      }
      var x=s.x,y=s.k/x;
      // 面积矩形
      b.poly([P(0,0),P(x,0),P(x,y),P(0,y)],C.orange,.16,C.orange,2);
      b.line(P(x,0),P(x,y),C.orange,1.6,'4 4');
      b.line(P(0,y),P(x,y),C.orange,1.6,'4 4');
      var pp=P(x,y);b.circle(pp,8,C.purple,C.purple,2);b.handle(pp,'P',16);
      b.text({x:pp.x+11,y:pp.y-8},'P('+x.toFixed(1)+','+y.toFixed(1)+')',C.purple,12,'start',700);
      b.text({x:P(x/2,y/2).x,y:P(x/2,y/2).y},'S=|k|='+Math.abs(s.k).toFixed(1),C.orange,13,'middle',800);
      b.readout('P('+x.toFixed(2)+', '+y.toFixed(2)+') · xy = '+(x*y).toFixed(2)+' · 矩形面积 = '+Math.abs(x*y).toFixed(2)+' = |k|');
    },
    onDrag:function(b,n,w){
      var s=b.state;
      if(n==='P')s.x=Math.max(0.5,Math.min(5,(w.x-450)/52));
      H.refreshControls(s);
    }
  };
  R(inverseFn);

  /* ---------- 二次函数 a/b/c ---------- */
  var quadFn={
    id:'quadratic-function',domain:'algebra',topic:'function',level:2,
    title:'二次函数 · a/b/c 的作用',brief:'y=ax²+bx+c：a 控制开口方向与宽窄，b 与 a 共同决定对称轴，c 是纵截距。',
    keys:'二次函数 抛物线 开口 对称轴 顶点 a b c',
    idea:'a 决定开口（a>0 向上，a<0 向下，|a| 越大越窄）；c 是与 y 轴交点；对称轴 x=−b/(2a)，顶点由 a、b、c 共同决定。',
    proof:['a>0 开口向上有最小值，a<0 开口向下有最大值；|a| 越大开口越窄。','令 x=0 得 y=c，抛物线过点 (0,c)。','配方 y=a(x+b/2a)² + (4ac−b²)/4a，得对称轴 x=−b/(2a)，顶点纵坐标为 (4ac−b²)/(4a)。'],
    formula:'y = ax²+bx+c　对称轴 x = −b/(2a)　顶点 (−b/2a, (4ac−b²)/4a)',
    tips:['分别拖动 a、b、c，观察抛物线如何变化','把 a 调成负数，观察开口翻转','观察对称轴与顶点的实时读数'],
    legend:[{c:C.blue,t:'抛物线 y=ax²+bx+c'},{c:C.orange,t:'顶点'},{c:C.green,t:'对称轴'}],
    hint:'a 定开口，c 定截距，对称轴由 a、b 定',
    interaction:'拖动 a、b、c 滑块，观察抛物线的开口、对称轴与顶点如何变化。',
    controls:[
      {type:'range',key:'a',label:'a（开口）',min:-2,max:2,step:0.05,digits:2},
      {type:'range',key:'b',label:'b',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'c',label:'c（纵截距）',min:-4,max:4,step:0.1,digits:1}
    ],
    init:function(b,s){s.a=1;s.b=-2;s.c=-3;},
    draw:function(b,s){
      var g=b.scene,ox=450,oy=300,sc=48;
      function P(x,y){return{x:ox+x*sc,y:oy-y*sc};}
      b.line(P(-7,0),P(7,0),'#94a3b8',1.6);b.line(P(0,-6),P(0,6),'#94a3b8',1.6);
      b.text({x:P(7,0).x+6,y:oy+18},'x','var(--mh-muted)',13,'start',700);
      b.text({x:ox+10,y:P(0,6).y},'y','var(--mh-muted)',13,'start',700);
      function f(x){return s.a*x*x+s.b*x+s.c;}
      var pts=[];for(var x=-6;x<=6;x+=0.05){var y=f(x);if(Math.abs(y)<=7)pts.push(P(x,y));}
      if(pts.length>1)b.polyline(pts,C.blue,2.8);
      var cp=P(0,s.c);b.circle(cp,5,'#0ea5e9','#fff',2);
      b.text({x:cp.x+8,y:cp.y+14},'(0,'+s.c.toFixed(1)+')','#0ea5e9',11,'start');
      var eq='y = '+s.a.toFixed(2)+'x² '+(s.b>=0?'+':'-')+Math.abs(s.b).toFixed(1)+'x '+(s.c>=0?'+':'-')+Math.abs(s.c).toFixed(1);
      // a≈0 时退化为一次函数：无对称轴/顶点，Δ 判据失效，避免 Infinity / 假「两个交点」
      if(Math.abs(s.a)<1e-6){
        var xint=Math.abs(s.b)<1e-9?null:-s.c/s.b;
        b.text(P(0,-255),'a = 0：退化为一次函数 y = '+s.b.toFixed(1)+'x + '+s.c.toFixed(1),C.purple,13,'middle',700);
        b.readout(eq+'　a=0 非二次函数：无对称轴/顶点　'+
          (xint===null?(Math.abs(s.c)<1e-9?'恒为 0（无数根）':'无零点'):'与 x 轴交于 x='+xint.toFixed(2)+'（一个交点）'));
        return;
      }
      var xv=-s.b/(2*s.a),yv=f(xv);
      if(Math.abs(xv)<=7&&Math.abs(yv)<=7){
        // 对称轴
        b.line(P(xv,-7),P(xv,7),C.green,1.6,'5 5');
        var vp=P(xv,yv);b.circle(vp,7,C.orange,'#fff',2.5);
        b.text({x:vp.x+10,y:vp.y-8},'顶点('+xv.toFixed(2)+','+yv.toFixed(2)+')',C.orange,12,'start',700);
      }
      var d=s.b*s.b-4*s.a*s.c;
      var rootTxt=d>0?'两个交点':d<0?'无交点':'一个交点(相切)';
      b.readout(eq+'　对称轴 x='+xv.toFixed(2)+'　Δ='+d.toFixed(2)+'（'+rootTxt+'）');
    }
  };
  R(quadFn);

  /* ---------- 函数图像平移 ---------- */
  var translateFn={
    id:'function-translation',domain:'algebra',topic:'function',level:2,
    title:'函数图像 · 平移变换',brief:'y=f(x−h)+k：h 控制左右平移（左加右减），k 控制上下平移（上加下减）。',
    keys:'函数平移 左加右减 上加下减 变换',
    idea:'f(x−h) 把图像向右平移 h（h>0 右移，h<0 左移，即"左加右减"）；f(x)+k 把图像向上平移 k（k>0 上移，即"上加下减"）。',
    proof:['基础函数 f(x)=x²，顶点在原点。','y=(x−h)²：顶点从 (0,0) 移到 (h,0)——因为要 y=0 需 x=h，即右移 h。','y=(x−h)²+k：顶点再上移 k 到 (h,k)。这就是"左加右减，上加下减"。'],
    formula:'y = f(x−h) + k　右移 h（h<0 即左移），上移 k（k<0 即下移）',
    tips:['拖动 h，观察图像左右平移（注意方向）','拖动 k，观察图像上下平移','对照虚线的基础图像 f(x)=x²'],
    legend:[{c:'#cbd5e1',t:'基础图像 f(x)=x²'},{c:C.blue,t:'平移后的图像'}],
    hint:'左加右减，上加下减',
    interaction:'拖动 h、k 滑块，观察图像相对基础图像的平移。',
    controls:[
      {type:'range',key:'h',label:'水平位移 h',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'k',label:'竖直位移 k',min:-4,max:4,step:0.1,digits:1}
    ],
    init:function(b,s){s.h=2;s.k=1;},
    draw:function(b,s){
      var g=b.scene,ox=450,oy=300,sc=48;
      function P(x,y){return{x:ox+x*sc,y:oy-y*sc};}
      b.line(P(-7,0),P(7,0),'#94a3b8',1.6);b.line(P(0,-6),P(0,6),'#94a3b8',1.6);
      b.text({x:P(7,0).x+6,y:oy+18},'x','var(--mh-muted)',13,'start',700);
      b.text({x:ox+10,y:P(0,6).y},'y','var(--mh-muted)',13,'start',700);
      // 基础图像
      var base=[];for(var x=-6;x<=6;x+=0.05){var y=x*x;if(Math.abs(y)<=7)base.push(P(x,y));}
      if(base.length>1)b.polyline(base,'#cbd5e1',2,'6 4');
      // 平移后
      var shifted=[];for(var x2=-6;x2<=6;x2+=0.05){var y2=(x2-s.h)*(x2-s.h)+s.k;if(Math.abs(y2)<=7)shifted.push(P(x2,y2));}
      if(shifted.length>1)b.polyline(shifted,C.blue,3);
      // 顶点与位移箭头
      var v0=P(0,0),v1=P(s.h,s.k);
      b.circle(v0,5,'#cbd5e1','#fff',2);
      b.circle(v1,7,C.orange,'#fff',2.5);
      b.text({x:v1.x+10,y:v1.y-8},'('+s.h.toFixed(1)+','+s.k.toFixed(1)+')',C.orange,12,'start',700);
      // 位移虚线
      b.line(v0,v1,C.green,1.8,'4 4');
      b.text({x:(v0.x+v1.x)/2,y:(v0.y+v1.y)/2-10},'位移','#4f7a5b',11,'middle');
      var htxt=s.h>0?'右移 '+s.h.toFixed(1):s.h<0?'左移 '+Math.abs(s.h).toFixed(1):'不左右移';
      var ktxt=s.k>0?'上移 '+s.k.toFixed(1):s.k<0?'下移 '+Math.abs(s.k).toFixed(1):'不上下移';
      b.readout('y = (x−'+s.h.toFixed(1)+')² + '+s.k.toFixed(1)+'　'+htxt+'、'+ktxt);
    }
  };
  R(translateFn);

  /* ---------- 判别式与交点 ---------- */
  var discriminant={
    id:'discriminant',domain:'algebra',topic:'equation',level:2,
    title:'判别式 Δ 与交点个数',brief:'抛物线 y=ax²+bx+c 与 x 轴的交点个数，由判别式 Δ=b²−4ac 决定。',
    keys:'判别式 交点 一元二次方程 根 Δ',
    idea:'Δ>0：抛物线与 x 轴有两个交点（方程两个不等实根）；Δ=0：相切于一点（两个相等实根）；Δ<0：无交点（无实根）。',
    proof:['令 y=0 得 ax²+bx+c=0，求根公式 x=(−b±√Δ)/(2a)。','Δ=b²−4ac 决定 √Δ 是否存在及大小。','Δ>0 时两个不同实根→两个交点；Δ=0 时一个重根→相切；Δ<0 无实根→无交点。'],
    formula:'Δ = b² − 4ac　Δ>0 两交点　Δ=0 一交点(相切)　Δ<0 无交点',
    tips:['拖动 c，观察抛物线与 x 轴交点如何增减','找到 Δ=0 的临界位置（相切）','对照读数中的 Δ 值'],
    legend:[{c:C.blue,t:'抛物线'},{c:C.red,t:'与 x 轴交点'}],
    hint:'Δ 的符号决定交点个数',
    interaction:'拖动 c 滑块，观察抛物线与 x 轴的交点个数如何随 Δ 变化。',
    controls:[
      {type:'range',key:'c',label:'常数项 c',min:-6,max:8,step:0.1,digits:1},
      {type:'button',key:'tangent',label:'到相切(Δ=0)',onclick:function(b,s){s.c=s.b*s.b/(4*s.a);H.refreshControls(s);}}
    ],
    init:function(b,s){s.a=1;s.b=-2;s.c=-3;},
    draw:function(b,s){
      var g=b.scene,ox=450,oy=300,sc=48;
      function P(x,y){return{x:ox+x*sc,y:oy-y*sc};}
      b.line(P(-7,0),P(7,0),'#94a3b8',1.8);b.line(P(0,-6),P(0,6),'#94a3b8',1.8);
      b.text({x:P(7,0).x+6,y:oy+18},'x','var(--mh-muted)',13,'start',700);
      function f(x){return s.a*x*x+s.b*x+s.c;}
      var pts=[];for(var x=-6;x<=6;x+=0.05){var y=f(x);if(Math.abs(y)<=7)pts.push(P(x,y));}
      if(pts.length>1)b.polyline(pts,C.blue,2.8);
      var d=s.b*s.b-4*s.a*s.c;
      if(d>=0){
        var r1=(-s.b-Math.sqrt(d))/(2*s.a),r2=(-s.b+Math.sqrt(d))/(2*s.a);
        [r1,r2].forEach(function(r){
          var rp=P(r,0);b.circle(rp,7,C.red,'#fff',2.5);
          b.text({x:rp.x,y:rp.y+22},r.toFixed(2),C.red,11,'middle',700);
        });
      }
      var msg=d>0?'Δ>0：两个交点（两个不等实根）':d<0?'Δ<0：无交点（无实根）':'Δ=0：相切（两个相等实根）';
      b.readout('Δ = b²−4ac = '+d.toFixed(2)+'　'+msg);
    }
  };
  R(discriminant);

})();
