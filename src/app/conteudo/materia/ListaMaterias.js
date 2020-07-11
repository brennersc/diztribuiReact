import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import Button from "react-bootstrap-dialog";
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from "universal-cookie";
import Card from "react-bootstrap/Card";

export class BasicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoria: null,
      loading: true,

      materias: [],
    };
  }
  requestsConfig = require("../../config/request");

  render() {
    if (this.state.categoria !== null) {
      this.categorias = this.state.categoria.materias.map((item) => (
        <div className="col-md-3 grid-margin stretch-card">
          <div className="card">
            <div className="card-header">
              <a href={"materia/" + item.pkMateria}>{item.titulo}</a>
            </div>
            <div className="card-body">{item.descricao}</div>
          </div>
        </div>
      ));
    } else {
      this.categorias = <></>;
    }
    let loading = this.state.loading;
    return (
      <div>
        <div>
          <ToastContainer />
          <Dialog
            ref={(component) => {
              this.dialog = component;
            }}
          />
        </div>
        <Spinner hide={!loading} />
        <div className={loading ? "d-none" : ""}>
          <div className="page-header">
            <h3 className="page-title">
              {this.state.categoria !== null ? this.state.categoria.titulo : ""}{" "}
              - Matérias{" "}
            </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  <a href="/categorias">Categorias</a>
                </li>
              </ol>
            </nav>
          </div>
          <div className="row">{this.categorias}</div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    fetch(this.props.apiUrl + "categoria/" + id, this.requestsConfig.config)
      .then((response) => response.json())
      .then((categoria) => this.setState({ categoria, loading: false }));
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicTable
);
