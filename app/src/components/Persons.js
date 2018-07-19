import React, { Component } from 'react';

class Persons extends Component {

    constructor(props) {
        super(props)
        this.state = { people: [], isLoaded: false, error: null }
    }

    componentDidMount() {
        fetch('/persons')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    isLoaded: true,
                    people: data
                });
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
        const { error, isLoaded, people } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <table>
                    <thead>{this.generateHeaders(people)}</thead>
                    <tbody>{this.generateRows(people)}</tbody>
                </table>
            );
        }
    }

    generateHeaders(data) {
        if (data.length === 0) { return }
        const keys = Object.keys(data[0])
        const cells = keys.map((key) => (<th key={key}>{key}</th>))
        return <tr>{cells}</tr>
    }

    generateRows(data) {
        if (data.length === 0) { return }
        const keys = Object.keys(data[0])
        return data.map(function(item) {
            const cells = keys.map((key) => (<td key={key}>{item[key]}</td>))
            return <tr key={item.id}>{cells}</tr>
        });
    }

}

export default Persons;