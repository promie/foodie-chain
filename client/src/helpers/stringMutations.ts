const titleCase = (str: string): string => {
  return str.toLowerCase().replace(/(^|\s)(\w)/g, function (x) {
    return x.toUpperCase()
  })
}

const shortenedAddress = (str: string): string | undefined => {
  if (str === '') {
    return
  }

  return `${str.slice(0, 10)}...${str.slice(str.length - 10)}`
}

export { shortenedAddress, titleCase }
