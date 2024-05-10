import React, { StrictMode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {AuthorServices} from "./app/store/features"
import {Dashboard,UserHome} from "./components";

import './App.css';

const App  = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer.user);
  const web_ru_path_Url = useSelector((state) => state.userReducer.rule);
  useEffect(() => {
    if (!user) {
      dispatch(AuthorServices.initUserFromLocal())
    }
  },[dispatch,useDispatch,user,web_ru_path_Url]);
  return (
    <StrictMode>
      { web_ru_path_Url !== '0' ? 
        <UserHome/>: <>
        <Dashboard/>
      </>
    }
    </StrictMode>
    );
  };
  
  
  export default App;
  