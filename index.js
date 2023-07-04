import express from 'express';
import axios from 'axios';
import qs from 'qs';
import 'dotenv/config';
import fs from 'fs';

const app = express();

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const response = await axios.post(
      'https://api.twitter.com/oauth2/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: process.env.SELF_URI + '/callback',
        code_verifier: process.env.CODE_CHALLENGE_STR
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    fs.writeFile('./data/token-response.json', response.data, function(err) {
        if (err) {
            console.log(err);
        }
    })

    res.send('Success!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});

app.listen(process.env.API_PORT, () => console.log('Server started on port ' + process.env.API_PORT));