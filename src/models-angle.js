/* ============ 图形与几何 · 导角模型主题（8 个） ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,dist=V.dist,mid=V.mid,unit=V.unit,lerp2=V.lerp2;
  var D2R=Math.PI/180,R2D=180/Math.PI;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};}
  function L(w){return{x:w.x-450,y:w.y-300};} // 世界→局部（相对画布中心）
  function angleAt(vertex,p,q){ // ∠pvq 的角度（度）
    var a=Math.atan2(p.y-vertex.y,p.x-vertex.x),b=Math.atan2(q.y-vertex.y,q.x-vertex.x);
    var d=Math.abs(a-b)*R2D;while(d>180)d=360-d;return d;
  }
  function arcMark(b,c,r,a0,a1,col){
    var pts=[],n=22;for(var i=0;i<=n;i++){var a=(a0+(a1-a0)*i/n);pts.push({x:c.x+r*Math.cos(a),y:c.y+r*Math.sin(a)});}
    b.polyline(pts,col,2);
  }
  function labelPt(b,p,name,col,dx,dy){b.circle(p,4.5,col,col,1.8);b.text({x:p.x+(dx||0),y:p.y+(dy||-13)},name,col,12,'middle',700);}

  /* ---------- 1. 双角平分线 · 双内角 ---------- */
  var biInner={
    id:'ang-bi-inner',domain:'geometry',topic:'angle',level:1,
    title:'双角平分线 · 双内角',brief:'两内角平分线相交：交点处的钝角 = 90° + ½∠A。',
    keys:'双角平分线 内角 内心 90度 导角',
    idea:'BP、CP 分别平分 ∠B、∠C，交于 P（内心）。在 △BPC 中，∠BPC = 180° − (∠B+∠C)/2 = 180° − (180°−∠A)/2 = 90° + ½∠A。',
    proof:['∠PBC=½∠B，∠PCB=½∠C。','△BPC 内角和：∠BPC = 180° − ½(∠B+∠C)。','∠B+∠C = 180° − ∠A，代入得 ∠BPC = 90° + ½∠A。','结论恒大于 90°，∠A 越大该角越大。'],
    formula:'∠BPC = 90° + ½·∠A',
    tips:['拖动 A 改变顶角 ∠A','观察 P 处钝角随 ∠A 变化','读数验证公式恒成立'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'角平分线 BP、CP'}],
    hint:'内角和 + 角平分线',interaction:'拖动 A，观察内心 P 处的钝角与 ∠A 的关系。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,190);s.B=P(-170,-90);s.C=P(170,-90);},
    draw:function(b,s){
      var A=s.A,B=s.B,Cc=s.C;
      // P = 内心：用角平分线交点（单位向量加权）
      var a=dist(B,Cc),bb=dist(A,Cc),c=dist(A,B);
      var I={x:(a*A.x+bb*B.x+c*Cc.x)/(a+bb+c),y:(a*A.y+bb*B.y+c*Cc.y)/(a+bb+c)};
      b.poly([A,B,Cc],C.blue,.05,C.blue,2.4);
      b.line(B,I,C.orange,2.4);b.line(Cc,I,C.orange,2.4);
      arcMark(b,A,34,Math.atan2(B.y-A.y,B.x-A.x),Math.atan2(Cc.y-A.y,Cc.x-A.x),C.blue);
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[I,'P',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(Cc,'C',18);
      var angA=angleAt(A,B,Cc),angP=angleAt(I,B,Cc);
      b.readout('∠A='+angA.toFixed(1)+'°　∠BPC='+angP.toFixed(1)+'°　90°+½∠A='+(90+angA/2).toFixed(1)+'°　✓');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else if(n==='B')b.state.B=w;else b.state.C=w;}
  };
  R(biInner);

  /* ---------- 2. 双角平分线 · 双外角 ---------- */
  var biOuter={
    id:'ang-bi-outer',domain:'geometry',topic:'angle',level:2,
    title:'双角平分线 · 双外角',brief:'两外角平分线相交：交点处的角 = 90° − ½∠A。',
    keys:'双角平分线 外角 旁心 90度 导角',
    idea:'BQ、CQ 分别平分 △ABC 的两个外角，交于旁心 Q。∠BQC = 90° − ½∠A。与双内角情形只差一个符号。',
    proof:['外角平分线：∠QBC = ½(180°−∠B) = 90°−½∠B，∠QCB = 90°−½∠C。','△BQC 中：∠BQC = 180° − (90°−½∠B) − (90°−½∠C) = ½(∠B+∠C)。','∠B+∠C = 180°−∠A，故 ∠BQC = 90° − ½∠A。','恒小于 90°，与双内角的"钝角"形成对比。'],
    formula:'∠BQC = 90° − ½·∠A',
    tips:['拖动 A 改变顶角','对比双内角(钝角)与双外角(锐角)','读数验证公式'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'外角平分线'}],
    hint:'外角平分线 → 90°−½∠A',interaction:'拖动 A，观察旁心处锐角与 ∠A 的关系。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,170);s.B=P(-160,-80);s.C=P(160,-80);},
    draw:function(b,s){
      var A=s.A,B=s.B,Cc=s.C;
      // 旁心 Q（A 对侧）：坐标用旁心公式 −a·A+bb·B+c·C /(−a+bb+c)
      var a=dist(B,Cc),bb=dist(A,Cc),c=dist(A,B);
      var den=-a+bb+c;
      var Q={x:(-a*A.x+bb*B.x+c*Cc.x)/den,y:(-a*A.y+bb*B.y+c*Cc.y)/den};
      b.poly([A,B,Cc],C.blue,.05,C.blue,2.4);
      b.line(B,Q,C.orange,2.4);b.line(Cc,Q,C.orange,2.4);
      // 延长 AB、AC 显示外角
      b.line(A,{x:B.x+(B.x-A.x)*0.4,y:B.y+(B.y-A.y)*0.4},C.slate,1.4,'5 4');
      b.line(A,{x:Cc.x+(Cc.x-A.x)*0.4,y:Cc.y+(Cc.y-A.y)*0.4},C.slate,1.4,'5 4');
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[Q,'Q',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(Cc,'C',18);
      var angA=angleAt(A,B,Cc),angQ=angleAt(Q,B,Cc);
      b.readout('∠A='+angA.toFixed(1)+'°　∠BQC='+angQ.toFixed(1)+'°　90°−½∠A='+(90-angA/2).toFixed(1)+'°　✓');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else if(n==='B')b.state.B=w;else b.state.C=w;}
  };
  R(biOuter);

  /* ---------- 3. 双角平分线 · 一内一外 ---------- */
  var biMixed={
    id:'ang-bi-mixed',domain:'geometry',topic:'angle',level:2,
    title:'双角平分线 · 一内一外',brief:'一条内角平分线与一条外角平分线相交：交点处的角 = ½∠A。',
    keys:'角平分线 内角 外角 半角 导角 旁心',
    idea:'BD 平分内角 ∠B，CD 平分外角 ∠ACE，交于 D。由外角定理两次，得 ∠D = ½∠A。这是三种双角平分线里最简洁的结论。',
    proof:['∠ACE 是 △ABC 外角：2β = ∠A + 2α（β=½∠ACE，α=½∠B）。','∠DCE 是 △BCD 外角：β = ∠D + α。','两式相减：∠D = β − α = ½∠A。','记忆：内外角平分线夹角 = 顶角的一半。'],
    formula:'∠D = ½·∠A',
    tips:['拖动 A 改变顶角','对比三种双角平分线结论','读数验证 ∠D=½∠A'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'一内一外平分线'}],
    hint:'内外平分线夹角 = ½顶角',interaction:'拖动 A，观察内外角平分线夹角恒为 ∠A 的一半。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,170);s.B=P(-170,-80);s.C=P(150,-80);},
    draw:function(b,s){
      var A=s.A,B=s.B,Cc=s.C;
      // D：∠B 内角平分线与 ∠C 外角平分线交点（旁心，B 对侧）
      var a=dist(B,Cc),bb=dist(A,Cc),c=dist(A,B);
      var den=a-bb+c; // 旁心 I_B
      var D={x:(a*A.x-bb*B.x+c*Cc.x)/den,y:(a*A.y-bb*B.y+c*Cc.y)/den};
      b.poly([A,B,Cc],C.blue,.05,C.blue,2.4);
      b.line(B,D,C.orange,2.4);b.line(Cc,D,C.orange,2.4);
      var ex={x:Cc.x+(Cc.x-A.x)*0.35,y:Cc.y+(Cc.y-A.y)*0.35};
      b.line(A,ex,C.slate,1.4,'5 4');
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[D,'D',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(Cc,'C',18);
      var angA=angleAt(A,B,Cc),angD=angleAt(D,B,Cc);
      b.readout('∠A='+angA.toFixed(1)+'°　∠D='+angD.toFixed(1)+'°　½∠A='+(angA/2).toFixed(1)+'°　✓');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else if(n==='B')b.state.B=w;else b.state.C=w;}
  };
  R(biMixed);

  /* ---------- 4. 8 字导角模型 ---------- */
  var eightAngle={
    id:'ang-eight',domain:'geometry',topic:'angle',level:1,
    title:'8 字导角模型',brief:'两条线段相交成"8"字：∠A+∠B = ∠C+∠D（对顶角两侧内角和相等）。',
    keys:'8字模型 对顶角 导角 内角和',
    idea:'AC 与 BD 交于 O，形成"8"字。由三角形内角和：∠A+∠B+∠AOB=180°，∠C+∠D+∠COD=180°，而 ∠AOB=∠COD（对顶角），故 ∠A+∠B=∠C+∠D。',
    proof:['在 △AOB 中：∠A+∠B = 180° − ∠AOB。','在 △COD 中：∠C+∠D = 180° − ∠COD。','∠AOB=∠COD（对顶角相等）。','故 ∠A+∠B = ∠C+∠D——把两组角"导"到对顶角这座桥上。'],
    formula:'∠A + ∠B = ∠C + ∠D',
    tips:['拖动四个端点改变 8 字形状','观察两侧内角和始终相等','体会"对顶角"这座导角桥'],
    legend:[{c:C.blue,t:'△AOB'},{c:C.orange,t:'△COD'}],
    hint:'对顶角桥 → 两侧内角和相等',interaction:'拖动端点，观察 8 字两侧内角和恒等。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(-150,140);s.B=P(-150,-140);},
    draw:function(b,s){
      var A=s.A,B=s.B,O0=O();
      // A-O-C 与 B-O-D 分别共线（对顶 8 字）
      var C1={x:O0.x-(A.x-O0.x),y:O0.y-(A.y-O0.y)};
      var Dd={x:O0.x-(B.x-O0.x),y:O0.y-(B.y-O0.y)};
      b.poly([A,O0,B],C.blue,.10,C.blue,2.4);
      b.poly([Dd,O0,C1],C.orange,.10,C.orange,2.4);
      [[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.orange],[Dd,'D',C.orange],[O0,'O',C.slate]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);
      var angA=angleAt(A,B,O0),angB=angleAt(B,A,O0);
      var angC=angleAt(C1,Dd,O0),angD=angleAt(Dd,C1,O0);
      b.readout('∠A+∠B='+(angA+angB).toFixed(1)+'°　∠C+∠D='+(angC+angD).toFixed(1)+'°　（8字两侧内角和相等）');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else b.state.B=w;}
  };
  R(eightAngle);

  /* ---------- 5. 飞镖（凹四边形） ---------- */
  var dart={
    id:'ang-dart',domain:'geometry',topic:'angle',level:1,
    title:'飞镖模型（凹四边形）',brief:'凹四边形"飞镖"：凹角 = 其余三个内角之和。',
    keys:'飞镖 凹四边形 外角 导角 内角和',
    idea:'凹四边形 ABDC 中，凹进去的角 ∠D = ∠A + ∠B + ∠C。可以连接 AD 并延长，用外角定理两次把三个角"搬"到 ∠D 处。',
    proof:['连接 AD 并延长到 E。','∠BDE 是 △ABD 外角：∠BDE = ∠B + ∠BAD。','∠CDE 是 △ACD 外角：∠CDE = ∠C + ∠CAD。','∠BDC = ∠BDE+∠CDE = ∠B+∠C+(∠BAD+∠CAD) = ∠A+∠B+∠C。'],
    formula:'凹角 ∠D = ∠A + ∠B + ∠C',
    tips:['拖动 A、B、C、D 改变飞镖形状','观察凹角恒等于另三角之和','连接凹点做辅助线是常用技巧'],
    legend:[{c:C.blue,t:'飞镖 ABDC'}],
    hint:'外角定理两次 → 凹角 = 三角和',interaction:'拖动顶点，观察凹角恒等于其余三个内角之和。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,170);s.B=P(-160,-110);s.D=P(0,10);s.C=P(160,-110);},
    draw:function(b,s){
      var A=s.A,B=s.B,Dd=s.D,Cc=s.C;
      b.poly([A,B,Dd,Cc],C.blue,.10,C.blue,2.6);
      b.line(A,Dd,C.slate,1.5,'5 4');
      [[A,'A',C.blue],[B,'B',C.blue],[Dd,'D',C.purple],[Cc,'C',C.blue]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(Cc,'C',18);b.handle(Dd,'D',18);
      // ∠D 为凹角（>180°的内角），这里取外侧小角 = 360−凹内角
      var angA=angleAt(A,B,Cc),angB=angleAt(B,A,Dd),angC=angleAt(Cc,A,Dd);
      // 飞镖结论：凹进去的那个小角 ∠BDC = ∠A+∠B+∠C
      var notchAngle=angleAt(Dd,B,Cc);
      b.readout('∠A+∠B+∠C='+(angA+angB+angC).toFixed(1)+'°　凹角∠BDC='+notchAngle.toFixed(1)+'°　（相等 → 飞镖模型）');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else if(n==='B')b.state.B=w;else if(n==='C')b.state.C=w;else b.state.D=w;}
  };
  R(dart);

  /* ---------- 6. 猪蹄模型（平行线拐点） ---------- */
  var pigHoof={
    id:'ang-pig-hoof',domain:'geometry',topic:'angle',level:1,
    title:'猪蹄模型（平行线拐点）',brief:'两条平行线之间有一个拐点：朝左的角之和 = 朝右的角之和。',
    keys:'猪蹄模型 平行线 拐点 折线 角度和',
    idea:'l₁∥l₂，折线 A-P-B 在两线间形成"猪蹄(M型)"，拐点 P 在一侧。过 P 作平行线，用内错角把 ∠A、∠B 搬到 P 点，则拐点角 ∠APB = ∠A + ∠B。',
    proof:['过拐点 P 作 l₃∥l₁∥l₂。','PA 截 l₁、l₃：∠A = PA 与 l₃ 的夹角（内错角）。','PB 截 l₂、l₃：∠B = PB 与 l₃ 的夹角（内错角）。','在 P 点，∠APB = 这两个角之和 = ∠A + ∠B。'],
    formula:'∠APB = ∠A + ∠B（拐点角 = 两端角之和）',
    tips:['拖动拐点 P 上下移动','调节两条平行线间距','过拐点作平行线是标准辅助线'],
    legend:[{c:C.blue,t:'平行线 l₁、l₂'},{c:C.orange,t:'折线'}],
    hint:'过拐点作平行线 → 内错角转移',interaction:'拖动拐点，观察两侧角之和恒等。',
    yUp:true,
    controls:[{type:'range',key:'py',label:'拐点高度',min:-40,max:40,step:1,digits:0}],
    init:function(b,s){s.py=0;},
    draw:function(b,s){
      var yTop=150,yBot=-150;
      var A=P(-190,yTop),B2=P(-190,yBot),P2=P(150,s.py);
      b.line({x:80,y:P(0,yTop).y},{x:820,y:P(0,yTop).y},C.blue,2.2);
      b.line({x:80,y:P(0,yBot).y},{x:820,y:P(0,yBot).y},C.blue,2.2);
      b.polyline([A,P2,B2],C.orange,2.8);
      // 过 P 作平行线
      b.line({x:80,y:P2.y},{x:820,y:P2.y},C.slate,1.3,'6 5');
      [[A,'A',C.blue],[B2,'B',C.blue],[P2,'P',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(P2,'P',18);
      var angA=Math.abs(Math.atan2(P2.y-A.y,P2.x-A.x))*R2D;
      var angB=Math.abs(Math.atan2(P2.y-B2.y,P2.x-B2.x))*R2D;
      var angP=angleAt(P2,A,B2);
      b.readout('∠A='+angA.toFixed(1)+'°　∠B='+angB.toFixed(1)+'°　∠A+∠B='+(angA+angB).toFixed(1)+'°　拐点角∠APB='+angP.toFixed(1)+'°　✓');
    },
    onDrag:function(b,n,w){if(n==='P'){var q=L(w);b.state.py=Math.max(-40,Math.min(40,q.y-300));H.refreshControls(b.state);}}
  };
  R(pigHoof);

  /* ---------- 7. 铅笔模型 ---------- */
  var pencil={
    id:'ang-pencil',domain:'geometry',topic:'angle',level:1,
    title:'铅笔模型（多拐点折线）',brief:'平行线间有 n 个拐点：所有同向角之和 = (n−1)×180°。',
    keys:'铅笔模型 平行线 多拐点 折线 角度和',
    idea:'折线在两平行线间有多个拐点时，逐个过拐点作平行线，把角"搬"到一起。n 个拐点时，朝同一侧的角之和 = (n−1)×180°。',
    proof:['过每个拐点作平行线的平行线。','每经过一个拐点，就把该处角用内错角转移。','逐段累加，n 个拐点对应 (n−1) 个平角关系。','结论：同向角之和 = (n−1)×180°。'],
    formula:'同向角之和 = (n−1) × 180°（n 个拐点）',
    tips:['调节拐点个数 n','拖动拐点改变各角大小','观察角度和只与 n 有关'],
    legend:[{c:C.blue,t:'平行线'},{c:C.orange,t:'折线'}],
    hint:'逐拐点作平行线 → 角和只与拐点数有关',interaction:'改变拐点数、拖动拐点，观察同向角之和 = (n−1)×180°。',
    yUp:true,
    controls:[{type:'range',key:'n',label:'拐点个数',min:2,max:4,step:1,digits:0}],
    init:function(b,s){s.n=2;},
    draw:function(b,s){
      var yTop=170,yBot=-170,n=s.n;
      b.line({x:80,y:P(0,yTop).y},{x:820,y:P(0,yTop).y},C.blue,2.2);
      b.line({x:80,y:P(0,yBot).y},{x:820,y:P(0,yBot).y},C.blue,2.2);
      // 折线：从上线一点，经过 n 个拐点，到下线一点
      var pts=[P(-260,yTop)],angles=[];
      for(var i=1;i<=n;i++){
        var x=-260+i*(520/(n+1));
        var y=(i%2===0)?yBot:yTop;
        pts.push(P(x,y));
      }
      pts.push(P(260,yBot));
      b.polyline(pts,C.orange,2.8);
      pts.forEach(function(p,i){if(i>0&&i<pts.length-1){b.circle(p,4.5,C.orange,C.orange,1.8);b.text({x:p.x,y:p.y+16},'拐'+i,C.orange,11,'middle',700);}});
      b.text(P(0,-230),'拐点数 n='+n+'　→　同向角之和 = '+(n-1)+'×180° = '+((n-1)*180)+'°',C.purple,13,'middle',700);
      b.readout('拐点数 n='+n+'　同向角之和 = (n−1)×180° = '+(n-1)*180+'°（与拐点位置无关）');
    }
  };
  R(pencil);

  /* ---------- 8. 高 + 角平分线导角 ---------- */
  var altBisector={
    id:'ang-alt-bisector',domain:'geometry',topic:'angle',level:2,
    title:'高 + 角平分线导角',brief:'△ABC 中，AD 是高、AE 是角平分线：两线夹角 = ½|∠C − ∠B|。',
    keys:'高 角平分线 导角 差的一半',
    idea:'AE 平分 ∠A，故 ∠BAE=½∠A。AD⊥BC，在 Rt△ABD 中 ∠BAD=90°−∠B。两线夹角 ∠DAE=|∠BAE−∠BAD|=|½∠A−(90°−∠B)|=½|∠C−∠B|。',
    proof:['∠BAE = ½∠A（角平分线）。','AD⊥BC，Rt△ABD 中 ∠BAD = 90° − ∠B。','∠DAE = |∠BAE − ∠BAD| = |½∠A + ∠B − 90°|。','由 ∠A+∠B+∠C=180° 化简得 ∠DAE = ½|∠C − ∠B|。'],
    formula:'∠DAE = ½·|∠C − ∠B|',
    tips:['拖动 B 或 C 改变两底角','观察高与角平分线的夹角','当 ∠B=∠C 时夹角为 0（三线合一）'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'角平分线 AE'},{c:C.green,t:'高 AD'}],
    hint:'角平分线角 − 高角 = 底角差的一半',interaction:'拖动 B、C，观察高与角平分线夹角 = ½|∠C−∠B|。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,180);s.B=P(-170,-90);s.C=P(150,-90);},
    draw:function(b,s){
      var A=s.A,B=s.B,Cc=s.C;
      // AE 角平分线：方向 = 单位向量 AB + AC
      var uAB=unit(sub(B,A)),uAC=unit(sub(Cc,A)),uAE=unit(add(uAB,uAC));
      // AD 高：垂直于 BC（BC 水平时，高竖直）
      var D={x:A.x,y:B.y};
      // E = 角平分线与 BC 交点
      var t=(B.y-A.y)/uAE.y,E={x:A.x+t*uAE.x,y:B.y};
      b.poly([A,B,Cc],C.blue,.05,C.blue,2.4);
      b.line(A,E,C.orange,2.6);b.line(A,D,C.green,2.6,'6 4');
      b.rightAngle(D,sub(A,D),sub(Cc,D),11,C.green);
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[D,'D',C.green],[E,'E',C.orange]].forEach(function(pt){
        b.circle(pt[0],4.5,pt[2],pt[2],1.8);b.text({x:pt[0].x,y:pt[0].y-13},pt[1],pt[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(Cc,'C',18);
      var angB=angleAt(B,A,Cc),angC=angleAt(Cc,A,B);
      var angDAE=angleAt(A,D,E);
      b.readout('∠B='+angB.toFixed(1)+'°　∠C='+angC.toFixed(1)+'°　∠DAE='+angDAE.toFixed(1)+'°　½|∠C−∠B|='+(Math.abs(angC-angB)/2).toFixed(1)+'°');
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else if(n==='B')b.state.B=w;else b.state.C=w;}
  };
  R(altBisector);

})();
