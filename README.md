# FootMate | 사업성 분석·경영계획

풋살 매칭 플랫폼 FootMate의 신사업 사업성 검토, 수익구조 분석, 5개년 경영계획 및 투자 판단을 정리한 별도 보고서 저장소입니다.

**주요 링크:** [보고서 보기](https://footmate-case-study.fmate.workers.dev/) · [FootMate 서비스 데모](https://footmate.fmate.workers.dev/demo) · [서비스 소스 저장소](https://github.com/dohyunkimmm/footmate)

## 저장소 구성

| 위치 | 역할 |
| --- | --- |
| [`index.html`](index.html) · [`favicon.svg`](favicon.svg) | 보고서 진입점과 파비콘 |
| [`src/case-study/`](src/case-study/) | 9개 보고서 섹션, 보조 페이지, 근거 화면, 발표자료·재무 모델 및 미리보기 |
| [`src/shared/`](src/shared/) | 공용 디자인·글꼴 스타일 |
| [`docs/`](docs/) | [분석 근거](docs/IT-STRATEGY-CASE-STUDY.md), [디자인 기준](docs/DESIGN-SYSTEM.md), [발표자료 15장 검토 기록](docs/PRESENTATION-SPACING-REVIEW-20261111.md) |
| [`qa/`](qa/) | 원본 산출물 재생성·수치 대조·발표자료 가독성 검사 도구 |
| [`tests/e2e/`](tests/e2e/) | 보고서 UI·반응형·접근성 회귀 검사 |
| [`.github/workflows/`](.github/workflows/) · [`.github/scripts/`](.github/scripts/) | 보고서 QA·수동 디자인 동기화·병합 브랜치 보존 및 생성 파일 PR 게시 스크립트 |
| [`.assetsignore`](.assetsignore) | 내부 검증·문서 파일을 정적 사이트 배포에서 제외 |

### 2026-11-14 `main` 폴더 점검 · 문서 동기화

- GitHub [`main` `3fd1085`](https://github.com/dohyunkimmm/footmate-case-study/commit/3fd1085e598232540ecea6a890f719e9c1f4b38f)의 잘리지 않은 재귀 트리에서 **파일 95개·디렉터리 15개**(루트 파일 6개·최상위 폴더 5개)를 확인했습니다. 아래의 11월 11일 **78개/80개 파일**은 해당 시점의 초기·정리 후 예상 스냅샷이며 현재 합계가 아닙니다.

| 최상위 경로 | 파일 수 | 관리 범위 |
| --- | ---: | --- |
| `.github/` | 4 | QA·디자인 동기화·브랜치 보존 자동화 |
| `docs/` | 3 | 분석·디자인·발표자료 검토 문서 |
| `qa/` | 12 | 생성·검증 스크립트 |
| `src/` | 68 | 본문·공용 스타일·이미지·PPTX·XLSX·미리보기 |
| `tests/` | 2 | 보고서 브라우저 회귀 및 테스트 서버 |
| 루트 파일 | 6 | 웹 진입점·패키지·설정 |
| **합계** | **95** | **디렉터리 15개** |

- [PR #19~#25](https://github.com/dohyunkimmm/footmate-case-study/pulls?q=is%3Apr+is%3Amerged+sort%3Aupdated-desc)의 본문·투자 판단·계산기·발표자료 및 문구·타이포그래피 개선이 `main`에 반영됐습니다. 해당 [FootMate Case Study QA #43238202984](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/43238202984)는 **SUCCESS**입니다. 이 결과는 운영 배포·실제 사업 가정 검증을 뜻하지 않습니다.
- 점검 당시 열린 PR **0건**, 원격 브랜치 **`main` 1개**였습니다. 최신 QA 원인 추적 [이슈 #41](https://github.com/dohyunkimmm/footmate-case-study/issues/41)은 2026-11-14에 새로 등록했으므로 현재 이슈는 1건입니다. Git blob SHA가 같은 중복 파일 **0건**, 명백한 임시 확장자 파일 **0건**으로 확인됐으며 **안전하게 삭제 확정된 경로는 없습니다**. 보존 태그·과거 PR 브랜치 정리 기록은 유지합니다.
- 최신 [`main` 보고서 QA #43365812313](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/43365812313)는 **26개 통과·20개 실패**입니다. 과거 성공 기록이 최신 성공을 뜻하지 않습니다. 화면/테스트 선택자·문구 불일치와 2px 테이블 폭 문제 등이 포함되어 [이슈 #41](https://github.com/dohyunkimmm/footmate-case-study/issues/41)에서 재검증합니다. 문제 해결 전까지 최신 `main` 품질 검사 성공으로 표시하지 않습니다.
- 본편 9장·전략 6장 편집 가능한 PPTX, 모델 XLSX, 보고서 9개 섹션을 유지합니다. `src/case-study/previews/report/decision-*.jpg` 9개와 `previews/strategy/decision-*.jpg` 6개는 현행 뷰어에서 참조되며, 기존 `report-previews.js` 및 전략 `slide-*.jpg`도 남아 있습니다. 외형상 유사하다는 이유만으로 자산을 삭제하지 않습니다.
- 메인 목록·관련 디자인 문서만 수정합니다. 보고서 본문·사업 수치·원본 PPTX/XLSX·이미지·QA·배포 경로는 변경하지 않습니다. 문서 PR 자체의 QA는 별도로 확인합니다.

### 2026-11-11 브랜치·폴더 클렌징 완료

- [정리 작업](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/43036247106) **성공**: 기존 작업 브랜치 **13개**의 PR 상태·HEAD SHA를 대조하고 `archive/20261111/reviewed/pr-*/` 보존 태그 **13개**를 모두 생성·확인한 뒤 브랜치 참조만 삭제했습니다. 정리 직후 원격 브랜치는 `main` **1개**입니다.
- [PR #15](https://github.com/dohyunkimmm/footmate-case-study/pull/15)에서 병합 후 자동 태그 보존·브랜치 정리 워크플로를 도입했고, [PR #14](https://github.com/dohyunkimmm/footmate-case-study/pull/14)에서 수동 PPT 재생성을 검토용 PR 게시로 전환했습니다. 실제 병합된 PR #14·#15·#16·#17의 브랜치도 자동 보존·정리 작업 성공을 확인했습니다.
- 완료된 **일회성** `.github/workflows/retire-legacy-branches-20261111.yml`은 이 정리 PR에서 제거하며, **상시** `.github/workflows/archive-merged-pr-branches.yml`은 유지합니다.
- 정리 후 예상 재귀 트리는 **파일 80개·디렉터리 14개**(루트 파일 6개·최상위 폴더 5개)입니다. 기존 `qa/` 원본 생성 도구, 근거 이미지, PPTX/XLSX 및 15장 미리보기는 삭제하지 않습니다. 원본 사업 가정·수치·계산식 및 공개 경로도 유지합니다.

### `main` 현황 · 2026-11-11 초기 점검 스냅샷

- 기준 커밋: [`0c0d61d`](https://github.com/dohyunkimmm/footmate-case-study/commit/0c0d61d0cda1ddd32b126b0a798cb3c1f9ce4c32). 재귀 트리 **파일 78개·디렉터리 13개**(루트 파일 6개·최상위 폴더 5개). 파일의 Git blob SHA 기준 동일 내용 중복 **0건**.
- 보고서 본문 **9개 섹션**, 편집 가능한 발표자료 **사업성 9장 + 전략 6장**, XLSX 모델 1개. 본편 미리보기 9장은 [`report-previews.js`](src/case-study/report-previews.js)에 포함되고, 전략 미리보기 JPG 6장은 [`src/case-study/previews/strategy/`](src/case-study/previews/strategy/)에 있습니다. 원본 PPTX·계산식·기존 다운로드 경로는 유지합니다.
- [PR #11](https://github.com/dohyunkimmm/footmate-case-study/pull/11)의 15장 여백·띄어쓰기 점검과 [PR #12](https://github.com/dohyunkimmm/footmate-case-study/pull/12)의 3장 가독성 개선이 `main`에 병합됐습니다. [PR #7](https://github.com/dohyunkimmm/footmate-case-study/pull/7)은 중복 변경으로 미병합 종료됐습니다. 점검 시 열린 PR **0건**입니다.
- [PR #12의 보고서 QA](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/43015563896)는 성공했습니다. 이는 PR 검사 결과이며 **최신 `main` 자체의 새 실행 또는 운영 배포 검증을 뜻하지 않습니다**.

### 폴더·브랜치 클렌징 검토

- `main`에 즉시 삭제할 것으로 검증된 파일은 없습니다. `qa/`의 재생성 스크립트와 `src/case-study/`의 증빙·다운로드·미리보기는 사용·보존 필요성을 확인하기 전 삭제하지 않습니다.
- 최초 점검 당시 `main` 외 작업 브랜치 **12개**가 남아 있었고, 문서 정리 PR까지 포함해 총 13개를 검증·태그 보존 후 삭제했습니다. squash 병합의 커밋 차이를 미반영으로 취급하지 않았으며, 상세 실행과 현재 상태는 위 **클렌징 완료** 기록을 따릅니다.
- 수동 `FootMate Design Sync`는 **`main`에서만 실행**하며, 변경된 원본 PPTX·미리보기는 `automation/design-sync-*` 브랜치와 **검토용 PR**로 게시합니다. `main` 직접 푸시·자동 병합은 하지 않습니다. GitHub Actions가 PR을 생성하도록 설정에서 권한 허용이 필요하며, 봇 PR의 QA 실행은 별도 승인/재실행이 필요할 수 있습니다.

## 검증

- `npm run test:report` — 브라우저·접근성 회귀 검사
- `python qa/crosscheck-case-study-presentations.py` — 본문·발표자료 수치/용어 대조
- `python qa/polish-presentation-spacing-20261111.py --check`, `python qa/refine-three-slides-20261111.py --check` — 발표자료 점검(필요한 Python 의존성 설치 후 실행)

서비스 구현·인증·API·Beta 운영 코드는 [`footmate`](https://github.com/dohyunkimmm/footmate)에서 별도로 관리합니다.
