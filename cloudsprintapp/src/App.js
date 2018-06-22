import React, { Component, Fragment } from 'react';
import Camera from './Camera';
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
        <Fragment>
        <Camera />
        <section className="main-controls">
              <div id="buttons">
                  <Button className="record">Push to Talk</Button>
              </div>
              <a id="downloadblob">Download the clip</a>
              <p id="productdescription"></p>
              <ul>
                  
                  {this.state.loading == false ? this.state.hits.hits.map((name, index) => {
                      return <Fragment><li key= {index}>{name['_id']},{name['_score']}</li><img src={"data:image/jpeg;" + "base64," + name['_source']['base64_img']} /></Fragment>
                  }) : ""}

              </ul>
        </section></Fragment>
    );
  }
}

export default App;
