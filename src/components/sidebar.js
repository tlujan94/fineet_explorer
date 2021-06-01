import React from 'react';
import { QuerySelector } from "./sidebar_utils/querySelector";

import 'react-datepicker/dist/react-datepicker.css';
import './sidebar.css';
import {DateSelector} from "./sidebar_utils/dateSelector";


export class Sidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
        this.sidebar = React.createRef();
    }

    render() {
        return (
            <div id='mySidebar' className='sidebar' ref={this.sidebar}>
                <div className='header'>
                    <h3 style={{display: 'table-cell'}}>Query-Builder</h3>
                    <div style={{display: 'table-cell', textAlign: 'right'}}>
                        <button className='btn' onClick={this.toggleSidebar.bind(this)}>&times;</button>
                    </div>
                </div>
                <DateSelector/>
                <QuerySelector/>
                <div className='footer'>
                    <button>submit</button>
                </div>
            </div>
        );
    }

    toggleSidebar() {
        const width = this.state.isOpen ? '0px' : '256px';
        const toggle = !this.state.isOpen;
        this.sidebar.current.style.width = width;
        this.setState({
            isOpen: toggle
        });
    }
}