'use strict'

// React AddressContainer. Responsible for fetching data.
var AddressContainer = React.createClass( {
  getInitialState: function () {
    return {
      addresses: [],
      total: ''
    }
  },
  componentDidMount() {
    // check cache for cached response
    var cacheAddresses = localStorage.getItem( 'addresses' )
    if ( cacheAddresses ) {
      console.log( 'using local storage' )
      var cacheAddresses = JSON.parse( cacheAddresses )
      this.setState( {
        addresses: cacheAddresses,
        total: cacheAddresses.length
      } )
    } else {
      console.log( 'fetching data' )
      var request = new XMLHttpRequest()
      var self = this

      // when request returns a result set state
      request.onreadystatechange = function () {
        if ( request.readyState >= 4 && request.status >= 200 ) {
          var addresses = JSON.parse( request.responseText )
          addresses = addresses.data
          localStorage.setItem( 'addresses', JSON.stringify( addresses ) )

          if ( self.isMounted() ) {
            self.setState( {
              addresses: addresses,
              total: addresses.length
            } )
          }
        }
      }

      // configure method and url via props.data string
      request.open( "GET", this.props.data )
      request.send( null )
    }
  },
  render: function () {
    return (
    <div>
      <AddressPage
                   addresses={ this.state.addresses }
                   total={ this.state.total } />
    </div>
    )
  }
} )


// Renders Address page
var AddressPage = React.createClass( {
  handlePageChange: function ( page ) {

    var newPage

    if ( this.state.page === this.state.numberOfPages ) {
      newPage = (this.state.page + page > this.state.numberOfPages) ? this.state.numberOfPages : (Number( this.state.page ) + page)
    } else {
      newPage = (this.state.page + page < 1) ? 1 : (Number( this.state.page ) + page)
    }

    this.setState( { page: newPage } )
  },
  handlePageSizeChange: function ( event ) {

    var newSize = Number( event.target.value )
    var numberOfPages = Math.floor( Number( this.props.total ) / newSize )

    this.setState( {
      page: 1,
      pageSize: newSize,
      numberOfPages: numberOfPages
    } )
  },
  populateAddresses: function ( addressArray ) {
    var end = this.state.page * this.state.pageSize - 1
    var index = end - this.state.pageSize
    index = (this.state.page === 1) ? -1 : index

    var result = Array( end )
    while (index++ < end) {
      result[ index ] = addressArray[ index ]
    }
    return result
  },
  getInitialState: function () {
    return {
      page: 1,
      pageSize: 5,
      pageSizeDefaults: [
        5,
        10,
        25,
        50,
        75,
        100
      ],
      numberOfPages: 20
    }
  },
  updateNumberOfPages: function () {
    this.setState( { numberOfPages: numberOfPages } )
  },
  render: function () {
    var addresses = this.populateAddresses( this.props.addresses )
    return (
    <section>
      <div className="cb">
        <Button
            className="button fl mr"
            name="<< Previous"
            handleClick={ this.handlePageChange.bind(null, -1) } />
        <p className="count">
          Page { this.state.page } of { this.state.numberOfPages }
        </p>
        <Button
            className="button fl mr"
            name="Next >>"
            handleClick={ this.handlePageChange.bind(null, 1) } />
        <AddressPageDropdown
             pageSizeDefaults={ this.state.pageSizeDefaults }
             handleChange={ this.handlePageSizeChange }
             page={ this.state.page }
             className="fl mr cr" />
      </div>
      <div className="cb">
        <AddressList addresses={ addresses } />
      </div>
    </section>
    )
  }
} )

// Renders Button. Controls page of addresses.
var Button = React.createClass( {
  render: function () {
    return (
    <a
       href="#"
       className={ this.props.className }
       onClick={ this.props.handleClick }>
      { this.props.name }
    </a>
    )
  }
} )

// Renders Address page dropdown. Controls number of addresses displayed at once.
var AddressPageDropdown = React.createClass( {
  getDefaultProps: function () {
    return { pageSizeDefaults: null, page: null }
  },
  render: function () {
    var options = this.props.pageSizeDefaults.map( function ( value, index ) {
      return <option
                     value={ value }
                     key={ index }>
               { value } items
             </option>
    } )

    return (
    <div>
      <select
              onChange={ this.props.handleChange }
              className={ this.props.className }>
        { options }
      </select>
    </div>
    )
  }
} )

// Renders List of Addresses
var AddressList = React.createClass( {
  getDefaultProps: function () {
    return {
      addresses: []
    }
  },
  render: function () {
    var AddressTable = this.props.addresses.map( function ( address, index ) {

      return <AddressItem
                          address={ address }
                          key={ index } />
    } )
    return (
    <table>
      <tbody>
        <tr>
          <th>
            First Name
          </th>
          <th>
            Last Name
          </th>
          <th>
            Street
          </th>
          <th>
            State
          </th>
          <th>
            Zip
          </th>
        </tr>
        { AddressTable }
      </tbody>
    </table>
    )
  }
} )

// Renders individual Addresses
var AddressItem = React.createClass( {
  getDefaultProps: function () {
    return {
      address: {
        City: "Loading...",
        FirstName: "Loading...",
        LastName: "Loading...",
        State: "Loading...",
        Street: "Loading...",
        Zip: "Loading..."
      }
    }
  },
  render: function () {
    return (
    <tr>
      <td>
        { this.props.address.FirstName }
      </td>
      <td>
        { this.props.address.LastName }
      </td>
      <td>
        { this.props.address.Street }
      </td>
      <td>
        { this.props.address.State }
      </td>
      <td>
        { this.props.address.Zip }
      </td>
    </tr>
    )
  }
} )





React.render( <AddressContainer data="/api/address" />, document.getElementById( 'app' ) )
