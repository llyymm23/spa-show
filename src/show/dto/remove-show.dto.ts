import { PickType } from '@nestjs/mapped-types';

import { CreateShowDto } from './create-show.dto';

export class RemoveShowDTO extends PickType(CreateShowDto, ['title']) { }