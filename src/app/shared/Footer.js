import React, { Component } from 'react'
import { connect } from 'react-redux'
;

class Footer extends Component {
  render () {
    return (
      <footer className="footer">
        <div className="container-fluid">
          <div className="d-sm-flex justify-content-center justify-content-sm-between">
            <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">Copyright © 2020 <a href="https://www.toptecnologia.com/" target="_blank" rel="noopener noreferrer">Top Tecnologia</a>. All rights reserved.</span>
            
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;