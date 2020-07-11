import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import { cnpjMask } from '../../shared/CnpjMask'
import { cepMask } from '../../shared/CepMask'
import { telefoneMask } from '../../shared/TelefoneMask'
import { numeroMask } from '../../shared/NumeroMask'
import { validaCNPJ } from '../../shared/ValidaCnpj'
import axios from 'axios';
import Cookies from 'universal-cookie';
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
export class BasicElements extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            isInputDisabled: true,
            cnpj: '',
            cep: '',
            telefone: '',
            numero: '',
            razaosocial: '',
            nomefantasia: '',
            logradouro: '',
            complemento: '',
            estado: '',
            alert: ''
        }

        this.onChangeCnpj = this.onChangeCnpj.bind(this);
        this.onChangeCep = this.onChangeCep.bind(this);
        this.onChangeTelefone = this.onChangeTelefone.bind(this);
        this.onChangeNumero = this.onChangeNumero.bind(this);
        this.onChangeRazaoSocial = this.onChangeRazaoSocial.bind(this);
        this.onChangeNomeFantasia = this.onChangeNomeFantasia.bind(this);
        this.onChageLogradouro = this.onChageLogradouro.bind(this);
        this.onChangeComplemento = this.onChangeComplemento.bind(this);
        this.onChangeEstado = this.onChangeEstado.bind(this);
        this.onChangeCidade = this.onChangeCidade.bind(this);
    }

    onChangeCnpj(e) {

        this.setState({ cnpj: cnpjMask(e.target.value) })

        if (validaCNPJ(e.target.value)) {
            e.target.className = "form-control is-valid";
        } else {
            e.target.className = "form-control is-invalid";
        }

    }
    onChangeCep(e) {

        this.setState({ cep: cepMask(e.target.value) })
        if (String(e.target.value).length === 9) {
            const cookies = new Cookies();
            var token = cookies.get('token')
            let config = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }

            fetch(this.props.apiUrl + 'cep/' + e.target.value, config)
                .then(response => response.json())
                .then(data => {
                    if(data.length > 1) {
                        this.setState({
                            isInputDisabled: false,
                            logradouro: '',
                            cidade: '',
                            estado: '',
                        })
                    } else {
                        this.setState({
                            isInputDisabled: true,
                            logradouro: data.logradouro,
                            cidade: data.cidade,
                            estado: data.uf,
                        })
                    }

                });

        }
    }
    onChangeTelefone(e) {
        this.setState({ telefone: telefoneMask(e.target.value) })
    }
    onChangeNumero(e) {
        this.setState({ numero: numeroMask(e.target.value) })
    }
    onChangeRazaoSocial(e) {
        this.setState({ razaosocial: e.target.value })
    }
    onChangeNomeFantasia(e) {
        this.setState({ nomefantasia: e.target.value })
    }
    onChageLogradouro(e) {
        this.setState({ logradouro: e.target.value })
    }
    onChangeComplemento(e) {
        this.setState({ complemento: e.target.value })
    }
    onChangeEstado(e) {
        this.setState({ estado: e.target.value })
    }
    onChangeCidade(e) {
        this.setState({ cidade: e.target.value })
    }
    handleSubmit = event => {
        event.preventDefault();
        const { id } = this.props.match.params
        const fields = {
            razaoSocial: this.state.razaosocial,
            cnpj: this.state.cnpj,
            nomeFantasia: this.state.nomefantasia,
            endereco: this.state.logradouro,
            complemento: this.state.complemento,
            estado: this.state.estado,
            cidade: this.state.cidade,
            telefone: this.state.telefone,
            cep: this.state.cep,
            numero: this.state.numero,
        }
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        if (id !== undefined) {
            axios.put(this.props.apiUrl + 'empresa/' + id, fields, config)
                .then((res) => {
                    console.log(res);
                    console.log(res.data);
                    this.showToast("Empresa atualizada com sucesso. ID: " + res.data.pkEmpresa,"sucesso");
                })
                .catch(error => {
                    if(error.response.data) {           
                        this.showToast(error.response.data.error.message,"erro");  
                      }else{            
                        this.showToast(error.message,"erro");  
                      }
                });
        } else {
            axios.post(this.props.apiUrl + 'empresa', fields, config)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    this.showToast('Empresa cadastrada com sucesso. ID: ' + res.data.pkEmpresa,"sucesso");
                    this.setState({
                        cnpj: '',
                        cep: '',
                        telefone: '',
                        numero: '',
                        data: [],
                        razaosocial: '',
                        nomefantasia: '',
                        logradouro: '',
                        complemento: '',
                        estado: ''
                    })
                }).catch(error => {
                    if(error.response.data) {            
                        this.showToast(error.response.data.error.message,"erro");  
                      }else{              
                        this.showToast(error.message,"erro");  
                      }
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
            fetch(this.props.apiUrl + 'empresa/' + id, config)
                .then(response => response.json())
                .then(
                    data => this.setState({                        
                        cnpj: data.cnpj,
                        telefone: data.telefone,
                        numero: data.numero,
                        data: [],
                        razaosocial: data.razaoSocial,
                        nomefantasia: data.nomeFantasia,
                        logradouro: data.endereco,
                        complemento: data.complemento,
                        estado: data.estado,
                        cep: data.cep,
                        cidade: data.cidade,
                        loading: false
                    }));
        }else{
            this.setState({ loading: false });
        }
    }
    showToast(msg, tipo) {
        if (tipo == "sucesso") {
          toast.success(msg);
        } else {
          toast.error(msg);
        }
      }
    render() {
        let loading = this.state.loading;
        return (
            <div>
                <Spinner hide={!loading} />
                <div className={loading ? 'd-none' : ''}>
                    <div className="page-header">
                        <h3 className="page-title">Empresa </h3>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/cadastros/empresa">Empresa</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Nova Empresa</li>
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
                                                    <label className="col-sm-3 col-form-label">Razão Social</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.razaosocial} onChange={this.onChangeRazaoSocial} required />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Nome Fantasia</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.nomefantasia} onChange={this.onChangeNomeFantasia} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">CNPJ</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.cnpj} onChange={this.onChangeCnpj} required />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Telefone</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.telefone} onChange={this.onChangeTelefone} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </div>
                                        <p className="card-description"> Endereço </p>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Cep</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.cep} onChange={this.onChangeCep} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Logradouro</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control value={this.state.logradouro} onChange={this.onChageLogradouro}  disabled={this.state.isInputDisabled} type="text" />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Numero</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.numero} onChange={this.onChangeNumero} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Complemento</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" value={this.state.complemento} onChange={this.onChangeComplemento} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Estado</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" disabled={this.state.isInputDisabled} value={this.state.estado} onChange={this.onChangeEstado} />
                                                    </div>
                                                </Form.Group>
                                            </div>
                                            <div className="col-md-6">
                                                <Form.Group className="row">
                                                    <label className="col-sm-3 col-form-label">Cidade</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" id="Cidade" value={this.state.cidade} onChange={this.onChangeCidade} disabled={this.state.isInputDisabled} />
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
                </div>
            </div>
        )
    }
}

export default connect(store => ({ text: store.text, apiUrl: store.apiUrl }))(BasicElements)
