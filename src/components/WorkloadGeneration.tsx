import {
  Button,
  Flex, FormControl,
  FormLabel, NumberDecrementStepper,
  NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Spacer, StackDivider,
  useToast, VStack
} from "@chakra-ui/react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";

const WorkloadsGeneration = () => {
  const toast = useToast();

  const spawnWorkload = useMutation(() => {
    return axios.post('http://localhost:8080/api/v1/workloads')
  }, {
    onSuccess: () => {
      toast({
        title: 'Workload spawned successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  });
  const clearPendingWorkload = useMutation(() => {
    return axios.delete('http://localhost:8080/api/v1/workloads/completed')
  }, {
      onSuccess: (res) => {
        if (res.data.message === "success") {
          toast({
            title: 'Completed workloads cleared successfully.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Nothing was deleted.',
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
        }
      }
    });
  const deletePendingWorkload = useMutation(() => {
    return axios.delete('http://localhost:8080/api/v1/workloads/pending/last')
  }, {
      onSuccess: (res) => {
        if (res.data.message === "success") {
          toast({
            title: 'Pending workload deleted successfully.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            title: 'Nothing was deleted.',
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
        }
      }
    });

  return (<FormControl>
      <FormLabel>Job duration [minutes]</FormLabel>
      <VStack spacing={5} align='stretch'>
        <NumberInput defaultValue={5} min={1} max={99}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormLabel>CPU target [%]</FormLabel>
        <NumberInput defaultValue={5} min={1} max={99} step={5}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <Button size="sm" colorScheme='teal' variant='solid' onClick={() => spawnWorkload.mutate()}>
          Spawn workload
        </Button>
        <Button size="sm" colorScheme='teal' variant='solid' onClick={() => deletePendingWorkload.mutate()}>
          Delete pending workload
        </Button>
        <Button size="sm" colorScheme='teal' variant='solid' onClick={() => clearPendingWorkload.mutate()}>
          Clear all completed workloads
        </Button>
      </VStack>
    </FormControl>);
}

export default WorkloadsGeneration;