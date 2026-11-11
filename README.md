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
| [`.github/workflows/`](.github/workflows/) | `FootMate Case Study QA` 및 수동 `FootMate Design Sync` |
| [`.assetsignore`](.assetsignore) | 내부 검증·문서 파일을 정적 사이트 배포에서 제외 |

### `main` 현황 · 2026-11-11 점검 스냅샷

- 기준 커밋: [`0c0d61d`](https://github.com/dohyunkimmm/footmate-case-study/commit/0c0d61d0cda1ddd32b126b0a798cb3c1f9ce4c32). 재귀 트리 **파일 78개·디렉터리 13개**(루트 파일 6개·최상위 폴더 5개). 파일의 Git blob SHA 기준 동일 내용 중복 **0건**.
- 보고서 본문 **9개 섹션**, 편집 가능한 발표자료 **사업성 9장 + 전략 6장**, XLSX 모델 1개. 본편 미리보기 9장은 [`report-previews.js`](src/case-study/report-previews.js)에 포함되고, 전략 미리보기 JPG 6장은 [`src/case-study/previews/strategy/`](src/case-study/previews/strategy/)에 있습니다. 원본 PPTX·계산식·기존 다운로드 경로는 유지합니다.
- [PR #11](https://github.com/dohyunkimmm/footmate-case-study/pull/11)의 15장 여백·띄어쓰기 점검과 [PR #12](https://github.com/dohyunkimmm/footmate-case-study/pull/12)의 3장 가독성 개선이 `main`에 병합됐습니다. [PR #7](https://github.com/dohyunkimmm/footmate-case-study/pull/7)은 중복 변경으로 미병합 종료됐습니다. 점검 시 열린 PR **0건**입니다.
- [PR #12의 보고서 QA](https://github.com/dohyunkimmm/footmate-case-study/actions/runs/43015563896)는 성공했습니다. 이는 PR 검사 결과이며 **최신 `main` 자체의 새 실행 또는 운영 배포 검증을 뜻하지 않습니다**.

### 폴더·브랜치 클렌징 검토

- `main`에 즉시 삭제할 것으로 검증된 파일은 없습니다. `qa/`의 재생성 스크립트와 `src/case-study/`의 증빙·다운로드·미리보기는 사용·보존 필요성을 확인하기 전 삭제하지 않습니다.
- 점검 시 `main` 외 원격 작업 브랜치 **12개**가 남아 있습니다. 일부는 squash 병합으로 `main`과 이력이 갈라져 있으므로 단순 ahead/behind 수치로 중복·삭제 가능 여부를 판단할 수 없습니다. **각 PR의 병합 상태와 브랜치 HEAD를 확인하고 원본 SHA를 보존한 후에만 정리**합니다. 이번 점검에서는 브랜치를 삭제하지 않았습니다.
- 수동 `FootMate Design Sync`는 **`main`에서만 실행**하며, 변경된 원본 PPTX·미리보기는 `automation/design-sync-*` 브랜치와 **검토용 PR**로 게시합니다. `main` 직접 푸시·자동 병합은 하지 않습니다. GitHub Actions가 PR을 생성하도록 설정에서 권한 허용이 필요하며, 봇 PR의 QA 실행은 별도 승인/재실행이 필요할 수 있습니다.

## 검증

- `npm run test:report` — 브라우저·접근성 회귀 검사
- `python qa/crosscheck-case-study-presentations.py` — 본문·발표자료 수치/용어 대조
- `python qa/polish-presentation-spacing-20261111.py --check`, `python qa/refine-three-slides-20261111.py --check` — 발표자료 점검(필요한 Python 의존성 설치 후 실행)

서비스 구현·인증·API·Beta 운영 코드는 [`footmate`](https://github.com/dohyunkimmm/footmate)에서 별도로 관리합니다.
