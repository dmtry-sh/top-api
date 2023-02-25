import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
    login: 't1@t.com',
    password: '123',
};

const testDto: CreateReviewDto = {
    name: 'Имя',
    title: 'Заголовок',
    description: 'Описание тестовое',
    rating: 5,
    productId,
};

describe('ReviewController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
    let token: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

        token = body.access_token;
    });

    it('/review/create (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send(testDto)
            .expect(201)
            .then(({ body }: request.Response) => {
                createdId = body._id;
                expect(createdId).toBeDefined();
            });
    });

    it('/review/create (POST) - fail', () => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send({ ...testDto, rating: 0 })
            .expect(400);
    });

    it('/review/byProduct/:productId (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + createdId)
            .expect(200)
            .then(({ body }: request.Response) => {
                const createdReview = body.find((r: { _id: string; }) => r._id === createdId);
                expect(createdReview).toBeDefined();
            });
    });

    it('/review/byProduct/:productId (GET) - fail', async () => {
        const id = new Types.ObjectId().toHexString();

        return request(app.getHttpServer())
            .get('/review/byProduct/' + id)
            .expect(200)
            .then(({ body }: request.Response) => {
                const review = body.find((r: { _id: string; }) => r._id === id);
                expect(review).toBeUndefined();
            });
    });

    it('/review/:id (DELETE) - success', async () => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);
    });

    it('/review/:id (DELETE) - fail', async () => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404, {
                statusCode: 404,
                message: REVIEW_NOT_FOUND,
            });
    });


    afterAll(() => {
        disconnect();
    });
});
