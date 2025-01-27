const passport=require('passport');

const GoogleStrategy=require('passport-google-oauth20');
const FacebookStrategy=require('passport-facebook');
const {User}=require('../models/dbModels');


//----------------------------настройка Google----------------------------
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:`${process.env.BASE_URL}/api/auth/google-callback`
},async(accessToken,refreshToken,profile,done)=>{
    try{
        const user=await User.findOne({
            where:{Email:profile.emails[0].value},
            defaults:{
                name:profile.displayName,
                provider:'google',
            },
        });
        
        
        done(null,user);
    }catch(error){
        done(error,null);
    }
}

));

passport.use(new FacebookStrategy({
    clientID:process.env.FACEBOOK_CLIENT_ID,
    clientSecret:process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:`${process.env.BASE_URL}/api/auth/facebook-callback`,
    profileFields:['id','displayName','emails'],

}, async(accessToken,refreshToken,profile,done)=>{
    try{
        const user=await User.findOne({
            where:{Email:profile.emails[0].value},
            defaults:{
                name:profile.displayName,
                provider:'facebook',
            },
        })
        done(null,user);
    }catch(error){
        done(error,null);
    }
    
}))





passport.serializeUser((user,done)=>done(null,user.UserId));
passport.deserializeUser(async(id,done)=>{
    const user=await User.findByPk(id);
    done(null,user);
})