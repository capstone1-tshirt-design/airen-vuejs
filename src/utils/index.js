export function serialize(obj) {
  const keys = Object.keys(obj)
  const data = []

  keys.forEach((key) => {
    data.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  })

  return data.join('&')
}
export function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}
export function toFormData(obj, form, namespace) {
  const fd = form || new FormData()
  let formKey
  const properties = Object.keys(obj)

  properties.forEach((property) => {
    if (obj[property] !== null) {
      if (namespace) {
        formKey = namespace + '[' + property + ']'
      } else {
        formKey = property
      }

      // if the property is an object, but not a File, use recursivity.
      if (!fd.has(formKey)) {
        if (typeof obj[property] === 'boolean') {
          fd.append(formKey, obj[property] ? 1 : 0)
        } else if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString())
        } else if (obj[property] instanceof File) {
          fd.append(formKey, obj[property])
        } else if (typeof obj[property] === 'object') {
          toFormData(obj[property], fd, formKey)
        } else if (
          (typeof obj[property] === 'string' &&
            obj[property].trim().length > 0) ||
          typeof obj[property] === 'number'
        ) {
          fd.append(formKey, obj[property])
        }
      }
    }
  })

  return fd
}
