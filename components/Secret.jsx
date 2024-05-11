// // 'use client'
 
// import { useSearchParams } from 'next/navigation'
// // import { LoginSocialUser } from '@/redux/slices/authSlice';
// // import { useEffect } from 'react';
// // import {jwtDecode} from 'jwt-decode';
// // import { useDispatch } from 'react-redux';
 
// const Secret = () =>{
//   const searchParams = useSearchParams()
// //   const dispatch = useDispatch();

//     const token = searchParams.get('token');
//     console.log("Token", token);
//     // let decodedToken;
//     // if (token) {
//     //   console.log("Decoded",decodedToken)
//     //   // dispatch(LoginSocialUser({token,socialUser:decodedToken}))
//     // }
//   // }, [])

// //   useEffect(() => {
// //     console.log("Hello,  UseEffect,,,,", token)
// //     dispatch(LoginSocialUser({token, socialUser:decodedToken}))
// //   }, [])
  
  
 
//   // URL -> `/dashboard?search=my-project`
//   // `search` -> 'my-project'
//   return <>Search: {token}</>
// }

// export default Secret;


import { useSearchParams } from 'next/navigation'

const Secret = () => {
    const searchParams = useSearchParams()
 // Wrap the component or code block that uses useSearchParams() with Suspense
 console.log("Hello From Ssecrrt Child........")
  const token = searchParams.get('token');
//const token = "kakmsa";
  return (
    <div>
   
      {/* Component or code block that uses useSearchParams() */}
      Search: {token}
    
    </div>
  );
}

export default Secret;
