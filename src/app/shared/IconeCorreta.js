
import React, { Component } from 'react'

export const IconeCorreta = value => {
    console.log(value.tipo);
    if(value.tipo === true) {
        return <div className="col-md-3"><i className="fa fa-check success"></i></div>;
    }else{
        return <div className="col-md-3"><i className="fa fa-times"></i></div>;
    }
}

//onClick={this.handleTexto()} onClick={this.handleVideo()}


