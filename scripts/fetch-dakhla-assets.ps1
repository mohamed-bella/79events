$ErrorActionPreference = 'Stop'
$baseUrl = 'https://www.dakhlaevents.ma'
$destination = Join-Path $PSScriptRoot '..\public\images\dakhla-reference'
New-Item -ItemType Directory -Force -Path $destination | Out-Null

$assets = @{
  'hero-event.jpg' = '/assets/hero-event-BHGr-Zg7.jpg'
  'wedding-beach.jpg' = '/assets/wedding-beach-DZnVfONK.jpg'
  'gala-event.jpg' = '/assets/gala-event-C8A0cwYO.jpg'
  'desert-dinner.jpg' = '/assets/desert-dinner-C3CV1GM2.jpg'
  'corporate-event.jpg' = '/assets/corporate-event-D81tUcJu.jpg'
  'wedding-ceremony.jpg' = '/assets/wedding-ceremony-BVPvtSAF.jpg'
  'technical-setup.jpg' = '/assets/technical-setup-e9CXFYxy.jpg'
  'private-dinner.jpg' = '/assets/private-dinner-DkFRSaMF.jpg'
  'favicon.png' = '/favicon.png'
}

foreach ($name in $assets.Keys) {
  $target = Join-Path $destination $name
  & curl.exe --fail --location --silent --show-error --retry 2 --output $target "$baseUrl$($assets[$name])"
  if ($LASTEXITCODE -ne 0) { throw "Failed to fetch $name" }
  $size = (Get-Item -LiteralPath $target).Length
  if ($size -lt 1000) { throw "Downloaded asset $name is unexpectedly small" }
  Write-Output "$name ($size bytes)"
}
