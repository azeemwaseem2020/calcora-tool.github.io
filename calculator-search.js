(function(){
  'use strict';
  function init(){
    var section=document.getElementById('calculator-list');
    if(!section) return;
    var cards=Array.prototype.slice.call(section.querySelectorAll('.calculator-card'));
    if(!cards.length) return;
    var tools=document.createElement('div');
    tools.className='calculator-search-tools';
    tools.innerHTML='<label class="sr-only" for="calculator-search">Search calculators</label><input id="calculator-search" type="search" placeholder="Search calculators (e.g. EMI, PSX, solar, fertilizer)" autocomplete="off"><div class="calculator-filters" role="group" aria-label="Filter calculators"><button type="button" class="active" data-filter="all">All</button><button type="button" data-filter="Finance">Finance</button><button type="button" data-filter="PSX">PSX</button><button type="button" data-filter="Solar">Solar</button><button type="button" data-filter="Agriculture">Agriculture</button><button type="button" data-filter="Math">Math</button><button type="button" data-filter="Science">Science</button></div><p class="calculator-count" aria-live="polite"></p><p class="calculator-no-results" aria-live="polite" hidden>No matching calculator found. Try a broader term such as loan, math, science, PSX, solar or fertilizer.</p>';
    section.insertBefore(tools, section.querySelector('.grid'));
    var input=tools.querySelector('#calculator-search');
    var buttons=Array.prototype.slice.call(tools.querySelectorAll('[data-filter]'));
    var active='all';
    function render(){
      var q=(input.value||'').trim().toLowerCase();
      var shown=0;
      cards.forEach(function(card){
        var text=card.textContent.toLowerCase();
        var category=(card.getAttribute('data-category')||'').toLowerCase();
        var matchText=!q || text.indexOf(q)!==-1;
        var matchCat=active==='all' || category===active.toLowerCase();
        var visible=matchText && matchCat;
        card.hidden=!visible;
        if(visible) shown++;
      });
      section.querySelector('.calculator-count').textContent=shown+' calculator'+(shown===1?'':'s')+' shown';
      section.querySelector('.calculator-no-results').hidden=shown!==0;
    }
    input.addEventListener('input',render);
    buttons.forEach(function(btn){btn.addEventListener('click',function(){active=btn.getAttribute('data-filter');buttons.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');render();});});
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
