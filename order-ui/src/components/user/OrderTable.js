import React from 'react'
import { Table, Header, Icon } from 'semantic-ui-react'

function OrderTable({ orders }) {
    let orderList

    if (!orders || orders.length === 0) {
        orderList = (
            <Table.Row key='no-order'>
                <Table.Cell collapsing textAlign='center' colSpan='3'>
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
            </Table.Row>
        ))
    }

    return (
        <>
            <Header as='h3'>
                <Icon name='history' />
                <Header.Content>Order History</Header.Content>
            </Header>

            <Table compact striped celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={5}>ID</Table.HeaderCell>
                        <Table.HeaderCell width={5}>Created At</Table.HeaderCell>
                        <Table.HeaderCell width={6}>Description</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{orderList}</Table.Body>
            </Table>
        </>
    )
}

export default OrderTable