const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){

        // renamed
        cb(null,file.fieldname + '-' + Date.now() +
         path.extname(file.originalname));

        // original name
        // cb(null,file.originalname);
    }
});

// initialize Upload method
const Upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}, // file bites size
    fileFilter: function(req, file, cb){
        checkfileType(file, cb)
    }
}).single('myImage');

// check file Type
function checkfileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}


// Init app
const app = express();
// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

// route
app.get('/', (req, res) => res.render('index'));

// Post route
app.post('/Upload', (req, res) => {
    // call Upload method described above
    Upload(req, res, (err) => {
        // if there is error - rerender upload-page with msg
        if (err){
            res.render('index', {
                msg: err
            });
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No file Selected!'
                });
            }   else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}` //image display
                });
            }
        };
    });
});








const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
