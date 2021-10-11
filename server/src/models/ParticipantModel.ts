import { IParticipant } from '../interfaces/participant'
import { Model, model, Schema } from 'mongoose'
import { AccountType, AccountStatus } from '../enums/profileContract'

const ParticipantSchema: Schema = new Schema(
  {
    accountAddress: {
      type: String,
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountStatus: {
      type: Number,
      enum: Object.values(AccountStatus),
      required: true,
    },
    accountType: {
      type: Number,
      enum: Object.values(AccountType),
      required: true,
    },
  },
  { timestamps: true }
)

const Participant: Model<IParticipant> = model('Participant', ParticipantSchema)

export default Participant
