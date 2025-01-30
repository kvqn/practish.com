package main

import (
	"encoding/json"
	"io"
	"os"
	"os/exec"
)

type Output struct {
	Stdout      string `json:"stdout"`
	Stderr      string `json:"stderr"`
	ExitCode    int    `json:"exit_code"`
	FsZipBase64 string `json:"fs_zip_base64"`
}

func FsZipBase64() string {
	out, err := exec.Command("sh", "-c", "zip -r - /home | base64").Output()
	if err != nil {
		panic(err)
	}
	return string(out)
}

func main() {
	cmd := exec.Command("sh", "/input.sh")

	stdoutPipe, err := cmd.StdoutPipe()
	if err != nil {
		panic(err)
	}

	stderrPipe, err := cmd.StderrPipe()
	if err != nil {
		panic(err)
	}

	cmd.Run()

	exitCode := cmd.ProcessState.ExitCode()

	stdoutBytes, err := io.ReadAll(stdoutPipe)
	if err != nil {
		panic(err)
	}
	stdout := string(stdoutBytes)

	stderrBytes, err := io.ReadAll(stderrPipe)
	if err != nil {
		panic(err)
	}
	stderr := string(stderrBytes)

	fs := FsZipBase64()

	output := Output{
		Stdout:      stdout,
		Stderr:      stderr,
		ExitCode:    exitCode,
		FsZipBase64: fs,
	}

	f, err := os.OpenFile("/output.json", os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}

	json.NewEncoder(f).Encode(output)
	f.Close()
}
