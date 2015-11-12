'use strict';

// React AddressContainer. Responsible for fetching data.

var AddressContainer = React.createClass({
  getInitialState: function getInitialState() {
    return {
      addresses: [],
      total: ''
    };
  },
  componentDidMount: function componentDidMount() {
    // check cache for cached response
    var cacheAddresses = localStorage.getItem('addresses');
    if (cacheAddresses) {
      console.log('using local storage');
      var cacheAddresses = JSON.parse(cacheAddresses);
      this.setState({
        addresses: cacheAddresses,
        total: cacheAddresses.length
      });
    } else {
      console.log('fetching data');
      var request = new XMLHttpRequest();
      var self = this;

      // when request returns a result set state
      request.onreadystatechange = function () {
        if (request.readyState >= 4 && request.status >= 200) {
          var addresses = JSON.parse(request.responseText);
          addresses = addresses.data;
          localStorage.setItem('addresses', JSON.stringify(addresses));

          if (self.isMounted()) {
            self.setState({
              addresses: addresses,
              total: addresses.length
            });
          }
        }
      };

      // configure method and url via props.data string
      request.open("GET", this.props.data);
      request.send(null);
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(AddressPage, {
        addresses: this.state.addresses,
        total: this.state.total })
    );
  }
});

// Renders Address page
var AddressPage = React.createClass({
  handlePageChange: function handlePageChange(page) {

    var newPage;

    if (this.state.page === this.state.numberOfPages) {
      newPage = this.state.page + page > this.state.numberOfPages ? this.state.numberOfPages : Number(this.state.page) + page;
    } else {
      newPage = this.state.page + page < 1 ? 1 : Number(this.state.page) + page;
    }

    this.setState({ page: newPage });
  },
  handlePageSizeChange: function handlePageSizeChange(event) {

    var newSize = Number(event.target.value);
    var numberOfPages = Math.floor(Number(this.props.total) / newSize);

    this.setState({
      page: 1,
      pageSize: newSize,
      numberOfPages: numberOfPages
    });
  },
  populateAddresses: function populateAddresses(addressArray) {
    var end = this.state.page * this.state.pageSize - 1;
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
      pageSize: 5,
      pageSizeDefaults: [5, 10, 25, 50, 75, 100],
      numberOfPages: 20
    };
  },
  updateNumberOfPages: function updateNumberOfPages() {
    this.setState({ numberOfPages: numberOfPages });
  },
  render: function render() {
    var addresses = this.populateAddresses(this.props.addresses);
    return React.createElement(
      'section',
      null,
      React.createElement(
        'div',
        { className: 'cb' },
        React.createElement(Button, {
          className: 'button fl mr',
          name: '<< Previous',
          handleClick: this.handlePageChange.bind(null, -1) }),
        React.createElement(
          'p',
          { className: 'count' },
          'Page ',
          this.state.page,
          ' of ',
          this.state.numberOfPages
        ),
        React.createElement(Button, {
          className: 'button fl mr',
          name: 'Next >>',
          handleClick: this.handlePageChange.bind(null, 1) }),
        React.createElement(AddressPageDropdown, {
          pageSizeDefaults: this.state.pageSizeDefaults,
          handleChange: this.handlePageSizeChange,
          page: this.state.page,
          className: 'fr mr' })
      ),
      React.createElement(
        'div',
        { className: 'cb' },
        React.createElement(AddressList, { addresses: addresses })
      )
    );
  }
});

// Renders Button. Controls page of addresses.
var Button = React.createClass({
  render: function render() {
    return React.createElement(
      'a',
      {
        href: '#',
        className: this.props.className,
        onClick: this.props.handleClick },
      this.props.name
    );
  }
});

// Renders Address page dropdown. Controls number of addresses displayed at once.
var AddressPageDropdown = React.createClass({
  getDefaultProps: function getDefaultProps() {
    return { pageSizeDefaults: null, page: null };
  },
  render: function render() {
    var options = this.props.pageSizeDefaults.map(function (value, index) {
      return React.createElement(
        'option',
        {
          value: value,
          key: index },
        'Display ',
        value,
        ' items'
      );
    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'select',
        {
          onChange: this.props.handleChange,
          className: this.props.className },
        options
      )
    );
  }
});

// Renders List of Addresses
var AddressList = React.createClass({
  getDefaultProps: function getDefaultProps() {
    return {
      addresses: []
    };
  },
  render: function render() {
    var AddressTable = this.props.addresses.map(function (address, index) {

      return React.createElement(AddressItem, {
        address: address,
        key: index });
    });
    return React.createElement(
      'table',
      null,
      React.createElement(
        'tbody',
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
      )
    );
  }
});

// Renders individual Addresses
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
