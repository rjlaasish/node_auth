const router=require('express').Router();
const {userRegister, userLogin}=require('../utils/Auth');

// User registration route
router.post('/register-user',async (req,res)=>{
   await userRegister(req.body,'user',res);
    
});

// Admin registration route
router.post('/register-admin',async (req,res)=>{
    await userRegister(req.body,'admin',res);
});

// Super-Admin registration route
router.post('/register-super-admin',async (req,res)=>{
    await userRegister(req.body,'super-admin',res);
});

// User login route
router.post('/login-user',async (req,res)=>{
    await userLogin(req.body,'user',res);
});

// Admin login route
router.post('/login-admin',async (req,res)=>{
    await userLogin(req.body,'admin',res);
});

// Super-Admin login route
router.post('/login-super-admin',async (req,res)=>{
    await userLogin(req.body,'super-admin',res);
});

//User protected route

//Admin protected route

//Super-Admin protected route

module.exports =router;