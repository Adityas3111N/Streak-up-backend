import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserInterface } from "../types";

const userSchema: Schema<UserInterface> = new Schema({ //schema

    name: {type: String, required: true},
    userName: {type: String, unique: true, index: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    socialProvider: {type: String},
    socialId: {type: String},
    createdAt: Date,
    updatedAt: Date,
    refreshToken: { type: String, default: null },
    goalDate: { type: Date },
    onboardingCompleted: { type: Boolean, default: false },
    currentWeek: { type: Number, default: 1, min: 1, max: 12 }
}, {timestamps: true})

userSchema.pre<UserInterface>("save", async function(next){ //password hashing before saving to db

    if(!this.isModified("password"))return next();

    //Only hash if password exits. i.e - skip for Oauth users
    if(!this.password)return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
})

//add compound index for quick oauth lookups.
userSchema.index({socialId: 1, socialProvider: 1});

userSchema.methods.comparePassword = async function(candidatePassword: string){ 
    if(!this.password)return false;
    return bcrypt.compare(candidatePassword ,this.password);
}

// For typeahead suggestions, you can also create a text index:

userSchema.index({ userName: "text" }); //This lets you do fast searches like db.users.find({ $text: { $search: "abc" } }).
// Indexes do not store duplicates and make lookups much faster.

const User: Model<UserInterface> = mongoose.model<UserInterface>("User", userSchema);

export default User;

