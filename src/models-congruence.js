/* ============ 图形与几何 · 全等模型主题（16 个） ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,mid=V.mid,unit=V.unit,lerp2=V.lerp2;
  var D2R=Math.PI/180, R2D=180/Math.PI;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};} // 局部数学坐标（相对画布中心，y 向上）
  function L(w){return{x:w.x-450,y:w.y-300};} // 世界→局部
  function rot(p,c,a){var dx=p.x-c.x,dy=p.y-c.y,cs=Math.cos(a),sn=Math.sin(a);
    return{x:c.x+dx*cs-dy*sn,y:c.y+dx*sn+dy*cs};}
  function pol(p){return Math.atan2(p.y,p.x);}
  function segLabel(b,p,q,txt,col,size){
    var m=mid(p,q);b.text({x:m.x,y:m.y+14},txt,col||'var(--mh-muted)',size||12,'middle',700);
  }
  function tick(b,p,q,col){ // 等长刻痕
    var m=mid(p,q),d=unit(sub(q,p)),n={x:-d.y,y:d.x};
    b.line({x:m.x+n.x*7,y:m.y+n.y*7},{x:m.x-n.x*7,y:m.y-n.y*7},col||C.slate,2);
  }

  /* ---------- 1. 手拉手（等边型） ---------- */
  var handEquilateral={
    id:'cong-hand-equilateral',domain:'geometry',topic:'congruence',level:2,
    title:'手拉手模型（等边型）',brief:'两个等边三角形共顶点，连接另外两组顶点，得到的两条线段相等、夹角为 60°。',
    keys:'手拉手 等边三角形 旋转 全等 SAS 共顶点',
    idea:'两个等边三角形 △OAB、△OCD 共顶点 O。绕 O 旋转 60°，A 落到 B、C 落到 D，于是线段 AC 落到 BD：所以 AC=BD，且 AC 与 BD 的夹角恰好等于旋转角 60°。',
    proof:['等边三角形中 OA=OB、OC=OD，∠AOB=∠COD=60°。','∠AOC 与 ∠BOD 都等于 60°±∠BOC（同加或同减公共角），故 ∠AOC=∠BOD。','由 SAS，△AOC≌△BOD，得 AC=BD，∠OAC=∠OBD。','导角可得 AC 与 BD 的夹角 = ∠AOB = 60°。'],
    formula:'AC = BD　　∠(AC,BD) = 60°',
    tips:['拖动 A、C 改变两个等边三角形的大小与朝向','调节旋转角滑块（保持两三角形全等）','观察两条拉手线 AC、BD 始终相等且夹角恒定'],
    legend:[{c:C.blue,t:'等边△OAB'},{c:C.orange,t:'等边△OCD'},{c:C.green,t:'拉手线 AC=BD'}],
    hint:'共顶点 + 两组等边 + 旋转全等',interaction:'拖动 A、C 改变构型，观察拉手线 AC 与 BD 始终相等、夹角恒为 60°。',
    yUp:true,
    controls:[
      {type:'buttons',key:'dir',items:[{label:'同向',onclick:function(b,s){s.dir=1;}},{label:'反向',onclick:function(b,s){s.dir=-1;}}]},
      {type:'range',key:'lenC',label:'△OCD 边长',min:70,max:200,step:1,digits:0}
    ],
    init:function(b,s){s.dir=1;s.lenC=130;s.A=P(-150,70);s.C=P(120,40);},
    draw:function(b,s){
      var O0=O(),B=rot(s.A,O0,s.dir*60*D2R);
      var k=s.lenC/130,C0=rot(P(120*k,40*k),O0,0),D0=rot(C0,O0,s.dir*60*D2R);
      b.poly([O0,s.A,B],C.blue,.12,C.blue,2.4);
      b.poly([O0,C0,D0],C.orange,.12,C.orange,2.4);
      b.line(s.A,C0,C.green,3);b.line(B,D0,C.green,3);
      tick(b,O0,s.A,C.blue);tick(b,O0,B,C.blue);
      tick(b,O0,C0,C.orange);tick(b,O0,D0,C.orange);
      b.circle(O0,5,C.slate,C.slate,2);b.text({x:O0.x-14,y:O0.y-14},'O',C.slate,13,'middle',700);
      [[s.A,'A',C.blue],[B,'B',C.blue],[C0,'C',C.orange],[D0,'D',C.orange]].forEach(function(t){
        b.circle(t[0],5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],13,'middle',700);});
      segLabel(b,s.A,C0,'AC='+dist(s.A,C0).toFixed(1),C.green);
      segLabel(b,B,D0,'BD='+dist(B,D0).toFixed(1),C.green);
      b.handle(s.A,'A',18);b.handle(C0,'C',18);
      b.readout('AC = '+dist(s.A,C0).toFixed(2)+'　BD = '+dist(B,D0).toFixed(2)+'　→ AC − BD = '+(dist(s.A,C0)-dist(B,D0)).toFixed(4)+'（恒为 0）');
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A')b.state.A=q;else if(n==='C'){b.state.C=q;var k=dist(q,O())/dist(P(120,40),O());b.state.lenC=Math.max(70,Math.min(200,130*k));}H.refreshControls(b.state);}
  };
  R(handEquilateral);

  /* ---------- 2. 手拉手（等腰直角型） ---------- */
  var handRight={
    id:'cong-hand-right',domain:'geometry',topic:'congruence',level:2,
    title:'手拉手模型（等腰直角型）',brief:'两个等腰直角三角形共直角顶点，连接对应点所得线段相等且互相垂直。',
    keys:'手拉手 等腰直角 旋转90 全等 垂直',
    idea:'等腰直角三角形绕直角顶点 O 旋转 90°，A→B、C→D。于是 AC 旋转 90° 后与 BD 重合：AC=BD 且 AC⊥BD。这是"手拉手 + 垂直"的经典组合。',
    proof:['OA=OB、OC=OD，∠AOB=∠COD=90°。','∠AOC=∠BOD（同减/加 ∠BOC），由 SAS 得 △AOC≌△BOD，故 AC=BD。','再由导角得 AC 与 BD 的夹角等于旋转角 90°，即 AC⊥BD。'],
    formula:'AC = BD　　AC ⊥ BD',
    tips:['拖动 A、C 改变两三角形','切换同向/反向，观察垂直关系保持','两条拉手线交点处有直角记号'],
    legend:[{c:C.blue,t:'等腰Rt△OAB'},{c:C.orange,t:'等腰Rt△OCD'},{c:C.green,t:'AC=BD'}],
    hint:'旋转 90° → 线段相等且垂直',interaction:'拖动 A、C，观察拉手线 AC、BD 恒等长且恒垂直。',
    yUp:true,
    controls:[{type:'buttons',key:'dir',items:[{label:'同向',onclick:function(b,s){s.dir=1;}},{label:'反向',onclick:function(b,s){s.dir=-1;}}]}],
    init:function(b,s){s.dir=1;s.A=P(-150,60);s.C=P(110,90);},
    draw:function(b,s){
      var O0=O(),B=rot(s.A,O0,s.dir*90*D2R),D0=rot(s.C,O0,s.dir*90*D2R);
      b.poly([O0,s.A,B],C.blue,.12,C.blue,2.4);
      b.poly([O0,s.C,D0],C.orange,.12,C.orange,2.4);
      b.rightAngle(O0,sub(s.A,O0),sub(B,O0),16,C.blue);
      b.rightAngle(O0,sub(s.C,O0),sub(D0,O0),13,C.orange);
      b.line(s.A,s.C,C.green,3);b.line(B,D0,C.green,3);
      b.circle(O0,5,C.slate,C.slate,2);b.text({x:O0.x-14,y:O0.y-14},'O',C.slate,13,'middle',700);
      [[s.A,'A',C.blue],[B,'B',C.blue],[s.C,'C',C.orange],[D0,'D',C.orange]].forEach(function(t){
        b.circle(t[0],5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],13,'middle',700);});
      segLabel(b,s.A,s.C,'AC='+dist(s.A,s.C).toFixed(1),C.green);
      segLabel(b,B,D0,'BD='+dist(B,D0).toFixed(1),C.green);
      b.handle(s.A,'A',18);b.handle(s.C,'C',18);
      b.readout('AC = '+dist(s.A,s.C).toFixed(2)+'　BD = '+dist(B,D0).toFixed(2)+'　夹角 = 90°（AC ⟂ BD）');
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A')b.state.A=q;else b.state.C=q;}
  };
  R(handRight);

  /* ---------- 3. 手拉手构造（逆用） ---------- */
  var handConstruct={
    id:'cong-hand-construct',domain:'geometry',topic:'congruence',level:3,
    title:'手拉手构造（逆用）',brief:'题目里没有现成的等边三角形时，主动"补"一个，把分散的线段旋转到一起构造全等。',
    keys:'手拉手 构造 辅助线 旋转 线段和差',
    idea:'当要证的线段分散、又出现"共端点的等长线段 + 定角"时，可以绕公共端点旋转一个三角形，把两条线段"拉"到一起，凑出 SAS 全等，从而转移线段。',
    proof:['识别触发信号：共端点、两组相等线段、一个定角。','以公共端点为中心，把一个含已知线段的三角形旋转定角，作出辅助三角形。','旋转保证对应边相等、夹角相等，凑出 SAS 全等。','利用全等把线段转移到同一三角形中，再用三边关系或线段和差收尾。'],
    formula:'见"共端点等线段 + 定角" → 旋转构造 SAS 全等',
    tips:['点击"作辅助线"看旋转构造过程','拖动 A、B 改变原三角形','体会"补一个旋转三角形"如何把分散线段集中'],
    legend:[{c:C.blue,t:'原△OAB'},{c:C.purple,t:'旋转构造'},{c:C.green,t:'转移后的线段'}],
    hint:'主动旋转，构造全等',interaction:'点击"作辅助线"逐步展示旋转构造，拖动点改变原三角形。',
    yUp:true,
    controls:[
      {type:'button',key:'build',label:'✦ 作辅助线',onclick:function(b,s){s.show=!s.show;}},
      {type:'range',key:'ang',label:'旋转角 °',min:30,max:120,step:1,digits:0}
    ],
    init:function(b,s){s.show=false;s.ang=60;s.A=P(-130,90);s.B=P(150,40);},
    draw:function(b,s){
      var O0=O(),a=s.ang*D2R;
      b.poly([O0,s.A,s.B],C.blue,.10,C.blue,2.4);
      // 旋转 A、B 到 A'、B'
      var Ap=rot(s.A,O0,a),Bp=rot(s.B,O0,a);
      if(s.show){
        b.poly([O0,Ap,Bp],C.purple,.14,C.purple,2.4);
        b.arc(O0,60,pol(sub(s.A,O0)),pol(sub(Ap,O0)),C.purple,2);
        b.text({x:O0.x+70*Math.cos(pol(sub(s.A,O0))+a/2),y:O0.y+70*Math.sin(pol(sub(s.A,O0))+a/2)},s.ang+'°',C.purple,12,'middle',700);
        b.line(s.B,Bp,C.green,2.6,'6 4');
        segLabel(b,s.B,Bp,'B→B′',C.green);
        b.text(P(0,-235),'旋转后 △OA′B′ ≌ △OAB，把线段"搬"到一起',C.purple,13,'middle',700);
      }else{
        b.text(P(0,-235),'点击「作辅助线」，绕 O 旋转 '+s.ang+'° 构造全等',C.slate,13,'middle',600);
      }
      b.circle(O0,5,C.slate,C.slate,2);b.text({x:O0.x-14,y:O0.y-14},'O',C.slate,13,'middle',700);
      [[s.A,'A',C.blue],[s.B,'B',C.blue]].forEach(function(t){b.circle(t[0],5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],13,'middle',700);});
      b.handle(s.A,'A',18);b.handle(s.B,'B',18);
      b.readout(s.show?('OA=OA′='+dist(O0,s.A).toFixed(1)+'　OB=OB′='+dist(O0,s.B).toFixed(1)+'　旋转 '+s.ang+'° 全等'):'先识别"共端点等线段+定角"，再点击作辅助线');
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A')b.state.A=q;else b.state.B=q;}
  };
  R(handConstruct);

  /* ---------- 4. 反手拉手 ---------- */
  var handReverse={
    id:'cong-hand-reverse',domain:'geometry',topic:'congruence',level:3,
    title:'反手拉手模型',brief:'两个等腰三角形共顶点但"开口相反"，一组线段反向旋转，仍能用 SAS 证全等。',
    keys:'反手拉手 反向 等腰三角形 全等 SAS',
    idea:'手拉手可"同向"或"反向"。同向时两等腰三角形绕 O 同转 α，连 A-C、B-D，得 AC=BD；反向时一个 +α 一个 −α，改连 A-D、B-C，得 AD=BC。关键是用有向角判断哪一对手拉线全等。',
    proof:['同向：OA=OB、OC=OD，∠AOB=∠COD=α，∠AOC=∠BOD，SAS 得 △AOC≌△BOD，故 AC=BD。','反向：第二个三角形 ∠COD=−α，此时 ∠AOD=∠BOC（有向角），SAS 得 △AOD≌△BOC，故 AD=BC。','易错点：反向时不能再连 A-C、B-D，要换成 A-D、B-C。','统一技巧：把角都看作有向角，找出"共顶点 + 两组等边 + 相等夹角"的那对三角形。'],
    formula:'同向：AC=BD　　反向：AD=BC',
    tips:['对比"同向"与"反向"两种模式','拖动 A、C 观察对应关系变化','注意反向时角的加减方向相反'],
    legend:[{c:C.blue,t:'等腰△OAB(+α)'},{c:C.orange,t:'等腰△OCD(−α)'},{c:C.green,t:'对应线段'}],
    hint:'反向旋转，注意有向角',interaction:'切换同向/反向，拖动点观察对应关系与全等结论。',
    yUp:true,
    controls:[
      {type:'buttons',key:'mode',items:[{label:'反手(推荐)',onclick:function(b,s){s.mode=-1;}},{label:'正手对比',onclick:function(b,s){s.mode=1;}}]},
      {type:'range',key:'alpha',label:'顶角 °',min:30,max:110,step:1,digits:0}
    ],
    init:function(b,s){s.mode=-1;s.alpha=70;s.A=P(-150,80);s.C=P(140,60);},
    draw:function(b,s){
      var O0=O(),a=s.alpha*D2R;
      var B=rot(s.A,O0,a),D0=rot(s.C,O0,s.mode*a);
      b.poly([O0,s.A,B],C.blue,.10,C.blue,2.4);
      b.poly([O0,s.C,D0],C.orange,.10,C.orange,2.4);
      var L1p,L1q,L2p,L2q,lbl1,lbl2,d1,d2;
      if(s.mode<0){ L1p=s.A;L1q=D0;L2p=B;L2q=s.C;lbl1='AD';lbl2='BC'; }
      else{ L1p=s.A;L1q=s.C;L2p=B;L2q=D0;lbl1='AC';lbl2='BD'; }
      d1=dist(L1p,L1q);d2=dist(L2p,L2q);
      b.line(L1p,L1q,C.green,3);b.line(L2p,L2q,C.green,3);
      tick(b,O0,s.A,C.blue);tick(b,O0,B,C.blue);tick(b,O0,s.C,C.orange);tick(b,O0,D0,C.orange);
      b.circle(O0,5,C.slate,C.slate,2);b.text({x:O0.x-14,y:O0.y-16},'O',C.slate,13,'middle',700);
      [[s.A,'A',C.blue],[B,'B',C.blue],[s.C,'C',C.orange],[D0,'D',C.orange]].forEach(function(t){
        b.circle(t[0],5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],13,'middle',700);});
      segLabel(b,L1p,L1q,lbl1+'='+d1.toFixed(1),C.green);
      segLabel(b,L2p,L2q,lbl2+'='+d2.toFixed(1),C.green);
      b.handle(s.A,'A',18);b.handle(s.C,'C',18);
      b.text(P(0,-235),s.mode<0?'反向：连 A-D 与 B-C':'同向：连 A-C 与 B-D',C.purple,13,'middle',700);
      b.readout((s.mode<0?'反手 AD=BC':'正手 AC=BD')+'：'+lbl1+'='+d1.toFixed(2)+'　'+lbl2+'='+d2.toFixed(2)+'　差='+(d1-d2).toFixed(3));
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A')b.state.A=q;else b.state.C=q;}
  };
  R(handReverse);

  /* ---------- 5. 半角模型 · 半角在内 ---------- */
  var halfIn={
    id:'cong-half-in',domain:'geometry',topic:'congruence',level:3,
    title:'半角模型 · 半角在内',brief:'正方形中 ∠EAF=45°（直角的一半），E、F 在相邻边上，则 EF=BE+DF。',
    keys:'半角模型 正方形 45度 旋转 补短 EF=BE+DF',
    idea:'把△ADF 绕 A 顺时针旋转 90° 到△ABG（D→B、F→G），B、E、G 三点共线。由半角导得 ∠GAF=∠EAF=45°，再证△AEF≌△AEG，得 EF=EG=BE+DF。口诀：半角在内 → 补短。',
    proof:['旋转 △ADF 到 △ABG：DF=BG，AF=AG，∠DAF=∠BAG。','∠EAG = ∠EAB+∠BAG = ∠EAB+∠DAF = 90°−45° = 45° = ∠EAF。','由 SAS，△AEF≌△AEG，故 EF=EG=EB+BG=BE+DF。','常用配套结论：△CEF 周长 = 2×边长；AE 平分∠BEF；AH(=边长)⊥EF。'],
    formula:'EF = BE + DF　　C△CEF = 2·AB',
    tips:['拖动 E，F 由 45° 条件自动确定','点击"显示旋转"看补短构造','观察 EF 与 BE+DF 恒等'],
    legend:[{c:C.blue,t:'正方形'},{c:C.orange,t:'△AEF'},{c:C.purple,t:'旋转补短'}],
    hint:'半角在内 → 补短，EF=BE+DF',interaction:'拖动 E，F 由 ∠EAF=45° 自动确定；可显示旋转补短构造。',
    yUp:true,
    controls:[
      {type:'range',key:'e',label:'BE / 边长',min:0.05,max:0.95,step:0.01,digits:2},
      {type:'button',key:'show',label:'↻ 显示旋转构造',onclick:function(b,s){s.show=!s.show;}}
    ],
    init:function(b,s){s.e=0.45;s.show=false;},
    draw:function(b,s){
      var a=170,edge=2*a,A=P(-a,-a),B=P(a,-a),Cc=P(a,a),D=P(-a,a);
      var u=s.e,e=edge*u;var E=P(a,-a+e);
      var f=edge*(1-u)/(1+u);var F=P(-a+f,a); // tan关系: DF/边=(1-u)/(1+u)
      b.poly([A,B,Cc,D],null,0,C.blue,2.6);
      b.poly([A,E,F],C.orange,.18,C.orange,2.4);
      if(s.show){
        // 旋转 △ADF 到 △ABG：D→B, F→G（G 在 CB 延长线上，BG=DF）
        var G=P(a,-a-f);
        b.poly([A,B,G],C.purple,.16,C.purple,2.4);
        b.polyline([E,B,G],C.purple,2,'6 4');
        b.text(P(150,-a-30),'△ADF 旋转 90° → △ABG',C.purple,12,'middle',700);
        b.text({x:G.x+16,y:G.y},'G',C.purple,13,'middle',700);
      }
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[D,'D',C.blue]].forEach(function(t){b.circle(t[0],4.5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],12,'middle',700);});
      b.circle(E,5,C.orange,C.orange,2);b.text({x:E.x+15,y:E.y},'E',C.orange,13,'middle',700);
      b.circle(F,5,C.orange,C.orange,2);b.text({x:F.x,y:F.y+18},'F',C.orange,13,'middle',700);
      b.handle(E,'E',18);
      var BE=e,DF=f,EF=dist(E,F);
      b.readout('∠EAF = 45°　EF='+EF.toFixed(1)+'　BE+DF='+(BE+DF).toFixed(1)+'　→ 差='+(EF-BE-DF).toFixed(3)+'（恒为 0）');
    },
    onDrag:function(b,n,w){var q=L(w);var a=170;var u=Math.max(.05,Math.min(.95,(q.y+a)/(2*a)));b.state.e=u;}
  };
  R(halfIn);

  /* ---------- 6. 半角模型 · 半角在外 ---------- */
  var halfOut={
    id:'cong-half-out',domain:'geometry',topic:'congruence',level:3,
    title:'半角模型 · 半角在外',brief:'正方形中 ∠EAF=45°，但 E、F 落在边的延长线上（半角探出大角），此时 EF=BE−DF。',
    keys:'半角模型 外部 截长 正方形 45度 EF=BE-DF',
    idea:'当 E 或 F 跑到延长线上，半角"探出"大角，线段拼不到一起，需反过来——从长线段上截去一段。仍用两次 SAS：先旋转凑全等，再用半角导夹角。口诀：半角在外 → 截长。',
    proof:['设 E 在 CB 延长线上（BE>边长），F 在 DC 延长线上，∠EAF=45°。','旋转 △ADF 到 △ABG，把 DF 转移到 BG。','由半角导得 ∠GAF=∠EAF=45°，证 △AEF≌△AEG。','EF=EG=BE−BG=BE−DF（注意此时是差不是和）。'],
    formula:'EF = BE − DF（半角在外）',
    tips:['拖动 E 越过顶点 C，进入"半角在外"情形','观察结论从 EF=BE+DF 变为 EF=BE−DF','多选填空常在这两种情形间切换'],
    legend:[{c:C.blue,t:'正方形'},{c:C.orange,t:'△AEF'},{c:C.purple,t:'截长辅助线'}],
    hint:'半角在外 → 截长，EF=BE−DF',interaction:'拖动 E 越过 C，F 由 ∠EAF=45° 自动确定，观察线段关系变为差。',
    yUp:true,
    controls:[{type:'range',key:'e',label:'BE / 边长',min:1.05,max:2.2,step:0.01,digits:2}],
    init:function(b,s){s.e=1.5;},
    draw:function(b,s){
      var a=150,edge=2*a,A=P(-a,-a),B=P(a,-a),Cc=P(a,a),D=P(-a,a);
      var u=s.e,e=edge*u;var E=P(a,-a+e); // u>1，E 在 C 上方延长线
      var f=edge*(1-u)/(1+u); // f<0，F 在 D 左侧延长线
      var F=P(-a+f,a);
      b.poly([A,B,Cc,D],null,0,C.blue,2.6);
      b.line({x:E.x,y:E.y},{x:F.x,y:F.y},C.orange,2.8);
      b.line(A,E,C.orange,2.2,'5 4');b.line(A,F,C.orange,2.2,'5 4');
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[D,'D',C.blue]].forEach(function(t){b.circle(t[0],4.5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],12,'middle',700);});
      b.circle(E,5,C.orange,C.orange,2);b.text({x:E.x+14,y:E.y},'E',C.orange,13,'middle',700);
      b.circle(F,5,C.orange,C.orange,2);b.text({x:F.x,y:F.y+18},'F',C.orange,13,'middle',700);
      b.handle(E,'E',18);
      var BE=e,DF=-f,EF=dist(E,F);
      b.text(P(0,-a-40),'半角在外：EF = BE − DF（用截长）',C.purple,13,'middle',700);
      b.readout('BE='+BE.toFixed(1)+'　DF='+DF.toFixed(1)+'　EF='+EF.toFixed(1)+'　BE−DF='+(BE-DF).toFixed(1)+'　差='+(EF-(BE-DF)).toFixed(3));
    },
    onDrag:function(b,n,w){var q=L(w);var a=150;var u=Math.max(1.05,Math.min(2.2,(q.y+a)/(2*a)));b.state.e=u;}
  };
  R(halfOut);

  /* ---------- 7. 三垂直 · 全等型（K 型） ---------- */
  var threePerpCong={
    id:'cong-three-perp',domain:'geometry',topic:'congruence',level:2,
    title:'三垂直模型 · 全等型（K 型）',brief:'等腰直角三角形直角顶点落在直线上，另外两顶点向直线作垂线，得到两个全等的直角三角形。',
    keys:'三垂直 K型 一线三直角 全等 AAS 等腰直角',
    idea:'等腰直角△ACB 的直角顶点 C 在直线 l 上，A、B 向 l 作垂线，垂足 D、E。由"同角的余角相等"得 ∠ACD=∠CBE，配合直角与斜边 AC=CB，用 AAS 证 △ACD≌△CBE。',
    proof:['AD⊥l、BE⊥l，故 ∠ADC=∠CEB=90°。','∠ACB=90°，所以 ∠ACD+∠BCE=90°；又 ∠CBE+∠BCE=90°，故 ∠ACD=∠CBE。','AC=CB（等腰直角），由 AAS 得 △ACD≌△CBE。','于是 AD=CE、CD=BE，进而 DE=AD+BE。'],
    formula:'△ACD ≌ △CBE　→　AD=CE, CD=BE',
    tips:['拖动滑块改变直线 l 的倾斜角','观察两个直角三角形始终全等','等腰直角顶点 C 固定在直线上'],
    legend:[{c:C.blue,t:'等腰Rt△ACB'},{c:C.orange,t:'△ACD'},{c:C.green,t:'△CBE'}],
    hint:'同角的余角相等 + AAS',interaction:'拖动倾角滑块，观察垂足变化，两三角形始终全等。',
    yUp:true,
    controls:[{type:'range',key:'theta',label:'直线 l 倾角 °',min:0,max:175,step:1,digits:0}],
    init:function(b,s){s.theta=25;},
    draw:function(b,s){
      var O0=O(),th=s.theta*D2R;
      var C=O0;
      // A、B 为以 C 为直角顶点的等腰直角三角形两锐角顶点
      var A=P(-120,120),B=P(120,120); // CA=CB, ∠ACB=90°（A左上，B右上）
      var u={x:Math.cos(th),y:Math.sin(th)},n={x:-u.y,y:u.x};
      var l1={x:C.x-u.x*320,y:C.y-u.y*320},l2={x:C.x+u.x*320,y:C.y+u.y*320};
      b.line(l1,l2,C.slate,2);
      // 垂足 D、E（A、B 到 l 的投影）
      var D={x:C.x+((A.x-C.x)*u.x+(A.y-C.y)*u.y)*u.x,y:C.y+((A.x-C.x)*u.x+(A.y-C.y)*u.y)*u.y};
      var E={x:C.x+((B.x-C.x)*u.x+(B.y-C.y)*u.y)*u.x,y:C.y+((B.x-C.x)*u.x+(B.y-C.y)*u.y)*u.y};
      b.poly([A,C,B],C.blue,.08,C.blue,2.2);
      b.poly([A,C,D],C.orange,.16,C.orange,2.2);
      b.poly([C,B,E],C.green,.16,C.green,2.2);
      b.line(A,D,C.slate,1.8,'5 4');b.line(B,E,C.slate,1.8,'5 4');
      b.rightAngle(D,sub(A,D),sub(C,D),10,C.orange);
      b.rightAngle(E,sub(B,E),sub(C,E),10,C.green);
      [[A,'A',C.blue],[B,'B',C.blue],[C,'C',C.slate],[D,'D',C.orange],[E,'E',C.green]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],12,'middle',700);});
      b.readout('AD='+dist(A,D).toFixed(1)+'　CE='+dist(C,E).toFixed(1)+'　CD='+dist(C,D).toFixed(1)+'　BE='+dist(B,E).toFixed(1)+'　（AD=CE, CD=BE）');
    }
  };
  R(threePerpCong);

  /* ---------- 8. 一线三等角 · K 型全等 ---------- */
  var threeEqCong={
    id:'cong-three-equal-k',domain:'geometry',topic:'congruence',level:3,
    title:'一线三等角 · K 型全等',brief:'一条直线上三个相等的角，配合一组等边，可证两侧三角形全等——三垂直是它的直角特例。',
    keys:'一线三等角 K型 全等 AAS 三个等角',
    idea:'直线 l 上有点 P、C、Q，∠APC=∠ACE=∠CQE=θ，且 CA=CE。借助外角定理可导得 ∠ACP=∠CEQ，配合等角与等边，由 AAS 证 △APC≌△CQE。',
    proof:['由外角定理：∠ACE = ∠A + ∠ACP，又 ∠ACE=θ=∠APC，可得角的关系。','同理在另一侧导角，得到 ∠ACP=∠CEQ。','已知 CA=CE，∠APC=∠CQE=θ，由 AAS 得 △APC≌△CQE。','故 AP=CQ、PC=QE。θ=90° 时即为三垂直全等。'],
    formula:'∠APC=∠ACE=∠CQE=θ，CA=CE ⟹ △APC ≌ △CQE',
    tips:['调节 θ 观察三等角变化（θ=90° 退化为三垂直）','拖动 A 改变构型，等边关系自动保持','体会"外角定理导角"这一关键步骤'],
    legend:[{c:C.blue,t:'△APC'},{c:C.orange,t:'△CQE'},{c:C.slate,t:'直线 l'}],
    hint:'外角定理导角 + AAS',interaction:'调节三等角 θ、拖动 A，观察两侧三角形始终全等。',
    yUp:true,
    controls:[
      {type:'range',key:'theta',label:'等角 θ °',min:35,max:80,step:1,digits:0},
      {type:'range',key:'phi',label:'A 位置参数',min:0.05,max:0.95,step:0.01,digits:2}
    ],
    init:function(b,s){s.theta=60;s.phi=0.5;},
    draw:function(b,s){
      var O0=O(),th=s.theta*D2R;
      var phi=th+5*D2R+s.phi*((150-5)*D2R-th); // phi∈(theta,150°)
      var L=150;
      var A={x:O0.x+L*Math.cos(phi),y:O0.y+L*Math.sin(phi)};
      var p=L*Math.sin(phi-th)/Math.sin(th); // PC
      var q=L*Math.sin(phi)/Math.sin(th);     // CQ
      var Pp={x:O0.x-p,y:O0.y},Q={x:O0.x+q,y:O0.y};
      var E={x:Q.x-p*Math.cos(th),y:Q.y-p*Math.sin(th)};
      var l1={x:O0.x-260,y:O0.y},l2={x:O0.x+280,y:O0.y};
      b.line(l1,l2,C.slate,2);
      b.poly([A,Pp,O0],C.blue,.14,C.blue,2.4);
      b.poly([O0,Q,E],C.orange,.14,C.orange,2.4);
      tick(b,O0,A,C.blue);tick(b,O0,E,C.orange);
      [[A,'A',C.blue],[Pp,'P',C.blue],[O0,'C',C.slate],[Q,'Q',C.orange],[E,'E',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y-14},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);
      b.text(P(0,-230),'∠APC = ∠ACE = ∠CQE = '+s.theta+'°　（CA=CE）',C.purple,13,'middle',700);
      b.readout('AP='+dist(A,Pp).toFixed(1)+'　CQ='+dist(O0,Q).toFixed(1)+'　PC='+p.toFixed(1)+'　QE='+dist(Q,E).toFixed(1)+'　→ 两组对应边相等');
    },
    onDrag:function(b,n,w){if(n==='A'){var q=L(w);var O0=O();var ph=Math.atan2(q.y,q.x);var th=b.state.theta*D2R;
      var vp=Math.max(.05,Math.min(.95,(ph-th-5*D2R)/((150-5)*D2R-th)));b.state.phi=vp;H.refreshControls(b.state);}}
  };
  R(threeEqCong);

  /* ---------- 9. 婆罗摩笈多 · 垂直型 ---------- */
  var brahmagupta={
    id:'cong-brahmagupta',domain:'geometry',topic:'congruence',level:3,
    title:'婆罗摩笈多模型（垂直 ⟺ 中点）',brief:'两个等腰直角三角形共直角顶点，过顶点的直线：垂直一对连线 ⟺ 平分另一对连线。',
    keys:'婆罗摩笈多 共顶点 等腰直角 垂直 中点 全等',
    idea:'这是"手拉手"与"倍长中线"的合体。两个等腰直角三角形共直角顶点 O，过 O 作直线交两对连线：若垂直 BC 则必平分 AD，若平分 AD 则必垂直 BC；且 O 到交点距离 OM=½AD。',
    proof:['基础型：△AOB、△COD 均为等腰直角，共顶点 O。设直线交 BC 于 M、交 AD 于 N。','证"M 是中点 ⟹ MN⊥AD 且 OM=½AD"：延长 OM 到 P 使 MP=OM，连 CP。','△OBM≌△PCM（SAS：BM=CM、对顶角、OM=PM），得 CP=OB=OA 且 CP∥OB。','再证 △PCO≌△AOD（SAS），得 OP=AD，故 OM=½AD；同时导角得 MN⊥AD。','逆命题"MN⊥AD ⟹ M 是中点"用一线三直角垂线法可证，两向互通。'],
    formula:'M 为 BC 中点 ⟺ MN ⊥ AD，且 OM = ½·AD',
    tips:['拖动 E 沿 BC 移动，观察垂直与中点的联动','切到"中点"模式：锁定 M 为中点，垂直自动成立','切到"垂直"模式：锁定垂直，M 自动成为中点'],
    legend:[{c:C.blue,t:'等腰Rt△AOB'},{c:C.orange,t:'等腰Rt△COD'},{c:C.green,t:'过O直线'}],
    hint:'知垂直⇄得中点，双向通道',interaction:'拖动交点 E，或切换模式，观察"垂直"与"中点"始终互为充要条件。',
    yUp:true,
    controls:[
      {type:'buttons',key:'mode',items:[
        {label:'自由拖动',onclick:function(b,s){s.mode='free';}},
        {label:'锁定中点',onclick:function(b,s){s.mode='mid';}},
        {label:'锁定垂直',onclick:function(b,s){s.mode='perp';}}
      ]},
      {type:'range',key:'t',label:'交点位置 t',min:-0.9,max:0.9,step:0.01,digits:2}
    ],
    init:function(b,s){s.mode='free';s.t=0;},
    draw:function(b,s){
      var O0=O();
      // 两个等腰直角三角形共顶点 O
      var A=P(-150,60),B=rot(A,O0,90*D2R);
      var C1=P(60,-160),D1=rot(C1,O0,90*D2R);
      // BC 中点 M
      var M=mid(B,C1);
      var lineP,dir;
      if(s.mode==='mid'){lineP=M;dir=unit(sub(M,O0));}
      else if(s.mode==='perp'){
        // 过 O 且垂直 AD 的方向
        var ad=unit(sub(D1,A));dir={x:-ad.y,y:ad.x};lineP=O0;
      }else{
        // 自由：直线过 O 与 BC 上参数点 E
        var E=lerp2(B,C1,(s.t+1)/2);dir=unit(sub(E,O0));lineP=O0;
      }
      var l1={x:O0.x-dir.x*340,y:O0.y-dir.y*340},l2={x:O0.x+dir.x*340,y:O0.y+dir.y*340};
      b.line(l1,l2,C.green,2.4);
      b.poly([O0,A,B],C.blue,.08,C.blue,2.2);
      b.poly([O0,C1,D1],C.orange,.08,C.orange,2.2);
      b.line(B,C1,C.slate,1.8,'5 4');b.line(A,D1,C.slate,1.8,'5 4');
      // 交点：直线与 BC、AD
      function intersect(p1,p2,q1,q2){
        var r=sub(p2,p1),ss=sub(q2,q1),den=r.x*ss.y-r.y*ss.x;
        if(Math.abs(den)<1e-6)return q1;
        var tt=((q1.x-p1.x)*ss.y-(q1.y-p1.y)*ss.x)/den;
        return {x:p1.x+tt*r.x,y:p1.y+tt*r.y};
      }
      var X=intersect(O0,{x:O0.x+dir.x*400,y:O0.y+dir.y*400},B,C1);
      var Y=intersect(O0,{x:O0.x+dir.x*400,y:O0.y+dir.y*400},A,D1);
      b.circle(X,5,C.green,C.green,2);b.circle(Y,5,C.green,C.green,2);
      [[O0,'O',C.slate],[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.orange],[D1,'D',C.orange],[X,'M',C.green],[Y,'N',C.green]].forEach(function(t){
        b.circle(t[0],4,t[2],t[2],1.6);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      var midX=dist(X,B),midY=dist(X,C1),perp=Math.abs((D1.x-A.x)*dir.x+(D1.y-A.y)*dir.y);
      var okMid=Math.abs(midX-midY)<1.5,okPerp=perp<2.5;
      b.text(P(0,-250),'M 为中点？'+(okMid?' ✓':' ✗')+'　　MN⊥AD？'+(okPerp?' ✓':' ✗'),okMid&&okPerp?C.green:C.orange,13,'middle',700);
      b.readout('OM='+dist(O0,X).toFixed(1)+'　½AD='+(dist(A,D1)/2).toFixed(1)+'　（基础型恒满足 OM=½AD）　模式：'+s.mode);
    },
    onDrag:function(b,n,w){},
    step:null
  };
  R(brahmagupta);

  /* ---------- 10. 婆罗摩笈多 · 中点型（面积与倍半） ---------- */
  var brahmaguptaMid={
    id:'cong-brahmagupta-mid',domain:'geometry',topic:'congruence',level:3,
    title:'婆罗摩笈多 · 中点与倍半',brief:'同一构型下，连接一对连线，过顶点直线的中线恰好等于另一连线的一半，且两组三角形面积相等。',
    keys:'婆罗摩笈多 中线 倍长 AD=2OM 面积相等',
    idea:'在婆罗摩笈多构型中，若 M 是 BC 中点，则 OM=½AD（即 AD=2OM），这由倍长中线两次 SAS 得到；同时 S△BOC=S△AOD——两个形状不同的三角形面积恒相等。',
    proof:['延长 OM 到 P 使 MP=OM，连 CP。△OBM≌△PCM（SAS）。','得 CP=OB=OA 且 CP∥OB，导角得 ∠PCO=∠AOD。','△PCO≌△AOD（SAS），故 OP=AD，即 2OM=AD。','面积：由两组全等的高相等、底相等，可得 S△BOC=S△AOD。'],
    formula:'AD = 2·OM　　S△BOC = S△AOD',
    tips:['拖动 A 或 C 改变两等腰直角三角形','观察 AD 与 OM 始终成 2 倍','两个阴影三角形面积始终相等'],
    legend:[{c:C.blue,t:'△AOB'},{c:C.orange,t:'△COD'},{c:C.green,t:'中线OM'}],
    hint:'倍长中线 → AD=2OM',interaction:'拖动 A、C，观察 AD=2OM 与两三角形面积相等恒成立。',
    yUp:true,
    controls:[{type:'range',key:'scaleC',label:'△COD 大小',min:60,max:170,step:1,digits:0}],
    init:function(b,s){s.scaleC=120;},
    draw:function(b,s){
      var O0=O(),A=P(-150,70),B=rot(A,O0,90*D2R);
      var k=s.scaleC/120,C1=P(70*k,-60*k),D1=rot(C1,O0,90*D2R);
      var M=mid(B,C1);
      b.poly([O0,A,B],C.blue,.08,C.blue,2.2);
      b.poly([O0,C1,D1],C.orange,.08,C.orange,2.2);
      b.poly([B,O0,C1],C.blue,.14,null,0);
      b.poly([A,O0,D1],C.orange,.14,null,0);
      b.line(O0,M,C.green,3);
      b.line(B,C1,C.slate,1.5,'5 4');b.line(A,D1,C.slate,1.5,'5 4');
      [[O0,'O',C.slate],[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.orange],[D1,'D',C.orange],[M,'M',C.green]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      var AD=dist(A,D1),OM=dist(O0,M);
      var areaBOC=Math.abs((B.x-O0.x)*(C1.y-O0.y)-(B.y-O0.y)*(C1.x-O0.x))/2;
      var areaAOD=Math.abs((A.x-O0.x)*(D1.y-O0.y)-(A.y-O0.y)*(D1.x-O0.x))/2;
      b.text(P(0,-245),'S△BOC = '+areaBOC.toFixed(0)+'　S△AOD = '+areaAOD.toFixed(0)+'　（恒相等）',C.purple,13,'middle',700);
      b.readout('AD='+AD.toFixed(1)+'　OM='+OM.toFixed(1)+'　AD−2OM='+(AD-2*OM).toFixed(3)+'（恒为 0）');
    }
  };
  R(brahmaguptaMid);

  /* ---------- 11. 倍长中线 ---------- */
  var doubleMedian={
    id:'cong-double-median',domain:'geometry',topic:'congruence',level:2,
    title:'倍长中线模型',brief:'见中点、有中线时，把中线延长一倍，构造 SAS 全等，把分散的线段集中到一个三角形中。',
    keys:'倍长中线 中点 全等 SAS 线段转移 三边关系',
    idea:'AD 是 △ABC 的中线。延长 AD 到 E 使 DE=AD，连 BE。由 BD=CD、对顶角、AD=DE 得 △ADC≌△EDB，故 AC=BE。于是把 AC"搬"到 BE，可在 △ABE 中用三边关系证 AB+AC>2AD。',
    proof:['D 是 BC 中点，故 BD=CD。','∠ADC=∠EDB（对顶角），AD=DE（倍长构造）。','由 SAS，△ADC≌△EDB，故 AC=BE。','在 △ABE 中 AB+BE>AE=2AD，即 AB+AC>2AD；常用于线段和差与不等关系。'],
    formula:'延长 AD 到 E 使 DE=AD ⟹ AC=BE，AB+AC>2AD',
    tips:['拖动 A、B、C 改变三角形','点击"倍长"看构造过程','观察 AC 与 BE 始终相等'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'倍长构造'},{c:C.green,t:'AC=BE'}],
    hint:'见中点 → 延长一倍 → SAS 全等',interaction:'拖动顶点，点击"倍长"展示构造，观察 AC=BE 恒成立。',
    yUp:true,
    controls:[{type:'button',key:'show',label:'✦ 倍长中线',onclick:function(b,s){s.show=!s.show;}}],
    init:function(b,s){s.show=true;s.A=P(-60,180);s.B=P(-170,-90);s.C=P(170,-70);},
    draw:function(b,s){
      var A=s.A,B=s.B,C1=s.C,D=mid(B,C1),E={x:2*D.x-A.x,y:2*D.y-A.y};
      b.poly([A,B,C1],C.blue,.07,C.blue,2.4);
      b.line(A,D,C.green,2.8);
      if(s.show){
        b.line(D,E,C.green,2.8,'7 5');
        b.line(B,E,C.orange,2.4);
        b.poly([B,D,E],C.orange,.14,C.orange,2.2);
        b.poly([C1,D,A],C.purple,.10,C.purple,2);
        b.text(P(0,-250),'△ADC ≌ △EDB（SAS）→ AC = BE',C.purple,13,'middle',700);
      }
      tick(b,A,D,C.green);tick(b,D,E,C.green);tick(b,B,D,C.blue);tick(b,D,C1,C.blue);
      [[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.blue],[D,'D',C.green],[E,'E',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B,'B',18);b.handle(C1,'C',18);
      b.readout('AC='+dist(A,C1).toFixed(1)+'　BE='+dist(B,E).toFixed(1)+'　AD='+dist(A,D).toFixed(1)+'　AE='+dist(A,E).toFixed(1)+'(=2AD)');
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A')b.state.A=q;else if(n==='B')b.state.B=q;else b.state.C=q;}
  };
  R(doubleMedian);

  /* ---------- 12. 截长补短 ---------- */
  var cutFill={
    id:'cong-cut-fill',domain:'geometry',topic:'congruence',level:2,
    title:'截长补短模型',brief:'要证一条线段等于另外两条线段之和（或差），可在长线段上截一段，或把短线段补长，再证全等。',
    keys:'截长补短 线段和差 角平分线 全等',
    idea:'证 EF=AB+CD 时：截长法——在 EF 上截取 EG=AB，再证 GF=CD；补短法——延长 AB 到 H 使 BH=CD，再证 AH=EF。两法都把"和差"转化为"证两段相等"，通常配合全等完成。',
    proof:['截长：在长线段上截取一段等于已知短线段，证剩余段等于另一短线段。','补短：延长一条短线段使其加上另一短线段，证总长等于长线段。','核心都是构造全等三角形，把线段"搬运"到可比较的位置。','角平分线 + 线段和差是截长补短的高频场景。'],
    formula:'证 EF=AB+CD ⟺ 截长 EG=AB 后证 GF=CD',
    tips:['切换截长/补短两种方法','拖动滑块改变三段长度（保持和差关系）','观察全等构造如何"搬运"线段'],
    legend:[{c:C.blue,t:'长线段 EF'},{c:C.orange,t:'短线段 AB'},{c:C.green,t:'短线段 CD'}],
    hint:'线段和差 → 截长或补短 → 全等',interaction:'切换截长/补短，调节长度，观察构造始终保持和差关系。',
    yUp:true,
    controls:[
      {type:'buttons',key:'mode',items:[{label:'截长',onclick:function(b,s){s.mode='cut';}},{label:'补短',onclick:function(b,s){s.mode='fill';}}]},
      {type:'range',key:'ab',label:'AB 长度',min:60,max:150,step:1,digits:0},
      {type:'range',key:'cd',label:'CD 长度',min:50,max:150,step:1,digits:0}
    ],
    init:function(b,s){s.mode='cut';s.ab=100;s.cd=80;},
    draw:function(b,s){
      var total=s.ab+s.cd;
      var x0=P(-260,60),x3={x:x0.x+total,y:x0.y};
      var x1={x:x0.x+s.ab,y:x0.y};
      // 三段：AB=s.ab, CD=s.cd, EF=total
      b.line(x0,x3,C.blue,4);
      b.line(x0,{x:x0.x+s.ab,y:x0.y-45},C.orange,3);
      b.line({x:x1.x,y:x0.y-60},{x:{x:x1.x+s.cd}.x,y:x0.y-60},C.green,3);
      [[x0,'E',C.blue],[x1,'G',C.purple],[x3,'F',C.blue]].forEach(function(t){
        b.circle(t[0],5,t[2],t[2],2);b.text({x:t[0].x,y:t[0].y+20},t[1],t[2],13,'middle',700);});
      b.text({x:x0.x+s.ab/2,y:x0.y-60},'AB='+s.ab,C.orange,12,'middle',700);
      b.text({x:x1.x+s.cd/2,y:x0.y-80},'CD='+s.cd,C.green,12,'middle',700);
      if(s.mode==='cut'){
        b.text(P(0,-160),'截长：在 EF 上取 EG=AB，只需证 GF=CD',C.purple,14,'middle',700);
        b.circle(x1,7,'none',C.purple,2);
        segLabel(b,x1,x3,'GF='+s.cd,C.purple);
      }else{
        b.text(P(0,-160),'补短：延长 AB 至 H 使 BH=CD，只需证 AH=EF',C.purple,14,'middle',700);
        var Hh={x:x0.x+total,y:x0.y-45};
        b.line({x:x0.x+s.ab,y:x0.y-45},Hh,C.purple,3,'6 4');
      }
      b.readout('AB+CD='+(s.ab+s.cd)+'　EF='+total+'　EG=AB='+s.ab+'　GF='+s.cd+'　→ 恒等 ✓');
    }
  };
  R(cutFill);

  /* ---------- 13. 角平分线 · 向两边作垂线 ---------- */
  var bisectorPerpSides={
    id:'cong-bisector-perp-sides',domain:'geometry',topic:'congruence',level:1,
    title:'角平分线 · 向两边作垂线',brief:'角平分线上的点到角两边的距离相等——这是角平分线最核心的性质与辅助线。',
    keys:'角平分线 垂线 距离相等 全等 角平分线性质',
    idea:'P 在 ∠MON 的平分线上，PM⊥OM、PN⊥ON。由 AAS（或 HL）可证 Rt△OPM≌Rt△OPN，故 PM=PN——角平分线上的点到两边距离相等。',
    proof:['OP 平分 ∠MON，故 ∠MOP=∠NOP。','PM⊥OM、PN⊥ON，故 ∠OMP=∠ONP=90°。','OP 为公共斜边，由 AAS（或 HL）得 Rt△OPM≌Rt△OPN。','故 PM=PN，即角平分线上的点到两边距离相等。逆定理也成立。'],
    formula:'P 在角平分线上 ⟺ d(P,OM)=d(P,ON)',
    tips:['拖动 P 沿角平分线移动','调节角的大小','观察两条垂线段始终等长'],
    legend:[{c:C.blue,t:'角的两边'},{c:C.orange,t:'垂线段 PM/PN'},{c:C.green,t:'角平分线 OP'}],
    hint:'角平分线 → 到两边距离相等',interaction:'拖动 P、调节角度，观察两条垂线段始终等长。',
    yUp:true,
    controls:[
      {type:'range',key:'ang',label:'角 MON °',min:30,max:120,step:1,digits:0},
      {type:'range',key:'d',label:'OP 长度',min:100,max:260,step:1,digits:0}
    ],
    init:function(b,s){s.ang=70;s.d=180;},
    draw:function(b,s){
      var O0=O(),half=s.ang*D2R/2;
      var uM={x:Math.cos(half),y:-Math.sin(half)},uN={x:Math.cos(half),y:Math.sin(half)};
      var M1={x:O0.x+uM.x*320,y:O0.y+uM.y*320},N1={x:O0.x+uN.x*320,y:O0.y+uN.y*320};
      var P2={x:O0.x+s.d,y:O0.y};
      // 垂足
      function foot(Pt,u){var t=(Pt.x-O0.x)*u.x+(Pt.y-O0.y)*u.y;return{x:O0.x+t*u.x,y:O0.y+t*u.y};}
      var Fm=foot(P2,uM),Fn=foot(P2,uN);
      b.line(O0,M1,C.blue,2.6);b.line(O0,N1,C.blue,2.6);
      b.line(O0,P2,C.green,2.4,'7 5');
      b.line(P2,Fm,C.orange,3);b.line(P2,Fn,C.orange,3);
      b.rightAngle(Fm,sub(P2,Fm),sub(O0,Fm),12,C.orange);
      b.rightAngle(Fn,sub(P2,Fn),sub(O0,Fn),12,C.orange);
      [[O0,'O',C.slate],[P2,'P',C.green],[Fm,'M',C.orange],[Fn,'N',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.readout('PM='+dist(P2,Fm).toFixed(1)+'　PN='+dist(P2,Fn).toFixed(1)+'　→ 差='+(dist(P2,Fm)-dist(P2,Fn)).toFixed(3)+'（角平分线上的点到两边距离相等）');
    }
  };
  R(bisectorPerpSides);

  /* ---------- 14. 角平分线 · 对平分线作垂线 ---------- */
  var bisectorPerpItself={
    id:'cong-bisector-perp-itself',domain:'geometry',topic:'congruence',level:2,
    title:'角平分线 · 作它的垂线（三线合一）',brief:'过一边上一点作角平分线的垂线并延长交另一边，得到等腰三角形——角平分线同时是高和中线。',
    keys:'角平分线 垂线 三线合一 等腰三角形 全等',
    idea:'AP 平分 ∠A，过 B 作 BP⊥AP 于 P，延长 BP 交 AC 的延长线于 C′。由 ASA 证 △ABP≌△C′BP，得 AB=AC′、BP=PC′，即 △ABC′ 是等腰三角形，AP 是它的高也是中线（三线合一）。',
    proof:['AP 平分 ∠A，故 ∠BAP=∠C′AP。','BP⊥AP，故 ∠APB=∠APC′=90°。','AP 为公共边，由 ASA 得 △ABP≌△C′BP。','故 AB=AC′、BP=PC′，△ABC′ 等腰，AP 三线合一。'],
    formula:'角平分线 ⟂ 线 ⟹ 等腰三角形，AP 是高兼中线',
    tips:['拖动 B 改变三角形','调节角平分线方向','观察 AB 与 AC′ 始终相等'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'垂线构造'},{c:C.green,t:'等腰△ABC′'}],
    hint:'角平分线 + 垂线 → 三线合一',interaction:'拖动 B、调角，观察构造出的等腰三角形与 AB=AC′。',
    yUp:true,
    controls:[{type:'range',key:'angle',label:'∠A 大小 °',min:40,max:110,step:1,digits:0}],
    init:function(b,s){s.angle=70;},
    draw:function(b,s){
      var A=P(-170,-80),half=s.angle*D2R/2;
      // AP 方向为角平分线（水平向右）
      var uP={x:1,y:0};
      var uAB={x:Math.cos(-half),y:Math.sin(-half)},uAC={x:Math.cos(half),y:Math.sin(half)};
      var B={x:A.x+uAB.x*260,y:A.y+uAB.y*260};
      var C1={x:A.x+uAC.x*240,y:A.y+uAC.y*240};
      // P 为 B 在 AP 上投影；C′ 为 BP 延长与 AC 射线交点
      var P2={x:B.x,y:A.y};
      var t=(C1.x-A.x)/(B.x-P2.x||1);
      var Cp={x:A.x+uAC.x*dist(A,B),y:A.y+uAC.y*dist(A,B)};
      b.poly([A,B,C1],C.blue,.07,C.blue,2.2);
      b.line(A,{x:A.x+uP.x*380,y:A.y},C.green,2.4,'7 5');
      b.line(B,Cp,C.orange,2.8);
      b.rightAngle(P2,sub(B,P2),sub(A,P2),12,C.orange);
      b.poly([A,B,Cp],null,0,C.green,1.8);
      [[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.blue],[P2,'P',C.orange],[Cp,'C′',C.green]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(B,'B',18);
      b.readout('AB='+dist(A,B).toFixed(1)+'　AC′='+dist(A,Cp).toFixed(1)+'　BP='+dist(B,P2).toFixed(1)+'　PC′='+dist(P2,Cp).toFixed(1)+'（△ABC′ 等腰）');
    },
    onDrag:function(b,n,w){if(n==='B'){var q=L(w);var A=P(-170,-80);var r=dist(A,q);var half=b.state.angle*D2R/2;
      b.state.angle=Math.max(40,Math.min(110,2*Math.abs(Math.atan2(q.y-A.y,q.x-A.x))*R2D));H.refreshControls(b.state);}}
  };
  R(bisectorPerpItself);

  /* ---------- 15. 角平分线 + 平行线 ---------- */
  var bisectorParallel={
    id:'cong-bisector-parallel',domain:'geometry',topic:'congruence',level:1,
    title:'角平分线 + 平行线 → 等腰',brief:'角平分线遇到平行线，往往"送"出一个等腰三角形：内错角相等 + 半角相等。',
    keys:'角平分线 平行线 等腰三角形 内错角',
    idea:'AD 平分 ∠A，过 D 作 DE∥AB 交 AC 于 E。由平行线内错角 ∠EDA=∠BAD，而 ∠BAD=∠DAE（角平分线），故 ∠EDA=∠DAE，得 AE=DE——角平分线遇到平行线，必"送"出一个等腰三角形。',
    proof:['AD 平分 ∠A，故 ∠BAD=∠DAC=∠DAE。','DE∥AB，故 ∠EDA=∠BAD（内错角）。','所以 ∠EDA=∠DAE，△ADE 为等腰三角形，AE=DE。','同理若过 D 作 AC 的平行线交 AB 于 F，则 AF=DF。这是构造等腰三角形的常用辅助线。'],
    formula:'AD 平分∠A 且 DE∥AB ⟹ AE = DE',
    tips:['拖动 A 改变顶角大小','D 是角平分线与 BC 的交点（自动计算）','观察 AE 与 DE 始终相等'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'平行线 DE'},{c:C.green,t:'角平分线 AD'}],
    hint:'内错角 + 半角 → 等腰',interaction:'拖动 A 改变三角形，观察等腰△ADE 中 AE=DE 恒成立。',
    yUp:true,
    controls:[{type:'range',key:'ax',label:'顶点 A 水平位置',min:-90,max:90,step:1,digits:0}],
    init:function(b,s){s.ax=0;},
    draw:function(b,s){
      var A=P(s.ax,190),B=P(-180,-90),C1=P(180,-90);
      // D = 角平分线与 BC 的交点（角平分线定理 BD/DC=AB/AC）
      var AB=dist(A,B),AC=dist(A,C1),t=AB/(AB+AC);
      var D=lerp2(B,C1,t);
      // 过 D 作 DE∥AB 交 AC 于 E：E = A + u*(C−A)，其中 DE∥AB
      // E 满足 E−D 与 B−A 平行：解 A+u(C−A)−D = k(B−A)
      var v1=sub(C1,A),v2=sub(B,A),w=sub(D,A);
      // u*v1 − k*v2 = w  →  用叉积解 u
      var cross=function(a,bb){return a.x*bb.y-a.y*bb.x;};
      var u=cross(w,v2)/cross(v1,v2);
      var E={x:A.x+u*v1.x,y:A.y+u*v1.y};
      b.poly([A,B,C1],C.blue,.06,C.blue,2.2);
      b.line(A,D,C.green,2.6);
      b.line(D,E,C.orange,2.8);
      b.poly([A,D,E],C.green,.14,null,0);
      [[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.blue],[D,'D',C.slate],[E,'E',C.orange]].forEach(function(pt){
        b.circle(pt[0],4.5,pt[2],pt[2],1.8);b.text({x:pt[0].x,y:pt[0].y-13},pt[1],pt[2],12,'middle',700);});
      b.handle(A,'A',18);
      b.text(P(0,-195),'AD 平分∠A，DE∥AB　→　△ADE 等腰，AE=DE',C.purple,13,'middle',700);
      b.readout('AE='+dist(A,E).toFixed(1)+'　DE='+dist(D,E).toFixed(1)+'　差='+(dist(A,E)-dist(D,E)).toFixed(3)+'（内错角+半角 → 等腰）');
    },
    onDrag:function(b,n,w){if(n==='A'){var q=L(w);b.state.ax=Math.max(-90,Math.min(90,q.x-450));H.refreshControls(b.state);}}
  };
  R(bisectorParallel);

  /* ---------- 16. 十字架（正方形） ---------- */
  var crossSquare={
    id:'cong-cross-square',domain:'geometry',topic:'congruence',level:2,
    title:'十字架模型（正方形）',brief:'正方形中两条互相垂直的线段（分别连接两邻边上的点）长度相等。',
    keys:'十字架 正方形 垂直 相等 全等',
    idea:'正方形 ABCD 中，E 在 BC 上、F 在 CD 上，若 AE⊥BF，则 AE=BF。由"同角的余角相等"得 ∠BAE=∠CBF，配合 AB=BC 与直角，用 ASA 证 Rt△ABE≌Rt△BCF。',
    proof:['∠ABE=∠BCF=90°（正方形角），AB=BC。','AE⊥BF，故 ∠BAE 与 ∠CBF 都是 ∠ABF 的余角，得 ∠BAE=∠CBF。','由 ASA，Rt△ABE≌Rt△BCF。','故 AE=BF；这就是正方形"十字架"结论：线段垂直 ⟺ 线段相等。'],
    formula:'AE ⊥ BF ⟺ AE = BF（正方形十字架）',
    tips:['拖动 E，F 由垂直条件自动确定','观察 AE 与 BF 始终等长','点击交换看逆命题：等长也能推出垂直'],
    legend:[{c:C.blue,t:'正方形'},{c:C.orange,t:'AE'},{c:C.green,t:'BF'}],
    hint:'正方形 + 垂直 → 线段相等',interaction:'拖动 E，F 由 AE⊥BF 自动确定，观察 AE=BF。',
    yUp:true,
    controls:[{type:'range',key:'t',label:'E 在 BC 上位置',min:0.05,max:0.95,step:0.01,digits:2}],
    init:function(b,s){s.t=0.5;},
    draw:function(b,s){
      var a=155,A=P(-a,-a),B=P(a,-a),Cc=P(a,a),D=P(-a,a);
      var E={x:B.x,y:B.y+(Cc.y-B.y)*s.t};
      // 十字架：Rt△ABE≌Rt△BCF ⟹ CF=BE=2a·t（边长=2a）
      var be=s.t*2*a;var F={x:Cc.x-be,y:Cc.y};
      b.poly([A,B,Cc,D],null,0,C.blue,2.6);
      b.line(A,E,C.orange,3);b.line(B,F,C.green,3);
      b.poly([A,B,E],C.orange,.10,null,0);
      b.poly([B,Cc,F],C.green,.10,null,0);
      // 交点直角记号
      function intersect(p1,p2,q1,q2){var r=sub(p2,p1),ss=sub(q2,q1),den=r.x*ss.y-r.y*ss.x;
        if(Math.abs(den)<1e-6)return p1;var tt=((q1.x-p1.x)*ss.y-(q1.y-p1.y)*ss.x)/den;return{x:p1.x+tt*r.x,y:p1.y+tt*r.y};}
      var X=intersect(A,E,B,F);
      b.rightAngle(X,sub(A,X),sub(F,X),11,C.purple);
      [[A,'A',C.blue],[B,'B',C.blue],[Cc,'C',C.blue],[D,'D',C.blue],[E,'E',C.orange],[F,'F',C.green]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(E,'E',18);
      b.readout('AE='+dist(A,E).toFixed(1)+'　BF='+dist(B,F).toFixed(1)+'　→ 差='+(dist(A,E)-dist(B,F)).toFixed(3)+'（AE ⟂ BF 且 AE=BF）');
    },
    onDrag:function(b,n,w){if(n==='E'){var q=L(w);var a=155;var t=Math.max(.05,Math.min(.95,(q.y+a)/(2*a)));b.state.t=t;H.refreshControls(b.state);}}
  };
  R(crossSquare);

})();
