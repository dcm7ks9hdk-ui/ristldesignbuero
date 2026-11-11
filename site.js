/* Pfeiltasten wechseln zwischen den vier Projekten (Nummern 1-4). */
(function(){
  var dots=[].slice.call(document.querySelectorAll('.piktos.oben a'));
  if(!dots.length)return;
  var cur=dots.findIndex(function(d){return d.hasAttribute('aria-current')});
  document.addEventListener('keydown',function(e){
    if(e.metaKey||e.ctrlKey||e.altKey||document.querySelector('.lupe'))return;
    var t=e.key==='ArrowRight'?(cur+1)%dots.length:e.key==='ArrowLeft'?(cur-1+dots.length)%dots.length:-1;
    if(t>=0)location.href=dots[t].href;
  });
})();

/* Klick auf ein Bild vergroessert es; Klick oder Esc schliesst. */
(function(){
  var offen=null;
  function zu(){if(offen){offen.remove();offen=null;document.documentElement.style.overflow='';}}
  document.addEventListener('click',function(e){
    if(offen){zu();return;}
    var a=e.target.closest&&e.target.closest('a.zoom');
    if(!a)return;
    e.preventDefault();
    offen=document.createElement('div');offen.className='lupe';
    var i=new Image();i.src=a.href;i.alt=a.querySelector('img').alt;offen.appendChild(i);
    document.body.appendChild(offen);document.documentElement.style.overflow='hidden';
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zu();});
})();
