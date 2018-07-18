import React, { Component } from 'react';

class Person extends Component {

    constructor(props) {
        super(props)
        this.state = { people: [], isLoaded: false, error: null }
    }

    componentDidMount() {
        fetch('/person/' + this.props.match.params.id)
            .then(response => response.json())
            .then(data => {
                console.log(data)
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
                <ul>
                    {people.map(person => (
                        <li key={person.id}>
                            {person.name}
                        </li>
                    ))}
                </ul>
            );
        }
    }
}

export default Person;