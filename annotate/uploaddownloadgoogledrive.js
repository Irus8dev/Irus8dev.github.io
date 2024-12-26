window.onload = function() {
  var canvas = document.getElementById('myCanvas');
  var ctx = canvas.getContext('2d');

  var img = new Image();
  img.src = 'your-image-url'; // replace with your image URL
  img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  var drawing = false;
  canvas.onmousedown = function(e) {
      drawing = true;
      ctx.beginPath();
  }
  canvas.onmouseup = function() {
      drawing = false;
  }
  canvas.onmousemove = function(e) {
      if(drawing) {
          ctx.lineTo(e.clientX, e.clientY);
          ctx.stroke();
      }
  }

  document.getElementById('saveButton').onclick = function() {
      var dataUrl = canvas.toDataURL('image/png');
      var blob = dataURLToBlob(dataUrl);
      uploadToGoogleDrive(blob);
  }

  function dataURLToBlob(dataUrl) {
    // Convert base64 to raw binary data held in a string
    var byteString = atob(dataUrl.split(',')[1]);
  
    // Separate out the mime component
    var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  
    // Write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }
  
    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
  }
  
  async function uploadToGoogleDrive(blob) {
    // The boundary string is used to define the different parts of the multipart request
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";
  
    // The metadata of the file, includes name and mimeType
    var metadata = {
        'name': 'annotated_image.png',
        'mimeType': 'image/png'
    };
  
    // Multpart body
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + blob.type + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        btoa(String.fromCharCode.apply(null, new Uint8Array(blob))) +
        close_delim;
  
    // Make a request to upload the file to Google Drive
    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });
  
    try {
        var response = await request.execute();
        console.log('File uploaded. File ID: ' + response.id);
    } catch(error) {
        console.error('Error uploading file:', error);
    }
  }
  
};

