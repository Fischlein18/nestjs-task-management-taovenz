import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserEntity', () => {
    let user: User
    
    beforeEach(() => {
        user = new User()
        user.password = 'TestPassword'
        user.salt = 'TestSalt'
        bcrypt.hash = jest.fn()
    })

    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
            bcrypt.hash.mockReturnValue('TestPassword')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('12345')
            expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'TestSalt')
            expect(result).toEqual(true)
        })

        it('returns false as password is not valid', async () => {
            bcrypt.hash.mockReturnValue('wrong Password')
            expect(bcrypt.hash).not.toHaveBeenCalled()
            const result = await user.validatePassword('12345')
            expect(bcrypt.hash).toHaveBeenCalledWith('12345', 'TestSalt')
            expect(result).toEqual(false)
        })
    })
})