import React, { Component } from 'react'
import { connect } from 'react-redux'
import Cookies from 'universal-cookie';


export class BasicTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }


    render() {       

        
        this.areas = this.state.data.map((item) =>
            <tr key={item.pkArea}>
                <td className="py-1">
                    {item.NomeArea}
                </td>
                <td>
                    <div className="row">
                        <div className="col-md-3"><a  className="btn btn-light" href={"area/edit/" + item.pkArea}>Editar <i className="mdi mdi-square-edit-outline"></i></a></div>
                        <div className="col-md-3"><a href="areas/del" className="btn btn-secondary">Excluir <i className="mdi mdi-delete"></i></a></div>
                    </div>

                </td>

            </tr>          
            
        );
        return (
            <div>
                <div className="page-header">
                    <h3 className="page-title"> Áreas </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Cadastros</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Áreas</li>
                        </ol>
                    </nav>
                </div>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-md-2"><a href="area/add" className="btn btn-success btn-block"><i className="mdi mdi-plus-box"></i> Adicionar</a></div>
                                <div className="table-responsive">

                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.areas}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        const cookies = new Cookies();
        const token = cookies.get("token");
        let config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        fetch(this.props.apiUrl + 'area',config)
            .then(response => response.json())
            .then(data => this.setState({ data }));

    };
}


export default connect(store => ({ text: store.text, apiUrl: store.apiUrl }))(BasicTable)
