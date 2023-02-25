import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Module({
    imports: [TypegooseModule.forFeature([
        {
            typegooseClass: ProductModel,
            schemaOptions: {
                collection: 'Product',
            },
        },
    ])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {
}
