const ArabicDays = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت"
];

export const getCurrentDate = () => {
  const currentDate = new Date();
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return currentDate.toLocaleDateString('en-GB', options).replace(/\b0/g, '');
};
export const getDateAfterOneDay = () => {
  const currentDate = new Date();
  const nextDay = new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000);
  const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
  return nextDay.toLocaleDateString('en-GB', options).replace(/\b0/g, '');
};
export const getCurrentTime = () => {
  const currentTime = new Date();
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  return currentTime.toLocaleTimeString('en-US', options);
};

export const getCurrentArabicDay = () => {
  const currentDay = new Date().getDay();
  return ArabicDays[currentDay];
};

export const getDateAfterOneMonth = () => {
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
  return nextMonth.toLocaleDateString('en-GB', options).replace(/\b0/g, '');
};

export const getDateAfterOneWeek = () => {
  const currentDate = new Date();
  const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
  return nextWeek.toLocaleDateString('en-GB', options).replace(/\b0/g, '');
};
