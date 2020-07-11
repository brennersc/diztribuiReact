import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import Cookies from 'universal-cookie';
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
export class BasicElements extends Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    this.state = { loading: true, nome: "", data: [], empresas: [], admin: cookies.get('admin'), empresa: '' };
    this.handlechange = this.handlechange.bind(this);
    this.handlechangeEmpresa = this.handlechangeEmpresa.bind(this);
  }

  handlechange(e) {
    this.setState({ nome: e.target.value });
  }
  handlechangeEmpresa(e) {
    this.setState({ empresa: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id } = this.props.match.params;
    const fields = {
      nome: this.state.nome,
      fkEmpresa: this.state.empresa
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
        .put(this.props.apiUrl + "cargo/" + id, fields, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast("Cargo atualizado com sucesso. ID: " + res.data.pkCargo,"sucesso")
        })
        .catch((error) => {
          if(error.response.data) {           
            this.showToast(error.response.data.error.message,"erro");  
          }else{            
            this.showToast(error.message,"erro");  
          }
        });
    } else {
      axios
        .post(this.props.apiUrl + "cargo", fields, config)

        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast('Cargo cadastrado com sucesso. ID: ' + res.data.pkCargo,"sucesso");
          this.setState({
            nome: '',
            empresa: ''
          });
        })
        .catch((error) => {
            if(error.response.data) {            
              this.showToast(error.response.data.error.message,"erro");  
            }else{              
              this.showToast(error.message,"erro");  
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
      fetch(this.props.apiUrl + "cargo/" + id,config)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            nome: data.nome,
            empresa:  data.fkEmpresa,
            data: data,
            loading: false
          })
        );
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
      <option value={item.pkEmpresa} >
        {item.razaoSocial}
      </option>
    ));
    let loading = this.state.loading;
    return (
      <div>
        <Spinner hide={!loading} />
        <div className={loading ? 'd-none' : ''}>
          <div className="page-header">
            <h3 className="page-title">Cargo </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/cadastros/cargo">
                    Cargos
                </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Novo Cargo
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
                      <div  className="d-none">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">Empresa</label>
                          <div className="col-sm-9">
                            <Form.Control
                              as="select"
                              value={this.state.empresa}
                              onChange={this.handlechangeEmpresa}
                            >
                              <option value="0">selecione empresa</option>
                              {this.empresas}
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                           Cargo
                        </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={this.state.nome}
                              onChange={this.handlechange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <button className="btn btn-primary btn-block">
                          Salvar
                      </button>
                      </div>
                      <div className="col-md-6">
                        <a type="button"
                          href="/cadastros/cargo"
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
          {this.state.alert}
        </div>
      </div>
    );
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicElements
);
