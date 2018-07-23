import React, { Component } from 'react';
import './Table.css'

class Table extends Component {

    constructor(props) {
        super(props)
        this.state = { data: [], isLoaded: false, error: null }
    }

    componentWillReceiveProps(newProps) {
        this.setState({ isLoaded: false });
        this.fetchData(newProps);
    }

    componentDidMount() {
        this.fetchData(this.props);
    }

    fetchData(props) {
        console.log(props)
        // We get the endpoint from the router path
        const endpoint = props.match.url + props.location.search;
        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({
                    isLoaded: true,
                    data: data
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
        const { error, isLoaded, data } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <table>
                    <thead>{this.generateHeaders(data)}</thead>
                    <tbody>{this.generateRows(data)}</tbody>
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
        const self = this;
        if (data.length === 0) { return }
        const keys = Object.keys(data[0])
        return data.map(function (item) {
            const cells = keys.map((key) => <td key={key}>{item[key]}</td>)
            if (self.props.match.url === "/reviews") {
                cells.push(<td key='delete'><button onClick={() => self.deleteReview(item.rid)}>Delete</button></td>)
            } else if (self.props.match.url === "/housing") {
                cells.push(<td key='edit'><button onClick={() => self.editPosting(item.postTitle)}>Edit</button></td>)
                cells.push(<td key='delete'><button onClick={() => self.deletePosting(item.postTitle)}>Delete</button></td>)
            }
            return <tr key={item.id === undefined ? JSON.stringify(item) : item.id}>{cells}</tr>
        });
    }

    deleteReview(id) {
        fetch('/review/' + id, { method: 'DELETE' })
            .then(response => response.json())
            .then(message => {
                console.log(message)
                alert(JSON.stringify(message));
                this.setState({
                    isLoaded: true,
                    data: this.state.data.filter(item => item.rid !== id)
                });
            })
    }

    editPosting(title) {
        this.props.history.push('/housing/' + title)
    }

    deletePosting(title) {
        fetch('/housing/' + title, { method: 'DELETE' })
            .then(response => response.json())
            .then(message => {
                console.log(message)
                alert(JSON.stringify(message));
                this.setState({
                    isLoaded: true,
                    data: this.state.data.filter(item => item.postTitle !== title)
                });
            })
    }

}

export default Table;