/* ============================================================
 * MathHub Engine — 通用几何/函数交互场景引擎
 * 数据驱动：每个模型声明 {id,title,domain,topic,level,brief,idea,proof,
 *                          controls,init,draw,onPointer,...}
 * 依赖：零。ES5 兼容写法为主。
 * ============================================================ */
(function(global){
  'use strict';
  var NS='http://www.w3.org/2000/svg';
  /* 风格 A「几何手账」图形色板：低饱和暖调，与 CSS 变量同源，仍保证多图形可辨。
     红/橙/绿保留色相，故模型文案中「红色点/橙色虚线/绿色构造点」依旧准确。 */
  var COLORS={blue:'#3c6e8f',orange:'#c2703a',purple:'#9d5b7a',green:'#4f7a5b',
    red:'#b8402f',teal:'#2f7d74',slate:'#6b5c49',gray:'#a89a85'};

  /* ---------- 向量工具（暴露给模型） ---------- */
  function add(a,b){return {x:a.x+b.x,y:a.y+b.y};}
  function sub(a,b){return {x:a.x-b.x,y:a.y-b.y};}
  function mul(a,k){return {x:a.x*k,y:a.y*k};}
  function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function unit(v){var d=Math.hypot(v.x,v.y)||1;return {x:v.x/d,y:v.y/d};}
  function mid(a,b){return {x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
  function angDiff(a,b){var d=a-b;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d;}
  function lerp(a,b,t){return a+(b-a)*t;}
  function lerp2(a,b,t){return {x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)};}

  /* ---------- Board：一个 SVG 场景实例 ---------- */
  function Board(svg, model){
    this.svg=svg;
    this.model=model;
    this.W=model.W||900;
    this.H=model.H||600;
    this.yUp=model.yUp===true; // 默认屏幕坐标（y 向下）；数学坐标模型显式设 yUp:true
    this.view={x:model.viewX||0,y:model.viewY||0,w:model.W||900,h:model.H||600};
    this.baseView={x:this.view.x,y:this.view.y,w:this.view.w,h:this.view.h};
    this.state={};
    this.pan=null;
    this.drag=null;
    this.playing=false;
    this._tween=null; // 参数补间动画：按钮触发的平滑过渡（缓入缓出）
    this.locked=true; // 画布默认锁定：新建/加载即锁定，须手动解锁后才能编辑（每个 Board 实例独立）
    this.t=0;
    this.speed=1;
    this.reduced=global.matchMedia&&global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 智能播放：无 step 的模型，若有 range 控件则记录第一个用于自动扫描；否则无可动参数
    this._autoCtl=null;
    if(!model.step){
      var ctrls=model.controls||[];
      for(var ci=0;ci<ctrls.length;ci++){
        if(ctrls[ci].type==='range'&&typeof ctrls[ci].min==='number'&&typeof ctrls[ci].max==='number'){
          this._autoCtl=ctrls[ci];break;
        }
      }
    }
    this._buildLayers();
    this._bindView();
    if(model.init) model.init(this,this.state);
    this.applyView();
    this.draw();
    this.svg.classList.toggle('mh-canvas-locked',this.locked);
  }
  Board.prototype._buildLayers=function(){
    var grid=document.createElementNS(NS,'g');
    grid.setAttribute('class','mh-grid');
    var scene=document.createElementNS(NS,'g');
    this.svg.appendChild(grid);
    this.svg.appendChild(scene);
    this.grid=grid;this.scene=scene;
    var W=this.W,H=this.H,step=modelStep(this.model);
    // 网格
    var gx0=Math.floor((this.view.x-step)/step)*step;
    this.gridLines=[];
    for(var x=gx0;x<=this.view.x+this.view.w+step;x+=step){
      this.gridLines.push(this.rawLine(grid,{x:x,y:0},{x:x,y:H},'var(--mh-grid)  ',1));
    }
    for(var y=0;y<=H;y+=step){
      this.gridLines.push(this.rawLine(grid,{x:0,y:y},{x:W,y:y},'var(--mh-grid)',1));
    }
  };
  function modelStep(m){return m.grid||50;}
  Board.prototype.sy=function(y){return this.yUp?this.H-y:y;};

  /* --- 原始绘图（坐标已是屏幕系） --- */
  Board.prototype.rawLine=function(g,p,q,c,w,dash,op){
    var n=document.createElementNS(NS,'line');
    n.setAttribute('x1',p.x);n.setAttribute('y1',p.y);
    n.setAttribute('x2',q.x);n.setAttribute('y2',q.y);
    n.setAttribute('stroke',c||'var(--mh-ink)');
    n.setAttribute('stroke-width',w||2);
    if(dash)n.setAttribute('stroke-dasharray',dash);
    if(op!=null)n.setAttribute('stroke-opacity',op);
    n.setAttribute('stroke-linecap','round');
    g.appendChild(n);return n;
  };
  /* --- 绘图原语（数学坐标，yUp 自动翻转） --- */
  Board.prototype.line=function(p,q,c,w,dash,op,parent){
    return this.rawLine(parent||this.scene,{x:p.x,y:this.sy(p.y)},{x:q.x,y:this.sy(q.y)},c,w,dash,op);
  };
  Board.prototype.circle=function(c,r,stroke,fill,w,dash,op,parent){
    var n=document.createElementNS(NS,'circle');
    n.setAttribute('cx',c.x);n.setAttribute('cy',this.sy(c.y));
    n.setAttribute('r',r);
    n.setAttribute('stroke',stroke||'none');
    n.setAttribute('fill',fill||'none');
    n.setAttribute('stroke-width',w||2);
    if(dash)n.setAttribute('stroke-dasharray',dash);
    if(op!=null)n.setAttribute('stroke-opacity',op);
    (parent||this.scene).appendChild(n);return n;
  };
  Board.prototype.poly=function(pts,fill,op,stroke,w,parent){
    var n=document.createElementNS(NS,'polygon');
    n.setAttribute('points',pts.map(_.bind(function(p){return p.x+','+this.sy(p.y);},this)).join(' '));
    n.setAttribute('fill',fill||'none');
    n.setAttribute('fill-opacity',op==null?1:op);
    n.setAttribute('stroke',stroke||'none');
    n.setAttribute('stroke-width',w||1.5);
    (parent||this.scene).appendChild(n);return n;
  };
  Board.prototype.polyline=function(pts,c,w,dash,op,parent){
    var n=document.createElementNS(NS,'polyline');
    n.setAttribute('points',pts.map(_.bind(function(p){return p.x+','+this.sy(p.y);},this)).join(' '));
    n.setAttribute('fill','none');n.setAttribute('stroke',c||'var(--mh-ink)');
    n.setAttribute('stroke-width',w||2);n.setAttribute('stroke-linecap','round');
    if(dash)n.setAttribute('stroke-dasharray',dash);
    if(op!=null)n.setAttribute('stroke-opacity',op);
    (parent||this.scene).appendChild(n);return n;
  };
  Board.prototype.text=function(p,str,c,size,anchor,weight,parent){
    var n=document.createElementNS(NS,'text');
    n.setAttribute('x',p.x);n.setAttribute('y',this.sy(p.y));
    n.setAttribute('fill',c||'var(--mh-ink)');
    n.setAttribute('font-size',size||13);
    n.setAttribute('text-anchor',anchor||'start');
    n.setAttribute('font-weight',weight||500);
    n.setAttribute('font-family','-apple-system,PingFang SC,Microsoft YaHei,sans-serif');
    n.textContent=str;
    (parent||this.scene).appendChild(n);return n;
  };
  Board.prototype.arc=function(c,r,a0,a1,col,w,parent){
    var pts=[],N=24;
    for(var i=0;i<=N;i++){var a=a0+(a1-a0)*i/N;pts.push({x:c.x+r*Math.cos(a),y:c.y+r*Math.sin(a)});}
    return this.polyline(pts,col,w,null,null,parent);
  };
  /* 直角记号 */
  Board.prototype.rightAngle=function(vertex,dirA,dirB,size,c,parent){
    var u=unit(dirA),v=unit(dirB),s=size||10;
    var p1=add(vertex,mul(u,s)),corner=add(p1,mul(v,s)),p2=add(vertex,mul(v,s));
    this.polyline([p1,corner,p2],c||'var(--mh-muted)',1.6,null,null,parent);
  };
  /* 可拖拽手柄：注册命中区，绘制由模型 draw 决定 */
  Board.prototype.handle=function(p,name,r){
    this._handles=this._handles||[];
    this._handles.push({p:p,name:name,r:r||16});
  };
  /* 读数 */
  Board.prototype.readout=function(str){
    var el=document.getElementById('mh-readout');
    if(el)el.textContent=str;
  };

  /* --- 坐标变换 --- */
  Board.prototype.toWorld=function(e){
    var p=this.svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;
    var l=p.matrixTransform(this.svg.getScreenCTM().inverse());
    return {x:l.x,y:this.yUp?this.H-l.y:l.y};
  };
  Board.prototype.toView=function(e){
    var p=this.svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;
    return p.matrixTransform(this.svg.getScreenCTM().inverse());
  };
  Board.prototype.applyView=function(){
    var v=this.view;
    this.svg.setAttribute('viewBox',v.x+' '+v.y+' '+v.w+' '+v.h);
    var lbl=document.querySelector('[data-mh-z="'+this.svg.id+'"]');
    if(lbl)lbl.textContent=Math.round(this.baseView.w/v.w*100)+'%';
  };
  Board.prototype.zoomAt=function(factor,anchor){
    if(this.locked)return; // 锁定后禁止缩放
    var v=this.view,p=anchor||{x:v.x+v.w/2,y:v.y+v.h/2};
    var nw=Math.max(160,Math.min(this.W*3,v.w/factor));
    var nh=nw*(v.h/v.w);
    v.x=p.x-(p.x-v.x)*(nw/v.w);
    v.y=p.y-(p.y-v.y)*(nh/v.h);
    v.w=nw;v.h=nh;this.applyView();
  };
  Board.prototype.resetView=function(){
    if(this.locked)return; // 锁定后禁止复位视图（缩放）
    var b=this.baseView;this.view={x:b.x,y:b.y,w:b.w,h:b.h};this.applyView();
  };
  /* 画布锁定开关：锁定态禁止一切画布编辑（拖点/平移/缩放）；解锁后全部恢复。返回当前锁定态 */
  Board.prototype.setLocked=function(v){
    this.locked=!!v;
    this.drag=null;this.pan=null;
    svgCursor(this.svg,''); // 清除内联光标，交给 CSS / pointermove 动态接管
    this.svg.classList.toggle('mh-canvas-locked',this.locked);
    return this.locked;
  };
  function svgCursor(svg,c){if(svg)svg.style.cursor=c;}
  Board.prototype._bindView=function(){
    var self=this,svg=this.svg;
    svg.addEventListener('wheel',function(e){
      if(self.locked)return; // 锁定后滚轮不缩放
      e.preventDefault();
      self.zoomAt(e.deltaY<0?1.16:1/1.16,self.toView(e));
    },{passive:false});
    svg.addEventListener('pointerdown',function(e){
      if(self.locked)return; // 锁定态：禁止一切画布编辑（拖点、平移、缩放）
      // 进入交互态：阻止浏览器默认的文本选取（坐标轴数字/页面文字不再出现蓝色高亮）。
      // 仅当前可动点与画布平移响应指针，松手后在 end() 恢复正常文本选择。
      if(e.cancelable)e.preventDefault();
      document.body.classList.add('mh-dragging');
      var w=self.toWorld(e);
      var best=null,bd=1e9;
      // _handles 由最近一次 draw() 收集，随状态更新保持最新
      (self._handles||[]).forEach(function(h){
        var d=dist(w,h.p);if(d<bd){bd=d;best=h;}
      });
      if(best&&bd<(best.r||16)){
        // 节点/点位：拖动命中点
        self.drag=best.name;
        svg.setPointerCapture(e.pointerId);svg.style.cursor='grabbing';
        if(self.model.onDragStart)self.model.onDragStart(self,best.name,w);
      }else{
        // 画布空白区平移
        var p=self.toView(e);
        self.pan={base:{x:self.view.x,y:self.view.y},anchor:p};
        svg.setPointerCapture(e.pointerId);svg.style.cursor='grabbing';
      }
    });
    svg.addEventListener('pointermove',function(e){
      if(self.pan){
        var p=self.toView(e),v=self.view;
        v.x=self.pan.base.x-(p.x-self.pan.anchor.x);
        v.y=self.pan.base.y-(p.y-self.pan.anchor.y);
        self.applyView();return;
      }
      if(self.drag){
        var w=self.toWorld(e);
        if(self.model.onDrag)self.model.onDrag(self,self.drag,w);
        else if(self.state[self.drag])self.state[self.drag]=w;
        self.draw(); // 拖动后重绘：否则 state 变了但画面/读数不更新
      }
    });
    function end(e){
      self.drag=null;self.pan=null;svg.style.cursor='';
      // 松开指针：恢复正常文本选择状态
      document.body.classList.remove('mh-dragging');
      // pan 之后需重绘 README 读数不受影响
    }
    svg.addEventListener('pointerup',end);
    svg.addEventListener('pointercancel',end);
    // 指针在画布外松开时也要恢复文本选择，避免 body 残留 mh-dragging
    window.addEventListener('pointerup',function(){document.body.classList.remove('mh-dragging');});
    window.addEventListener('pointercancel',function(){document.body.classList.remove('mh-dragging');});
  };
  Board.prototype.draw=function(){
    this.scene.replaceChildren();
    this._handles=[];
    if(this.model.draw)this.model.draw(this,this.state);
    this._collected=true;
  };
  /* 缓入缓出（easeInOutCubic），供参数补间使用 */
  function easeInOut(t){return t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  /* 启动一个参数补间动画：to={key:目标值,...}，时长 dur 秒，结束时回调 onDone。
     动画逐帧更新 state 并同步滑块读数，避免瞬间跳转。 */
  Board.prototype.tweenTo=function(to,dur,onDone){
    var from={};
    for(var k in to)if(Object.prototype.hasOwnProperty.call(to,k))from[k]=this.state[k];
    this._tween={from:from,to:to,t:0,dur:dur||0.6,onDone:onDone||null};
  };
  /* 把进行中的补间立即结算到目标值并同步控件，返回是否已结算。
     供按钮在启动新动画前调用，确保基于稳定状态取反，避免连续点击取到中间值。 */
  Board.prototype.finishTween=function(){
    var tw=this._tween;
    if(!tw)return false;
    for(var k in tw.to)if(Object.prototype.hasOwnProperty.call(tw.to,k))this.state[k]=tw.to[k];
    this._tween=null;
    refreshControls(this.state);
    this.draw();
    if(tw.onDone)tw.onDone(this,this.state);
    return true;
  };
  Board.prototype.step=function(dt){
    if(this._tween){
      var tw=this._tween,s=this.state;
      tw.t+=dt;
      var p=Math.min(1,tw.t/tw.dur),e=easeInOut(p);
      for(var k in tw.to)if(Object.prototype.hasOwnProperty.call(tw.to,k))
        s[k]=tw.from[k]+(tw.to[k]-tw.from[k])*e;
      refreshControls(s); // 图像与滑块位置同步
      if(p>=1){var done=tw.onDone;this._tween=null;if(done)done(this,s);}
      this.draw();
      return; // 补间期间优先，避免与播放扫描叠加
    }
    if(this.playing){
      this.t+=dt*this.speed;
      if(this.model.step){
        this.model.step(this,this.state,dt);
      }else if(this._autoCtl){
        // 无自定义动画：让首个滑块参数在区间内往返扫描，形成自动演示
        var c=this._autoCtl,s2=this.state;
        var span=c.max-c.min;
        var tri=Math.asin(Math.sin(this.t*this.speed*1.1))*2/Math.PI; // -1..1 三角波
        s2[c.key]=c.min+span*(tri+1)/2;
        if(c.onchange)c.onchange(this,s2);
        refreshControls(s2);
      }
      this.draw();
    }
  };

  /* 让 _ 可用（精简版 bind 包装） */
  var _={bind:function(fn,ctx){return function(){return fn.apply(ctx,arguments);};}};

  /* ---------- 控件渲染 ---------- */
  function renderControls(model,state,board,host){
    host.innerHTML='';
    (model.controls||[]).forEach(function(c){
      if(c.type==='range'){
        var wrap=document.createElement('div');wrap.className='mh-ctl';
        var lab=document.createElement('div');lab.className='mh-ctl-lab';
        var name=document.createElement('span');name.textContent=c.label;
        var val=document.createElement('b');val.id='mhv-'+c.key;
        val.setAttribute('data-digits',c.digits!=null?c.digits:'');
        val.textContent=fmt(state[c.key],c.digits);
        lab.appendChild(name);lab.appendChild(val);
        var input=document.createElement('input');
        input.type='range';input.id='mhr-'+c.key;
        input.min=c.min;input.max=c.max;input.step=c.step||0.01;
        input.value=state[c.key];
        input.setAttribute('aria-label',c.label);
        input.oninput=function(){
          board._tween=null; // 用户手动操作优先，取消进行中的补间动画
          state[c.key]=parseFloat(input.value);
          val.textContent=fmt(state[c.key],c.digits);
          if(c.onchange)c.onchange(board,state);
          board.draw();
        };
        wrap.appendChild(lab);wrap.appendChild(input);host.appendChild(wrap);
      }else if(c.type==='check'){
        var l=document.createElement('label');l.className='mh-check';
        var i=document.createElement('input');i.type='checkbox';i.id='mhc-'+c.key;
        i.checked=!!state[c.key];
        i.onchange=function(){
          state[c.key]=i.checked;
          if(c.onchange)c.onchange(board,state);
          board.draw();
        };
        var s=document.createElement('span');s.textContent=c.label;
        l.appendChild(i);l.appendChild(s);host.appendChild(l);
      }else if(c.type==='buttons'){
        var g=document.createElement('div');g.className='mh-btnrow';
        c.items.forEach(function(it){
          var b=document.createElement('button');b.className='mh-mini';
          b.textContent=it.label;
          b.onclick=function(){it.onclick(board,state);board.draw();};
          g.appendChild(b);
        });
        host.appendChild(g);
      }else if(c.type==='button'){
        var btn=document.createElement('button');btn.className='mh-mini mh-wide';
        btn.id='mhb-'+c.key;btn.textContent=c.label;
        btn.onclick=function(){c.onclick(board,state);board.draw();};
        host.appendChild(btn);
      }
    });
  }
  function fmt(v,d){
    if(typeof v!=='number')return v;
    return d!=null?v.toFixed(d):(Math.abs(v%1)<1e-9?v.toString():v.toFixed(2));
  }
  function refreshControls(state){
    for(var k in state){
      var r=document.getElementById('mhr-'+k);
      if(r)r.value=state[k];
      var v=document.getElementById('mhv-'+k);
      if(v){
        var d=v.getAttribute('data-digits');
        v.textContent=fmt(state[k],d===''?null:parseInt(d,10));
      }
      var c=document.getElementById('mhc-'+k);
      if(c)c.checked=!!state[k];
    }
  }

  var MODEL_REGISTRY={};
  global.MathHub={
    Board:Board,COLORS:COLORS,renderControls:renderControls,refreshControls:refreshControls,
    V:{add:add,sub:sub,mul:mul,dist:dist,unit:unit,mid:mid,angDiff:angDiff,lerp:lerp,lerp2:lerp2},
    models:MODEL_REGISTRY,
    register:function(m){MODEL_REGISTRY[m.id]=m;}
  };
})(window);
