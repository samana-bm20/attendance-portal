import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4" style={{fontSize: 'small', display: 'flex', justifyContent: 'center'}}>
      <div>
          ESTD.
        <span className="ms-1">&copy; 1993</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Technology Powered by ML Infomap</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
