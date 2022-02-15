export function phPhoneFormat(value) {
  if (value === null) {
    return true
  }
  const regex = /\+639[0-9]{9}/
  return regex.test(value)
}

export function isImageFormat(value) {
  if (value === null) {
    return true
  }
  switch (value.type) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/gif':
      return true
    default:
      return false
  }
}

export function isIconFormat(value) {
  if (value === null) {
    return true
  }
  switch (value.type) {
    case 'image/x-icon':
      return true
    default:
      return false
  }
}

export function isFileSizeValid(value, size) {
  if (value === null) {
    return true
  }

  if (value.size / size > size) {
    return false
  }
  return true
}

export function isUsernameValid(value) {
  if (value === null) {
    return true
  }

  return /^[a-z0-9_.]{6,15}$/gim.test(value)
}
