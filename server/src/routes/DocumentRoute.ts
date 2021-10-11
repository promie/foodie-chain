import express from 'express'
import { DocumentController } from '../controllers'
import multer = require('multer')

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

router.route('/').post(DocumentController.uploadDocument)
router
  .route('/hash')
  .post(upload.single('document'), DocumentController.getDocumentHash)
router.route('/status').get(DocumentController.getDocumentsByStatus)
router
  .route('/verify/')
  .patch(DocumentController.updateDocStatusByAccIdSubDocId)

export default router
