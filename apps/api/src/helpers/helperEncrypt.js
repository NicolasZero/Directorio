// const bcrypt = require('bcryptjs')
import {bcrypt} from 'bcryptjs'

export const encrypt = (text) => {
    const hash = bcrypt.hashSync(text, 10);
    return hash
}

export const compare = (password, hashPassword) =>{
    return bcrypt.compare(password,hashPassword)
}