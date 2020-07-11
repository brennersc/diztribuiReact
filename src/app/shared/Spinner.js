import React, { Component } from 'react'



export class Spinner extends Component {
  render() {
    return (
      <div className={this.props.hide?'d-none':''} >
          <div className="row">
              <div className="spinner-wrapper">
                    <div className="donut"></div>
              </div>
          </div>
          <div className="row">
              <div className="spinner-wrapper">
                  <div className="ui big text title">Carregando...</div>
              </div>
          </div>
      </div>
    )
  }
}

export default Spinner
