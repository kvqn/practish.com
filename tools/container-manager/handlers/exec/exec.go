package exec

import (
	"container-manager/utils"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

type requestBody struct {
	ContainerName string `json:"container_name"`
	Command       string `json:"command"`
}

// type responseBody struct {
// 	Stdout string `json:"stdout"`
// 	Stderr string `json:"stderr"`
// }

// responseBody is not required because we are not doing any processing on the response

func Handler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var reqBody requestBody
	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	//TODO: input validation

	fmt.Println("Container: ", reqBody.ContainerName)
	fmt.Println("Command: ", string(reqBody.Command))
	endpoint := "http://" + reqBody.ContainerName + ":8080/run"

	req, err := http.NewRequest("POST", endpoint, strings.NewReader(reqBody.Command))
	if err != nil {
		http.Error(w, "Failed 1 "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp, err := utils.HttpClient.Do(req)
	if err != nil {
		http.Error(w, "Failed 2 "+err.Error(), http.StatusInternalServerError)
		return
	}

	resp_body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed 3 "+err.Error(), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(resp_body)
	if err != nil {
		http.Error(w, "Failed 4 "+err.Error(), http.StatusInternalServerError)
		return
	}

}
