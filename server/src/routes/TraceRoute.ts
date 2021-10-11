import express from 'express'
import TraceController from '../controllers/TraceController'

const router = express.Router()

router.route('/trace/:productId(\\d+)').post(TraceController.log)

export default router
