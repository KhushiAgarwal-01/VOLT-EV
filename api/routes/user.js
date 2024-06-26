const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require("../models/user");


const router = express.Router();

router.post('/signup',(req,res,next) => {
    User.find({email :req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: "Mail Exist"
            });
        }
        else {
            bcrypt.hash(req.body.password, 10 , (err,hash) => {
                if(err) {
                    return res.status(500).json({
                        error:err
                    });
                  
                }
                else{
                    const user = new User({
                        _id:new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password:  hash
                        });
                        user.save()
                        .then(result => {
                            console.log(result);
                            res.status(201).json({
                                message: "User Created"
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                message: "error in post",
                                error:err
                            });
                        });
                    }    
               });
        }
    });
    });

    router.post('/login',(req,res,next) => {
        User.find({email : req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1) {
                return res.status(401).json({
                    message:"Auth failed"
                });
            }
                bcrypt.compare(req.body.password,user[0].password,(err,result) => { 
                    if(err) {
                        return  res.status(401).json({
                            message: "Auth failed"
                        });
                    }
                    if(result) {
                        return res.status(200).json({
                            message: "Auth successful"
                        });
                    }
                    res.status(401).json({
                        message:"Auth Failed"
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "error in login"
            });
        });
    });

    router.delete('/:userId',(req,res,next) => {
        User.deleteOne({_id:req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "email Deleted"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "error in deletion"
            });
        });
    });

    module.exports = router;