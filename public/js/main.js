'use strict';

var AddressContainer = React.createClass({
    getInitialState: function getInitialState() {
        return {
            addresses: []
        };
    },
    componentDidMount: function componentDidMount() {
        var request = new XMLHttpRequest();
        var self = this;

        // when request returns a result set state
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var addresses = JSON.parse(request.responseText);
                if (self.isMounted()) {
                    self.setState({ addresses: addresses.address });
                    console.log('mounted');
                }
            }
        };

        // configure method and url via props.data string
        request.open("GET", this.props.data);
        request.send(null);
    },

    render: function render() {
        console.log(this.state.addresses);
        return React.createElement(
            'div',
            null,
            React.createElement(AddressPage, { addresses: this.state.addresses })
        );
    }
});

var AddressPage = React.createClass({
    getInitialState: function getInitialState() {
        return {
            page: 1,
            pageSize: 100,
            pageSizeDefaults: [5, 10, 25, 50, 75, 100]
        };
    },
    render: function render() {
        return React.createElement(AddressList, { addresses: this.props.addresses });
    }
});

var AddressList = React.createClass({
    render: function render() {
        console.log(this.props);
        var AddressTable = this.props.addresses.map(function (address) {
            return React.createElement(AddressItem, { address: address });
        });
        console.log(AddressTable);
        return React.createElement(
            'table',
            null,
            AddressTable
        );
    }
});

var AddressItem = React.createClass({
    render: function render() {
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                this.props.address
            )
        );
    }
});

React.render(React.createElement(AddressContainer, { data: '/api/address' }), document.getElementById('app'));
