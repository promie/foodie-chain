import React, { useContext, useState } from 'react'
import ProfileContextProvider, {
  ProfileContractContext,
} from '../../contexts/ProfileContract'

const ProfileContract = () => {
  const { profileContract } = useContext(ProfileContractContext)
  const [value, setValue] = useState('')

  console.log('profileContract', profileContract)

  const example = async () => {
    const regAddr = await profileContract?.methods.regulatorAddress().call()
    setValue(regAddr)
  }

  return (
    <div>
      <h3>TEST COMPONENT TO SEE IF WE CAN CONNECT TO PROFILE CONTRACT</h3>
      <div>The stored value is: {value}</div>
      <p>Click here to run the contract↓</p>
      <button onClick={example}>click</button>
    </div>
  )
}

export default () => (
  <ProfileContextProvider>
    <ProfileContract />
  </ProfileContextProvider>
)
