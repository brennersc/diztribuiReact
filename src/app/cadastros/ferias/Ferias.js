import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Spinner from "../../shared/Spinner";
import Dialog from 'react-bootstrap-dialog';
import { Form } from "react-bootstrap";
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Status } from '../../shared/Status';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from 'universal-cookie';
export class BasicTable extends Component {

    constructor(props) {
        const cookies = new Cookies();
        const admin = cookies.get("admin");
        const gestor = cookies.get("gestor");
        const master = cookies.get("master");

        super(props);
        this.state = {
            status: [],
            data: [],
            loading: true,
            fkStatus: null,
            dataInicio: null,
            dataFinal: null,
            master: master,
            admin: admin,
            gestor: gestor,
            show: false,
            resposta: null
        };
        this.handleModal = this.handleModal.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onChangeResposta = this.onChangeResposta.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    onClick(id) {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'ferias/' + id, config)
            .then(response => response.json())
            .then(
                data => this.setState({
                    dataInicio: data.dataInicio,
                    dataFinal: data.dataFinal,
                }));

        this.dialog.show({
            title: 'Deseja excluir esta solicitação?',
            body: 'Inicio ' + this.state.dataInicio + ' -  Final ' + this.state.dataFinal,
            actions: [
                Dialog.CancelAction(),
                Dialog.OKAction(() => {
                    this.excluir(id);
                })
            ],
            bsSize: 'small',
            onHide: (dialog) => {
                dialog.hide()
                console.log('closed by clicking background.')
            }
        });
    }
    excluir(id) {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        axios.delete(this.props.apiUrl + 'ferias/' + id, config)

            .then(res => {
                console.log(res);
                console.log(res.data);
                this.showToast("Solicitação excluida com sucesso. ID: " + res.data.pkFerias, "sucesso")
                this.carregaDados();
            }).catch((error) => {
                if (error.response.data) {
                    this.showToast(error.response.data.error.message, "erro");
                } else {
                    this.showToast(error.message, "erro");
                }
            });
    }
    showToast(msg, tipo) {
        if (tipo === "sucesso") {
            toast.success(msg);
        } else {
            toast.error(msg);
        }
    }

