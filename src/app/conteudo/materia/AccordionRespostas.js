import React, { Component } from "react";
import { Accordion, Card, Button, Form } from "react-bootstrap";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from 'universal-cookie';
export class AccordionRespostas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      respostas: [],
      idQuestao: this.props.id,
    };
    this.carregaRespostas = this.carregaRespostas.bind(this);
    this.adicionarResposta = this.adicionarResposta.bind(this);
  }
  componentDidMount() {
    this.setState({ respostas: this.props.respostas });
  }
  editResposta(e) {
    let id = e.target.dataset.idresposta;
    console.log(id);

    let div = document.querySelector("#respostaTextArea-" + id);

    for (let cssClass of div.classList) {
      if (cssClass === "d-none") {
        div.classList.remove("d-none");
      }
    }
    div.focus();
  }
  focusOut(e) {
    e.classList.add("d-none");
  }
  adicionarResposta(id) {
    const fields = {
      fkQuestoes: this.props.id,
    };
    const cookies = new Cookies();
    var token = cookies.get('token')
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    axios
      .post(this.props.apiUrl + "resposta", fields, config)
      .then((res) => {
        this.carregaRespostas();
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
  carregaRespostas() {
    const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    fetch(this.props.apiUrl + "resposta/getbyquestao/" + this.props.id,config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          respostas: data,
        })
      );
  }
  excluirResposta(id) {
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    this.dialogQuestao.show({
      title: "Deseja excluir a resposta ?",

      actions: [
        Dialog.CancelAction(),
        Dialog.OKAction(() => {
          axios
            .delete(this.props.apiUrl + "resposta/" + id, config)

            .then((res) => {
              console.log(res);
              console.log(res.data);
              this.carregaRespostas();
              this.showToast("Resposta excluida com sucesso.", "sucesso");

             
            })
            .catch((error) => {
              if (error.response) {
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
  showToast(msg, tipo) {
    if (tipo == "sucesso") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }
  salvarResposta(id) {
    var correta = document.querySelector("#correta_"+id).checked;
    const fields = {
      texto: document.querySelector("#respostaTextArea-" + id).value,
      correta: correta,
    };
    const cookies = new Cookies();
    var token = cookies.get('token')
    let config = {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    axios
      .put(this.props.apiUrl + "resposta/" + id, fields, config)
      .then((res) => {
        this.carregaRespostas();
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
  render() {
    this.cards = this.state.respostas.map((item, index) => (
      <Card>
        <Card.Header>
          <div className="row">
            <div>
              {" "}
              <input
                data-tip="Marque aqui se esta for a resposta correta."
                type="checkbox"
                id={"correta_"+item.pkRespostas}
                name={"correta_"+item.pkRespostas}
                
                
              />
            </div>
            <div className="col-md-10 text-left">
              <Accordion.Toggle
                className="text-left"
                as={Button}
                variant="link"
                eventKey={item.pkRespostas}
              >
                <b>Resposta {index + 1}:</b>{" "}
                {item.texto !== null ? item.texto.substr(0, 150) : ""}...
              </Accordion.Toggle>
            </div>
          </div>
          <ReactTooltip />
        </Card.Header>
        <Accordion.Collapse eventKey={item.pkRespostas}>
          <Card.Body>
            <ReactTooltip />
            <div className="row">
              <Form.Control
                id={"respostaTextArea-" + item.pkRespostas}
                as="textarea"
                rows="10"
              >
                {item.texto}
              </Form.Control>
            </div>
            <br></br>
            <div className="row">
              <button
                disabled={this.state.desabilitaCampos}
                onClick={() => {
                  this.salvarResposta(item.pkRespostas);
                }}
                className="btn btn-outline-primary"
              >
                Salvar resposta
              </button>
              <span> </span>
              <button
                disabled={this.state.desabilitaCampos}
                onClick={() => {
                  this.excluirResposta(item.pkRespostas);
                }}
                className="btn btn-outline-warning"
              >
                Excluir resposta
              </button>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    ));
    return (
      <div>
        <Dialog
            ref={(component) => {
              this.dialogQuestao = component;
            }}
          />
        <span> </span>
        <button
          onClick={() => {
            this.adicionarResposta();
          }}
          className="btn btn-success"
        >
          Adicionar resposta
        </button>
        <Accordion>{this.cards}</Accordion>
      </div>
    );
  }
}

export default AccordionRespostas;
