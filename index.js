const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const validUrl = require('valid-url'); 
const shortid = require('shortid');
const app = express();


const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener Logic
const urlDatabase = {};
const baseUrl = 'https://your-base-url.com'; 

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;

  if (!validUrl.isWebUri(originalUrl)) {
    res.json({ error: 'invalid url' });
  } else {
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = originalUrl;
    res.json({ original_url: originalUrl, short_url: shortUrl });
  }
});

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;

  if (urlDatabase.hasOwnProperty(shortUrl)) {
    const originalUrl = urlDatabase[shortUrl];
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'short URL not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
