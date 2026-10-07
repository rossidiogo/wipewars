param([Parameter(Mandatory)][string]$Name,[int]$Expect=1,[int]$Colors=24,[int]$Floor=0,[int]$Canvas=0)
# Take the newest image the Gemini app downloaded (finished .jpg or still-named .tmp) from Downloads, move it to art_gen/out and clean it.
$dl="$env:USERPROFILE\Downloads"
$f=Get-ChildItem $dl -File -Force | Where-Object { $_.Name -like 'Gemini_Generated_Image_*.jpg' -or $_.Extension -eq '.tmp' } | Where-Object { $_.Length -gt 100000 } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if(-not $f){ Write-Output "no download found"; exit 1 }
$dst=Join-Path (Split-Path -Parent $PSScriptRoot) "out\$Name.jpg"
Copy-Item $f.FullName $dst -Force
try { Remove-Item $f.FullName -Force -ErrorAction Stop } catch {}
& "$PSScriptRoot\fetch.ps1" -Name $Name -Expect $Expect -Colors $Colors -Floor $Floor -Canvas $Canvas
