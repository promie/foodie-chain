import express from 'express'
import { ParticipantController } from '../controllers'

const router = express.Router()

router.route('/').get(ParticipantController.getAllParticipants)
router.route('/status').get(ParticipantController.getParticipantsByStatus)
router.route('/register').post(ParticipantController.register)
router.route('/:address').get(ParticipantController.getAccountTypeByAddress)

router
  .route('/:address')
  .patch(ParticipantController.updateAccountStatusByAddress)

export default router
