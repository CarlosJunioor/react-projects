import React from 'react';
import Spinner from 'react-spinkit';

const LoadingLight = () => {

  return (
        <div style={{display:'flex',justifyContent:'center',padding:'5% 0%'}}>
            <Spinner name="ball-pulse-sync" fadeIn='none' color='#fff' />
        </div>
  );
}

export default LoadingLight;