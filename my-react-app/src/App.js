import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';


const CDNURL = "https://zguvjkkteqiubludwwlf.supabase.co/storage/v1/object/public/images/";


function App() {
  const [ email, setEmail ] = useState("");
  const [ images, setImages ] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  console.log(email);

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });
      if(data !== null) {
        setImages(data);
      } else {
        alert("Error loading images");
        console.log(error);
      }
  }
  
  useEffect(() => {
    if(user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    });

    if(error) {
      alert("Error communicating with supabase, make sure to use a real email address!");
      console.log(error);
    } else {
      alert("Check your email for a Supabase Magic Link to log in!");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadImage(e) {
    let file = e.target.files[0];
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(user.id + "/" + uuidv4(), file)  

    if(data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase
      .storage
      .from('images')
      .remove([ user.id + "/" + imageName])
    
    if(error) {
      alert(error);
    } else {
      getImages();
    }
  }


  return (
    <Container align="center" className="container-sm mt-4">
      { user === null ? 
        <>
          <h1>Welcome to ImageWall</h1>
          <Form>
            <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
              <Form.Label>Enter an email to sign in with a Supabase Magic Link</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => magicLinkLogin()}>
              Get Magic Link
            </Button>
          </Form>
        </>
      : 
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Current user: {user.email}</p>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => uploadImage(e)}/>
          </Form.Group>
          <hr />
          <h3>Your Images</h3>
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img variant="top" src={CDNURL + user.id + "/" + image.name} />
                    <Card.Body>
                      <Button variant="danger" onClick={() => deleteImage(image.name)}>Delete Image</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      }
    </Container>
  );
}

export default App;