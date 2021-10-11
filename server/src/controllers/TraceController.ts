import { Request, Response, NextFunction } from 'express'
import httpStatus = require('http-status')
import { catchAsync } from '../utils'
import TraceService from '../services/TraceService'

const log = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { productId } = req.params;

    const logs = await TraceService.getProductLocationLogs( parseInt( productId ) );

    return res.status(httpStatus.OK).json({
      success: true,
      logs
    });
  }
)

export default {
  log,
}
