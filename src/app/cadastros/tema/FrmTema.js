import React, { Component } from 'react'
import { connect } from 'react-redux'
;
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'universal-cookie';


export class BasicElements extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nomearea: '',
            responsavelarea: ''   
        }


        this.onChangeNomeArea = this.onChangeNomeArea.bind(this);
        this.onChangeResponsavelArea = this.onChangeResponsavelArea.bind(this);

    }


    //Validações Campos do formulario
    onChangeNomeArea(e) {
        this.setState({ nomearea: e.target.value })
    }
    onChangeResponsavelArea(e) {
        this.setState({ responsavelarea: e.target.value })
    }

    handleSubmit = event => {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        event.preventDefault();
        const { id } = this.props.match.params
        const fields = {
            NomeArea: this.state.nomearea,
            ResponsavelArea: this.state.responsavelarea,
        }


        if (id !== undefined) {
            axios.put(this.props.apiUrl + 'area/'+id, fields,config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ alert: 
                    <div className="alert alert-success" role="alert">
                        Área atualizada com sucesso.
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
            axios.post(this.props.apiUrl + 'area', fields,config)
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ alert: 
                    <div className="alert alert-success" role="alert">
                        Área cadastrada com sucesso. ID: {res.data.pkArea}
                     </div>  
                })
                this.setState({
                    data: [],
                    nomearea: '',
                    responsavelarea: ''                   
                })
            }).catch(error => {
                console.log(error.response.data.error.message);
                this.setState({ alert: 
                    <div className="alert alert-danger" role="alert">
                        {error.response.data.error.message}
                     </div>  
                })
            });
        }
    }

    componentDidMount() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        const { id } = this.props.match.params
        if (id !== undefined) {
            console.log(id);
            fetch(this.props.apiUrl + 'area/' + id,config)
                .then(response => response.json())
                .then(data => this.setState({                    
                    data: [],
                    nomearea: data.NomeArea,
                    responsavelarea: data.ResponsavelArea 
                }));

        }

    }
    render() {

        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title">Área </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/cadastros/area">Área</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Nova Área</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">

                                <form onSubmit={this.handleSubmit} className="form-sample">

                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Nome da Área</label>
                                                <div className="col-sm-9">
                                                    <Form.Control type="text" value={this.state.nomearea} onChange={this.onChangeNomeArea} required />
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Responsavel pela Área</label>
                                                <div className="col-sm-9">
                                                    <Form.Control type="text" value={this.state.responsavelarea} onChange={this.onChangeResponsavelArea} required/>
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
