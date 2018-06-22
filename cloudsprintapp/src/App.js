import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button'
class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
            hit: []
        }
    }

    componentDidMount(){
        fetch('http://127.0.0.1:5005/api/audio',
            {
                crossDomain: true,
                method: 'GET',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })
        .then(result => result.json())
        .then(jsondata => {
            console.log(jsondata)
            this.setState({hits: jsondata.hits, loading: false})
        });
    // request('http://104.198.254.220:9200/_search?q=bike', (error, response, body) => {
    //     console.log(response);
    // })
    }


  render() {
    var hits = this.state.hits;
    return (
        <section className="main-controls">
              <div id="buttons">
                  <Button className="record">Push to Talk</Button>
              </div>
              <a id="downloadblob">Download the clip</a>
              <p id="productdescription"></p>
              <ul>
                  
                  {this.state.loading == false ? this.state.hits.hits.map((name, index) => {
                      return <li key= {index}>{name['_id']},{name['_score']}</li>;
                  }) : ""}

              </ul>
        </section>
        
    //   <a-scene embedded arjs='sourceType: webcam;'> 
          
    //   {/* <!-- <a-box position='0 0.5 0' material='opacity: 0.5;'></a-box> --> */}
    //   <a-assets> 
    //       <a-asset-item id="myModelObj" src="chr_knight.obj"></a-asset-item> 
    //       <a-asset-item id="myModelMtl" src="chr_knight.mtl"></a-asset-item> 
    //   </a-assets> 
    //   <a-entity scale=".05 .05 .05" rotation="270 0 0" position='0 0.5 -0.5' obj-model="obj: #myModelObj; mtl: #myModelMtl"></a-entity>  -->
    //   <a-marker-camera preset='kanji'></a-marker-camera> 
    //   </a-scene> 
    );
  }
}

export default App;
