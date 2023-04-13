<div align=center>

# Boostart - 당신의 하루를 시작하세요!
![main__](https://user-images.githubusercontent.com/73420533/207780689-7db6e89c-becd-48bf-870d-01bc81bb499b.gif)
### 데일리 플래너 + 실시간 공유 그림일기 + SNS
### 🙆‍♂️[~~배포 페이지~~](https://49.50.166.179)🙆‍
<br>
<div align=left>

## 프로젝트 개요
### 네이버 부스트캠프 웹모바일7기 Web19 팀 프로젝트
- **Boostart - 친구와 함께 쓰는 데일리 플래너**
- 개발 기간 : 2022.11.07 - 2022.12.16
- 🗄 [ 프로젝트 일정 관리 백로그 ](https://docs.google.com/spreadsheets/d/114nd2S7HW2TsFTyKjC7WOrTkYY_o8vQmg40ADuNvmsM/edit?usp=sharing)
- 🛠 [ 기술 발표 영상](https://www.youtube.com/watch?v=A--cReu9rgE)
- 🎥 [ 데모 영상](https://www.youtube.com/watch?v=V3bffOV1W6KI)
- 👩‍💻 [ 소개 노션 페이지](https://mikaniz.notion.site/Boostart-83aafefd33d649ec9bf38927d5d2f2df)

### 놓치기 쉬운 하루의 일상을 예쁘게 기록하고 관리할 수 있어요
- 📆 친구와 함께 **소통**할 수 있는 **데일리 플래너**
- 📓 **소켓 통신**을 이용한 친구와의 **공유 그림일기**
- 🙋 **사용자 관점**의 편리함을 고려한 **직관적**인 인터페이스와 애니메이션
<br>

### 팀원 소개
|김진아|박경찬|박수연|하현우|
|:---:|:---:|:---:|:---:|
|<img src="https://user-images.githubusercontent.com/73420533/201267459-8392e1f7-ca7b-4afd-bae0-c32df21fa33a.png" width="180"/>|<img src="https://user-images.githubusercontent.com/73420533/201267890-7279a33e-e194-4f1e-b6e2-bdf3608d05b5.png" width="180"/>|<img src="https://user-images.githubusercontent.com/73420533/207784656-1b6e7a23-2ed1-44d3-87d6-c4a70c4577db.jpeg" width="180"/>|<img src="https://user-images.githubusercontent.com/73420533/201267569-f7f5a95b-62b1-4d5a-8700-0b92da29d909.png" width="180"/>|
|[@mikaniz](https://github.com/mikaniz)|[@ParkKyungChan](https://github.com/ParkKyungChan)|[@sooyeon73](https://github.com/sooyeon73)|[@high2092](https://github.com/high2092)|
<br/>

## 사용된 기술 스택 및 아키텍처
![image](https://user-images.githubusercontent.com/73420533/207784878-d25d8558-760e-4f6b-b153-f9c6b084fc43.png)

![Web App Reference Architecture V2](https://user-images.githubusercontent.com/92143119/207920307-d3f64501-0934-4fa0-9259-ac46f5e11614.png)


## 프로젝트 기능 소개
| LOG - 데일리 플랜 관리 |
| - |
|  ![LOG__](https://user-images.githubusercontent.com/73420533/207790009-69f3781d-2841-4d61-91b4-da8d1369f0d6.gif) |
| - **언제 어디서 무엇을 했는지** 태그 / 라벨 / 장소 와 함께 기록해요! <br> - 상세 정보를 확인하고 각 일정을 완료 / 수정 / 삭제할 수 있어요 <br> - **`드래그 앤 드롭`** 으로 간편하게 태그를 변경할 수 있어요 <br> - 좌측의 **시간 바**를 통해 일정별 시간을 확인할 수 있어요 <br> - 친구가 남긴 **이모티콘**을 확인할 수 있어요 |

| LOG - 친구와의 상호작용 |
| - |
| ![LOG_new__](https://user-images.githubusercontent.com/73420533/207790704-b70dcc83-1a47-4433-99ff-2545c472b601.gif)  |
| - 다른 사용자와 **친구**가 되어 서로의 일상을 공유해 보세요! <br> - 친구의 로그를 조회하고 **이모티콘**을 남길 수 있어요! |

 | DIARY - 공유 그림일기 |
 | - |
 | ![DIARY__](https://user-images.githubusercontent.com/73420533/207792336-25d68959-76fb-4c23-94d7-92abd9e32065.gif) |
 | - 친구의 다이어리에 방문해서 **함께 그림 일기**를 작성해봐요! - 일기에 참여한 사람 / 일기에 참여 중인 사람을 확인할 수 있어요 <br> - **`Socket.IO`** 를 통해 친구와 그림일기를 **실시간으로 공유**해요 <br> - Canvas Fabric.js 을 이용하여 **자유곡선, 도형, 텍스트를 생성하고 편집**할 수 있어요 <br> - **`Redis`** 를 이용하여 빈번한 입출력을 빠르게 처리해요 |
 
 | GOAL - 라벨을 통해 관리되는 목표 |
 | - |
 | ![GOAL__](https://user-images.githubusercontent.com/73420533/207793713-5cdf10d3-c8fd-42fd-a3b7-9580c0fb9d27.gif) |
 | - 데일리 목표를 설정하고 **일정에 등록한 라벨을 통해 목표를 달성**해 보세요! <br> - 일정이 완료되면 설정된 라벨을 통해 목표 달성률이 자동으로 채워져요 <br> - 달성률을 달력에서 확인할 수 있어요 |
 
 | MAP - 지도로 보는 데일리 플랜 |
 | - |
 | ![MAP__](https://user-images.githubusercontent.com/73420533/207800199-6724abf2-f429-400f-a27a-3aca57abc7b6.gif) |
 | - **일정에 설정된 위치**를 통해 하루 동안의 동선을 확인할 수 있어요 <br> - **친구의 동선을 함께** 조회할 수 있어요 <br> - 모든 일정을 한 눈에 파악할 수 있는 전체 보기, 일정을 클릭하면 해당 위치로 이동하는 LOG 리스트를 이용할 수 있어요 |
 
| LOG - 일정 생성 |
| - |
| ![LOG생성__](https://user-images.githubusercontent.com/73420533/207800969-d3ab5cff-d724-4098-b12e-37cd803df171.gif) |
| - 제목, 태그, 시간, 중요도, 공개 여부, 위치, 라벨, 메모 정보를 입력하고 새로운 일정을 생성해 보세요! <br> - 태그 / 라벨을 생성, 삭제, 변경하고 설정할 수 있어요 <br> -일정에 등록한 라벨은 목표에 자동으로 연동돼요 <br> - 장소 검색 API를 이용하여 위치를 검색하고 설정하면 지도 탭에서 위치를 확인할 수 있어요 |

| MAIN - 회원가입 로그인 |
| - |
| 사진 |
| - 카카오/ 깃허브 / 기본 회원가입 후 서비스를 이용해요 <br> - 프로필 사진과 정보의 입력이 잘못된 경우 메세지가 표시돼요 |

| FRIEND - 친구와 함께쓰는 데일리 플래너 |
| - |
| 사진 |
| - ID로 친구를 검색하고 친구 신청을 할 수 있어요 <br> - 햄버거 바에서 친구 요청을 관리하고 나에게 온 알림을 확인해요 <br> - 친구가 되면 친구의 데일리 플래너의 모든 항목을 구경하고, 이모티콘, 실시간 그림일기로 소통할 수 있어요 |


<br>

## 기술적 고민 - [노션](https://mikaniz.notion.site/127548b26c254f42bf85f8963f8fd2be?v=60b5863159d845cbb77a1c38fa231952) / [기술 발표](https://www.youtube.com/watch?v=A--cReu9rgE)
- 🕐 [**`렌더링 효율성`** 까지 개선한 **`드래그 앤 드롭`**](https://mikaniz.notion.site/1bf8fe670232484d84dbd880f176b438)
- 🎨 [**`Redis`**, **`socket.io`** 를 이용한 **`실시간 공유 그림판`**](https://mikaniz.notion.site/Redis-socket-io-f2701f4bb4354e93ab3f8b8656801cc6)
- 🔏 [로그인, 회원가입, 일정생성 시의 **`유효성 검증`**](https://mikaniz.notion.site/af770bf344f949bbaa9b3eda6cc2006c)
- 🚶 [터벅터벅 **`Raw Query`** ](https://mikaniz.notion.site/Raw-Query-c66a2b0b0e6f4db692d78db72cc308f5)
- ⚙️ [완벽한 **`RESTful API`** ?](https://mikaniz.notion.site/RESTful-API-2aa885e4362e41d786492515d6e0f834)
- ✍️ [사용자 편의를 고려한 LOG 생성 **`인터페이스`** ](https://mikaniz.notion.site/LOG-550b280e89fc46f184f4d44e7691837d)
- 🌀 [**`애니메이션`** 을 통한 한층 더 기분 좋은, 고퀄리티의 UI/UX](https://mikaniz.notion.site/UI-UX-70c561f8f0ba45d6adaaa5da9b160ea7)
- 🎫 [**`PR`** 에 티켓을 달아주세요](https://mikaniz.notion.site/PR-95732bea02ab4b3fa3f5459d347af5a1) 

<br>

## ERD
<img width="810" alt="image" src="https://user-images.githubusercontent.com/73420533/207799380-63d3de7a-1c3f-4757-a878-0f9d400765ea.png">
<br>

<hr>

## 개발 환경에서의 실행 방법
```sh
$ cd ./client
$ npm ci
$ npm run build
$ cd ../server
$ npm ci
$ npm start
```
