# Job Submission Platform
## Development setup
1. Create a cluster as detailed in the [CAPD setup](https://git.helio.dev/eco-qube/capi-gce-demo/-/blob/main/docker/README.md).
2. Update the kubeconfig of the target-exporter service with the newly created cluster's kubeconfig, 
e.g. in `target-exporter/charts/target-exporter/ecoqube-dev.kubeconfig`. 
3. Set the CLI arguments for target-exporter in your IDE, e.g.:
```
--kubeconfig=charts/target-exporter/ecoqube-dev.kubeconfig
--cors-disabled=true
--prometheus-address=localhost:9090
```
4. Port-forward the Prometheus server, e.g.
```bash
kubectl port-forward -n monitoring prometheus-deployment-74c5c98775-bmlv7 9090:9090
```
5. Update the target configuration with the node names of the newly created cluster, e.g. `kubectl get nodes`
```yaml
targets:
  ecoqube-dev-default-worker-topo-ldx7z-6df846f5c4-426vw: 20
  ecoqube-dev-default-worker-topo-ldx7z-6df846f5c4-jkmkf: 30
  ecoqube-dev-default-worker-topo-ldx7z-6df846f5c4-qglpc: 50
```
6. Start the target-exporter service as a process, e.g. `go run main.go` or through the IDE
7. Start the job submission platform with `yarn start`