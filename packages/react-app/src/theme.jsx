
import { extendTheme } from '@chakra-ui/react'

export const dMoonTheme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "white",
        color: "black",
        fontFamily: 'Ubuntu',
      },
      "h1, h2, h3, h4": {
      },
      // styles for the `a`
      a: {
        color: "gray.700",
        transition: "color 0.2s ease",
        _hover: {
          color: "yellow.400"
        },
      },
    },
  },
  components: {
    Heading: {
      baseStyle: {
        fontFamily: 'Ubuntu mono',
        color: 'gray.400',
        lineHeight: 1.2
      },
      // Styles for the size variations
      sizes: {
        xl: {
          mt: 4,
          mb: 3
        },
        "2xl": {
          mt: 4,
          mb: 4
        }
      },
      // Styles for the visual style variations
      variants: {},
      // The default `size` or `variant` values
      defaultProps: {},
    },
  }
})
