import { Schema, model, models } from 'mongoose';

/** MongoDB User document schema */
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  providerProfiles: {
    type: Map,
    of: {
      userId: String,
      providerAccountId: String,
      name: String,
      sub: String,
      image: String
    }
  },
  memberships: [
    {
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
    }
  ]
});

const UserModel = models.User || model('User', userSchema);

export default UserModel;
