import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import Cookies from "universal-cookie";
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
export class BasicElements extends Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    this.state = {
      loading: true,
      titulo: "",
      data: [],
      empresas: [],
      admin: cookies.get("admin"),
      fkEmpresa: null,
      setores: []
    };
    this.handlechange = this.handlechange.bind(this);
    this.handlechangeEmpresa = this.handlechangeEmpresa.bind(this);
  }

  handlechange(e) {
    this.setState({ titulo: e.target.value });
  }
  handlechangeEmpresa(e) {
    this.setState({ fkEmpresa: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id } = this.props.match.params;
    const fields = {
      titulo: this.state.titulo,
      fkEmpresa: this.state.fkEmpresa,
    };
    const cookies = new Cookies();
    var token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    console.log(fields);
    if (id !== undefined) {
      axios
        .put(this.props.apiUrl + "categoria/" + id, fields, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast(
            "Categoria atualizada com sucesso. ID: " + res.data.pkCategoria,
            "sucesso"
          );
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
        .post(this.props.apiUrl + "categoria", fields, config)

        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast(
            "Categoria cadastrada com sucesso. ID: " + res.data.pkCategoria,
            "sucesso"
          );
          this.setState({
            nome: "",
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
    fetch(this.props.apiUrl + "empresa", config)
      .then((response) => response.json())
      .then((empresas) => this.setState({ empresas, loading: false }));
  }
  componentDidMount() {
    this.carregarSetores();
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
      fetch(this.props.apiUrl + "categoria/" + id, config)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            titulo: data.titulo,
            data: data,
            loading: false,
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
  carregarSetores() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "setor", config)
      .then((response) => response.json())
      .then((setores) => this.setState({ setores, loading: false }));
  }
  render() {
    this.setores = this.state.setores.map((item) => (
      <option selected value={item.pkSetor}>
        {item.nome}
      </option>
    ));
    this.empresas = this.state.empresas.map((item) => (
      <option value={item.pkEmpresa}>{item.razaoSocial}</option>
    ));
    let loading = this.state.loading;
    return (
      <div>
        <Spinner hide={!loading} />
        <div className={loading ? "d-none" : ""}>
          <div className="page-header">
            <h3 className="page-title">Categoria </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/cadastros/categoria">Categorias</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Nova Categoria
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
                      <div className={this.state.admin ? "col-md-6" : "d-none"}>
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Setores
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              as="select"
                              value={this.state.data.fkSetor}
                              onChange={this.handlechangeEmpresa}
                            >
                              <option value="0">selecione o setor</option>
                              {this.setores}
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-4 col-form-label">
                            Crie uma Categoria
                          </label>
                          <div className="col-sm-8">
                            <Form.Control
                              type="text"
                              value={this.state.titulo}
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
                        <a
                          type="button"
                          href="/cadastros/categoria"
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
