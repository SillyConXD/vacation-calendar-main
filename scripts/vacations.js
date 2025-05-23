// Render Vacations

const isIos = /iP(ad|od|hone)/i.test(window.navigator.userAgent);

const renderVacationPeriod = (e) => {
  if (e.target.parentNode.querySelector(".form__vacation-period")) {
    e.target.parentNode.querySelector(".form__vacation-period").remove();
  }
  if (e.target.parentNode.querySelector(".form__vacation-period-working")) {
    e.target.parentNode.querySelector(".form__vacation-period-working").remove();
  }
  if (e.target.parentNode.parentNode.querySelector(".form__user-total")) {
    e.target.parentNode.parentNode.querySelector(".form__user-total").remove();
  }
  if (e.target.parentNode.parentNode.querySelector(".form__user-total-workdays")) {
    e.target.parentNode.parentNode.querySelector(".form__user-total-workdays").remove();
  }
  const currentVacationId = e.target.parentNode.id;
  const VacationIdString = `.${currentVacationId}`;
  if (document.querySelectorAll(VacationIdString).length > 0) {
    removePrevVacationSpans(e, VacationIdString);
  }
  const vacationStartDay = showVacationStart(e);
  const vacationEndDay = showVacationEnd(e);
  const currentColor = e.target.parentNode.parentNode.querySelector(".form__color").value;
  for (let i = vacationStartDay; i <= vacationEndDay; i++) {
    const dayIdString = `#dayid_${i}`;
    const currentDayDiv = document.querySelector(dayIdString);
    const newDivSpan = document.createElement("span");
    newDivSpan.classList.add("calendar__span");
    currentDayDiv.append(newDivSpan);
    newDivSpan.textContent = ".";
    // set css position property
    const sibCount = countSpanSiblings(newDivSpan);
    newDivSpan.style = `color: ${currentColor};`;
    const left = setVacationSpanPositionLeft(sibCount);
    newDivSpan.style = `color: ${currentColor}; left: ${left};`;
    if (sibCount > 3) {
      const bottom = setVacationSpanPositionBottom(sibCount);
      newDivSpan.style = `color: ${currentColor}; left: ${left}; bottom: ${bottom};`;
    }
    newDivSpan.classList.add(e.target.parentNode.id);
    newDivSpan.classList.add(e.target.parentNode.parentNode.id);
    // scroll to the start of current vacation
    if (i === vacationStartDay) {
      scrollToVacationStartDiv(currentDayDiv);
    }
  }
  // Count and render vacation time
  const vacationTime = countVacationTime(vacationStartDay, vacationEndDay);
  insertVacationTime(e.target.parentNode, vacationTime);
  const vacationTimeWorking = countVacationTimeWorking(vacationStartDay, vacationEndDay);
  insertVacationTimeWorking(e.target.parentNode, vacationTimeWorking);
  // count and render user total vacation days
  insertUserTotal(e);
};

const showVacationStart = (e) => {
  const currentVacationDiv = e.target.parentNode;
  const vacationStartDate = new Date(currentVacationDiv.querySelector(".form__date_type_start").value);
  const vacationStartDay = countDaysFromYearStart(vacationStartDate, startDate);
  return vacationStartDay;
};

const showVacationEnd = (e) => {
  const currentVacationDiv = e.target.parentNode;
  const vacationEndDate = new Date(currentVacationDiv.querySelector(".form__date_type_end").value);
  const vacationEndDay = countDaysFromYearStart(vacationEndDate, startDate);
  return vacationEndDay;
};

const countDaysFromYearStart = (currentDate, yearStartDate) => {
  let difference = currentDate.getTime() - yearStartDate.getTime();
  let totalDays = 0;
  if (isIos) {
    totalDays = 365 + Math.ceil(difference / (1000 * 3600 * 24));
  } else {
    totalDays = 365 + 1 + Math.ceil(difference / (1000 * 3600 * 24));
  }
  return totalDays;
};

const removePrevVacationSpans = (e, VacationIdString) => {
  const divsToDelete = document.querySelectorAll(VacationIdString);
  divsToDelete.forEach((element) => {
    element.remove();
  });
};

