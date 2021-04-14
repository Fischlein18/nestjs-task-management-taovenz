import { Test, TestingModule } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

// import { User } from '../auth/user.entity';
// class MockUser extends User {
//     constructor() { super() }
// }
// const mockUser = new MockUser
// mockUser.username = 'Test User'
const mockUser = { username: 'Test User'}

const mockTaskRepository = () => ({
    getTasks: jest.fn()
})

describe('TasksService', () => {
    let taskRepository
    let tasksService

    beforeEach( async () => {
        const testModule: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile()

        tasksService = testModule.get<TasksService>(TasksService)
        taskRepository = testModule.get<TaskRepository>(TaskRepository)
    })
    
    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled()

            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, searchTerm: 'some search query'}

            //call tasksService.getTasks
            const result = await tasksService.getTasks(filters, mockUser)
            //expect tasksService.getTasks to have been called
            expect(taskRepository.getTasks).toHaveBeenCalled()
            expect(result).toEqual('some value')
        })
    })
    
})