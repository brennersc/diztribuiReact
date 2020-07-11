import React from 'react';
import { Link } from 'react-router-dom';



class MenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date(), Nomes: props.nomes };
    }
    render() {

        const listItems = this.state.Nomes.map((number) =>
            <li className="nav-item">
                <Link className='nav-link' to="/basic-ui/buttons">{number}</Link>
            </li>
        );
        return listItems;
    }
   
}

export default MenuItem;
