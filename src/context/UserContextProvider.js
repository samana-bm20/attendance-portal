import React, {useContext} from 'react'
import UserContext from './UserContext'

const UserContextProvider = ({children}) => {
    const [months, setMonths] = React.useState([])
  return (
    <UserContext.Provider value={{months, setMonths}}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider