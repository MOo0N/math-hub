/* ============ 几何最值专题：7 个经典模型（从原课件迁移适配） ============ */
(function(){
  'use strict';
  var H=window.MathHub, R=H.register, V=H.V, C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,unit=V.unit,mid=V.mid,angDiff=V.angDiff,lerp2=V.lerp2;

  /* ---------- 1. 瓜豆原理 ---------- */
  var guadou={
    id:'guadou',domain:'geometry',topic:'extremum',yUp:true,level:2,
    title:'瓜豆原理',brief:'主动点 P 与从动点 Q 满足定角 α、定比 k，P 走什么轨迹，Q 就走旋转缩放后的同形轨迹。',
    keys:'瓜豆 旋转 相似 轨迹 主动点 从动点',
    idea:'定点 A + 定角 α + 定比 k 不变时，Q 的轨迹就是 P 的轨迹绕 A 旋转 α、缩放 k 后的图形：直线还是直线，圆还是圆，长度乘 k，夹角为 α。',
    proof:[
      '在 P 的轨迹上固定起点 P₁（图中不随 P 移动），由 ∠P₁AP = ∠Q₁AQ = α，且 AP₁/AP = AQ₁/AQ = 1/k。',
      '由 SAS 得 △AP₁P ∽ △AQ₁Q（相似比 1:k）；k=1 时为全等（纯旋转）。',
      '于是 Q₁Q = k·P₁P 且夹角恒为 α——P 走直线 Q 就走直线，P 走圆 Q 就走圆。'
    ],
    formula:'Q = A + k·R(α)·(P − A)　　R(α) 为旋转 α 的旋转矩阵',
    tips:['切换「线段 / 圆 / 自由」三种主动点路径','拖动 A、线段端点或圆来观察 Q 的轨迹如何同步变化','把 k 调成 1，观察全等（纯旋转）的特殊情形'],
    legend:[{c:C.blue,t:'主动点 P / 原轨迹'},{c:C.orange,t:'从动点 Q / 预测轨迹'}],
    hint:'定角 α、定比 k 决定 Q 的轨迹形状',
    interaction:'点右上角 ＋/－ 缩放，拖空白处平移。拖 A、P 或路径端点；橙色虚线是预测轨迹，橙色点是 Q 的实际痕迹。',
    controls:[
      {type:'buttons',key:'mode',items:[
        {label:'线段',onclick:function(b,s){s.mode='segment';b.model.onMode(b,'segment');}},
        {label:'圆',onclick:function(b,s){s.mode='circle';b.model.onMode(b,'circle');}},
        {label:'自由',onclick:function(b,s){s.mode='free';b.model.onMode(b,'free');}}
      ]},
      {type:'range',key:'alpha',label:'旋转角 α',min:-180,max:180,step:1,digits:0,onchange:function(b,s){s.trail=[];}},
      {type:'range',key:'k',label:'相似比 k=AQ/AP',min:0.3,max:3,step:0.05,digits:2,onchange:function(b,s){s.trail=[];}},
      {type:'range',key:'speed',label:'速度',min:0.2,max:2,step:0.1,digits:1},
      {type:'check',key:'showTrail',label:'显示真实运动痕迹'},
      {type:'check',key:'showProof',label:'显示相似辅助线'},
      {type:'buttons',key:'presets',items:[
        {label:'等边60°',onclick:function(b,s){b.model.applyPreset(b,60,1);}},
        {label:'正方形90°',onclick:function(b,s){b.model.applyPreset(b,90,1);}},
        {label:'中点k=½',onclick:function(b,s){b.model.applyPreset(b,60,.5);}},
        {label:'反向',onclick:function(b,s){b.model.applyPreset(b,-60,1);}}
      ]}
    ],
    autoplay:true,
    init:function(b,s){
      s.A={x:450,y:330};s.seg={a:{x:170,y:130},b:{x:730,y:130}};
      s.circ={o:{x:450,y:155},r:95};s.P={x:315,y:130};
      s.mode='segment';s.alpha=60;s.k=1;s.t=.25;s.dir=1;s.speed=1;
      s.trail=[];s.showTrail=true;s.showProof=true;s.refT=.65;
    },
    onMode:function(b,m){
      var s=b.state;
      if(m==='free'&&s.mode!=='free')s.P=b.model.point(s,s.t);
      s.mode=m;s.trail=[];
      if(m==='free')b.playing=false;
      H.refreshControls(s);
    },
    applyPreset:function(b,a,k){
      var s=b.state;s.alpha=a;s.k=k;s.trail=[];b.playing=true;
      if(s.mode==='free')s.mode='segment';
      H.refreshControls(s);
    },
    point:function(s,t){
      if(s.mode==='segment')return lerp2(s.seg.a,s.seg.b,t);
      if(s.mode==='circle'){var a=t*2*Math.PI;
        return{x:s.circ.o.x+s.circ.r*Math.cos(a),y:s.circ.o.y+s.circ.r*Math.sin(a)};}
      return s.P;
    },
    trans:function(s,p){
      var r=s.alpha*Math.PI/180,c=Math.cos(r),si=Math.sin(r),d=sub(p,s.A);
      return{x:s.A.x+s.k*(c*d.x-si*d.y),y:s.A.y+s.k*(si*d.x+c*d.y)};
    },
    step:function(b,s,dt){
      if(s.mode==='segment'){
        s.t+=s.dir*.32*s.speed*dt;
        if(s.t>=1){s.t=1;s.dir=-1;}if(s.t<=0){s.t=0;s.dir=1;}
      }else if(s.mode==='circle')s.t=(s.t+.13*s.speed*dt)%1;
      var P=b.model.point(s,s.t),Q=b.model.trans(s,P);
      s.trail.push({P:P,Q:Q});if(s.trail.length>260)s.trail.shift();
    },
    draw:function(b,s){
      var g=b.scene,m=b.model,P=m.point(s,s.t),Q=m.trans(s,P);
      if(s.mode==='segment'){
        b.line(s.seg.a,s.seg.b,C.blue,2.5);
        b.circle(s.seg.a,5,C.blue,'#fff',2);b.circle(s.seg.b,5,C.blue,'#fff',2);
        b.line(m.trans(s,s.seg.a),m.trans(s,s.seg.b),C.orange,2.5,'8 6');
      }else if(s.mode==='circle'){
        b.circle(s.circ.o,s.circ.r,C.blue,'none',2.5);
        b.circle(m.trans(s,s.circ.o),s.k*s.circ.r,C.orange,'none',2.5,'8 6');
        b.circle(s.circ.o,5,C.blue,'#fff',2);
        b.circle({x:s.circ.o.x+s.circ.r,y:s.circ.o.y},5,'#93c5fd','#fff',2);
      }
      if(s.showTrail&&s.trail.length>1){
        b.polyline(s.trail.map(function(v){return v.P;}),'#93c5fd',3,null,.75);
        b.polyline(s.trail.map(function(v){return v.Q;}),'#fdba74',3,null,.9);
      }
      if(s.showProof&&s.mode!=='free'){
        var P1=m.point(s,s.refT),Q1=m.trans(s,P1);
        [[s.A,P1,'#93c5fd'],[s.A,P,'#bfdbfe'],[s.A,Q1,'#fdba74'],[s.A,Q,'#fed7aa']]
          .forEach(function(a){b.line(a[0],a[1],a[2],1.5,'4 4');});
        b.line(P1,P,C.blue,2.2);b.line(Q1,Q,C.orange,2.2);
        b.circle(P1,5,C.blue,'#fff',2);b.circle(Q1,5,C.orange,'#fff',2);
        b.text({x:P1.x-9,y:P1.y-10},'P₁ 固定',C.blue,12,'end',700);
        b.text({x:Q1.x+9,y:Q1.y+16},'Q₁ 固定',C.orange,12,'start',700);
        var eq=Math.abs(s.k-1)<1e-6;
        b.text({x:18,y:552},eq?'△AP₁P ≌ △AQ₁Q（k=1，全等/旋转）':'△AP₁P ∽ △AQ₁Q（SAS，比 1:k）',C.purple,14,'start',700);
        b.text({x:18,y:574},'∠P₁AP=∠Q₁AQ=α · AP₁/AP=AQ₁/AQ · Q₁Q=k·P₁P','var(--mh-muted)',12,'start',600);
      }
      b.line(s.A,P,C.blue,2.2);b.line(s.A,Q,C.orange,2.6);
      if(Math.abs(s.alpha)>.001){
        var a0=Math.atan2(P.y-s.A.y,P.x-s.A.x),r=s.alpha*Math.PI/180,pts=[];
        for(var i=0;i<=24;i++){var a=a0+r*i/24;pts.push({x:s.A.x+46*Math.cos(a),y:s.A.y+46*Math.sin(a)});}
        b.polyline(pts,C.purple,2);
        var am=a0+r/2;
        b.text({x:s.A.x+68*Math.cos(am),y:s.A.y+68*Math.sin(am)},'α='+s.alpha+'°',C.purple,13,'middle',700);
      }
      b.text({x:(s.A.x+Q.x)/2+12,y:(s.A.y+Q.y)/2-8},'AQ/AP = '+s.k.toFixed(2),C.orange,12,'start',600);
      b.circle(s.A,9,C.purple,'#fff',2.5);b.text({x:s.A.x-14,y:s.A.y-18},'A 定点',C.purple,13,'end',700);
      b.circle(P,8,C.blue,C.blue,2);b.circle(P,12,C.blue,'none',1,null,.35);
      b.handle(P,'P',16);b.text({x:P.x+14,y:P.y-10},'P',C.blue,14,'start',800);
      b.circle(Q,8,C.orange,C.orange,2);b.circle(Q,12,C.orange,'none',1,null,.35);
      b.text({x:Q.x+14,y:Q.y+18},'Q',C.orange,14,'start',800);
      b.handle(s.A,'A',16);
      if(s.mode==='segment'){b.handle(s.seg.a,'segA',14);b.handle(s.seg.b,'segB',14);}
      if(s.mode==='circle'){b.handle(s.circ.o,'circO',14);b.handle({x:s.circ.o.x+s.circ.r,y:s.circ.o.y},'circR',14);}
      b.readout('α='+s.alpha+'° · k='+s.k.toFixed(2)+' · '+({segment:'线段',circle:'圆',free:'自由'}[s.mode]));
    },
    onDragStart:function(b,n){},
    onDrag:function(b,n,w){
      var s=b.state,m=b.model;
      if(n==='A'){s.A=w;s.trail=[];}
      else if(n==='segA'){s.seg.a=w;s.trail=[];}
      else if(n==='segB'){s.seg.b=w;s.trail=[];}
      else if(n==='circO'){s.circ.o=w;s.trail=[];}
      else if(n==='circR'){s.circ.r=Math.max(20,Math.min(300,dist(w,s.circ.o)));s.trail=[];}
      else if(n==='P'){
        if(s.mode==='free')s.P=w;
        else if(s.mode==='segment'){
          var v=sub(s.seg.b,s.seg.a),l2=v.x*v.x+v.y*v.y||1;
          s.t=Math.max(0,Math.min(1,((w.x-s.seg.a.x)*v.x+(w.y-s.seg.a.y)*v.y)/l2));
        }else{var a=Math.atan2(w.y-s.circ.o.y,w.x-s.circ.o.x)/(2*Math.PI);s.t=(a+1)%1;}
        m.step(b,s,0);
      }
    },
    onReset:function(b,s){b.playing=true;}
  };
  R(guadou);

  /* ---------- 2. 阿氏圆·概念 ---------- */
  function locus(k,A,B){
    var dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy);
    if(Math.abs(k-1)<1e-9)return{type:'line',M:{x:(A.x+B.x)/2,y:(A.y+B.y)/2},perp:{x:-dy/d,y:dx/d},d:d};
    var D={x:A.x+k/(1+k)*dx,y:A.y+k/(1+k)*dy},s=k/(k-1);
    var E={x:A.x+s*dx,y:A.y+s*dy};
    return{type:'circle',D:D,E:E,O:mid(D,E),r:dist(D,E)/2,d:d};
  }
  var apollonius={
    id:'apollonius',domain:'geometry',topic:'extremum',yUp:true,level:2,
    title:'阿氏圆 · 概念',brief:'到两定点 A、B 距离之比为定值 k 的动点 P，其轨迹是一个圆（k=1 时为中垂线）。',
    keys:'阿氏圆 阿波罗尼斯 轨迹 比值 内分 外分',
    idea:'固定 A、B，让 k 变化得到一族圆（阿氏圆族）：圆心都在直线 AB 上，各圆互不相交，A、B 是极限点；k 越接近 1 圆越大，k=1 时退化为中垂线。',
    proof:[
      '在 AB 上取 D、E 使 AD/DB = AE/EB = k，由角平分线定理逆定理，PD、PE 分别平分 ∠APB 的内角和外角。',
      '内外角平分线互相垂直，∠DPE = 90°。',
      '所以 P 在以 DE 为直径的圆上；反之亦成立，这就是所求轨迹。'
    ],
    formula:'圆心 AO = k²d/|k²−1|　　r = kd/|k²−1|　　（d = AB）',
    tips:['拖动 A、B 改变定点位置','切换 k 的预设值，观察圆的大小与圆心如何变化','打开「阿氏圆族」看 k 连续变化时的一族圆'],
    legend:[{c:C.blue,t:'定点 A / 内分点 D'},{c:C.orange,t:'定点 B / 外分点 E'},{c:C.purple,t:'动点 P / 轨迹圆'}],
    hint:'比值 k = PA/PB 固定时，P 的轨迹是圆',
    interaction:'拖动空白处平移；缩放请用右上角 ＋/－ 按钮。拖动 A、B、P 都可以，取消锁定后自由拖 P。',
    controls:[
      {type:'range',key:'k',label:'目标比值 k = PA/PB',min:0.4,max:5,step:0.05,digits:2},
      {type:'buttons',key:'presets',items:[
        {label:'k=2',onclick:function(b){b.model.setK(b,2);}},
        {label:'k=½',onclick:function(b){b.model.setK(b,.5);}},
        {label:'k=1',onclick:function(b){b.model.setK(b,1);}},
        {label:'k=3',onclick:function(b){b.model.setK(b,3);}},
        {label:'k=0.4',onclick:function(b){b.model.setK(b,.4);}}
      ]},
      {type:'check',key:'lock',label:'P 锁定在轨迹上'},
      {type:'check',key:'proof',label:'显示证明辅助线'},
      {type:'check',key:'family',label:'显示阿氏圆族'},
      {type:'check',key:'showLen',label:'显示 PA、PB 长度'}
    ],
    autoplay:true,
    init:function(b,s){
      s.A={x:350,y:300};s.B={x:590,y:300};s.k=2;s.phase=Math.PI/2;
      s.playing=true;s.free=false;s.P={x:0,y:0};s.lock=true;s.proof=true;s.family=false;s.showLen=false;
    },
    setK:function(b,v){var s=b.state;s.k=Math.max(.4,Math.min(5,v));H.refreshControls(s);},
    locus:function(s){return locus(s.k,s.A,s.B);},
    pointAt:function(s){
      if(!s.lock)return s.P;
      var L=locus(s.k,s.A,s.B);
      if(L.type==='circle')return{x:L.O.x+L.r*Math.cos(s.phase),y:L.O.y+L.r*Math.sin(s.phase)};
      var o=220*Math.sin(s.phase);
      return{x:L.M.x+L.perp.x*o,y:L.M.y+L.perp.y*o};
    },
    step:function(b,s,dt){if(s.playing&&s.lock)s.phase+=.6*dt;},
    draw:function(b,s){
      var g=b.scene,m=b.model,L=m.locus(s),P=m.pointAt(s);
      var ratio=dist(P,s.A)/dist(P,s.B);
      if(s.family){[0.5,1,1.5,2,3].forEach(function(k){
        var l=locus(k,s.A,s.B);
        if(l.type==='circle')b.circle(l.O,l.r,'#cbd5e1','none',1.4,'3 5',.8);
        else b.line(add(l.M,mul(l.perp,-260)),add(l.M,mul(l.perp,260)),'#cbd5e1',1.4,'3 5',.8);
      });}
      if(L.type==='circle'){
        b.circle(L.O,L.r,C.purple,'#faf5ff',2.6,'8 6',.6);
        b.line(L.D,L.E,'#9d5b7a',2,'6 5');
        b.circle(L.O,4,C.purple,'#fff',2);
        b.circle(L.D,6,C.blue,'#fff',2.4);
        b.circle(L.E,6,C.orange,'#fff',2.4);
        b.text({x:L.D.x,y:L.D.y-14},'D 内分',C.blue,12,'middle',700);
        b.text({x:L.E.x,y:L.E.y-14},'E 外分',C.orange,12,'middle',700);
        b.text({x:L.O.x,y:L.O.y+21},'O  r='+L.r.toFixed(1),C.purple,12,'middle',700);
      }else b.line(add(L.M,mul(L.perp,-250)),add(L.M,mul(L.perp,250)),C.purple,2.6,'8 6');
      b.line(s.A,s.B,'#94a3b8',2);
      b.line(s.A,P,C.blue,2.3);b.line(s.B,P,C.orange,2.3);
      if(s.showLen){
        var mPA=mid(s.A,P),mPB=mid(s.B,P),pA=dist(P,s.A),pB=dist(P,s.B);
        b.text({x:mPA.x-8,y:mPA.y-8},'PA='+pA.toFixed(1),C.blue,12,'end',700);
        b.text({x:mPB.x+8,y:mPB.y-8},'PB='+pB.toFixed(1),C.orange,12,'start',700);
      }
      if(s.proof){
        if(L.type==='circle'){
          b.line(P,L.D,'#0ea5e9',2);b.line(P,L.E,'#f59e0b',2);
          var aA=Math.atan2(s.A.y-P.y,s.A.x-P.x),aD=Math.atan2(L.D.y-P.y,L.D.x-P.x),
              aB=Math.atan2(s.B.y-P.y,s.B.x-P.x),aE=Math.atan2(L.E.y-P.y,L.E.x-P.x);
          b.arc(P,28,aA,aA+angDiff(aD,aA),'#0ea5e9',2.2);
          b.arc(P,34,aD,aD+angDiff(aB,aD),'#0ea5e9',2.2);
          b.arc(P,42,aB,aB+angDiff(aE,aB),'#f59e0b',2);
          var u=unit(sub(L.D,P)),v=unit(sub(L.E,P)),sz=12;
          b.poly([add(P,mul(u,sz)),add(add(P,mul(u,sz)),mul(v,sz)),add(P,mul(v,sz))],'none',1,C.red,2.2);
          b.text({x:20,y:24},'内外角平分线垂直 ⇒ ∠DPE = 90°',C.red,14,'start',700);
        }else b.text({x:20,y:24},'k = 1：PA = PB，轨迹是 AB 的中垂线',C.purple,14,'start',700);
      }
      b.circle(s.A,8,C.blue,'#fff',2.6);b.text({x:s.A.x-13,y:s.A.y-16},'A',C.blue,15,'end',800);
      b.circle(s.B,8,C.orange,'#fff',2.6);b.text({x:s.B.x+13,y:s.B.y-16},'B',C.orange,15,'start',800);
      b.handle(s.A,'A',16);b.handle(s.B,'B',16);
      b.circle(P,9,C.green,C.green,2);b.circle(P,14,C.green,'none',1,null,.35);
      b.handle(P,'P',16);b.text({x:P.x+13,y:P.y-10},'P',C.green,15,'start',800);
      b.readout('PA / PB = '+ratio.toFixed(3)+(s.lock?'   ·  k = '+s.k.toFixed(2):'   ·  自由测量'));
    },
    onDrag:function(b,n,w){
      var s=b.state,m=b.model;
      if(n==='A')s.A=w;else if(n==='B')s.B=w;
      else if(n==='P'){
        if(!s.lock)s.P=w;
        else{var L=m.locus(s);
          if(L.type==='circle')s.phase=Math.atan2(w.y-L.O.y,w.x-L.O.x);
          else{var o=(w.x-L.M.x)*L.perp.x+(w.y-L.M.y)*L.perp.y;
            s.phase=Math.asin(Math.max(-1,Math.min(1,o/220)));}
        }
      }
    },
    onReset:function(b,s){b.playing=true;}
  };
  R(apollonius);

  /* ---------- 3. 阿氏圆·例题 ---------- */
  var exExample={
    id:'apollonius-example',domain:'geometry',topic:'extremum',yUp:true,level:3,
    title:'阿氏圆 · 例题',brief:'直角中带系数的最值：用阿氏圆把「系数 × 距离」换成到定点的距离，再用两点之间线段最短。',
    keys:'阿氏圆 例题 系数 母子相似 最值 √37',
    idea:'核心套路：用阿氏圆把"系数 × 距离"换成到另一个定点的距离，再用两点之间线段最短。',
    proof:[
      '第①问：在 CB 上取 CD=1。因 CP=2、CB=4，有 CD/CP = CP/CB = ½，且夹角 C 相同，故 △PCD ∽ △BCP，得 PD = ½BP。于是 AP + ½BP = AP + PD ≥ AD = √(6²+1²) = √37。',
      '第②问：在 CA 上取 CE = ⅔。因 CP=2、CA=6，有 CE/CP = CP/CA = ⅓，故 △PCE ∽ △ACP，得 PE = ⅓AP。于是 ⅓AP + BP = PE + BP ≥ BE = √(4²+(⅔)²) = ⅔√37。',
      '这正是阿氏圆：第①问 PB/PD=2，圆 C 是 B、D 的阿氏圆；第②问 PA/PE=3，圆 C 是 A、E 的阿氏圆。'
    ],
    formula:'① min = √37 ≈ 6.083　　② min = ⅔√37 ≈ 4.055',
    tips:['选择第①问或第②问，观察构造点和最短路径','拖动 P 沿圆运动，读数实时显示当前值','点击「跳到最优点」验证取等条件'],
    legend:[{c:C.blue,t:'到 A 距离'},{c:C.orange,t:'到 B 距离'},{c:C.green,t:'构造定点 / 最短路径'}],
    hint:'系数距离 → 定点距离 → 两点之间线段最短',
    interaction:'点右上角 ＋/－ 缩放，拖空白处平移。拖动 P 沿圆运动，绿色构造点把带系数的距离换成到定点的距离。',
    controls:[
      {type:'buttons',key:'q',items:[
        {label:'① AP + ½BP',onclick:function(b){b.state.q=1;b.model.toOpt(b);}},
        {label:'② ⅓AP + BP',onclick:function(b){b.state.q=2;b.model.toOpt(b);}}
      ]},
      {type:'check',key:'sim',label:'显示母子相似三角形'},
      {type:'check',key:'min',label:'显示最值线段与最优点'},
      {type:'button',key:'best',label:'跳到最优点',onclick:function(b){b.model.toOpt(b);}}
    ],
    init:function(b,s){s.q=1;s.phase=0;s.playing=false;s.sim=true;s.min=true;},
    ew:function(p){return{x:300+55*p.x,y:130+55*p.y};},
    eCircle:function(b){var c=b.model.ew({x:0,y:0});return{x:c,r:110};},
    eP:function(b,s){var c=b.model.eCircle(b);return{x:c.x.x+c.r*Math.cos(s.phase),y:130+c.r*Math.sin(s.phase)};},
    optG:function(q){
      if(q===1){var t=(36-4*Math.sqrt(7))/37;return{x:t,y:6-6*t};}
      var u=(36-3*Math.sqrt(33))/37;return{x:4-4*u,y:(2/3)*u};
    },
    toOpt:function(b){var s=b.state,p=b.model.optG(s.q);s.phase=Math.atan2(p.y,p.x);b.playing=false;},
    step:function(b,s,dt){if(s.playing)s.phase+=.55*dt;},
    draw:function(b,s){
      var g=b.scene,m=b.model,ew=m.ew,P=m.eP(b,s);
      var A=ew({x:0,y:6}),B=ew({x:4,y:0}),Cc=ew({x:0,y:0});
      var pg={x:(P.x-300)/55,y:(P.y-130)/55};
      b.circle(Cc,110,'#334155','#f8fafc',2.4);
      b.line(A,Cc,'#94a3b8',2);b.line(Cc,B,'#94a3b8',2);b.line(A,B,'#cbd5e1',1.4,'5 4');
      b.poly([ew({x:0,y:.32}),ew({x:.32,y:.32}),ew({x:.32,y:0})],'none',1,'#64748b',1.4);
      b.text({x:Cc.x-10,y:Cc.y-14},'C','#334155',14,'end',800);
      b.text({x:A.x-11,y:A.y-10},'A(0,6)',C.blue,13,'end',700);
      b.text({x:B.x+11,y:B.y-10},'B(4,0)',C.orange,13,'start',700);
      b.text({x:Cc.x-70,y:Cc.y+58},'r = 2','#64748b',12,'start');
      var fixed,value,minVal,minText;
      if(s.q===1){
        var F=ew({x:1,y:0});fixed=F;
        value=dist(pg,{x:0,y:6})+.5*dist(pg,{x:4,y:0});
        minVal=Math.sqrt(37);minText='√37';
        if(s.sim){b.poly([P,Cc,F],'#10b981',.18);b.poly([B,Cc,P],C.blue,.12);}
        b.line(Cc,P,'#64748b',1.5,'4 4');b.line(A,P,C.blue,2.5);b.line(B,P,C.orange,2.5);
        b.line(Cc,F,C.green,2.6);b.line(P,F,C.green,2.3,'6 4');
        if(s.min)b.line(A,F,'#10b981',2.2,'8 5',.95);
        b.circle(F,6,C.green,'#fff',2.4);
        b.text({x:F.x,y:F.y-14},'D (CD=1)',C.green,12.5,'middle',700);
        b.text({x:(Cc.x+F.x)/2,y:Cc.y+18},'CD/CP = ½',C.green,11.5,'middle');
        b.text({x:(P.x+F.x)/2+8,y:(P.y+F.y)/2},'PD = ½BP',C.green,12,'start',700);
      }else{
        var F2=ew({x:0,y:2/3});fixed=F2;
        value=dist(pg,{x:0,y:6})/3+dist(pg,{x:4,y:0});
        minVal=2*Math.sqrt(37)/3;minText='⅔√37';
        if(s.sim){b.poly([P,Cc,F2],'#10b981',.18);b.poly([A,Cc,P],C.blue,.12);}
        b.line(Cc,P,'#64748b',1.5,'4 4');b.line(A,P,C.blue,2.5);b.line(B,P,C.orange,2.5);
        b.line(Cc,F2,C.green,2.6);b.line(P,F2,C.green,2.3,'6 4');
        if(s.min)b.line(B,F2,'#10b981',2.2,'8 5',.95);
        b.circle(F2,6,C.green,'#fff',2.4);
        b.text({x:F2.x-12,y:F2.y+4},'E (CE=⅔)',C.green,12.5,'end',700);
        b.text({x:Cc.x+14,y:(Cc.y+F2.y)/2},'CE/CP = ⅓',C.green,11.5,'start');
        b.text({x:(P.x+F2.x)/2+8,y:(P.y+F2.y)/2},'PE = ⅓AP',C.green,12,'start',700);
      }
      b.circle(P,9,C.purple,C.purple,2);b.circle(P,14,C.purple,'none',1,null,.35);
      b.handle(P,'P',16);b.text({x:P.x+13,y:P.y-9},'P',C.purple,15,'start',800);
      if(s.min){var op=ew(m.optG(s.q));b.circle(op,15,'#10b981','none',2,'4 3',.9);
        b.text({x:op.x+20,y:op.y+17},'最优点',C.green,12,'start',700);}
      var hit=Math.abs(value-minVal)<.02;
      b.readout('当前值 '+value.toFixed(3)+' · 最小值 '+minText+' ≈ '+minVal.toFixed(3)+(hit?'  ✓ 取到最小值':''));
    },
    onDrag:function(b,n,w){
      var s=b.state;
      if(n==='P'){
        var gx=(w.x-300)/55,gy=(w.y-130)/55;
        s.phase=Math.atan2(gy,gx);b.playing=false;
      }
    }
  };
  R(exExample);

  /* ---------- 4. 阿氏圆·综合题 ---------- */
  var comprehensive={
    id:'apollonius-comprehensive',domain:'geometry',topic:'extremum',yUp:true,level:3,
    title:'阿氏圆 · 综合题',brief:'抛物线 + 平行四边形 + 矩形 + 阿氏圆最值四步递进，把几何条件翻译成坐标，最后用阿氏圆取最值。',
    keys:'阿氏圆 综合题 抛物线 平行四边形 矩形 最值',
    idea:'把几何条件翻译成代数坐标；最后一步才是阿氏圆：取 P 为 AE 与 ⊙E 交点 G′ 的中点，使 ⊙E 成为 A、P 的阿氏圆（k=2）。',
    proof:[
      '(2)：E(m,2m+4)、G(m,−m²−2m+4)。GEOF 为平行四边形且 OB=4，取 G 在 E 上方：y_G−y_E=4，得 m=−2，G(−2,4)。',
      '(3)①：AE⊥AC，矩形为 A-E-H-F，对角线 EF 与 AH 互相平分。由中点重合得 a=−2、p=−1，E(−2,0)、H(0,−1)。',
      '(3)②：EH=√5，AE=2√5。取 G′ 为 AE 与 ⊙E 靠 A 侧交点(−3,−2)，P 为 EG′ 中点(−5/2,−1)。由 PE/ME = ME/AE = 1/2 且 ∠PEM=∠MEA，得 △PEM∽△MEA，故 PM=½AM。于是 ½AM+CM = PM+CM ≥ PC = 5√5/2。'
    ],
    formula:'最小值 ½AM + CM = 5√5/2 ≈ 5.590',
    tips:['按 1→4 步依次探索，每一步拖动 E 或 M','第 4 步拖动 M 沿圆运动，读数实时显示 ½AM+CM','点击「跳到本步答案」查看关键位置'],
    legend:[{c:'#334155',t:'抛物线 / 直线'},{c:C.purple,t:'动点 / 构造'},{c:C.green,t:'最值路径'}],
    hint:'四步递进：总图 → 平行四边形 → 矩形 → 阿氏圆最值',
    interaction:'点右上角 ＋/－ 缩放，拖空白处平移。第 4 步拖 M 沿圆运动，读数实时显示 ½AM+CM。',
    controls:[
      {type:'buttons',key:'step',items:[
        {label:'1 总图',onclick:function(b){b.model.setStep(b,1);}},
        {label:'2 平行四边形',onclick:function(b){b.model.setStep(b,2);}},
        {label:'3 矩形',onclick:function(b){b.model.setStep(b,3);}},
        {label:'4 阿氏圆最值',onclick:function(b){b.model.setStep(b,4);}}
      ]},
      {type:'button',key:'best',label:'跳到本步答案',onclick:function(b){b.model.jump(b);}},
      {type:'button',key:'play',label:'▶ 播放 M',onclick:function(b){b.playing=!b.playing;var el=document.getElementById('mhb-play');if(el)el.textContent=b.playing?'⏸ 暂停 M':'▶ 播放 M';}}
    ],
    init:function(b,s){s.step=1;s.e=-2;s.mPhase=-1.52;s.playing=false;},
    cw:function(p){return{x:400+45*p.x,y:310+45*p.y};},
    cg:function(w){return{x:(w.x-400)/45,y:(w.y-310)/45};},
    Epos:function(a){return{x:a,y:2*a+4};},
    Fpos:function(a){return{x:a,y:-.5*a-6};},
    Gpos:function(a){return{x:a,y:-a*a-2*a+4};},
    Hpos:function(a){return{x:0,y:1.5*a+2};},
    mPoint:function(s){return{x:-2+Math.sqrt(5)*Math.cos(s.mPhase),y:Math.sqrt(5)*Math.sin(s.mPhase)};},
    bestM:function(){
      var t=(-3+2*Math.sqrt(21))/25;
      return{x:-2.5+t*(0-(-2.5)),y:-1+t*(-6-(-1))};
    },
    setStep:function(b,n){b.state.step=n;if(n!==4)b.playing=false;},
    jump:function(b){var s=b.state;if(s.step===4){var m=b.model.bestM();s.mPhase=Math.atan2(m.y,m.x+2);b.playing=false;}else s.e=-2;},
    step:function(b,s,dt){if(s.playing&&s.step===4)s.mPhase+=.5*dt;},
    draw:function(b,s){
      var g=b.scene,m=b.model,cw=m.cw,lab=function(p,dx,dy){return{x:p.x+dx,y:p.y+dy};};
      // 坐标轴
      b.line(cw({x:-5.5,y:0}),cw({x:2.7,y:0}),'#cbd5e1',1.4);
      b.line(cw({x:0,y:-7}),cw({x:0,y:6.2}),'#cbd5e1',1.4);
      b.text(lab(cw({x:2.7,y:0}),8,-12),'x','#64748b',13,'start',700);
      b.text(lab(cw({x:0,y:6.2}),10,0),'y','#64748b',13,'start',700);
      var para=[];for(var x=-5.5;x<=2.7;x+=.12)para.push(cw({x:x,y:-x*x-2*x+4}));
      b.polyline(para,'#334155',2.2);
      b.polyline([cw({x:-5.2,y:-6.4}),cw({x:1.3,y:6.6})],C.blue,2);
      b.polyline([cw({x:-5,y:-.5*-5-6}),cw({x:2.4,y:-.5*2.4-6})],C.orange,2);
      var GA={x:-4,y:-4},GB={x:0,y:4},GC={x:0,y:-6},GO={x:0,y:0};
      [[GA,'A(-4,-4)',C.blue,-8,16],[GB,'B(0,4)',C.orange,10,14],
       [GC,'C(0,-6)',C.orange,10,14],[GO,'O','#64748b',10,-14]].forEach(function(a){
        b.circle(cw(a[0]),4,a[2],'#fff',2);b.text(lab(cw(a[0]),a[3],a[4]),a[1],a[2],11.5,a[3]<0?'end':'start',700);
      });
      if(s.step<=3){
        var a=s.e,E=m.Epos(a),F=m.Fpos(a),Gp2=m.Gpos(a);
        b.line(cw({x:a,y:Gp2.y}),cw({x:a,y:F.y}),C.purple,1.6,'4 4');
        if(s.step===1){
          [[Gp2,'G',C.purple],[E,'E',C.purple],[F,'F',C.green]].forEach(function(t){
            b.circle(cw(t[0]),6,t[2],'#fff',2.4);b.text(lab(cw(t[0]),10,12),t[1],t[2],13,'start',800);
          });
          b.handle(cw(E),'E',14);
          b.readout('E('+a.toFixed(1)+', '+(2*a+4).toFixed(1)+') · F('+a.toFixed(1)+', '+(-.5*a-6).toFixed(1)+') · G('+a.toFixed(1)+', '+(-a*a-2*a+4).toFixed(1)+')');
        }else if(s.step===2){
          var ok=Math.abs(a+2)<.03;
          b.poly([cw(Gp2),cw(E),cw(GO),cw(GB)],ok?'#10b981':'#cbd5e1',ok?.22:.12,ok?C.green:'#cbd5e1',ok?2.4:1.6);
          [[Gp2,'G'],[E,'E']].forEach(function(t){b.circle(cw(t[0]),6,C.purple,'#fff',2.4);b.text(lab(cw(t[0]),10,12),t[1],C.purple,13,'start',800);});
          b.handle(cw(E),'E',14);
          b.text(lab(cw({x:(a+0)/2,y:(Gp2.y+E.y)/2}),-18,0),'EG='+(Gp2.y-E.y).toFixed(2),C.green,12,'end',700);
          b.text(lab(cw({x:.18,y:2}),12,0),'OB=4',C.green,12,'start',700);
          b.readout('m='+a.toFixed(2)+' · EG='+(Gp2.y-E.y).toFixed(2)+' · OB=4'+(ok?'  ✓ G(-2,4)':'   （需 G 在 E 上方且 EG=OB）'));
        }else{
          var H=m.Hpos(a),ok3=Math.abs(a+2)<.03;
          b.poly([cw(GA),cw(E),cw(H),cw(F)],ok3?'#10b981':'none',ok3?.18:0,ok3?C.green:'#cbd5e1',ok3?2.4:1.6);
          b.line(cw(E),cw(F),'#94a3b8',1.4,'4 4');b.line(cw(GA),cw(H),'#94a3b8',1.4,'4 4');
          [[E,'E'],[F,'F'],[H,'H']].forEach(function(t){b.circle(cw(t[0]),6,t[1]==='H'?C.green:C.purple,'#fff',2.4);b.text(lab(cw(t[0]),10,12),t[1],t[1]==='H'?C.green:C.purple,13,'start',800);});
          b.handle(cw(E),'E',14);
          b.readout('a='+a.toFixed(2)+' · p=1.5a+2='+H.y.toFixed(2)+' · 中点横坐标 −2 vs '+a.toFixed(2)+(ok3?'  ✓ E(-2,0) H(0,-1)':''));
        }
      }else{
        var M=m.mPoint(s),Ec=m.Epos(-2),min=5*Math.sqrt(5)/2;
        var value=.5*dist(M,GA)+dist(M,GC);
        b.circle(cw(Ec),45*Math.sqrt(5),C.purple,'#faf5ff',2.4,'8 5',.75);
        b.line(cw(GA),cw({x:-3,y:-2}),C.blue,2);
        b.line(cw({x:-2.5,y:-1}),cw(GC),'#10b981',2.2,'7 5');
        b.line(cw(Ec),cw({x:0,y:-1}),C.green,2);
        b.poly([cw({x:-2.5,y:-1}),cw(Ec),cw(M)],'#10b981',.2);
        b.poly([cw(M),cw(Ec),cw(GA)],C.blue,.13);
        b.line(cw({x:-2.5,y:-1}),cw(M),'#10b981',2.3);
        b.line(cw(M),cw(Ec),C.purple,2);b.line(cw(M),cw(GA),C.blue,2.2);b.line(cw(M),cw(GC),C.orange,2.2);
        [[Ec,'E(-2,0)',C.purple],[{x:0,y:-1},'H(0,-1)',C.green],
         [{x:-3,y:-2},'G′',C.purple],[{x:-2.5,y:-1},'P(-5/2,-1)','#10b981'],[M,'M',C.purple]].forEach(function(t){
          b.circle(cw(t[0]),t[1]==='M'?8:5,t[2],'#fff',2.4);b.text(lab(cw(t[0]),10,12),t[1],t[2],12.5,'start',800);
        });
        b.handle(cw(M),'M',16);
        var bm=m.bestM();b.circle(cw(bm),14,'#10b981','none',2,'4 3',.9);
        b.text(lab(cw({x:-1.2,y:-3.2}),0,0),'PM = ½AM','#10b981',13,'start',800);
        b.readout('½AM+CM = '+value.toFixed(3)+' · 最小值 5√5/2 ≈ '+min.toFixed(3)+(Math.abs(value-min)<.03?'  ✓ 取到最小值':''));
      }
    },
    onDrag:function(b,n,w){
      var s=b.state;
      if(n==='E')s.e=Math.max(-5,Math.min(1,b.model.cg(w).x));
      else if(n==='M'){var p=b.model.cg(w);s.mPhase=Math.atan2(p.y,p.x+2);}
    }
  };
  R(comprehensive);

  /* ---------- 5. 将军饮马 ---------- */
  var drinking={
    id:'drinking-horse',domain:'geometry',topic:'extremum',yUp:true,level:1,
    title:'将军饮马',brief:'直线同侧两点 A、B，在直线上找一点 P 使 PA+PB 最小：把 B 对称到 B′，折线拉直，最短就是 AB′。',
    keys:'将军饮马 对称 最短路径 轴对称 拉直',
    idea:'对称把折线拉直：把 B 关于直线 l 对称到 B′，则 PB=PB′，所以 PA+PB=PA+PB′≥AB′，当 A、P、B′ 三点共线时取到。',
    proof:['把 B 关于 l 对称到 B′，则对 l 上任意点 P 都有 PB = PB′。','于是 PA+PB = PA+PB′ ≥ AB′（两点之间线段最短）。','当 A、P、B′ 共线时取等号，最小值 = A 到 B′ 的距离。'],
    formula:'min(PA+PB) = AB′ = √[(x_A−x_B)² + (y_A+y_B)²]',
    tips:['拖动 A、B 改变定点，拖动 P 沿 l 移动','打开对称点 B′，看折线如何被"拉直"','点击「跳到最优点」看三点共线'],
    legend:[{c:C.blue,t:'PA'},{c:C.orange,t:'PB / B′P'},{c:C.green,t:'拉直后的 AB′'}],
    hint:'对称 → 折线变直线 → 两点之间最短',
    interaction:'拖动 A、B 或沿 l 拖动 P。点右上角 ＋/－ 缩放，拖空白处平移。',
    controls:[
      {type:'check',key:'show',label:'显示对称点 B′ 与直线 AB′'},
      {type:'button',key:'best',label:'跳到最优点',onclick:function(b){b.model.toBest(b);}},
      {type:'button',key:'play',label:'▶ 播放',onclick:function(b){b.playing=!b.playing;}}
    ],
    init:function(b,s){s.A={x:-3,y:2.5};s.B={x:2,y:2};s.p=-2/9;s.dir=1;s.show=true;s.playing=false;},
    dw:function(p){return{x:450+70*p.x,y:300+70*p.y};},
    dB:function(s){return{x:s.B.x,y:-s.B.y};},
    dOpt:function(s){var bx=s.B.x,by=-s.B.y,t=s.A.y/(s.A.y-by);return s.A.x+t*(bx-s.A.x);},
    toBest:function(b){b.state.p=b.model.dOpt(b.state);b.playing=false;},
    step:function(b,s,dt){if(s.playing){s.p+=s.dir*.5*dt;if(s.p>5)s.dir=-1;if(s.p<-5)s.dir=1;}},
    draw:function(b,s){
      var g=b.scene,m=b.model,dw=m.dw,A=s.A,B=s.B,Bp=m.dB(s),P={x:s.p,y:0};
      b.line(dw({x:-5.5,y:0}),dw({x:5.5,y:0}),'#94a3b8',2);
      b.text({x:dw({x:5.5,y:0}).x+8,y:dw({x:5.5,y:0}).y-12},'l','#64748b',13,'start',700);
      if(s.show){
        b.line(dw(A),dw(Bp),'#10b981',2,'8 5');
        b.line(dw(B),dw(Bp),'#f59e0b',1.5,'4 4');
        b.line(dw(Bp),dw(P),'#f59e0b',2.2,'6 4');
        b.circle(dw(Bp),6,'#f59e0b','#fff',2.4);
        b.text({x:dw(Bp).x+11,y:dw(Bp).y-9},'B′','#f59e0b',13,'start',800);
      }
      b.line(dw(A),dw(P),C.blue,2.6);b.line(dw(B),dw(P),C.orange,2.6);
      [[A,'A',C.blue],[B,'B',C.orange],[P,'P',C.purple]].forEach(function(t){
        b.circle(dw(t[0]),t[0]===P?8:6,t[2],'#fff',2.5);
        b.text({x:dw(t[0]).x+11,y:dw(t[0]).y+(t[0]===P?-10:12)},t[1],t[2],14,'start',800);
      });
      b.handle(dw(A),'A',16);b.handle(dw(B),'B',16);b.handle(dw(P),'P',16);
      var val=dist(A,P)+dist(B,P),min=dist(A,Bp);
      b.readout('PA+PB = '+val.toFixed(3)+' · 最小 '+min.toFixed(3)+(Math.abs(val-min)<.02?'  ✓':''));
    },
    onDrag:function(b,n,w){
      var s=b.state,p={x:(w.x-450)/70,y:(w.y-300)/70};
      if(n==='A')s.A={x:p.x,y:Math.max(.3,p.y)};
      else if(n==='B')s.B={x:p.x,y:Math.max(.3,p.y)};
      else s.p=p.x;
    }
  };
  R(drinking);

  /* ---------- 6. 逆等线段 ---------- */
  var reverse={
    id:'reverse-segment',domain:'geometry',topic:'extremum',yUp:true,level:2,
    title:'逆等线段',brief:'直角三角形中 AD=CE=t，求 CD+BE 最小值：过 C 作全等构造，把两条线段转化为一条直线 BF。',
    keys:'逆等线段 全等 最短路径 构造',
    idea:'过 C 作 CF∥AB 且 CF=AC（方向与 AB 相反），则 △ADC≌△CEF，得 CD=EF。于是 CD+BE=EF+BE≥BF，B、E、F 共线时取到最小值 BF=√58。',
    proof:['过 C 作 CF∥AB 且 CF=AC=3（方向与 AB 相反），则 ∠DCF 与 ∠EC... 由 SAS 得 △ADC≌△CEF。','故 CD=EF，于是 CD+BE = EF+BE ≥ BF。','当 B、E、F 三点共线时取到最小值 BF = √(8²+... ) = √58。'],
    formula:'min(CD+BE) = BF = √58 ≈ 7.616',
    tips:['拖动滑块控制 t，观察 D、E 联动','打开全等构造 F，看 CD 如何转成 EF','点击「跳到最优点」验证 B、E、F 共线'],
    legend:[{c:C.blue,t:'CD'},{c:C.orange,t:'BE'},{c:C.green,t:'转化后的 BF'}],
    hint:'全等构造 → 线段替换 → 三点共线最短',
    interaction:'拖滑块控制 D、E 联动。当 B、E、F 三点共线时取到最小值 BF=√58。',
    controls:[
      {type:'range',key:'t',label:'t = AD = CE',min:0,max:3,step:0.01,digits:2},
      {type:'check',key:'show',label:'显示全等构造 F 与直线 BF'},
      {type:'button',key:'best',label:'跳到最优点',onclick:function(b){b.state.t=9/7;H.refreshControls(b.state);}}
    ],
    init:function(b,s){s.t=9/7;s.show=true;},
    rw:function(p){return{x:450+60*p.x,y:420+60*p.y};},
    draw:function(b,s){
      var g=b.scene,m=b.model,rw=m.rw,t=s.t;
      var A={x:0,y:0},B={x:4,y:0},Cc={x:0,y:3},F={x:-3,y:3};
      var D={x:t,y:0},E={x:0,y:3-t};
      b.polyline([rw(A),rw(B),rw(Cc),rw(A)],'#94a3b8',2);
      if(s.show){
        b.poly([rw(A),rw(D),rw(Cc)],C.blue,.14);
        b.poly([rw(Cc),rw(E),rw(F)],'#10b981',.18);
        b.line(rw(E),rw(F),'#10b981',2.2,'6 4');
        b.line(rw(B),rw(F),'#10b981',2.4,'8 5');
        b.circle(rw(F),6,'#10b981','#fff',2.4);
        b.text({x:rw(F).x-10,y:rw(F).y+12},'F','#10b981',14,'end',800);
      }
      b.line(rw(D),rw(Cc),C.blue,2.6);b.line(rw(B),rw(E),C.orange,2.6);
      [[A,'A'],[B,'B'],[Cc,'C'],[D,'D'],[E,'E']].forEach(function(a,i){
        var c=i===3?C.blue:i===4?C.orange:'#334155';
        b.circle(rw(a[0]),i<3?5:6,c,'#fff',2.3);
        b.text({x:rw(a[0]).x+10,y:rw(a[0]).y+12},a[1],c,13,'start',800);
      });
      b.handle(rw(D),'D',14);
      var cd=dist(D,Cc),be=dist(B,E),min=dist(B,F);
      b.readout('CD+BE = '+(cd+be).toFixed(3)+' · 最小 √58 ≈ '+min.toFixed(3)+(Math.abs(cd+be-min)<.03?'  ✓':''));
    },
    onDrag:function(b,n,w){if(n==='D'){var p={x:(w.x-450)/60,y:(w.y-420)/60};b.state.t=Math.max(0,Math.min(3,p.x));H.refreshControls(b.state);}}
  };
  R(reverse);

  /* ---------- 7. 胡不归 ---------- */
  var hubu={
    id:'hu-bu-gui',domain:'geometry',topic:'extremum',yUp:true,level:3,
    title:'胡不归',brief:'直线 l 上求 k·PA+PB（0<k<1）最小值：作 sinα=k 的射线，把 k·PA 化为垂线段 PH，再拉直。',
    keys:'胡不归 最值 系数 三角函数 垂线 拉直',
    idea:'作 sinα=k 的射线，过 P 作 PH⊥射线，则 PH=k·PA。于是 k·PA+PB = PH+PB ≥ 点 B 到射线的垂线段长，B、P、H 共线且 BH⊥射线时取到。',
    proof:['作 ∠(l,射线)=α 使 sinα=k，从 A 向 l 异侧作这条射线。','过 P 作 PH⊥射线于 H，则在 Rt△APH 中 PH = PA·sinα = k·PA。','于是 k·PA+PB = PH+PB ≥ B 到射线的垂线段，当 B、P、H 共线且 BH⊥射线时取到。'],
    formula:'min(k·PA+PB) = 3cosα + 4sinα　（α = arcsin k，A、B 距离按模型给定）',
    tips:['拖动 P 沿 l 运动，观察折线 H-P-B 的长度变化',"改 k 会重新构造射线，紫色 PH 始终垂直射线且恒等于 k·PA",'最优点处红线 BH 垂直到射线——折线拉直，此时 k·PA+PB 最小','注意 PA 画成灰色虚线：它已被等长的 PH 替代'],
    legend:[{c:'#0f766e',t:'构造射线 sinα=k'},{c:C.purple,t:'垂线 PH=k·PA'},{c:C.orange,t:'PB'},{c:C.red,t:'最优垂线 BH'}],
    hint:'系数 k → sinα → 垂线 PH → 拉直为 BH 最短',
    interaction:'拖动 P 沿 l 运动；紫色 PH 恒=k·PA 且垂直射线。拖到最优点时，B、P、H 共线，红色 BH 垂直于射线，折线被拉直，读数达到最小。',
    controls:[
      {type:'range',key:'k',label:'k = sinα',min:0.1,max:0.95,step:0.01,digits:2},
      {type:'check',key:'show',label:'显示构造射线与垂线 PH'},
      {type:'button',key:'best',label:'跳到最优点',onclick:function(b){b.state.p=b.model.opt(b.state);b.playing=false;}},
      {type:'button',key:'play',label:'▶ 播放',onclick:function(b){b.playing=!b.playing;}}
    ],
    init:function(b,s){s.k=.5;s.p=4-3*Math.tan(Math.asin(.5));s.dir=-1;s.show=true;s.playing=false;},
    hw:function(p){return{x:450+70*p.x,y:330+70*p.y};},
    u:function(s){var a=Math.asin(s.k);return{x:Math.cos(a),y:-Math.sin(a)};},
    rayEnd:function(s){var u=this.u(s);return{x:6*u.x,y:6*u.y};},
    hPoint:function(s){var u=this.u(s),ss=s.p*u.x;return{x:ss*u.x,y:ss*u.y};},
    opt:function(s){return 4-3*Math.tan(Math.asin(s.k));},
    min:function(s){var a=Math.asin(s.k);return 3*Math.cos(a)+4*Math.sin(a);},
    step:function(b,s,dt){if(s.playing){s.p+=s.dir*1.2*dt;if(s.p>6){s.p=6;s.dir=-1;}if(s.p<0){s.p=0;s.dir=1;}}},
    draw:function(b,s){
      var g=b.scene,m=b.model,hw=m.hw,u=m.u(s),A={x:0,y:0},B={x:4,y:3};
      var P={x:s.p,y:0},Hh=m.hPoint(s),re=m.rayEnd(s);
      var isBest=Math.abs(s.p-m.opt(s))<.035;
      // 基准直线 l
      b.line(hw({x:-1,y:0}),hw({x:6,y:0}),'#94a3b8',2);
      b.text({x:hw({x:6,y:0}).x+8,y:hw({x:6,y:0}).y-12},'l','#64748b',13,'start',700);
      if(s.show){
        // 构造射线：sinα = k
        b.line(hw(A),hw(re),'#0f766e',2.2,'8 5');
        b.text({x:hw(re).x+8,y:hw(re).y-6},'射线（sinα=k）','#0f766e',12,'start',700);
        // 关键转化：PH ⊥ 射线，PH = PA·sinα = k·PA（紫色实线）
        b.line(hw(P),hw(Hh),C.purple,3);
        var e=.2,Hp=add(Hh,mul(u,e)),Pn=unit(sub(P,Hh)),Pq=add(Hh,mul(Pn,e));
        b.line(hw(Hp),hw(add(Hp,mul(Pn,e))),C.purple,2);
        b.line(hw(add(Hp,mul(Pn,e))),hw(Pq),C.purple,2);
        // 折线 H-P-B = PH+PB = k·PA+PB
        b.line(hw(P),hw(B),C.orange,2.6);
        if(isBest){
          // 最优点：B、P、H 三点共线，BH ⊥ 射线——这才是胡不归的“作垂线拉直”解法
          b.line(hw(B),hw(Hh),C.red,4);
          b.text({x:(hw(Hh).x+hw(B).x)/2+10,y:(hw(Hh).y+hw(B).y)/2},'BH⊥射线·最短',C.red,12,'start',700);
        }else{
          b.line(hw(Hh),hw(B),'#94a3b8',1.6,'4 4');
          b.text({x:(hw(Hh).x+hw(B).x)/2,y:(hw(Hh).y+hw(B).y)/2-8},'拖到最优点 → 拉直成垂线 BH','#94a3b8',11,'middle',600);
        }
        b.circle(hw(Hh),5,C.purple,'#fff',2.3);
        b.text({x:hw(Hh).x+9,y:hw(Hh).y-8},'H',C.purple,13,'start',800);
        var mpa={x:(hw(P).x+hw(Hh).x)/2,y:(hw(P).y+hw(Hh).y)/2};
        b.text({x:mpa.x+8,y:mpa.y},'PH=k·PA',C.purple,11,'start',600);
      }
      // PA 弱化为虚线：k·PA 已由 PH 替代
      b.line(hw(A),hw(P),'#94a3b8',1.8,'5 4');
      [[A,'A',C.blue],[B,'B',C.orange],[P,'P',C.purple]].forEach(function(t,i){
        b.circle(hw(t[0]),i===2?8:6,t[2],'#fff',2.5);
        b.text({x:hw(t[0]).x+11,y:hw(t[0]).y+(i===2?-10:12)},t[1],t[2],14,'start',800);
      });
      b.handle(hw(P),'P',16);
      var val=s.k*Math.abs(s.p)+dist(B,P);
      b.readout('k·PA+PB = PH+PB = '+val.toFixed(3)+'　最小值 '+m.min(s).toFixed(3)+
        (isBest?'  ✓ 最优：BH⊥射线（折线已拉直）':'  ← 拖到最优点，从 B 向射线作垂线 BH'));
    },
    onDrag:function(b,n,w){
      var s=b.state;if(n==='P')s.p=Math.max(0,Math.min(6,(w.x-450)/70));
    }
  };
  R(hubu);

})();
