import { Document } from "mongoose";

export interface UserInterface extends Document { //type declaration
     _id: string; // actual MongoDB ID
    readonly id: string; // virtual getter provided by Mongoose
    name : string;
    userName : string;
    email : string;
    password? : string;
    socialProvider? : string;
    socialId? : string;
    createdAt : Date;
    updatedAt : Date;
    refreshToken?: string | null;
    goalDate?: Date;
    onboardingCompleted?: boolean;
    currentWeek?: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}