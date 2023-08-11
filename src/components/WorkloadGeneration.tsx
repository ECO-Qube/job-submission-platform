import {
  Button,
  Flex, FormControl,
  FormLabel, HStack, NumberDecrementStepper,
  NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Select, Spacer, StackDivider, Switch,
  useToast, VStack
} from "@chakra-ui/react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {logDOM} from "@testing-library/react";
import axios from "axios";
import useDidMountEffect from "hooks/useDidMountEffect";
import {MutableRefObject, useEffect, useRef, useState} from "react";

type SelfDrivingGetResponse = {
  enabled: boolean;
}

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
  const [selfDrivingIsChecked, setSelfDrivingIsChecked] = useState(false);
  const [selfDrivingSwitchDisabled, setSelfDrivingSwitchDisabled] = useState(true);
  const [selfDrivingMutationData, setSelfDrivingMutationData] = useState<SelfDrivingGetResponse | null>(null);

  const switchSelfDrivingMode = useMutation(() => {
    console.log("mutating...", selfDrivingMutationData);
    return axios.put('http://localhost:8080/api/v1/self-driving', selfDrivingMutationData)
  });

  const [initialRender, setInitialRender] = useState(true);

  const selfDrivingGetQuery = useQuery<SelfDrivingGetResponse, Error>(['self-driving-enabled'], () => {
    return axios.get('http://localhost:8080/api/v1/self-driving').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting switch to: ", data.enabled);
      setSelfDrivingIsChecked(data?.enabled ?? false);
      setSelfDrivingSwitchDisabled(false);
    },
    onError: (err) => {
      setSelfDrivingIsChecked(false);
      setSelfDrivingSwitchDisabled(false);
    },
  });

  useEffect(() => {
    console.log("for some reason, isChecked is", selfDrivingIsChecked);
  }, [selfDrivingIsChecked]);

  useEffect(() => {
    selfDrivingGetQuery.refetch().then(r => setInitialRender(false));
  }, []);

  useEffect(() => {
    // Don't mutate on initial render
    if (!initialRender) {
      switchSelfDrivingMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = selfDrivingIsChecked ? 'Self-driving mode enabled.' : 'Self-driving mode disabled.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setSelfDrivingSwitchDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setSelfDrivingIsChecked(selfDrivingMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = selfDrivingIsChecked ? 'enabling' : 'disabling';
          setSelfDrivingIsChecked(false);
          toast({
            title: `Error ${title} self-driving mode.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setSelfDrivingSwitchDisabled(false);
        });
    }
  }, [selfDrivingMutationData]); // since user clicked the switch, selfDrivingMutationDAta will have changed, so the mutation needs to be fired

  return (<FormControl>
      <VStack spacing={5} align='stretch'>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='self-driving-mode' mb='0'>
            Enable self-driving mode
          </FormLabel>
          <Switch id='self-driving-mode' isDisabled={selfDrivingSwitchDisabled} isChecked={selfDrivingIsChecked} onChange={() => {
            console.log("current switch value", selfDrivingIsChecked);
            setSelfDrivingSwitchDisabled(true); // disable the switch until the mutation is done
            setSelfDrivingMutationData({enabled: !selfDrivingIsChecked}); // set the data to be sent to the mutation
            setSelfDrivingIsChecked(!selfDrivingIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        <FormLabel>Job duration [minutes]</FormLabel>
        <NumberInput defaultValue={5} min={1} max={100}>
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