//const mainDomain = "http://3.108.39.84:3030";
const mainDomain = "http://localhost:3030"; //samana 

const GetAccessToken = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  //console.log(user);
  if (user) return user.token;

  return null;
};

const GetUserId = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  if (user) return user.userId;

  return null;
};

const Config = {
  AxiosConfig: {
    headers: {
      authorization: `${GetAccessToken()}`,
      id: GetUserId(),
    },
  },
  domain: mainDomain,
  apiUrl: mainDomain,
  certificateUrl: mainDomain + "api/upload/CERTIFICATES/",
  docUrl: mainDomain + "api/upload/",
  sessionExpiredTime: 15, // in minutes
  idleTime: 15, // in mins
};

export default Config;
