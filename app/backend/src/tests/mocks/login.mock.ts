import IUser from "../../Interfaces/User";

export const userMock: IUser = {
  id:1,
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
  role: 'user',
  username: 'user'
}

export const bodyWithoutEmail = { password: 'password' }
export const bodyWithoutPass = { email: 'emailvalido@gmail.com' }
export const bodyInvalidEmail = { email: 'emailinvalido', password: 'password' }
export const bodyInvalidPass = { email: 'emailvalido@gmail.com', password: 'a' }
export const validBody = { email: 'user@user.com', password: 'secret_user' }
export const validBodyWrongPass = { email: 'user@user.com', password: 'secret_usesddasdsaddsar' }