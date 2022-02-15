import store from '@/store'
import middlewarePipeline from '@/router/middleware'

export default (to, from, next) => {
  const middleware = to.meta.middleware
  const context = { to, from, next, store }

  if (!middleware) {
    return next()
  }

  middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
}
