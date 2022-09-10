import React from 'react';
import Spinner from 'react-spinkit';

const Loading = () => {

  return (
        <div style={{display:'flex',justifyContent:'center',padding:'5% 0%'}}>
            <Spinner name="ball-pulse-sync" fadeIn='none'/>
        </div>
  );
}

export default Loading;