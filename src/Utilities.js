const API_LOGIN = "http://localhost:3001/users/login";
const API_REGISTER = "http://localhost:3001/users/register";
const API_FORGOT_PASSWORD = "http://localhost:3001/users/forgot-password";
const API_AUTH = "http://localhost:3001/users/check-auth";
const API_EVENTS = "http://localhost:3001/events";
const API_CUSTOMERS = "http://localhost:3001/customers";
const API_DAY_PLANNER = "http://localhost:3001/day-planner";
const API_PERSONAL_DIARY = "http://localhost:3001/personal-diary";
const API_INFO = "http://localhost:3001/info";
const API_CONTACTS = "http://localhost:3001/customers";
const API_PRODUCTS = "http://localhost:3001/products";
const API_INVOICES = "http://localhost:3001/invoices";
const API_ORDERS = "http://localhost:3001/orders";
const BASE_URL = "http://localhost:3001";

const SITE_URL = "http://localhost:3000";

// const API_LOGIN='https://ecom-app-backend.herokuapp.com/users/login';
// const API_REGISTER='https://ecom-app-backend.herokuapp.com/users/register';
// const API_FORGOT_PASSWORD='https://ecom-app-backend.herokuapp.com/users/forgot-password';
// const API_AUTH='https://ecom-app-backend.herokuapp.com/users/check-auth';
// const API_EVENTS='https://ecom-app-backend.herokuapp.com/events';
// const API_CUSTOMERS='https://ecom-app-backend.herokuapp.com/customers';
// const API_DAY_PLANNER='https://ecom-app-backend.herokuapp.com/day-planner';
// const API_PERSONAL_DIARY='https://ecom-app-backend.herokuapp.com/personal-diary';
// const API_INFO='https://ecom-app-backend.herokuapp.com/info';
// const API_CONTACTS='https://ecom-app-backend.herokuapp.com/customers';
// const API_PRODUCTS='https://ecom-app-backend.herokuapp.com/products';
// const API_INVOICES='https://ecom-app-backend.herokuapp.com/invoices';
// const API_ORDERS='https://ecom-app-backend.herokuapp.com/orders';
// const BASE_URL='https://ecom-app-backend.herokuapp.com';

// const SITE_URL='https://ecom-app-backend.herokuapp.com';

const convertTimeTo12H = (time) => {
  const tempTime = parseTime(time);
  const hours = tempTime[0];
  tempTime[1] = tempTime[1].toString().padStart(2, "0");
  if (hours > 12) {
    tempTime[0] -= 12;
    tempTime[1] += " PM";
  } else if (hours === 0) {
    tempTime[0] = 12;
    tempTime[1] += " AM";
  } else if (hours < 12) tempTime[1] += " AM";
  else if (hours === 12) tempTime[1] += " PM";
  return tempTime.join(":");
};

const parseTime = (time) => {
  time = parseFloat(time).toFixed(2);
  let tempTime = time.toString().split(".");
  tempTime[0] = parseInt(tempTime[0]);
  tempTime[1] = parseInt(tempTime[1]);
  return tempTime;
};

const convertTimeToInt = (time) => {
  const timeObj = new Date(time);
  let tempTime = [];
  tempTime.push(timeObj.getHours());
  tempTime.push(timeObj.getMinutes());
  return tempTime;
};

const formatDate = (date) => {
  const tempDate = new Date(date);
  return `${tempDate.getDate().toString().padStart(2, "0")}-${(
    tempDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${tempDate.getFullYear()}`;
};

const dateOnly = (date) => {
  const getDateOnly = new Date(date);
  return `${getDateOnly.getFullYear()}-${(getDateOnly.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${getDateOnly.getDate().toString().padStart(2, "0")}`;
};

const formatTime = (time) => {
  const tempTime = new Date(time);
  return convertTimeTo12H(
    `${tempTime.getHours()}.${tempTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  );
};

const formatDuration = (time) => {
  const tempTime = new Date(time);
  if (tempTime.getHours() === 0)
    return `${tempTime.getMinutes().toString().padStart(2, "0")}m`;
  return `${tempTime.getHours()}h ${tempTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}m`;
};

const capitalize = (input) => input.charAt(0).toUpperCase() + input.slice(1);

const getChipColor = (status) => {
  switch (status) {
    case "Scheduled":
      return "primary";
    case "In progress":
      return "secondary";
    case "Completed":
      return "success";
    case "Cancelled":
      return "error";
    case "Low":
      return "success";
    case "Moderate":
      return "primary";
    case "Medium":
      return "secondary";
    case "High":
      return "error";
    default:
      return "primary";
  }
};

const getTimeBackgroundColor = (priority) => {
  if (priority === "Low") return "green";
  if (priority === "Moderate") return "blue";
  if (priority === "High") return "red";
};

const findTimeDifference = (eventTime, currentTime) => {
  let today = new Date();
  let timeDiff = eventTime - today;
  const minutes = Math.floor(Math.abs((timeDiff / (1000 * 60)) % 60));
  const hours = Math.floor(Math.abs((timeDiff / (1000 * 60 * 60)) % 24));

  let timeDifference = ``;
  if (timeDiff > 0) timeDifference = `Starts in `;
  else timeDifference = `Started `;
  if (hours > 1) timeDifference += `${hours}h`;
  else if (hours === 1) timeDifference += `${hours}h`;
  if (minutes === 1) timeDifference += `${minutes}m`;
  else if (minutes === 0 && hours < 0) timeDifference += `Just now`;
  else timeDifference += `${minutes}m`;

  if (timeDiff < 0 && (minutes > 0 || hours > 0)) timeDifference += " ago";

  return timeDifference;
};

const updateStatus = (status, eventTime, duration) => {
  if (status === "In progress") {
    updateStatusDuration(status, eventTime, duration);
  } else {
    let today = new Date();
    let timeDiff = eventTime - today;
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

    if (status === "Scheduled")
      if (hours <= 0 && minutes <= 0) return "In progress";
    return status;
  }
};

const getMinutesAndHoursOnly = (eventTime) => {
  let today = new Date();
  let timeDiff = eventTime - today;
  const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
  const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

  console.log("minutes : ", minutes, "hours : ", hours);
};

const updateStatusDuration = (status, eventTime, duration) => {
  let today = new Date();
  let timeDiff = eventTime - duration;
  console.log("time diff and today", timeDiff, today);
  let completed = false;
  if (timeDiff < today) {
    console.log("Completed");
    completed = true;
  } else {
    completed = false;
    console.log("not completed");
  }
  // const minutes=Math.floor(timeDiff/(1000*60)%60);
  // const hours= Math.floor(timeDiff/(1000*60*60)%24);

  if (completed) return "Completed";
  return status;
};

export {
  API_INVOICES,
  API_PRODUCTS,
  API_LOGIN,
  API_REGISTER,
  API_AUTH,
  API_EVENTS,
  API_CONTACTS,
  API_CUSTOMERS,
  API_DAY_PLANNER,
  API_PERSONAL_DIARY,
  API_INFO,
  API_FORGOT_PASSWORD,
  BASE_URL,
  SITE_URL,
  API_ORDERS,
  convertTimeTo12H,
  formatDate,
  formatTime,
  getChipColor,
  getTimeBackgroundColor,
  findTimeDifference,
  dateOnly,
  capitalize,
  updateStatus,
  formatDuration,
  getMinutesAndHoursOnly,
  convertTimeToInt,
};
