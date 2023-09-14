import {createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
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
        <NotificationsContext.Provider value={{ notificationsList, createNotification }}>
          {children}
        </NotificationsContext.Provider>
      );
}