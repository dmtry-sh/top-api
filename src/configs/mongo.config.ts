import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { Logger } from '@nestjs/common';

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
    return {
        uri: getMongoConnectString(configService),
        ...getMongoOptions(),
    };
};


const getMongoConnectString = (configService: ConfigService): string => {
    const user = configService.get('MONGO_USER');
    const password = configService.get('MONGO_PASSWORD');
    const host = configService.get('MONGO_HOST');
    const port = configService.get('MONGO_PORT');
    const dbName = configService.get('MONGO_DBNAME');

    return `mongodb://${user}:${password}@${host}:${port}/${dbName}`;
};

const getMongoOptions = () => ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
