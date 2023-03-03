import * as mongoose from 'mongoose';
    
export const ContactSchema = new mongoose.Schema({
  user: String,
  name: String,
  phone: {
    type: Number,
    unique: true
  }
});

