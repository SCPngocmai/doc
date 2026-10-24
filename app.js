(function(){
  if(window.NodeList && !NodeList.prototype.forEach){NodeList.prototype.forEach=Array.prototype.forEach;}
  var tabs=document.getElementById('tabs'), panels=document.getElementById('panels'), search=document.getElementById('search'), progress=document.getElementById('progress'), empty=document.getElementById('empty'), root=document.documentElement, active='';
  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function content(q){
    if(q.contentHtml) return q.contentHtml;
    var out='';
    [['Transcript',q.transcript],['Pinyin',q.pinyin],['Dịch nghĩa',q.translation],['Từ vựng',q.vocabulary],['Phân tích đáp án',q.analysis]].forEach(function(pair){
      if(!pair[1] || (Array.isArray(pair[1])&&!pair[1].length)) return;
      out+='<section class="content-section"><h3>'+esc(pair[0])+'</h3>';
      if(pair[0]==='Từ vựng'&&Array.isArray(pair[1])){out+='<ul>'+pair[1].map(function(v){return '<li><strong>'+esc(v.word)+'</strong>'+(v.pinyin?' ('+esc(v.pinyin)+')':'')+' — '+esc(v.meaning)+'</li>';}).join('')+'</ul>';}
      else out+='<p>'+esc(pair[1])+'</p>';
      out+='</section>';
    });
    return out || '<p class="empty-content">Chưa điền nội dung. Có thể thêm transcript, pinyin, bản dịch, từ vựng và phân tích vào data.js.</p>';
  }
  function render(){
    var out='';
    window.HSK_EXAMS.forEach(function(exam,idx){
      var id='panel'+exam.id;
      tabs.innerHTML+='';
      var b=document.createElement('button');b.type='button';b.setAttribute('data-target',id);b.textContent=exam.title+' · '+exam.questions.length+' mục';b.className=idx===0?'active':'';tabs.appendChild(b);
      out+='<section class="panel '+(idx===0?'active':'')+'" id="'+id+'"><div class="shared-note">'+esc(exam.title.toUpperCase())+' · '+exam.questions.length+' mục</div><section class="questions">';
      exam.questions.forEach(function(q){var n=('0'+q.number).slice(-2);out+='<details class="question" id="e'+exam.id+'-q'+q.number+'"><summary><span class="number">'+n+'</span><span class="question-title">'+esc(q.title||('Câu '+q.number))+'</span><span class="chevron" aria-hidden="true">＋</span></summary><div class="answer">'+content(q)+'</div></details>';});
      out+='</section></section>';
    });
    panels.innerHTML=out; active='panel'+window.HSK_EXAMS[0].id;
    tabs.addEventListener('click',function(e){var b=e.target;while(b&&b!==tabs&&b.tagName!=='BUTTON'){b=b.parentNode;}if(!b||b===tabs)return;active=b.getAttribute('data-target');document.querySelectorAll('.panel').forEach(function(p){p.className='panel'+(p.id===active?' active':'');});tabs.querySelectorAll('button').forEach(function(x){x.className=x===b?'active':'';});search.value='';update();});
    document.addEventListener('toggle',function(e){if(e.target&&e.target.classList.contains('question'))update();},true);
    search.addEventListener('input',update);
    document.getElementById('openAll').onclick=function(){allBoxes().forEach(function(b){if(b.style.display!=='none')b.open=true;});update();};
    document.getElementById('closeAll').onclick=function(){document.querySelectorAll('.question').forEach(function(b){b.open=false;});update();};
    document.getElementById('fontUp').onclick=function(){root.style.fontSize=Math.min(25,(parseFloat(getComputedStyle(root).fontSize)||18)+1)+'px';};
    document.getElementById('fontDown').onclick=function(){root.style.fontSize=Math.max(15,(parseFloat(getComputedStyle(root).fontSize)||18)-1)+'px';}; update();
  }
  function allBoxes(){return document.querySelectorAll('.panel.active .question');}
  function update(){var boxes=allBoxes(),visible=0,opened=0,term=search.value.toLowerCase();boxes.forEach(function(b){var match=!term||b.textContent.toLowerCase().indexOf(term)!==-1;b.style.display=match?'':'none';if(match){visible++;if(b.open)opened++;}});progress.textContent=visible+' mục hiển thị · '+opened+' mục đang mở';empty.style.display=visible?'none':'block';}
  render();
})();