
import React, { Component } from 'react';
import { onStatus } from "../cadastros/ferias/Ferias";

export const Status = value => {
    
    if(value.tipo === 1) {
        return <button type="button" class="btn btn-secondary"  onClick={() => { this.onStatus(value.id); }}>Pendente</button>;
    }else if(value.tipo === 2) {
        return <button type="button" class="btn btn-warning"  onClick={() => { this.onStatus(value.id); }}>Em Análise</button>;
    }else if(value.tipo === 3) {
        return <button type="button" class="btn btn-success"  onClick={() => { this.onStatus(value.id); }}>Aprovado</button>;
    }else{
        return <button type="button" class="btn btn-danger"  onClick={() => { this.onStatus(value.id); }}>Reprovado</button>;
    }
}







