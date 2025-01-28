package main

import (
	"bufio"
	"encoding/json"
	"io"
	"math/rand"
	"net/http"
	"os/exec"
	"strings"
	"time"
)

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var (
	cmd    *exec.Cmd
	stdin  io.WriteCloser
	stdout io.ReadCloser
	stderr io.ReadCloser
	locked bool
)

type Response struct {
	Stdout string `json:"stdout"`
	Stderr string `json:"stderr"`
}

func RandomDelimiter() string {
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, 128)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func run(w http.ResponseWriter, r *http.Request) {
	if locked {
		http.Error(w, "Locked", http.StatusLocked)
		return
	}
	locked = true

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		locked = false
		return
	}

	input := string(body)
	delimiter := RandomDelimiter()

	var read_stdout, read_stderr string
	stdoutReader := bufio.NewReader(stdout)
	stderrReader := bufio.NewReader(stderr)

	stdin.Write([]byte(input + "\n"))
	stdin.Write([]byte("echo " + delimiter + "\n"))
	stdin.Write([]byte("echo >&2 " + delimiter + "\n"))

	for {
		_read_stdout, err := stdoutReader.ReadByte()
		if err != nil {
			panic(err)
		}

		if _read_stdout != 0 {
			read_stdout += string(_read_stdout)
			if strings.HasSuffix(read_stdout, delimiter+"\n") {
				read_stdout = read_stdout[:len(read_stdout)-len(delimiter)-1]
				break
			}
		}

	}

	for {
		_read_stderr, err := stderrReader.ReadByte()
		if err != nil {
			panic(err)
		}

		if _read_stderr != 0 {
			read_stderr += string(_read_stderr)
			if strings.HasSuffix(read_stderr, delimiter+"\n") {
				read_stderr = read_stderr[:len(read_stderr)-len(delimiter)-1]
				break
			}
		}

	}

	response := Response{
		Stdout: read_stdout,
		Stderr: read_stderr,
	}

	json.NewEncoder(w).Encode(response)
	locked = false
}

func main() {
	cmd = exec.Command("sh")

	stdin, _ = cmd.StdinPipe()
	stdout, _ = cmd.StdoutPipe()
	stderr, _ = cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		panic(err)
	}

	go func() {
		cmd.Wait()
		panic("Subprocess Ended")
	}()

	http.HandleFunc("/run", run)
	http.ListenAndServe(":8080", nil)
}
