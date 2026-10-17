# 부산에서 달리기 · 세 가지 코스

- 수영강: https://codingspecialist.github.io/busan-running-map/ (좌표 계산 약 4.01km)
- 시민공원: https://codingspecialist.github.io/busan-running-map/park/ (편집 동선, 약 1.10km)
- 다대포: https://codingspecialist.github.io/busan-running-map/sea/ (편집 동선, 약 1.29km)

실제 OpenStreetMap 벡터 지도와 등록된 보행로를 따라 만든 왕복 경로 재생 샘플. 실측 GPS 기록이나 현장 답사로 검증한 내비게이션은 아닙니다. 지도에 등록된 길이라도 현재 통행 가능 여부는 현장 확인이 필요합니다.

수영강은 공식 A코스의 경유 순서를 참고했으며 강변 출발점은 공식 야외무대 집결점과 다릅니다. 다대포는 공원 내 짧은 별도 편집 동선으로, 공식 A코스 4km를 재현하지 않고 홍티1교까지 이어지지 않습니다. 시민공원도 공식 지정 코스가 아닙니다.

## 출처
- https://runbusancrew.com/course.html
- https://citizenparkmap.bisco.or.kr/
- OSM ways: 수영강 667277398, 825680591, 825680590, 667277397 / 시민공원 450356573 / 다대포 1515284518
- 원본 OSM API 범위: 시민공원 129.046,35.161,129.066,35.176 / 다대포 128.950,35.040,128.975,35.073 / 수영강 129.113,35.166,129.131,35.192
- 확인일 2026-10-18.

지도 및 경로 좌표 © OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright). basemap.geojson, route.json, GPX는 OSM 파생 데이터이며 ODbL로 제공합니다. 해안 수면 채색은 OSM 해안선에 화면 밖 경계를 연결한 표시용 다각형입니다. 지도 좌표의 정확도를 보증하지 않습니다.
Leaflet 1.9.4 BSD-2-Clause: vendor/LEAFLET-LICENSE.txt

외부 지도 타일/API 키 없이 동작합니다. 위치는 브라우저에서만 처리하며 서버에 전송·저장하지 않습니다. 각 경로의 QR은 해당 코스의 공개 주소로 연결됩니다.
