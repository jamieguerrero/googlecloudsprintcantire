import React, { Component, Fragment } from 'react';

class Camera extends Component {

    render() {
        return(
        <Fragment>
          <a-scene embedded arjs='sourceType: webcam;'> 
          
      {/* <!-- <a-box position='0 0.5 0' material='opacity: 0.5;'></a-box> --> */}
      <a-assets> 
          <a-asset-item id="myModelObj" src="./chr_knight.obj"></a-asset-item> 
          <a-asset-item id="myModelMtl" src="./chr_knight.mtl"></a-asset-item> 
      </a-assets> 
      <a-entity scale=".05 .05 .05" rotation="270 0 0" position='0 0.5 -0.5' obj-model="obj: #myModelObj; mtl: #myModelMtl"></a-entity>
      <a-marker-camera preset='kanji'></a-marker-camera> 
      </a-scene>
      </Fragment>
        )
    } 
}

export default Camera;
