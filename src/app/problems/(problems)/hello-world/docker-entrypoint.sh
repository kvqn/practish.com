#!/bin/sh

cd /app
source input.sh > output.txt

cmp -s output.txt expected-output.txt

exitcode=$?

if [ $exitcode -eq 0 ]; then
    echo "Test passed"
    exit 0
else
    echo "Test failed"
    exit 1
fi
