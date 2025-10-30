// Load students.json and render across pages
async function loadData(){
  const res = await fetch('students.json');
  const data = await res.json();
  window.madrasa = data;
  const total = data.length;
  const avg = Math.round(data.reduce((s,it)=>s + (it.progress_pct||0),0)/Math.max(total,1));
  const sponsors = [...new Set(data.map(d=>d.sponsor).filter(Boolean))];
  const elTotal = document.getElementById('totalStudents');
  if(elTotal) elTotal.textContent = total;
  const elAvg = document.getElementById('avgProgress');
  if(elAvg) elAvg.textContent = avg + '%';
  const elSponsors = document.getElementById('sponsorCount');
  if(elSponsors) elSponsors.textContent = sponsors.length;
  const recent = (data.slice().sort((a,b)=> (b.progress_pct||0) - (a.progress_pct||0))).slice(0,6);
  const recentList = document.getElementById('recentList');
  if(recentList){
    recentList.innerHTML = recent.map(r=>`<div class="card"><strong>${r.name}</strong> — ${r.place} <div class="label">Progress: ${r.progress_pct}%</div></div>`).join('');
  }
  if(document.getElementById('studentsTable')){
    renderStudentsTable(data);
    populateSponsorFilter(sponsors);
    attachStudentControls();
  }
  if(document.getElementById('sponsorsList')){
    renderSponsors(sponsors, data);
  }
  animateProgressBars();
}
function renderStudentsTable(data){
  const tbody = document.querySelector('#studentsTable tbody');
  tbody.innerHTML = data.map(s=>`
    <tr class="${s.gender==='F'?'girl-row':''}">
      <td>${s.name}</td>
      <td>${s.father}</td>
      <td>${s.place}</td>
      <td>${s.para||0}</td>
      <td>
        <div class="progress-bar"><div class="progress-fill" style="width:${s.progress_pct||0}%">${s.progress_pct||0}%</div></div>
      </td>
      <td>${s.sponsor}</td>
    </tr>
  `).join('');
}
function populateSponsorFilter(sponsors){
  const sel = document.getElementById('filterSponsor');
  if(!sel) return;
  sel.innerHTML = '<option value="">All Sponsors</option>' + sponsors.map(s=>`<option value="${s}">${s}</option>`).join('');
}
function attachStudentControls(){
  const search = document.getElementById('search');
  const sel = document.getElementById('filterSponsor');
  const gender = document.getElementById('filterGender');
  [search, sel, gender].forEach(el=> el && el.addEventListener('input', ()=>{
    filterStudents();
  }));
}
function filterStudents(){
  const q = (document.getElementById('search')?.value||'').toLowerCase();
  const sponsor = (document.getElementById('filterSponsor')?.value||'');
  const gender = (document.getElementById('filterGender')?.value||'');
  const rows = madrasa.slice().filter(s=>{
    if(sponsor && s.sponsor !== sponsor) return false;
    if(gender && s.gender !== gender) return false;
    if(q){
      const hay = (s.name + ' ' + s.father + ' ' + s.place + ' ' + (s.sponsor||'')).toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
  renderStudentsTable(rows);
  animateProgressBars();
}
function renderSponsors(sponsors, data){
  const container = document.getElementById('sponsorsList');
  const groups = {};
  data.forEach(s => { const k = s.sponsor || 'Unknown'; (groups[k] = groups[k]||[]).push(s); });
  container.innerHTML = Object.keys(groups).sort().map(k=>{
    const arr = groups[k];
    const avg = Math.round(arr.reduce((a,b)=>a+(b.progress_pct||0),0)/arr.length);
    return `<div class="card"><h3>${k} <small class="label">${arr.length} student(s) — avg ${avg}%</small></h3>
      <div>${arr.map(st=>`<div style="display:flex;justify-content:space-between;padding:6px 0"><div>${st.name} — ${st.place}</div><div>${st.progress_pct||0}%</div></div>`).join('')}</div></div>`;
  }).join('');
}
function animateProgressBars(){
  document.querySelectorAll('.progress-fill').forEach((el,idx)=>{
    const w = el.style.width;
    el.style.width = '0%';
    setTimeout(()=> el.style.width = w, 100 + idx*40);
  });
}
window.addEventListener('DOMContentLoaded', loadData);
