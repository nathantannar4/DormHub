import React, { Component } from 'react';

class PriceForm extends Component {
    constructor(props) {
        super(props);
        this.state = { value: undefined };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.title, this.state.value)
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" placeholder="New Price" value={this.state.value} onChange={this.handleChange} />
                <input type="submit" value="Update" />
            </form>
        );
    }
}

export default PriceForm;