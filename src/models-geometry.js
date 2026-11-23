/* ============ 图形与几何：互动模型（新增，几何最值专题见 models-extremum.js） ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,unit=V.unit,mid=V.mid,angDiff=V.angDiff;

  /* ---------- 旋转变换 ---------- */
  var rotation={
    id:'rotation-transform',domain:'geometry',topic:'transform',level:1,
    title:'旋转变换',brief:'绕定点 O 旋转角 θ：对应点到 O 距离相等，任意两对应线段的夹角都等于旋转角。',
    keys:'旋转 变换 中心 旋转角 对应点 全等',
    idea:'旋转保持形状与大小不变（全等变换）：OA=OA′，∠AOA′=θ；图形上每一点都绕 O 转过相同的角 θ。',
    proof:['旋转中心 O 到对应点距离相等：OA=OA′。','对应点与中心连线的夹角等于旋转角：∠AOA′=θ。','旋转是全等变换，图形形状大小不变，只改变位置与方向。'],
    formula:'OA′ = OA，∠AOA′ = θ　（绕 O 旋转 θ）',
    tips:['拖动 θ 滑块，观察三角形绕 O 旋转','改变旋转中心 O 的位置','切换顺/逆时针'],
    legend:[{c:C.blue,t:'原图形'},{c:C.orange,t:'旋转后图形'},{c:C.purple,t:'旋转中心 O'}],
    hint:'旋转 = 绕定点转过定角，形状大小不变',
    interaction:'拖动 θ 滑块观察旋转，可拖动 O 和各顶点。',
    controls:[
      {type:'range',key:'theta',label:'旋转角 θ (°)',min:-180,max:180,step:1,digits:0},
      {type:'range',key:'ox',label:'中心 O 横坐标',min:2,max:8,step:0.1,digits:1},
      {type:'range',key:'oy',label:'中心 O 纵坐标',min:1,max:5,step:0.1,digits:1}
    ],
    init:function(b,s){s.theta=60;s.ox=5;s.oy=3;
      s.tri=[{x:2.2,y:1.5},{x:4,y:1.2},{x:3,y:2.8}];},
    sc:function(p){return{x:100+p.x*72,y:520-p.y*72};},
    rot:function(s,p){var r=s.theta*Math.PI/180,c=Math.cos(r),si=Math.sin(r);
      var dx=p.x-s.ox,dy=p.y-s.oy;
      return{x:s.ox+c*dx-si*dy,y:s.oy+si*dx+c*dy};},
    draw:function(b,s){
      var g=b.scene,m=b.model,sc=m.sc,O={x:s.ox,y:s.oy};
      // 网格坐标轴
      b.line(m.sc({x:0,y:0}),m.sc({x:11,y:0}),'#cbd5e1',1.4);
      b.line(m.sc({x:0,y:0}),m.sc({x:0,y:6.5}),'#cbd5e1',1.4);
      var orig=s.tri,img=orig.map(function(p){return m.rot(s,p);});
      b.poly(orig.map(sc),C.blue,.14,C.blue,2.6);
      b.poly(img.map(sc),C.orange,.14,C.orange,2.6);
      // 对应点与中心的连线
      orig.forEach(function(p,i){
        b.line(sc(O),sc(p),'#cbd5e1',1.3,'3 4');
        b.line(sc(O),sc(img[i]),'#fed7aa',1.3,'3 4');
      });
      // 旋转角弧
      var p0=orig[0],ang0=Math.atan2(p0.y-O.y,p0.x-O.x),r=s.theta*Math.PI/180;
      b.arc(sc(O),40,-ang0,-ang0-r,C.purple,2);
      [['A',0],['B',1],['C',2]].forEach(function(t){
        var i=t[1];b.circle(sc(orig[i]),5,C.blue,'#fff',2);
        b.text({x:sc(orig[i]).x-9,y:sc(orig[i]).y-6},t[0],C.blue,12,'end',700);
        b.circle(sc(img[i]),5,C.orange,'#fff',2);
        b.text({x:sc(img[i]).x+9,y:sc(img[i]).y-6},t[0]+'′',C.orange,12,'start',700);
      });
      b.circle(sc(O),8,C.purple,'#fff',2.5);
      b.text({x:sc(O).x,y:sc(O).y-16},'O',C.purple,14,'middle',800);
      b.handle(sc(O),'O',16);
      var d0=dist(O,orig[0]),d1=dist(O,img[0]);
      b.readout('OA = '+d0.toFixed(2)+'　OA′ = '+d1.toFixed(2)+'　∠AOA′ = '+Math.abs(s.theta)+'°');
    },
    onDrag:function(b,n,w){
      var s=b.state;
      if(n==='O'){s.ox=Math.max(0,Math.min(11,(w.x-100)/72));s.oy=Math.max(0,Math.min(6.5,(520-w.y)/72));H.refreshControls(s);}
    }
  };
  R(rotation);

  /* ---------- 勾股定理动态证明（赵爽弦图） ---------- */
  var pythagoras={
    id:'pythagoras',domain:'geometry',topic:'triangle',level:1,
    title:'勾股定理 · 赵爽弦图',brief:'四个全等直角三角形围成大正方形，中央小正方形面积恰好是 (b−a)²，由此证明 a²+b²=c²。',
    keys:'勾股定理 赵爽弦图 面积 证明',
    idea:'大正方形面积 = 4×(½ab) + (b−a)² = 2ab + b²−2ab+a² = a²+b²；另一方面大正方形边长是 c，面积是 c²。故 a²+b²=c²。',
    proof:['大正方形由四个全等直角三角形（直角边 a、b，斜边 c）和一个中央小正方形组成。','中央小正方形边长 = b−a，面积 = (b−a)²。','大正方形面积 = 4×(½ab) + (b−a)² = 2ab + a²−2ab+b² = a²+b²。','而大正方形边长正好是斜边 c，面积 = c²，所以 a²+b²=c²。'],
    formula:'c² = 4×(½ab) + (b−a)² = a² + b²',
    tips:['拖动 a、b 改变直角三角形边长','观察四个三角形与中央小正方形如何拼成大正方形','对照读数验证 a²+b²=c²'],
    legend:[{c:C.blue,t:'直角三角形'},{c:C.orange,t:'中央小正方形 (b−a)²'}],
    hint:'面积守恒证明勾股定理',
    interaction:'拖动 a、b 滑块，观察弦图与面积关系。',
    controls:[
      {type:'range',key:'a',label:'直角边 a',min:1,max:4,step:0.1,digits:1},
      {type:'range',key:'b',label:'直角边 b',min:1,max:4,step:0.1,digits:1}
    ],
    init:function(b,s){s.a=3;s.b=4;},
    draw:function(b,s){
      // 标准赵爽弦图：大正方形边长 c（斜边），内放四个直角边为 a、b 的全等三角形，
      // 它们在中央围出边长 |b−a| 的小正方形。面积关系：c² = 4·(ab/2) + (b−a)² = a²+b²。
      var a=s.a*70,bb=s.b*70,c=Math.hypot(s.a,s.b)*70;
      var cx=450,cy=300,left=cx-c/2,top=cy-c/2;
      var TL={x:left,y:top},TR={x:left+c,y:top},BR={x:left+c,y:top+c},BL={x:left,y:top+c};
      b.poly([TL,TR,BR,BL],'#faf5ff',.5,C.purple,2.5);
      // 各三角形直角顶点：斜边端点投影比例 b²/c、高 ab/c（保证两直角边为 a、b）
      var a2=a*a,b2=bb*bb,ab=a*bb;
      var Pt={x:left+b2/c,y:top+ab/c};
      var Pr={x:left+c-ab/c,y:top+b2/c};
      var Pb={x:left+c-b2/c,y:top+c-ab/c};
      var Pl={x:left+ab/c,y:top+c-b2/c};
      b.poly([TL,TR,Pt],C.blue,.28,C.blue,1.8);
      b.poly([TR,BR,Pr],C.blue,.28,C.blue,1.8);
      b.poly([BR,BL,Pb],C.blue,.28,C.blue,1.8);
      b.poly([BL,TL,Pl],C.blue,.28,C.blue,1.8);
      // 中央小正方形边长 = |b−a|
      b.poly([Pt,Pr,Pb,Pl],C.orange,.42,C.orange,2);
      b.text({x:cx,y:cy+5},'(b−a)²','#c2410c',13,'middle',800);
      // 给上边三角形的两条直角边标注 a、b，斜边 c
      b.text({x:(TL.x+Pt.x)/2-4,y:(TL.y+Pt.y)/2},'b',C.blue,12,'middle',700);
      b.text({x:(TR.x+Pt.x)/2+4,y:(TR.y+Pt.y)/2},'a',C.blue,12,'middle',700);
      b.text({x:cx,y:top-10},'斜边 c',C.purple,12,'middle',700);
      // 读数与图形一致：大正方形面积 = 四个三角形 + 中央小正方形
      var c2=s.a*s.a+s.b*s.b;
      b.readout('大正方形 c² = '+c2.toFixed(2)+' = 4×(½ab) + (b−a)² = '+
        (2*s.a*s.b).toFixed(2)+' + '+Math.pow(s.b-s.a,2).toFixed(2)+
        '　⇒　a² + b² = c² = '+c2.toFixed(2)+'　c = '+Math.sqrt(c2).toFixed(2));
    }
  };
  R(pythagoras);

  /* ---------- 全等三角形判定 ---------- */
  var congruent={
    id:'congruent-triangles',domain:'geometry',topic:'triangle',level:1,
    title:'全等三角形 · 判定条件',brief:'SSS、SAS、ASA、AAS、HL——满足哪些条件就能判定两个三角形全等。',
    keys:'全等三角形 SSS SAS ASA AAS HL 判定',
    idea:'两个三角形只要满足 SSS、SAS、ASA、AAS（直角用 HL）中的一组条件，就能判定全等——形状和大小完全相同。',
    proof:['SSS：三边对应相等，三角形唯一确定。','SAS：两边及夹角对应相等，第三边被夹角唯一确定。','ASA / AAS：两角及一边对应相等，第三角由内角和确定，三角形唯一。','HL：直角三角形中斜边和一条直角边对应相等即可判定全等。'],
    formula:'判定：SSS / SAS / ASA / AAS / HL（直角三角形）',
    tips:['切换不同判定方法，观察给定的已知条件','注意"SSA"和"AAA"不能判定全等','拖动顶点验证给定条件下三角形是否唯一'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'△A′B′C′'},{c:C.green,t:'已知相等的元素'}],
    hint:'三边、两边夹角、两角一边可判定全等',
    interaction:'切换判定方法查看给定的已知条件。',
    controls:[
      {type:'buttons',key:'method',items:[
        {label:'SSS',onclick:function(b,s){s.method='SSS';}},
        {label:'SAS',onclick:function(b,s){s.method='SAS';}},
        {label:'ASA',onclick:function(b,s){s.method='ASA';}},
        {label:'AAS',onclick:function(b,s){s.method='AAS';}},
        {label:'HL',onclick:function(b,s){s.method='HL';}}
      ]}
    ],
    init:function(b,s){s.method='SSS';},
    draw:function(b,s){
      var g=b.scene;
      // HL 分支要求 B 处为直角：令 A 与 B 同 x（BA 竖直）、BC 水平
      var hl=(s.method==='HL');
      var T1=hl?[{x:120,y:420},{x:120,y:220},{x:360,y:220}]:[{x:180,y:420},{x:120,y:220},{x:360,y:220}]; // A B C
      var T2=hl?[{x:500,y:420},{x:500,y:220},{x:740,y:220}]:[{x:560,y:420},{x:500,y:220},{x:740,y:220}];
      function sc(p){return p;}
      var method=s.method;
      b.poly(T1,C.blue,.12,C.blue,2.6);b.poly(T2,C.orange,.12,C.orange,2.6);
      ['A','B','C'].forEach(function(n,i){b.circle(T1[i],5,C.blue,'#fff',2);
        b.text({x:T1[i].x-10,y:T1[i].y-8},n,C.blue,12,'end',700);});
      ['A′','B′','C′'].forEach(function(n,i){b.circle(T2[i],5,C.orange,'#fff',2);
        b.text({x:T2[i].x+10,y:T2[i].y-8},n,C.orange,12,'start',700);});
      // 标记已知相等元素
      function tick(p,q,color,n){var m=mid(p,q),d=unit(sub(q,p)),perp={x:-d.y,y:d.x};
        n=n||1;var gap=5,span=(n-1)*gap/2;
        for(var i=0;i<n;i++){var off=(i*gap-span);var c=add(m,mul(perp,off));
          b.line(add(c,mul(perp,-4.5)),add(c,mul(perp,4.5)),color||C.green,2.2);}}
      function angleMark(v,p,q,color){
        var a1=Math.atan2(p.y-v.y,p.x-v.x),a2=Math.atan2(q.y-v.y,q.x-v.x);
        b.arc(v,22,a1,a2,color||C.green,2);
      }
      var info='';
      if(method==='SSS'){
        // 三组对应边各打不同道数的刻痕（1/2/3 道），两个三角形对应边记号一致
        var pairs=[[0,1],[1,2],[0,2]];
        pairs.forEach(function(pr,i){
          tick(T1[pr[0]],T1[pr[1]],C.green,i+1);
          tick(T2[pr[0]],T2[pr[1]],C.green,i+1);
        });
        info='SSS：三组对应边分别相等（对应边刻痕 1/2/3 道一致）';
      }else if(method==='SAS'){
        tick(T1[0],T1[1]);tick(T2[0],T2[1]);
        tick(T1[0],T1[2]);tick(T2[0],T2[2]);
        angleMark(T1[0],T1[1],T1[2]);angleMark(T2[0],T2[1],T2[2]);
        info='SAS：两边及它们的夹角相等';
      }else if(method==='ASA'){
        angleMark(T1[1],T1[0],T1[2]);angleMark(T2[1],T2[0],T2[2]);
        angleMark(T1[2],T1[0],T1[1]);angleMark(T2[2],T2[0],T2[1]);
        tick(T1[1],T1[2]);tick(T2[1],T2[2]);
        info='ASA：两角及它们的夹边相等';
      }else if(method==='AAS'){
        angleMark(T1[0],T1[1],T1[2]);angleMark(T2[0],T2[1],T2[2]);
        angleMark(T1[1],T1[0],T1[2]);angleMark(T2[1],T2[0],T2[2]);
        tick(T1[1],T1[2]);tick(T2[1],T2[2]);
        info='AAS：两角及其中一角的对边相等';
      }else if(method==='HL'){
        // 画直角标记
        b.rightAngle(T1[1],sub(T1[0],T1[1]),sub(T1[2],T1[1]),12,C.green);
        b.rightAngle(T2[1],sub(T2[0],T2[1]),sub(T2[2],T2[1]),12,C.green);
        tick(T1[0],T1[2]);tick(T2[0],T2[2]); // 斜边
        tick(T1[0],T1[1]);tick(T2[0],T2[1]); // 直角边
        info='HL：直角三角形中斜边与一条直角边相等';
      }
      b.text({x:450,y:520},'判定方法：'+method+'　—　'+info,C.purple,14,'middle',700);
      b.readout(method+' 判定：'+info+'　⇒ △ABC ≌ △A′B′C′');
    }
  };
  R(congruent);

  /* ---------- 圆周角定理 ---------- */
  var inscribedAngle={
    id:'inscribed-angle',domain:'geometry',topic:'circle',level:2,
    title:'圆周角定理',brief:'同弧所对的圆周角相等，且等于该弧所对圆心角的一半；直径所对的圆周角是直角。',
    keys:'圆周角 圆心角 同弧 直径 直角',
    idea:'同弧所对的圆周角都相等，且等于圆心角的一半；特别地，直径所对的圆周角 = 90°。',
    proof:['同弧 AB 所对的圆心角 ∠AOB 与圆周角 ∠ACB 满足 ∠ACB = ½∠AOB。','因为同弧所对的圆心角固定，所以同弧所对的圆周角都相等。','当 AB 是直径时，圆心角 = 180°，圆周角 = 90°（直径对直角）。'],
    formula:'圆周角 = ½ × 同弧圆心角　直径所对圆周角 = 90°',
    tips:['拖动圆周上的点 C，观察圆周角是否保持不变','拖动 A、B 改变所对的弧','把 A、B 调成直径两端，验证直角'],
    legend:[{c:C.blue,t:'圆心角 ∠AOB'},{c:C.orange,t:'圆周角 ∠ACB'}],
    hint:'同弧圆周角相等 = 圆心角的一半',
    interaction:'拖动圆周上的点 C，观察圆周角读数保持不变。',
    controls:[
      {type:'range',key:'aA',label:'点 A 角度',min:0,max:360,step:1,digits:0},
      {type:'range',key:'aB',label:'点 B 角度',min:0,max:360,step:1,digits:0},
      {type:'button',key:'diameter',label:'设为直径',onclick:function(b,s){s.aA=0;s.aB=180;H.refreshControls(s);}}
    ],
    init:function(b,s){s.aA=0;s.aB=100;s.aC=220;},
    O:{x:450,y:300},r:170,
    pnt:function(deg){var r=this.r*Math.PI/180;return{x:450+170*Math.cos(deg*Math.PI/180),y:300-170*Math.sin(deg*Math.PI/180)};},
    draw:function(b,s){
      var g=b.scene,m=b.model,O=m.O,r=m.r;
      function P(deg){return{x:O.x+r*Math.cos(deg*Math.PI/180),y:O.y-r*Math.sin(deg*Math.PI/180)};}
      var A=P(s.aA),B=P(s.aB),C=P(s.aC);
      b.circle(O,r,'#334155','#f8fafc',2.4);
      // 圆心角
      b.line(O,A,C.blue,2.4);b.line(O,B,C.blue,2.4);
      var a1=-s.aA*Math.PI/180,a2=-s.aB*Math.PI/180;
      b.arc(O,42,Math.min(a1,a2),Math.max(a1,a2),C.blue,2.4);
      // 圆周角
      b.line(C,A,C.orange,2.4);b.line(C,B,C.orange,2.4);
      var ca=Math.atan2(A.y-C.y,A.x-C.x),cb=Math.atan2(B.y-C.y,B.x-C.x);
      b.arc(C,34,ca,ca+angDiff(cb,ca),C.orange,2.4);
      // 点
      [[A,'A',C.blue],[B,'B',C.blue],[C,'C',C.orange]].forEach(function(t){
        b.circle(t[0],6,t[2],'#fff',2.4);b.text({x:t[0].x+9,y:t[0].y-8},t[1],t[2],13,'start',800);});
      b.handle(C,'C',16);
      b.circle(O,5,'#334155','#fff',2);b.text({x:O.x+9,y:O.y+6},'O','#334155',12,'start',700);
      // 计算角：圆周角等于它所对弧圆心角的一半。若 C 落在劣弧 AB 上，
      // 则 ∠ACB 对的是优弧，应取 (360−central)/2，而不是 central/2。
      var central=Math.abs(angDiff(s.aA*Math.PI/180,s.aB*Math.PI/180))*180/Math.PI;
      if(central>180)central=360-central; // 劣弧 AB 的圆心角
      function norm(x){x=x%360;if(x<0)x+=360;return x;}
      // 判断 C 是否位于 A→B 的劣弧上
      var a=norm(s.aA),bb=norm(s.aB),cc=norm(s.aC);
      var span=(bb-a+360)%360; // A 逆时针到 B 的角度
      var cOnMinor = span<=180 ? (cc>a && cc<bb) : (cc<bb || cc>a);
      var circum=cOnMinor?(360-central)/2:central/2;
      b.readout('圆心角(劣弧) ∠AOB = '+central.toFixed(1)+'°　圆周角 ∠ACB = '+circum.toFixed(1)+'°'+
        (cOnMinor?'（C 在劣弧上，对优弧，(360−'+central.toFixed(0)+'°)/2）':'（½ 关系'+(Math.abs(central-180)<1?'：直径对直角 ✓':'')+'）'));
    },
    onDrag:function(b,n,w){
      var s=b.state;if(n==='C'){s.aC=Math.atan2(-(w.y-300),w.x-450)*180/Math.PI;if(s.aC<0)s.aC+=360;}
    }
  };
  R(inscribedAngle);

  /* ---------- 垂径定理 ---------- */
  var perpendicularChord={
    id:'perpendicular-chord',domain:'geometry',topic:'circle',level:1,
    title:'垂径定理',brief:'垂直于弦的直径平分这条弦，并且平分弦所对的两条弧。',
    keys:'垂径定理 弦 直径 垂直 平分 弧',
    idea:'垂直于弦的直径平分这条弦：若直径 AB⊥弦 CD 于 M，则 CM=DM，且 M 是弦 CD 的中点。',
    proof:['连接 OC、OD，则 OC=OD（都是半径），△OCD 是等腰三角形。','OM⊥CD，等腰三角形底边上的高也是中线，故 CM=DM。','同时 OM 平分弦 CD 所对的圆心角，因此也平分两条弧。'],
    formula:'直径 AB ⊥ 弦 CD 于 M ⇒ CM = DM（M 为弦中点）',
    tips:['拖动弦的位置（改变到圆心的距离 d）','改变弦的倾斜角','观察弦中点 M 与垂足的关系'],
    legend:[{c:C.blue,t:'直径 AB'},{c:C.orange,t:'弦 CD'},{c:C.green,t:'垂径 OM'}],
    hint:'垂直于弦的直径平分弦',
    interaction:'拖动滑块改变弦的位置与倾斜角，观察垂径如何平分弦。',
    controls:[
      {type:'range',key:'d',label:'弦到圆心距离 d',min:0,max:150,step:1,digits:0},
      {type:'range',key:'ang',label:'弦倾斜角',min:0,max:180,step:1,digits:0}
    ],
    init:function(b,s){s.d=80;s.ang=0;},
    draw:function(b,s){
      var g=b.scene,O={x:450,y:300},r=170;
      // 弦方向（垂直于直径方向）
      var rad=s.ang*Math.PI/180;
      var n={x:Math.cos(rad),y:Math.sin(rad)}; // 垂径数学方向
      // 屏幕 y 向下翻转，垂径实际方向为 (n.x,-n.y)；弦须与其垂直 ⇒ t=(-n.y,-n.x)
      var t={x:-n.y,y:-n.x}; // 弦方向（已按屏幕 y 翻转，保证 n·t=0）
      var M={x:O.x+n.x*s.d,y:O.y-n.y*s.d}; // 弦中点（注意y翻转）
      var half=Math.sqrt(Math.max(0,r*r-s.d*s.d));
      var C={x:M.x+t.x*half,y:M.y+t.y*half},D={x:M.x-t.x*half,y:M.y-t.y*half};
      // 直径方向过 O 沿 n
      var A={x:O.x+n.x*r,y:O.y-n.y*r},B={x:O.x-n.x*r,y:O.y+n.y*r};
      b.circle(O,r,'#334155','#f8fafc',2.4);
      b.line(A,B,C.blue,2.6);
      b.line(C,D,C.orange,3);
      b.line(O,M,C.green,2,'6 4');
      b.rightAngle(M,sub(C,M),sub(O,M),12,C.green);
      [[C,'C',C.orange],[D,'D',C.orange],[A,'A',C.blue],[B,'B',C.blue],[M,'M',C.green],[O,'O','#334155']].forEach(function(p){
        b.circle(p[0],p[2]==='M'?6:5,p[2],'#fff',2.2);
        b.text({x:p[0].x+9,y:p[0].y-7},p[1],p[2],12,'start',700);});
      b.handle(M,'M',14);
      var cm=dist(C,M),dm=dist(D,M);
      b.readout('CM = '+cm.toFixed(2)+'　DM = '+dm.toFixed(2)+'　'+(Math.abs(cm-dm)<.5?'✓ M 是弦 CD 的中点':''));
    },
    onDrag:function(b,n,w){
      var s=b.state;if(n==='M'){
        var dx=w.x-450,dy=-(w.y-300);
        s.d=Math.max(0,Math.min(150,Math.hypot(dx,dy)));
        if(Math.hypot(dx,dy)>1)s.ang=Math.atan2(dy,dx)*180/Math.PI;
        H.refreshControls(s);
      }
    }
  };
  R(perpendicularChord);

  /* ---------- 点与圆、圆与圆位置关系 ---------- */
  var circlePosition={
    id:'circle-position',domain:'geometry',topic:'circle',level:1,
    title:'圆与圆的位置关系',brief:'拖动两圆圆心改变圆心距 d，观察外离、外切、相交、内切、内含五种关系。',
    keys:'圆与圆 位置关系 外离 外切 相交 内切 内含 圆心距',
    idea:'设两圆半径为 r₁、r₂，圆心距为 d：d>r₁+r₂ 外离，d=r₁+r₂ 外切，|r₁−r₂|<d<r₁+r₂ 相交，d=|r₁−r₂| 内切，d<|r₁−r₂| 内含。',
    proof:['比较圆心距 d 与两圆半径和 r₁+r₂、半径差 |r₁−r₂| 的大小。','d>r₁+r₂：外离；d=r₁+r₂：外切；|r₁−r₂|<d<r₁+r₂：相交。','d=|r₁−r₂|：内切；d<|r₁−r₂|：内含。'],
    formula:'外离 d>r₁+r₂ · 外切 d=r₁+r₂ · 相交 · 内切 d=|r₁−r₂| · 内含',
    tips:['拖动右侧圆的圆心，改变圆心距 d','改变两圆半径，观察临界值','对照读数中的位置关系'],
    legend:[{c:C.blue,t:'圆 O₁'},{c:C.orange,t:'圆 O₂'}],
    hint:'圆心距 d 与半径和/差决定位置关系',
    interaction:'拖动圆 O₂ 的圆心改变圆心距，观察两圆位置关系变化。',
    controls:[
      {type:'range',key:'r1',label:'半径 r₁',min:40,max:120,step:1,digits:0},
      {type:'range',key:'r2',label:'半径 r₂',min:40,max:120,step:1,digits:0},
      {type:'range',key:'d',label:'圆心距 d',min:0,max:350,step:1,digits:0}
    ],
    init:function(b,s){s.r1=100;s.r2=70;s.d=180;},
    draw:function(b,s){
      var g=b.scene,O1={x:250,y:300},O2={x:250+s.d,y:300};
      b.circle(O1,s.r1,C.blue,'rgba(37,99,235,.06)',2.4);
      b.circle(O2,s.r2,C.orange,'rgba(234,88,12,.06)',2.4);
      b.line(O1,O2,'#94a3b8',1.6,'5 4');
      [[O1,'O₁',C.blue],[O2,'O₂',C.orange]].forEach(function(p){
        b.circle(p[0],5,p[2],'#fff',2.2);b.text({x:p[0].x,y:p[0].y-13},p[1],p[2],13,'middle',800);});
      b.handle(O2,'O2',16);
      var d=s.d,sum=s.r1+s.r2,dif=Math.abs(s.r1-s.r2);
      var rel=d>sum?'外离':Math.abs(d-sum)<1.5?'外切':d>dif&&d<sum?'相交':Math.abs(d-dif)<1.5?'内切':d<dif?'内含':'临界';
      b.text({x:450,y:80},'d = '+d+'　r₁+r₂ = '+sum+'　|r₁−r₂| = '+dif,C.purple,15,'middle',800);
      b.readout('圆心距 d='+d+'　位置关系：'+rel);
    },
    onDrag:function(b,n,w){
      var s=b.state;if(n==='O2'){s.d=Math.max(0,Math.min(350,w.x-250));H.refreshControls(s);}
    }
  };
  R(circlePosition);

})();
