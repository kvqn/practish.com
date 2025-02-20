package create

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os/exec"
)

type request struct {
	Image         string `json:"image"`
	ContainerName string `json:"container_name"`
	VolumeMounts  []struct {
		HostPath      string `json:"host_path"`
		ContainerPath string `json:"container_path"`
	} `json:"volume_mounts"`
	EntryPoint string `json:"entry_point"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req request
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	var command string
	command = fmt.Sprintf("docker run -d --rm --name %s --entrypoint %s --net easyshell", req.ContainerName, req.EntryPoint)
	for _, volume := range req.VolumeMounts {
		command += fmt.Sprintf(" -v %s:%s", volume.HostPath, volume.ContainerPath)
	}
	command += fmt.Sprintf(" %s", req.Image)

	fmt.Println("Command: ", command)

	cmd := exec.Command("sh", "-c", command)

	err = cmd.Run()
	if err != nil {
		http.Error(w, "Failed"+err.Error(), http.StatusInternalServerError)
		return
	}
}
