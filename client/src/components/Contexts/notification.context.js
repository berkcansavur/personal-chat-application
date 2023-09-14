import {createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from "axios";
const socket = io("http://localhost:3001");
const NotificationsContext = createContext()

export function useNotification() {
    return useContext(NotificationsContext);
}

export function NotificationProvider({children}){
    const [notificationsList, setNotificationsList] = useState([]);
    const token = sessionStorage.getItem("token");
    const [ user, setUser ] = useState({});

    useEffect(() => {
      const getProfileData = async () => {
        try {
          const response = await axios.get("http://localhost:3001/app/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      getProfileData();
    }, [token]);
    useEffect(()=>{
      socket.emit('createNotification', {
        UserIdToBeNotified:user._id, 
        socketId:socket.id
      });
      socket.on('addFriend', ({
        UserIdToBeNotified,
        ReturnNotificationMessage,
        NotificationType}) => {
          if(UserIdToBeNotified===user._id) {
            handleNotification({
            UserIdToBeNotified,
            ReturnNotificationMessage,
            NotificationType
          });}
          
        })
    })
    const handleNotification = (newNotification) => {
      if(!notificationsList.some(
        ntf => ntf.UserIdToBeNotified === newNotification.UserIdToBeNotified &&
        ntf.ReturnNotificationMessage === newNotification.ReturnNotificationMessage &&
        ntf.NotificationType === newNotification.NotificationType)){ 
          setNotificationsList(prevNotifications => [
          ...prevNotifications,
          newNotification
        ]);} 
    }
    
    const createNotification = () =>{
        setNotificationsList();
    };
    return (
        <NotificationsContext.Provider value={{ notificationsList, createNotification }}>
          {children}
        </NotificationsContext.Provider>
      );
}