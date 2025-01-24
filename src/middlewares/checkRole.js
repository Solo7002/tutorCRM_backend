const Student=require('../models/student');
const Teacher=require('../models/teacher');

const checkRole=(requiredRole)=>async(req,res,next)=>{
    try{
        const userId=req.user.id;
        console.log(req);
        let isRole=false;

        if(requiredRole==='Student'){
            isRole=await Student.findOne({where:{UserId:userId}});
        }
        else if(requiredRole==='Teacher'){
            isRole=await Teacher.findOne({where:{UserId:userId}});
        }

        if(!isRole){
            return res.status(403).json({ message: 'Access denied.' });
        }
        next();
    }catch(error){
        res.status(500).json({ message: `Error:${error.message}` });

    }

    

}

module.exports=checkRole;