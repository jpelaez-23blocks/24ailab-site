(function(){var links=document.querySelectorAll('a[data-lb]');if(!links.length)return;
var box=document.createElement('div');box.className='lb';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Screenshot');
box.innerHTML='<button type="button" aria-label="Close">×</button><img alt=""><p></p>';document.body.appendChild(box);
var img=box.querySelector('img'),cap=box.querySelector('p'),btn=box.querySelector('button'),last=null;
function close(){box.hidden=true;img.removeAttribute('src');document.body.style.overflow='';if(last)last.focus();}
links.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();last=a;var i=a.querySelector('img');img.src=a.getAttribute('href');img.alt=i.alt;cap.textContent=a.parentNode.querySelector('figcaption').textContent;box.hidden=false;document.body.style.overflow='hidden';btn.focus();});});
btn.addEventListener('click',close);box.addEventListener('click',function(e){if(e.target===box)close();});
document.addEventListener('keydown',function(e){if(!box.hidden&&(e.key==='Escape'||e.key==='Tab')){if(e.key==='Escape')close();else e.preventDefault();}});})();
