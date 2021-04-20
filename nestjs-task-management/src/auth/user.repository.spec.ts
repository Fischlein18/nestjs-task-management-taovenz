import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword'}
describe('UserRepository', () => {
    let userRepository

    beforeEach(async() => {
        const module = await Test.createTestingModule({
            providers: [
                UserRepository
            ]
        }).compile()

        userRepository = await module.get<UserRepository>(UserRepository)
    })

    describe('signUp', () => {
        let save

        beforeEach(() => {
            save = jest.fn()
            userRepository.create = jest.fn().mockReturnValue({ save })
        })

        it('successfully signs up the user', async () => {
            save.mockResolvedValue( undefined )
            await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow()
        })

        it('throws a conflict exception as username already exists', async () => {
            save.mockRejectedValue({ code: '23505'})
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException)
        })

        it('throws an internal server error', async () => {
            save.mockRejectedValue({ code: '12345'})
            await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException)
        })
    })

    describe('validateUserPassword', () => {
        let user

        beforeEach(() => {
            userRepository.findOne = jest.fn()
            user = new User()
            user.username = 'TestUsername'
            user.validatePassword = jest.fn()
        })

        it('returns the username as validation is successful', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(true)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).toHaveBeenCalled()
            expect(result).toEqual('TestUsername')
        })

        it('returns null as user cannot be found', async () => {
            userRepository.findOne.mockResolvedValue(null)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).not.toHaveBeenCalled()
            expect(result).toBeNull()
        })

        it('returns null as password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user)
            user.validatePassword.mockResolvedValue(false)

            const result = await userRepository.validateUserPassword(mockCredentialsDto)
            expect(user.validatePassword).toHaveBeenCalled()
            expect(result).toBeNull()
        })
    })

    describe('hashPassword', () => {
        it('calls bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('TestHash')

            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await userRepository.hashPassword('TestPassword', 'TestSalt')
            expect(bcrypt.hash).toHaveBeenCalled()
            expect(result).toEqual('TestHash')

        })
    })
})