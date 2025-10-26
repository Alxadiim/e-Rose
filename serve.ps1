# Simple helper to serve the current folder with Python's http.server
# Usage: ./serve.ps1
$port = 8000
Write-Host "Starting static server on http://localhost:$port ..."
py -3 -m http.server $port
