import { Schema, model, models } from 'mongoose';

/** MongoDB User document schema */
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  givenName: String,
  surname: String,
  imageURL: String,
  memberships: [ {
    clubID: { type: Schema.Types.ObjectId, ref: 'BookClub' },
    joined: {
      type: Date,
      default: Date.now,
      required: true
    },
    departed: Date,
    role: {
      type: String,
      enum: [ 'OWNER', 'ADMIN', 'READER', 'PARTICIPANT', 'OBSERVER' ]
    }
  } ]
});

const User = models.User || model('User', userSchema);

export default User;