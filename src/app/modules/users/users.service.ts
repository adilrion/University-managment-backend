import { ApiError } from '../../../Error/apiError'
import config from '../../../config'
import { IUser } from './users.interface'
import { User } from './users.model'
import { createNewUserId } from './users.utils'

const createUser = async (user: IUser): Promise<IUser | null> => {
  if (!user?.password) {
    user.password = config.user_password as string
  }

  if (user) {
    user.userId = await createNewUserId()
  }

  const createUser = await User.create(user)

  if (!createUser) {
    throw new ApiError(400, 'Failed to create user!')
  }

  return createUser
}

export const UserService = {
  createUser,
}
