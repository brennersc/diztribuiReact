import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import Spinner from "../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export class BasicElements extends Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    this.state = {
      loading: true,
      nome: "",
      data: [],
      empresas: [],
      admin: cookies.get("admin"),
      titulo: null,
      mensagem: null,
      fkSetor: null,
      fkUsuario: null,
      grupo: null,
      fkEmpresa: null,
    };

    this.handlechangeTitulo = this.handlechangeTitulo.bind(this);
    this.handlechangeMensagem = this.handlechangeMensagem.bind(this);
    this.handlechangeSetor = this.handlechangeSetor.bind(this);
    this.handlechangeUsuario = this.handlechangeUsuario.bind(this);
    this.handlechangeGrupo = this.handlechangeGrupo.bind(this);
    this.handlechangeEmpresa = this.handlechangeEmpresa.bind(this);
    this.onClick = this.onClick.bind(this)
  }
  onClick() {
    this.dialog.showAlert('Hello Dialog!')
  }
  handlechangeTitulo(e) {
    this.setState({ titulo: e.target.value });
  }
  handlechangeMensagem(e) {
    this.setState({ mensagem: e.target.value });
  }
  handlechangeSetor(e) {
    this.setState({ fkSetor: e.target.value });
  }
  handlechangeUsuario(e) {
    this.setState({ fkUsuario: e.target.value });
  }
  handlechangeGrupo(e) {
    this.setState({ grupo: e.target.value });
  }
  handlechangeEmpresa(e) {
    this.setState({ fkEmpresa: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id } = this.props.match.params;
    const fields = {
      titulo: this.state.titulo,
      mensagem: this.state.mensagem,
      fkSetor: null,
      fkUsuario: null,
      grupo: this.state.grupo,
      fkEmpresa: this.state.fkEmpresa,
    };
    const cookies = new Cookies();
    var token = cookies.get('token')
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    console.log(fields);
    if (id !== undefined) {
      axios
        .put(this.props.apiUrl + "alertas/" + id, fields, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast("Alerta atualizado com sucesso. ID: " + res.data.pkAlerta, "sucesso")
        })
        .catch((error) => {
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
        });
    } else {
      axios
        .post(this.props.apiUrl + "alertas", fields, config)

        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast('Alerta enviado com sucesso. ID: ' + res.data.pkAlerta, "sucesso");
          this.setState({
            titulo: "",
            mensagem: "",
            fkEmpresa: 0,
          });
        })
        .catch((error) => {
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
        });
    }
  };
  carregarEmpresas() {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    fetch(this.props.apiUrl + "empresa",config)
      .then((response) => response.json())
      .then((empresas) => this.setState({ empresas, loading: false }));
  }
  componentDidMount() {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    this.carregarEmpresas();
    console.log("URL" + this.props.apiUrl);
    const { id } = this.props.match.params;
    if (id !== undefined) {
      console.log(id);
      fetch(this.props.apiUrl + "alertas/" + id,config)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            titulo: data.titulo,
            mensagem: data.mensagem,
            grupo: data.grupo,
            fkEmpresa: data.fkEmpresa,
            loading: false
          })
        );
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
    this.empresas = this.state.empresas.map((item) => (
      <option value={item.pkEmpresa}>{item.razaoSocial}</option>
    ));
    let loading = this.state.loading;
    return (

      <div>
        <Spinner hide={!loading} />
        <div className={loading ? 'd-none' : ''}>
          <div className="page-header">
            <h3 className="page-title">Alerta </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/alertas">Alertas</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Novo Alerta
              </li>
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
                      <div
                        className={this.state.admin == 1 ? "col-md-4" : "d-none"}
                      >
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control
                              as="select"
                              value={this.state.data.fkEmpresa}
                              onChange={this.handlechangeEmpresa}
                            >
                              <option value="null">Todas as empresas</option>
                              {this.empresas}
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                      <div
                        className={
                          this.state.admin == 1 ? "col-md-4" : "col-md-6"
                        }
                      >
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control
                              as="select"
                              value={this.state.data.grupo}
                              onChange={this.handlechangeGrupo}
                            >
                              <option value="null">Todos os grupos de usuarios</option>
                              <option value="1">Gestores master</option>
                              <option value="2">Gestores</option>
                              <option value="3">Usuarios</option>
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                      <div
                        className={
                          this.state.admin == 1 ? "col-md-4" : "col-md-6"
                        }
                      >
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control
                              placeholder="Titulo da mensagem"
                              type="text"
                              value={this.state.titulo}
                              onChange={this.handlechangeTitulo}
                              required
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <Form.Group className="row">
                          <div className="col-sm-12">
                            <Form.Control
                              placeholder="Texto da mensagem"
                              as="textarea"
                              rows="10"
                              value={this.state.mensagem}
                              onChange={this.handlechangeMensagem}
                              required
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <button className="btn btn-primary btn-block">
                          Enviar
                      </button>
                      </div>
                      <div className="col-md-6">
                        <a
                          type="button"
                          href="/alertas"
                          className="btn btn-secondary btn-block"
                        >
                          Voltar
                      </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicElements
);
