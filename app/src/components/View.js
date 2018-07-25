import React, { Component } from 'react';
import PriceForm from './PriceForm'
import './View.css'

class View extends Component {

    constructor(props) {
        super(props)
        this.state = { person: null, isLoaded: false, error: null }
        this.updateHousePrice = this.updateHousePrice.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({isLoaded: false});
        this.fetchData(newProps);
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    fetchData(props) {
        console.log(props)
        // We get the endpoint from the router path
        const endpoint = props.match.url;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (typeof data.length === "undefined") {
                    this.setState({
                        isLoaded: true,
                        data: data
                    });
                } else {
                    this.setState({
                        isLoaded: true,
                        data: data[0]
                    });
                }
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            }
        )
    }

    render() {
        const { error, isLoaded, data } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (this.props.match.path === "/housing/:title") {
            return (
                <div>
                    {this.generateView(data)}
                    {this.generatePriceForm(this.props.match.params.title)}
                </div>
            )
        } else {
            return this.generateView(data)
        }
    }

    generateView(data) {
        const keys = Object.keys(data)
        return keys.map((key) => ( 
            <div className="content">
                <div key={key}>
                    <h3>{key}</h3>
                    <p>{data[key]}</p>
                </div>
            </div>
        ))
    }

    generatePriceForm(title) {
        return <PriceForm key="update" title={title} onSubmit={this.updateHousePrice} />
    }

    updateHousePrice(title, price) {
        var modifiedData = this.state.data
        modifiedData.price = price
        fetch('/housing/' + title + "/" + price, { method: 'POST' })
            .then(response => response.json())
            .then(message => {
                console.log(message)
                alert(JSON.stringify(message));
                this.setState({
                    isLoaded: true,
                    data: modifiedData
                });
            })
    }

}

export default View;