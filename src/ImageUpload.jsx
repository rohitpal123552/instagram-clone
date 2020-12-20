import React  from 'react';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import firebase from 'firebase';
import { storage, db } from './firebase';
import './ImageUpload.css';

const ImageUpload = ({username}) =>{

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) =>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                //progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complte function....
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside database...
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imgUrl: url, 
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    });
            }
        )

    }

    return(
      <div className="imageUpload">
          <progress className="img__progress" value={progress} max="100"></progress>
          <input type="text" placeholder="enter a caption" onChange={event => setCaption(event.target.value)} />
          <input type="file" onChange={handleChange} />

          <Button onClick={handleUpload}>Upload</Button>
      </div>
    )
};

export default ImageUpload;