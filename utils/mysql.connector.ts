import { createPool, Pool } from "mysql";

let pool: Pool

export const init = () => {
  try {
    pool = createPool({
      connectionLimit: 100,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'api'
    })
    console.debug('MySql Adapter Pool generated successfully')
  }
  catch (error) {
    console.log(`[mysql.connector][init][Error]: `, error)
    throw new Error(`Failed to initialize pool`)
  }
}

export const execute = <T>(query: string, params: string[] | Object): Promise<T> => {
  try {
    if(!pool) throw new Error('Pool was not created.')

    return new Promise<T>((resolve, reject) => {
      pool.query(query, params, (error, result) => {
        if(error) reject(error)
        else resolve(result)
      })
    })
  } catch(error){
    console.log('[mysql.connector][execute][Error]: ', error)
    throw new Error('Failed to execute MySQL query')
  }
}