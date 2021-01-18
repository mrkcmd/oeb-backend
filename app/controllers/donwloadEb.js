// const {Storage} = require('@google-cloud/storage');


// const gc = new Storage({
//     keyFilename: config.ebook,
//     projectId: "ebook-onlline",
//   });

// const myBucket = gc.bucket('ebook-online');


// //-
// // Generate a URL that allows temporary access to list files in a bucket.
// //-
// const request = require('request');

// const config = {
//   action: 'list',
//   expires: '03-17-2025'
// };

// bucket.getSignedUrl(config, function(err, url) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   // The bucket is now available to be listed from this URL.
//   request(url, function(err, resp) {
//      resp.statusCode = 200
//   });
// });

// //-
// // If the callback is omitted, we'll return a Promise.
// //-
// bucket.getSignedUrl(config).then(function(data) {
//   const url = data[0];
// });