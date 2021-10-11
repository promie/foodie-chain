import React, { FC, useState, ChangeEvent, useContext } from 'react'
import MainNavbar from '../../../components/MainNavBar'
import { TraceContractAPIContext } from '../../../contexts/TraceContractAPI'
import { TraceContractContext } from '../../../contexts/TraceContract'
import { ProductContractContext } from '../../../contexts/ProductContract'
//import getWeb3 from '../../utils/getWeb3'
import useWeb3 from '../../../hooks/web3'
import getAccounts from '../../../utils/getAccounts'
import { ProductStatus } from '../../../enums/contract'

//import api from '../../api'

//import { IProductLocation } from '../../interfaces/trace'

const Track: FC = () => {
  const { accounts } = useWeb3()
  const [inputProductId, setInputProductId] = useState<number>(0)
  const [isLocationRequest, setIsLocationRequested] = useState<boolean>(false)
  //const {  accounts } = useContext(ProfileContractContext)
  const { logs, queryLogs } = useContext(TraceContractAPIContext)
  const { traceContract } = useContext(TraceContractContext)
  const { productContract } = useContext(ProductContractContext)
  const [requestButtonText, setRequestButtonText] = useState<string>(
    'Request location'
  )
  const [showTable, setShowTable] = useState<boolean>(false)
  const [productDetails, setProductDetails] = useState({
    productId: -1,
    productName: '',
    status: '',
  })

  const queryProductInfo = async (productId: number) => {
    //const { accountAddress, accountName, accountType } = data
    //setIsLoading(true)
    //setShowErrorNotice(false)

    try {
      const _accounts = await getAccounts(accounts)
      const resp = await productContract?.methods
        .products(productId)
        .call({ from: _accounts[0] })

      if (resp && resp.productId !== '0') {
        setProductDetails({
          productId: resp.productId,
          productName: resp.productName,
          status: ProductStatus[resp.statusType],
        })
        setShowTable(true)
      } else {
        setShowTable(false)
      }
    } catch (error) {}

    // try {
    //   const _accounts = await getAccounts(accounts)
    //   const resp = await traceContract?.methods
    //     .tracks(productId)
    //     .call({ from: _accounts[0] })

    //   if (resp && resp.trackingNumber !== '') {
    //     web3?.eth.getBlockNumber((err: any, blockNumber: number) => {
    //       if (resp.nextRequestForLocationBlockNumber > blockNumber) {
    //         setIsLocationRequested(true)
    //         setRequestButtonText(
    //           `Please wait for ${
    //             (resp.nextRequestForLocationBlockNumber - blockNumber)
    //           } blocks`
    //         )
    //       } else {
    //         setIsLocationRequested(false)
    //         setRequestButtonText('Request location')
    //       }
    //     })
    //   } else {
    //     setIsLocationRequested(true)
    //         setRequestButtonText('Request location')
    //   }
    // } catch(error) { console.log(error); }
  }

  const handleRequestLocation = async (e: any) => {
    e.preventDefault()

    //const { accountAddress, accountName, accountType } = data
    //setIsLoading(true)
    //setShowErrorNotice(false)

    try {
      const _accounts = await getAccounts(accounts)
      const resp = await traceContract?.methods
        .requestForLocation(inputProductId)
        .send({ from: _accounts[0] })

      if (resp) {
        console.log(resp)
        alert('REQUESTED')
        setIsLocationRequested(true)
        console.log(resp)
      }
    } catch (error) {}
  }

  return (
    <>
      <section className="container has-background-light">
        <div className="columns is-multiline">
          <div className="column is-10 is-offset-2">
            <div className="columns is-multiline">
              <div className="column left mt-6 is-half">
                <h1 className="title is-4">Track Product</h1>

                <div className="mt-5">
                  <div className="is-fullwidth">
                    <input
                      className="input"
                      type="number"
                      min="1"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsLocationRequested(false)
                        setInputProductId(parseInt(e.target.value))
                        queryProductInfo(parseInt(e.target.value))
                        queryLogs(parseInt(e.target.value))
                      }}
                      placeholder="Product ID"
                    />
                  </div>
                  <button
                    className="button is-link mt-3"
                    disabled={inputProductId === 0}
                    onClick={(e) => {
                      e.preventDefault()
                      queryLogs(inputProductId)
                    }}
                  >
                    Get location logs
                  </button>
                  <button
                    className="button is-link mt-3 ml-3"
                    disabled={inputProductId === 0 || isLocationRequest}
                    onClick={(e) => {
                      e.preventDefault()
                      handleRequestLocation(e)
                    }}
                  >
                    {requestButtonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-10 is-offset-1 is-offset-0 pl-3 pr-3">
            {showTable && (
              <div className="is-success is-light mb-5">
                <div className="title is-6">
                  <strong>Product Information</strong>
                </div>

                <table className="table is-striped table-style">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{productDetails.productId}</td>
                      <td>{productDetails.productName}</td>
                      <td>{productDetails.status}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className="columns is-multiline">
          <div className="column is-10 is-offset-1 is-offset-0 pl-3 pr-3">
            <table className="table">
              <tr>
                <th></th>
                <th>Block Number</th>
                <th>Time</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
              {logs.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.blockNumber}</td>
                    <td>
                      {new Date(item.timestamp).toLocaleDateString()}{' '}
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td>{item.latitude}</td>
                    <td>{item.longitude}</td>
                  </tr>
                )
              })}
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default Track
