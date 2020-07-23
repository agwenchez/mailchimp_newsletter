const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const { default: Axios } = require('axios');
require('dotenv').config();
const API_KEY = process.env.API_KEY

const app = express();

// Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
  const { firstName, lastName, email } = req.body;

  // Make sure fields are filled
  if (!firstName || !lastName || !email) {
    res.redirect('/fail.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  fetch('https://us4.api.mailchimp.com/3.0/lists/30b55ac31a', {
    method: 'POST',
    headers: {
      Authorization: `auth ${API_KEY}`
    },
    body: postData
  })
    .then(res.statusCode === 200 ?
      res.redirect('/success.html') :
      res.redirect('/fail.html'))
    .catch(err => console.log(err))
})


app.get('/campaigns',(req,res)=>{
  // res.send('Camaign route works fine');

  Axios.get('https://us4.api.mailchimp.com/3.0/automations',
  {
    headers:{
      Authorization: 'auth eafb911205537e1c686888a0f5bbdbdc-us4'
    }
  }
  ).then( result =>res.status(200).send(result.data))
   .catch(err => res.status(404).json({sucees:false}));
  
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
