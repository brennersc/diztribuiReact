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
    this.state = { loading: true, dataInicio: "", dataFinal: "", ferias: false, admin: cookies.get('admin') };
    this.handlechangeDataInicio = this.handlechangeDataInicio.bind(this);
    this.handlechangeDataFinal = this.handlechangeDataFinal.bind(this);
  }

  handlechangeDataInicio(e) {
    this.setState({ dataInicio: e.target.value });
  }
  handlechangeDataFinal(e) {
    this.setState({ dataFinal: e.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { id } = this.props.match.params;
    const fields = {
      dataInicio: this.state.dataInicio,
      dataFinal: this.state.dataFinal
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
        .put(this.props.apiUrl + "ferias/" + id, fields, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast("Ferias atualizada com sucesso. ID: " + res.data.pkFerias, "sucesso")
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
        .post(this.props.apiUrl + "ferias/", fields, config)
        .then((res) => {
          console.log(res);
          console.log(res.data);
          this.showToast('Ferias solicitada com sucesso. ID: ' + res.data.pkFerias, "sucesso");
          this.setState({
            dataInicio: '',
            dataFinal: '',
            ferias: true
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
      fetch(this.props.apiUrl + 'ferias/' + id, config)
        .then(response => response.json())
        .then(
          data => this.setState({
            dataInicio: data.dataInicio,
            dataFinal: data.dataFinal,
            loading: false
          }));
    }else{
      this.setState({
        loading: false
      });
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
            <h3 className="page-title">Solicitação de Férias </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/cadastros/ferias">
                    Ferias
                </a>
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
                            Data Inicio
                        </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="date"
                              value={this.state.dataInicio}
                              onChange={this.handlechangeDataInicio}
                              required />
                          </div>
                        </Form.Group>
                      </div>
                      <div className="col-md-6">
                        <Form.Group className="row">
                          <label className="col-sm-3 col-form-label">
                            Data Final
                        </label>
                          <div className="col-sm-9">
                            <Form.Control
                              type="date"
                              value={this.state.dataFinal}
                              onChange={this.handlechangeDataFinal}
                              required />
                          </div>
                        </Form.Group>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <button className="btn btn-primary btn-block" >
                          Solicitar
                      </button>
                      </div>
                      <div className="col-md-6">
                        <a type="button"
                          href="/cadastros/ferias"
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
