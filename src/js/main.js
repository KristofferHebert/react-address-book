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
                if(request.readyState === 4 && request.status === 200){
                    var addresses = JSON.parse(request.responseText)
                    if(self.isMounted()){
                        self.setState({addresses: addresses.address})
                        console.log('mounted')
                    }
                }
            }

    	// configure method and url via props.data string
            request.open("GET", this.props.data)
            request.send(null)

        },
        render: function(){
            console.log(this.state.addresses)
            return (
                <div>
                    <AddressPage addresses={this.state.addresses}/>
                </div>
            )
        }
})

var AddressPage = React.createClass({
    getInitialState: function(){
        return {
            page: 1,
            pageSize: 100,
            pageSizeDefaults: [5,10,25,50,75,100]
        }
    },
    render: function(){
        return (
            <AddressList addresses={this.props.addresses} />
        )
    }
})

var AddressList = React.createClass({
    render: function(){
        console.log(this.props)
        var AddressTable = this.props.addresses.map(function(address){
            return <AddressItem address={address}/>
        })
        console.log(AddressTable)
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
