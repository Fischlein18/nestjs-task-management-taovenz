import { NotFoundException } from '@nestjs/common';
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
const mockUser = { id: 10, username: 'Test User'}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
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

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = { title: 'Test Task', description: 'Test Description' }
            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await tasksService.getTaskById(1, mockUser)
            expect(result).toEqual(mockTask)

            expect(taskRepository.findOne).toHaveBeenCalledWith( {
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            })
        })

        it('throws an error if task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null)
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('some task')

            expect(taskRepository.createTask).not.toHaveBeenCalled()

            const createTaskDto = {title: 'Test Task', description: 'Test Description' }
            const result = await tasksService.createTask( createTaskDto, mockUser)
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser)
            expect(result).toEqual('some task')

        })
    })

    describe('deleteTask', () => {
        it('calls taskRepository.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 })
            expect(taskRepository.delete).not.toHaveBeenCalled()

            const result = await tasksService.deleteTask(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id })
        })

        it('throws an error as task could not be found', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
          });
    })

    describe('updateTaskStatus', () => {
        it('find the task and update its status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            })

            expect(tasksService.getTaskById).not.toHaveBeenCalled()

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser)
            expect(tasksService.getTaskById).toHaveBeenCalledWith( 1, mockUser )
            expect(save).toHaveBeenCalled()
            expect(result.status).toEqual(TaskStatus.DONE)
        })     
    })  

})