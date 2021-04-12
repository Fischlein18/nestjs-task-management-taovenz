import { IsEnum, IsIn, isIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
export class GetTasksFilterDto {
    @IsOptional()
    // @IsIn(Object.values(TaskStatus))
    @IsEnum(TaskStatus, {
        message:
          `"$value" is an invalid status. ` +
          `The allowed values are: ${Object.keys(TaskStatus)}`,
      })
    status: TaskStatus

    @IsOptional()
    @IsNotEmpty()
    searchTerm: string
}