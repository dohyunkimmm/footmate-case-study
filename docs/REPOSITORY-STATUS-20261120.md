# FootMate `main` 목록·문서 정합성 점검 (2026-11-20)

## 점검 기준과 현재 목록

- 점검 원본: [`main` `acfc7c0a`](https://github.com/dohyunkimmm/footmate-case-study/commit/acfc7c0a1ee8a060ede1c6e59b4a2deb2545d613). GitHub 재귀 트리는 `truncated=false`였습니다.
- 점검 직전 **파일 116개·디렉터리 15개**, 루트 파일 7개·최상위 폴더 5개. 이 문서 1개를 추가하는 동기화 변경이 반영되면 **파일 117개·디렉터리 15개**가 됩니다.
- 동기화 후 파일 분포: `.github/` 4, `docs/` 12, `qa/` 16, `src/` 75, `tests/` 3, 루트 7.
- 원본 트리에서 **동일 Git blob SHA 파일 0쌍**. 즉시 삭제해도 안전한 임시·중복 파일은 **확정되지 않았습니다**. 루트 진입점·설정, 보고서 본문·증빙, 사용 중인 미리보기, PPTX/XLSX와 QA 생성기는 보존합니다.
- 점검 시 열린 PR **0건**, 원격 브랜치는 **`main` 1개**입니다. 2026-11-17의 114개 파일 수는 당시 스냅샷으로 보존합니다.

## 최근 반영 내용

- 2026-11-18~19 `main`에는 손익분기와 예상 예약의 구분, 5개년 성장 전략의 연도·공급처 단위 정리, 접기/펼치기 상태·표 가독성, 본문 09의 8주 실증·중단·확대 재심사 기준 및 데스크톱 밀도 조정이 반영됐습니다.
- 현재 보고서 본문 9개 섹션과 발표자료 구성(사업성 9장, 5개년 전략 6장, 별도 사업 전략 6장)을 구분합니다. 수치·의사결정 게이트는 실제 매출·승인·계약 성과가 아니라 **검증해야 하는 사업 가정**입니다.
- 코드·화면의 기준은 [`index.html`](../index.html), [`src/case-study/nine-sections.js`](../src/case-study/nine-sections.js), [사업 전략 슬라이드 원문](../src/case-study/strategy-brief-data.js)입니다. [기존 전략 사례 문서](IT-STRATEGY-CASE-STUDY.md)는 2026-11-02 기준 분석 스냅샷이며, 후속 UI 변경의 완전한 변경 이력은 아닙니다.

## 검사와 보류 범위

- 최신 점검 원본 커밋의 [FootMate Case Study QA #44494670082](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/44494670082)는 **성공**했습니다(2026-11-19 UTC). 앞선 일부 `main` QA 실패는 역사적 실행으로 남아 있습니다.
- **이번 문서 동기화 변경 자체의 PR 검사 결과와 Cloudflare 운영 배포가 최신 커밋과 일치하는지는 별도 확인**이 필요합니다. PR 성공을 운영 배포 성공으로 표시하지 않습니다.
- 외부 서비스 저장소 [`footmate`](https://github.com/dohyunkimmm/footmate)는 이번 저장소 클렌징 범위 밖입니다. 미검증 파일 삭제, 바이너리 재생성, 경영 수치·계산식 변경은 수행하지 않습니다.
