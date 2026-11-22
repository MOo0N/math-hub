/* ============ 四边形专题：平行四边形、特殊平行四边形 ============ */
(function(){
  'use strict';
  var H=window.MathHub,R=H.register,C=H.COLORS;
  var D2R=Math.PI/180;
  function O(){return{x:450,y:300};}
  function P(x,y){return{x:450+x,y:300+y};}
  function add(a,b){return{x:a.x+b.x,y:a.y+b.y};}
  function mid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function tag(b,p,txt,col){
    b.circle(p,5,col,'#fff',2);
    b.text({x:p.x,y:p.y-13},txt,col,13,'middle',700);
  }

  /* ---------- 1. 平行四边形的性质与判定 ---------- */
  var parallelogram={
    id:'quad-parallelogram',domain:'geometry',topic:'quad',level:1,
    title:'平行四边形 · 性质与判定',
    brief:'两组对边分别平行的四边形。对边相等、对角相等、对角线互相平分；也是判定一个四边形是否为平行四边形的核心依据。',
    scenario:['求未知边长或角度：已知一边与邻边，利用「对边相等」求周长；已知一角，利用「对角相等、邻角互补」求其余角。','证明线段相等或角相等：把待证线段放进平行四边形，用对边/对角性质转化。','作为矩形、菱形、正方形的「母图形」，在其上叠加特殊条件。'],
    figure:['用蓝底平行四边形 ABCD 表示主体，虚线画出两条对角线 AC、BD。','在两条对角线交点处画橙色小圆点，标出「中点重合」，直观呈现「对角线互相平分」。','拖动 B 改变水平边长，拖动 D 改变邻边长度与夹角；读数条实时显示 AB/CD 与 AD/BC。'],
    idea:'平行四边形 ABCD 中，AB∥CD、AD∥BC；由此可证 △ABD≌△CDB，得 AB=CD、AD=BC，再得对角相等；对角线 AC、BD 交于点 O 且 AO=CO、BO=DO。',
    proof:[
      '性质：连接对角线 AC。因 AB∥CD、AD∥BC，得 ∠BAC=∠DCA、∠BCA=∠DAC，又 AC 公共，故 △ABC≌△CDA（ASA）。',
      '由全等得 AB=CD、BC=AD；再由两组内错角相等相加，得 ∠A=∠C、∠B=∠D，且邻角互补（∠A+∠B=180°）。',
      '再连另一条对角线 BD，同理可证对角线互相平分：设交点为 O，则 AO=CO、BO=DO。',
      '判定（常用四条）：①两组对边分别平行；②两组对边分别相等；③一组对边平行且相等；④对角线互相平分。满足任一即可判定为平行四边形。'
    ],
    formula:'AB = CD，AD = BC，∠A=∠C、∠B=∠D，AO=CO、BO=DO',
    example:[
      '例1：▱ABCD 中，AB=5，BC=3，求周长。由对边相等得 CD=5、AD=3，周长 = 2(5+3) = 16。',
      '例2：▱ABCD 中 ∠A=65°，求 ∠B、∠C。邻角互补得 ∠B=115°，对角相等得 ∠C=65°。',
      '例3：▱ABCD 的对角线交于 O，若 AO=4，则 AC=8（对角线互相平分）。'
    ],
    mistakes:[
      '把「一组对边平行、另一组对边相等」误当作判定条件——反例是等腰梯形，必须强调「一组对边平行且相等」或「两组分别」。',
      '认为对角线「相等」也是一般平行四边形的性质——只有矩形、正方形才对角线相等。',
      '误以为邻角相等；实际是邻角互补、对角相等。'
    ],
    tips:['拖动 B 改变 AB，拖动 D 改变 AD 与夹角','观察读数中 AB=CD、AD=BC 恒成立','对角线交点处的小圆点表示互相平分'],
    legend:[{c:C.blue,t:'平行四边形 ABCD'},{c:C.orange,t:'对角线 / 中点'}],
    hint:'对边相等、对角相等、对角线互相平分',
    interaction:'拖动顶点 B、D 或用滑块改变边长与夹角，观察三组性质恒成立。',
    yUp:true,
    controls:[
      {type:'range',key:'a',label:'AB 长',min:90,max:260,step:1,digits:0},
      {type:'range',key:'b',label:'AD 长',min:90,max:190,step:1,digits:0},
      {type:'range',key:'ang',label:'∠A 度数 °',min:25,max:155,step:1,digits:0}
    ],
    init:function(b,s){s.a=190;s.b=130;s.ang=62;},
    draw:function(b,s){
      var A=P(-170,-80);
      var B=add(A,{x:s.a,y:0});
      var D=add(A,{x:s.b*Math.cos(s.ang*D2R),y:s.b*Math.sin(s.ang*D2R)});
      var Cp=add(B,{x:D.x-A.x,y:D.y-A.y});
      b.poly([A,B,Cp,D],C.blue,.10,C.blue,2.6);
      b.line(A,Cp,C.orange,1.7,'5 4'); b.line(B,D,C.orange,1.7,'5 4');
      var O1=mid(A,Cp),O2=mid(B,D);
      b.circle(O1,4.5,C.orange,'#fff',1.6);
      [['A',A],['B',B],['C',Cp],['D',D]].forEach(function(t){tag(b,t[1],t[0],C.blue);});
      b.handle(A,'A',14);b.handle(B,'B',14);b.handle(D,'D',14);
      var ab=dist(A,B),cd=dist(Cp,D),ad=dist(A,D),bc=dist(B,Cp);
      b.readout('AB='+ab.toFixed(2)+' CD='+cd.toFixed(2)+'　AD='+ad.toFixed(2)+' BC='+bc.toFixed(2)+'　对角线中点距='+dist(O1,O2).toFixed(3));
    },
    onDrag:function(b,n,w){
      var s=b.state,A=P(-170,-80);
      if(n==='B'){s.a=Math.round(Math.max(90,Math.min(260,w.x-A.x)));}
      else if(n==='D'){
        var dx=w.x-A.x,dy=w.y-A.y;
        s.b=Math.round(Math.max(90,Math.min(190,Math.hypot(dx,dy))));
        s.ang=Math.round(Math.max(25,Math.min(155,Math.atan2(dy,dx)/D2R)));
      }
      H.refreshControls(s);
    }
  };
  R(parallelogram);

  /* ---------- 2. 特殊平行四边形 ---------- */
  var specialQuad={
    id:'quad-special',domain:'geometry',topic:'quad',level:2,
    title:'特殊平行四边形 · 矩形/菱形/正方形',
    brief:'在平行四边形上叠加特殊条件：有一个直角得矩形，有一组邻边相等得菱形，两者兼具得正方形。三者的对角线性质逐层加强。',
    scenario:['矩形：利用「对角线相等且互相平分」求对角线长或证明线段相等，如直角三角形斜边中线等于斜边一半的来源。','菱形：利用「对角线互相垂直平分、且平分一组对角」求边长、面积（½·d₁·d₂）与角。','正方形：兼具矩形与菱形全部性质，是含 90° 旋转对称的最强特殊平行四边形。'],
    figure:['蓝色四边形随「类型」按钮切换为一般平行四边形 / 矩形 / 菱形 / 正方形。','橙色虚线画两条对角线，实时显示对角线长度与它们的夹角（点积是否为 0 表示是否垂直）。','读数条标出当前类型的核心特征：矩形「对角线相等」、菱形「对角线垂直」、正方形「相等且垂直」。'],
    idea:'特殊化路径：平行四边形 +「一个直角」→ 矩形（对角线相等）；+「一组邻边相等」→ 菱形（对角线垂直且平分对角）；两者都满足 → 正方形。三者都继承平行四边形全部性质。',
    proof:[
      '矩形：平行四边形有一个角为 90°，则四角都是直角。由勾股或 SAS 可证两条对角线 AC=BD。',
      '菱形：平行四边形有一组邻边相等，则四边相等。设对角线交于 O，△AOB 与 △AOD 中 AB=AD、OB=OD、AO 公共，故全等，得 AC⊥BD，且 AO 平分 ∠A。',
      '正方形：同时满足矩形与菱形，故对角线相等、垂直、互相平分，每条对角线平分一组对角，夹角为 45°。',
      '判定链：对角线相等的平行四边形是矩形；对角线垂直的平行四边形是菱形；对角线相等且垂直的平行四边形是正方形。'
    ],
    formula:'矩形：AC=BD　菱形：AC⊥BD　正方形：AC=BD 且 AC⊥BD',
    example:[
      '例1：矩形对角线长 10，则互相平分后每段长 5（矩形对角线相等且平分）。',
      '例2：菱形两条对角线长 6 和 8，面积 = ½×6×8 = 24；边长 = √(3²+4²) = 5。',
      '例3：正方形的对角线把顶角平分成 45°，对角线与边成 45°。'
    ],
    mistakes:[
      '把「对角线相等」当成菱形性质、「对角线垂直」当成矩形性质——恰好相反。',
      '认为菱形对角线「相等」或矩形对角线「垂直」——一般不成立，只有正方形两者兼具。',
      '误用菱形面积公式 ½·d₁·d₂ 于一般平行四边形。'
    ],
    tips:['点击「类型」按钮切换矩形/菱形/正方形','观察对角线长度与垂直关系随之变化','在正方形下读数同时显示对角线相等且垂直'],
    legend:[{c:C.blue,t:'四边形'},{c:C.orange,t:'对角线'}],
    hint:'矩形对角线相等，菱形对角线垂直，正方形两者兼具',
    interaction:'切换类型按钮，拖动顶点，观察对角线的相等/垂直关系变化。',
    yUp:true,
    controls:[
      {type:'buttons',key:'mode',label:'类型',items:[
        {label:'平行四边形',onclick:function(b,s){s.mode='para';}},
        {label:'矩形',onclick:function(b,s){s.mode='rect';}},
        {label:'菱形',onclick:function(b,s){s.mode='rhombus';}},
        {label:'正方形',onclick:function(b,s){s.mode='square';}}
      ]},
      {type:'range',key:'a',label:'边长 a',min:110,max:210,step:1,digits:0},
      {type:'range',key:'b',label:'邻边 b',min:110,max:210,step:1,digits:0},
      {type:'range',key:'ang',label:'∠A °',min:30,max:150,step:1,digits:0}
    ],
    init:function(b,s){s.mode='square';s.a=170;s.b=170;s.ang=90;},
    draw:function(b,s){
      var mode=s.mode;
      var aa=s.a;
      var bb=(mode==='rhombus'||mode==='square')?s.a:s.b;
      var ang=(mode==='rect'||mode==='square')?90:s.ang;
      var A=P(-aa/2,-bb*Math.sin(ang*D2R)/2-30);
      var B=add(A,{x:aa,y:0});
      var D=add(A,{x:bb*Math.cos(ang*D2R),y:bb*Math.sin(ang*D2R)});
      var Cp=add(B,{x:D.x-A.x,y:D.y-A.y});
      b.poly([A,B,Cp,D],C.blue,.10,C.blue,2.8);
      b.line(A,Cp,C.orange,1.9,'6 4'); b.line(B,D,C.orange,1.9,'6 4');
      [['A',A],['B',B],['C',Cp],['D',D]].forEach(function(t){tag(b,t[1],t[0],C.blue);});
      var ac=dist(A,Cp),bd=dist(B,D);
      var v1={x:Cp.x-A.x,y:Cp.y-A.y},v2={x:D.x-B.x,y:D.y-B.y};
      var dot=v1.x*v2.x+v1.y*v2.y;
      var names={para:'平行四边形',rect:'矩形',rhombus:'菱形',square:'正方形'};
      var feat={para:'一般平行四边形',rect:'对角线相等',rhombus:'对角线垂直',square:'对角线相等且垂直'}[mode];
      b.text(P(0,-250),'【'+names[mode]+'】'+feat,C.purple,13,'middle',700);
      b.readout('['+names[mode]+'] AC='+ac.toFixed(2)+' BD='+bd.toFixed(2)+' 对角线点积='+dot.toFixed(3)+'（'+feat+'）');
    }
  };
  R(specialQuad);
})();
