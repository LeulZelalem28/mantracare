import React, { useContext, useState } from 'react'

const ProtectedRoute = ({childern, allowedRoles}) => {

    const{token, role} = useContext(authContext)
    const isAllowed = allowedRoles.include(role)
    const accessibleRoute = token && isAllowed ? children : <Navigate to="/login" replace={true} />
  return accessibleRoute 
  
}

export default ProtectedRoute