import {Button, Flex} from "@chakra-ui/react";

const WorkloadsGeneration = () => {
  return <Flex
    direction="column"
    justifyContent="center"
    rowGap={4}
  >
    <Button colorScheme='teal' variant='solid'>
      Spawn workload
    </Button>
    <Button colorScheme='teal' variant='solid'>
      Delete pending workload
    </Button>
    <Button colorScheme='teal' variant='solid'>
      Spawn workload
    </Button>
  </Flex>
}

export default WorkloadsGeneration;