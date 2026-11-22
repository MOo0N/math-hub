/* ============ MathHub 应用层：路由 / 导航 / 状态 ============ */
(function(){
  'use strict';
  var M=window.MathHub;
  var models=M.models;

  /* ---------- 领域与主题元数据 ---------- */
  var DOMAINS=[
    {id:'algebra',name:'数与代数',color:'#2563eb',desc:'从数轴到函数，让抽象的代数关系看得见、拖得动。'},
    {id:'geometry',name:'图形与几何',color:'#7c3aed',desc:'平移旋转、全等相似、圆与最值，图形在指尖变化中显露出规律。'},
    {id:'stats',name:'统计与概率',color:'#ea580c',desc:'用大数模拟和动态图表，把随机与数据的直觉建立起来。'},
    {id:'practice',name:'综合与实践',color:'#059669',desc:'经典几何模型与真实测量场景，连接课堂与生活中的数学。'}
  ];
  var TOPICS={
    algebra:[
      {id:'number',name:'数与式'},{id:'equation',name:'方程与不等式'},{id:'function',name:'函数'}
    ],
    geometry:[
      {id:'transform',name:'图形变换'},{id:'triangle',name:'三角形'},
      {id:'congruence',name:'全等模型'},{id:'similarity',name:'相似模型'},{id:'angle',name:'导角模型'},
      {id:'quad',name:'四边形'},{id:'circle',name:'圆'},{id:'extremum',name:'几何最值专题'}
    ],
    stats:[
      {id:'statistics',name:'统计'},{id:'probability',name:'概率'}
    ],
    practice:[
      {id:'geomodel',name:'几何模型'},{id:'application',name:'实践应用'}
    ]
  };
  var LEVEL_NAME={1:'基础',2:'进阶',3:'压轴'};

  /* ---------- 本地状态 ---------- */
  var store={
    get:function(k,d){try{var v=localStorage.getItem('mathhub_'+k);return v?JSON.parse(v):d;}catch(e){return d;}},
    set:function(k,v){try{localStorage.setItem('mathhub_'+k,JSON.stringify(v));}catch(e){}}
  };
  var favs=store.get('favs',{});
  var done=store.get('done',{});
  var theme=store.get('theme','light');

  /* ---------- 路由 ---------- */
  function parseHash(){
    var h=(location.hash||'#/').replace(/^#\/?/,'');
    var parts=h.split('/').filter(Boolean);
    return {view:parts[0]||'home',a:parts[1],b:parts[2]};
  }
  function go(hash){location.hash=hash;}

  /* ---------- 工具 ---------- */
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function modelsOf(domain,topic){
    var arr=[];
    for(var id in models){var m=models[id];
      if(domain&&m.domain!==domain)continue;
      if(topic&&m.topic!==topic)continue;
      arr.push(m);
    }
    return arr;
  }
  function domainOf(id){for(var i=0;i<DOMAINS.length;i++)if(DOMAINS[i].id===id)return DOMAINS[i];return null;}
  function topicName(d,t){var ts=TOPICS[d]||[];for(var i=0;i<ts.length;i++)if(ts[i].id===t)return ts[i].name;return t;}

  /* ---------- 顶栏 ---------- */
  function renderTop(){
    var searchVal=document.getElementById('mh-q')?document.getElementById('mh-q').value:'';
    document.getElementById('mh-app').innerHTML=
      '<header class="mh-top"><div class="mh-top-in">'+
        '<div class="mh-brand" id="mh-home-btn">'+
          '<div class="mh-logo">M</div>'+
          '<div class="mh-brand-txt"><b>数学互动实验室</b><span>初中数学 · 交互模型课件库</span></div>'+
        '</div>'+
        '<div class="mh-search-wrap">'+
          '<div class="mh-search"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>'+
          '<input id="mh-q" type="search" placeholder="搜索模型，如：勾股、二次函数、阿氏圆…" value="'+esc(searchVal)+'" aria-label="搜索模型"></div>'+
          '<div id="mh-sr" class="mh-search-results" hidden></div>'+
        '</div>'+
        '<button class="mh-iconbtn" id="mh-theme-btn" title="切换深浅色">'+(theme==='dark'?'☀ 浅色':'◐ 深色')+'</button>'+
      '</div></header>'+
      '<main class="mh-main" id="mh-view"></main>'+
      '<footer class="mh-footer">数学互动实验室 · 初中数学交互模型课件库　|　让每一个数学规律都看得见</footer>';

    document.getElementById('mh-home-btn').onclick=function(){go('#/');};
    document.getElementById('mh-theme-btn').onclick=function(){
      theme=theme==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-mh-theme',theme);
      store.set('theme',theme);renderTop();route();
    };
    var q=document.getElementById('mh-q');
    q.oninput=function(){doSearch(q.value);};
    q.onkeydown=function(e){if(e.key==='Enter'){doSearch(q.value);}};
    document.addEventListener('click',function(e){
      if(!e.target.closest('.mh-search-wrap')){
        var sr=document.getElementById('mh-sr');if(sr)sr.hidden=true;
      }
    });
  }

  function doSearch(v){
    var sr=document.getElementById('mh-sr');
    if(!sr)return;
    v=(v||'').trim();
    if(!v){sr.hidden=true;return;}
    var hits=[];var lv=v.toLowerCase();
    for(var id in models){var m=models[id];
      var hay=(m.title+' '+m.brief+' '+m.topic+' '+topicName(m.domain,m.topic)+' '+(m.keys||'')).toLowerCase();
      if(hay.indexOf(lv)>=0)hits.push(m);
    }
    if(!hits.length){sr.innerHTML='<div class="mh-sr-item"><span>没有匹配的模型</span></div>';sr.hidden=false;return;}
    sr.innerHTML=hits.slice(0,12).map(function(m){
      return '<div class="mh-sr-item" data-id="'+m.id+'"><b>'+esc(m.title)+'</b><span>'+
        esc(domainOf(m.domain).name)+' · '+esc(topicName(m.domain,m.topic))+'</span></div>';
    }).join('');
    sr.hidden=false;
    Array.prototype.forEach.call(sr.querySelectorAll('.mh-sr-item'),function(el){
      el.onclick=function(){sr.hidden=true;go('#/m/'+el.getAttribute('data-id'));};
    });
  }

  /* ---------- 首页 ---------- */
  function renderHome(){
    var total=0;for(var k in models)total++;
    var domCount=DOMAINS.length,topicCount=0;
    for(var d in TOPICS)topicCount+=TOPICS[d].length;
    var favCount=0;for(var f in favs)if(favs[f])favCount++;
    var html='<div class="mh-hero">'+
      '<h1>初中数学 · 互动模型实验室</h1>'+
      '<p>把课本里的定理、公式和最值模型变成可以亲手拖动、调节、播放的实验。从概念到证明，让抽象数学变得直观可见。支持滚轮缩放、拖动平移、参数调节与动画播放。</p>'+
      '<div class="mh-hero-stats">'+
        '<div><b>'+total+'</b><span>互动模型</span></div>'+
        '<div><b>'+domCount+'</b><span>知识领域</span></div>'+
        '<div><b>'+topicCount+'</b><span>主题单元</span></div>'+
        '<div><b>'+favCount+'</b><span>我的收藏</span></div>'+
      '</div></div>';

    // 收藏区
    var favModels=[];for(var id in favs)if(favs[id]&&models[id])favModels.push(models[id]);
    if(favModels.length){
      html+='<div class="mh-section-title"><i></i>我的收藏</div><div class="mh-cards">'+
        favModels.map(cardHTML).join('')+'</div>';
    }

    html+='<div class="mh-section-title"><i></i>四大知识领域</div><div class="mh-domains">'+
      DOMAINS.map(function(d){
        var ms=modelsOf(d.id);
        var doneN=ms.filter(function(m){return done[m.id];}).length;
        return '<div class="mh-domain" data-d="'+d.id+'" style="--dc:'+d.color+'">'+
          '<h3>'+d.name+'</h3><p>'+d.desc+'</p>'+
          '<div class="mh-dom-meta">'+
            '<div><b>'+ms.length+'</b>模型</div>'+
            '<div><b>'+TOPICS[d.id].length+'</b>主题</div>'+
            '<div><b>'+doneN+'</b>已学</div>'+
          '</div></div>';
      }).join('')+'</div>';
    document.getElementById('mh-view').innerHTML=html;
    Array.prototype.forEach.call(document.querySelectorAll('.mh-domain'),function(el){
      el.onclick=function(){go('#/d/'+el.getAttribute('data-d'));};
    });
    bindCards();
  }

  function cardHTML(m){
    return '<div class="mh-card'+(done[m.id]?' done':'')+'" data-id="'+m.id+'">'+
      '<span class="mh-level mh-level-'+m.level+'">'+LEVEL_NAME[m.level]+'</span>'+
      '<h4>'+esc(m.title)+'</h4><p>'+esc(m.brief)+'</p>'+
      '<button class="mh-fav'+(favs[m.id]?' on':'')+'" data-fav="'+m.id+'" title="收藏">'+(favs[m.id]?'★':'☆')+'</button>'+
      '</div>';
  }
  function bindCards(){
    Array.prototype.forEach.call(document.querySelectorAll('.mh-card'),function(el){
      var id=el.getAttribute('data-id');
      el.onclick=function(e){
        if(e.target.getAttribute('data-fav'))return;
        go('#/m/'+id);
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll('.mh-fav'),function(b){
      b.onclick=function(e){
        e.stopPropagation();
        var id=b.getAttribute('data-fav');
        favs[id]=!favs[id];store.set('favs',favs);
        b.textContent=favs[id]?'★':'☆';b.classList.toggle('on',favs[id]);
      };
    });
  }

  /* ---------- 领域页 ---------- */
  function renderDomain(did){
    var d=domainOf(did);
    if(!d){go('#/');return;}
    var html=crumb([['首页','#/'],[d.name,null]])+
      '<div class="mh-hero" style="padding:22px 28px;border-top-color:'+d.color+'">'+
      '<h1 style="font-size:23px">'+d.name+'</h1><p>'+d.desc+'</p></div>';
    TOPICS[did].forEach(function(t){
      var ms=modelsOf(did,t.id);
      if(!ms.length)return;
      html+='<div class="mh-topic"><h3>'+t.name+' <small>'+ms.length+' 个模型</small></h3>'+
        '<div class="mh-cards">'+ms.map(cardHTML).join('')+'</div></div>';
    });
    document.getElementById('mh-view').innerHTML=html;
    bindCards();bindCrumb();
  }

  /* ---------- 模型工作台 ---------- */
  var currentBoard=null;
  // 是否具备可播放内容：自定义 step 或存在可调 range 控件
  function isPlayable(m){
    if(typeof m.step==='function')return true;
    var cs=m.controls||[];
    for(var i=0;i<cs.length;i++){
      if(cs[i].type==='range'&&typeof cs[i].min==='number'&&typeof cs[i].max==='number')return true;
    }
    return false;
  }
  function renderModel(id){
    var m=models[id];
    if(!m){go('#/');return;}
    var d=domainOf(m.domain);
    var playable=isPlayable(m);
    var html=crumb([['首页','#/'],[d.name,'#/d/'+d.id],[topicName(m.domain,m.topic),'#/d/'+d.id],[m.title,null]])+
      '<div class="mh-work">'+
        '<aside class="mh-panel mh-side" id="mh-side">'+
          '<h3>调节与操作</h3><p class="mh-side-sub">'+(m.hint||'拖动点、调节参数，观察规律')+'</p>'+
          '<div id="mh-controls"></div>'+
          '<div class="mh-side-divider"></div>'+
          '<div class="mh-btnrow">'+
            (playable?'<button class="mh-mini" id="mh-play">▶ 播放</button>':'')+
            '<button class="mh-mini" id="mh-reset">↺ 重置</button>'+
          '</div>'+
          '<div class="mh-btnrow">'+
            '<button class="mh-mini" id="mh-zin">＋ 放大</button>'+
            '<button class="mh-mini" id="mh-zout">－ 缩小</button>'+
            '<button class="mh-mini" id="mh-zfit">适配</button>'+
          '</div>'+
          '<div class="mh-side-divider"></div>'+
          '<label class="mh-check"><input type="checkbox" id="mh-done"'+(done[m.id]?' checked':'')+'><span>标记为已学</span></label>'+
        '</aside>'+
        '<section>'+
          '<div class="mh-panel mh-stage">'+
            '<div class="mh-stage-head">'+
              '<div class="mh-legend">'+(m.legend||[]).map(function(l){
                return '<span><i style="border-color:'+l.c+'"></i>'+l.t+'</span>';
              }).join('')+'</div>'+
              '<div class="mh-zoom">'+
                '<button id="mh-lock" class="mh-lock" aria-pressed="false" title="锁定画布：禁止拖动与缩放">🔓 解锁</button>'+
                '<button id="mh-zo">－</button><span class="zlevel" data-mh-z="mh-svg">100%</span><button id="mh-zi">＋</button>'+
              '</div>'+
            '</div>'+
            '<svg id="mh-svg" class="mh-canvas" viewBox="0 0 '+(m.W||900)+' '+(m.H||600)+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(m.title)+'互动演示"></svg>'+
            '<div class="mh-readout-wrap"><div id="mh-readout" aria-live="polite">准备就绪</div></div>'+
            '<div class="mh-hint">'+(m.interaction||'滚轮缩放，拖动图形空白处平移；拖动关键点观察变化。')+'</div>'+
          '</div>'+
          '<div class="mh-panel mh-notes" id="mh-notes"></div>'+
        '</section>'+
      '</div>';
    document.getElementById('mh-view').innerHTML=html;
    bindCrumb();
    renderNotes(m);
    // 初始化引擎
    var svg=document.getElementById('mh-svg');
    currentBoard=new M.Board(svg,m);
    M.renderControls(m,currentBoard.state,currentBoard,document.getElementById('mh-controls'));
    // 播放/重置
    var playBtn=document.getElementById('mh-play');
    function updPlay(){if(!playBtn)return;playBtn.textContent=currentBoard.playing?'⏸ 暂停':'▶ 播放';playBtn.classList.toggle('on',currentBoard.playing);}
    if(playBtn)playBtn.onclick=function(){currentBoard.playing=!currentBoard.playing;updPlay();};
    document.getElementById('mh-reset').onclick=function(){
      currentBoard.resetView();
      if(m.init){currentBoard.state={};m.init(currentBoard,currentBoard.state);}
      if(m.onReset)m.onReset(currentBoard,currentBoard.state);
      currentBoard.t=0;M.refreshControls(currentBoard.state);currentBoard.draw();updPlay();
    };
    document.getElementById('mh-zi').onclick=function(){currentBoard.zoomAt(1.25);};
    document.getElementById('mh-zo').onclick=function(){currentBoard.zoomAt(0.8);};
    document.getElementById('mh-zfit').onclick=function(){currentBoard.resetView();};
    document.getElementById('mh-zin').onclick=function(){currentBoard.zoomAt(1.25);};
    document.getElementById('mh-zout').onclick=function(){currentBoard.zoomAt(0.8);};
    // 画布锁定开关（每个 Board 实例独立，互不影响）
    var lockBtn=document.getElementById('mh-lock');
    lockBtn.onclick=function(){
      var locked=currentBoard.setLocked(!currentBoard.locked);
      lockBtn.textContent=locked?'🔒 已锁定':'🔓 解锁';
      lockBtn.setAttribute('aria-pressed',locked?'true':'false');
      lockBtn.title=locked?'点击解锁，恢复拖动与缩放':'锁定画布：禁止拖动与缩放';
    };
    document.getElementById('mh-done').onchange=function(e){
      done[m.id]=e.target.checked;store.set('done',done);
    };
    // 模型可自定义初始是否播放
    if(m.autoplay){currentBoard.playing=true;updPlay();}
  }

  function renderNotes(m){
    var h='<h3>📌 一句话结论</h3><div class="mh-oneline">'+(m.idea||m.brief)+'</div>';
    if(m.proof){
      h+='<h3>🧠 思路与证明</h3>';
      if(typeof m.proof==='string')h+='<p>'+m.proof+'</p>';
      else if(Array.isArray(m.proof)){
        h+='<ol>';m.proof.forEach(function(s){h+='<li>'+s+'</li>';});h+='</ol>';
      }
    }
    if(m.formula)h+='<h3>🔢 关键公式</h3><div class="mh-formula">'+m.formula+'</div>';
    if(m.tips){
      h+='<h3>💡 操作提示</h3><ul>';
      (Array.isArray(m.tips)?m.tips:[m.tips]).forEach(function(t){h+='<li>'+t+'</li>';});
      h+='</ul>';
    }
    h+='<div style="margin-top:18px">'+
      '<span class="mh-tag">'+LEVEL_NAME[m.level]+'</span>'+
      '<span class="mh-tag">'+(m.tags||[]).join(' · ')+'</span></div>';
    document.getElementById('mh-notes').innerHTML=h;
  }

  function crumb(items){
    return '<div class="mh-crumb">'+items.map(function(it,i){
      if(!it[1])return '<span>'+esc(it[0])+'</span>';
      return '<a data-h="'+it[1]+'">'+esc(it[0])+'</a>';
    }).join('<span class="sep">›</span>')+'</div>';
  }
  function bindCrumb(){
    Array.prototype.forEach.call(document.querySelectorAll('.mh-crumb a'),function(a){
      a.onclick=function(){go(a.getAttribute('data-h'));};
    });
  }

  /* ---------- 路由分发 ---------- */
  function route(){
    var r=parseHash();
    if(r.view==='home')renderHome();
    else if(r.view==='d')renderDomain(r.a);
    else if(r.view==='m')renderModel(r.a);
    else renderHome();
    window.scrollTo(0,0);
  }

  /* ---------- 全局动画循环 ---------- */
  var last=0;
  function loop(ts){
    var dt=Math.min(.05,(ts-last)/1000||0);last=ts;
    if(currentBoard)currentBoard.step(dt);
    requestAnimationFrame(loop);
  }

  /* ---------- 启动 ---------- */
  document.documentElement.setAttribute('data-mh-theme',theme);
  renderTop();
  window.addEventListener('hashchange',route);
  route();
  requestAnimationFrame(loop);
})();
