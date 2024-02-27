import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
const LoadingSpinner = () => {
    return (
        <div  className='p-2 m-2 flex justify-center'>
            <CircularProgress color="inherit"/>
        </div>

    )
}

export default LoadingSpinner