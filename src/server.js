import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './extract-query-params.js'

// Query Parameters: URL Stateful => Filtros, Paginação. não obrigatórios
// http://localhost:3333/users?userId=1&name=Renato

// Route Parameters: Identificação de recurso
// GET http://localhost:3333/users/1
// DELETE http://localhost:3333/users/1

// Request Body: Envio de informaçòes de um formulário (HTTPs)
// http://localhost:3333/users

const server = http.createServer(async (req, res) => {
   const { method, url } = req

   await json(req, res)

   const route = routes.find(route => {
      // return route.method === method && route.path === url
      return route.method === method && route.path.test(url)
   })

   if (route) {
      const routeParams = req.url.match(route.path)
      // console.log(routeParams)

      const { query, ...params } = routeParams.groups

      req.params = params
      req.query = query ? extractQueryParams(query) : {}

      return route.handler(req, res)
   }

   return res.writeHead(404).end('Not Found')
})

server.listen(3333)
