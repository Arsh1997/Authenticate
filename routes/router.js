var express=require('express');
var router=express.Router();
var User=require('../models/user');

router.get('/',function(req,res,next){
    return res.sendFile(path.join(__dirname+ '/templateLogReg/index.html'));
});

router.post('/',function(req,res,next){
   if(req.body.password !== req.body.passwordConf){
       var err=new Error('Passwords do not match.');
       err.status=400;
       res.send("Passwords dont match");
       return next(err);
   }
   if(req.body.username && req.body.password && req.body.passwordConf) {

       var UserData = {
           username: req.body.username,
           password: req.body.password,
           passwordConf: req.body.passwordConf,
       }
       User.create(UserData, function (error, user) {
           if (error) {
               return next(error);
           } else {
               req.session.userId = user._id;
               return res.redirect('/profile');
           }
       });

   }else if(req.body.logusername &&req.body.logpassword){
           User.authenticate(req.body.logusername,req.body.logpassword,function(error,user){
               if(error ||!user) {
                   var err = new Error('Wrong email or password');
                   err.status = 401;
                   return next(err);
               }else{
                   req.session.userId=user._id;
                   return res.redirect('/profile');
               }
           });
       }else{
           var err=new Error('All fields required.');
           err.status=400;
           return next(err);
       }
})

router.get('/profile', function (req, res, next) {
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send('<h1>Name: </h1>' + user.username + '<br><a type="button" href="/logout">Logout</a>')
                }
            }
        });
});

router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

module.exports = router;