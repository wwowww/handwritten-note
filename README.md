# ✏️ PDF Handwritten note Web App

> PDF 위에 필기를 하고, 저장/다운로드할 수 있는 웹 애플리케이션입니다.

> - 데일리 작업 일지: https://kwoneunjee.notion.site/1e0b6a7ed2da809eb1e1d2b52d0960d0
> - demo: https://handwritten-note.vercel.app/

데일리 일지 링크를 통해 작업에 대한 상세 내역 확인이 가능합니다. 
데모를 통해 배포된 사이트 확인이 가능합니다. 

## 👩‍💻 설치 및 실행 방법

```bash
# 프로젝트 클론
git clone https://github.com/wwowww/handwritten-note.git

# 의존성 설치
pnpm install

# 로컬 서버 실행
pnpm dev
```


## 📋 프로젝트 개요

이 프로젝트는 PDF 파일을 불러와서
그 위에 사용자가 자유롭게 필기(드로잉) 할 수 있도록 지원하는 웹앱입니다.

- 필기 후 저장 및 필기 내용 undo/redo, 전체삭제, 다운로드 가능
- 페이지 이동 가능 (PDF의 경우)
- 확대/축소, 미니맵, 자동 직선 그리기 같은 추가 기능도 계획 중입니다.

~~초기에는 PDF 기반으로 진행했으나, 렌더링 충돌 이슈로 현재는 PNG 이미지를 기본 파일로 사용하고 있습니다.~~ `→ PDF로 수정 완료`

## 🚀 주요 기능

 | 기능 | 설명  | 
 |----|------|
|파일 불러오기 | 사용자 업로드 파일 또는 기본 PDF 로딩|
|펜 선택 가능| 볼펜, 형광펜 중 선택하여 필기 가능 |
|필기 저장 및 다운로드 | 배경+필기된 결과를 하나의 PDF 파일로 다운로드 가능 |
|페이지 이동 | 여러개의 페이지가 있는 PDF의 경우 페이지 전환 가능|
|디폴트 파일 자동 로드 | 사용자가 파일을 올리지 않아도 기본 템플릿 PDF를 자동 표시|

## 🛠️ 기술 스택

- React
- Vite
- TypeScript
- Zustand (상태 관리)
- pdfjs-dist (※ PDF 렌더링용)
- Canvas API (HTML5)

## 📂 폴더 구조

```bash
src/
├── components/
│   ├── CanvasRenderer.tsx  # 메인 캔버스 컴포넌트
│   ├── DownloadButton.tsx   # 다운로드 버튼
│   ├── PageControls.tsx     # 페이지 이동 버튼
│
├── hooks/
│   ├── useCanvasRenderer.ts # 파일 렌더링 로직
│   ├── useDrawing.ts         # 필기 기능 구현
│
├── stores/
│   ├── useNoteStore.ts       # 파일 상태 관리
│   ├── usePdfStore.ts        # 페이지 번호 관리
│   ├── useDrawingStore.ts    # 현재 페이지 상태 관리
```

## 📌 구현 상세
구현 상세는 [데일리 작업 일지](https://kwoneunjee.notion.site/1e0b6a7ed2da809eb1e1d2b52d0960d0)를 확인해주세요.

### 디폴트 이미지 자동 로드
- 앱이 초기화되면 `/public/newspaper-template.pdf`를 fetch하여 File로 변환 후 저장합니다.
- 저장된 파일은 캔버스에 자동 렌더링됩니다.
- 파일이 없다면 오류 없이 디폴트 pdf가 항상 표시되도록 설계되었습니다.
### PDF 렌더링 이슈
- [x] PDF 파일 렌더링 시 Cannot use the same canvas during multiple render() operations. 오류가 발생했습니다.
- [x] 안정성과 간편성을 위해 기본 파일 포맷을 PNG 이미지로 변경했습니다.
- 4/29: 기본 파일 포멧을 PDF로 변경 완료했습니다.


---


## 🗣️ 회고

예전에 강의를 들으며 간단한 그림판을 만들어본 경험은 있었지만, PDF나 이미지 위에 직접 작업을 하는 기능을 구현하는 것은 이번이 처음이었다.
처음에는 쉽게 생각했지만,
- PDF 렌더링
- canvas 레이어 분리
- 필기 데이터 저장 및 병합
같은 작업들이 생각보다 훨씬 까다롭고 복잡했다.

특히, PDF 파일을 다룰 때 렌더링 충돌 에러(Cannot use the same canvas during multiple render() operations.)가 발생해 여러 번 삽질하면서 문제를 해결하거나 방향을 수정해야 했다.
결국 안정성을 위해 PNG 이미지 포맷으로 기본 파일을 교체하고, 그 위에 필기를 하는 구조로 전환하면서 안정적인 결과를 얻을 수 있었다. `→ 4/29 pdf로 수정 완료`

아직 기능이 부족하고, 수정해야할 사항이 많지만 이번 프로젝트를 통해 Canvas 조작과 파일 처리 흐름에 대한 이해가 깊어졌고, Canvas를 사용하면서 에러 상황을 해결하면서 많이 배운 시간이였다!
