import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const register = async(email, nom, prenom, telephone, password) => {

    setIsLoading(true);
  await fetch(`${BASE_URL}/register`,{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email':email, 'nom':nom, 'prenom':prenom, 'telephone':parseInt(telephone), 'password':password})
      }).then(res => res.json())
      .then(resData =>{
        alert(resData.message);
        console.log(resData);
      })
      .catch(error=>{
        console.log(`register error ${error}`);
        alert('Error'+error);
        setIsLoading(false);
      });
    // axios
    //   .post(`${BASE_URL}/register`, {
    //     email,
    //     nom,
    //     prenom,
    //     telephone:parseInt(telephone),
    //     password,
    //   })
    //   .then(res => {
    //     let userInfo = res.data;
    //     setUserInfo(userInfo);
    //     AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    //     setIsLoading(false);
    //     console.log(userInfo);
    //     alert(userInfo.message);
    //     setUserInfo({});
    //   })
    //   .catch(e => {
    //     console.log(`register error ${e}`);
    //     setIsLoading(false);
    //     alert('error');
    //   });
  };

  const login = async(email, password) => {
    setIsLoading(true);
    // await fetch(`${BASE_URL}/login`,{
    //   method:'POST',
    //   headers:{
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({'email':email, 'password':password})
    // }).then(res => res.json())
    // .then(resData =>{
    //   alert('You are connected!');
    //   console.log(resData);
    //   // navigate("Home")
    //   setIsLoading(false);
    // })
    // .catch((error)=>{
    //   console.log('Error: ', error);
    //   alert('Error'+error);
    //   setIsLoading(false);
    // });
    axios
    .post(`${BASE_URL}/login`, {
      email,
      password,
    })
    .then(res=>{
      let userInfo = res.data;
      console.log(userInfo);
      setUserInfo(userInfo);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      setIsLoading(false);
      })
      .catch(e=>{
        console.warn(`login error ${e}`);
        setIsLoading(false);
        alert(e);
      });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {Authorization: `${userInfo.token}`},
        },
      )
      .then((res) => {
        console.log(res.data);
        AsyncStorage.removeItem('userInfo');
        setUserInfo({});
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      if (userInfo) {
        setUserInfo(userInfo);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
