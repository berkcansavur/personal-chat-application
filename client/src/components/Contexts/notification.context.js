import {createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
const NotificationsContext = createContext()
export function useNotification() {
    return useContext(NotificationsContext);
}

export function NotificationProvider({children}){
    const [notificationsList, setNotificationsList] = useState([]);
    const [ isNotificationExists, setIsNotificationExists] = useState(false);
    const token = sessionStorage.getItem("token");
    const [ user, setUser ] = useState({});
    console.log("General scope navigation provider: ",notificationsList);
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
      getlast10Notifications();
    }, [token]);
    
    const getlast10Notifications = async () => {
      
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
        setNotificationsList([...last10Notifications.data]);
      } catch (error) {
        console.log(error);
      }
    };
    

    const checkNotificationExists = () => {
      if(notificationsList.some(ntf => ntf.UserIdToBeNotified === user._id)){
        setIsNotificationExists(true);
      }
    }

    const createNotification = (newNotification) => {
      if(!notificationsList.some(
        ntf => ntf.UserIdToBeNotified === newNotification.UserIdToBeNotified &&
        ntf.ReturnNotificationMessage === newNotification.ReturnNotificationMessage &&
        ntf.NotificationType === newNotification.NotificationType)){ 
          setNotificationsList(prevNotifications => [
          ...prevNotifications,
          newNotification
        ]);} 
    }
    return (
        <NotificationsContext.Provider value={{ 
          createNotification, 
          notificationsList, 
          checkNotificationExists,
          isNotificationExists,
          getlast10Notifications }}>
          {children}
        </NotificationsContext.Provider>
      );
}