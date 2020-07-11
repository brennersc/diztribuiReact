import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from 'universal-cookie';

export class BasicElements extends Component {
    constructor(props) {
        super(props)
        this.state = { loading: true, setor: '', usuario: '', ehmaster: '', data: [], setores: [], usuarios: [] }


        this.handlechangeSetor = this.handlechangeSetor.bind(this);
        this.handlechangeUsuario = this.handlechangeUsuario.bind(this);
        this.handlechangeehmaster = this.handlechangeehmaster.bind(this);

    }


    handlechangeSetor(e) {
        this.setState({ setor: e.target.value })
    }

    handlechangeUsuario(e) {
        this.setState({ usuario: e.target.value })
    }

    handlechangeehmaster(e) {
        console.log(e.target.checked);
        this.setState({ ehmaster: e.target.checked })
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log("Master?" + this.state.ehmaster);
        const { id } = this.props.match.params
        const fields = {
            fkSetor: this.state.setor,
            fkUsuario: this.state.usuario,
            fkEmpresa: 1,
            ehmaster: this.state.ehmaster

        }

        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        if (id !== undefined) {
            axios.put(this.props.apiUrl + 'gestor/' + id, fields, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.showToast("Gestor atualizado com sucesso. ID: " + res.data.pkGestor, "sucesso")
                }).catch(error => {
                    if (error.response.data) {
                        this.showToast(error.response.data.error.message, "erro");
                    } else {
                        this.showToast(error.message, "erro");
                    }
                });
        } else {
            axios.post(this.props.apiUrl + 'gestor', fields, config)

                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.showToast('Gestor cadastrado com sucesso. ID: ' + res.data.pkGestor, "sucesso");
                    this.setState({
                        setor: '',
                        usuario: '',
                        ehmaster: ''

                    })
                }).catch(error => {
                    console.log(error.response.data.error.message);
                    if (error.response.data) {
                        this.showToast(error.response.data.error.message, "erro");
                    } else {
                        this.showToast(error.message, "erro");
                    }
                });
        }

    }

    carregarSetores() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'setor',config)
            .then(response => response.json())
            .then(setores => this.setState({ setores, loading: false }));
    }


    carregarUsuarios() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'usuario',config)
            .then(response => response.json())
            .then(usuarios => this.setState({ usuarios, loading: false }));
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
            fetch(this.props.apiUrl + 'gestor/' + id,config)
                .then(response => response.json())
                .then(

                    data => this.setState({
                        setor: data.fkSetor,
                        pkGestor: data.pkGestor,
                        usuario: data.usuario.pkUsuario,
                        ehmaster: data.ehmaster,
                        loading: false
                    }));
        }

        this.carregarSetores();
        this.carregarUsuarios();

    };
    showToast(msg, tipo) {
        if (tipo == "sucesso") {
            toast.success(msg);
        } else {
            toast.error(msg);
        }
    }
    render() {
        this.setores = this.state.setores.map((item) =>
            <option selected value={item.pkSetor}>{item.nome}</option>
        );
        this.usuarios = this.state.usuarios.map((item) =>
            <option value={item.pkUsuario}>{item.nome}</option>
        );
        let loading = this.state.loading;
        return (
            <div>
                <Spinner hide={!loading} />
                <div className={loading ? 'd-none' : ''}>
                    <div className="page-header">
                        <h3 className="page-title">Gestor </h3>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/cadastros/empresa">Gestor</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Novo Gestor</li>
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
                                                    <label className="col-sm-3 col-form-label">Usuário</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control as="select" value={this.state.usuario} onChange={this.handlechangeUsuario} required>
                                                            <option value='0'>selecione usuário</option>
                                                            {this.usuarios}
                                                        </Form.Control>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Setor</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control as="select" value={this.state.setor} onChange={this.handlechangeSetor} required>
                                                            <option value='0'>selecione setor</option>
                                                            {this.setores}
                                                        </Form.Control>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className={ this.state.admin === "1" ? "row" : "d-none" } >
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Gestor Master?</label>
                                                    <div className="col-sm-9">
                                                        <Form.Check type="checkbox" name="checkboxGmaster" checked={this.state.ehmaster} onChange={this.handlechangeehmaster} />
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
            </div>
        )
    }
}

export default connect(store => ({ text: store.text, apiUrl: store.apiUrl }))(BasicElements)
