
import { extendTheme } from '@chakra-ui/react'

export const dMoonTheme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "black",
        color: "white",
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
          mt: "50px",
          mb: 3
        },
        "2xl": {
          mt: "50px",
          mb: 4
        }
      },
      // Styles for the visual style variations
      variants: {},
      // The default `size` or `variant` values
      defaultProps: {},
    },
    Button: {
      baseStyle: {
        backgroundColor: "wheat",
        borderRadius: 0,
        mb: 3
      }
    }
  }
})
