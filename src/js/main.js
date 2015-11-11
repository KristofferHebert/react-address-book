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
    handlePageChange: function(page){
            var newPage = (this.state.page + page < 1) ? 1 : (Number(this.state.page) + page)
            this.setState({
                page: newPage
            })
    },
    handlePageSizeChange: function(event){
            this.setState({
                pageSize: Number(event.target.value)
            })
    },
    populateAddresses: function(addressArray){
        var end = this.state.page * this.state.pageSize -1
        var index = end - this.state.pageSize
        index = (this.state.page === 1) ? -1 : index

        console.log(this.state,index, end)

        var result = Array(end)
            while(index++ < end){
                result[index] = addressArray[index]
            }
            return result
    },
    getInitialState: function(){
        return {
            page: 1,
            pageSize: 5,
            pageSizeDefaults: [5,10,25,50,75,100]
        }
    },
    render: function(){
            var addresses = this.populateAddresses(this.props.addresses)
            return (
                <div>
                    <AddressPageDropdown pageSizeDefaults={this.state.pageSizeDefaults} handleChange={this.handlePageSizeChange} page={this.state.page}  className="fl"/>
                    <Button className="button" name="<< Previous" handleClick={this.handlePageChange.bind(null, -1)} />
                    <Button className="button" name="Next >>" handleClick={this.handlePageChange.bind(null, 1)} />
                    <AddressList addresses={addresses} />
                </div>
            )
    }
})

var Button = React.createClass({
    render: function(){
        return (
            <a href="#" className={this.props.className} onClick={this.props.handleClick}>{this.props.name}</a>
        )
    }
})

var AddressPageDropdown = React.createClass({
    getDefaultProps: function() {
        return {
            pageSizeDefaults: null,
            page: null
        }
    },
    render: function(){
        var options = this.props.pageSizeDefaults.map(function(value, index){
            return <option value={value} key={index}>{value} items</option>
        })

        return(
            <div>
                <select onChange={this.props.handleChange} className="this.pros.className">{options}</select>
            </div>
        )
    }
})

var AddressList = React.createClass({
    getDefaultProps: function(){
        return {
            addresses: []
        }
    },
    render: function(){
            var AddressTable = this.props.addresses.map(function(address, index){

                return <AddressItem address={address} key={index}/>
            })
        return (
            <table>
                 <tbody>
                <tr>
                    <th>First Name</th>
                <th>Last Name</th>
            <th>Street</th>
        <th>State</th>
    <th>Zip</th>
                </tr>
                {AddressTable}
            </tbody>
            </table>
        )
    }
})

var AddressItem = React.createClass({
    getDefaultProps: function(){
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
    render: function(){
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
