import { compare, hashSync } from 'bcryptjs'

export const encrypt = (text) => {
    const hash = hashSync(text, 10);
    return hash
}

export const compareEncrypt = (password, hashPassword) => {
    return compare(password, hashPassword)
}