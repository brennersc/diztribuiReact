import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import axios from "axios";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nomeUsuario: "",
      imagemUsuario: null,
    };
    this.handleSair = this.handleSair.bind(this);
  }

  toggleOffcanvas() {
    document.querySelector(".sidebar-offcanvas").classList.toggle("active");
  }
  componentDidMount() {
    const cookies = new Cookies();
    const token = cookies.get("token");
  }
  handleSair(e) {
    const cookies = new Cookies();
    var token = cookies.get("token");
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post(this.props.apiUrl + "logout", "", config)
      .then((res) => {
        console.log(res);
        console.log(res.data);
        token = null;
        cookies.remove("token");
        cookies.remove("nomeUsuario");
        cookies.remove("imagemUsuario");
        cookies.remove("admin");
        cookies.remove("master");
        cookies.remove("gestor");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.log(error);
      });
  }
  render() {
    const cookies = new Cookies();
    const nomeUsuario = cookies.get("nomeUsuario");
    const imagemUsuario = cookies.get("imagemUsuario");

    return (
      <nav className="navbar col-lg-12 col-12 p-lg-0 fixed-top d-flex flex-row">
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-between">
          <a
            className="navbar-brand brand-logo-mini align-self-center d-lg-none"
            href="!#"
            onClick={(evt) => evt.preventDefault()}
          ></a>
          <button
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            onClick={() => document.body.classList.toggle("sidebar-icon-only")}
          >
            <i className="mdi mdi-menu"></i>
          </button>

          <ul className="navbar-nav navbar-nav-right ml-lg-auto">
            <li className="nav-item  nav-profile border-0">
              <Dropdown alignRight>
                <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                  <span className="profile-text">{nomeUsuario}</span>
                  <img
                    className="img-xs rounded-circle"
                    src={
                      typeof imagemUsuario == "undefined"
                        ? this.state.imagemUsuario
                        : require("../../assets/images/user.jpg")
                    }
                    alt="Profile"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="preview-list navbar-dropdown pb-3">
                  <Dropdown.Item
                    className="dropdown-item p-0 preview-item d-flex align-items-center border-bottom"
                    href="!#"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="d-flex">
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-bookmark-plus-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center border-left border-right">
                        <i className="mdi mdi-account-outline mr-0"></i>
                      </div>
                      <div className="py-3 px-4 d-flex align-items-center justify-content-center">
                        <i className="mdi mdi-alarm-check mr-0"></i>
                      </div>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item preview-item d-flex align-items-center border-0 mt-2"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    Minha conta
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item preview-item d-flex align-items-center border-0"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    Trocar senha
                  </Dropdown.Item>

                  <Dropdown.Item
                    className="dropdown-item preview-item d-flex align-items-center border-0"
                    onClick={this.handleSair}
                  >
                    Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            onClick={this.toggleOffcanvas}
          >
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  Navbar
);
