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
                }
            }
        };

        // configure method and url via props.data string
        request.open("GET", this.props.data);
        request.send(null);
    },

    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(AddressPage, { addresses: this.state.addresses })
        );
    }
});

var AddressPage = React.createClass({
    handlePageChange: function handlePageChange(page) {
        var newPage = this.state.page + page < 1 ? 1 : Number(this.state.page) + page;
        this.setState({
            page: newPage
        });
    },
    handlePageSizeChange: function handlePageSizeChange(event) {
        this.setState({
            pageSize: Number(event.target.value)
        });
    },
    populateAddresses: function populateAddresses(addressArray) {
        var end = this.state.page * this.state.pageSize - 1;
        var index = end - this.state.pageSize;
        index = this.state.page === 1 ? -1 : index;

        console.log(this.state, index, end);

        var result = Array(end);
        while (index++ < end) {
            result[index] = addressArray[index];
        }
        return result;
    },
    getInitialState: function getInitialState() {
        return {
            page: 1,
            pageSize: 5,
            pageSizeDefaults: [5, 10, 25, 50, 75, 100]
        };
    },
    render: function render() {
        var addresses = this.populateAddresses(this.props.addresses);
        return React.createElement(
            "div",
            null,
            React.createElement(AddressPageDropdown, { pageSizeDefaults: this.state.pageSizeDefaults, handleChange: this.handlePageSizeChange, page: this.state.page, className: "fl" }),
            React.createElement(Button, { className: "button", name: "<< Previous", handleClick: this.handlePageChange.bind(null, -1) }),
            React.createElement(Button, { className: "button", name: "Next >>", handleClick: this.handlePageChange.bind(null, 1) }),
            React.createElement(AddressList, { addresses: addresses })
        );
    }
});

var Button = React.createClass({
    render: function render() {
        return React.createElement(
            "a",
            { href: "#", className: this.props.className, onClick: this.props.handleClick },
            this.props.name
        );
    }
});

var AddressPageDropdown = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            pageSizeDefaults: null,
            page: null
        };
    },
    render: function render() {
        var options = this.props.pageSizeDefaults.map(function (value, index) {
            return React.createElement(
                "option",
                { value: value, key: index },
                value,
                " items"
            );
        });

        return React.createElement(
            "div",
            null,
            React.createElement(
                "select",
                { onChange: this.props.handleChange, className: "this.pros.className" },
                options
            )
        );
    }
});

var AddressList = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            addresses: []
        };
    },
    render: function render() {
        var AddressTable = this.props.addresses.map(function (address, index) {

            return React.createElement(AddressItem, { address: address, key: index });
        });
        return React.createElement(
            "table",
            null,
            React.createElement(
                "tbody",
                null,
                React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "th",
                        null,
                        "First Name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Last Name"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Street"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "State"
                    ),
                    React.createElement(
                        "th",
                        null,
                        "Zip"
                    )
                ),
                AddressTable
            )
        );
    }
});

var AddressItem = React.createClass({
    getDefaultProps: function getDefaultProps() {
        return {
            address: {
                City: "Loading...",
                FirstName: "Loading...",
                LastName: "Loading...",
                State: "Loading...",
                Street: "Loading...",
                Zip: "Loading..."
            }
        };
    },
    render: function render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                this.props.address.FirstName
            ),
            React.createElement(
                "td",
                null,
                this.props.address.LastName
            ),
            React.createElement(
                "td",
                null,
                this.props.address.Street
            ),
            React.createElement(
                "td",
                null,
                this.props.address.State
            ),
            React.createElement(
                "td",
                null,
                this.props.address.Zip
            )
        );
    }
});

React.render(React.createElement(AddressContainer, { data: "/api/address" }), document.getElementById('app'));
