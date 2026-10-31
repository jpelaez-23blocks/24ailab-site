(function(){
  var b=document.querySelector('.navbtn'),n=document.getElementById('site-nav');if(!b||!n)return;
  function set(o){b.setAttribute('aria-expanded',o);b.setAttribute('aria-label',o?'Close menu':'Open menu');n.classList.toggle('open',o)}
  b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')!=='true';set(o);if(o){var a=n.querySelector('a');a&&a.focus()}});
  n.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.getAttribute('aria-expanded')==='true'){set(false);b.focus()}});
  document.addEventListener('click',function(e){if(!e.target.closest('header'))set(false)});
  matchMedia('(min-width:641px)').addEventListener('change',function(){set(false)});
})();
