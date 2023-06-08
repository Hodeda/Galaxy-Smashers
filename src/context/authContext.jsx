import React, { useEffect, useState } from 'react'
import newAxios from '../components/Axios'

export const authContext = React.createContext()

export const UserContext = ({children}) => {
    const [userDetails, setUserDetails] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState({});



    useEffect(() => {
        const fetchUser = async () => {
          try {
            const response = await newAxios.get('/users/player', {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${document.cookie}`
              },
              withCredentials: true
            });
            if (response.status === 200) {
              const user = response.data;
              setUserDetails(user);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchUser();
      }, []);

        const fetchUsers = async () => {
          try {
            const res = await newAxios.get(`/users/players`, {
              withCredentials: true,
            });
            setUsers(res.data);
          } catch (err) {
            console.log(err);
          }
        };

          const fetchCurrentUser = async () => {
            try {
              const res = await newAxios.get(`/player/:id`, {
                withCredentials: true,
              });
              setCurrentUser(res.data);
            } catch (err) {
              console.log(err);
            }
          };
    
    
  return (
    <authContext.Provider value={{ setUserDetails, userDetails, users, setUsers, fetchUsers, currentUser, setCurrentUser, fetchCurrentUser }}>
        {children}
    </authContext.Provider>
  )
}


export const useAuth = () => React.useContext(authContext)