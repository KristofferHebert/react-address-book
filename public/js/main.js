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
            if (request.readyState >= 4 && request.status >= 200) {
                var addresses = JSON.parse(request.responseText);
                if (self.isMounted()) {
                    self.setState({ addresses: addresses.data });
                    console.log('mounted');
                }
            }
        };

        // configure method and url via props.data string
        request.open("GET", this.props.data);
        request.send(null);
    },

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(AddressPage, { addresses: this.state.addresses })
        );
    }
});

var AddressPage = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            addresses: []
        };
    },
    handlePageChange: function handlePageChange(page) {
        var newPage = this.stage + page < 1 ? 1 : this.stage + page;
        this.setState({
            page: newPage
        });
    },
    handlePageSizeChange: function handlePageSizeChange(pageSize) {
        this.setState({
            pageSize: pageSize
        });
    },
    populateAddresses: function populateAddresses(addressArray) {
        var end = this.state.page * this.state.pageSize;
        var index = end - this.state.pageSize;
        index = this.state.page === 1 ? -1 : index;
        var result = Array(end);
        while (index++ < end) {
            result[index] = addressArray[index];
        }
        return result;
    },
    getInitialState: function getInitialState() {
        return {
            page: 1,
            pageSize: 25,
            pageSizeDefaults: [5, 10, 25, 50, 75, 100]
        };
    },
    render: function render() {
        var addresses = this.populateAddresses(this.props.addresses);
        console.log(addresses);
        return React.createElement(
            'div',
            null,
            React.createElement(AddressPageDropdown, { pageSizeDefaults: this.state.pageSizeDefaults, handleChange: this.handlePageSizeChange, page: this.state.page }),
            React.createElement(AddressList, { addresses: addresses })
        );
    }
});

var AddressPageDropdown = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            pageSizeDefaults: 25,
            page: 1,
            handleChange: function handleChange() {}
        };
    },
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'select',
                null,
                React.createElement('option', null)
            )
        );
    }
});

var AddressList = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            addresses: [{
                City: "Seattle",
                FirstName: "First 0",
                LastName: "Last",
                State: "WA",
                Street: "Sample street 123",
                Zip: "98087"
            }]
        };
    },
    render: function render() {
        var AddressTable = this.props.addresses.map(function (address) {
            return React.createElement(AddressItem, { address: address });
        });
        return React.createElement(
            'table',
            null,
            React.createElement(
                'tr',
                null,
                React.createElement(
                    'th',
                    null,
                    'First Name'
                ),
                React.createElement(
                    'th',
                    null,
                    'Last Name'
                ),
                React.createElement(
                    'th',
                    null,
                    'Street'
                ),
                React.createElement(
                    'th',
                    null,
                    'State'
                ),
                React.createElement(
                    'th',
                    null,
                    'Zip'
                )
            ),
            AddressTable
        );
    }
});

var AddressItem = React.createClass({
    render: function render() {
        console.log(this.props.address);
        return React.createElement(
            'tr',
            null,
            React.createElement(
                'td',
                null,
                this.props.address.FirstName
            ),
            React.createElement(
                'td',
                null,
                this.props.address.LastName
            ),
            React.createElement(
                'td',
                null,
                this.props.address.Street
            ),
            React.createElement(
                'td',
                null,
                this.props.address.State
            ),
            React.createElement(
                'td',
                null,
                this.props.address.Zip
            )
        );
    }
});

React.render(React.createElement(AddressContainer, { data: '/api/address' }), document.getElementById('app'));
