(function(){
'use strict';

function init(){
  var section=document.getElementById('calculator-list');
  if(!section)return;

  var cards=Array.prototype.slice.call(section.querySelectorAll('.calculator-card'));
  if(!cards.length)return;

  var input=document.getElementById('calculatorSearch');
  var searchButton=document.getElementById('calculatorSearchButton');
  var count=document.getElementById('calculatorSearchCount');
  var noResults=section.querySelector('.calculator-no-results');

  if(!input)return;

  /* Search is intentionally client-side so the calculator library works on GitHub Pages. */
  var aliases={
    emi:'loan installment monthly payment finance',
    loan:'emi installment monthly payment markup borrowing',
    tax:'salary income fbr pakistan finance',
    salary:'tax income pakistan',
    zakat:'islamic charity nisab assets',
    psx:'stock shares profit dividend capital gain portfolio',
    stock:'psx shares profit dividend',
    shares:'psx stock portfolio',
    solar:'sun energy load system size electricity',
    electricity:'solar energy load',
    fertilizer:'npk urea dap mop potash agriculture',
    npk:'fertilizer nitrogen phosphorus potassium',
    tmr:'feed ration livestock cattle buffalo agriculture',
    feed:'tmr ration livestock cattle',
    force:'physics mass acceleration newton',
    velocity:'physics speed displacement time',
    acceleration:'physics velocity time',
    kinetic:'energy physics mass velocity',
    density:'mass volume measurement science',
    math:'percentage ratio equation quadratic average probability geometry'
  };

  function normalize(value){
    return String(value||'').toLowerCase().replace(/[^a-z0-9\s]+/g,' ').replace(/\s+/g,' ').trim();
  }

  function search(){
    var raw=normalize(input.value);
    var terms=raw?raw.split(' '):[];
    var aliasTerms=aliases[raw]?normalize(aliases[raw]).split(' '):[];
    var shown=0;

    cards.forEach(function(card){
      var title=normalize((card.querySelector('h2')||{}).textContent);
      var keywords=normalize(card.getAttribute('data-keywords'));
      var body=normalize(card.textContent);
      var haystack=(title+' '+keywords+' '+body).trim();

      var match=!terms.length;
      if(terms.length){
        match=terms.every(function(term){
          return haystack.indexOf(term)!==-1;
        });
        if(!match && aliasTerms.length){
          match=aliasTerms.some(function(term){return haystack.indexOf(term)!==-1;});
        }
      }

      card.hidden=!match;
      if(match)shown++;
    });

    if(count){
      count.textContent=raw
        ? shown+' calculator'+(shown===1?'':'s')+' found'
        : shown+' calculators available';
    }

    if(noResults)noResults.hidden=shown!==0;

    if(searchButton)searchButton.setAttribute('aria-label',raw?'Search for '+input.value:'Search calculators');
  }

  if(searchButton){
    searchButton.addEventListener('click',function(){
      search();
      var firstVisible=cards.find(function(card){return !card.hidden;});
      if(firstVisible && normalize(input.value)){
        firstVisible.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
    });
  }

  input.addEventListener('input',search);
  input.addEventListener('keydown',function(event){
    if(event.key==='Enter'){
      event.preventDefault();
      if(searchButton)searchButton.click();
      else search();
    }
    if(event.key==='Escape'){
      input.value='';
      search();
      input.focus();
    }
  });

  var params=new URLSearchParams(window.location.search);
  if(params.get('q'))input.value=params.get('q');

  search();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}
})();