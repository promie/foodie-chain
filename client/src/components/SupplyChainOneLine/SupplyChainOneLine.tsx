import React, { FC } from 'react'
import './supplyChainOneLine.css'
import { ISupplyChainOneLine } from '../../interfaces/contract'
import { StepperNav } from "vertical-stepper-nav";

const SupplyChainOneLine: FC<ISupplyChainOneLine> = ({
  farmerAddress,
  manufacturerAddress,
  distributorAddress,
  retailerAddress,
  ConsumerAddress,
  statusType,
}) => {
  console.log("statusType", statusType)
  return (

    <div style={{ marginLeft: 60 }}>
      <h2 style={{ color: "red" }} >{statusType == 5 ? "RECALL" : ""}</h2>
      {" "}
      <StepperNav
        steps={[

          {
            stepContent: () => <div style={{ fontSize: 20 }}>Farmer
              <div style={{ fontSize: 20 }}>Address: {farmerAddress}</div>
            </div>,
            stepStatusCircleSize: 36,
            stepStateColor: (statusType == 0 ? "red" : (statusType > 0 ? statusType == 5 ? farmerAddress != "0x0000000000000000000000000000000000000000" ? "orange" : "gray" : "green" : "gray"))
          },
          {
            stepContent: () => <div style={{ fontSize: 20 }}>Manufacturer
              <div style={{ fontSize: 20 }}>Address: {manufacturerAddress}</div>
            </div>
            ,
            stepStatusCircleSize: 36,
            stepStateColor: statusType == 1 ? "red" : statusType > 1 ? statusType == 5 ? manufacturerAddress != "0x0000000000000000000000000000000000000000" ? "orange" : "gray" : "green" : "gray"
          },
          {
            stepContent: () => <div style={{ fontSize: 20 }}>Logistic
              <div style={{ fontSize: 20 }}>Address: {distributorAddress}</div>
            </div>,
            stepStatusCircleSize: 36,
            stepStateColor: statusType == 2 ? "red" : statusType > 2 ? statusType == 5 ? distributorAddress != "0x0000000000000000000000000000000000000000" ? "orange" : "gray" : "green" : "gray"
          },
          {
            stepContent: () => <div style={{ fontSize: 20 }}>Retailer
              <div style={{ fontSize: 20 }}>Address: {retailerAddress}</div>
            </div>,
            stepStatusCircleSize: 36,
            stepStateColor: statusType == 3 ? "red" : statusType > 3 ? statusType == 5 ? retailerAddress != "0x0000000000000000000000000000000000000000" ? "orange" : "gray" : "green" : "gray"
          },
          {
            stepContent: () => <div style={{ fontSize: 20 }}>Consumer
              <div style={{ fontSize: 20 }}>Address: {ConsumerAddress}</div>
            </div>,
            stepStatusCircleSize: 36,
            stepStateColor: statusType == 4 ? "red" : statusType > 4 ? statusType == 5 ? ConsumerAddress != "0x0000000000000000000000000000000000000000" ? "orange" : "gray" : "green" : "gray"
          }

        ]}
      />
    </div>

  )

}

export default SupplyChainOneLine
