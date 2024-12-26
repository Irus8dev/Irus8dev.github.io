// script.js
window.onload = function () {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  var img = new Image();
  img.src = 'your-image-url'; // replace with your image URL
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  var drawing = false;
  canvas.onmousedown = function (e) {
    drawing = true;
    ctx.beginPath();
  };
  canvas.onmouseup = function () {
    drawing = false;
  };
  canvas.onmousemove = function (e) {
    if (drawing) {
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  };

  
  // script.js
  const fs = require('fs');
  const { google } = require('googleapis');

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), uploadFile);
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile('token.json', (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    var fileMetadata = {
      'name': 'photo.jpg'
    };
    var media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream('path/to/photo.jpg')
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        console.error(err);
      } else {
        console.log('File Id: ', file.id);
      }
    });
  }


};


