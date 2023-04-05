import productRouter from './products';
import categoryRouter from './category';
import orderRouter from './order';

function route(app: any) {
    app.use('/product', productRouter);
    app.use('/category', categoryRouter);
    app.use('/order', orderRouter);
}

module.exports = route;
