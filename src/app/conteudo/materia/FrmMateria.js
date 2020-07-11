import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import { IconeTipo } from "../../shared/IconeTipo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ModalTexto } from "./ModalTexto";
import { ModalQuestionario } from "./ModalQuestionario";
import Cookies from "universal-cookie";

export class BasicElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titulo: "",
      descricao: "",
      items: [],
      message: "",
      idMateria: null,
      categorias: [],
      categoria: 0,
    };
    this.myRef = React.createRef();
    this.carregaDados = this.carregaDados.bind(this);
    this.onChangeTitulo = this.onChangeTitulo.bind(this);
    this.onChangeDescricao = this.onChangeDescricao.bind(this);
    this.carregarCategorias = this.carregarCategorias.bind(this);
    this.onChangeCategoria = this.onChangeCategoria.bind(this);
  }
  onChangeTitulo(e) {
    this.setState({ titulo: e.target.value });
  }
  onChangeCategoria(e) {
    this.setState({ categoria: e.target.value });
  }
  onChangeDescricao(e) {
    this.setState({ descricao: e.target.value });
  }

  //FORMULARIO MATERIA
  handleSubmit = (event) => {
    event.preventDefault();
    const { id } = this.props.match.params;
    this.setState({ desabilitarCampos: true });
    const fields = {
      titulo: this.state.titulo,
      descricao: this.state.descricao,
      items: this.state.conteudos,
      fkCategoria: this.state.categoria,
    };
    const cookies = new Cookies();
    var token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (id !== undefined) {
      axios
        .put(this.props.apiUrl + "materia/" + id, fields, config)
        .then((res) => {
          this.showToast(
            " Matéria atualizada com sucesso. ID: " + res.data.pkMateria,
            "sucesso"
          );
        })
        .catch((error) => {
          this.setState({ desabilitarCampos: false });
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
        });
    } else {
      this.setState({ desabilitarCampos: false });
      axios

        .post(this.props.apiUrl + "materia", fields, config)
        .then((res) => {
          this.showToast(
            "Matéria cadastrada com sucesso. ID: " + res.data.pkMateria,
            "sucesso"
          );

          this.setState({
            idMateria: res.data.pkMateria,
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
  carregaDados() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    const { id } = this.props.match.params;
    this.setState({
      idMateria: id,
    });
    if (id !== undefined) {
      fetch(this.props.apiUrl + "materia/" + id, config)
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            titulo: data.titulo,
            descricao: data.descricao,
            desabilitarCampos: false,
            items: data.conteudos,
            categoria: data.fkCategoria,
          })
        );
    }
  }
  carregarCategorias() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "categoria", config)
      .then((response) => response.json())
      .then((categorias) => this.setState({ categorias, loading: false }));
  }
  componentDidMount() {
    this.carregaDados();
    this.carregarCategorias();
  }
  onClickItem(id) {
    this.dialog.show({
      title: "Deseja excluir este item?",

      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          this.excluirItem(id);
        }),
      ],
      bsSize: "small",
      onHide: (dialog) => {
        dialog.hide();
        console.log("closed by clicking background.");
      },
    });
  }
  excluirItem(id) {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .delete(this.props.apiUrl + "item/" + id, config)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        this.setState({
          alert: this.showToast("Item excluido com sucesso.", "sucesso"),
        });
        this.carregaItens();
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
  modalTextoMontado(callbacks) {
    this.modalTextoCallbacks = callbacks;
  }

  showModalTexto(id, categoria) {
    if (categoria !== 3) {
      this.modalTextoCallbacks.show(this.state.idMateria, id, categoria);
    } else {
      this.modalQuestionarioCallbacks.show(this.state.idMateria, id, categoria);
    }
  }

  modalQuestionarioMontado(callbacks) {
    this.modalQuestionarioCallbacks = callbacks;
  }

  showModalQuestionario(id, categoria) {
    this.modalQuestionarioCallbacks.show(this.state.idMateria, id, categoria);
  }

  callbackFunction = (childData) => {
    this.carregaItens();
  };
  carregaItens() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "materia/" + this.state.idMateria, config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          titulo: data.titulo,
          categoria: data.fkCategoria,
          descricao: data.descricao,
          desabilitarCampos: false,
          items: data.conteudos,
        })
      );
  }

  render() {
    this.categorias = this.state.categorias.map((item) => (
      <option value={item.pkCategoria}>{item.titulo}</option>
    ));
    this.items = this.state.items.map((item) => (
      <tr key={item.pkItem + "_Materia"}>
        <td className="py-1">{item.ordem}</td>
        <td className="py-1">
          <IconeTipo tipo={item.fkTipoDeItem} />
        </td>
        <td>
          <div className="row">
            <div className="col-md-3">
              <button
                className="btn btn-light"
                onClick={() =>
                  this.showModalTexto(item.pkItem, item.fkTipoDeItem)
                }
                value={item.fkTipoDeItem}
                id={item.pkItem}
              >
                {" "}
                Editar <i className="mdi mdi-square-edit-outline"></i>
              </button>
            </div>
            <div className="col-md-3">
              <button
                onClick={() => {
                  this.onClickItem(item.pkItem);
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

    return (
      <div>
        <ModalTexto
          apiUrl={this.props.apiUrl}
          materiaCallBack={this.callbackFunction}
          onMounted={(callbacks) => this.modalTextoMontado(callbacks)}
        />
        <ModalQuestionario
          apiUrl={this.props.apiUrl}
          materiaCallBack={this.callbackFunction}
          onMounted={(callbacks) => this.modalQuestionarioMontado(callbacks)}
          materia={this.state.idMateria}
        />

        <Dialog
          ref={(component) => {
            this.dialog = component;
          }}
        />
        <div className="page-header">
          <h3 className="page-title">Matéria </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/conteudo/materia">
                  Materias
                </a>
              </li>

            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <form onSubmit={this.handleSubmit} className="form-sample">
                  <div className="row">
                    <div className="col-md-12">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">
                          Nome da Matéria
                        </label>
                        <div className="col-sm-9">
                          <Form.Control
                            type="text"
                            value={this.state.titulo}
                            onChange={this.onChangeTitulo}
                            disabled={this.state.desabilitarCampos}
                            required
                          />
                        </div>
                      </Form.Group>
                    </div>

                    <div className="col-md-12">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">
                          Categoria
                        </label>
                        <div className="col-sm-9">
                          <Form.Control
                            as="select"
                            value={this.state.categoria}
                            onChange={this.onChangeCategoria}
                          >
                            <option value="0">selecione a categoria</option>
                            {this.categorias}
                          </Form.Control>
                        </div>
                      </Form.Group>
                    </div>
                    <div className="col-md-12">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">
                          Descrição
                        </label>
                        <div className="col-sm-9">
                          <textarea
                            className="form-control"
                            rows="6"
                            value={this.state.descricao}
                            onChange={this.onChangeDescricao}
                            disabled={this.state.desabilitarCampos}
                            required
                          ></textarea>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <button
                        className="btn  btn-primary btn-block"
                        disabled={this.state.desabilitarCampos}
                      >
                        Salvar
                      </button>
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
                <p className="card-description mt-3"> Conteúdo </p>
                <div className="row mb-5 ml-3">
                  <ButtonGroup aria-label="Basic example">
                    <Button
                      disabled={this.state.idMateria == null ? true : false}
                      className="btn btn-rounded btn-sm btn-primary"
                      title="Texto"
                      onClick={() => this.showModalTexto(null, 1)}
                    >
                      <i className="mdi mdi-text"></i> Texto
                    </Button>
                    <Button
                      disabled={this.state.idMateria == null ? true : false}
                      className="btn btn-rounded btn-sm btn-info"
                      title="Video"
                      onClick={() => this.showModalTexto(null, 2)}
                    >
                      <i className="mdi mdi-video"></i> Vídeo
                    </Button>
                    <Button
                      disabled={this.state.idMateria == null ? true : false}
                      className="btn btn-rounded btn-sm btn-success"
                      title="Facebook"
                      onClick={() => this.showModalQuestionario(null, 3)}
                    >
                      <i className="fa fa-question"></i> Questionario
                    </Button>
                  </ButtonGroup>
                </div>
                <div className="row mt-5">
                  <p className="card-description">Itens cadastrados</p>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> Ordem </th>
                        <th> Tipo </th>
                        <th> Ações </th>
                      </tr>
                    </thead>
                    <tbody>{this.items}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.alert}
      </div>
    );
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicElements
);
