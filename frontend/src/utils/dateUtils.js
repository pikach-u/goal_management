/**
 * 로컬 시간대 기준으로 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * toISOString()은 UTC 기준이므로 한국 시간대에서 하루 차이가 날 수 있음
 */
export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const result = `${year}-${month}-${day}`;

  // 디버깅
  console.log("getLocalDateString called:", {
    input: date,
    year,
    month,
    day,
    result,
    dateToString: date.toString()
  });

  return result;
};

/**
 * YYYY-MM-DD 형식의 문자열을 로컬 시간대 Date 객체로 변환
 * (타임존 문제 방지)
 */
export const parseLocalDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * 시작일부터 종료일까지의 모든 날짜를 배열로 반환 (로컬 시간대 기준)
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(getLocalDateString(d));
  }
  return dates;
};

/**
 * 날짜를 YYYY.MM.DD 형식으로 포맷
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  // YYYY-MM-DD 형식을 YYYY.MM.DD로 변환
  const [year, month, day] = dateStr.split('-');
  return `${year}.${month}.${day}`;
};

/**
 * 날짜 범위를 YYYY.MM - YYYY.MM 형식으로 포맷
 */
export const formatPeriod = (startDate, endDate) => {
  if (!startDate || !endDate) return "";

  // YYYY-MM-DD 형식에서 YYYY.MM 추출
  const [startYear, startMonth] = startDate.split('-');
  const [endYear, endMonth] = endDate.split('-');

  return `${startYear}.${startMonth} - ${endYear}.${endMonth}`;
};
