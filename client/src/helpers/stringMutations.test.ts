import { titleCase, shortenedAddress } from './stringMutations'

describe('stringMutations', () => {
  describe('#titleCase', () => {
    it('returns the correct title case is there is only one word', () => {
      const input = 'promie'
      const result = 'Promie'

      expect(titleCase(input)).toBe(result)
    })

    it('returns the correct title case if there are multiple words capitalize', () => {
      const input = 'PROMIE YUTASANE'
      const result = 'Promie Yutasane'

      expect(titleCase(input)).toBe(result)
    })

    it('does not return anything if an empty string is passed in', () => {
      const input = ''
      const result = ''

      expect(titleCase(input)).toBe(result)
    })
  })

  describe('#shortenedAddress', () => {
    it('returns the shortened address if the input has the correct address', () => {
      const input = '0x769ec63ba1ac243450f29a0df44e790be632715f'
      const result = '0x769ec63b...0be632715f'

      expect(shortenedAddress(input)).toBe(result)
    })

    it('does not return the shortened address if the input is empty', () => {
      const input = ''
      const result = undefined

      expect(shortenedAddress(input)).toBe(result)
    })
  })
})
