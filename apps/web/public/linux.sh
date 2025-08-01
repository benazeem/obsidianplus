	#!/bin/bash

	# Native messaging wrapper for Obsidian Plus
	LOG_FILE="/tmp/obsidian_plus_native.log"

	# Function to log messages
	log_message() {
	    echo "[$(date)] $1" >> "$LOG_FILE"
	}

	log_message "Native messaging host started"

	# Start the Obsidian Plus host in background
	cd %%HOSTLOCATION%%
	./@obsidianplushost > /dev/null 2>&1 &
	HOST_PID=$!

	log_message "Started @obsidianplushost with PID: $HOST_PID"

	# Wait a moment for the WebSocket server to start
	sleep 2

	# Function to send message to WebSocket and return response
	send_websocket_message() {
	    local message="$1"
	    log_message "Sending WebSocket message: $message"
	    
	    # Use curl to send WebSocket message (this is a simplified approach)
	    # You might need to implement proper WebSocket communication here
	    echo '{"status": "ok", "data": "WebSocket communication not fully implemented in wrapper"}'
	}

	# Native messaging protocol: read length, then message
	while IFS= read -r -n4 length_bytes; do
	    if [ ${#length_bytes} -eq 0 ]; then
		break
	    fi
	    
	    # Convert 4 bytes to length (little-endian)
	    length=$(printf '%d' "'${length_bytes:3}" "'${length_bytes:2}" "'${length_bytes:1}" "'${length_bytes:0}" | awk '{print $1 + $2*256 + $3*65536 + $4*16777216}')
	    
	    log_message "Reading message of length: $length"
	    
	    # Read the actual message
	    IFS= read -r -n"$length" message
	    
	    log_message "Received message: $message"
	    
	    # Process the message (forward to WebSocket server)
	    response=$(send_websocket_message "$message")
	    
	    log_message "Sending response: $response"
	    
	    # Send response back to Chrome
	    response_length=${#response}
	    printf "$(printf '\\%03o' $((response_length & 255)) $(((response_length >> 8) & 255)) $(((response_length >> 16) & 255)) $(((response_length >> 24) & 255)))"
	    printf "%s" "$response"
	done

	log_message "Native messaging host shutting down"

	# Clean up: kill the background process
	if kill -0 "$HOST_PID" 2>/dev/null; then
	    kill "$HOST_PID"
	    log_message "Killed @obsidianplushost process"
	fi