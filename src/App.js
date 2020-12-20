import React, { useState, useEffect } from 'react';
// import web from "../src/images/insta.png";
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



const App = () =>{

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authUser) => {
      if (authUser){
        // User has logged in..
        console.log(authUser);
        setUser(authUser);
      //  if (authUser.displayName){
      //     // Don't update username..
          
          
      //   } 
      //   else{
      //     // if we just create someone....
      //     return authUser.updateProfile({
      //       displayName: username,
      //     });
         
      //   }
      }
      else{
        // Logged out
        setUser(null);
      }
    })
    return () => {
      // perform unsubscribe...
      unsubscribe();
    }
  }, [user, username]);



  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(Snapshot =>{
      // everytime a new post is added, this code fireb....
      setPosts(Snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);


  const signUp = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

  setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  };


  return(
    <div className="app">
     
      

       <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
           <center>
            
              <img className="app__imgHeader"
              src= "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
           </center>
            <Input placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}></Input>

            <Input placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Input>

            <Input placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Input>

            <Button type="submit" onClick={signUp}>Sign Up</Button>
      
      
        </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
           <center>
            
              <img className="app__imgHeader"
              src= "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
              />
           </center>
           
            <Input placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Input>

            <Input placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Input>

            <Button type="submit" onClick={signIn}>Sign In</Button>
      
      
        </form>
          
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__imgHeader"
        src= "https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        alt=""
        />

        {user ? ( <Button onClick={() => auth.signOut()}>Log Out</Button>):
              ( 
                <div className="app__loginContainer">
                  <Button onClick={() => setOpen(true)}>Sign Up</Button>
                  <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              </div>
              )}
      </div>

      
     
      <div className="app__post">
      <div className="app_postLeft">
        { 
          posts.map(({id, post} )=> (
            <Post 
            key={id} postId={id} user={user} username={post.username} caption={post.caption} imgUrl={post.imgUrl} />
          ))
          }
      </div>
       
     

        <div className="app_postright">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />

        </div>  
        </div>  
       
    
      
      { user?.displayName ?( <ImageUpload username={user.displayName} />) : (
        <h4>Sorry You Need To login Upload..</h4>
      ) }
      
      
    </div>
  )
}
export default App;
