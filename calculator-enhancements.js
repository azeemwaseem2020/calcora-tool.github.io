/* Calcora calculator QA + advanced outputs. Loaded by comments.js on calculator pages. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const num=id=>Number($(id)?.value);
  const money=n=>Number(n).toLocaleString('en-PK',{minimumFractionDigits:2,maximumFractionDigits:2});
  const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  const addStyle=()=>{if($('calcora-enhance-style'))return;const s=document.createElement('style');s.id='calcora-enhance-style';s.textContent='.calcora-advanced{margin-top:22px;padding-top:18px;border-top:1px solid #e2e9ef}.calcora-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:.9rem}.calcora-table th,.calcora-table td{padding:9px 7px;border-bottom:1px solid #e5ebf0;text-align:right}.calcora-table th:first-child,.calcora-table td:first-child{text-align:left}.calcora-note{font-size:.88rem;color:#66758a}.calcora-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.calcora-grid label{display:block;font-weight:700}.calcora-grid input{width:100%;padding:10px;border:1px solid #cfdbe6;border-radius:9px}@media(max-width:650px){.calcora-grid{grid-template-columns:1fr}.calcora-table{font-size:.78rem}}';document.head.appendChild(s)};
  const section=(title,html)=>`<section class="calcora-advanced"><h3>${title}</h3>${html}</section>`;
  addStyle();

  function enhanceLoan(){
    if(!$('amount')||!$('years')||!$('rate')||!$('calculate'))return;
    const result=$('result');
    const render=()=>{
      const A=num('amount'),D=num('down'),R=num('rate')/1200,Y=num('years'),F=num('fees');
      if(![A,D,R,Y,F].every(Number.isFinite)||A<=0||D<0||D>=A||R<0||Y<=0||F<0)return;
      const P=A-D,N=Math.max(1,Math.round(Y*12));
      const e=R===0?P/N:P*R*Math.pow(1+R,N)/(Math.pow(1+R,N)-1);
      let bal=P,totalInterest=0,rows='';
      for(let m=1;m<=N;m++){
        const interest=R===0?0:bal*R; const principal=Math.min(e-interest,bal); const payment=principal+interest; bal=Math.max(0,bal-principal); totalInterest+=interest;
        if(m===1||m===N||m%12===0){rows+=`<tr><td>${m}</td><td>${money(payment)}</td><td>${money(principal)}</td><td>${money(interest)}</td><td>${money(bal)}</td></tr>`}
      }
      result.insertAdjacentHTML('beforeend',section('Amortization snapshot',`<p class="calcora-note">Monthly reducing-balance estimate. The table shows the first payment, each year-end and the final payment.</p><div style="overflow:auto"><table class="calcora-table"><thead><tr><th>Payment</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table></div><p><strong>Calculated schedule interest:</strong> PKR ${money(totalInterest)}. Actual lender schedules may differ because of rounding, fees, insurance, taxes, variable rates or different day-count rules.</p>`));
    };
    $('calculate').addEventListener('click',()=>setTimeout(render,0));
    setTimeout(render,0);
  }

  function enhanceCompound(){
    if(!$('p')||!$('c')||!$('r')||!$('t')||!$('n')||!$('calculate'))return;
    const out=$('out');
    const render=()=>{
      const P=num('p'),C=num('c'),R=num('r')/100,T=num('t'),N=num('n');
      if(![P,C,R,T,N].every(Number.isFinite)||P<0||C<0||R<0||T<0||N<1)return;
      const years=Math.max(1,Math.ceil(T)), rows=[]; let balance=P, contributions=P;
      for(let y=1;y<=years;y++){
        const periods=Math.min(N,Math.max(0,Math.round((T-(y-1))*N)));
        if(periods<=0)break;
        for(let j=0;j<periods;j++){balance*=1+R/N;balance+=C;contributions+=C;}
        rows.push(`<tr><td>${y}</td><td>${money(contributions)}</td><td>${money(balance)}</td><td>${money(balance-contributions)}</td></tr>`);
      }
      const eff=(Math.pow(1+R/N,N)-1)*100;
      out.insertAdjacentHTML('beforeend',section('Year-by-year projection',`<p class="calcora-note">End-of-period contributions are used, matching this calculator's stated assumption. The final partial year, if any, is included proportionally by compounding periods.</p><div style="overflow:auto"><table class="calcora-table"><thead><tr><th>Year</th><th>Total contributed</th><th>Balance</th><th>Estimated growth</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p><strong>Effective annual rate at ${N} compounding periods:</strong> ${eff.toFixed(3)}% (mathematical equivalent, before tax, fees and inflation).</p>`));
    };
    $('calculate').addEventListener('click',()=>setTimeout(render,0));
    setTimeout(render,0);
  }

  function enhancePSX(){
    if(!$('buy')||!$('sell')||!$('shares')||!$('cost')||!$('calculate'))return;
    const card=$('calculate').closest('.calculator-card');
    if(!card)return;
    let tax=$('divtax');
    if(!tax){const label=document.createElement('label');label.setAttribute('for','divtax');label.textContent='Optional dividend withholding (%)';tax=document.createElement('input');tax.id='divtax';tax.type='number';tax.min='0';tax.max='100';tax.step='.1';tax.value='0';tax.inputMode='decimal';card.insertBefore(tax,$('divcalc'));card.insertBefore(label,tax);}
    const out=$('out'),divout=$('divout');
    const calc=()=>{const b=num('buy'),s=num('sell'),q=num('shares'),c=num('cost');if(![b,s,q,c].every(Number.isFinite)||b<=0||s<0||q<=0||c<0){out.innerHTML='<p role="alert">Please enter valid price, share and cost values.</p>';return}const invested=b*q,value=s*q,gross=value-invested,net=gross-c,ret=gross/invested*100,be=(invested+c)/q;out.innerHTML=`<h2>Estimated result</h2><p><strong>Invested amount:</strong> PKR ${money(invested)}</p><p><strong>Current / sell value:</strong> PKR ${money(value)}</p><p><strong>Gross profit/loss:</strong> PKR ${money(gross)}</p><p><strong>Estimated net profit/loss:</strong> PKR ${money(net)}</p><p><strong>Return:</strong> ${ret.toFixed(2)}%</p><p><strong>Break-even price:</strong> PKR ${money(be)}</p>`};
    const dividend=()=>{const d=num('dps'),q=num('shares'),p=num('sell'),tx=num('divtax');if(![d,q,p,tx].every(Number.isFinite)||d<0||q<=0||p<=0||tx<0||tx>100){divout.innerHTML='<p role="alert">Enter valid dividend, share count, price and tax values.</p>';return}const gross=d*q,withheld=gross*tx/100,net=gross-withheld,y=d/p*100;divout.innerHTML=`<h2>Dividend estimate</h2><p><strong>Gross dividend income:</strong> PKR ${money(gross)}</p><p><strong>Estimated withholding:</strong> PKR ${money(withheld)}</p><p><strong>Estimated dividend after entered withholding:</strong> PKR ${money(net)}</p><p><strong>Dividend yield at entered price:</strong> ${y.toFixed(2)}%</p><p class="calcora-note">The tax field is optional and not a statement of the rate applicable to every investor. Verify the current tax treatment for your circumstances.</p>`};
    $('calculate').addEventListener('click',calc);$('divcalc').addEventListener('click',dividend);calc();dividend();
  }

  function enhanceTMR(){
    if(!$('batch')||!$('animals')||!$('feed')||!$('calculate'))return;
    const out=$('out');
    const render=()=>{const B=num('batch'),A=num('animals'),F=num('feed');if(![B,A,F].every(Number.isFinite)||B<=0||A<=0||F<=0)return;const dm=[...document.querySelectorAll('.dm')].map(x=>Number(x.value)||0),ps=[...document.querySelectorAll('.pct')].map(x=>Number(x.value)||0),prices=[...document.querySelectorAll('.price')].map(x=>Number(x.value)||0);const total=ps.reduce((a,b)=>a+b,0),daily=A*F;let cost=0,dmkg=0;ps.forEach((pct,i)=>{const kg=B*pct/100;cost+=kg*prices[i];if(dm[i]>0)dmkg+=kg*dm[i]/100});if(total>100.05)return;out.insertAdjacentHTML('beforeend',section('Farm planning summary',`<div class="calcora-grid"><p><strong>Daily group feed:</strong><br>${daily.toFixed(2)} kg as-fed</p><p><strong>Feed per animal:</strong><br>${F.toFixed(2)} kg/day</p><p><strong>Batch coverage:</strong><br>${(B/daily).toFixed(2)} days</p><p><strong>Cost per animal/day:</strong><br>${cost>0?'Rs '+money(cost/(B/daily)/A):'Enter ingredient prices'}</p>${dmkg>0?`<p><strong>Batch dry matter:</strong><br>${dmkg.toFixed(2)} kg</p>`:''}</div>`));};
    $('calculate').addEventListener('click',()=>setTimeout(render,0));
  }

  function enhanceFertilizer(){
    if(!$('area')||!$('unit')||!$('rate')||!$('bag')||!$('calculate'))return;
    const out=$('out');
    const render=()=>{const A=num('area'),R=num('rate'),B=num('bag'),C=num('price')||0;if(![A,R,B,C].every(Number.isFinite)||A<=0||R<0||B<=0||C<0)return;const total=A*R,bags=total/B,whole=Math.ceil(bags),unit=$('unit').value==='ha'?'hectares':'acres';out.insertAdjacentHTML('beforeend',section('Purchase planning',`<p><strong>Area used:</strong> ${A} ${unit} at ${R.toFixed(2)} kg/${$('unit').value}</p><p><strong>Exact bag equivalent:</strong> ${bags.toFixed(2)} bags</p><p><strong>Whole bags to purchase:</strong> ${whole}</p>${C>0?`<p><strong>Whole-bag purchase cost:</strong> PKR ${money(whole*C)}</p>`:''}<p class="calcora-note">The calculator converts a known application rate; it does not recommend a crop-specific fertilizer rate.</p>`));};
    $('calculate').addEventListener('click',()=>setTimeout(render,0));
  }

  function enhanceSolar(){
    if(!$('units')||!$('sun')||!$('eff')||!$('panel')||!$('backup')||!$('calculate'))return;
    const out=$('out'),loadOut=$('loadOut');
    const compute=(daily,totalLoad)=>{const S=num('sun'),E=num('eff')/100,P=num('panel'),R=num('roof'),B=num('backup'),BL=num('backupLoad'),D=num('dod')/100,V=num('voltage'),I=num('inv')/100;if(![daily,S,E,P,R,B,BL,D,V,I].every(Number.isFinite)||daily<0||S<=0||E<=0||E>1||P<=0||R<=0||B<0||BL<0||D<=0||D>1||V<=0||I<=0||I>1)return null;const pv=daily/(S*E),pc=Math.max(0,Math.ceil(pv*1000/P)),actual=pc*P/1000,inverter=totalLoad>0?totalLoad/1000/I:0,battery=B>0?(BL/1000*B/D):0,ah=B>0?battery*1000/V:0;return {pv,pc,actual,inverter,battery,ah,area:pc*R}};
    const render=()=>{const r=compute(num('units')/30,num('backupLoad'));if(!r)return;out.insertAdjacentHTML('beforeend',section('Design checks',`<div class="calcora-grid"><p><strong>Panel nameplate after rounding:</strong><br>${r.actual.toFixed(2)} kW</p><p><strong>Estimated panel area:</strong><br>${r.area.toFixed(1)} m²</p><p><strong>Calculated continuous inverter load:</strong><br>${r.inverter.toFixed(2)} kW before surge/design margin</p><p><strong>Battery nominal estimate:</strong><br>${r.battery.toFixed(2)} kWh${r.battery>0?` / ${r.ah.toFixed(0)} Ah at ${num('voltage')} V`:''}</p></div><p class="calcora-note">Inverter and battery selection must also consider surge load, PV input limits, battery chemistry, temperature, wiring, code requirements and manufacturer specifications.</p>`));};
    $('calculate').addEventListener('click',()=>setTimeout(render,0));
    const cl=$('calcLoad');if(cl)cl.addEventListener('click',()=>setTimeout(()=>{if(!loadOut)return;const r=compute(num('units')/30,num('backupLoad'));if(r)loadOut.insertAdjacentHTML('beforeend',section('Load-model checks',`<p><strong>PV size from appliance-derived monthly use:</strong> ${r.pv.toFixed(2)} kW</p><p><strong>Rounded panel array:</strong> ${r.pc} × ${num('panel')} W = ${r.actual.toFixed(2)} kW</p>`));},0));
  }

  enhanceLoan();enhanceCompound();enhancePSX();enhanceSolar();enhanceTMR();enhanceFertilizer();
})();