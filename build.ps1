Remove-Item ".\dist\*" -Force

# hide-it.js
Write-Output "Miniying hide-it.js..."

Add-Type -AssemblyName System.Web
$EncodedContent = [System.Web.HttpUtility]::UrlEncode((Get-Content -Path "src\hide-it.js" -Raw))

$Response = Invoke-RestMethod -Uri "https://www.toptal.com/developers/javascript-minifier/api/raw" `
    -Method Post `
    -Body "input=$EncodedContent" `
    -ContentType "application/x-www-form-urlencoded"
[System.IO.File]::WriteAllText("dist/hide-it.min.js", $Response, (New-Object System.Text.UTF8Encoding $False))

Copy-Item "src\hide-it.js" -Destination "dist\hide-it.js"

# hide-it.css
Write-Output "Miniying hide-it.css..."

Add-Type -AssemblyName System.Web
$EncodedContent = [System.Web.HttpUtility]::UrlEncode((Get-Content -Path "src\hide-it.css" -Raw))

$Response = Invoke-RestMethod -Uri "https://www.toptal.com/developers/cssminifier/api/raw" `
    -Method Post `
    -Body "input=$EncodedContent" `
    -ContentType "application/x-www-form-urlencoded"
[System.IO.File]::WriteAllText("dist/hide-it.min.css", $Response, (New-Object System.Text.UTF8Encoding $False))

Copy-Item "src\hide-it.css" -Destination "dist\hide-it.css"

Write-Output "Success."