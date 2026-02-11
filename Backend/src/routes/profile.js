const express = require('express');

const router = express.Router();
const userAuth = require('../middlewares/auth');
const {User} = require('../models/user');
const updateSchema = require('../validators/update-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const validator = require('validator')


router.get('/view', userAuth ,async(req,res)=>{
     
    const user = req.user;
    // // console.log(userId)
 
    // const user = await User.findById({
    //     _id : userId
    // }).select('-password');

    return res.status(200).json({
        success : true,
        user : user
    })
    
})

router.get('/:id',userAuth,async(req,res)=>{
     const targetUserId = req.params.id;

     const  user = await User.findOne({
        _id : targetUserId
     }).select('firstname lastname photoUrl -_id');

     if(!user){
        return res.status(400).json({
            success : false,
            msg : "User not Found"
        })
     }

     return res.status(200).json({
        success : true,
        user : user
     })
})

router.patch('/edit' , userAuth , async(req,res)=>{

    const updateFields = req.body;
    const {photoUrl} = req.body;
    console.log("updatedield",updateFields)

    //here we wont allow user to update the email and password
    const ALLOWED_UPDATES = ["firstname" , "lastname" , "age" , "gender" , "skills" , "photoUrl" , "about"];

    const isUpdateAllowed = Object.keys(updateFields).every(key=>ALLOWED_UPDATES.includes(key));
    if(!isUpdateAllowed){
        return res.status(400).json({
            success : "false",
            message : "Fields you are trying to update cannot be updated"
        })
    }
    
      if (typeof req.body.skills === 'string') {
      req.body.skills = req.body.skills.split(',').map(s => s.trim());
      }   
    

    //we also need to validate whether the new data user is trying to update is sanitized or not
    const validation = updateSchema.safeParse(req.body);
    console.log('validation' , validation);
    if(!validation.success){
        return res.status(400).json({
            success: false,
            message: "Invalid input data",
            errors: validation.error.flatten()
         })
    }

    const sanitizedData = validation.data;

    try{
        const updatedUser = await User.findByIdAndUpdate({
            _id : req.user._id
        },{
          sanitizedData,
          photoUrl : photoUrl.secure_url
        }
        ,{
            returnDocument : 'after'
        }).select("-password")

        return res.status(200).json({
            success : true,
            message : `${updatedUser.firstname} your profile has updated successfully`,
            user : updatedUser
        })
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
})


router.patch('/verify-password',userAuth, async(req,res)=>{
     const {oldPassword , confirmOldPassword} = req.body;
     console.log(oldPassword , confirmOldPassword)
     const loggedInUser = req.user;

      const isMatch = oldPassword===confirmOldPassword;
      console.log(isMatch);


      if(!isMatch){
        return res.status(400).json({
            success : false,
            message : "Password are not matching"
        })
      }

      const isPasswordValid = await bcrypt.compare(oldPassword , loggedInUser.password);

      if(!isPasswordValid){
        return res.status(400).json({
            success : false,
            message : "Password are not matching"
        })
      }


      return res.status(200).json({
        success : true,
        message : "Password verified"
      })
})

router.patch('/password' , userAuth , async(req,res)=>{
    const {newPassword , confirmNewPassword} = req.body;

    //check whether the password matches : 
    if(newPassword !== confirmNewPassword){
        return res.status(400).json({
            success : false,
            message : "password doesnt match"
        })
    }

    //if password matches then check it is not same as the previous one

    const isPreviousPassword = await bcrypt.compare(newPassword , req.user.password);
    if(isPreviousPassword){
        return res.status(400).json({
            success : false,
            message : "Password same as previous one"
        })
    }

    //now check if password is strong or not
    const isPassswordStrong = validator.isStrongPassword(newPassword);

    if(!isPassswordStrong){
        return res.status(400).json({
            success : false,
            message : "Password is not strong"
        })
    }

    // hash the new password : 

    const newHashedpassword = await bcrypt.hash(newPassword , 10);

    const updatedUser = await User.findByIdAndUpdate({
        _id : req.user._id
    },{
        password : newHashedpassword
    },{
        returnDocument : "after"
    })

     return res.status(200).json({
        success : true,
        message : "Password changed successfully",
        user : updatedUser
     })
  
})


module.exports = router;