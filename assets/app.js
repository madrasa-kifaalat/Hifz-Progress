// shared utilities and data loader
window.escapeHTML = function(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

window.loadData = async function(){
  // loads students.json and optionally payments.json; caches on window
  if(window._dataset) return window._dataset;
  const studentsRes = await fetch('students.json');
  if(!studentsRes.ok) { window._dataset = {students:[]}; return window._dataset; }
  const students = await studentsRes.json();
  // ensure numeric fields exist
  students.forEach((s,i)=>{ s.id = s.id || (i+1); s.para = s.para||0; s.progress_pct = s.progress_pct||0; });
  window._dataset = { students };
  return window._dataset;
};
