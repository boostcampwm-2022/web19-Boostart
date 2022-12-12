# Boostart - 당신의 하루를 시작하라

## 소개
![main](https://user-images.githubusercontent.com/92143119/206898726-0674735d-e03d-4c31-8dba-5c7fa6e405c3.gif)
### 놓치기 쉬운 하루의 일상을 예쁘게 기록하고 관리할 수 있어요
- 가까운 계획을 확인할 수 있어요
- 자신이 언제 무엇을 (+어디서 어떻게 왜) 했는지 알 수 있어요
- 친구가 언제 무엇을 (+어디서 어떻게 왜) 했는지 알 수 있어요

### 팀원 소개
|김진아|박경찬|박수연|하현우|
|:---:|:---:|:---:|:---:|
|<img src="https://user-images.githubusercontent.com/73420533/201267459-8392e1f7-ca7b-4afd-bae0-c32df21fa33a.png" width="300"/>|<img src="https://user-images.githubusercontent.com/73420533/201267890-7279a33e-e194-4f1e-b6e2-bdf3608d05b5.png" width="300"/>|<img src="https://user-images.githubusercontent.com/73420533/201267785-f60f85b2-2cbe-4e09-a7f7-dd4bf39bb0c2.png" width="300"/>|<img src="https://user-images.githubusercontent.com/73420533/201267569-f7f5a95b-62b1-4d5a-8700-0b92da29d909.png" width="300"/>|
|[@mikaniz](https://github.com/mikaniz)|[@ParkKyungChan](https://github.com/ParkKyungChan)|[@sooyeon73](https://github.com/sooyeon73)|[@high2092](https://github.com/high2092)|

## 개발 환경에서의 실행 방법
```sh
$ cd ./client
$ npm ci
$ npm run build:dev
$ cd ../server
$ npm ci
$ npm run dev
```

# 컨벤션

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
