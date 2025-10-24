const axios = require('axios');

// 환경 변수
const FIREBASE_URL = process.env.FIREBASE_URL;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

// 커맨드 라인 인자 (morning or evening)
const timeOfDay = process.argv[2];

// 전체 사용자 목록
const allUsers = ["응곤", "민성", "성현", "한준", "이바", "예림"];

// 한국 시간(KST) 날짜 구하기 (YYYY-MM-DD)
const getKSTDate = () => {
  const now = new Date();
  // UTC 시간에 9시간을 더해서 KST로 변환
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  return kstTime.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Firebase에서 오늘 entries 조회
const getTodayEntries = async (todayKST) => {
  try {
    const response = await axios.get(`${FIREBASE_URL}/entries.json`);
    const entries = response.data || {};

    // 객체를 배열로 변환하고 오늘 날짜로 필터링
    const todayEntries = Object.values(entries).filter(entry =>
      entry && entry.date === todayKST
    );

    return todayEntries;
  } catch (error) {
    console.error('Firebase 조회 실패:', error.message);
    throw error;
  }
};

// 미작성자 확인
const getNotWrittenAuthors = (entries) => {
  // 오늘 작성한 사람들 목록 추출 (중복 제거)
  const writtenAuthorsSet = new Set(entries.map(entry => entry.author));
  const writtenAuthors = Array.from(writtenAuthorsSet);

  // 전체 사용자에서 작성한 사람들 제외
  const notWritten = allUsers.filter(user => !writtenAuthors.includes(user));

  return { writtenAuthors, notWritten };
};

// 개인화 메시지 생성
const getMessage = (author, timeOfDay) => {
  if (timeOfDay === 'morning') {
    return {
      heading: `굿모닝 ${author}`,
      content: "오늘도 행복한 하루 보내길!"
    };
  } else if (timeOfDay === 'evening') {
    return {
      heading: `굿이브닝 ${author}`,
      content: "오늘의 압정은 무엇인가요?"
    };
  } else {
    throw new Error(`잘못된 timeOfDay: ${timeOfDay}`);
  }
};

// OneSignal 푸시 발송 (각 개인별)
const sendNotifications = async (notWrittenAuthors, timeOfDay) => {
  let successCount = 0;
  let failCount = 0;

  // 각 미작성자에게 개별 푸시 발송
  for (const author of notWrittenAuthors) {
    const message = getMessage(author, timeOfDay);

    try {
      const response = await axios.post(
        'https://onesignal.com/api/v1/notifications',
        {
          app_id: ONESIGNAL_APP_ID,
          filters: [
            { field: "tag", key: "author", relation: "=", value: author }
          ],
          headings: { en: message.heading },
          contents: { en: message.content },
          url: "https://tack-club.web.app",
          ttl: 3600, // 알림 유효 시간 1시간
          priority: 10 // 높은 우선순위
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${ONESIGNAL_REST_API_KEY}`
          }
        }
      );

      console.log(`✅ ${author}에게 ${timeOfDay} 푸시 발송 완료 (ID: ${response.data.id})`);
      successCount++;
    } catch (error) {
      console.error(`❌ ${author} 푸시 발송 실패:`, error.response?.data || error.message);
      failCount++;
    }

    // API 호출 간격 (너무 빠른 연속 호출 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return { successCount, failCount };
};

// 메인 실행 함수
(async () => {
  try {
    // 필수 환경 변수 체크
    if (!FIREBASE_URL || !ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      throw new Error('필수 환경 변수가 설정되지 않았습니다.');
    }

    if (!timeOfDay || !['morning', 'evening'].includes(timeOfDay)) {
      throw new Error('커맨드 라인 인자를 확인하세요. (morning 또는 evening)');
    }

    console.log(`========================================`);
    console.log(`[${new Date().toISOString()}]`);
    console.log(`${timeOfDay.toUpperCase()} 알림 체크 시작`);
    console.log(`========================================`);

    // 오늘 날짜 (KST 기준)
    const todayKST = getKSTDate();
    console.log(`오늘 날짜(KST): ${todayKST}`);
    console.log(`전체 사용자: ${allUsers.join(", ")}`);

    // Firebase에서 오늘 작성된 entries 조회
    console.log(`\n📡 Firebase에서 데이터 조회 중...`);
    const entries = await getTodayEntries(todayKST);
    console.log(`오늘 작성된 압정: ${entries.length}개`);

    // 작성자/미작성자 분류
    const { writtenAuthors, notWritten } = getNotWrittenAuthors(entries);

    console.log(`\n📊 작성 현황`);
    console.log(`작성 완료: ${writtenAuthors.length > 0 ? writtenAuthors.join(", ") : "없음"} (${writtenAuthors.length}명)`);
    console.log(`미작성자: ${notWritten.length > 0 ? notWritten.join(", ") : "없음"} (${notWritten.length}명)`);
    console.log(`========================================`);

    // 미작성자가 있으면 푸시 발송
    if (notWritten.length > 0) {
      console.log(`\n📤 ${notWritten.length}명에게 개별 푸시 발송 시작...\n`);
      const { successCount, failCount } = await sendNotifications(notWritten, timeOfDay);

      console.log(`\n========================================`);
      console.log(`📈 발송 결과`);
      console.log(`성공: ${successCount}건`);
      console.log(`실패: ${failCount}건`);
      console.log(`========================================`);

      if (failCount > 0) {
        console.log(`⚠️ 일부 푸시 발송 실패`);
        process.exit(1);
      } else {
        console.log(`\n✨ 모든 푸시 발송 완료!`);
      }
    } else {
      console.log(`\n🎉 모두 작성 완료! 알림 발송 안 함`);
    }

    console.log(`\n[${new Date().toISOString()}] ${timeOfDay.toUpperCase()} 알림 체크 종료`);
    console.log(`========================================\n`);

  } catch (error) {
    console.error(`\n❌ 치명적 에러 발생:`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
})();