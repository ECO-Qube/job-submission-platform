import {Button, Flex} from "@chakra-ui/react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";

const WorkloadsGeneration = () => {
   const spawnWorkload = useMutation(() => {
      return axios.post('http://localhost:8080/api/v1/workloads')
    });

  return <Flex
    direction="column"
    justifyContent="center"
    rowGap={4}
  >
    <Button size="sm" colorScheme='teal' variant='solid' onClick={() => spawnWorkload.mutate()}>
      Spawn workload
    </Button>
    <Button size="sm" colorScheme='teal' variant='solid'>
      Delete pending workload
    </Button>
    <Button size="sm" colorScheme='teal' variant='solid'>
      Clear all completed workloads
    </Button>
  </Flex>;
}

export default WorkloadsGeneration;