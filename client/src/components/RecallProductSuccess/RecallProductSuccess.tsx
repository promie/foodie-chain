import React, { FC } from 'react'
import './recallproductsuccess.css'

interface IRecallProductSuccessProps {
  productId: number
  // hashContent: string
  backToRecallProduct: () => void
}

const RecallProductSuccess: FC<IRecallProductSuccessProps> = ({
  productId,
  //hashContent,
  backToRecallProduct,
}) => {
  return (
    <div className="upload-success mb-3">
      <div className="icon-text upload-check-icon">
        <span className="icon has-text-success">
          <i className="fas fa-check-circle" />
        </span>
      </div>
      <div className="mt-5">
        <div className="notification is-info is-light upload-notification">
          <div>Congratulations!</div>
          <div>
            The product <strong>{productId}</strong> recall was successful.
          </div>
          <div className="mt-5">
            Your product is currently in recalling.
          </div>
          {/* <div className="hash-content mt-3">
            <strong>{hashContent}</strong>
          </div> */}
        </div>
      </div>

      <div className="mt-3">
        <button className="button is-link" onClick={() => backToRecallProduct()}>
          Recall another product
        </button>
      </div>
    </div>
  )
}

export default RecallProductSuccess
