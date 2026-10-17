# 부산에서 달리기 · 수영강 지도 샘플

https://codingspecialist.github.io/busan-running-map/

실제 OpenStreetMap 벡터 지도와 연속된 보행 가능 길의 좌표로 만든 경로 재생 샘플입니다. 외부 지도 타일/API 키 없이 동작하며 Leaflet 1.9.4를 포함합니다.

- 공식 참고 코스: https://runbusancrew.com/course.html (APEC 나루공원 A코스, 안내 4km)
- 좌표 계산 왕복: 약 4.01km. 공원 강변 보행로 출발이며 공식 야외무대 집결점과 다릅니다.
- OSM ways: 667277398, 825680591, 825680590, 667277397. 연결점 동일 여부 확인. foot=no인 공원 자전거 전용 길 제외.
- 반환: 과정교 남쪽 강변의 OSM 경로 선분 위 지점. 같은 길 역순 복귀.
- 확인일: 2026-10-18. 실측 GPX/현장 답사/현재 통행 상태 미검증. 실제 턴바이턴 내비게이션이 아닙니다.
- 재생, 일시정지, 구간 이동, 속도, 지도 따라가기, GPX 다운로드, QR, 일회성 현재 위치 표시.
- 위치는 브라우저에서만 처리하며 서버로 전송하거나 저장하지 않습니다.

## 데이터 출처 및 라이선스

지도 및 경로 좌표 © OpenStreetMap contributors, ODbL 1.0: https://www.openstreetmap.org/copyright

basemap.geojson과 route.json/GPX는 OSM 파생 데이터이며 ODbL로 제공합니다. 원본 조회: https://api.openstreetmap.org/api/0.6/map?bbox=129.113,35.166,129.131,35.192

Leaflet BSD-2-Clause: vendor/LEAFLET-LICENSE.txt

로컬 확인: 이 폴더에서 `python -m http.server 8765` 후 http://localhost:8765/ 접속.
