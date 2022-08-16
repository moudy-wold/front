import React, { useContext, useState, useEffect } from "react";
import { Typography, Box,   Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { BsChat } from "react-icons/bs";
import axios from "axios";
import Apiconfigs from "src/Apiconfig/Apiconfigs";
import { UserContext } from "src/context/User";
import { toast } from "react-toastify";

const useStyles = makeStyles((theme) => ({
  cards: {
    border: "solid 0.5px #e5e3dd",
    backgroundImage:
      "linear-gradient(45deg, #eef2f3 90%,#8e9eab 30%, #eef2f3 90%)",
    padding: "10px",
    borderRadius: "50%",
    width: "200px",
    height: "200px",
    margin: "0 10px",
    position: "relative",
    backdropFilter: "blur(50px)",
  },
  cardContent: {
    textAlign: "center",
    position: "relative",
    "& h6": {
      marginBottom: "2px !important",
      fontSize: "15px !important",
      [theme.breakpoints.down("md")]: {
        fontSize: "10px !important",
      },
      "& span": {
        color: "#000",
        paddingLeft: "5px",
      },
      "@media(max-width:821px)": {
        fontSize: "11px !important",
      },
    },
    "& p": {
      fontSize: "12px",
    },
  },
  avatar: {
    width: "130px !important",
    height: "130px  !important",
    marginLeft: "14px",
    cursor: "pointer",
    "@media(max-width:1025px)": {
      width: " 100% !important",
      height: " 100%  !important",
    },
  },
  nftimg: {
    width: "100%",
    margin: "10px 0",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",

    "& img": {
      maxWidth: "100%",
      maxHeight: "100%",
      width: "-webkit-fill-available",
      borderRadius: "20px",
    },
  },
  nftImg: {
    width: "100%",
    overflow: "hidden",
    backgroundPosition: "center !important",
    backgroundSize: "cover !important",
    backgroundRepeat: " no-repeat !important",
    backgroundColor: "#ccc !important",
  },
  socialbox: {
    "@media(max-width:821px)": {
      height: "12px",
      marginBottom: "3px",
    },
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    "& button": {
      border: "0.5px solid #ccc",
      backgroundImage: "linear-gradient(45deg, #240b36 30%, #c31432 90%)",
      color: "#fff",
      width: "100px",
      fontSize: "12px",
    },
  },
}));

export default function UserDetailsCard( data ) {
  const userCardData = data.data;
  const history = useHistory();
  const classes = useStyles();
  const auth = useContext(UserContext);

  const [isLike, setisLike] = useState(false);
  const [nbLike, setnbLike] = useState(0);
  const [isSubscribed, setisSubscribed] = useState(false);
  const [nbSubscribed, setnbSubscribed] = useState(0);

  const subscribeToUserHandler = async () => {
    await axios({
      method: "GET",
      url: Apiconfigs.followProfile + userCardData._id,
      headers: {
        token: sessionStorage.getItem("token"),
      },
    }) 
      .then(async (res) => {
        if (res.data.statusCode === 200) {
          setisSubscribed(res.data.result.subscribed == "yes");
          setnbSubscribed(res.data.result.nb);
        } else {
          toast.error(res.data.result);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.responseMessage);
      });
  }

  const likeDislikeUserHandler = async (id) => {
    if (auth.userData?._id) {
        try {
          const res = await axios.get(Apiconfigs.likeDislikeUser + id, {
            headers: {
              token: sessionStorage.getItem("token"),
            },
          });
          if (res.data.statusCode === 200) {
            setisLike((liked)=>!liked);
            setnbLike((nb)=> isLike ? nb-1 : nb+1)
          } else {
            setisLike(false);
            toast.error(res.data.responseMessage);
          }
        } catch (error) {}
      
    } else {
      toast.error("Please Login");
    }
  };

  useEffect(()=>{
    setnbLike(userCardData.likesUsers.length);
    setnbSubscribed(userCardData.followers.length);
    if (auth.userData?._id) {
      setisLike(userCardData.likesUsers?.includes(auth.userData._id));
      setisSubscribed(userCardData.followers?.includes(auth.userData._id));
    }
  },[])

  return (
    <Box mb={5} >
    <Box className={classes.cards}>
        <Box className={classes.cardContent}>
          <Box style={{
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}>
              <figure
              style={{
                width: " 90px",
                height: " 90px",
                borderRadius: "90px",
                overflow: 'hidden',
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={userCardData.profilePic || `https://avatars.dicebear.com/api/miniavs/${userCardData?._id}.svg`}
                onClick={() =>
                    history.push({
                      pathname: "/user-profile",
                      search: userCardData?.userName,
                    })
                  }
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%"
                }}
              />
            </figure>
           
           
          </Box>
          <Box
              onClick={() => {
                history.push({
                  pathname: "/user-profile",
                  search: userCardData.userName,
                });
              }}
            >
            <Typography
                variant="h4"
                component="h4"
                style={{
                  color: "#792034",
                  cursor: "pointer",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  width: "auto",
                  textAlign: "center"
                }}
              >
                {userCardData && userCardData.name
                  ? userCardData.name
                  : userCardData.userName}
              </Typography>
          </Box>

          <Box style={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
            }}>
              <span style={{fontSize:'12px',padding:'2px'}}>
                {nbLike && nbLike}
              </span>
              <FaHeart
                style={isLike ? { color: "red" } : {}}
                onClick={() => likeDislikeUserHandler(userCardData._id)}
                className={classes.socialbox}
              />
              <span mx={2}>&nbsp;</span>
              <span
                style={{ color: "#000", 
                fontWeight: "600", 
                fontSize: "12px",
                padding:'2px'
               }}
              >
                { 
                  nbSubscribed ?
                  nbSubscribed > 1 ?
                  nbSubscribed + " subs" :
                  '1 subscriber' : ""
                }
              </span>
          </Box>

          {
            userCardData.speciality &&
            <Typography
            style={{ 
              color: "#000", 
              fontWeight: "700", 
              textAlign: "center",
              fontSize: "10px" 
            }}
          >
            {userCardData.speciality}
          </Typography>
          }
          
          

          <Box className={!isSubscribed ? classes.buttonGroup : null}>
            {
              auth.userData &&
              auth.userLoggedIn &&
              (
                <Button onClick={subscribeToUserHandler}>
                  {isSubscribed ? 'Subscribed' : 'Subscribe' } 
                </Button>
              )
            }
          </Box>
           
        </Box>
    </Box>
    
</Box>

  );
}
