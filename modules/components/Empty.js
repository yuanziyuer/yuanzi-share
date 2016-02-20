/**
 * Created by diwu on 2/20/16.
 */
import React, { Component } from 'react';
class Empty extends Component {

  render() {
    let style = {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '100px'
    };
    return(
      <div style={style}>
        <img src={require('./images/404_page_image@2x.png')} alt="" style={{ width: '253px', height: '253px', marginTop: '100px' }}/>
        <div style={{ marginTop: '30px', fontSize: '15px', color: '#666666' }}>oh~当前妙招已失效</div>
      </div>
    );
  }

}

export default Empty;
