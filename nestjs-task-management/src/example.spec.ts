//feature
class FriendsList {
    friends = []

    addFriend(name: string) {
        this.friends.push(name)
        this.announceFriendship(name)
    }

    announceFriendship(name: string) {
        global.console.log(`${name} is now a friend!`)
    }

    removeFriend(name: string) {
        const idx = this.friends.indexOf(name)

        if (idx === -1) {
            throw new Error('Friend not found.')
        } 

        this.friends.splice(idx, 1)
    }
}

//tests
describe('FriendsList', () => {
    let friendsList

    beforeEach(() => {
        friendsList = new FriendsList() 
    })

    it('initialize a friends list', () => {
        expect(friendsList.friends.length).toEqual(0)
    })

    it('add a friend', () => {
        friendsList.addFriend('Garfield')

        expect(friendsList.friends.length).toEqual(1)
    })

    it('announce a friendship', () => {
        friendsList.announceFriendship = jest.fn()

        expect(friendsList.announceFriendship).not.toHaveBeenCalled()
        friendsList.addFriend('Garfield')
        expect(friendsList.announceFriendship).toHaveBeenCalledWith('Garfield')
    })
})

describe('removeFriend', () => {
    let friendsList

    beforeEach(() => {
        friendsList = new FriendsList() 
    })
    
    it('remove a friend on the list', () => {
        friendsList.addFriend('Garfield')
        expect(friendsList.friends[0]).toEqual('Garfield')

        friendsList.removeFriend('Garfield')
        expect(friendsList.friends[0]).toBeUndefined()
    })

    it('throws an error as friend does not exist', () => {
        expect( () => friendsList.removeFriend('Garfield') ).toThrowError()
    })
})