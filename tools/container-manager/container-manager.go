package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

type Response struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
}

var client *http.Client

func handler(w http.ResponseWriter, r *http.Request) {

	if r.Method != "POST" {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	container_name := strings.TrimPrefix(r.URL.Path, "/")
	if container_name == "" {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}
	if strings.HasSuffix(container_name, "/") {
		container_name = container_name[:len(container_name)-1]
	}

	//TODO: check valid container name

	command, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	fmt.Println("Container: ", container_name)
	fmt.Println("Command: ", string(command))
	endpoint := "http://" + container_name + ":8080/run"

	req, err := http.NewRequest("POST", endpoint, strings.NewReader(string(command)))
	if err != nil {
		http.Error(w, "Failed", http.StatusInternalServerError)
		return
	}

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed", http.StatusInternalServerError)
		return
	}

	resp_body, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed", http.StatusInternalServerError)
		return
	}
	w.Write(resp_body)

}

func main() {
	client = &http.Client{}
	http.HandleFunc("/", handler)
	http.ListenAndServe(":4000", nil)
}
