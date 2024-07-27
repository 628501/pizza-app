import React, { useEffect } from 'react';
import Header from './Components/Header';
import AppRoutes from './AppRoutes';
import UseLoad from './Components/UseLoading/UseLoad';
import { Loading } from './hooks/Loading';
import { setLoadingInterceptor } from './Interceptors/LoadingInterceptor';


const App = () => {
  const {showLoading, hideLoading} = Loading();

  useEffect(()=> {
    setLoadingInterceptor({showLoading, hideLoading})
  })
  
  return (
    <>
     <UseLoad/>
     <Header/>
     <AppRoutes/>
    </>
  )
}

export default App
