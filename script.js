let uv=8.5,temp=33,hum=42,sunMins=0,water=1200,goal=2500,running=false,iv=null,safe=15,urineScore=20;
function showTab(t,btn){
 document.querySelectorAll('.tab-pane').forEach(e=>e.classList.add('hidden'));
 document.getElementById('tab-'+t).classList.remove('hidden');
 document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
 if(btn) btn.classList.add('active');
}
function toggleSun(){
 running=!running;
 document.getElementById('sunBtn').innerText=running?'Stop & Go to Shade':'Start Monitoring';
 if(running){
  iv=setInterval(()=>{
   sunMins++;
   let m=Math.floor(sunMins/60), s=sunMins%60;
   document.getElementById('timerDisplay').innerText=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
   let pct=Math.min(100,sunMins/safe*100);
   document.getElementById('timerBar').style.width=pct+'%';
   document.getElementById('timerRing').style.background=`conic-gradient(#FF7A00 ${pct}%,#eee ${pct}%)`;
   document.getElementById('timerInfo').innerText=`Safe limit: ${safe} min • ${Math.max(0,safe-sunMins)} min left`;
   updateKidney();
   if(sunMins>=safe){alert('UV LIMIT EXCEEDED! Kidney & skin at risk!');toggleSun()}
  },1000);
 }else clearInterval(iv);
}
function resetTimer(){clearInterval(iv);running=false;sunMins=0;document.getElementById('timerDisplay').innerText='00:00';document.getElementById('timerBar').style.width='0%';document.getElementById('timerRing').style.background='conic-gradient(#FF7A00 0%,#eee 0%)';document.getElementById('sunBtn').innerText='Start Monitoring'}
function addWater(ml){water=Math.min(goal,water+ml);document.getElementById('waterDisplay').innerText=`${water} / ${goal} ml`;document.getElementById('waterBar').style.width=(water/goal*100)+'%';updateKidney()}
function setUrine(text,score){urineScore=score;document.querySelectorAll('.urine').forEach(b=>b.classList.remove('active'));event.target.classList.add('active');let el=document.getElementById('urineStatus');el.innerText='Status: '+text;el.className=score>60?'status':'status ok';updateKidney()}
function updateKidney(){
 let heat=temp>32?20:0, dehyd=goal-water>1000?30:0, sun=sunMins>20?20:0;
 let total=urineScore+heat+dehyd+sun; let score=Math.max(0,100-total);
 let label=score>80?'Good':score>50?'Moderate':score>30?'High Risk':'DANGER';
 document.getElementById('kidneyScore').innerText=`${score}/100 - ${label}`;document.getElementById('kidneyCircle').innerText=score;
 let alerts=document.getElementById('kidneyAlerts');let html='';
 if(water<1000) html+=`<div class='trigger' style='background:#FEF2F2;color:#991B1B'>⚠️ Low water - Kidney overworking. Drink 500ml now!</div>`;
 if(temp>33 && water<1500) html+=`<div class='trigger' style='background:#FFF7ED;color:#9A3412'>🔥 Heat stress - kidneys losing water fast</div>`;
 if(sunMins>30) html+=`<div class='trigger' style='background:#FFFBEB;color:#92400E'>☀️ Long sun - risk of acute kidney injury</div>`;
 if(html=='') html=`<div class='trigger' style='background:#ECFDF5;color:#065F46'>✓ Hydration adequate - kidneys happy</div>`;
 alerts.innerHTML=html;
}
function checkKidney(){
 let r=[];if(document.getElementById('swelling').checked) r.push('Swelling = fluid retention');
 if(document.getElementById('fatigue').checked) r.push('Fatigue + low water = kidney strain');
 if(document.getElementById('pain').checked) r.push('Back pain + dark urine = see doctor');
 if(document.getElementById('nausea').checked) r.push('Nausea may indicate toxin buildup');
 if(r.length>0) alert('Kidney Check:\n'+r.join('\n')+'\n\nAdvice: Drink >2.5L, avoid sun 12-3pm, see doctor in PH if persists');
 else alert('No major symptoms. Keep >2000ml daily!');
}
function testAir(){
 let aqi=Math.floor(50+Math.random()*80);
 document.getElementById('aqiVal').innerText=aqi;
 document.getElementById('pm25').innerText=Math.floor(aqi/3)+' µg';
 document.getElementById('pm10').innerText=Math.floor(aqi/1.5)+' µg';
 document.getElementById('o3').innerText=Math.floor(Math.random()*40)+' µg';
 let label=aqi<50?'Good':aqi<100?'Moderate':aqi<150?'Unhealthy for Sensitive':'Unhealthy';
 document.getElementById('aqiLabel').innerText=label;
 let triggers=document.getElementById('asthmaTriggers');
 triggers.innerHTML=`<div class='trigger'><span>🔥 Heat + Humidity</span><b class='${temp>32?'text-red-600':'text-green-600'}'>${temp>32?'High Risk':'Low'}</b></div><div class='trigger'><span>💨 Dust / PM10</span><b>${aqi>80?'High':'Moderate'}</b></div><div class='trigger'><span>🌡️ AQI Level</span><b>${label}</b></div>`;
 let alertBox=document.getElementById('asthmaAlert');
 if(aqi>100 || hum<35){alertBox.classList.remove('hidden');alertBox.style.background='#FEF2F2';alertBox.style.color='#991B1B';alertBox.innerHTML=`<b>🚨 DANGER FOR ASTHMA:</b> AQI ${aqi} (${label}). Humidity ${hum}%. Stay indoors, use inhaler, wear mask.`;}
 else {alertBox.classList.remove('hidden');alertBox.style.background='#ECFDF5';alertBox.style.color='#065F46';alertBox.innerHTML=`Air is okay now. But temp ${temp}°C can trigger. Stay hydrated.`;}
}
async function loadLive(){
 try{navigator.geolocation.getCurrentPosition(async p=>{
  document.getElementById('location').innerText=`📍 ${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)} • PH`;
  let key='YOUR_OPENWEATHER_API_KEY';
  if(key!=='YOUR_OPENWEATHER_API_KEY'){
   let w=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${p.coords.latitude}&lon=${p.coords.longitude}&appid=${key}&units=metric`).then(r=>r.json());
   temp=w.main.temp; hum=w.main.humidity;
   document.getElementById('tempVal').innerText=Math.round(temp)+'°';
   document.getElementById('humVal').innerText=hum+'%';
  }
 });}catch(e){}
}
loadLive();updateKidney();testAir();
