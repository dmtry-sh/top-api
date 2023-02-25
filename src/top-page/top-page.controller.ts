import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-pages')
export class TopPageController {
    constructor(private readonly topPageService: TopPageService) {
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const page = await this.topPageService.findById(id);
        if (!page) {
            throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
        }

        return page;
    }

    @Get('byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        const page = this.topPageService.findByAlias(alias);
        if (!page) {
            throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
        }
    }

    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }

    @UsePipes(new ValidationPipe())
    @Post('/find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByFirstCategory(dto.firstCategory);
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
        const updatedPage = await this.topPageService.updateById(id, dto);
        if (!updatedPage) {
            throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
        }

        return updatedPage;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedPage = await this.topPageService.deleteById(id);
        if (!deletedPage) {
            throw new BadRequestException(TOP_PAGE_NOT_FOUND_ERROR);
        }
    }
}
