const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const fileFilter = function(req,file,callback){
    var ext = path.extname(file.originalname)
    if(ext !== '.pdf')
        return callback(res.send('only pdf allowed'),false)
    else
        return callback(null,true)
}

const upload = multer({
    dest: __dirname+'/uploads/',
    fileFilter: fileFilter
})

router.post('/fileupload',upload.array('file'), (req,res,next)=>{
    req.files.map(data=>{
        console.log(data.fieldname)
        console.log(data.originalname)
    })

    res.json({success:true, data:"PDF Upload OK"})
})