import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import {updateProfile , getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseConfig from './Firebase_Config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    password: '',
    email: '',
    photo: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (newUser) {
      // Handle user sign-up
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const createdUser = userCredential.user;
          console.log('User created successfully:', createdUser);
          UpdateInformation(user.name);
          setErrorMessage(''); // Clear any previous error message
        })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            setErrorMessage('This email is already in use. Please sign in instead.');
          } else {
            setErrorMessage(error.message);
          }
        });
    } else if (user.email && user.password) {
      // Handle user sign-in
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const signedInUser = userCredential.user;
          console.log("User signed in:", signedInUser);

          // Update the state to reflect the signed-in status
          setUser({
            ...user,
            isSignedIn: true,
            name: signedInUser.displayName || '',
            email: signedInUser.email,
            photo: signedInUser.photoURL || '',
          });
          console.log("User updated:", user);

          // Clear any previous error messages
          setErrorMessage('');
        })
        .catch((error) => {
          const errorCode = error.code;

          // Set a user-friendly error message
          if (errorCode === 'auth/wrong-password') {
            setErrorMessage('Incorrect password. Please try again.');
          } else if (errorCode === 'auth/user-not-found') {
            setErrorMessage('No account found with this email. Please sign up.');
          } else {
            setErrorMessage('Failed to sign in. Please check your email and password.');
          }
          
          console.error("Error signing in:", errorCode, error.message);
        });
    }
  };

  const changeHandle = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out.');
        setUser({
          isSignedIn: false,
          name: '',
          password: '',
          email: '',
          photo: '',
        });
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  const provider = new GoogleAuthProvider();
  const signInWithGoogleButton = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;

        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };

        setUser(signedInUser);
        console.log('Google sign-in successful:', displayName, photoURL, email);
      })
      .catch((err) => {
        console.error('Google sign-in error:', err.message);
      });
  };
 
  const UpdateInformation = (name) => {

    updateProfile(auth.user, {
      displayName: user.name ,
    }).then(() => {
      // Profile updated!
      console.log('User profile update');
    }).catch((error) => {
      console.log(error);
    });




  }




  return (
    <div>
      <p>User Email: {user.email}</p>
      <p>User Password: {user.password}</p>
      <p>User Name: {user.name}</p>

      {user.isSignedIn && <h1>Welcome, {user.name}</h1>}

      <div>
        {user.isSignedIn && <img src={user.photo} alt="user_photo" />}
      </div>

      {user.isSignedIn ? (
        <button onClick={handleSignout}>Sign out</button>
      ) : (
        <button onClick={signInWithGoogleButton}>Sign in with Google</button>
      )}

 <br />
     {

      <button>Sign in Facebook</button>

     }


      <h1>Own Authentication Field</h1>

      <input 
        type="checkbox" 
        onChange={() => setNewUser(!newUser)} 
        name="newUser" 
        id="newUserCheckbox" 
      />
      <label htmlFor="newUserCheckbox">Create a new user</label>

      <form onSubmit={handleFormSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            onBlur={changeHandle}
            placeholder="Enter your name"
            required
          />
        )}
        <br />
        <input
          type="text"
          name="email"
          onBlur={changeHandle}
          placeholder="Enter your Email"
          required
        />
        <br />
        <input
          type="password"
          name="password"
          onBlur={changeHandle}
          placeholder="Enter your password"
          required
        />
        <br />
        <input type="submit" value="Submit" />
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default App;
