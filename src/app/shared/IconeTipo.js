
import React, { Component } from 'react'

export const IconeTipo = value => {
    
    if(value.tipo === 1) {
        return <i className="mdi mdi-text"></i>;
    }else if(value.tipo === 2) {
        return <i className="mdi mdi-video"></i>;
    }else{
        return <i className="fa fa-question"></i>;
    }
}



