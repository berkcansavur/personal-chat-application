import {createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import io from 'socket.io-client';
const socket = io("http://localhost:3001");
const NotificationsContext = createContext()
export function useNotification() {
    return useContext(NotificationsContext);
}
export function NotificationProvider({children}){
    const [notificationsList, setNotificationsList] = useState([]);
    const [ isNotificationExists, setIsNotificationExists] = useState(false);
    const token = sessionStorage.getItem("token");
    const [ user, setUser ] = useState({});
    useEffect(() => {
      const getProfileData = async () => {
        if(token){
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
        }
      };
      getProfileData();
      getlast10Notifications();
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
          if(UserIdToBeNotified === user._id) {
            createNotification({
            UserIdToBeNotified,
            ReturnNotificationMessage,
            NotificationType
          });
          setIsNotificationExists(true);
        }
      });
        socket.on('removeFriend', ({
          UserIdToBeNotified,
          ReturnNotificationMessage,
          NotificationType}) => {
            if(UserIdToBeNotified === user._id) {
              createNotification({
              UserIdToBeNotified,
              ReturnNotificationMessage,
              NotificationType
            });
            setIsNotificationExists(true);
          }
        });
        socket.on('addedToChatGroup',({
          UserIdToBeNotified,
          ReturnNotificationMessage,
          NotificationType}) => {
            if(UserIdToBeNotified === user._id) {
              createNotification({
                UserIdToBeNotified,
                ReturnNotificationMessage,
                NotificationType
              });
              setIsNotificationExists(true);
            }
          });
          socket.on('removedFromChatGroup',({
            UserIdToBeNotified,
            ReturnNotificationMessage,
            NotificationType}) => {
              if(UserIdToBeNotified === user._id){
                createNotification({
                  UserIdToBeNotified,
                  ReturnNotificationMessage,
                  NotificationType
                });
                setIsNotificationExists(true);
              }
            })
        return () => {
          socket.off('addFriend');
          socket.off('removeFriend');
          socket.off('addedToChatGroup');
          socket.off('removedFromChatGroup');
        }
    },[user,isNotificationExists]);

    const getlast10Notifications = async () => {
      if(user){
        try {
          const token = sessionStorage.getItem("token");
            const last10Notifications = await axios.get(
              `http://localhost:3001/app/get-last-10-notifications/${user._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if(last10Notifications.data){
              setNotificationsList([...last10Notifications.data]);
            }  
        } catch (error) {
          console.log(error);
        }
      }
    };

    const getCurrentDate = () => {
      const GMTNow = new Date();
      const GMTHours = GMTNow.getHours();
      const turkeyHours = GMTHours + 3;
  
      const turkeyNow = new Date(GMTNow);
      turkeyNow.setHours(turkeyHours);
      
      return turkeyNow.toUTCString();
    }

    const setNotificationIsChecked = () =>{
      setIsNotificationExists(false);
    }

    const createNotification = (newNotification) => {
      if(!notificationsList.some(
        ntf => ntf.UserIdToBeNotified === newNotification.UserIdToBeNotified &&
        ntf.ReturnNotificationMessage === newNotification.ReturnNotificationMessage &&
        ntf.NotificationType === newNotification.NotificationType)){ 
          setNotificationsList(prevNotifications => [
          ...prevNotifications,
          newNotification
        ])
        ;} 
    }
    return (
        <NotificationsContext.Provider value={{ 
          createNotification, 
          notificationsList, 
          isNotificationExists,
          getlast10Notifications,
          setNotificationIsChecked,
          getCurrentDate }}>
          {children}
        </NotificationsContext.Provider>
      );
}