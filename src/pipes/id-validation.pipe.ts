import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export const ID_VALIDATION_ERROR = 'Неверный формат ID';

export class IdValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (metadata.type !== 'param') {
            return value;
        }

        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException(ID_VALIDATION_ERROR);
        }

        return value;
    }
}
