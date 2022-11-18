# web19-Boostart
## 개발 환경에서의 실행 방법
```
cd client
npm run dev
cd server
npm run dev
```

## 의존성
- 본인이 처음 install 할 때 `npm install` -> `dependencies` 브랜치에서 commit PR
- 다른 팀원이 install 한 라이브러리가 있을 때 `npm ci`하고 시작

## PR 규칙
  - PR 제목 : `[FE] {컴포넌트 이름} - {기능 요약}`
    - 무엇을 개발했는지, 테스트 방법 등 자세히 작성 (데모 영상, 스크린샷을 첨부해주세요)
  - FE / BE 구별
  - Merge
    - 2명 이상의 팀원이 리뷰 후 코멘트를 작성
    - merge 슬랙에 알리기
    
## 커밋 컨벤션
```
   feat : 새로운 기능추가
   fix : 버그 수정
   refactor : 리팩토링
   chore : Package Manager 설정/수정, 빌드 수정
   style : 코드 포맷, 세미콜론 등 스타일 수정 
   design : css 수정
   docs : 문서 수정/추가
   rename : 파일/폴더명 수정
```
    
## 브랜치 컨벤션
- 브랜치명 : `feature/{title}/#{issue_number}`
  - `feature/image_upload/#23`
- 기능 별로 이슈로 구별해서 올리기
   
    
## 네이밍 컨벤션
 - 변수 & 함수 = camel →  `characterImg` 
 - 상수 = snake → `USER_LOGIN_LOG`
 - html = kebab → `character-img`
 - class = Pascal → `CharacterImage`
 - 브랜치 = 소문자snake → `user_login_log`
 - styled-component = Pascal → `CharacterImage`
 - 줄임말 사용 목록 `src, img, dest`
