import { Schema, model, models } from "mongoose";

const bookClubSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  imageURL: String,
  members: [{
    userID: { type: Schema.Types.ObjectId, ref: 'User' },
    joined: {
      type: Date,
      default: Date.now,
      required: true
    },
    departed: Date,
    role: {
      type: String,
      enum: ['OWNER', 'ADMIN', 'READER', 'PARTICIPANT', 'OBSERVER']
    }
  }]
});

const BookClub = models.BookClub || model('BookClub', bookClubSchema);

export default BookClub;