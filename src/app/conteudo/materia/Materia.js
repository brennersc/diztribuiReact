import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from "universal-cookie";
import { Form } from "react-bootstrap";

export class BasicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      categoria:0
    };
    this.handlechangeCategoria = this.handlechangeCategoria.bind(this);

  }
  handlechangeCategoria(e) {
    console.log('trocou'+e.target.value);
    this.setState({ categoria: parseInt(e.target.value) })
  }
  onClick(id) {
    this.dialog.show({
      title: "Deseja excluir a materia " + id + "?",

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
      .delete(this.props.apiUrl + "materia/" + id, config)

      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.showToast("Materia excluido com sucesso.", "sucesso");

        fetch(this.props.apiUrl + "materia", config)
          .then((response) => response.json())
          .then((data) => this.setState({ data, loading: false }));
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
  render() {
    let categoriasAdicionadas = [];
    let categoriasAdicionadasLista = [];

    for (let item of this.state.data) {
      if (!categoriasAdicionadas.includes(item.categoria.pkCategoria)) {
        categoriasAdicionadas.push(item.categoria.pkCategoria);
        categoriasAdicionadasLista.push({id:item.categoria.pkCategoria, titulo:item.categoria.titulo});
      }
    }

    console.log(categoriasAdicionadas);
    this.optionsCategorias = categoriasAdicionadasLista.map((item) =>
      
          <option value={item.id}>
            {item.titulo}
          </option>
       
    );

    this.materias = this.state.data.map((item) => (
      <tr key={item.pkMateria} className={this.state.categoria===0?'table-row':this.state.categoria===item.categoria.pkCategoria?'table-row':'d-none'}>
        <td className="py-1">{item.titulo}</td>
        <td className="py-1">{item.categoria.titulo}</td>
        <td>
          <div className="row">
            <div className="col-md-3">
              <a
                className="btn btn-light"
                href={"materia/edit/" + item.pkMateria}
              >
                Editar <i className="mdi mdi-square-edit-outline"></i>
              </a>
            </div>
            <div className="col-md-3">
              <button
                onClick={() => {
                  this.onClick(item.pkMateria);
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
        <Spinner hide={!loading} />
        <div className={loading ? "d-none" : ""}>
          <div className="page-header">
            <h3 className="page-title"> Matérias </h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="!#" onClick={(event) => event.preventDefault()}>
                    Conteúdo
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Matérias
                </li>
              </ol>
            </nav>
          </div>
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="col-md-2">
                    <a href="materia/add" className="btn btn-success btn-block">
                      <i className="mdi mdi-plus-box"></i> Adicionar
                    </a>
                  </div>
                  <div className="table-responsive">
                    <br></br>
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">
                          Categorias
                        </label>
                        <div className="col-sm-9">
                          <Form.Control
                            as="select"
                            value={this.state.categoria}
                            onChange={this.handlechangeCategoria}
                            required
                          >
                            <option value="0">Todas categorias</option>
                            {this.optionsCategorias}
                          </Form.Control>
                        </div>
                      </Form.Group>
                    </div>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Materia</th>
                          <th>Categoria</th>
                        </tr>
                      </thead>
                      <tbody>{this.materias}</tbody>
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
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "materia", config)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }));
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicTable
);
