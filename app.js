'use strict';
(async()=>{
 const $=id=>document.getElementById(id),status=$('status');
 try{
 const [base,data]=await Promise.all(['basemap.geojson','route.json'].map(async p=>{const r=await fetch(p);if(!r.ok)throw Error(p);return r.json()}));
 const meta=data.meta;
 const route=data.coordinates.map(([lng,lat])=>[lat,lng]),cum=data.cumulativeMeters,total=cum.at(-1),turn=cum[data.turnIndex];
 const map=L.map('map',{zoomControl:false,zoomSnap:0.1,minZoom:14,maxZoom:18,maxBounds:meta.bounds,maxBoundsViscosity:.8,preferCanvas:true}).setView(meta.center,15);
 L.control.zoom({position:'bottomright'}).addTo(map);
 map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
 map.attributionControl.addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> · ODbL');
 const styles={water:{fillColor:'#d1d5d3',fillOpacity:1,color:'#bec4c2',weight:1},park:{fillColor:'#e6e6df',fillOpacity:1,color:'#d6d7cf',weight:1},building:{fillColor:'#e5e3dd',fillOpacity:.85,color:'#d9d7d1',weight:.5},road:{color:'#fff',weight:5,opacity:1},path:{color:'#b5b6ad',weight:1,opacity:.8}};
 for(const kind of ['park','water','building','road','path']) L.geoJSON(base,{filter:f=>f.properties.kind===kind,style:f=>styles[kind],interactive:false}).addTo(map);
 L.polyline(route,{color:'#fff',weight:9,opacity:1,interactive:false}).addTo(map);
 const line=L.polyline(route,{color:'#181818',weight:4,opacity:.9,interactive:false}).addTo(map);
 const passed=L.polyline([],{color:'#fff',weight:1.8,dashArray:'2 8',opacity:.95,interactive:false}).addTo(map);
 const runner=L.marker(route[0],{icon:L.divIcon({className:'',html:'<div class="runner"><span>↑</span></div>',iconSize:[28,28],iconAnchor:[14,14]}),zIndexOffset:1000,interactive:false}).addTo(map);
 function label(ll,text){L.marker(ll,{icon:L.divIcon({className:'place-label',html:text,iconSize:[120,20]}),interactive:false}).addTo(map)}
 meta.labels.forEach(([ll,text])=>label(ll,text));
 const stops={start:0,bridge:data.bridgeIndex,turn:data.turnIndex};
 for(const [key,i] of Object.entries(stops)){
  const title={start:'01 출발 · 도착',bridge:'02 중간 지점',turn:'03 반환'}[key];
  L.circleMarker(route[i],{radius:5,color:'#111',weight:2,fillColor:'#fff',fillOpacity:1}).addTo(map).bindTooltip(title,{permanent:true,direction:key==='turn'?'right':'left',offset:[key==='turn'?10:-10,0],className:'point-label'}).on('click',()=>seek(cum[i]));
 }
 const bounds=line.getBounds();
 const fit=()=>map.fitBounds(bounds,{paddingTopLeft:[65,105],paddingBottomRight:[75,90],animate:false});fit();
 let at=0,playing=false,last=null,lastCamera=0;
 function locateAt(m){let i=1;while(i<cum.length-1&&cum[i]<m)i++;const f=(m-cum[i-1])/(cum[i]-cum[i-1]||1);return {i,ll:[route[i-1][0]+f*(route[i][0]-route[i-1][0]),route[i-1][1]+f*(route[i][1]-route[i-1][1])]}}
 function render(){
  const {i,ll}=locateAt(at);runner.setLatLng(ll);passed.setLatLngs([...route.slice(0,i),ll]);
  const a=route[i-1],b=route[i];const deg=Math.atan2((b[1]-a[1])*Math.cos(ll[0]*Math.PI/180),b[0]-a[0])*180/Math.PI;
  runner.getElement().querySelector('span').style.transform=`rotate(${deg}deg)`;
  $('distance').textContent=(at/1000).toFixed(2);$('progress').value=Math.round(at/total*1000);
  $('phase').textContent=at>=total-1?'출발점에 돌아왔어요':Math.abs(at-turn)<25?meta.stops[2]+' · 여기서 돌아와요':at>turn?'돌아오는 길 · 출발점으로':at<1?'출발할 준비':'가는 길 · 반환점 방향';
  $('progress').setAttribute('aria-valuetext',`${(at/1000).toFixed(2)}킬로미터, ${$('phase').textContent}`);
 }
 function pause(){playing=false;last=null;$('play').textContent=at>=total?'↺ 다시 재생':'▶ 경로 재생';$('map-play').textContent=at>=total?'↺ 다시':'▶ 재생'}
 function seek(m){pause();at=Math.max(0,Math.min(total,m));render()}
 function tick(t){
  if(playing){if(last!==null)at=Math.min(total,at+Math.min(t-last,200)/60000*total*Number($('speed').value));last=t;render();
   if($('follow').checked&&t-lastCamera>300){map.panTo(runner.getLatLng(),{animate:false});lastCamera=t}
   if(at>=total)pause();
  }requestAnimationFrame(tick)
 }
 $('total').textContent=(total/1000).toFixed(2);$('computed').textContent=`약 ${(total/1000).toFixed(2)}km`;
 $('play').disabled=false;$('map-play').disabled=false;pause();render();requestAnimationFrame(tick);
 $('play').onclick=()=>{if(playing)return pause();if(at>=total)at=0;playing=true;last=null;$('play').textContent='Ⅱ 일시정지';$('map-play').textContent='Ⅱ 정지'};
 $('map-play').onclick=()=>$('play').click();
 $('reset').onclick=()=>{seek(0);fit();status.textContent='출발점으로 돌아왔어요. 다시 재생할 수 있어요.'};$('progress').oninput=e=>seek(Number(e.target.value)/1000*total);
 $('fit').onclick=()=>{$('follow').checked=false;fit()};$('follow').onchange=()=>{if($('follow').checked)map.setView(runner.getLatLng(),16,{animate:false})};
 map.on('dragstart',()=>{$('follow').checked=false});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 document.querySelectorAll('[data-stop]').forEach(b=>b.onclick=()=>{const i=stops[b.dataset.stop];seek(cum[i]);map.setView(route[i],16,{animate:false});status.textContent=b.querySelector('b').textContent+' 위치를 보고 있어요.'});
 let me,accuracy;
 $('locate').onclick=()=>{
  if(!navigator.geolocation){status.textContent='이 브라우저는 위치 확인을 지원하지 않아요.';return}
  status.textContent='현재 위치를 확인하고 있어요. 위치는 서버에 저장하지 않아요.';
  navigator.geolocation.getCurrentPosition(p=>{
   const ll=[p.coords.latitude,p.coords.longitude],nearest=Math.min(...route.map(pt=>map.distance(pt,ll)));
   if(nearest>10000){status.textContent='현재 위치가 코스에서 10km 이상 떨어져 있어요. 지도는 코스 위치를 유지해요.';return}
   if(me)map.removeLayer(me);if(accuracy)map.removeLayer(accuracy);
   me=L.marker(ll,{icon:L.divIcon({className:'',html:'<div class="location-dot"></div>',iconSize:[20,20],iconAnchor:[10,10]})}).addTo(map).bindPopup('현재 위치 · GPS 오차가 있을 수 있어요');
   accuracy=L.circle(ll,{radius:p.coords.accuracy,color:'#555',weight:1,fillOpacity:.06}).addTo(map);
   map.setView(ll,16,{animate:false});status.textContent=`현재 위치를 표시했어요. 위치 정확도 약 ${Math.round(p.coords.accuracy)}m · 한 번 확인한 위치이며 자동으로 갱신되지 않아요.`;
  },e=>{status.textContent=e.code===1?'위치 권한이 꺼져 있어요. 경로 재생은 계속 사용할 수 있어요.':'현재 위치를 확인하지 못했어요. 잠시 뒤 다시 눌러 주세요.'},{enableHighAccuracy:true,timeout:12000,maximumAge:10000})
 };
 $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(meta.url);$('copy').textContent='복사했어요 ✓'}catch{status.textContent='주소창의 링크를 복사해 주세요.'}};
 status.textContent='지도를 준비했어요. 재생 버튼을 눌러 길을 따라가 보세요.';
 window.sample={map,data,seek,get progress(){return at},get playing(){return playing}};
 new ResizeObserver(()=>{map.invalidateSize();if(!$('follow').checked)fit()}).observe($('map'));
 }catch(e){console.error(e);status.textContent='지도를 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요.';$('play').textContent='불러오기 실패'}
})();


