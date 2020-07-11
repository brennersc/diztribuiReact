import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import Cookies from "universal-cookie";
export class ModalTexto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      texto: props.texto,
      showModal: false,
      idMateria: null,
      itemTexto: "",
      idItem: null,
      itemVideo: null,
    };
    this.showModalTexto = this.showModalTexto.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onChangeTexto = this.onChangeTexto.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.handleSubmitTexto = this.handleSubmitTexto.bind(this);
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
  componentDidMount() {
    if (this.props.onMounted) {
      this.props.onMounted({
        show: (idMateria, id, categoria) =>
          this.showModalTexto(idMateria, id, categoria),
      });
    }

    if (this.state.idItem !== null) {
      this.carregaDados();
    }
  }
  handleEditorChange = (content, editor) => {
    this.setState({ itemTexto: content });
  };
  showModalTexto = (idMateria, id, categoria) => {
    if (typeof id !== "undefined" && id !== null) {
      this.setState({
        showModal: true,
        idMateria: idMateria,

        categoria: categoria,
      });
      this.carregaDados(id);
    } else {
      this.setState({
        showModal: true,
        idMateria: idMateria,
        itemTexto: "",
        idItem: null,
        categoria: categoria,
        itemVideo: "",
      });
    }
  };
  handleSubmitTexto = (event) => {
    event.preventDefault();
    this.setState({ processing: true });
    const fields = {
      texto: this.state.itemTexto,
      fkTipoDeItem: this.state.categoria,
      fkMateria: this.state.idMateria,
      videoIncorporado: this.state.itemVideo,
    };
    const cookies = new Cookies();
    var token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    if (this.state.idItem !== null) {
      axios
        .put(this.props.apiUrl + "item/" + this.state.idItem, fields, config)
        .then((res) => {
          this.setState({ processing: false, itemTexto: "" });
          fetch(this.props.apiUrl + "materia/" + this.state.idMateria, config)
            .then((response) => response.json())
            .then((data) => {
              this.showToast("Item alterado com sucesso.", "sucesso");
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
        .post(this.props.apiUrl + "item", fields, config)
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
              this.showToast("Item adicionado com sucesso.", "sucesso");
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
  };
  sendData = () => {
    this.props.materiaCallBack();
  };
  carregaDados(id) {
    this.setState({ loading: true });
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "item/" + id, config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          itemTexto: data.texto,
          itemVideo: data.videoIncorporado,
          idItem: data.pkItem,
        })
      );
  }
  render() {
    return (
      <div>
        <Modal
          show={this.state.showModal}
          animation={false}
          onHide={() => this.setState({ showModal: false })}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Conteúdo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={this.handleSubmitTexto}
              className="form-sample mb-5"
            >
              <div className={this.state.categoria == 1 ? "" : "d-none"}>
                <Editor
                  value={this.state.itemTexto}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | help",
                  }}
                  onEditorChange={this.handleEditorChange}
                />
              </div>
              <div
                className={this.state.categoria === 2 ? "d-block" : "d-none"}
              >
                <Form.Group className="row">
                  <div className="input-group col-sm-12">
                    <div className="input-group-append">
                      <button
                        className="btn btn-sm btn-secondary"
                        type="text"
                        title="Iframe do video"
                      >
                        <i className="fa fa-code"></i>
                      </button>
                    </div>
                    <Form.Control
                      type="text"
                      value={this.state.itemVideo}
                      onChange={this.onChangeVideo}
                      placeholder="Iframe do video"
                    />
                  </div>
                </Form.Group>
              </div>

              <Button
                className="float-right  d-block"
                variant="primary"
                type="submit"
                disabled={this.state.processing}
              >
                Salvar
              </Button>
            </form>
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

export default ModalTexto;
