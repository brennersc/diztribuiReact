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
      favoritos: [],
      pkUsuario: null,
      pkMateria: null,
      titulo: null,
      descricao: null,
      loading: true,
    };
  }
  componentWillMount() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "favorito", config)
      .then((response) => response.json())
      .then((favoritos) => this.setState({favoritos, loading: false }));
  }

  render() {
    this.favoritos = this.state.favoritos.map((item) => (
      <div className="col-md-3 grid-margin stretch-card">
        <div className="card">
          <div className="card-header"><a href={"/categorias/materia/"+item.pkMateria}>{item.titulo}</a></div>
          <div className="card-body">{  item.descricao.substring(0,80) }</div>           
        </div>
      </div>
    ));
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
            <h3 className="page-title">Matérias favoritas</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  <a href='/categorias'>Categorias</a>
                </li>
              </ol>
            </nav>
          </div>
          <div className="row">{this.favoritos}</div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "favorito", config)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }));
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicTable
);
