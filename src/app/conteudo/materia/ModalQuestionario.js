import React, { Component } from "react";
import { Form, Tab, Nav, Col, Row, Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import AccordionRespostas from "./AccordionRespostas";
import { numeroMask } from "../../shared/NumeroMask";
import Dialog from "react-bootstrap-dialog";
import Cookies from "universal-cookie";

export class ModalQuestionario extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loading: true,
      item: {},
      minimoAprovacao: 0,
      pontuacaoPorQuestao: 0,
      listaQuestoes: [],
      desabilitarCampos: false
    };
    this.submitQuestao = this.submitQuestao.bind(this);
    this.salvaQuestaoUpdate = this.salvaQuestaoUpdate.bind(this);
    this.showModalTexto = this.showModalTexto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.excluirQuestao = this.excluirQuestao.bind(this);
    this.showModalTexto = this.showModalTexto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeTexto = this.onChangeTexto.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.handleSubmitTexto = this.handleSubmitTexto.bind(this);
    this.salvaQuestaoUpdate = this.salvaQuestaoUpdate.bind(this);
    this.subimitQuestionario = this.subimitQuestionario.bind(this);
    
    this.onChangePontuacao = this.onChangePontuacao.bind(this);
    this.onChangeMinimo = this.onChangeMinimo.bind(this);

    this.submitQuestao = this.submitQuestao.bind(this);
    this.excluirQuestao = this.excluirQuestao.bind(this);
  }
  requestsConfig = require("../../config/request");
  salvaQuestaoUpdate(e) {
    var textoEnunciado = document.querySelector("#enunciado_" + e.target.value)
      .value;

    let fields = { enunciado: textoEnunciado };
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .put(this.props.apiUrl + "questao/" + e.target.value, fields, config)
      .then((res) => {
        this.setState({ processing: false, itemTexto: "" });
        this.showToast("Questao alterada com sucesso.", "sucesso");
      })
      .catch((error) => {
        if (error.response.data) {
          this.showToast(error.response.data.error.message, "erro");
        } else {
          this.showToast(error.message, "erro");
        }
      });
  }
  salvaQuestao(e) {
    e.preventDefault();

    this.setState({ desabilitaCampos: true });

    this.setState({ processing: true });
    const fields = {
      fkTipoDeItem: 3,
      fkMateria: this.state.idMateria,
      minimo: this.state.minimo,
      pontucacao: this.state.pontucacao,
    };
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (this.state.idItem !== null) {
    } else {
      axios
        .post(this.props.apiUrl + "item/createQuestionario", fields, config)
        .then((res) => {
          this.setState({
            data: [],
            itemTexto: "",
            itemVideo: "",
            itemPergunta: "",
            modal: false,
          });

          fetch(this.props.apiUrl + "materia/" + this.state.idMateria, config)
            .then((response) => response.json())
            .then((data) => {
              this.setState({ processing: false });

              this.setState({
                titulo: data.titulo,
                descricao: data.descricao,
                desabilitarCampos: false,
                items: data.conteudos,
              });
            });
        })
        .catch((error) => {
          this.setState({
            alert: (
              <div className="alert alert-danger" role="alert">
                {error.response.data.error.message}
              </div>
            ),
          });
        });
    }
  }
  onChangeMinimo(e) {
    let num = numeroMask(e.target.value);
    if (num > 100) {
      num = 100;
    }
    this.setState({ minimo: num });
  }
  onChangePontuacao(e) {
    let num = numeroMask(e.target.value);
    this.setState({ pontuacaoPorQuestao: num });
  }
  onChangeVideo(e) {
    this.setState({ itemVideo: e.target.value });
  }
  showToast(msg, tipo) {
    if (tipo == "sucesso") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }
  onChangeTexto(e) {
    this.setState({ itemTexto: e.target.value });
  }
  handleClose() {
    this.sendData();
    this.setState({ showModal: false });
  }
  sendData = () => {
    this.props.materiaCallBack();
  };
  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted({
        show: (idMateria, id, categoria) =>
          this.showModalTexto(idMateria, id, categoria),
      });
    }
  }
  handleEditorChange = (content, editor) => {
    this.setState({ itemTexto: content });
  };
  requestsConfig = require("../../config/request");
  showModalTexto = (idMateria, id, categoria) => {
    this.setState({
      item: [],
      loading: false,
      minimoAprovacao: null,
      pontuacaoPorQuestao: null,
      showModal: false,
      desabilitarCampos: false,
      idMateria: idMateria,

      listaQuestoes: [],
    });
    this.setState({ showModal: true, loading: true });

    if (typeof id !== "undefined" && id !== null) {
      axios
        .get(this.props.apiUrl + "item/" + id, this.requestsConfig.config)
        .then((res) => {
          this.setState({
            item: res.data,
            loading: false,
            minimoAprovacao: res.data.minimoAprovacao,
            pontuacaoPorQuestao: res.data.pontuacaoPorQuestao,
            listaQuestoes: res.data.questoes,
          });
        })
        .catch((error) => {
          if (error.response.data) {
            this.showToast(error.response.data.error.message, "erro");
          } else {
            this.showToast(error.message, "erro");
          }
        });
    } else {
      this.setState({ loading: false });
    }
  };
  handleSubmitTexto = (event) => {
    event.preventDefault();
  };
  sendData = () => {
    this.props.materiaCallBack();
  };
  
  excluirQuestao(id) {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    this.dialogQuestao.show({
      title: "Deseja excluir a questão ?",

      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          axios
            .delete(this.props.apiUrl + "questao/" + id, config)

            .then((res) => {
              console.log(res);
              console.log(res.data);
              this.showToast("Questao excluida com sucesso.", "sucesso");
              axios
                .get(
                  this.props.apiUrl + "item/" + this.state.item.pkItem,
                  this.requestsConfig.config
                )
                .then((res) => {
                  this.setState({
                    item: res.data,
                    loading: false,
                    minimoAprovacao: res.data.minimoAprovacao,
                    pontuacaoPorQuestao: res.data.pontuacaoPorQuestao,
                    listaQuestoes: res.data.questoes,
                  });
                })
                .catch((error) => {
                  if (error.response.data) {
                    this.showToast(error.response.data.error.message, "erro");
                  } else {
                    this.showToast(error.message, "erro");
                  }
                });
            })
            .catch((error) => {
              if (error.response.data) {
                this.showToast(error.response.data.error.message, "erro");
              } else {
                this.showToast(error.message, "erro");
              }
            });
        }),
      ],
      bsSize: "small",
      onHide: (dialogQuestao) => {
        dialogQuestao.hide();
        console.log("closed by clicking background.");
      },
    });
  }

  submitQuestao(e) {
    const fields = {
      fkItem: this.state.item.pkItem,
    };
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post(this.props.apiUrl + "questao", fields, config)
      .then((res) => {
        axios
          .get(
            this.props.apiUrl + "item/" + this.state.item.pkItem,
            this.requestsConfig.config
          )
          .then((res) => {
            this.setState({
              item: res.data,
              loading: false,
              minimoAprovacao: res.data.minimoAprovacao,
              pontuacaoPorQuestao: res.data.pontuacaoPorQuestao,
              listaQuestoes: res.data.questoes,
            });
          })
          .catch((error) => {
            if (error.response.data) {
              this.showToast(error.response.data.error.message, "erro");
            } else {
              this.showToast(error.message, "erro");
            }
          });
      })
      .catch((error) => {
        this.setState({
          alert: (
            <div className="alert alert-danger" role="alert">
              {error.message}
            </div>
          ),
        });
      });
  }
  subimitQuestionario(e) {
    e.preventDefault();

    this.setState({ desabilitaCampos: true });

    this.setState({ processing: true });
    const fields = {
      fkTipoDeItem: 3,
      fkMateria: this.state.idMateria,
      minimoAprovacao: this.state.minimoAprovacao,
      pontuacaoPorQuestao: this.state.pontuacaoPorQuestao,
    };
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };
    if (this.state.idItem !== null) {
      axios
        .post(this.props.apiUrl + "item/" , fields, config)
        .then((res) => {
          this.setState({ processing: false, itemTexto: "" });
          axios
          .get(
            this.props.apiUrl + "item/" + res.data.pkItem,
            this.requestsConfig.config
          )
          .then((res) => {
            this.setState({
              item: res.data,
              loading: false,
              minimoAprovacao: res.data.minimoAprovacao,
              pontuacaoPorQuestao: res.data.pontuacaoPorQuestao,
              listaQuestoes: res.data.questoes,
            });
          })
          .catch((error) => {
            if (error.response.data) {
              this.showToast(error.response.data.error.message, "erro");
            } else {
              this.showToast(error.message, "erro");
            }
          });          
          fetch(this.props.apiUrl + "materia/" + this.state.idMateria,config)
            .then((response) => response.json())
            .then((data) => {
              this.setState({
                titulo: data.titulo,
                descricao: data.descricao,
                desabilitarCampos: false,
                items: data.conteudos,
              });
            });
        })
        .catch((error) => {
          this.setState({
            alert: (
              <div className="alert alert-danger" role="alert">
                {error.response.data.error.message}
              </div>
            ),
          });
        });
    } else {
      axios
        .post(this.props.apiUrl + "item/createQuestionario", fields, config)
        .then((res) => {
          this.setState({
            data: [],
            itemTexto: "",
            itemVideo: "",
            itemPergunta: "",
            modal: false,
            idQuestionario: res.data.pkQuestionario,
          });

          fetch(this.props.apiUrl + "materia/" + this.state.idMateria,config)
            .then((response) => response.json())
            .then((data) => {
              this.setState({ processing: false });

              this.setState({
                titulo: data.titulo,
                descricao: data.descricao,
                desabilitarCampos: false,
                items: data.conteudos,
              });
            });
        })
        .catch((error) => {
          this.setState({
            alert: (
              <div className="alert alert-danger" role="alert">
                {error.response.data.error.message}
              </div>
            ),
          });
        });
    }
  }
  
  render() {
    let respostasItens = this.state.listaQuestoes.map((item, index) => (
      <>
        <Nav.Item>
          <Nav.Link eventKey={index}>Questão {index + 1}</Nav.Link>
        </Nav.Item>
      </>
    ));
    let respostasCorpo = this.state.listaQuestoes.map((item, index) => (
      <Tab.Pane eventKey={index}>
        <form onSubmit={this.handleSubmitTexto} className="form-sample mb-5">
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Questão {index + 1} enunciado:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              value={item.enunciado}
              id={"enunciado_" + item.pkQuestoes}
            />
          </Form.Group>
          <button
            value={item.pkQuestoes}
            onClick={this.salvaQuestaoUpdate}
            className="btn btn-info"
          >
            Salvar questão {index + 1}
          </button>
          <span> </span>
          <button
            value={item.pkQuestoes}
            onClick={() => {
              this.excluirQuestao(item.pkQuestoes);
            }}
            className="btn btn-warning"
          >
            Exluir questão {index + 1}
          </button>
        </form>
        <AccordionRespostas
          apiUrl={this.props.apiUrl}
          respostas={item.respostas}
          id={item.pkQuestoes}
        />
      </Tab.Pane>
    ));
    return (
      <div>
        <Dialog
          ref={(component) => {
            this.dialogQuestao = component;
          }}
        />
        <Modal
          show={this.state.showModal}
          animation={false}
          onHide={() => this.setState({ showModal: false })}
          dialogClassName="modal-90w"
        >
          <Modal.Body>
            <Spinner
              className={this.state.loading ? "text-align-center" : "d-none"}
              animation="border"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
            <div
              className={!this.state.loading ? "text-align-center" : "d-none"}
            >
              <div className="row">
                <div className="col-md-2 texto-questionario">Pontuação por questao:</div>{" "}
                <div className="col-md-1">
                  <Form.Control
                    type="text"
                    value={this.state.pontuacaoPorQuestao}
                    onChange={this.onChangePontuacao}
                    disabled={this.state.desabilitaCampos}
                    required
                    size="sm"
                  />
                </div>
                <div className="col-md-3 text-right texto-questionario"> % minimo para aprovação:</div>
                <div className="col-md-1">
                  <Form.Control
                    type="text"
                    value={this.state.minimoAprovacao}
                    onChange={this.onChangeMinimo}
                    disabled={this.state.desabilitaCampos}
                    required
                    size="sm"
                  />
                </div>
                <div className="col-md-1">
                  <button
                    disabled={this.state.desabilitaCampos}
                    onClick={this.subimitQuestionario}
                    className="btn btn-outline-primary"
                  >
                    OK
                  </button>
                </div>
              </div>

              <Tab.Container id="left-tabs-example" defaultActiveKey="0">
                <Row>
                  <Col sm={3}>
                    <button
                      onClick={this.submitQuestao}
                      className="btn btn-dark btn-rounded"
                    >
                      <div className="col-md-12 text-center">
                        <i className="fa fa-plus-circle"></i> Adicionar questão
                      </div>
                    </button>
                    <br></br>
                    <br></br>
                    <Nav variant="pills" className="flex-column">
                      {respostasItens}
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>{respostasCorpo}</Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="float-left"
              variant="secondary"
              onClick={this.handleClose}
            >
              Fechar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalQuestionario;