    carregaStatus() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'status', config)
            .then(response => response.json())
            .then(status => this.setState({ status, loading: false }));
    }

    carregaDados() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'ferias', config)
            .then(response => response.json())
            .then(data => this.setState({ data, loading: false }));
    }

    handleModal(id) {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'ferias/' + id, config)
            .then(response => response.json())
            .then(data => this.setState({ modal: true, id: id, loading: false, resposta: data.resposta }));
    }
    //Fechar modal
    handleClose(e) {
        this.setState({ modal: false })
    }
    onChangeResposta(e) {
        this.setState({ resposta: e.target.value })
    }

    handleSubmitTexto = event => {
        event.preventDefault();
        const fields = {
            resposta: this.state.resposta,
        };
        const cookies = new Cookies();
        var token = cookies.get('token')
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.put(this.props.apiUrl + "ferias/" + this.state.id, fields, config)
            .then(res => {
                this.showToast('Resposta enviada com sucesso. ID: ' + res.data.pkFerias, "sucesso");
                this.setState({
                    resposta: '',
                    modal: false
                })
            }).catch((error) => {
                if (error.response.data) {
                    this.showToast(error.response.data.error.message, "erro");
                } else {
                    this.showToast(error.message, "erro");
                }
            });
    }

    handleBlur(id, e) {
        const fields = {
            fkStatus: e.target.value,
        };
        const cookies = new Cookies();
        var token = cookies.get('token')
        let config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.put(this.props.apiUrl + "ferias/" + id, fields, config)
            .then(res => {
                this.showToast('Status alterado com sucesso.', "sucesso");
            }).catch((error) => {
                if (error.response.data) {
                    this.showToast(error.response.data.error.message, "erro");
                } else {
                    this.showToast(error.message, "erro");
                }
            });
    }

    componentDidMount() {
        this.carregaStatus();
        this.carregaDados();
    }

    render() {

        this.status = this.state.status.map((item) =>
            <option value={item.pkStatus} >{item.descricao}</option>
        );

        this.ferias = this.state.data.map((item) => (

            <tr key={item.pkFerias}>

                <td className="py-1">
                    {Date(item.dataInicio).substr(3, 12).split('-').reverse().join('/')}
                </td>
                <td className="py-1">
                    {Date(item.dataFinal).substr(3, 12).split('-').reverse().join('/')}
                </td>
                <td className="py-1">
                    {
                        this.state.master === "false" ?
                            item.status.descricao
                            :
                            <Form.Control as="select" onBlur={(e) => { this.handleBlur(item.pkFerias, e) }} required>
                                <option selected value={item.fkStatus} required>{item.status.descricao}</option>
                                {this.status}
                            </Form.Control>
                    }
                </td>
                {
                    this.state.master === "false" ?
                        <td>
                            {item.resposta === null ? null : item.resposta.substring(0, 30) + '... '}
                            <a className={item.resposta === null ? 'd-none' : ''} href="javascript:void(0)" onClick={() => { this.handleModal(item.pkFerias); }}> Ver</a>
                        </td>
                        :
                        <td>
                            <button onClick={() => { this.handleModal(item.pkFerias); }} className="btn btn-secondary">Responder <i className="fa fa-mail-forward"></i></button>
                        </td>
                }
                <td>
                    <div className="btn-group">
                        <a className="btn btn-light" href={"ferias/edit/" + item.pkFerias}>Editar <i className="mdi mdi-square-edit-outline"></i></a>
                        <button onClick={() => { this.onClick(item.pkFerias); }} className="btn btn-secondary">Excluir <i className="mdi mdi-delete"></i></button>
                    </div>
                </td>
            </tr>
        ));
        let loading = this.state.loading;
        return (
            <div>
                <div>
                    <Dialog ref={(component) => { this.dialog = component }} />
                </div>
                <Spinner hide={!loading} />
                <div className={loading ? 'd-none' : ''}>
                    <div className="page-header mb-2">
                        <h3 className="page-title"> Solicitações de férias </h3>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item active" aria-current="page">Férias</li>
                            </ol>
                        </nav>
                    </div>

                    <div className="row mt-2">
                        <div className="col-lg-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-md-2"><a href="ferias/add" className="btn btn-success btn-block"><i className="mdi mdi-plus-box"></i> Solicitar</a></div>
                                    <div className="table-responsive">

                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Data Inicio</th>
                                                    <th>Data Final</th>
                                                    <th>Status</th>
                                                    <th>Resposta</th>
                                                    <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.ferias}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal texto */}
                <Modal show={this.state.modal} onHide={this.handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <div className={this.state.master === "true" ? 'd-block' : 'd-none'}>
                            <Modal.Title>Enviar Resposta para o Solicitante</Modal.Title>
                        </div>
                        <div className={this.state.master === "false" ? 'd-block' : 'd-none'}>
                            <Modal.Title>Resposta da Gestão</Modal.Title>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className={this.state.master === "true" ? 'd-block' : 'd-none'}>
                            <form onSubmit={this.handleSubmitTexto} className="form-sample">
                                <Form.Group controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Resposta</Form.Label>
                                    <Form.Control type='hidden' value={this.state.id} />
                                    <Form.Control as="textarea" value={this.state.resposta} onChange={this.onChangeResposta} rows="10" />
                                </Form.Group>
                                <Button className="float-right" variant="primary" type='submit'>Salvar</Button>
                            </form>
                        </div>
                        <div className={this.state.master === "false" ? 'd-block' : 'd-none'}>
                            {this.state.resposta}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="float-left" variant="secondary" onClick={this.handleClose}>Fechar</Button>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }
}


export default connect(store => ({ text: store.text, apiUrl: store.apiUrl }))(BasicTable)
