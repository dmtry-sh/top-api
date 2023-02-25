import { Injectable } from '@nestjs/common';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class TopPageService {
    constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
    }

    async create(dto: CreateTopPageDto) {
        return this.topPageModel.create(dto);
    }

    findById(id: string) {
        return this.topPageModel.findById(id).exec();
    }

    findByAlias(alias: string) {
        return this.topPageModel.findOne({ alias }).exec();
    }

    findByFirstCategory(firstCategory: TopLevelCategory) {
        return this.topPageModel
            .aggregate()
            .match({ firstCategory })
            .group({
                _id: { secondCategory: '$secondCategory' },
                pages: { $push: { alias: '$alias', title: '$title' } },
            }).exec();
    }

    findByText(text: string) {
        return this.topPageModel.find({
            $text: { $search: text, $caseSensitive: false },
        }).exec();
    }

    updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    deleteById(id: string) {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }
}
