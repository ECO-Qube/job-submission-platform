import {
  Button, FormControl,
  FormLabel, NumberDecrementStepper,
  NumberIncrementStepper, NumberInput,
  NumberInputField,
  NumberInputStepper, Select, Switch,
  useToast, VStack
} from "@chakra-ui/react";
import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "axios";
import {SyntheticEvent, useEffect, useState} from "react";
import CSVReader from "./CSVReader";

type Enabled = {
  enabled: boolean;
}

type SelfDrivingGetResponse = {
} & Enabled;

type TawaGetResponse = {
} & Enabled;

type SchedulableGetResponse = {
} & Enabled;

type AutomaticJobSpawnGetResponse = {
} & Enabled;

type ServerOnOffGetResponse = {
} & Enabled;

type ReduceTargetsGetResponse = {
} & Enabled;

const WorkloadsGeneration = () => {
  const toast = useToast();
  const [jobLength, setJobLength] = useState(5);
  const [cpuTarget, setCpuTarget] = useState(10);
  const [minCpuLimit, setMinCpuLimit] = useState(5);
  const [cpuCount, setCpuCount] = useState(1);
  const [workloadType, setWorkloadType] = useState("");
  const [scenario, setWorkingScenario] = useState<Record<string, number>>();
  const [jobScenario, setJobScenario] = useState<Array<JobScenarioRequest> | null>(null);

  const spawnWorkload = useMutation(() => {
    return axios.post(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/workloads', {
      "jobLength": jobLength,
      "cpuTarget": cpuTarget,
      "minCpuLimit": minCpuLimit,
      "cpuCount": cpuCount,
      "workloadType": workloadType,
      "scenario": scenario,
    })
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
    return axios.delete(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/workloads/completed')
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
    return axios.delete(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/workloads/pending/last')
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
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/self-driving', selfDrivingMutationData)
  });

  const [tawaIsChecked, setTawaIsChecked] = useState(false);
  const [tawaSwitchDisabled, setTawaSwitchDisabled] = useState(true);
  const [tawaMutationData, setTawaMutationData] = useState<TawaGetResponse | null>(null);

  const switchTawaMode = useMutation(() => {
    console.log("mutating...", tawaMutationData);
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/tawa', tawaMutationData)
  });

  // Create switch for schedulable mode
  const [schedulableIsChecked, setSchedulableIsChecked] = useState(false);
  const [schedulableSwitchDisabled, setSchedulableSwitchDisabled] = useState(true);
  const [schedulableMutationData, setSchedulableMutationData] = useState<SchedulableGetResponse | null>(null);

  const switchSchedulableMode = useMutation(() => {
    console.log("mutating...", schedulableMutationData);
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/schedulable', schedulableMutationData)
  });

  const [initialRender, setInitialRender] = useState(true);

  const selfDrivingGetQuery = useQuery<SelfDrivingGetResponse, Error>(['self-driving-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/self-driving').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting self-driving switch to: ", data.enabled);
      setSelfDrivingIsChecked(data?.enabled ?? false);
      setSelfDrivingSwitchDisabled(false);
    },
    onError: (err) => {
      setSelfDrivingIsChecked(false);
      setSelfDrivingSwitchDisabled(false);
    },
  });

  const tawaGetQuery = useQuery<TawaGetResponse, Error>(['tawa-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/tawa').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting tawa switch to: ", data.enabled);
      setTawaIsChecked(data?.enabled ?? false);
      setTawaSwitchDisabled(false);
    },
    onError: (err) => {
      setTawaIsChecked(false);
      setTawaSwitchDisabled(false);
    },
  });

  const schedulableGetQuery = useQuery<SchedulableGetResponse, Error>(['schedulable-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/schedulable').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting schedulable switch to: ", data.enabled);
      setSchedulableIsChecked(data?.enabled ?? false);
      setSchedulableSwitchDisabled(false);
    },
    onError: (err) => {
      setSchedulableIsChecked(false);
      setSchedulableSwitchDisabled(false);
    },
  });

  const [automaticJobSpawnIsChecked, setAutomaticJobSpawnIsChecked] = useState(false);
  const [automaticJobSpawnDisabled, setAutomaticJobSpawnDisabled] = useState(true);
  const [automaticJobSpawnMutationData, setAutomaticJobSpawnMutationData] = useState<AutomaticJobSpawnGetResponse | null>(null);

  const automaticJobSpawnGetQuery = useQuery<AutomaticJobSpawnGetResponse, Error>(['automatic-job-spawn-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/automatic-job-spawn').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting automatic job spawn switch to: ", data.enabled);
      setAutomaticJobSpawnIsChecked(data?.enabled ?? false);
      setAutomaticJobSpawnDisabled(false);
    },
    onError: (err) => {
      setAutomaticJobSpawnIsChecked(false);
      setAutomaticJobSpawnDisabled(false);
    },
  });

  const automaticJobSpawnMode = useMutation(() => {
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/automatic-job-spawn', automaticJobSpawnMutationData);
  });

  const spawnJobScenario = useMutation(() => {
    return axios.post(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/job-scenario', jobScenario);
  }, {
    onSuccess: () => {
      toast({
        title: 'Job scenario spawned successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'Error while spawning job scenario.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  });

  const [serverOnOffIsChecked, setServerOnOffIsChecked] = useState(false);
  const [serverOnOffDisabled, setServerOnOffDisabled] = useState(true);
  const [serverOnOffMutationData, setServerOnOffMutationData] = useState<ServerOnOffGetResponse | null>(null);

  const serverOnOffGetQuery = useQuery<ServerOnOffGetResponse, Error>(['server-on-off-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/server-on-off').then((res) => res.data);
  }, {
    enabled: false,
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting server on/off switch to: ", data.enabled);
      setServerOnOffIsChecked(data?.enabled ?? false);
      setServerOnOffDisabled(false);
    },
    onError: (err) => {
      setServerOnOffIsChecked(false);
      setServerOnOffDisabled(false);
    },
  });

  const serverOnOffMode = useMutation(() => {
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/server-on-off', serverOnOffMutationData);
  });

  const [reduceTargetsIsChecked, setReduceTargetsIsChecked] = useState(true);
  const [reduceTargetsDisabled, setReduceTargetsDisabled] = useState(true);
  const [reduceTargetsMutationData, setReduceTargetsMutationData] = useState<ReduceTargetsGetResponse | null>(null);

  const reduceTargetsGetQuery = useQuery<ReduceTargetsGetResponse, Error>(['reduce-targets-enabled'], () => {
    return axios.get(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/reduce-targets').then((res) => res.data);
  }, {
    onSuccess: (data) => {
      // Set the switch to the value of the response
      console.log("setting reduce targets switch to: ", data.enabled);
      setReduceTargetsIsChecked(data?.enabled ?? false);
      setReduceTargetsDisabled(false);
    },
    onError: (err) => {
      setReduceTargetsIsChecked(false);
      setReduceTargetsDisabled(false);
    },
  });

  const reduceTargetsMode = useMutation(() => {
    return axios.put(process.env.REACT_APP_TARGET_EXPORTER_URL+'/api/v1/reduce-targets', reduceTargetsMutationData);
  });

  useEffect(() => {
    selfDrivingGetQuery.refetch().then(r => setInitialRender(false));
    tawaGetQuery.refetch().then(r => setInitialRender(false));
    schedulableGetQuery.refetch().then(r => setInitialRender(false));
    automaticJobSpawnGetQuery.refetch().then(r => setInitialRender(false));
    serverOnOffGetQuery.refetch().then(r => setInitialRender(false));
    reduceTargetsGetQuery.refetch().then(r => setInitialRender(false));
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

  useEffect(() => {
    // Don't mutate on initial render
    if (!initialRender) {
      switchTawaMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = tawaIsChecked ? 'TAWA mode enabled.' : 'TAWA mode disabled.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setTawaSwitchDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setTawaIsChecked(tawaMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = tawaIsChecked ? 'enabling' : 'disabling';
          setTawaIsChecked(false);
          toast({
            title: `Error ${title} TAWA mode.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setTawaSwitchDisabled(false);
        });
    }
  }, [tawaMutationData]); // since user clicked the switch, selfDrivingMutationDAta will have changed, so the mutation needs to be fired

  useEffect(() => {
    // Don't mutate on initial render
    if (!initialRender) {
      switchSchedulableMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = schedulableIsChecked ? 'Schedulable mode enabled.' : 'Schedulable mode disabled.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setSchedulableSwitchDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setSchedulableIsChecked(schedulableMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = schedulableIsChecked ? 'enabling' : 'disabling';
          setSchedulableIsChecked(false);
          toast({
            title: `Error ${title} schedulable mode.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setSchedulableSwitchDisabled(false);
        });
    }
  }, [schedulableMutationData]);

  useEffect(() => {
    if (!initialRender) {
      automaticJobSpawnMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = automaticJobSpawnIsChecked ? 'Automatic job spawn mode enabled.' : 'Automatic job spawn mode disabled.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setAutomaticJobSpawnDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setAutomaticJobSpawnIsChecked(automaticJobSpawnMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = schedulableIsChecked ? 'enabling' : 'disabling';
          setSchedulableIsChecked(false);
          toast({
            title: `Error ${title} schedulable mode.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setSchedulableSwitchDisabled(false);
        });
    }
  }, [automaticJobSpawnMutationData]);

  useEffect(() => {
    if (!initialRender) {
      serverOnOffMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = serverOnOffIsChecked ? 'Server turned on.' : 'Server turned off.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setServerOnOffDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setServerOnOffIsChecked(serverOnOffMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = serverOnOffIsChecked ? 'turning on' : 'turning off';
          setServerOnOffIsChecked(false);
          toast({
            title: `Error ${title} server.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setServerOnOffDisabled(false);
        });
    }
  }, [serverOnOffMutationData]);

  useEffect(() => {
    if (!initialRender) {
      reduceTargetsMode.mutateAsync()
        .then((res) => {
          if (res.data.message === "success") {
            const title = reduceTargetsIsChecked ? 'Automatic reduction of targets enabled.' : 'Automatic reduction of targets disabled.';
            toast({
              title: title,
              status: 'success',
              duration: 2000,
              isClosable: true,
            });
            // Since the mutation was successful, the switch can be enabled again
            setReduceTargetsDisabled(false);
            // Since the mutation was successful, the switch is set to the value of the mutation
            setReduceTargetsIsChecked(reduceTargetsMutationData?.enabled ?? false);
          }
        })
        .catch((err) => {
          const title = reduceTargetsIsChecked ? 'enabling' : 'disabling';
          setReduceTargetsIsChecked(false);
          toast({
            title: `Error ${title} automatic reduction of targets.`,
            status: 'warning',
            duration: 2000,
            isClosable: true,
          });
          console.log(err);
          // User can try again, but value stays as before
          setReduceTargetsDisabled(false);
        });
    }
  }, [reduceTargetsMutationData]);

  const handleWorkingScenarioUpload = (data: Array<Array<string>>) => {
    const scenarioPayload: Record<string, number> = {};
    for (const row of data.slice(1)) {
      if (row[0] == null || row[1] == null) continue;
      scenarioPayload[`${row[0]}`] = parseFloat(row[1].trim());
    }
    console.log(scenarioPayload);
    setWorkingScenario(scenarioPayload);
  }

  const handleJobScenarioUpload = (data: Array<Array<string>>) => {
    const scenarioPayload: Array<JobScenarioRequest> = [];
    for (const row of data.slice(1)) {
      for (const cell of row) {
        if (cell == null) {
          toast({
            title: 'Invalid CSV file.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      }
    }
    for (const row of data.slice(1)) {
      const jobLength = parseInt(row[1]!.trim());
      const minJobLength = parseInt(row[2]!.trim());
      const jobTarget = parseInt(row[3]!.trim());
      const workersCount = parseInt(row[4]!.trim());
      const startDate = new Date(row[5]!.trim());
      scenarioPayload.push({
        jobName: row[0]!.trim()+Math.random().toString(36).slice(2, 7),
        jobLength: jobLength,
        minJobTarget: minJobLength,
        jobTarget: jobTarget,
        workersCount: workersCount,
        startDate: startDate,
      });
    }
    console.log(scenarioPayload);
    setJobScenario(scenarioPayload);
  }

  const handleJobScenarioSpawn = () => {
    spawnJobScenario.mutate();
  }

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
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='schedulable-mode' mb='0'>
            Enable schedulable mode
          </FormLabel>
          <Switch id='schedulable-mode' isDisabled={schedulableSwitchDisabled} isChecked={schedulableIsChecked} onChange={() => {
            console.log("current switch value", schedulableIsChecked);
            setSchedulableSwitchDisabled(true); // disable the switch until the mutation is done
            setSchedulableMutationData({enabled: !schedulableIsChecked}); // set the data to be sent to the mutation
            setSchedulableIsChecked(!schedulableIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='tawa-mode' mb='0'>
            Enable TAWA mode
          </FormLabel>
          <Switch id='tawa-mode' isDisabled={tawaSwitchDisabled} isChecked={tawaIsChecked} onChange={() => {
            console.log("current switch value", tawaIsChecked);
            setTawaSwitchDisabled(true); // disable the switch until the mutation is done
            setTawaMutationData({enabled: !tawaIsChecked}); // set the data to be sent to the mutation
            setTawaIsChecked(!tawaIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='automatic-job-spawn' mb='0'>
            Enable automatic job spawn mode
          </FormLabel>
          <Switch id='automatic-job-spawn' isDisabled={automaticJobSpawnDisabled} isChecked={automaticJobSpawnIsChecked} onChange={() => {
            setAutomaticJobSpawnDisabled(true); // disable the switch until the mutation is done
            setAutomaticJobSpawnMutationData({enabled: !automaticJobSpawnIsChecked}); // set the data to be sent to the mutation
            setAutomaticJobSpawnIsChecked(!automaticJobSpawnIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='server-on-off' mb='0'>
            Enable server on/off
          </FormLabel>
          <Switch id='server-on-off' isDisabled={serverOnOffDisabled} isChecked={serverOnOffIsChecked} onChange={() => {
            setServerOnOffDisabled(true); // disable the switch until the mutation is done
            setServerOnOffMutationData({enabled: !serverOnOffIsChecked}); // set the data to be sent to the mutation
            setServerOnOffIsChecked(!serverOnOffIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        <FormControl display='flex' alignItems='center'>
          <FormLabel htmlFor='reduce-targets' mb='0'>
            Enable automatic reduction of targets to lower setpoints
          </FormLabel>
          <Switch id='reduce-targets' isDisabled={reduceTargetsDisabled} isChecked={reduceTargetsIsChecked} onChange={() => {
            setReduceTargetsDisabled(true); // disable the switch until the mutation is done
            setReduceTargetsMutationData({enabled: !reduceTargetsIsChecked}); // set the data to be sent to the mutation
            setReduceTargetsIsChecked(!reduceTargetsIsChecked); // set the state of the switch to the opposite of the current state
          }}
          />
        </FormControl>
        {
          tawaIsChecked &&
            <>
              <FormLabel>Working Scenario CSV upload (optional)</FormLabel>
              <CSVReader onUploadAccepted={handleWorkingScenarioUpload} onUploadRemoved={() => setWorkingScenario(undefined)} />
            </>
        }
        {
          !automaticJobSpawnIsChecked &&
            <>
              <FormLabel>Job Scenario CSV upload (optional) </FormLabel>
              <CSVReader onUploadAccepted={handleJobScenarioUpload} onUploadRemoved={() => setJobScenario(null)} />
              <Button size="sm" colorScheme='green' variant='solid' disabled={jobScenario == null} onClick={handleJobScenarioSpawn}>Execute job scenario</Button>
              <FormLabel>Job duration [minutes]</FormLabel>
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
                <FormLabel>Minimum guaranteed CPU limit [%]</FormLabel>
                <NumberInput defaultValue={5} min={1} max={100} step={5} onChange={(value) => setMinCpuLimit(Number(value))}>
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
            </>
        }
      </VStack>
    </FormControl>);
}

type JobScenarioRequest = {
  jobName: string;
  jobLength: number;
  minJobTarget: number;
  jobTarget: number;
  workersCount: number;
  startDate: Date;
};

export default WorkloadsGeneration;