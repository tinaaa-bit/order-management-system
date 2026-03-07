import React from 'react'
import { Table, Header, Icon, Button } from 'semantic-ui-react'

function OrderTable({ orders, deleteOrder }) {
    let orderList

    if (!orders || orders.length === 0) {
        orderList = (
            <Table.Row key='no-order'>
                <Table.Cell collapsing textAlign='center' colSpan='5'>
                    No orders found
                </Table.Cell>
            </Table.Row>
        )
    } else {
        orderList = orders.map(order => (
            <Table.Row key={order.id}>
                <Table.Cell>{order.id}</Table.Cell>
                <Table.Cell>{order.createdAt}</Table.Cell>
                <Table.Cell>{order.description}</Table.Cell>
                <Table.Cell>{order.user?.username}</Table.Cell>
                <Table.Cell collapsing>
                    <Button
                        color='red'
                        size='small'
                        onClick={() => deleteOrder(order.id)}
                    >
                        Delete
                    </Button>
                </Table.Cell>
            </Table.Row>
        ))
    }

    return (
        <>
            <Header as='h2'>
                <Icon name='shopping bag' />
                <Header.Content>All Orders</Header.Content>
            </Header>

            <Table compact striped celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={4}>ID</Table.HeaderCell>
                        <Table.HeaderCell width={4}>Created At</Table.HeaderCell>
                        <Table.HeaderCell width={4}>Description</Table.HeaderCell>
                        <Table.HeaderCell width={2}>User</Table.HeaderCell>
                        <Table.HeaderCell width={2}>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{orderList}</Table.Body>
            </Table>
        </>
    )
}

export default OrderTable