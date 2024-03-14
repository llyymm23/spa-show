import { PickType } from '@nestjs/mapped-types';

import { CreateShowDto } from './create-show.dto';

export class SearchShowDTO extends PickType(CreateShowDto, ['title']) { }