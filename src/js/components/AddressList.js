AddressPage = React.createClass({
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

export default AddressPage
