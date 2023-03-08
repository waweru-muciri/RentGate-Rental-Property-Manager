const dailyFeedingProducts =
    [
        {
            id: 1,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 2,
                name: 'Item 2',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 2,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 3,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 4,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 6,
                name: 'Item 6',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 5,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 6,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 1,
                name: 'Item 1',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 7,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 8,
                name: 'Item 8',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },
        {
            id: 8,
            feeding_date: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            item: {
                id: 4,
                name: 'Item 4',
                unit_price: 1000,
                quantity: 1000,
                reorder_livel: 100
            },
            quantity: 500,
        },

    ]

export default dailyFeedingProducts