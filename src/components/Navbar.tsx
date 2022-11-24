import { EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  Link,
  Spacer,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { Logo } from "./Logo";

export const Navbar: React.FC = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  return (
    <Box as="section" pb={{ base: "12", md: "24" }}>
      <HStack
        justifyContent="flex-start"
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Box py={{ base: "4", lg: "5" }} width="100%">
          <HStack spacing="10" justify="space-between" px={2}>
            <Logo />
            {isDesktop ? (
              <Flex justify="space-between" flex="1">
                <ButtonGroup variant="link" spacing="8">
                  {["Product", "Pricing", "Resources", "Support"].map(
                    (item) => (
                      <Button key={item}>{item}</Button>
                    )
                  )}
                </ButtonGroup>
                <Spacer />
                <HStack spacing="3">
                  <Button
                    variant="ghost"
                    as="a"
                    href="https://app.metapage.io/sign-in"
                    aria-label="sign in"
                  >
                    {" "}
                    Sign in
                  </Button>

                  <Button
                    colorScheme="blue"
                    as="a"
                    href="https://app.metapage.io/sign-up"
                    aria-label="sign up"
                  >
                    {" "}
                    Sign up
                  </Button>




                </HStack>
              </Flex>
            ) : (
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};
