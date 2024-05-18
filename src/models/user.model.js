import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim : true,
        index: true
    },
    fullname :{
        type: String,
        required: true,
        trim : true , 
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim : true,
    },
    avatar:{
        type: String,
        required: true,
    },
    coverImage:{
        type: String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref : "Video"
        }
    ], 
    password:{
        type: String,
        required: true,
        required: [6, "Password is required"],
    },
    refreshToken:{
        type : String,
    }
}, {timestamps: true});



userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({_id: this._id , email : this.email , fullname  :this.fullname}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES});
};
userSchema.methods.generateExpireToken = function(){
    return jwt.sign({id: this._id},process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES});
};

export const User = mongoose.model("User", userSchema);