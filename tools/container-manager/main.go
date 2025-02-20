package main

import (
	"container-manager/handlers/create"
	"container-manager/handlers/exec"
	"container-manager/handlers/is-running"
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/exec", exec.Handler)
	http.HandleFunc("/create", create.Handler)
	http.HandleFunc("/is-running", is_running.Handler)

	fmt.Println("Listening on port 4000")
	err := http.ListenAndServe(":4000", nil)
	if err != nil {
		panic("Failed to start server")
	}
}
