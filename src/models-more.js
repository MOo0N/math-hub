/* ============ 补充模型：平移、轴对称、相似、统计图表、反比例k ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,V=H.V,C=H.COLORS;
  var add=V.add,sub=V.sub,mul=V.mul,dist=V.dist,mid=V.mid,unit=V.unit,lerp2=V.lerp2;

  /* ---------- 平移变换 ---------- */
  var translation={
    id:'translation-transform',domain:'geometry',topic:'transform',level:1,
    title:'平移变换',brief:'沿向量 v 平移：每个点都按同一方向、同一距离移动，形状大小不变，对应线段平行且相等。',
    keys:'平移 变换 向量 对应点 平行',
    idea:'平移把图形上每一点都沿同一方向移动相同距离：AA′∥BB′∥CC′ 且 AA′=BB′=CC′，对应线段平行且相等。',
    proof:['平移由向量 v=(a,b) 决定，点 P 移到 P′=P+v。','所有点的位移向量相同，故 AA′∥BB′ 且 AA′=BB′。','平移是全等变换，形状大小不变，对应线段平行且相等。'],
    formula:'P′ = P + v　（AA′ ∥ BB′ ∥ CC′，AA′=BB′=CC′）',
    tips:['拖动 a、b 改变平移向量','拖动原图形的顶点','观察对应点连线都平行且相等'],
    legend:[{c:C.blue,t:'原图形'},{c:C.orange,t:'平移后'}],
    hint:'所有点沿同一方向移动相同距离',
    interaction:'拖动 a、b 滑块改变平移向量，或拖动顶点。',
    controls:[
      {type:'range',key:'a',label:'水平位移 a',min:-4,max:4,step:0.1,digits:1},
      {type:'range',key:'b',label:'竖直位移 b',min:-3,max:3,step:0.1,digits:1}
    ],
    init:function(b,s){s.a=3;s.b=1.5;s.pts=[{x:1,y:1},{x:3,y:0.8},{x:2.4,y:2.6}];},
    sc:function(p){return{x:100+p.x*70,y:480-p.y*70};},
    draw:function(b,s){
      var g=b.scene,m=b.model,sc=m.sc;
      b.line(sc({x:0,y:0}),sc({x:12,y:0}),'#cbd5e1',1.4);
      b.line(sc({x:0,y:0}),sc({x:0,y:6}),'#cbd5e1',1.4);
      var v={x:s.a,y:s.b};
      var orig=s.pts,img=orig.map(function(p){return{x:p.x+v.x,y:p.y+v.y};});
      b.poly(orig.map(sc),C.blue,.14,C.blue,2.6);
      b.poly(img.map(sc),C.orange,.14,C.orange,2.6);
      orig.forEach(function(p,i){
        b.line(sc(p),sc(img[i]),'#93c5fd',1.5,'4 4');
        b.circle(sc(p),5,C.blue,'#fff',2);b.circle(sc(img[i]),5,C.orange,'#fff',2);
      });
      b.handle(sc(orig[0]),'p0',14);
      var d=dist(sc(orig[0]),sc(img[0]));
      b.readout('平移向量 v = ('+s.a.toFixed(1)+', '+s.b.toFixed(1)+')　对应点位移 = '+d.toFixed(1)+'px　对应线段平行且相等 ✓');
    },
    onDrag:function(b,n,w){var s=b.state,i=+n.slice(1);
      s.pts[i]={x:Math.max(0,Math.min(12,(w.x-100)/70)),y:Math.max(0,Math.min(6,(480-w.y)/70))};}
  };
  R(translation);

  /* ---------- 轴对称 ---------- */
  var axialSymmetry={
    id:'axial-symmetry',domain:'geometry',topic:'transform',level:1,
    title:'轴对称',brief:'沿直线 l 翻折：对应点的连线被对称轴垂直平分，图形全等。',
    keys:'轴对称 对称 对称轴 垂直平分 翻折',
    idea:'轴对称把图形沿对称轴 l 翻折：点 P 与 P′ 的连线 PP′ 被 l 垂直平分，对应线段相等，图形全等。',
    proof:['若 P 与 P′ 关于 l 对称，则 l 是 PP′ 的垂直平分线。','对称轴上的点到 P、P′ 距离相等。','轴对称是全等变换，形状大小不变。'],
    formula:'l 垂直平分 PP′　（P 与 P′ 关于 l 对称）',
    tips:['拖动点 P，观察对称点 P′','改变对称轴的倾斜角','观察 PP′ 始终垂直于对称轴'],
    legend:[{c:C.blue,t:'点 P / 原图形'},{c:C.orange,t:'对称点 P′'},{c:C.green,t:'对称轴 l'}],
    hint:'对称轴垂直平分对应点连线',
    interaction:'拖动点和对称轴，观察对称关系。',
    controls:[
      {type:'range',key:'ang',label:'对称轴倾角 (°)',min:0,max:180,step:1,digits:0},
      {type:'range',key:'px',label:'点 P 横坐标',min:2,max:8,step:0.1,digits:1},
      {type:'range',key:'py',label:'点 P 纵坐标',min:1,max:5,step:0.1,digits:1}
    ],
    init:function(b,s){s.ang=45;s.px=3;s.py=4;},
    reflect:function(s,p){
      var a=s.ang*Math.PI/180,n={x:Math.sin(a),y:Math.cos(a)};
      // 对称轴过原点方向 d
      var d={x:Math.cos(a),y:Math.sin(a)};
      var proj=d.x*p.x+d.y*p.y;var foot={x:proj*d.x,y:proj*d.y};
      return{x:2*foot.x-p.x,y:2*foot.y-p.y};
    },
    sc:function(p){return{x:100+p.x*70,y:480-p.y*70};},
    draw:function(b,s){
      var g=b.scene,m=b.model,sc=m.sc,ang=s.ang*Math.PI/180;
      var d={x:Math.cos(ang),y:Math.sin(ang)};
      // 画对称轴（用方向向量）
      var L1={x:-d.x*2,y:-d.y*2},L2={x:d.x*9,y:d.y*9};
      b.line(sc(L1),sc(L2),C.green,2.4,'8 5');
      var P={x:s.px,y:s.py},Pp=m.reflect(s,P);
      b.line(sc(P),sc(Pp),'#94a3b8',1.6,'4 4');
      var foot={x:(P.x+Pp.x)/2,y:(P.y+Pp.y)/2};
      b.circle(sc(foot),5,C.green,'#fff',2);
      b.circle(sc(P),8,C.blue,'#fff',2.5);b.text({x:sc(P).x-12,y:sc(P).y-8},'P',C.blue,14,'end',800);
      b.circle(sc(Pp),8,C.orange,'#fff',2.5);b.text({x:sc(Pp).x+12,y:sc(Pp).y-8},'P′',C.orange,14,'start',800);
      b.circle(sc(foot),5,C.green,'#fff',2);
      b.handle(sc(P),'P',16);
      b.readout('P('+P.x.toFixed(1)+','+P.y.toFixed(1)+') → P′('+Pp.x.toFixed(1)+','+Pp.y.toFixed(1)+')　l 垂直平分 PP′ ✓');
    },
    onDrag:function(b,n,w){var s=b.state;
      if(n==='P'){s.px=Math.max(-2,Math.min(10,(w.x-100)/70));s.py=Math.max(-2,Math.min(7,(480-w.y)/70));H.refreshControls(s);}}
  };
  R(axialSymmetry);

  /* ---------- 相似三角形基本模型 ---------- */
  var similarTriangles={
    id:'similar-triangles',domain:'geometry',topic:'triangle',level:2,
    title:'相似三角形 · A 字与 8 字型',brief:'平行线截出的 A 字型、8 字型，以及对顶角相等的相似模型，是比例线段的核心。',
    keys:'相似三角形 A字型 8字型 平行 比例',
    idea:'平行于三角形一边的直线截出的小三角形与原三角形相似（A 字型）；两条相交直线上由平行线截出的是 8 字型（X 型）相似。',
    proof:['A 字型：DE∥BC，则 ∠A 公共，∠ADE=∠ABC，由 AA 得 △ADE∽△ABC。','8 字型：AB∥CD，对顶角 ∠AOB=∠COD，内错角相等，由 AA 得 △AOB∽△DOC。','相似对应边成比例，可求未知线段。'],
    formula:'A 字型 ΔADE∽ΔABC　8 字型 ΔAOB∽ΔDOC　⇒ 对应边成比例',
    tips:['切换 A 字型 / 8 字型','拖动点改变位置，验证相似比','观察对应边的比例读数'],
    legend:[{c:C.blue,t:'小三角形'},{c:C.orange,t:'大三角形'}],
    hint:'平行 + 公共角/对顶角 → AA 相似',
    interaction:'拖动点观察相似关系和对应边的比例。',
    controls:[
      {type:'buttons',key:'mode',items:[
        {label:'A 字型',onclick:function(b,s){s.mode='A';}},
        {label:'8 字型',onclick:function(b,s){s.mode='X';}}
      ]},
      {type:'range',key:'t',label:'截点比例',min:0.2,max:0.8,step:0.01,digits:2}
    ],
    init:function(b,s){s.mode='A';s.t=0.5;},
    draw:function(b,s){
      var g=b.scene;
      if(s.mode==='A'){
        var A={x:450,y:120},B={x:250,y:480},Cc={x:650,y:480};
        var D=lerp2(A,B,s.t),E=lerp2(A,Cc,s.t);
        b.poly([A,B,Cc],'none',1,'#cbd5e1',2);
        b.poly([A,D,E],C.blue,.16,C.blue,2.6);
        b.line(D,E,C.orange,2.6);
        b.text({x:D.x-10,y:D.y},'D',C.blue,13,'end',800);
        b.text({x:E.x+10,y:E.y},'E',C.blue,13,'start',800);
        b.text({x:A.x,y:A.y-12},'A','#334155',13,'middle',800);
        b.text({x:B.x-10,y:B.y+18},'B','#334155',13,'end',800);
        b.text({x:Cc.x+10,y:Cc.y+18},'C','#334155',13,'start',800);
        var ratio=dist(A,D)/dist(A,B);
        b.readout('DE∥BC ⇒ △ADE∽△ABC　相似比 AD/AB = '+ratio.toFixed(2)+'　DE/BC = '+ratio.toFixed(2));
      }else{
        // X 型（8 字型）：上下两条平行线 AB∥CD，交叉线 AD 与 BC 交于 O
        var A={x:300,y:180},B={x:420,y:180},Cc={x:360,y:460},D={x:500,y:460};
        // 求 AD 与 BC 的真实交点（保证对顶角存在）
        var ux=D.x-A.x,uy=D.y-A.y,vx=Cc.x-B.x,vy=Cc.y-B.y;
        var den=ux*vy-uy*vx;
        var tt=den!==0?((B.x-A.x)*vy-(B.y-A.y)*vx)/den:0.5;
        var O={x:A.x+ux*tt,y:A.y+uy*tt};
        b.line(A,D,C.blue,2.6);b.line(B,Cc,C.blue,2.6); // 交叉线（对顶角在 O）
        b.line(A,B,C.orange,3);b.line(Cc,D,C.orange,3); // 平行线 AB∥CD
        [[A,'A'],[B,'B'],[Cc,'C'],[D,'D'],[O,'O']].forEach(function(p){
          b.circle(p[0],5,p[1]==='O'?'#334155':C.blue,'#fff',2.2);
          b.text({x:p[0].x-9,y:p[0].y-7},p[1],'#334155',12,'end',700);});
        var r1=dist(A,B)/dist(Cc,D);
        b.readout('AB∥CD ⇒ △AOB∽△DOC　相似比 AB/CD = '+r1.toFixed(2)+'（对顶角 + 内错角）');
      }
    }
  };
  R(similarTriangles);

  /* ---------- 统计图表生成器 ---------- */
  var chartMaker={
    id:'chart-maker',domain:'stats',topic:'statistics',level:1,
    title:'统计图表 · 动态生成',brief:'同一组数据用条形图、折线图、扇形图呈现，体会不同图表的表达侧重。',
    keys:'统计图 条形图 折线图 扇形图 数据',
    idea:'条形图便于比较各类别数量；折线图突出数据变化趋势；扇形图显示各部分占总体的比例。同一组数据换个图表，重点就变了。',
    proof:['条形图：用直条高度表示数量，便于比较大小。','折线图：用折线连接各点，突出增减变化趋势。','扇形图：用扇形面积表示占比，各部分之和为 100%。'],
    formula:'扇形圆心角 = 该部分占比 × 360°',
    tips:['切换三种图表类型','修改各类别数据，观察图表变化','扇形图看占比，折线图看趋势'],
    legend:[{c:C.blue,t:'数据'},],
    hint:'同一数据，不同图表，不同侧重',
    interaction:'切换图表类型、修改数据，观察图形变化。',
    controls:[
      {type:'buttons',key:'chart',items:[
        {label:'条形图',onclick:function(b,s){s.type='bar';}},
        {label:'折线图',onclick:function(b,s){s.type='line';}},
        {label:'扇形图',onclick:function(b,s){s.type='pie';}}
      ]},
      {type:'button',key:'random',label:'随机数据',onclick:function(b,s){s.data=s.data.map(function(){return Math.floor(Math.random()*8)+2;});}},
      {type:'button',key:'reset',label:'还原',onclick:function(b,s){s.data=[8,12,7,15,10];}}
    ],
    init:function(b,s){s.type='bar';s.data=[8,12,7,15,10];},
    draw:function(b,s){
      var g=b.scene,d=s.data,n=d.length,sum=d.reduce(function(a,x){return a+x;},0);
      var labels=['A','B','C','D','E'],cols=[C.blue,C.orange,C.green,C.purple,C.teal];
      if(s.type==='bar'||s.type==='line'){
        b.line({x:120,y:470},{x:850,y:470},'#94a3b8',2);
        b.line({x:120,y:470},{x:120,y:100},'#94a3b8',2);
        var bw=100,gap=30,x0=160,maxv=Math.max.apply(null,d);
        var pts=[];
        d.forEach(function(v,i){
          var h=v/maxv*330,x=x0+i*(bw+gap);
          if(s.type==='bar'){
            b.poly([{x:x,y:470},{x:x+bw,y:470},{x:x+bw,y:470-h},{x:x,y:470-h}],cols[i%5],.7,cols[i%5],1.5);
            b.text({x:x+bw/2,y:470-h-8},String(v),cols[i%5],13,'middle',700);
          }else pts.push({x:x+bw/2,y:470-h});
          b.text({x:x+bw/2,y:492},labels[i],'var(--mh-muted)',12,'middle');
        });
        if(s.type==='line'){
          b.polyline(pts,C.blue,3);
          pts.forEach(function(p,i){b.circle(p,6,cols[i%5],'#fff',2);});
        }
        b.text({x:120,y:90},'数值（最大 '+maxv+'）','var(--mh-muted)',11,'start');
      }else{
        // 扇形图
        var cx=400,cy=300,r=180,a=-Math.PI/2;
        d.forEach(function(v,i){
          var frac=v/sum,a2=a+frac*2*Math.PI;
          var pts=[{x:cx,y:cy}];
          for(var t=a;t<=a2;t+=0.05)pts.push({x:cx+r*Math.cos(t),y:cy+r*Math.sin(t)});
          b.poly(pts,cols[i%5],.75,'#fff',1.5);
          var am=(a+a2)/2;
          b.text({x:cx+r*0.65*Math.cos(am),y:cy+r*0.65*Math.sin(am)},(frac*100).toFixed(0)+'%','#fff',13,'middle',800);
          a=a2;
        });
        d.forEach(function(v,i){b.text({x:660,y:160+i*30},labels[i]+' = '+v+' ('+(v/sum*100).toFixed(0)+'%)',cols[i%5],12,'start',700);
          b.circle({x:650,y:155+i*30},6,cols[i%5],cols[i%5],1);});
      }
      b.readout('图表类型：'+({bar:'条形图',line:'折线图',pie:'扇形图'}[s.type])+'　数据 ['+d.join(', ')+']　总计 '+sum);
    }
  };
  R(chartMaker);

})();
