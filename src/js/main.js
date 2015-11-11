'use strict'

var AddressContainer = React.createClass({
    getInitialState: function(){
        return {
          addresses: []
      }
    },
    componentDidMount(){
            var request = new XMLHttpRequest()
            var self = this

    	// when request returns a result set state
            request.onreadystatechange = function(){
                if(request.readyState >= 4 && request.status >= 200){
                    var addresses = JSON.parse(request.responseText)
                    if(self.isMounted()){
                        self.setState({addresses: addresses.data})
                        console.log('mounted')
                    }
                }
            }

    	// configure method and url via props.data string
            request.open("GET", this.props.data)
            request.send(null)

        },
        render: function(){
            return (
                <div>
                    <AddressPage addresses={this.state.addresses}/>
                </div>
            )
        }
})

var AddressPage = React.createClass({
    getDefaultProps: function() {
        return {
            addresses: []
        }
    },
    handlePageChange: function(page){
            var newPage = (this.stage + page < 1) ? 1 : this.stage + page
            this.setState({
                page: newPage
            })
    },
    handlePageSizeChange: function(pageSize){
            this.setState({
                pageSize: pageSize
            })
    },
    populateAddresses: function(addressArray){
        var end = this.state.page * this.state.pageSize
        var index = end - this.state.pageSize
        index = (this.state.page === 1) ? -1 : index
        var result = Array(end)
            while(index++ < end){
                result[index] = addressArray[index]
            }
            return result
    },
    getInitialState: function(){
        return {
            page: 1,
            pageSize: 25,
            pageSizeDefaults: [5,10,25,50,75,100]
        }
    },
    render: function(){
            var addresses = this.populateAddresses(this.props.addresses)
            console.log(addresses)
            return (
                <div>
                    <AddressPageDropdown pageSizeDefaults={this.state.pageSizeDefaults} handleChange={this.handlePageSizeChange} page={this.state.page} />
                    <AddressList addresses={addresses} />
                </div>
            )
    }
})

var AddressPageDropdown = React.createClass({
    getDefaultProps: function() {
        return {
            pageSizeDefaults: 25,
            page: 1,
            handleChange: function(){

            }
        }
    },
    render: function(){
        return(
            <div>
                <select><option></option></select>
            </div>
        )
    }
})

var AddressList = React.createClass({
    getDefaultProps: function(){
        return {
            addresses: [{
              City: "Seattle",
              FirstName: "First 0",
              LastName: "Last",
              State: "WA",
              Street: "Sample street 123",
              Zip: "98087"
            }]
        }
    },
    render: function(){
            var AddressTable = this.props.addresses.map(function(address){
                return <AddressItem address={address}/>
            })
        return (
            <table>
                <tr>
                    <th>First Name</th>
                <th>Last Name</th>
            <th>Street</th>
        <th>State</th>
    <th>Zip</th>
                </tr>
                {AddressTable}
            </table>
        )
    }
})

var AddressItem = React.createClass({
    render: function(){
        console.log(this.props.address)
        return (
          <tr><td>{this.props.address.FirstName}</td>
              <td>{this.props.address.LastName}</td>
              <td>{this.props.address.Street}</td>
              <td>{this.props.address.State}</td>
              <td>{this.props.address.Zip}</td>
          </tr>
        )
    }
})





React.render(<AddressContainer data="/api/address" />, document.getElementById('app'))
