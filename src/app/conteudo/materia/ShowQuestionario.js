import React, { Component } from "react";
import { connect } from "react-redux";
import ItemModel from "../../../models/item";

export class Questionario extends Component {
  constructor(props) {
    super(props);
    this.state = { item: null };
    this.carregaQuestionario = this.carregaQuestionario.bind(this);
  }
  requestsConfig = require("../../config/request");
  componentDidMount() {
    this.carregaQuestionario(this.props.id);
  }
  carregaQuestionario(id) {
    fetch(this.props.apiUrl + "item/" + id, this.requestsConfig.config)
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          item: data,
        })
      );
  }

  render() {
    if(this.state.item!==null) {
      
    return <div>{this.state.item.pkItem}</div>;
  }else{
    return <div>NULO</div>
  }
  }
}

export default connect((store) => ({ text: store.text, apiUrl: store.apiUrl }))(
  Questionario
);
