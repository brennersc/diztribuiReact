import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import { cpfMask } from "../../shared/CpfMask";
import { telefoneMask } from "../../shared/TelefoneMask";
import { validaCPF } from "../../shared/ValidaCpf";
import axios from "axios";
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from "universal-cookie";
export class BasicElements extends Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();

    const admin = cookies.get("admin");
    const gestor = cookies.get("gestor");
    const master = cookies.get("master");

    this.state = {
      loading: false,
      nome: "",
      email: "",
      cpf: "",
      telefone: "",
      urlmage: "",
      setor: "",
      cargo: "",
      empresa: "",
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      site: "",
      senha: "",
      confirmasenha: "",
      empresas: [],
      setores: [],
      cargos: [],
      data: [],
      alert: "",
      master: master,
      admin: admin,
      gestor: gestor,
      salvando: false,
    };

    this.handlechange = this.handlechange.bind(this);
    this.handlechangeEmail = this.handlechangeEmail.bind(this);
    this.handlechangeCpf = this.handlechangeCpf.bind(this);
    this.handlechangeTelefone = this.handlechangeTelefone.bind(this);

    this.handlechangeSenha = this.handlechangeSenha.bind(this);
    this.handlechangeConfirmaSenha = this.handlechangeConfirmaSenha.bind(this);

    this.onChangeFoto = this.onChangeFoto.bind(this);
    this.onChangeFacebook = this.onChangeFacebook.bind(this);
    this.onChangeInstagram = this.onChangeInstagram.bind(this);
    this.onChangeTwitter = this.onChangeTwitter.bind(this);
    this.onChangeLinkedin = this.onChangeLinkedin.bind(this);
    this.onChangeSite = this.onChangeSite.bind(this);

    this.handlechangeSetor = this.handlechangeSetor.bind(this);
    this.handlechangeCargo = this.handlechangeCargo.bind(this);
    this.handlechangeEmpresa = this.handlechangeEmpresa.bind(this);
  }

  handlechange(e) {
    this.setState({ nome: e.target.value });
  }
  handlechangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  handlechangeCpf(e) {
    this.setState({ cpf: cpfMask(e.target.value) });

    if (validaCPF(e.target.value)) {
      e.target.className = "form-control is-valid";
    } else {
      e.target.className = "form-control is-invalid";
    }
  }
  handlechangeTelefone(e) {
    this.setState({ telefone: telefoneMask(e.target.value) });
  }
  handlechangeSenha(e) {
    this.setState({ senha: e.target.value });
  }
  handlechangeConfirmaSenha(e) {
    this.setState({ confirmasenha: e.target.value });
  }
  onChangeFoto(e) {
    this.setState({ urlImage: e.target.value });
  }
  onChangeFacebook(e) {
    this.setState({ facebook: e.target.value });
  }
  onChangeInstagram(e) {
    this.setState({ instagram: e.target.value });
  }
  onChangeTwitter(e) {
    this.setState({ twitter: e.target.value });
  }
  onChangeLinkedin(e) {
    this.setState({ linkedin: e.target.value });
  }
  onChangeSite(e) {
    this.setState({ site: e.target.value });
  }
  handlechangeEmpresa(e) {
    this.carregarSetores(e.target.value);
    this.carregarCargos(e.target.value);
    this.setState({ empresa: e.target.value });
  }
  handlechangeCargo(e) {
    this.setState({ cargo: e.target.value });
  }
  handlechangeSetor(e) {
    this.setState({ setor: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true, salvando: true});
    const { id } = this.props.match.params;
    const fields = {
      fkSetor: this.state.setor,
      fkCargo: this.state.cargo,
      fkEmpresa: this.state.empresa,
      nome: this.state.nome,
      email: this.state.email,
      cpf: this.state.cpf,
      telefone: this.state.telefone,
      facebook: this.state.facebook,
      instagram: this.state.instagram,
      twitter: this.state.twitter,
      linkedin: this.state.linkedin,
      site: this.state.site,
      
    };

    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };    
    if (id !== undefined) {
      axios
        .put(this.props.apiUrl + "usuario/" + id, fields, config)
        .then((res) => {
          this.setState({ salvando: false, loading: false });
          console.log(res);
          console.log(res.data);
          this.showToast(
            "Usuário atualizado com sucesso. ID: " + res.data.pkUsuario,
            "sucesso"
          );
        })
        .catch((error) => {
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
          this.setState({ salvando: false, loading: false });
        });
    } else {
      axios
        .post(this.props.apiUrl + "usuario", fields, config)
        .then((res) => {
          this.setState({ salvando: false, loading: false });
          console.log(res);
          console.log(res.data);
          this.showToast(
            "Usuário cadastrado com sucesso. ID: " + res.data.pkUsuario,
            "sucesso"
          );
          this.setState({
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
            urlmage: "",
            setor: "",
            cargo: "",
            empresa: "",
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            site: "",
            senha: "",
            confirmasenha: "",
            empresas: [],
            setores: [],
            cargos: [],
            data: [],
          });
        })
        .catch((error) => {
          console.log(error.response.data.error.message);
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
          this.setState({ salvando: false, loading: false });
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

  carregarSetores(empresa) {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "setor", config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          setores: data,
        })
      );
  }
  carregarCargos(empresa) {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "cargo", config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          cargos: data,
        })
      );
  }

  showToast(msg, tipo) {
    if (tipo == "sucesso") {
      toast.success(msg);
    } else {
      toast.error(msg);
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

    if (this.state.admin === "1") {
      this.carregarEmpresas();
      this.carregarSetores();
    } else {
      this.carregarSetores();
    }

    this.carregarCargos();

    const { id } = this.props.match.params;
    if (id !== undefined) {
      console.log(id);
      fetch(this.props.apiUrl + "usuario/" + id, config)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            setor: data.fkSetor,
            cargo: data.fkCargo,
            empresa: data.fkEmpresa,
            nome: data.nome,
            email: data.email,
            cpf: data.cpf,
            telefone: data.telefone,
            urlImage: data.urlImage,
            facebook: data.facebook,
            instagram: data.instagram,
            twitter: data.twitter,
            linkedin: data.linkedin,
            site: data.site,
            senha: data.senha,
            confirmasenha: data.confirmasenha,
            loading: false,
          })
        );
    }
  }

  render() {
    this.setores = this.state.setores.map((item) => (
      <option defaultValue key={item.pkSetor} value={item.pkSetor}>
        {item.nome}
      </option>
    ));
    this.cargos = this.state.cargos.map((item) => (
      <option defaultValue key={item.pkCargo} value={item.pkCargo}>
        {item.nome}
      </option>
    ));
    this.empresas = this.state.empresas.map((item) => (
      <option defaultValue key={item.pkEmpresa} value={item.pkEmpresa}>
        {item.razaoSocial}
      </option>
    ));
    let loading = this.state.loading;
    const { cpf, telefone } = this.state;

    return (
      <div>
        <Spinner hide={!loading} name="wandering-cubes" />
        <div className={loading ? "d-none" : ""}>
          <div className="page-header">
            <h3 className="page-title">Usuário </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="!#" onClick={(event) => event.preventDefault()}>
                    Cadastros
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Novo Usuário
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
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Nome Completo
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
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Email
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={this.state.email}
                              onChange={this.handlechangeEmail}
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">CPF</label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={cpf}
                              onChange={this.handlechangeCpf}
                              required
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Telefone
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="text"
                              value={telefone}
                              onChange={this.handlechangeTelefone}
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className={
                          this.state.admin === "1" ? "col-md-6" : "d-none"
                        }
                      >
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Empresa
                          </label>
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
                      
                      <div className={ this.state.admin === "1" ? "d-none" : this.state.master === "false" ? "d-none" : "col-md-6" } >
                        
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Setor
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              as="select"
                              value={this.state.setor}
                              onChange={this.handlechangeSetor}
                            >
                              <option value="0">selecione setor</option>
                              {this.setores}
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className={ this.state.admin === "1" ? "d-none" : "row" }>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Cargos
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              as="select"
                              value={this.state.cargo}
                              onChange={this.handlechangeCargo}
                            >
                              <option value="0">selecione cargo</option>
                              {this.cargos}
                            </Form.Control>
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <p className="card-description"> </p>
                    <div className="row">
                      <div className="d-none">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Senha
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="password"
                              value={this.state.senha}
                              onChange={this.handlechangeSenha}
                              placeholder=""
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="d-none">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Confirma Senha
                          </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="password"
                              value={this.state.confirmasenha}
                              onChange={this.handlechangeConfirmaSenha}
                              placeholder=""
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <p className="card-description"> Redes Sociais </p>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="input-group col-sm-12">
                            <div className="input-group-append">
                              <button
                                className="btn btn-sm btn-facebook"
                                type=""
                                title="Facebook"
                              >
                                <i className="mdi mdi-facebook"></i>
                              </button>
                            </div>
                            <Form.Control
                              type="text"
                              value={this.state.facebook}
                              onChange={this.onChangeFacebook}
                              placeholder="Facebook"
                              aria-label="Nome de usuário"
                              aria-describedby="basic-addon2"
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="input-group col-sm-12">
                            <div className="input-group-append">
                              <button
                                className="btn btn-sm btn-inverse-info"
                                type=""
                                title="Instagram"
                              >
                                <i className="mdi mdi-instagram"></i>
                              </button>
                            </div>
                            <Form.Control
                              type="text"
                              value={this.state.instagram}
                              onChange={this.onChangeInstagram}
                              placeholder="Instagram"
                              aria-label="Nome de usuário"
                              aria-describedby="basic-addon2"
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="input-group col-sm-12">
                            <div className="input-group-append">
                              <button
                                className="btn btn-sm btn-twitter"
                                type=""
                                title="Twitter"
                              >
                                <i className="mdi mdi-twitter"></i>
                              </button>
                            </div>
                            <Form.Control
                              type="text"
                              value={this.state.twitter}
                              onChange={this.onChangeTwitter}
                              placeholder="Twitter"
                              aria-label="Nome de usuário"
                              aria-describedby="basic-addon2"
                            />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="input-group col-sm-12">
                            <div className="input-group-append">
                              <button
                                className="btn btn-sm btn-linkedin"
                                type=""
                                title="Linkedin"
                              >
                                <i className="mdi mdi-linkedin"></i>
                              </button>
                            </div>
                            <Form.Control
                              type="text"
                              value={this.state.linkedin}
                              onChange={this.onChangeLinkedin}
                              placeholder="Linkedin"
                              aria-label="Nome de usuário"
                              aria-describedby="basic-addon2"
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <div className="input-group col-sm-12">
                            <div className="input-group-append">
                              <button
                                className="btn btn-sm btn-dark"
                                type=""
                                title="Site/Blog"
                              >
                                <i className="fa fa-desktop"></i>
                              </button>
                            </div>
                            <Form.Control
                              type="text"
                              value={this.state.site}
                              onChange={this.onChangeSite}
                              placeholder="Site/Blog"
                              aria-label="Site/Blog"
                              aria-describedby="basic-addon2"
                            />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <button className={!this.state.salvando?'btn btn-primary btn-block':'d-none btn btn-primary btn-block'} >
                          Salvar
                        </button>
                        <img className={this.state.salvando?'':'d-none'}
                          src={require("../../../assets/images/spinner.gif")}
                        />
                      </div>
                      <div className="col-md-6">
                        <button
                          onClick={this.props.history.goBack}
                          className="btn btn-secondary btn-block"
                        >
                          Voltar
                        </button>
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
