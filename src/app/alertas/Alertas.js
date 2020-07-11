import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios';
import Dialog from 'react-bootstrap-dialog'
import Spinner from "../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from 'universal-cookie';
export class BasicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
    this.onClick = this.onClick.bind(this);
  }
  onClick(id) {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    fetch(this.props.apiUrl + 'alerta/' + id,config)
      .then(response => response.json())
      .then(
        data => this.setState({
          nome: data.titulo,
        }));
    this.dialog.show({
      title: "Deseja excluir este alerta?",
      body: '' + this.state.nome,
      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.excluir(id);
        }),
      ],
      bsSize: "small",
      onHide: (dialog) => {
        dialog.hide();
        console.log("closed by clicking background.");
      },
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
    axios
      .delete(this.props.apiUrl + "alertas/" + id, config)

      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.showToast("Alerta excluido com sucesso. ID: " + res.data.pkAlerta, "sucesso");
        this.carregaDados();
      })
      .catch((error) => {
        if (error.response.data) {
          this.showToast(error.response.data.error.message, "erro");
        } else {
          this.showToast(error.message, "erro");
        }
      });
  }
  showToast(msg, tipo) {
    if (tipo == "sucesso") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }
  carregaDados() {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    fetch(this.props.apiUrl + "alertas",config)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }));
  }
  render() {
    this.Alertas = this.state.data.map((item) => (
      <tr>
        <td className="py-1">{item.titulo}</td>

        <td>
          <div className="row">
            <div className="col-md-3">
              <a
                className="btn btn-light"
                href={"alertas/edit/" + item.pkAlerta}
              >
                Visualizar <i className="mdi mdi-square-edit-outline"></i>
              </a>
            </div>
            <div className="col-md-3">
              <button
                onClick={() => {
                  this.onClick(item.pkAlerta);
                }}
                className="btn btn-secondary"
              >
                Excluir <i className="mdi mdi-delete"></i>
              </button>
            </div>
          </div>
        </td>
      </tr>
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
        <div>
          <Dialog
            ref={(component) => {
              this.dialog = component;
            }}
          />
        </div>
        <Spinner hide={!loading} />
        <div className={loading ? 'd-none' : ''}>
          <div className="page-header">
            <h3 className="page-title"> Alertas </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Alertas
              </li>
              </ol>
            </nav>
          </div>          
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="col-md-2">
                    <a href="alertas/add" className="btn btn-success btn-block">
                      <i className="mdi mdi-plus-box"></i> Enviar alerta
                  </a>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>{this.Alertas}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.carregaDados();
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicTable
);
