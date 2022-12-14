import React, { createContext, useEffect, useState, useContext } from "react";
import Apiconfigs, { socketURL } from "src/Apiconfig/Apiconfigs";
import axios from "axios";
import { RefreshContext } from "./RefreshContext";
export const UserContext = createContext();

function checkLogin() {
  const accessToken = sessionStorage.getItem("token");
  return accessToken ? true : false;
}


const setTokenSession = (token) => {
  if (token) {
    sessionStorage.setItem("token", token);
  } else {
    sessionStorage.removeItem("token");
  }
};

export default function AuthProvider(props) {
  const { fast, slow } = useContext(RefreshContext);
  const [isLogin, setIsLogin] = useState(checkLogin());
  const [userData, setUserData] = useState();
  const [unreadChats, setUnreadChats] = useState(0);
  const [unReadNotification, setUnReadNotification] = useState(0);
  const [chatMessageData, setChatMessageData] = useState();
  const [userEarnings, setUserEarnings] = useState({});
  sessionStorage.setItem("isProfileLoaded", false);
 
  const [userProfileData, setUserProfileData] = useState({
    username: "",
    useremail: "",
    userbio: "",
    userprofile: "",
    usercover: "",
    userprofileurl: "",
    usercoverurl: "",
    name: "",
    speciality: "",
  });
  const [link, setlink] = useState({
    useryoutube: "",
    usertwitter: "",
    userfacebook: "",
    usertelegram: "",
  });
  const [notifyData, setNotifyData] = useState([]);
  const [notifyLoader, setNotifyLoder] = useState(false);
  // const [bannerDetails, setBannerDetails] = useState({});
  // const [ourSolutions, setOurSolutions] = useState({});
  // const [howItWorksData, setHoeItWorksData] = useState({});
  // const [bannerVideo, setBannerVideo] = useState([]);
  //CHAT COUNT
  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = sessionStorage.getItem("token");
    if (accessToken) {
      try {
        web.onopen = () => {
          const dataToSend = {
            user_token: accessToken,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            if (event.data !== "[object Promise]" && event.data !== "null") {
              let obj = JSON.parse(event.data);
              setUnreadChats(obj);
            }
          };
        };
        return () => {
          web.close();
          setUnreadChats(0);
        };
      } catch (err) {
        setUnreadChats(0);
      }
    }
  }, [userData]);
  const [search, setsearch] = useState("");

  //CHAT ChatHistory
  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = sessionStorage.getItem("token");
    if (accessToken && userData && userData._id) {
      try {
        web.onopen = () => {
          const dataToSend = {
            type: "ChatHistory",
            senderId: userData._id,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            if (event.data !== "[object Promise]" && event.data !== "null") {
              let obj = JSON.parse(event.data);
              setChatMessageData(obj.result);
            }
          };
        };
        return () => {
          web.close();
          setChatMessageData();
        };
      } catch (err) {
        setChatMessageData();
      }
    }
  }, [userData, search]);

  const getProfileDataHandler = async () => {
    try {
      axios({
        method: "GET",
        url: Apiconfigs.profile,
        headers: {
          token: sessionStorage.getItem("token"),
        },
      }).then(async (res) => {
        if (res.data.statusCode === 200) {
          sessionStorage.setItem("isProfileLoaded", true);
          setUserData(res.data.userDetails);
          setUserProfileData({
            ...userProfileData,
            name: res?.data?.userDetails?.name,
            speciality: res?.data?.userDetails?.speciality,
            username: res?.data?.userDetails?.userName,
            useremail: res?.data?.userDetails?.email,
            userurl: res?.data?.userDetails?.masPageUrl,
            userbio: res?.data?.userDetails?.bio,
            userprofilepic: res?.data?.userDetails?.profilePic,
            usercover: res?.data?.userDetails?.coverPic,
            userprofileurl: "",
            usercoverurl: "",
          });
          setlink({
            ...link,
            useryoutube: res?.data?.userDetails?.youtube,
            usertwitter: res?.data?.userDetails?.twitter,
            userfacebook: res?.data?.userDetails?.facebook,
            usertelegram: res?.data?.userDetails?.telegram,
          });
          
        } else {
          setIsLogin(false);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getCoinBalanceHandler = async () => {
    try {
      const res = axios({
        method: "GET",
        url: Apiconfigs.getCoinBalance,
        headers: {
          token: sessionStorage.getItem("token"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalEarningsHandler = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: Apiconfigs.totalEarnings,
        headers: {
          token: sessionStorage.getItem("token"),
        },
      });
      if (res.data.statusCode == 200) {
        setUserEarnings(res.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // const getBannerContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.getBannerBackground,
  //     })
  //     if (res.data.statusCode === 200) {
  //       console.log('responeBanner', res.data.result)
  //       setBannerDetails(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getBannerVideoDataHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.getVideos,
  //     })
  //     if (res.data.statusCode === 200) {
  //       console.log('videos----', res.data.result)

  //       setBannerVideo(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getOurSolutionContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.content,
  //       params: {
  //         type: 'solution',
  //       },
  //     })
  //     if (res.data.statusCode === 200) {
  //       setOurSolutions(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // const getHowitWorksContentHandler = async () => {
  //   try {
  //     const res = await axios({
  //       method: 'GET',
  //       url: Apiconfigs.content,
  //       params: {
  //         type: 'howItWorks',
  //       },
  //     })
  //     if (res.data.statusCode === 200) {
  //       setHoeItWorksData(res.data.result)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  // useEffect(() => {
  //   getBannerContentHandler()
  //   getOurSolutionContentHandler()
  //   getHowitWorksContentHandler()
  //   getBannerVideoDataHandler()
  // }, [])


  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      getProfileDataHandler();
      getTotalEarningsHandler();
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let now = Date.now();
      let last = Number(sessionStorage.getItem('lastCoinBalanceCall'));
      if(now > last + 300000 /*dev: Spadesme -> sync tabs to call getCoinBalance every 5 min */){
        sessionStorage.setItem('lastCoinBalanceCall', now);
        getCoinBalanceHandler();
      }
    }
  }, [slow]);

  let data = {
    unreadChats,
    chatMessageData,
    unReadNotification,
    userLoggedIn: isLogin,
    userEarnings,
    setsearch,
    search,
    // bannerDetails,
    // ourSolutions,
    // howItWorksData,
    // bannerVideo,
    
    link,
    userProfileData,
    notifyLoader,
    notifyData,
    updateUserStateData: (data) => {
      setUserProfileData({
        ...userProfileData,
        name: data.name,
        speciality: data.speciality,
        username: data.username,
        useremail: data.useremail,
        userurl: data.userurl,
        userbio: data.userbio,
        userprofile: data.profile,
        usercover: data.cover,
        userprofileurl: data.profileurl,
        usercoverurl: data.coverurl,
      });
    },
    userlink: (data) => {
      setlink({
        ...link,
        useryoutube: data.youtube,
        usertwitter: data.twitter,
        userfacebook: data.facebook,
        usertelegram: data.telegram,
      });
    },
 
    isLogin,
    userData,
    logOut: () => {
      setIsLogin(false);
      setTokenSession(false);
      setUserData();
      setUserProfileData();
      sessionStorage.removeItem("token");
      sessionStorage.clear();
    },
    
    updatetoken: (token) => {
      setTokenSession(token);
      setIsLogin(true);
      data.updateUserData();
    },
    updateUserData: () => getProfileDataHandler(),
  };

  useEffect(() => {
    if (isLogin) {
      data.updateUserData();
    }
  }, [isLogin]);

  useEffect(() => {
    const web = new WebSocket(socketURL);
    const accessToken = sessionStorage.getItem("token");
    if (userData  && accessToken) {
      setNotifyLoder(true);
      try {
        setNotifyLoder(true);
        web.onopen = () => {
          const dataToSend = {
            option: "notification",
            token: accessToken,
          };
          web.send(JSON.stringify(dataToSend));
          web.onmessage = async (event) => {
            setNotifyLoder(false);

            if (event.data !== "[object Promise]" && event.data !== "null") {
              setNotifyLoder(false);

              let obj = JSON.parse(event.data);
              if (obj.data && obj.data.length > 0) {
                setNotifyLoder(false);

                setNotifyData(obj.data);
                setUnReadNotification(obj.unReadCount);
              } else {
                setNotifyLoder(false);

                setNotifyData([]);
                setUnReadNotification(0);
              }
            }
          };
        };
        return () => {
          setNotifyLoder(false);

          setNotifyData([]);
          setUnReadNotification(0);
          web.close();
        };
      } catch (err) {
        setNotifyLoder(false);
      }
    }
  }, [userData]);

  return (
    <UserContext.Provider value={data}>{props.children}</UserContext.Provider>
  );
}
