/* ============ 图形与几何 · 相似模型主题（8 个） ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,mid=V.mid,unit=V.unit,lerp2=V.lerp2;
  var D2R=Math.PI/180,R2D=180/Math.PI;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};}
  function L(w){return{x:w.x-450,y:w.y-300};}
  function rot(p,c,a){var dx=p.x-c.x,dy=p.y-c.y,cs=Math.cos(a),sn=Math.sin(a);
    return{x:c.x+dx*cs-dy*sn,y:c.y+dx*sn+dy*cs};}
  function segLabel(b,p,q,txt,col,size){var m=mid(p,q);b.text({x:m.x,y:m.y+14},txt,col||'var(--mh-muted)',size||12,'middle',700);}
  function ratioMark(b,p,q,ratio,col){
    var m=mid(p,q);b.text({x:m.x,y:m.y-8},'k='+ratio,col||C.purple,12,'middle',700);
  }

  /* ---------- 1. 三垂直 · 相似型（一线三直角） ---------- */
  var threePerpSim={
    id:'sim-three-perp',domain:'geometry',topic:'similarity',level:2,
    title:'三垂直模型 · 相似型',brief:'一线三直角：三个直角顶点共线，两侧直角三角形相似，竖直线段是水平线段的比例中项。',
    keys:'三垂直 一线三直角 相似 射影 比例中项',
    idea:'直线 l 上有三个直角顶点，∠ACB=∠ADC=∠BEC=90°。由"同角的余角相等"得 ∠ACD=∠CBE，配合两个直角，得 △ACD∽△CBE，从而 CD/AD=BE/CE，即竖直段的乘积关系。',
    proof:['∠ADC=∠CEB=90°，且 ∠ACB=90°。','∠ACD+∠BCE=90°，∠CBE+∠BCE=90°，故 ∠ACD=∠CBE。','两角对应相等，△ACD∽△CBE（AA）。','故 AD/CE=CD/BE，即 AD·BE=CD·CE；特殊地可导出比例中项关系。'],
    formula:'△ACD ∽ △CBE　→　AD/CE = CD/BE',
    tips:['拖动 C 沿直线移动','调节两竖直段的长度','观察两组三角形边长比恒相等'],
    legend:[{c:C.blue,t:'△ACD'},{c:C.orange,t:'△CBE'},{c:C.slate,t:'直线 l'}],
    hint:'同角余角相等 → AA 相似',interaction:'拖动 C、调节竖直线段，观察两直角三角形相似比恒定。',
    yUp:true,
    controls:[{type:'range',key:'h',label:'左竖段 AD',min:70,max:180,step:1,digits:0}],
    init:function(b,s){s.h=120;},
    draw:function(b,s){
      var C=O(),h=s.h,d=140;
      // CA=(-d,h)，CB⊥CA 取 (h,d) 方向适当缩放：CB=(h*k,d*k)，令 E 在 C 右侧
      var k=d/h; // 使 B 的竖直高度 = d，水平 = d*k... 直接定 CB=(h*(d/h), d*(d/h))? 
      // 简化：CB 方向 (h, d)，缩放使水平 CE 合适显示
      var sc2=140/h; // 让 B 水平距离≈140
      var B2={x:C.x+h*sc2,y:C.y+d*sc2},E={x:B2.x,y:C.y};
      var A={x:C.x-d,y:C.y+h},D1={x:C.x-d,y:C.y};
      var l1={x:C.x-260,y:C.y},l2={x:C.x+300,y:C.y};
      b.line(l1,l2,C.slate,2);
      b.poly([A,C,D1],C.blue,.16,C.blue,2.4);
      b.poly([C,B2,E],C.orange,.16,C.orange,2.4);
      b.line(A,D1,C.blue,2.4);b.line(B2,E,C.orange,2.4);
      b.rightAngle(D1,sub(A,D1),sub(C,D1),11,C.blue);
      b.rightAngle(E,sub(B2,E),sub(C,E),11,C.orange);
      b.rightAngle(C,sub(A,C),sub(B2,C),11,C.purple);
      [[A,'A',C.blue],[C,'C',C.slate],[D1,'D',C.blue],[B2,'B',C.orange],[E,'E',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);
      var AD=h,CD=d,CE=B2.x-C.x,BE=B2.y-C.y;
      // △ACD∽△CBE: AD/CE = CD/BE
      var r1=AD/CE,r2=CD/BE;
      b.readout('AD='+AD.toFixed(0)+'　CE='+CE.toFixed(0)+'　CD='+CD+'　BE='+BE.toFixed(0)+'　AD/CE='+r1.toFixed(3)+'　CD/BE='+r2.toFixed(3));
    },
    onDrag:function(b,n,w){var q=L(w);if(n==='A'){b.state.h=Math.max(70,Math.min(180,q.y-300));H.refreshControls(b.state);}}
  };
  R(threePerpSim);

  /* ---------- 2. 一线三等角 · 同侧型 ---------- */
  var threeEqSame={
    id:'sim-three-eq-same',domain:'geometry',topic:'similarity',level:2,
    title:'一线三等角 · 同侧型',brief:'一条直线上三个相等的角在直线同侧，两侧的三角形相似：△ACE∽△BED。',
    keys:'一线三等角 同侧 相似 AA 外角定理',
    idea:'点 A、C、B 共线，∠ACE=∠D=∠E=θ（三个等角）。由外角定理 ∠DCE=∠A+∠AEC，导得 ∠A=∠CEB，配合等角，得 △ACE∽△BED。',
    proof:['∠ACE=∠D=∠E=θ。','由外角定理：∠DCE=∠A+∠AEC，又 ∠DCE=θ+∠CEB（拆分），可导出 ∠A=∠CEB。','再由 ∠ACE=∠E=θ，两角对应相等。','故 △ACE∽△BED（AA），对应边成比例 AC/BE=CE/ED=AE/BD。'],
    formula:'△ACE ∽ △BED　→　AC/BE = CE/ED = AE/BD',
    tips:['拖动 D、E 改变构型','调节等角 θ 的大小','观察对应边比值恒相等'],
    legend:[{c:C.blue,t:'△ACE'},{c:C.orange,t:'△BED'},{c:C.slate,t:'共线 A-C-B'}],
    hint:'外角定理导角 → AA 相似',interaction:'拖动点，观察同侧一线三等角下两三角形相似比恒定。',
    yUp:true,
    controls:[{type:'range',key:'theta',label:'等角 θ °',min:35,max:75,step:1,digits:0}],
    init:function(b,s){s.theta=55;},
    draw:function(b,s){
      var th=s.theta*D2R;
      var A=P(-200,0),C1=P(-20,0),B2=P(210,0);
      // ∠ACE=θ：CE 从 C 出发与 CA（向左）成 θ，向上
      var dirCE={x:-Math.cos(th),y:Math.sin(th)};
      var E={x:C1.x+dirCE.x*150,y:C1.y+dirCE.y*150};
      // ∠BED=θ：ED 从 E 出发，使 △BED 的角 E=θ；D 使得 ∠BDE=θ
      // 构造：△ACE 已知，△BED 与之相似，E 对应 C，D 对应 A，B 对应 E
      // 用相似比 k=BE/AC 确定 D
      var AC=dist(A,C1),BE=dist(B2,E),k=BE/AC;
      // D = E + k*rot(A−C1)  （△BED∽△ACE，E↔C，B↔A，D↔E）
      var vecAE=sub(A,C1); // C→A
      var Dp={x:E.x+k*(E.x-C1.x)*0+ k*(C1.x-A.x)*0}; // placeholder
      // 更稳妥：直接按角构造 D = B2 + 沿某方向
      // ∠BED=θ：ED 与 EB 成 θ。EB 方向
      var uEB=unit(sub(B2,E));
      var aEB=Math.atan2(uEB.y,uEB.x);
      var dirED={x:Math.cos(aEB+th),y:Math.sin(aEB+th)};
      var EDlen=BE*k/(AC/AC); // 用相似：ED/BE=CE/AC → ED=BE*CE/AC
      EDlen=BE*dist(C1,E)/AC;
      var Dd={x:E.x+dirED.x*EDlen,y:E.y+dirED.y*EDlen};
      b.line(A,B2,C.slate,2);
      b.poly([A,C1,E],C.blue,.14,C.blue,2.4);
      b.poly([B2,E,Dd],C.orange,.14,C.orange,2.4);
      [[A,'A',C.slate],[C1,'C',C.slate],[B2,'B',C.slate],[E,'E',C.blue],[Dd,'D',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(E,'E',18);
      var r1=AC/BE,r2=dist(C1,E)/EDlen,r3=dist(A,E)/dist(B2,Dd);
      b.readout('AC/BE='+r1.toFixed(3)+'　CE/ED='+r2.toFixed(3)+'　AE/BD='+r3.toFixed(3)+'　（三者相等 → 相似）');
    },
    onDrag:function(b,n,w){if(n==='E')b.state_E=w;}
  };
  R(threeEqSame);

  /* ---------- 3. 一线三等角 · 异侧型 ---------- */
  var threeEqOpp={
    id:'sim-three-eq-opp',domain:'geometry',topic:'similarity',level:2,
    title:'一线三等角 · 异侧型',brief:'三个等角分布在直线两侧，等角的补角相等，仍得两三角形相似：△ADE∽△BEC。',
    keys:'一线三等角 异侧 相似 AA 补角',
    idea:'点 A、E、B 共线，∠D=∠C=∠DEC=θ，但等角在直线两侧。由"等角的补角相等"得 ∠DEA=∠CBE，配合 ∠D=∠C，得 △ADE∽△BEC。',
    proof:['∠1=∠2（等角），故它们的补角相等：∠CBE=∠EAD。','由外角定理 ∠2=∠C+∠CEB，∠3=∠DEA+∠CEB，且 ∠2=∠3，得 ∠C=∠DEA。','两角对应相等，△ADE∽△BEC（AA）。','对应边成比例 AD/BE=DE/EC=AE/BC。'],
    formula:'△ADE ∽ △BEC　→　AD/BE = DE/EC',
    tips:['对比同侧型与异侧型的图形差异','拖动点观察相似关系','注意用补角而非余角导角'],
    legend:[{c:C.blue,t:'△ADE'},{c:C.orange,t:'△BEC'},{c:C.slate,t:'共线 A-E-B'}],
    hint:'等角的补角相等 → AA',interaction:'拖动点，观察异侧型下两三角形相似比恒定。',
    yUp:true,
    controls:[{type:'range',key:'theta',label:'等角 θ °',min:35,max:75,step:1,digits:0}],
    init:function(b,s){s.t=0.5;},
    controls:[{type:'range',key:'t',label:'E 点位置',min:0.3,max:0.7,step:0.01,digits:2}],
    draw:function(b,s){
      var A=P(-190,-70),B2=P(190,-70);
      var E={x:A.x+s.t*(B2.x-A.x),y:A.y};
      // D 在上方，取 ED 方向固定（如 110°），长度固定
      var edLen=130,edAng=110*D2R;
      var Dd={x:E.x+edLen*Math.cos(edAng),y:E.y+edLen*Math.sin(edAng)};
      // 异侧相似：∠AED 与 ∠BEC 对顶相等；取 C = E − (BE/AE)·(D−E)
      // 使 ED/EC = AE/BE，配合对顶角 → △AED∽△BEC（SAS）
      var k=dist(B2,E)/dist(A,E);
      var Cc={x:E.x-k*(Dd.x-E.x),y:E.y-k*(Dd.y-E.y)};
      b.line(A,B2,C.slate,2);
      b.poly([A,Dd,E],C.blue,.14,C.blue,2.4);
      b.poly([B2,Cc,E],C.orange,.14,C.orange,2.4);
      [[A,'A',C.slate],[E,'E',C.slate],[B2,'B',C.slate],[Dd,'D',C.blue],[Cc,'C',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      var r1=dist(A,Dd)/dist(B2,Cc),r2=dist(Dd,E)/dist(E,Cc),r3=dist(A,E)/dist(B2,E);
      b.readout('AD/BC='+r1.toFixed(3)+'　DE/CE='+r2.toFixed(3)+'　AE/BE='+r3.toFixed(3)+'　（相等 → △ADE∽△BEC）');
    }
  };
  R(threeEqOpp);

  /* ---------- 4. A 字型 / 反 A 字型 ---------- */
  var aType={
    id:'sim-a-type',domain:'geometry',topic:'similarity',level:1,
    title:'A 字型 / 反 A 字型相似',brief:'平行线截三角形得 A 字型相似；交换角的位置得反 A 字型（共角共边）。',
    keys:'A字型 反A字型 相似 平行线 共角',
    idea:'正 A 字：DE∥BC，则 △ADE∽△ABC（对应角相等）。反 A 字：∠AED=∠B（无平行），仍有公共角 ∠A，由两角相等得 △ADE∽△ACB，常导出 AB²=AC·AD。',
    proof:['正 A 字：DE∥BC ⟹ ∠ADE=∠B、∠AED=∠C，加公共角 ∠A，△ADE∽△ABC。','反 A 字：∠A 公共，∠AED=∠B，故 △ADE∽△ACB（注意顶点对应交换）。','反 A 字常用结论：AD/AC=AE/AB，即 AB·AD=AC·AE；特殊地 AB²=AC·AD。','识别要点：正 A 看平行，反 A 看"共角 + 另一组等角"。'],
    formula:'正A：△ADE∽△ABC　　反A：△ADE∽△ACB',
    tips:['切换正 A / 反 A 模式','拖动 D、E 改变截线位置','观察相似对应关系如何变化'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'小三角形'},],
    hint:'平行 → 正A；共角等角 → 反A',interaction:'切换正A/反A，拖动截线点观察相似与比例关系。',
    yUp:true,
    controls:[
      {type:'buttons',key:'mode',items:[{label:'正A字',onclick:function(b,s){s.mode='a';}},{label:'反A字',onclick:function(b,s){s.mode='ra';}}]},
      {type:'range',key:'t',label:'截线高度',min:0.3,max:0.8,step:0.01,digits:2}
    ],
    init:function(b,s){s.mode='a';s.t=0.55;},
    draw:function(b,s){
      var A=P(0,200),B=P(-170,-110),C1=P(180,-110);
      var t=s.t;
      var D=lerp2(A,B,t),E=lerp2(A,C1,t);
      if(s.mode==='ra'){ // 反A：E 落到 AC 上不同比例，使 ∠AED=∠B
        // 令 AD/AC = AE/AB 的对应交换：AE' = AB*(AD/AC)
        var AD=dist(A,D),AC=dist(A,C1),AB=dist(A,B);
        var ae=AB*AD/AC/AB*dist(A,C1); // AE = AD/AC * ... 用 AE/AB=AD/AC → AE=AB*AD/AC
        ae=AB*AD/AC;
        var u=ae/dist(A,C1);
        E={x:A.x+u*(C1.x-A.x),y:A.y+u*(C1.y-A.y)};
      }
      b.poly([A,B,C1],C.blue,.06,C.blue,2.4);
      b.poly([A,D,E],C.orange,.16,C.orange,2.4);
      if(s.mode==='a'){
        b.line(D,E,C.orange,2.2);
        b.text(P(0,-200),'DE ∥ BC　→　△ADE ∽ △ABC',C.purple,13,'middle',700);
      }else{
        b.text(P(0,-200),'∠A 公共，∠AED=∠B　→　△ADE ∽ △ACB',C.purple,13,'middle',700);
      }
      [[A,'A',C.blue],[B,'B',C.blue],[C1,'C',C.blue],[D,'D',C.orange],[E,'E',C.orange]].forEach(function(pt){
        b.circle(pt[0],4.5,pt[2],pt[2],1.8);b.text({x:pt[0].x,y:pt[0].y-13},pt[1],pt[2],12,'middle',700);});
      b.handle(D,'D',18);b.handle(E,'E',18);
      var r1=dist(A,D)/dist(A,B),r2=dist(A,E)/dist(A,C1);
      b.readout(s.mode==='a'?('AD/AB='+r1.toFixed(3)+'　AE/AC='+r2.toFixed(3)+'　(相等→正A相似)'):('反A字：AD/AC 与 AE/AB 对应，注意顶点交换'));
    },
    onDrag:function(b,n,w){var q=L(w);var A=P(0,200),B=P(-170,-110),C1=P(180,-110);
      if(n==='D'){var t=(q.y-A.y)/(B.y-A.y);b.state.t=Math.max(.3,Math.min(.8,t));}
      H.refreshControls(b.state);}
  };
  R(aType);

  /* ---------- 5. X 字型（8 字相似） ---------- */
  var xType={
    id:'sim-x-type',domain:'geometry',topic:'similarity',level:1,
    title:'X 字型 · 8 字相似',brief:'两条线段相交，对顶角相等；若另有平行线或一组等角，得"8 字"相似。',
    keys:'X字型 8字 相似 对顶角 平行',
    idea:'AD 与 BC 交于 O，∠AOB=∠COD（对顶角）。当 A、O、C 与 B、O、D 分别共线（即 AB∥CD 的位似构型）时，△AOB∽△DOC，对应边成比例 OA/OD=OB/OC=AB/CD。',
    proof:['∠AOB=∠DOC（对顶角）。','A、O、C 共线且 B、O、D 共线（位似中心 O），故 ∠A=∠D、∠B=∠C。','故 △AOB∽△DOC（AA）。','对应边 OA/OD=OB/OC=AB/CD；对顶 + 共线（平行）是 8 字相似的识别信号。'],
    formula:'△AOB ∽ △DOC　→　OA/OD = OB/OC = AB/CD',
    tips:['拖动 A、B 改变构型','切换是否位似对比','调节缩放比 k 观察相似比'],
    legend:[{c:C.blue,t:'△AOB'},{c:C.orange,t:'△DOC'}],
    hint:'对顶角 + 共线 → 8 字相似',interaction:'拖动 A、B，调节 k，观察 8 字相似与对应边比例。',
    yUp:true,
    controls:[
      {type:'buttons',key:'par',items:[{label:'位似(相似)',onclick:function(b,s){s.par=true;}},{label:'非位似',onclick:function(b,s){s.par=false;}}]},
      {type:'range',key:'k',label:'缩放比 k',min:0.4,max:1.2,step:0.01,digits:2}
    ],
    init:function(b,s){s.par=true;s.k=0.7;s.A=P(-160,130);s.B=P(-140,-110);},
    draw:function(b,s){
      var O0=O(),A=s.A,B2=s.B;
      // C、D 在 O 另一侧，与 A、B 共线（对顶），比例 k
      var C1=s.par?{x:O0.x-s.k*(A.x-O0.x),y:O0.y-s.k*(A.y-O0.y)}:P(160,-110);
      var Dd=s.par?{x:O0.x-s.k*(B2.x-O0.x),y:O0.y-s.k*(B2.y-O0.y)}:P(150,130);
      b.poly([A,O0,B2],C.blue,.12,C.blue,2.4);
      b.poly([Dd,O0,C1],C.orange,.12,C.orange,2.4);
      b.line(A,B2,C.blue,2);b.line(Dd,C1,C.orange,2);
      [[A,'A',C.blue],[B2,'B',C.blue],[C1,'C',C.orange],[Dd,'D',C.orange],[O0,'O',C.slate]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(A,'A',18);b.handle(B2,'B',18);
      var r1=dist(A,O0)/dist(C1,O0),r2=dist(B2,O0)/dist(Dd,O0),r3=dist(A,B2)/dist(Dd,C1);
      b.readout((s.par?'位似(相似)：':'非位似：')+'OA/OC='+r1.toFixed(3)+'　OB/OD='+r2.toFixed(3)+'　AB/CD='+r3.toFixed(3)+(s.par?'　(相等→△AOB∽△COD)':''));
    },
    onDrag:function(b,n,w){if(n==='A')b.state.A=w;else b.state.B=w;}
  };
  R(xType);

  /* ---------- 6. 母子型（射影定理） ---------- */
  var motherChild={
    id:'sim-projection',domain:'geometry',topic:'similarity',level:2,
    title:'母子型相似 · 射影定理',brief:'直角三角形斜边上的高，把原三角形分成两个与原三角形相似的小三角形——三对相似。',
    keys:'母子型 射影定理 直角三角形 斜边高 三对相似',
    idea:'Rt△ABC 中 ∠C=90°，CD⊥AB 于 D。则 △ACD∽△ABC∽△CBD（三对相似）。由相似得 AC²=AD·AB、BC²=BD·AB、CD²=AD·BD——射影定理。',
    proof:['CD⊥AB，∠ACB=90°，故 ∠ADC=∠ACB=90°，且 ∠A 公共，△ACD∽△ABC。','同理 △CBD∽△ABC，故 △ACD∽△CBD。','由 △ACD∽△ABC：AC/AB=AD/AC ⟹ AC²=AD·AB。','由 △CBD∽△ABC：BC/AB=BD/BC ⟹ BC²=BD·AB；由两小三角形相似 ⟹ CD²=AD·BD。'],
    formula:'AC²=AD·AB　BC²=BD·AB　CD²=AD·BD',
    tips:['拖动 C 改变直角三角形形状','观察高 CD 分出的两个小三角形','读数验证三个平方关系'],
    legend:[{c:C.blue,t:'Rt△ABC'},{c:C.orange,t:'高 CD'},{c:C.green,t:'两小三角形'}],
    hint:'斜边高 → 三对相似 → 射影定理',interaction:'拖动 C，观察三个平方关系恒成立。',
    yUp:true,
    controls:[{type:'range',key:'theta',label:'C 在半圆上角度 °',min:15,max:165,step:1,digits:0}],
    init:function(b,s){s.theta=60;},
    draw:function(b,s){
      var A=P(-190,-90),B2=P(190,-90),Oc=P(0,-90),R=190,th=s.theta*D2R;
      // C 在以 AB 为直径的圆上 ⟹ ∠ACB=90°（直径所对圆周角）
      var C1={x:Oc.x+R*Math.cos(th),y:Oc.y+R*Math.sin(th)};
      // D = C 到 AB 的垂足（AB 水平，y=Oc.y）
      var D={x:C1.x,y:Oc.y};
      b.poly([A,B2,C1],C.blue,.05,C.blue,2.4);
      b.line(C1,D,C.orange,2.8);
      b.poly([A,C1,D],C.green,.12,null,0);
      b.poly([C1,B2,D],C.green,.12,null,0);
      b.rightAngle(D,sub(C1,D),sub(A,D),11,C.orange);
      b.rightAngle(C1,sub(A,C1),sub(B2,C1),11,C.blue);
      [[A,'A',C.blue],[B2,'B',C.blue],[C1,'C',C.blue],[D,'D',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      b.handle(C1,'C',18);
      var AD=dist(A,D),BD=dist(B2,D),AB=dist(A,B2),AC=dist(A,C1),BC=dist(B2,C1),CD=dist(C1,D);
      b.readout('AC²='+(AC*AC).toFixed(0)+' vs AD·AB='+(AD*AB).toFixed(0)+'　CD²='+(CD*CD).toFixed(0)+' vs AD·BD='+(AD*BD).toFixed(0));
    },
    onDrag:function(b,n,w){if(n==='C'){var q=L(w);var th=Math.atan2(q.y-300+90,q.x-450)*R2D;b.state.theta=Math.max(15,Math.min(165,th));H.refreshControls(b.state);}}
  };
  R(motherChild);

  /* ---------- 7. 旋转相似 ---------- */
  var rotationSim={
    id:'sim-rotation',domain:'geometry',topic:'similarity',level:3,
    title:'旋转相似模型',brief:'两个三角形共顶点、对应边成比例且顶角相等：绕顶点旋转后"压"出一组相似。',
    keys:'旋转相似 共顶点 手拉手 相似比',
    idea:'两个相似三角形共顶点 O：OA:OB = OC:OD（腰成相同比例），且 ∠AOC=∠BOD（同转一个角）。则"交叉连接"的 △AOC∽△BOD，连接线段 AC:BD = OA:OB。这是手拉手从"等腰(SAS全等)"推广到"成比例(SAS相似)"的一般形式。',
    proof:['已知 OA:OB = OC:OD，即 OA/OC = OB/OD。','∠AOC = ∠BOD（两个三角形同绕 O 转过同一个角 β）。','两边成比例且夹角相等（SAS 相似），△AOC∽△BOD。','故 AC/BD = OA/OB = OC/OD；当 OA=OB 时退化为手拉手全等(AC=BD)。'],
    formula:'OA:OB=OC:OD 且 ∠AOC=∠BOD ⟹ △AOC∽△BOD，AC:BD=OA:OB',
    tips:['调节放大系数 k 改变外侧三角形大小','观察 OA:OB、OC:OD、AC:BD 三者恒等','体会"手拉手"从全等推广到相似'],
    legend:[{c:C.blue,t:'△OAB'},{c:C.orange,t:'△OCD'},{c:C.green,t:'连接线段 AC、BD'}],
    hint:'SAS 相似：两边成比例夹角相等',interaction:'调节 k，观察 OA:OB=OC:OD=AC:BD 恒成立。',
    yUp:true,
    controls:[{type:'range',key:'k',label:'放大系数 k',min:0.5,max:2,step:0.01,digits:2}],
    init:function(b,s){s.k=1.5;},
    draw:function(b,s){
      var O0=O(),alpha=50*D2R,beta=28*D2R;
      // △OAB：OA:OB = 2:3；A 在基准方向，B 转 alpha
      var rA=110,rB=165;
      var A={x:O0.x+rA,y:O0.y},B2={x:O0.x+rB*Math.cos(alpha),y:O0.y+rB*Math.sin(alpha)};
      // △OCD 与 △OAB 同比例放大 s.k，且整体再转 beta：OC=k·rA，OD=k·rB
      var C1={x:O0.x+s.k*rA*Math.cos(beta),y:O0.y+s.k*rA*Math.sin(beta)};
      var Dd={x:O0.x+s.k*rB*Math.cos(beta+alpha),y:O0.y+s.k*rB*Math.sin(beta+alpha)};
      b.poly([O0,A,B2],C.blue,.10,C.blue,2.4);
      b.poly([O0,C1,Dd],C.orange,.10,C.orange,2.4);
      b.line(A,C1,C.green,2.6);b.line(B2,Dd,C.green,2.6);
      b.circle(O0,5,C.slate,C.slate,2);b.text({x:O0.x-14,y:O0.y-14},'O',C.slate,13,'middle',700);
      [[A,'A',C.blue],[B2,'B',C.blue],[C1,'C',C.orange],[Dd,'D',C.orange]].forEach(function(t){
        b.circle(t[0],4.5,t[2],t[2],1.8);b.text({x:t[0].x,y:t[0].y-13},t[1],t[2],12,'middle',700);});
      var r=dist(A,C1)/dist(B2,Dd),wa=rA/rB;
      b.readout('OA/OB='+wa.toFixed(3)+'　OC/OD='+(dist(O0,C1)/dist(O0,Dd)).toFixed(3)+'　AC/BD='+r.toFixed(3)+'　（三者相等 → △AOC∽△BOD）');
    }
  };
  R(rotationSim);

  /* ---------- 8. 燕尾模型 ---------- */
  var swallowtail={
    id:'sim-swallowtail',domain:'geometry',topic:'similarity',level:2,
    title:'燕尾模型',brief:'三角形内一点连三个顶点，分成三个小三角形；面积比等于对应底边被分的线段比。',
    keys:'燕尾 面积比 线段比 共高',
    idea:'P 在 △ABC 内，AP 延长交 BC 于 D。由共高三角形面积比等于底边比：S△ABP:S△ACP = BD:DC。推广得燕尾定理——内部一点连顶点所成的面积比，等于对边被分割的线段比。',
    proof:['△ABP 与 △ACP 共顶点 A、底边在同一直线 BD/DC 上（经 P 的线），高相同。','故 S△ABP/S△ACP = BD/DC（共高三角形面积比 = 底边比）。','同理对另两边也有对应面积比 = 线段比。','这是面积法解几何的常用工具，与相似、比例线段紧密相关。'],
    formula:'S△ABP / S△ACP = BD / DC',
    tips:['拖动 P 改变分割位置','拖动 A 改变三角形','观察面积比与线段比始终相等'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'分割线 AP'},{c:C.green,t:'面积区域'}],
    hint:'共高 → 面积比 = 底边比',interaction:'拖动 P，观察面积比 BD:DC 与 S△ABP:S△ACP 恒等。',
    yUp:true,
    controls:[],
    init:function(b,s){s.A=P(0,200);s.B=P(-180,-100);s.C=P(180,-100);s.P=P(20,20);},
    draw:function(b,s){
      var A=s.A,B2=s.B,C1=s.C,Pp=s.P;
      // AP 延长交 BC 于 D：D = A + s·(P−A)，使 D.y = B.y
      var s=(B2.y-A.y)/(Pp.y-A.y),D={x:A.x+s*(Pp.x-A.x),y:B2.y};
      b.poly([A,B2,C1],C.blue,.05,C.blue,2.4);
      b.poly([A,B2,Pp],C.green,.14,null,0);
      b.poly([A,C1,Pp],C.orange,.14,null,0);
      b.line(A,D,C.slate,2,'6 4');
      b.line(Pp,B2,C.slate,1.6);b.line(Pp,C1,C.slate,1.6);
      [[A,'A',C.blue],[B2,'B',C.blue],[C1,'C',C.blue],[Pp,'P',C.purple],[D,'D',C.slate]].forEach(function(pt){
        b.circle(pt[0],4.5,pt[2],pt[2],1.8);b.text({x:pt[0].x,y:pt[0].y-13},pt[1],pt[2],12,'middle',700);});
      b.handle(Pp,'P',18);b.handle(A,'A',18);
      function area(X,Y,Z){return Math.abs((Y.x-X.x)*(Z.y-X.y)-(Y.y-X.y)*(Z.x-X.x))/2;}
      var areaABP=area(A,B2,Pp),areaACP=area(A,C1,Pp),BD=dist(B2,D),DC=dist(D,C1);
      b.readout('BD/DC='+(BD/DC).toFixed(3)+'　S△ABP/S△ACP='+(areaABP/areaACP).toFixed(3)+'　（相等 → 燕尾定理）');
    },
    onDrag:function(b,n,w){if(n==='P')b.state.P=w;else b.state.A=w;}
  };
  R(swallowtail);

})();
