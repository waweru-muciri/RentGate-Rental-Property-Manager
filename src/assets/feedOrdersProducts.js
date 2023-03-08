const feedOrdersProducts =
    [
        {
            id: 1,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 2,
                name: 'Item 2',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 2,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 3,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 4,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 6,
                name: 'Item 6',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 5,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 6,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 7,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 8,
                name: 'Item 8',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },
        {
            id: 8,
            order_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            order_item: {
                id: 4,
                name: 'Item 4',
                unit_price: 1000,
                quantity: 1000,
                reorder_level: 100
            },
            order_quantity: 500,
        },

    ]

export default feedOrdersProducts