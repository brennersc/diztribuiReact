import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import Cookies from "universal-cookie";
import axios from "axios";
import { connect } from "react-redux";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = { dataMenu: [] };
  }
  menuAdminObject = [
    {
      name: "Cadastros",
      id: 1,
      url: "/cadastros",
      submenus: [
        { value: "Empresas", url: "/cadastros/empresa" },
        { value: "Usu\u00e1rios", url: "/cadastros/usuario" },      
        { value: "Mat\u00e9rias", url: "/conteudo/materia" },
      ],
      icon: "mdi  mdi-account-details menu-icon",
    },
    {
      name: "Envio de alertas",
      id: 12,
      url: "/alertas",
      submenus: [],
      icon: "mdi  mdi-email-send-outline menu-icon",
    },
    {
      name: "Conteudos",
      id: 12,
      url: "/categorias",
      submenus: [],
      icon: "mdi  mdi-email-send-outline menu-icon",
    },
    {
      name: "Fale Conosco",
      id: 13,
      url: "/fale-conosco",
      submenus: [],
      icon: "mdi  mdi-voice menu-icon",
    },
  ];
  menuMasterObject = [
    {
      name: "Cadastros",
      id: 1,
      url: "/cadastros",
      submenus: [
        
        { value: "Setores", url: "/cadastros/setor" },
        { value: "Cargos", url: "/cadastros/cargo" },        
        { value: "Usu\u00e1rios", url: "/cadastros/usuario" },
        { value: "Gestores", url: "/cadastros/gestor" },
        { value: "Categorias", url: "/cadastros/categoria" },
        { value: "Mat\u00e9rias", url: "/conteudo/materia" },
      ],
      icon: "mdi  mdi-account-details menu-icon",
    },
    {
      name: "Envio de alertas",
      id: 12,
      url: "/alertas",
      submenus: [],
      icon: "mdi  mdi-email-send-outline menu-icon",
    },
    {
      name: "Férias",
      id: 12,
      url: "/cadastros/ferias",
      submenus: [],
      icon: "fa fa-tag menu-icon",
    },
    {
      name: "Fale Conosco",
      id: 13,
      url: "/fale-conosco",
      submenus: [],
      icon: "mdi  mdi-voice menu-icon",
    }
  ];
  menuGestorObject = [
    {
      name: "Cadastros",
      id: 1,
      url: "/cadastros",
      submenus: [
        
        
        { value: "Cargos", url: "/cadastros/cargo" },        
        { value: "Usu\u00e1rios", url: "/cadastros/usuario" },        
        { value: "Categorias", url: "/cadastros/categoria" },
        { value: "Mat\u00e9rias", url: "/conteudo/materia" },
      ],
      icon: "mdi  mdi-account-details menu-icon",
    },
    {
      name: "Envio de alertas",
      id: 12,
      url: "/alertas",
      submenus: [],
      icon: "mdi  mdi-email-send-outline menu-icon",
    },
    {
      name: "Fale Conosco",
      id: 13,
      url: "/fale-conosco",
      submenus: [],
      icon: "mdi  mdi-voice menu-icon",
    }
  ];
  menuUserObject = [
    
    {
      name: "Materias",
      id: 12,
      url: "/categorias",
      submenus: [],
      icon: "mdi  mdi-email-send-outline menu-icon",
    },
    {
      name: "Favoritos",
      id: 12,
      url: "/conteudo/favorito",
      submenus: [],
      icon: "fa fa-star menu-icon",
    },
    {
      name: "Férias",
      id: 12,
      url: "/cadastros/ferias",
      submenus: [],
      icon: "fa fa-tag menu-icon",
    },
    {
      name: "Fale Conosco",
      id: 13,
      url: "/fale-conosco",
      submenus: [],
      icon: "mdi  mdi-voice menu-icon",
    }
  ];
  render() {
    let dataMenuRender = [];
    const cookies = new Cookies();
    const admin = cookies.get('admin');
    const master = cookies.get('master');
    const gestor = cookies.get('gestor');
    if(admin ==1) {
      dataMenuRender = this.menuAdminObject;
    }else if(master==1||master=='true') {
      dataMenuRender = this.menuMasterObject
    }else if(gestor==1 || gestor=='true') {
      dataMenuRender = this.menuGestorObject
    }else  {
      dataMenuRender = this.menuUserObject
    }
    var menuBase = dataMenuRender.map((item) => (
      <li key={item.url} className="nav-item">
        <div className="nav-link" data-toggle="collapse">
          <a href={item.url != "" ? item.url : "#"}>
            <i className={item.icon}></i>
            <span className="menu-title">{item.name}</span>
            <i className="menu-arrow"></i>
          </a>
        </div>
        <Collapse in={true}>
          <ul className="nav flex-column sub-menu">
            {
              (this.subMenu = item.submenus.map((sub) => (
                <li className="nav-item" key={sub.value}>
                  {" "}
                  <Link className="nav-link" to={sub.url}>
                    {sub.value}
                  </Link>
                </li>
              )))
            }
          </ul>
        </Collapse>
      </li>
    ));
    return menuBase;
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  withRouter(Menu)
);
