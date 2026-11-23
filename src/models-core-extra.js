/* ============ 核心知识点补充：圆切线、韦达定理、三角形中位线 ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,C=H.COLORS;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};}
  function add(a,b){return{x:a.x+b.x,y:a.y+b.y};}
  function sub(a,b){return{x:a.x-b.x,y:a.y-b.y};}
  function mid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function dot(a,b){return a.x*b.x+a.y*b.y;}
  function tag(b,p,txt,col,size){
    b.circle(p,5,col,'#fff',2);
    b.text({x:p.x,y:p.y-13},txt,col,size||13,'middle',700);
  }

  /* ---------- 1. 圆的切线 · 判定与性质 ---------- */
  var tangent={
    id:'circle-tangent',domain:'geometry',topic:'circle',level:2,
    title:'圆的切线 · 判定与性质',
    brief:'与圆只有一个公共点的直线叫切线；切点与圆心的半径垂直于切线。圆外一点到切点的切线长满足 PT² = PO² − r²（切线长定理的基础）。',
    scenario:['已知圆与圆外一点，求切线长、切线与连心线的夹角。','求圆到直线的距离并与半径比较，判定直线与圆相切/相交/相离。','在圆内接图形中利用「半径垂直切线」构造直角三角形，结合勾股求解。','切线长定理：从圆外一点引两条切线，切线长相等（PA=PB）。'],
    figure:['蓝色圆表示 ⊙O，半径 r 由滑块控制；圆外点 P 可沿水平方向拖动。','从 P 向圆作切线，橙色线段为切线段 PT，切点 T 处画半径 OT 与直角记号，突出 OT⊥PT。','虚线连 OP，读数条显示 PT² 与 PO²−r² 是否相等（勾股恒等式）。'],
    idea:'设圆半径 r，圆外点 P 到圆心距离 d=PO。过 P 作切线切圆于 T，则 OT⊥PT，△OTP 为直角三角形，故 PT²=OP²−OT²=d²−r²。判定定理：过半径外端且垂直于该半径的直线是圆的切线。',
    proof:[
      '性质定理：圆的切线垂直于过切点的半径。反证：若半径 OT 不垂直切线 l，则 O 到 l 的垂足 H≠T，OH<OT=r，说明 l 与圆有两个交点，与「只有一个公共点」矛盾。',
      '由 OT⊥PT，△OTP 是以 T 为直角的直角三角形，由勾股定理得 PT²=OP²−OT²=d²−r²。',
      '判定定理：经过半径外端并且垂直于这条半径的直线是圆的切线；推论——圆心到直线距离等于半径 ⟺ 直线与圆相切。',
      '切线长定理：从圆外一点 P 引两条切线 PA、PB，则 PA=PB（由两次勾股，均为 √(d²−r²)），且 OP 平分 ∠APB。'
    ],
    formula:'OT ⊥ PT　　PT² = OP² − r²　　PT = √(OP² − r²)',
    example:[
      '例1：⊙O 半径 r=3，点 P 到圆心 OP=5，求切线长 PT。PT=√(5²−3²)=√16=4。',
      '例2：从圆外一点 P 引两条切线，切点为 A、B，若 PA=6，则 PB=6，且 OP 平分 ∠APB。',
      '例3：直线 l 到圆心距离为 4，圆半径为 4，则 l 与圆相切；若距离为 3 则相交，为 5 则相离。'
    ],
    mistakes:[
      '把「半径垂直于切线」写成「垂直于过切点的弦」——必须是过切点的半径。',
      '误认为切线长 PT 等于 OP−r；实际是 √(OP²−r²)，只有勾股关系。',
      '判定切线时只验证「过圆上一点」而漏掉「垂直于该点半径」，条件不足。'
    ],
    tips:['拖动 P 改变圆外点位置，观察切线长变化','调节半径 r，验证 PT²=OP²−r² 恒成立','直角记号处体现「半径垂直切线」'],
    legend:[{c:C.blue,t:'⊙O'},{c:C.orange,t:'切线 PT'},{c:C.purple,t:'半径 OT / OP'}],
    hint:'半径垂直切线，切线长用勾股',
    interaction:'拖动圆外点 P 与半径滑块，观察切线长与恒等式。',
    yUp:true,
    controls:[
      {type:'range',key:'r',label:'半径 r',min:70,max:150,step:1,digits:0},
      {type:'range',key:'px',label:'P 到圆心距离 OP',min:190,max:340,step:1,digits:0}
    ],
    init:function(b,s){s.r=100;s.px=260;},
    draw:function(b,s){
      var O0=O(),r=s.r,d=s.px;
      // 半透明圆面（poly 支持 fill-opacity，circle 第5参是描边透明度）
      var ring=[];for(var k=0;k<48;k++){var t=k/48*Math.PI*2;ring.push({x:O0.x+r*Math.cos(t),y:O0.y+r*Math.sin(t)});}
      b.poly(ring,C.blue,.10,C.blue,2.6);
      var Pp={x:O0.x+d,y:O0.y};
      // 切点 T：OT⊥PT，OT=r, OP=d -> 投影长度 r^2/d，高 = sqrt(r^2 - (r^2/d)^2)
      var proj=r*r/d;
      var h=Math.sqrt(Math.max(0,r*r-proj*proj));
      var ux=(Pp.x-O0.x)/d,uy=(Pp.y-O0.y)/d; // = (1,0)
      var base={x:O0.x+proj*ux,y:O0.y+proj*uy};
      var T={x:base.x+h*(-uy),y:base.y+h*(ux)};
      var T2={x:base.x-h*(-uy),y:base.y-h*(ux)};
      b.line(Pp,T,C.orange,3); b.line(Pp,T2,C.orange,2,'6 4',.6);
      b.line(O0,T,C.purple,2); b.line(O0,T2,C.purple,1.6,'4 4',.6);
      b.line(O0,Pp,C.slate,1.6,'4 4');
      // 直角记号 @T：沿 TO 与 TP 两方向
      var u1=sub(O0,T),u2=sub(Pp,T);
      b.rightAngle(T,u1,u2,11,C.purple);
      b.circle(O0,5,C.slate,'#fff',2);
      b.text({x:O0.x-13,y:O0.y-13},'O',C.slate,13,'middle',700);
      tag(b,Pp,'P',C.slate);tag(b,T,'T',C.orange);
      b.handle(Pp,'P',18);
      var pt=dist(Pp,T),lhs=pt*pt,rhs=d*d-r*r;
      b.readout('OP='+d.toFixed(0)+' r='+r.toFixed(0)+'　PT='+pt.toFixed(2)+'　PT²='+lhs.toFixed(1)+'　OP²−r²='+rhs.toFixed(1)+'　OT⊥PT ✓');
    },
    onDrag:function(b,n,w){
      var s=b.state,O0=O();
      if(n==='P'){s.px=Math.round(Math.max(s.r+20,Math.min(340,w.x-O0.x)));H.refreshControls(s);}
    }
  };
  R(tangent);

  /* ---------- 2. 韦达定理 · 根与系数关系 ---------- */
  var vieta={
    id:'vieta',domain:'algebra',topic:'equation',level:2,
    title:'韦达定理 · 根与系数关系',
    brief:'一元二次方程 ax²+bx+c=0（a≠0）的两根 x₁、x₂ 与系数满足 x₁+x₂=−b/a，x₁x₂=c/a；它把「根」与「系数」直接联系起来。',
    scenario:['已知一根求另一根：由 x₁+x₂=−b/a 快速求出另一根，避免重复解二次方程。','求两根的对称式：如 x₁²+x₂²、1/x₁+1/x₂、|x₁−x₂| 等，先化成和与积再代入。','构造方程：已知两根，逆用韦达定理写出以它们为根的一元二次方程。','结合判别式 Δ 判断根的分布（同号、异号、正负）与参数取值。'],
    figure:['橙色抛物线 y=ax²+bx+c，与 x 轴交于 A(x₁,0)、B(x₂,0) 两点（Δ>0 时）。','在 x 轴上标出两根 x₁、x₂ 的位置，读数条同时给出「两根之和」与「−b/a」、「两根之积」与「c/a」两组数值。','拖动 a、b、c 滑块，观察抛物线开口与交点变化，但两组等式始终相等。'],
    idea:'设 ax²+bx+c=a(x−x₁)(x−x₂)，展开得 ax²+bx+c=ax²−a(x₁+x₂)x+a·x₁x₂。比较系数：b=−a(x₁+x₂)，c=a·x₁x₂，故 x₁+x₂=−b/a，x₁x₂=c/a。',
    proof:[
      '由因式分解定理，若 x₁、x₂ 是 ax²+bx+c=0 的两根，则 ax²+bx+c=a(x−x₁)(x−x₂)。',
      '展开右边：a(x²−(x₁+x₂)x+x₁x₂)=ax²−a(x₁+x₂)x+a·x₁x₂。',
      '与 ax²+bx+c 逐项比较系数：b=−a(x₁+x₂) ⟹ x₁+x₂=−b/a；c=a·x₁x₂ ⟹ x₁x₂=c/a。',
      '前提：a≠0；当 Δ=b²−4ac≥0 时两根为实数（Δ=0 时两根相等）。韦达定理对复根同样成立。'
    ],
    formula:'x₁ + x₂ = − b/a　　x₁ · x₂ = c/a',
    example:[
      '例1：方程 x²−5x+6=0 的两根满足 x₁+x₂=5，x₁x₂=6（实际根为 2、3）。',
      '例2：已知 x₁+x₂=4，x₁x₂=−5，则以它们为根的方程（首项系数 1）为 x²−4x−5=0。',
      '例3：若方程 x²+(k−1)x+k=0 两根之和为 3，则 −(k−1)=1·3 ⟹ k=−2。',
      '例4：求 x₁²+x₂²：因 x₁²+x₂²=(x₁+x₂)²−2x₁x₂，代入和与积即可。'
    ],
    mistakes:[
      '忽略 a≠0 与 Δ≥0 的前提；无实根时不能谈「实数两根」。',
      '符号错误：x₁+x₂=−b/a 有负号，x₁x₂=c/a 没有，且不要漏掉除以 a。',
      '把韦达定理用于 ax²+bx+c=0 但忘记先化为一般形式（如 (x+1)(x−2)=3 需先展开）。'
    ],
    tips:['拖动 a、b、c 观察抛物线与两根变化','读数中两根之和始终等于 −b/a','两根之积始终等于 c/a， Δ≥0 保证实根'],
    legend:[{c:C.orange,t:'抛物线 y=ax²+bx+c'},{c:C.blue,t:'两根与 x 轴交点'}],
    hint:'和与积：x₁+x₂=−b/a，x₁x₂=c/a',
    interaction:'拖动 a、b、c 滑块，观察两根位置，核对两根之和与积。',
    controls:[
      {type:'range',key:'a',label:'a',min:-2.5,max:2.5,step:0.1,digits:1},
      {type:'range',key:'b',label:'b',min:-6,max:6,step:0.2,digits:1},
      {type:'range',key:'c',label:'c',min:-6,max:6,step:0.2,digits:1}
    ],
    init:function(b,s){s.a=1;s.b=-1;s.c=-6;},
    draw:function(b,s){
      function sc(x,y){return{x:450+x*54,y:300-y*40};}
      // a=0 不是二次方程，韦达定理不适用；明确提示而非用 a||0.001 伪装成巨型数值
      if(Math.abs(s.a)<1e-6){
        b.line(sc(-6,0),sc(6,0),'#a9a3a0',1.6);b.line(sc(0,-6),sc(0,7),'#a9a3a0',1.6);
        var ylin=Math.abs(s.b)<1e-9?null:-s.c/s.b;
        b.text(P(0,-255),'a = 0：不是二次方程，韦达定理（两根和/积）不适用',C.purple,13,'middle',700);
        b.readout('a=0：方程为 '+s.b.toFixed(1)+'x + '+s.c.toFixed(1)+' = 0（一次方程）　'+
          (ylin===null?(Math.abs(s.c)<1e-9?'恒等式，任意 x 均为解':'无解'):'唯一解 x='+ylin.toFixed(3))+
          '　无「两根之和/积」可言');
        return;
      }
      var a=s.a;
      b.line(sc(-6,0),sc(6,0),'#a9a3a0',1.6);b.line(sc(0,-6),sc(0,7),'#a9a3a0',1.6);
      // 抛物线
      var pts=[];
      for(var x=-5.5;x<=5.5;x+=0.06){var y=a*x*x+s.b*x+s.c;if(y>=-7&&y<=7)pts.push(sc(x,y));}
      if(pts.length>1)b.polyline(pts,C.orange,2.8);
      var D=s.b*s.b-4*a*s.c;
      var sum=-s.b/a,prod=s.c/a;
      var x1=null,x2=null;
      if(D>=0){
        var sq=Math.sqrt(D);
        x1=(-s.b-sq)/(2*a);x2=(-s.b+sq)/(2*a);
        [x1,x2].forEach(function(x,i){
          if(Math.abs(x)<=6){
            var A=sc(x,0);
            b.circle(A,5.5,C.blue,'#fff',2);
            b.text({x:A.x,y:A.y+20},'x'+(i+1)+'='+x.toFixed(2),C.blue,12,'middle',700);
          }
        });
      }
      var has=D>=-0.0001;
      b.text(P(0,-255),'Δ = '+D.toFixed(2)+(has?' ≥ 0（有实根）':' < 0（无实根）'),C.purple,13,'middle',700);
      if(has&&x1!==null&&x2!==null){
        // 用求根公式得到的两根去「实测」和与积，再与系数公式对照，才是真正的验证
        var realSum=x1+x2,realProd=x1*x2;
        var okS=Math.abs(realSum-sum)<1e-6,okP=Math.abs(realProd-prod)<1e-6;
        b.readout('由求根公式：x₁='+x1.toFixed(3)+'　x₂='+x2.toFixed(3)+
          '　实测和='+realSum.toFixed(3)+' vs −b/a='+sum.toFixed(3)+(okS?' ✓':' ✗')+
          '　实测积='+realProd.toFixed(3)+' vs c/a='+prod.toFixed(3)+(okP?' ✓':' ✗'));
      }else{
        b.readout('Δ<0，无实根：系数关系 x₁+x₂=−b/a='+sum.toFixed(3)+'，x₁·x₂=c/a='+prod.toFixed(3)+' 仅作演示（此处无实根可验证）');
      }
    }
  };
  R(vieta);

  /* ---------- 3. 三角形中位线 ---------- */
  var midline={
    id:'triangle-midline',domain:'geometry',topic:'triangle',level:1,
    title:'三角形中位线定理',
    brief:'连接三角形两边中点的线段叫中位线；它平行于第三边且等于第三边的一半。这是证明平行与线段倍数关系的重要工具。',
    scenario:['证明某线段平行于三角形一边：找到两边的中点并连成中位线，即得平行。','求线段长度：已知第三边求中位线（一半），或已知中位线求第三边（两倍）。','构造辅助线：在梯形或复杂图形中取中点连中位线，把分散条件集中。','与相似结合：中位线把三角形分成一个相似小三角形（相似比 1:2，面积比 1:4）。'],
    figure:['蓝色三角形 ABC，D、E 分别是 AB、AC 的中点（用相同刻痕表示中点）。','橙色线段 DE 为中位线，绿色虚线为第三边 BC，二者平行（画平行箭头标记）。','拖动顶点 A、B、C，读数条显示 DE 与 BC/2 相等、且方向向量叉积为 0（平行）。'],
    idea:'D、E 分别是 AB、AC 中点，则 AD/AB=AE/AC=1/2，又 ∠A 公共，故 △ADE∽△ABC（SAS），相似比 1:2，从而 DE∥BC 且 DE=BC/2。',
    proof:[
      '因为 D、E 为中点，AD=½AB，AE=½AC，故 AD/AB=AE/AC=1/2。',
      '又 ∠DAE=∠BAC（公共角），由两边成比例且夹角相等得 △ADE∽△ABC（SAS）。',
      '相似比为 1:2，所以 DE/BC=1/2，即 DE=½BC。',
      '由相似对应角相等 ∠ADE=∠ABC，同位角相等故 DE∥BC。'
    ],
    formula:'DE ∥ BC　且　DE = ½ BC（D、E 为 AB、AC 中点）',
    example:[
      '例1：△ABC 中 BC=10，D、E 为两边中点，则 DE=5 且 DE∥BC。',
      '例2：若中位线 DE=4，则第三边 BC=8。',
      '例3：△ADE 与 △ABC 相似比为 1:2，面积比为 1:4（面积比是相似比的平方）。'
    ],
    mistakes:[
      '把「连接两边中点的线段」与「过中点作平行线」混为一谈——中位线必须两端都是中点。',
      '误认为中位线等于第三边的一半且「垂直」——是平行，不是垂直。',
      '把面积比也写成 1:2；相似比 1:2 对应面积比 1:4。'
    ],
    tips:['拖动 A、B、C 改变三角形形状','观察刻痕标出 D、E 为中点','读数中 DE 恒等于 BC/2，且方向平行'],
    legend:[{c:C.blue,t:'△ABC'},{c:C.orange,t:'中位线 DE'},{c:C.green,t:'第三边 BC'}],
    hint:'中位线平行且等于第三边的一半',
    interaction:'拖动三角形顶点，观察中位线与第三边的平行与倍数关系恒成立。',
    yUp:true,
    controls:[
      {type:'buttons',key:'which',label:'中位线',items:[
        {label:'DE（对 BC）',onclick:function(b,s){s.which='DE';}},
        {label:'DF（对 AC）',onclick:function(b,s){s.which='DF';}},
        {label:'EF（对 AB）',onclick:function(b,s){s.which='EF';}}
      ]}
    ],
    init:function(b,s){s.which='DE';s.A=P(0,150);s.B=P(-170,-90);s.Cp=P(180,-70);},
    draw:function(b,s){
      var A=s.A,B=s.B,Cp=s.Cp;
      var D=mid(A,B),E=mid(A,Cp),F=mid(B,Cp);
      var pairs={
        DE:[D,E,B,Cp,'DE','BC'],
        DF:[D,F,A,Cp,'DF','AC'],
        EF:[E,F,A,B,'EF','AB']
      };
      var q=pairs[s.which]||pairs.DE;
      var P1=q[0],P2=q[1],Q1=q[2],Q2=q[3],ln=q[4],base=q[5];
      b.poly([A,B,Cp],C.blue,.08,C.blue,2.4);
      b.line(B,Cp,C.green,2.2);b.line(A,Cp,C.green,1.6,'5 4',.6);b.line(A,B,C.green,1.6,'5 4',.6);
      b.line(P1,P2,C.orange,3.2);
      // 中点刻痕
      function tick2(p1,p2,m){
        var d=sub(p2,p1),len=Math.hypot(d.x,d.y)||1,ux=d.x/len,uy=d.y/len;
        var nx=-uy,ny=ux;
        b.line({x:m.x-6*nx,y:m.y-6*ny},{x:m.x+6*nx,y:m.y+6*ny},C.slate,2);
      }
      tick2(A,B,D);tick2(A,Cp,E);tick2(B,Cp,F);
      tag(b,A,'A',C.blue);tag(b,B,'B',C.blue);tag(b,Cp,'C',C.blue);
      b.circle(D,4.5,C.orange,'#fff',2);b.circle(E,4.5,C.orange,'#fff',2);b.circle(F,4.5,C.orange,'#fff',2);
      b.text({x:P1.x,y:P1.y-14},ln,C.orange,13,'middle',700);
      b.text({x:P2.x,y:P2.y-14},ln,C.orange,13,'middle',700);
      b.handle(A,'A',16);b.handle(B,'B',16);b.handle(Cp,'C',16);
      var lm=dist(P1,P2),baseLen=dist(Q1,Q2);
      var v1=sub(P2,P1),v2=sub(Q2,Q1);
      var cross=v1.x*v2.y-v1.y*v2.x;
      b.readout('D/E/F 为三边中点　'+ln+'='+lm.toFixed(2)+'　'+base+'/2='+(baseLen/2).toFixed(2)+'　平行判定(叉积)='+cross.toFixed(2));
    },
    onDrag:function(b,n,w){
      var s=b.state;
      if(n==='A')s.A=w;else if(n==='B')s.B=w;else if(n==='C')s.Cp=w;
    }
  };
  R(midline);
})();
