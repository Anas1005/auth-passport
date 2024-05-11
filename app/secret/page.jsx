'use client'
 
// import { useSearchParams } from 'next/navigation'
// import { LoginSocialUser } from '@/redux/slices/authSlice';
// import { useEffect } from 'react';
// import {jwtDecode} from 'jwt-decode';
// import { useDispatch } from 'react-redux';
 
const Secret = () =>{
//   const searchParams = useSearchParams()
//   const dispatch = useDispatch();
const token = "dmakmdkamk"
  // useEffect(() => {
    // const token = searchParams.get('token');
    console.log("Token");
    // let decodedToken;
    // if (token) {
    //   decodedToken = jwtDecode(token);
    //   console.log("Decoded",decodedToken)
    //   // dispatch(LoginSocialUser({token,socialUser:decodedToken}))
    // }
  // }, [])

//   useEffect(() => {
//     console.log("Hello,  UseEffect,,,,", token)
//     dispatch(LoginSocialUser({token, socialUser:decodedToken}))
//   }, [])
  
  
 
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {token}</>
}

export default Secret;