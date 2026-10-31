(function(){
  var KEY='cookie-consent';
  var GA_ID='G-XXXXXXXXXX'; // placeholder, set the real Measurement ID when GA is added
  function loadAnalytics(){
    // Hook: runs only after Accept. GA is not loaded yet.
    // To enable later, inject https://www.googletagmanager.com/gtag/js?id=GA_ID here.
    window.__analyticsReady=GA_ID;
  }
  window.loadAnalytics=loadAnalytics;
  function get(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function set(v){try{localStorage.setItem(KEY,v)}catch(e){}}
  var el;
  function build(){
    el=document.createElement('div');el.id='cc';el.setAttribute('role','dialog');el.setAttribute('aria-label','Cookie consent');el.hidden=true;
    el.innerHTML='<p>We may use cookies for anonymous, aggregate usage stats. See our <a href="/privacy">Privacy Policy</a>.</p><div class="b"><button type="button" class="no">Decline</button><button type="button" class="ok">Accept</button></div>';
    el.querySelector('.ok').onclick=function(){set('accepted');el.hidden=true;loadAnalytics()};
    el.querySelector('.no').onclick=function(){set('declined');el.hidden=true};
    document.body.appendChild(el);
  }
  window.openCookieSettings=function(){el.hidden=false;el.querySelector('.ok').focus()};
  function init(){
    build();
    var c=get();
    if(c==='accepted')loadAnalytics();else if(c!=='declined')el.hidden=false;
    var s=document.getElementById('cookie-settings');if(s)s.onclick=window.openCookieSettings;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
