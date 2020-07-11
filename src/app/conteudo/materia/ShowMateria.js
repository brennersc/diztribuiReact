import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import Dialog from "react-bootstrap-dialog";
import Spinner from "../../shared/Spinner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Cookies from "universal-cookie";
import Vimeo from "@u-wave/react-vimeo";
import { Form } from "react-bootstrap";

export class BasicTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      materia: null,
      loading: false,
      items: [],
      conteudo: [],
      data: [],
      questionarios: [],
      pkItem: null,
      questoes: [],
      vizualizado: [],
      itemAtivo: 0,
    };
    this.handleVolume = this.handleVolume.bind(this);
    this.carregaQuestionario = this.carregaQuestionario.bind(this);
    this.gravarComoFavorito = this.gravarComoFavorito.bind(this);
    this.verificaFavorito = this.verificaFavorito.bind(this);
  }
  handleVolume(event) {
    this.setState({
      volume: parseFloat(event.target.value),
    });
    console.log(this.state.volume);
  }
  componentWillMount() {
    const { id } = this.props.match.params;
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "materia/" + id, config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          loading: false,
          titulo: data.titulo,
          descricao: data.descricao,
          items: data.conteudos,
          materia: data,
        })
      );     
  }

  carregaItem(id) {
    if (!this.itensVizualizado.includes(id)) {
      this.itensVizualizado.push(id);
    }
    this.setState({ itemAtivo: id });
    this.setState({ pkItem: id });
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
          loading: false,
          conteudo: data,
          questionarios: data.questionarios,
        })
      );
    console.log(this.itensVizualizado);
  }

  requestsConfig = require("../../config/request");
  carregaQuestionario(id) {
    fetch(
      this.props.apiUrl + "questao/getbyquestionario/" + id,
      this.requestsConfig.config
    )
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          questoes: data,
        })
      );
  }

  itensVizualizado = [];
  sendData = () => {
    this.props.materiaCallBack();
  };

  envioRespostas = (event) => {
    event.preventDefault();
    let forms = document.querySelector("#formRespostas");
    let campos = forms.querySelectorAll("input");
    for (let campo of campos) {
      if (campo.checked) {
        //alert(campo.value);
      }
    }
  };

  showToast(msg, tipo) {
    if (tipo == "sucesso") {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  }

  gravarComoFavorito() {
    //alert(this.state.idMateria);
    const { id } = this.props.match.params;
    const fields = {
      fkMateria: id,
    };

    

    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios.post(this.props.apiUrl + "favorito", fields, config)
      .then((res) => {
        if(this.state.favorito === false){
        this.showToast(
          "Matéria favoritada com sucesso. ID: " + res.data.fkMateria,
          "sucesso"
        );
        this.setState({
          favorito: true,
        });
        }else{
          this.showToast(
            "Matéria desfavoritada com sucesso.",
            "sucesso"
          );
          this.setState({
            favorito: false,
          });
        }
      })
      .catch((error) => {
        if (error.response.data) {
          this.showToast(error.response.data.error.message, "erro");
        } else {
          this.showToast(error.message, "erro");
        }
      });
  }

  verificaFavorito() {
    const { id } = this.props.match.params;
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "favorito/getbyfavorito/" + id, config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          favorito: data.favorito,
        })
      );
      
  }

  render() {
    const { videoIndex, paused, volume } = this.state;
    let titulo = "";
    let idMateria = 0;
    if (this.state.materia !== null) {
      titulo = this.state.materia.categoria.titulo;
      idMateria = this.state.materia.pkMateria;
    }
    console.log(this.state.materia);
    if (this.state.items.length > 0 && this.state.pkItem === null) {
      let selectedItem = this.state.items[0];
      this.carregaItem(selectedItem.pkItem);
    }

    this.items = this.state.items.map((item, index) => (
      <li
        className={
          this.state.itemAtivo == item.pkItem
            ? "list-group-item listaEtapasAtivo"
            : "list-group-item listaEtapas"
        }
      >
        <a
          href="javascript:void(0)"
          onClick={(e) => this.carregaItem(item.pkItem)}
        >
          {index + 1} -{" "}
          {item.fkTipoDeItem === 1
            ? "Artigo"
            : item.fkTipoDeItem === 2
            ? "Video"
            : "Questionario"}
        </a>
        {!this.itensVizualizado.includes(item.pkItem) ? (
          <></>
        ) : (
          <i className="fa fa-check vistoCheck"></i>
        )}
      </li>
    ));

    if (this.state.conteudo.fkTipoDeItem === 1) {
      this.conteudo = (
        <>
          <div style={{ color: "#000" }}>
            <div
              dangerouslySetInnerHTML={{ __html: this.state.conteudo.texto }}
            />
          </div>
        </>
      );
    } else if (this.state.conteudo.fkTipoDeItem === 2) {
      this.conteudo = (
        <>
          <Vimeo video="417752842" responsive="true" autoplay volume={volume} />
          <br />
          <div className="row">
            <div className="col-md-1">
              <button className="btn btn-primary">
                <i class="fa fa-pause"></i>
              </button>
            </div>
            <div className="col-md-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={this.handleVolume}
                className="form-control-range"
              />
            </div>
          </div>
        </>
      );
    } else if (this.state.conteudo.fkTipoDeItem === 3) {
      let questoes = this.state.conteudo.questoes.map((item) => (
        <div>
          <div className="row enunciado">
            <h5>{item.enunciado}</h5>
          </div>
          <br />
          {item.respostas.map((resp) => (
            <div className="row">
              <div className="col-md-1">
                <Form.Check
                  value={resp.pkRespostas}
                  name={"questao_" + resp.fkQuestoes}
                  type="radio"
                />
              </div>
              <div className="col-md-11">{resp.texto}</div>
            </div>
          ))}
        </div>
      ));

      this.conteudo = (
        <div>
          <form
            onSubmit={this.envioRespostas}
            id="formRespostas"
            className="form-sample"
          >
            {questoes}
            <br></br>
            <div className="row">
              <div className="col-md-6">
                <button className="btn btn-primary btn-block">
                  Salvar respostas
                </button>
              </div>
            </div>
          </form>
        </div>
      );
    } else {
      this.conteudo = <></>;
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
            <h3 className="page-title">{this.state.titulo}</h3>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Matérias
                </li>

                <li className="breadcrumb-item active" aria-current="page">
                  <a href={"/categorias/" + idMateria}>{titulo}</a>
                </li>
              </ol>
            </nav>
          </div>
          <div>Favoritar 
              {        
                this.state.favorito === true
                ? <a href="javascript:void(0)" onClick={() => this.gravarComoFavorito()} > <i className="fa fa-star"></i></a> 
                : <a href="javascript:void(0)" onClick={() => this.gravarComoFavorito()} > <i className="fa fa-star-o"></i></a>
              }
          </div>
          <div className="row">
            <div className="col-3">
              <ul className="listaEtapas list-group">{this.items}</ul>
            </div>
            <div className="col-9">
              <div className="card">
                <div className="card-body">{this.conteudo}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.verificaFavorito();
    if (
      this.state.conteudo.fkTipoDeItem ||
      this.state.conteudo.fkTipoDeItem === 3
    ) {
      this.carregaQuestionario(this.state.conteudo.pkItem);
    }
    const { id } = this.props.match.params;
    const cookies = new Cookies();
    const token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    fetch(this.props.apiUrl + "materia/" + id, config)
      .then((response) => response.json())
      .then((data) => this.setState({ data, loading: false }));
  }  
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  BasicTable
);
