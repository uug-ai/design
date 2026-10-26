package main

import (
	"reflect"
	"testing"
)

func TestNginxArgs(t *testing.T) {
	want := []string{"nginx", "-c", "/etc/nginx/nginx.conf", "-e", "/dev/stderr", "-g", "daemon off;"}
	if !reflect.DeepEqual(nginxArgs(), want) {
		t.Fatalf("unexpected nginx invocation: %q", nginxArgs())
	}
}
