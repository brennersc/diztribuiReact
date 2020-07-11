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
      admin: cookies.get("admin"),
      titulo: null,
      mensagem: null
    };

    this.handlechangeTitulo = this.handlechangeTitulo.bind(this);
    this.handlechangeMensagem = this.handlechangeMensagem.bind(this);
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

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true});
    const { id } = this.props.match.params;
    const fields = {
      titulo: this.state.titulo,
      mensagem: this.state.mensagem
    };
    const cookies = new Cookies();
    var token = cookies.get('token')
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    axios
      .post(this.props.apiUrl + "fale-conosco", fields, config)

      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.showToast('Mensagem enviado com sucesso.', "sucesso");
        this.setState({
          titulo: "",
          mensagem: "",
          fkEmpresa: 0,
          loading: false
        });
      })
      .catch((error) => {
        if (error.response.data) {
          this.setState({ loading: false});
          this.showToast(error.response.data.error.message, "erro");
        } else {
          this.showToast(error.message, "erro");
        }
      });
  };
  componentDidMount() {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
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
    let loading = this.state.loading;
    return (

      <div>
        <Spinner hide={!loading} />
        <div className={loading ? 'd-none' : ''}>
          <div className="page-header">
            <h3 className="page-title">Fale Conosco </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                    Fale Conosco
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
                      <div className= "col-md-6">
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
