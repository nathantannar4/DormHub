import React, { Component } from 'react';

class Person extends Component {

    constructor(props) {
        super(props)
        this.state = { person: null, isLoaded: false, error: null }
    }

    componentDidMount() {
        fetch('/person/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    isLoaded: true,
                    person: data[0]
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
        const { error, isLoaded, person } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return this.generateView(person)
        }
    }

    generateView(data) {
        const keys = Object.keys(data)
        return keys.map((key) => ( 
            <p key={key}>{data[key]}</p>
        ))
    }
}

export default Person;