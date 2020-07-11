import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

import axios from "axios";
import Cookies from "universal-cookie";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", alert: "" };
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.logar = this.logar.bind(this);
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value });
  }
  onChangeEmail(e) {
    this.setState({ email: e.target.value });
  }
  logar() {
    const fields = {
      email: this.state.email,
      password: this.state.password,
    };
    var bodyFormData = new FormData();
    bodyFormData.set("email", this.state.email);
    bodyFormData.set("password", this.state.password);
    axios
      .post(this.props.apiUrl + "login", bodyFormData, {
        headers: {
          "content-type":
            "multipart/form-data; boundary=${bodyFormData._boundary}",
        },
      })
      .then((res) => {
        const cookies = new Cookies();
        cookies.set("user", this.state.email);
        cookies.set("token", res.data.access_token);
        cookies.set("expires_in", res.data.expires_in);
        

        let config = {
          headers: {
            Authorization: "Bearer " + res.data.access_token,
          },
        };
        axios
          .post(this.props.apiUrl + "me", "", config)
          .then((res) => {
            cookies.set("nomeUsuario", res.data.nome);
            cookies.set("imagemUsuario", res.data.urlimage);
            cookies.set("admin", res.data.administrador);
            axios
              .post(this.props.apiUrl + "perfil", "", config)
              .then((res) => {
                cookies.set("master", res.data.master);
                cookies.set("gestor", res.data.gestor);
                
                this.props.history.push("/dashboard");
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
      })
      .catch((error) => {
        console.log(error.response.data.error.message);
        this.setState({
          alert: (
            <div className="alert alert-danger" role="alert">
              {error.response.data.error == "Unauthorized"
                ? "Login e/ou senha invalidos"
                : error.response.data.error}
            </div>
          ),
        });
      });
  }
  componentDidMount() {
    const cookies = new Cookies();
    cookies.remove("token");
    cookies.remove("nomeUsuario");
    cookies.remove("imagemUsuario");
    cookies.remove("user");
  }

  render() {
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo text-center">
                  <img
                    src={require("../../assets/images/logotop.png")}
                    alt="logo"
                  />
                </div>
                <h6 className="font-weight-light">Entre para continuar</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="email"
                      value={this.state.email}
                      onChange={this.onChangeEmail}
                      placeholder="Email"
                      size="lg"
                      className="h-auto"
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Senha"
                      size="lg"
                      className="h-auto"
                      onChange={this.onChangePassword}
                      value={this.state.password}
                    />
                  </Form.Group>
                  <div className="mt-3">
                    <Button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      onClick={this.logar}
                    >
                      ENTRAR
                    </Button>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                      </label>
                    </div>
                    <a
                      href="!#"
                      onClick={(event) => event.preventDefault()}
                      className="auth-link text-black"
                    >
                      Recuperar senha?
                    </a>
                  </div>
                </Form>
                <div>{this.state.alert}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  Login
);
