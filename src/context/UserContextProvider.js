import React, {useContext} from 'react'
import UserContext from './UserContext'

const UserContextProvider = ({children}) => {
    const [months, setMonths] = React.useState([])
    const [employeeNames, setEmployeeNames] = React.useState([])
  return (
    <UserContext.Provider value={{months, setMonths, employeeNames, setEmployeeNames}}>
        {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider