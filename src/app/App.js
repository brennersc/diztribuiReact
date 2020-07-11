import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.scss";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";
import Footer from "./shared/Footer";
import axios from "axios";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
class App extends Component {
  state = {};
  componentDidMount() {
    this.onRouteChanged();
    const cookies = new Cookies();
    const user = cookies.get("user");
    const token = cookies.get("token");
    const nomeUsuario = cookies.get("nomeUsuario");
    const imagemUsuario = cookies.get("imagemUsuario");

    if (
      (user === "" ||
        typeof user === "undefined" ||
        token === "" ||
        typeof token === "undefined") &&
      this.props.location.pathname !== "/login"
    ) {
      this.props.history.push("/login");
    }

    if (
      (nomeUsuario === "" ||
        typeof nomeUsuario === "undefined" ||
        imagemUsuario === "" ||
        typeof imagemUsuario === "undefined") &&
      this.props.location.pathname !== "/login"
    ) {
      let config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      axios
        .post(this.props.apiUrl+"/me", "", config)
        .then((res) => {
          cookies.set("nomeUsuario", res.data.nome);
          cookies.set("imagemUsuario", res.data.urlimage);
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
  }

  render() {
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : "";
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : "";
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";
    return (
      <div className="container-scroller">
        {navbarComponent}
        <ToastContainer />
        <div className="container-fluid page-body-wrapper">
          {sidebarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
            
              <AppRoutes />
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    window.scrollTo(0, 0);
    const fullPageLayoutRoutes = [
      "/login",
      "/user-pages/login-2",
      "/user-pages/register-1",
      "/user-pages/register-2",
      "/user-pages/lockscreen",
      "/error-pages/error-404",
      "/error-pages/error-500",
      "/general-pages/landing-page",
    ];
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.add("full-page-wrapper");
        break;
      } else {
        this.setState({
          isFullPageLayout: false,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.remove("full-page-wrapper");
      }
    }
  }
}

export default withRouter(
  connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(App)
);
