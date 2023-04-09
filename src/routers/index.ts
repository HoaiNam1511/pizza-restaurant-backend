import productRouter from './products';
import categoryRouter from './category';
import orderRouter from './order';
import bookingRouter from './booking';
import tableRouter from './table';

function route(app: any) {
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/order', orderRouter);
    app.use('/booking', bookingRouter);
    app.use('/table', tableRouter);
}

module.exports = route;
