import React, { Component } from 'react'
import { connect } from 'react-redux'
;
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'universal-cookie';

export class BasicElements extends Component {
    constructor(props) {
        super(props)
        this.state = { nome: '', data: [] }

        this.handlechange = this.handlechange.bind(this);

    }

    handlechange(e) {
        this.setState({ nome: e.target.value })
    }


    handleSubmit = event => {
        event.preventDefault();
        const { id } = this.props.match.params
        const fields = {
            nome: this.state.nome,
        }
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        
        if (id !== undefined) {
            axios.put(this.props.apiUrl + 'cargo/'+id, fields, config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ alert: 
                    <div className="alert alert-success" role="alert">
                        Cargo atualizado com sucesso.
                     </div>  
                })
                
            }).catch(error => {
                console.log(error.response.data.error.message);
                this.setState({ alert: 
                    <div className="alert alert-danger" role="alert">
                        {error.response.data.error.message}
                     </div>  
                })
            });
        }else{
        axios.post(this.props.apiUrl + 'cargo', fields,config)

            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({
                    alert:
                        <div className="alert alert-success" role="alert">
                            Cargo cadastrado com sucesso. ID: {res.data.pkCargo}
                        </div>
                })
                this.setState({
                    nome: ''

                })
            }).catch(error => {
                console.log(error.response.data.error.message);
                this.setState({
                    alert:
                        <div className="alert alert-danger" role="alert">
                            {error.response.data.error.message}
                        </div>
                })
            });
        }
    }
    componentDidMount() {
        const { id } = this.props.match.params
        if (id !== undefined) {
            console.log(id);
            fetch(this.props.apiUrl + 'cargo/' + id,config)
                .then(response => response.json())
                .then(

                    data => this.setState({
                        nome: data.nome,
                    }));
        }
    }
    render() {

        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title">Cargo </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Cadastros</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Novo Cargo</li>
                        </ol>
                    </nav>
                </div>
                {this.state.alert}
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">

                                <form onSubmit={this.handleSubmit} className="form-sample">

                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Crie um Cargo</label>
                                                <div className="col-sm-9">
                                                    <Form.Control type="text" value={this.state.nome} onChange={this.handlechange} required />
                                                </div>
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-md-6">
                                            <button className="btn btn-primary btn-block">Salvar</button>
                                        </div>
                                        <div className="col-md-6">
                                            <button onClick={this.props.history.goBack} className="btn btn-secondary btn-block">Voltar</button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.alert}
            </div>
        )
    }
}

export default connect(store => ({ text: store.text, apiUrl: store.apiUrl }))(BasicElements)
