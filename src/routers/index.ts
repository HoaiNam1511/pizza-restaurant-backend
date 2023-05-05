import productRouter from './products';
import categoryRouter from './category';
import orderRouter from './order';
import bookingRouter from './booking';
import tableRouter from './table';
import accountRouter from './account';
import authRouter from './auth';

function route(app: any) {
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/order', orderRouter);
    app.use('/booking', bookingRouter);
    app.use('/table', tableRouter);
    app.use('/account', accountRouter);
    app.use('/auth', authRouter);
}

module.exports = route;
