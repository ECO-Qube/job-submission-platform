import {
  Button,
  Flex, FormControl,
  FormLabel, NumberDecrementStepper,
  NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Select, Spacer, StackDivider,
  useToast, VStack
} from "@chakra-ui/react";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import {useState} from "react";

const WorkloadsGeneration = () => {
  const toast = useToast();
  const [jobLength, setJobLength] = useState(5);
  const [cpuTarget, setCpuTarget] = useState(5);
  const [cpuCount, setCpuCount] = useState(1);
  const [workloadType, setWorkloadType] = useState("");

  const spawnWorkload = useMutation(() => {
    return axios.post('http://localhost:8080/api/v1/workloads', {"jobLength": jobLength, "cpuTarget": cpuTarget, "cpuCount": cpuCount, "workloadType": workloadType})
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
        <NumberInput defaultValue={5} min={1} max={100} onChange={(value) => setJobLength(Number(value))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormLabel>CPU target [%]</FormLabel>
        <NumberInput defaultValue={5} min={1} max={100} step={5} onChange={(value) => setCpuTarget(Number(value))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormLabel>Workers count</FormLabel>
        <NumberInput defaultValue={1} min={1} step={1} onChange={(value) => setCpuCount(Number(value))}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

        <FormLabel>Workload type</FormLabel>
        <Select defaultValue={''} onChange={(value) => setWorkloadType(value.target.value)}>
          <option value=''>General-purpose</option>
          <option value='cpu'>CPU-intensive</option>
          <option value='memory'>Memory-intensive</option>
          <option value='storage'>Storage-intensive</option>
        </Select>

        <Button size="sm" colorScheme='green' variant='solid' onClick={() => spawnWorkload.mutate()}>
          Spawn workload
        </Button>
        <Button size="sm" colorScheme='red' variant='solid' onClick={() => deletePendingWorkload.mutate()}>
          Delete pending workload
        </Button>
        <Button size="sm" colorScheme='gray' variant='solid' onClick={() => clearPendingWorkload.mutate()}>
          Clear all completed workloads
        </Button>
      </VStack>
    </FormControl>);
}

export default WorkloadsGeneration;