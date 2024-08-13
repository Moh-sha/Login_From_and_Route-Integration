import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup,signOut } from 'firebase/auth';
import firebaseConfig from './Firebase_Config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
 

   const [ User, setUser ] = useState({

      isSignedIn : false,
      name : '',
      email : '',
      photo : ''


   });
  
   const HandleSignout=()=>{
     
     signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log('User signed out.');
    })
    .catch((error) => {
      // An error happened.
      console.error('Sign out error:', error);
    });
     
   }

  const provider = new GoogleAuthProvider();
  const signInWithGoogleButton = () => {
      
    signInWithPopup(auth, provider).then(res => {
       
       const{displayName,photoURL,email } = res.user;

       const signedInUser = {

         isSignedIn : true,
         name : displayName,
         email : email,
         photo : photoURL

       }

      setUser(signedInUser);

       console.log(displayName,photoURL,email);

    })
    .catch(err=>{
       console.log(err.message);
       console.log(err);
      })
        
  }
  return (
    <div>
    
      {

      User.isSignedIn && <h1>Welcome , {User.name}</h1>



      }
      
     <div>

     {
       User.isSignedIn && <img src={User.photo} alt="user_photo" />
     }

     </div>
        {

         User.isSignedIn ?  <button onClick={HandleSignout} >Signout</button> : 
        <button onClick={signInWithGoogleButton} >Sign in with Google</button> 
        
    
        }
      </div>
  );
}

export default App;