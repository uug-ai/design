package main

import (
	"log"
	"os"
	"syscall"
)

func nginxArgs() []string {
	return []string{"nginx", "-c", "/etc/nginx/nginx.conf", "-e", "/dev/stderr", "-g", "daemon off;"}
}

func main() {
	// Replace the launcher so nginx receives shutdown signals directly.
	if err := syscall.Exec("/usr/sbin/nginx", nginxArgs(), os.Environ()); err != nil {
		log.Fatalf("start nginx: %v", err)
	}
}