const scrollToVacationStartDiv = (currentDayDiv) => {
  currentDayDiv.parentNode.scrollIntoView({ behavior: "smooth" });
};

// Count and render vacation time
const countVacationTime = (vacationStartDay, vacationEndDay) => {
  const vacationTime = vacationEndDay - vacationStartDay + 1;
  return vacationTime;
};
const countVacationTimeWorking = (vacationStartDay, vacationEndDay) => {
  const calDays = document.querySelectorAll('.calendar__day[id^="dayid"]');
  let vacationTimeWorking = 0;
  for (i = vacationStartDay - 1; i <= vacationEndDay - 1; i++) {
    if (!calDays[i].classList.contains("calendar__day_dayoff")) {
      vacationTimeWorking++;
    }
  }
  return vacationTimeWorking;
};
const insertVacationTime = (vacationDiv, vacationTime) => {
  const spanVacationTime = document.createElement("span");
  spanVacationTime.classList.add("form__vacation-period");
  spanVacationTime.textContent = `Кол-во календарных дней: `;
  vacationDiv.append(spanVacationTime);
  const spanVacationTimeDays = document.createElement("span");
  spanVacationTimeDays.classList.add("form__vacation-period-days");
  spanVacationTimeDays.textContent = vacationTime;
  spanVacationTime.append(spanVacationTimeDays);
};
const insertVacationTimeWorking = (vacationDiv, vacationTimeWorking) => {
  const spanVacationTimeWorking = document.createElement("span");
  spanVacationTimeWorking.classList.add("form__vacation-period-working");
  spanVacationTimeWorking.textContent = `Кол-во рабочих дней: `;
  vacationDiv.append(spanVacationTimeWorking);
  const spanVacationTimeDaysWorking = document.createElement("span");
  spanVacationTimeDaysWorking.classList.add("form__vacation-period-days-working");
  spanVacationTimeDaysWorking.textContent = vacationTimeWorking;
  spanVacationTimeWorking.append(spanVacationTimeDaysWorking);
};

// Count and render user total vacation days
const countUserTotal = (e) => {
  const currentUser = e.target.parentNode.parentNode;
  const vacationPeriodSpans = currentUser.querySelectorAll(".form__vacation-period-days");
  let totalPeriod = 0;
  vacationPeriodSpans.forEach((element) => {
    totalPeriod += Number(element.textContent);
  });
  return totalPeriod;
};
const countUserTotalWorkdays = (e) => {
  const currentUser = e.target.parentNode.parentNode;
  const vacationPeriodSpans = currentUser.querySelectorAll(".form__vacation-period-days-working");
  let totalPeriod = 0;
  vacationPeriodSpans.forEach((element) => {
    totalPeriod += Number(element.textContent);
  });
  return totalPeriod;
};

const insertUserTotal = (e) => {
  const currentUser = e.target.parentNode.parentNode;
  const userTotal = countUserTotal(e);
  const spanUserTotal = document.createElement("span");
  spanUserTotal.classList.add("form__user-total");
  spanUserTotal.textContent = `Всего календарных дней: ${userTotal}`;
  currentUser.append(spanUserTotal);
  const userTotalWorkdays = countUserTotalWorkdays(e);
  const spanUserTotalWorkdays = document.createElement("span");
  spanUserTotalWorkdays.classList.add("form__user-total-workdays");
  spanUserTotalWorkdays.textContent = `Всего рабочих дней: ${userTotalWorkdays}`;
  currentUser.append(spanUserTotalWorkdays);
};

// Set Vacation Span Css Position Property

const countSpanSiblings = (span) => {
  let siblings = [];
  // if no parent, return no sibling
  if (!span.parentNode) {
    return siblings;
  }
  // first child of the parent node
  let sibling = span.parentNode.firstChild;
  // collecting siblings
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== span) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }
  return (sibCount = siblings.length);
};

const setVacationSpanPositionBottom = (sibCount) => {
  const bottom = `${2 * Math.floor(sibCount / 4)}px`;
  return bottom;
};

const setVacationSpanPositionLeft = (sibCount) => {
  const left = `${8 * (3 - (sibCount % 4))}px`;
  return left;
};
