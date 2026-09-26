(function(){
'use strict';
function init(){
 var section=document.getElementById('calculator-list'); if(!section)return;
 var cards=Array.prototype.slice.call(section.querySelectorAll('.calculator-card')); if(!cards.length)return;
 var input=document.getElementById('calculatorSearch');
 if(!input){
   var tools=document.createElement('div'); tools.className='calculator-search-tools';
   tools.innerHTML='<label class="sr-only" for="calculatorSearch">Search calculators</label><input id="calculatorSearch" type="search" placeholder="Search: EMI, tax, PSX, solar, fertilizer, force..." autocomplete="off">';
   section.insertBefore(tools,section.querySelector('.grid')); input=tools.querySelector('#calculatorSearch');
 }
 var count=document.getElementById('calculatorSearchCount') || section.querySelector('.calculator-count');
 var noResults=section.querySelector('.calculator-no-results');
 var buttons=Array.prototype.slice.call(section.querySelectorAll('[data-filter]'));
 var intents=Array.prototype.slice.call(section.querySelectorAll('[data-query]'));
 var active='all';
 var aliases={emi:'loan installment monthly payment finance',loan:'emi installment monthly payment markup',tax:'salary income fbr pakistan finance',salary:'tax income pakistan',zakat:'islamic charity nisab',psx:'stock shares profit dividend capital gain portfolio',stock:'psx shares profit dividend',shares:'psx stock portfolio',solar:'sun energy load system size electricity',electricity:'solar energy load',fertilizer:'npk urea dap mop potash agriculture',npk:'fertilizer nitrogen phosphorus potassium',tmr:'feed ration livestock cattle agriculture',feed:'tmr ration livestock',force:'physics mass acceleration newton',velocity:'physics speed displacement time',acceleration:'physics velocity time',kinetic:'energy physics mass velocity',density:'mass volume measurement science',math:'percentage ratio equation quadratic average probability geometry'};
 function render(){
   var raw=(input.value||'').trim().toLowerCase(), terms=raw.split(/\\s+/).filter(Boolean), alias=aliases[raw]||'', shown=0;
   cards.forEach(function(card){
     var text=(card.textContent+' '+(card.getAttribute('data-keywords')||'')).toLowerCase(), cat=(card.getAttribute('data-category')||'').toLowerCase();
     var match=!terms.length||terms.some(function(t){return text.indexOf(t)!==-1;});
     if(!match&&alias) match=alias.split(/\\s+/).some(function(t){return text.indexOf(t)!==-1;});
     var visible=match&&(active==='all'||cat===active.toLowerCase()); card.hidden=!visible; if(visible)shown++;
   });
   if(count)count.textContent=raw?shown+' calculator'+(shown===1?'':'s')+' found':shown+' calculators available';
   if(noResults)noResults.hidden=shown!==0;
 }
 function setQuery(q){input.value=q;render();input.focus();}
 input.addEventListener('input',render);
 buttons.forEach(function(b){b.addEventListener('click',function(){active=b.getAttribute('data-filter')||'all';buttons.forEach(function(x){x.classList.remove('active');});b.classList.add('active');render();});});
 intents.forEach(function(b){b.addEventListener('click',function(){setQuery(b.getAttribute('data-query')||'');});});
 var params=new URLSearchParams(window.location.search); if(params.get('q'))input.value=params.get('q'); render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();