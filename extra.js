/* Hello greeting + light/dark switch */
const _render=render;
render=function(){_render();$('gr0').textContent='Hello! 👋'};
document.querySelectorAll('.tg').forEach(b=>{b.onclick=()=>{S.theme=document.documentElement.hasAttribute('data-d')?'light':'dark';save();theme();render()}});
render();
